/**
 * Operator Login Schedule & Session Lifecycle Management
 */

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './client';
import { DEFAULT_TENANT_ID, TENANT_COLLECTIONS } from './firestore';
import { logAuditEvent } from './audit';
import { NotificationService } from '../../services/notification/notification.service';

export type SessionStatus =
  | 'ACTIVE'
  | 'COMPLETED'
  | 'AUTO_LOGGED_OUT'
  | 'FORCE_LOGGED_OUT'
  | 'EXPIRED';

export interface OperatorSchedule {
  id: string;
  operatorId: string;
  sessionType: 'morning' | 'evening';
  dayOfWeek?: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // "05:00"
  endTime: string; // "08:00"
  timezone?: string;
  enabled: boolean;
}

export interface OperatorSession {
  id: string;
  tenantId: string;
  operatorId: string;
  operatorName: string;
  collectionCenterId: string;
  sessionType: 'morning' | 'evening';
  scheduledStart: string;
  scheduledEnd: string;
  actualLogin: string;
  actualLogout?: string;
  status: SessionStatus;
  logoutReason?: string;
  extensionUntil?: string;
  extensionReason?: string;
  extendedBy?: string;
  entryCount: number;
  totalMilk: number;
  totalAmount: number;
  farmersServed: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Validate whether current time falls within allowed schedule window
 */
export const isWithinScheduleWindow = (
  startTime: string = '05:00',
  endTime: string = '08:00',
  extensionUntil?: string
): { isValid: boolean; reason?: string } => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  const startTotal = startH * 60 + startM;
  let endTotal = endH * 60 + endM;

  if (extensionUntil) {
    const [extH, extM] = extensionUntil.split(':').map(Number);
    endTotal = extH * 60 + extM;
  }

  // Grace buffer of 15 minutes before start
  if (currentMinutes < startTotal - 15) {
    return {
      isValid: false,
      reason: `Shift login window has not opened yet. Opens at ${startTime}.`,
    };
  }

  if (currentMinutes > endTotal) {
    return {
      isValid: false,
      reason: `Shift window closed at ${extensionUntil || endTime}. Contact Admin for emergency extension.`,
    };
  }

  return { isValid: true };
};

/**
 * Start a new Operator Session
 */
