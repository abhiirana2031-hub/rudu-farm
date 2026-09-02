/**
 * Core SMS Service
 * Manages phone normalization, idempotency, Firestore multi-tenant logging,
 * controlled retries (max 3), priority mapping, and dispatches to server backend.
 */

import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase/client';
import { DEFAULT_TENANT_ID, TENANT_COLLECTIONS } from '../../lib/firebase/firestore';
import {
  SendSmsRequest,
  SmsResponse,
  SmsNotificationRecord,
  TenantSmsSettings,
  DEFAULT_SMS_SETTINGS,
  SmsTemplateType,
} from './sms.types';
import { MASTER_SMS_TEMPLATES } from './sms.templates';

const MAX_RETRIES = 3;

// In-memory idempotency cache for fast client-side de-duplication
const sentReferencesCache = new Set<string>();

/**
 * Normalize phone numbers to 10-digit Indian numbers
 */
export const normalizePhoneNumber = (rawPhone: string): string | null => {
  if (!rawPhone) return null;
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) return digits;
  if (digits.length === 11 && digits.startsWith('0') && /^[6-9]\d{9}$/.test(digits.slice(1))) return digits.slice(1);
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]\d{9}$/.test(digits.slice(2))) return digits.slice(2);
  return null;
};

/**
 * Fetch tenant SMS settings
 */
export const getTenantSmsSettings = async (tenantId: string = DEFAULT_TENANT_ID): Promise<TenantSmsSettings> => {
  if (!db) {
    const cached = localStorage.getItem(`rudu_sms_settings_${tenantId}`);
    return cached ? JSON.parse(cached) : DEFAULT_SMS_SETTINGS;
  }

  try {
    const settingsRef = doc(db, 'tenants', tenantId, 'settings', 'sms');
    const snap = await getDoc(settingsRef);
    if (snap.exists()) {
      return { ...DEFAULT_SMS_SETTINGS, ...snap.data() } as TenantSmsSettings;
    }
  } catch (err) {
    console.warn('[SMSService] Error fetching settings:', err);
  }

  return DEFAULT_SMS_SETTINGS;
};

/**
 * Update tenant SMS settings
 */
export const updateTenantSmsSettings = async (
  tenantId: string = DEFAULT_TENANT_ID,
  settings: Partial<TenantSmsSettings>
): Promise<TenantSmsSettings> => {
  const current = await getTenantSmsSettings(tenantId);
  const updated: TenantSmsSettings = {
    ...current,
    ...settings,
    otpSms: true, // Mandatory security guard
    securityAlertsSms: true, // Mandatory security guard
    lastUpdated: new Date().toISOString(),
  };

  localStorage.setItem(`rudu_sms_settings_${tenantId}`, JSON.stringify(updated));

  if (db) {
    try {
      const settingsRef = doc(db, 'tenants', tenantId, 'settings', 'sms');
      await setDoc(settingsRef, updated, { merge: true });
    } catch (err) {
      console.warn('[SMSService] Error saving settings to Firestore:', err);
    }
  }

  return updated;
};

/**
 * Check if a template type is enabled for dispatch under current tenant settings
 */
export const isTemplateAllowed = (templateKey: SmsTemplateType, settings: TenantSmsSettings): boolean => {
  const def = MASTER_SMS_TEMPLATES[templateKey];
  if (def?.isMandatory) return true; // Mandatory security & OTP messages are always active

  if (!settings.smsEnabled) return false;

  switch (templateKey) {
    case 'MILK_COLLECTION':
      return settings.milkCollectionSms;
    case 'PAYMENT_SUCCESS':
    case 'SETTLEMENT_PROCESSED':
      return settings.paymentSms;
    case 'ADVANCE_CREATED':
      return settings.advanceSms;
    case 'LEDGER_STATEMENT':
      return settings.ledgerStatementSms;
    case 'MONTHLY_STATEMENT':
      return settings.monthlyStatementSms;
    case 'PAYMENT_REMINDER':
      return settings.paymentReminderSms;
    case 'RATE_CHANGE':
      return settings.rateChangeSms;
    case 'OPERATOR_LOGIN':
    case 'OPERATOR_SESSION_EXPIRING':
    case 'OPERATOR_SESSION_EXPIRED':
    case 'OPERATOR_SESSION_EXTENDED':
    case 'OPERATOR_FORCE_LOGOUT':
      return settings.operatorSessionSms;
    case 'UNUSUAL_COLLECTION_ALERT':
    case 'OPERATOR_SESSION_ALERT':
    case 'OPERATOR_MISSED_SESSION':
    case 'PAYMENT_ALERT':
      return settings.adminAlertsSms;
    default:
      return true;
  }
};

/**
 * Dispatch SMS request via backend API and maintain Firestore notification log
 */
