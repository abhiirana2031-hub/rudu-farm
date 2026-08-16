import { adminDb } from "@/lib/firebase/admin";
import { Fast2SMSProvider } from "./providers/fast2sms.provider";
import { MockSmsProvider } from "./providers/mock.provider";
import { ISmsProvider, SmsNotificationPayload, SmsLogRecord, NotificationSettings } from "./sms.types";
import { MASTER_SMS_TEMPLATES } from "./sms.templates";

const MAX_RETRIES = 3;

export class SmsService {
  private provider: ISmsProvider;

  constructor() {
    const providerType = (process.env.SMS_PROVIDER || "fast2sms").toLowerCase();
    if (providerType === "mock") {
      this.provider = new MockSmsProvider();
    } else {
      this.provider = new Fast2SMSProvider();
    }
  }

  /**
   * Phone Number Normalization
   * Normalizes Indian numbers (+91, 91, leading 0) into clean 10-digit mobile format
   */
  normalizePhoneNumber(phone: string): string | null {
    if (!phone) return null;

    let cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("91") && cleaned.length === 12) {
      cleaned = cleaned.slice(2);
    } else if (cleaned.startsWith("0") && cleaned.length === 11) {
      cleaned = cleaned.slice(1);
    }

    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (indianMobileRegex.test(cleaned)) {
      return cleaned;
    }

    return null;
  }

  /**
   * Idempotency Check
   * Checks if an SMS notification has already been sent for this referenceId
   */
  async isDuplicate(tenantId: string, referenceType?: string, referenceId?: string): Promise<boolean> {
    if (!referenceType || !referenceId) return false;

    try {
      if (!process.env.FIREBASE_PROJECT_ID) return false;
      const snap = await adminDb
        .collection("tenants")
        .doc(tenantId)
        .collection("notifications")
        .where("referenceType", "==", referenceType)
        .where("referenceId", "==", referenceId)
        .where("status", "in", ["QUEUED", "SENDING", "SENT", "DELIVERED"])
        .limit(1)
        .get();

      return !snap.empty;
    } catch (e) {
      console.warn("[SMS SERVICE] Firestore idempotency check bypassed:", (e as any)?.message || e);
      return false;
    }
  }

  /**
   * Tenant Notification Settings
   */
  async getTenantSettings(tenantId: string): Promise<NotificationSettings> {
    const defaultSettings: NotificationSettings = {
      smsEnabled: true,
      milkCollectionSms: true,
      paymentSms: true,
      advanceSms: true,
      ledgerStatementSms: true,
      monthlyStatementSms: true,
      rateChangeSms: true,
      otpSms: true,
      securityAlertsSms: true,
      operatorSessionAlertsSms: true,
    };

    try {
      const doc = await adminDb
        .collection("tenants")
        .doc(tenantId)
        .collection("settings")
        .doc("notifications")
        .get();

      if (doc.exists) {
        return { ...defaultSettings, ...doc.data() };
      }
    } catch (e) {
      console.error("Error reading notification settings:", e);
    }

    return defaultSettings;
  }

  /**
   * Central Send SMS Function
   */
  async sendSMS(payload: SmsNotificationPayload): Promise<{ success: boolean; logId?: string; error?: string }> {
    const normalizedPhone = this.normalizePhoneNumber(payload.phone);
    if (!normalizedPhone) {
      console.warn(`[SMS SERVICE] Invalid phone number skipped: ${payload.phone}`);
      return { success: false, error: "SMS_INVALID_NUMBER: Invalid 10-digit mobile number." };
    }

    // Lookup Master Template Definition
    const templateDef = MASTER_SMS_TEMPLATES[payload.template];
    if (!templateDef) {
      return { success: false, error: `SMS_TEMPLATE_ERROR: Invalid template '${payload.template}'` };
    }

    // Check Idempotency
    const isDup = await this.isDuplicate(payload.tenantId, payload.referenceType, payload.referenceId);
    if (isDup) {
      console.log(`[SMS SERVICE] Skipped duplicate SMS for reference ${payload.referenceType}:${payload.referenceId}`);
      return { success: true, error: "SMS_IDEMPOTENT_SKIPPED" };
    }

    let logId = `LOG-${Date.now()}`;
    let notifRef: any = null;

    try {
      notifRef = adminDb
        .collection("tenants")
        .doc(payload.tenantId)
        .collection("notifications")
        .doc();
      logId = notifRef.id;
    } catch (e) {
      console.warn("[SMS SERVICE] Firestore ref creation bypassed:", (e as any)?.message || e);
    }

    const dltTemplateId = process.env[templateDef.dltEnvVar] || "DEFAULT";

    // Initial QUEUED record
    const logData: Partial<SmsLogRecord> = {
      id: logId,
      tenantId: payload.tenantId,
      recipient: normalizedPhone,
      type: payload.template,
      templateKey: payload.template,
      templateId: dltTemplateId,
      provider: this.provider.name as "FAST2SMS" | "MOCK",
      status: "QUEUED",
      referenceType: payload.referenceType,
      referenceId: payload.referenceId,
      metadata: payload.metadata || {},
      retryCount: 0,
      createdAt: new Date(),
    };

    try {
      if (notifRef) await notifRef.set(logData);
    } catch (e) {
      console.warn("[SMS SERVICE] Firestore log write skipped:", e);
    }

    // Dispatch via Provider
    const result = await this.provider.send({ ...payload, phone: normalizedPhone });

    if (result.success) {
      try {
        if (notifRef) {
          await notifRef.update({
            status: "SENT",
            providerMessageId: result.providerMessageId || null,
            sentAt: new Date(),
          });
        }
      } catch (e) {}
      return { success: true, logId };
    } else {
      try {
        if (notifRef) {
          await notifRef.update({
            status: "FAILED",
            failureReason: result.error || "UNKNOWN_ERROR",
          });
        }
      } catch (e) {}
      return { success: false, logId, error: result.error };
    }
  }

  /**
   * Retry Mechanism for Failed SMS Notifications
   */
  async retrySMS(tenantId: string, notificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const notifRef = adminDb
        .collection("tenants")
        .doc(tenantId)
        .collection("notifications")
        .doc(notificationId);

      const doc = await notifRef.get();
      if (!doc.exists) {
        return { success: false, error: "Notification record not found." };
      }

      const data = doc.data() as SmsLogRecord;

      if (data.retryCount >= MAX_RETRIES) {
        return { success: false, error: `Maximum retry limit (${MAX_RETRIES}) reached.` };
      }

      await notifRef.update({
        status: "SENDING",
        retryCount: (data.retryCount || 0) + 1,
      });

      const result = await this.provider.send({
        tenantId: data.tenantId,
        phone: data.recipient,
        template: data.templateKey || data.type,
        variables: data.metadata?.variables || {},
        referenceType: data.referenceType,
        referenceId: data.referenceId,
      });

      if (result.success) {
        await notifRef.update({
          status: "SENT",
          providerMessageId: result.providerMessageId || null,
          sentAt: new Date(),
          failureReason: null,
        });
        return { success: true };
      } else {
        await notifRef.update({
          status: "FAILED",
          failureReason: result.error || "RETRY_FAILED",
        });
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      return { success: false, error: err.message || "Retry failed" };
    }
  }
}

export const smsService = new SmsService();