export const createOperatorSession = async (
  operatorId: string,
  operatorName: string,
  collectionCenterId: string,
  sessionType: 'morning' | 'evening',
  tenantId: string = DEFAULT_TENANT_ID
): Promise<OperatorSession | null> => {
  if (!db) return null;

  const now = new Date();
  const scheduledStart = sessionType === 'morning' ? '05:00' : '17:00';
  const scheduledEnd = sessionType === 'morning' ? '08:30' : '20:30';

  const sessionId = `SESS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const sessionData: OperatorSession = {
    id: sessionId,
    tenantId,
    operatorId,
    operatorName,
    collectionCenterId,
    sessionType,
    scheduledStart,
    scheduledEnd,
    actualLogin: now.toISOString(),
    status: 'ACTIVE',
    entryCount: 0,
    totalMilk: 0,
    totalAmount: 0,
    farmersServed: 0,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  try {
    const sessionRef = doc(db, 'tenants', tenantId, TENANT_COLLECTIONS.OPERATOR_SESSIONS, sessionId);
    await setDoc(sessionRef, sessionData);

    await logAuditEvent({
      tenantId,
      actorId: operatorId,
      actorRole: 'OPERATOR',
      action: 'OPERATOR_LOGIN_SESSION_START',
      entityType: 'OPERATOR_SESSION',
      entityId: sessionId,
      metadata: { sessionType, collectionCenterId },
    });

    // Asynchronously dispatch Operator Login SMS alert
    NotificationService.sendOperatorSessionLoginSMS({
      phone: operatorId, // operator phone or code
      operatorName,
      sessionType,
      startTime: scheduledStart,
      endTime: scheduledEnd,
      tenantId,
    }).catch((e) => console.warn('[Session] Operator Login SMS warning:', e));

    return sessionData;
  } catch (err) {
    console.error('[Session] Failed to start operator session:', err);
    return null;
  }
};

/**
 * Validate active session before milk entry or operations
 */
export const validateActiveSession = async (
  sessionId: string,
  tenantId: string = DEFAULT_TENANT_ID
): Promise<{ isValid: boolean; session?: OperatorSession; error?: string }> => {
  if (!db || !sessionId) {
    return { isValid: false, error: 'No active session found.' };
  }

  try {
    const sessionRef = doc(db, 'tenants', tenantId, TENANT_COLLECTIONS.OPERATOR_SESSIONS, sessionId);
    const snap = await getDoc(sessionRef);

    if (!snap.exists()) {
      return { isValid: false, error: 'Operator session does not exist.' };
    }

    const session = snap.data() as OperatorSession;

    if (session.status === 'FORCE_LOGGED_OUT') {
      return { isValid: false, error: 'Session was terminated by Dairy Admin.', session };
    }

    if (session.status !== 'ACTIVE') {
      return { isValid: false, error: `Session is ${session.status.toLowerCase()}. Please re-login.`, session };
    }

    const windowCheck = isWithinScheduleWindow(
      session.scheduledStart,
      session.scheduledEnd,
      session.extensionUntil
    );

    if (!windowCheck.isValid) {
      await updateDoc(sessionRef, {
        status: 'EXPIRED',
        logoutReason: 'Schedule window expired automatically',
        actualLogout: new Date().toISOString(),
      });
      return { isValid: false, error: windowCheck.reason, session };
    }

    return { isValid: true, session };
  } catch (err: any) {
    return { isValid: false, error: err.message || 'Session verification failed.' };
  }
};

/**
 * Tenant Admin Emergency Session Extension
 */
export const extendOperatorSession = async (
  sessionId: string,
  newEndTime: string,
  reason: string,
  adminId: string,
  tenantId: string = DEFAULT_TENANT_ID
): Promise<boolean> => {
  if (!db || !sessionId || !adminId) return false;

  try {
    const sessionRef = doc(db, 'tenants', tenantId, TENANT_COLLECTIONS.OPERATOR_SESSIONS, sessionId);
    const snap = await getDoc(sessionRef);

    if (!snap.exists()) return false;
    const session = snap.data() as OperatorSession;

    await updateDoc(sessionRef, {
      extensionUntil: newEndTime,
      extensionReason: reason,
      extendedBy: adminId,
      status: 'ACTIVE',
      updatedAt: new Date().toISOString(),
    });

    await logAuditEvent({
      tenantId,
      actorId: adminId,
      actorRole: 'TENANT_ADMIN',
      action: 'OPERATOR_SESSION_EXTENSION',
      entityType: 'OPERATOR_SESSION',
      entityId: sessionId,
      metadata: {
        oldEndTime: session.scheduledEnd,
        newEndTime,
        reason,
      },
    });

    // Asynchronously dispatch Session Extended SMS
    NotificationService.sendOperatorSessionExtendedSMS({
      phone: session.operatorId,
      operatorName: session.operatorName,
      adminName: 'Administrator',
      newEndTime,
      reason,
      tenantId,
    }).catch(console.warn);

    return true;
  } catch (err) {
    console.error('[Session] Emergency extension failed:', err);
    return false;
  }
};

/**
 * Tenant Admin Force Logout
 */
export const forceLogoutOperatorSession = async (
  sessionId: string,
  reason: string,
  adminId: string,
  tenantId: string = DEFAULT_TENANT_ID
): Promise<boolean> => {
  if (!db || !sessionId) return false;

  try {
    const sessionRef = doc(db, 'tenants', tenantId, TENANT_COLLECTIONS.OPERATOR_SESSIONS, sessionId);
    const snap = await getDoc(sessionRef);
    const session = snap.exists() ? (snap.data() as OperatorSession) : null;

    await updateDoc(sessionRef, {
      status: 'FORCE_LOGGED_OUT',
      logoutReason: reason,
      actualLogout: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await logAuditEvent({
      tenantId,
      actorId: adminId,
      actorRole: 'TENANT_ADMIN',
      action: 'OPERATOR_FORCE_LOGOUT',
      entityType: 'OPERATOR_SESSION',
      entityId: sessionId,
      metadata: { reason },
    });

    // Asynchronously dispatch Force Logout SMS
    if (session) {
      NotificationService.sendOperatorForceLogoutSMS({
        phone: session.operatorId,
        operatorName: session.operatorName,
        reason,
        tenantId,
      }).catch(console.warn);
    }

    return true;
  } catch (err) {
    console.error('[Session] Force logout failed:', err);
    return false;
  }
};