export const dispatchSMS = async (request: SendSmsRequest): Promise<SmsResponse> => {
  const tenantId = request.tenantId || DEFAULT_TENANT_ID;
  const normalizedPhone = normalizePhoneNumber(request.phone);

  if (!normalizedPhone) {
    return {
      success: false,
      status: 'FAILED',
      error: 'Invalid recipient phone number',
      errorCode: 'SMS_INVALID_NUMBER',
    };
  }

  const templateDef = MASTER_SMS_TEMPLATES[request.template];
  const priority = request.priority || templateDef?.priority || 'NORMAL';

  // Check tenant settings
  const settings = await getTenantSmsSettings(tenantId);
  if (!isTemplateAllowed(request.template, settings)) {
    return {
      success: false,
      status: 'CANCELLED',
      error: `SMS notification for ${request.template} is disabled in tenant settings`,
      errorCode: 'SMS_CONFIGURATION_ERROR',
    };
  }

  // Idempotency check: prevent duplicate SMS
  if (request.referenceType && request.referenceId) {
    const idempotencyKey = `${tenantId}:${request.referenceType}:${request.referenceId}`;
    if (sentReferencesCache.has(idempotencyKey)) {
      console.warn(`[SMSService] Prevented duplicate SMS for reference: ${idempotencyKey}`);
      return {
        success: true,
        status: 'SENT',
        message: 'SMS already dispatched (idempotent)',
      };
    }
    sentReferencesCache.add(idempotencyKey);
  }

  const notificationId = `NOTIF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  // Interpolate message if not provided
  const customMessage = request.customMessage || templateDef?.interpolate(request.variables || []) || 'RUDU FARM: Notification alert.';

  // Create initial log in Firestore
  const notificationRecord: SmsNotificationRecord = {
    id: notificationId,
    tenantId,
    recipient: normalizedPhone,
    recipientUserId: request.recipientUserId,
    type: request.template,
    templateKey: request.template,
    provider: 'FAST2SMS',
    status: 'QUEUED',
    priority,
    referenceType: request.referenceType,
    referenceId: request.referenceId,
    metadata: request.metadata || {},
    retryCount: 0,
    createdAt: now,
  };

  if (db) {
    try {
      const notifRef = doc(db, 'tenants', tenantId, TENANT_COLLECTIONS.NOTIFICATIONS, notificationId);
      await setDoc(notifRef, notificationRecord);
    } catch (err) {
      console.warn('[SMSService] Error creating initial Firestore log:', err);
    }
  }

  try {
    const response = await fetch('/api/notifications/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
        phone: normalizedPhone,
        tenantId,
        customMessage,
      }),
    });

    const data: SmsResponse = await response.json();
    const isSuccess = data.success && (data.status === 'SENT' || data.status === 'DELIVERED');

    const updatePayload: Partial<SmsNotificationRecord> = {
      status: isSuccess ? 'SENT' : 'FAILED',
      providerMessageId: data.providerMessageId,
      sentAt: isSuccess ? new Date().toISOString() : undefined,
      failureReason: isSuccess ? undefined : data.error || 'Failed to dispatch SMS',
    };

    if (db) {
      try {
        const notifRef = doc(db, 'tenants', tenantId, TENANT_COLLECTIONS.NOTIFICATIONS, notificationId);
        await updateDoc(notifRef, updatePayload);
      } catch (e) {
        console.warn('[SMSService] Error updating log status:', e);
      }
    }

    return {
      ...data,
      notificationId,
    };
  } catch (err: any) {
    console.warn('[SMSService] Network error sending SMS:', err);

    if (db) {
      try {
        const notifRef = doc(db, 'tenants', tenantId, TENANT_COLLECTIONS.NOTIFICATIONS, notificationId);
        await updateDoc(notifRef, {
          status: 'FAILED',
          failureReason: err.message || 'Network error / API unreachable',
        });
      } catch {}
    }

    return {
      success: false,
      status: 'FAILED',
      notificationId,
      error: 'Failed to communicate with SMS API',
      errorCode: 'SMS_PROVIDER_ERROR',
    };
  }
};

/**
 * Retry a failed SMS notification (Max 3 retries)
 */
export const retrySmsNotification = async (
  tenantId: string,
  notificationId: string
): Promise<{ success: boolean; message: string }> => {
  if (!db) return { success: false, message: 'Database not initialized' };

  try {
    const notifRef = doc(db, 'tenants', tenantId, TENANT_COLLECTIONS.NOTIFICATIONS, notificationId);
    const snap = await getDoc(notifRef);

    if (!snap.exists()) {
      return { success: false, message: 'Notification record not found' };
    }

    const record = snap.data() as SmsNotificationRecord;

    if (record.retryCount >= MAX_RETRIES) {
      return {
        success: false,
        message: `Maximum retry limit of ${MAX_RETRIES} attempts reached for this SMS.`,
      };
    }

    // Increment retry count and mark sending
    await updateDoc(notifRef, {
      status: 'SENDING',
      retryCount: (record.retryCount || 0) + 1,
    });

    const response = await fetch('/api/notifications/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: record.recipient,
        template: record.type,
        tenantId: record.tenantId,
        metadata: record.metadata,
        referenceType: record.referenceType,
        referenceId: record.referenceId,
      }),
    });

    const data: SmsResponse = await response.json();
    const isSuccess = data.success;

    await updateDoc(notifRef, {
      status: isSuccess ? 'SENT' : 'FAILED',
      providerMessageId: data.providerMessageId || record.providerMessageId,
      sentAt: isSuccess ? new Date().toISOString() : undefined,
      failureReason: isSuccess ? undefined : data.error || 'Retry failed',
    });

    return {
      success: isSuccess,
      message: isSuccess ? 'SMS retried and dispatched successfully!' : data.error || 'Retry failed',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Retry encountered an error',
    };
  }
};

/**
 * Fetch SMS history logs for a tenant
 */
export const fetchTenantSmsLogs = async (
  tenantId: string = DEFAULT_TENANT_ID,
  maxRecords: number = 50
): Promise<SmsNotificationRecord[]> => {
  if (!db) return [];

  try {
    const notifsCol = collection(db, 'tenants', tenantId, TENANT_COLLECTIONS.NOTIFICATIONS);
    const q = query(notifsCol, orderBy('createdAt', 'desc'), limit(maxRecords));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => doc.data() as SmsNotificationRecord);
  } catch (err) {
    console.warn('[SMSService] Error querying SMS logs:', err);
    return [];
  }
};
