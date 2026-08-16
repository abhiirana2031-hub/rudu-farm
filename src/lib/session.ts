import { adminDb } from "./firebase/admin";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

const TIMEZONE = 'Asia/Kolkata';

export async function validateOperatorSession(operatorId: string, tenantId: string) {
  // Query Firestore for active session
  const sessionsRef = adminDb.collection('tenants').doc(tenantId).collection('operatorSessions');
  const snapshot = await sessionsRef
    .where('operatorId', '==', operatorId)
    .where('status', '==', 'ACTIVE')
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get();

  if (snapshot.empty) {
    return { valid: false, reason: "NO_ACTIVE_SESSION" };
  }

  const sessionDoc = snapshot.docs[0];
  const session = { id: sessionDoc.id, ...sessionDoc.data() } as any;

  const now = new Date();
  
  // Convert Firestore Timestamp to Date if necessary
  const scheduledEnd = session.scheduledEnd?.toDate ? session.scheduledEnd.toDate() : (session.scheduledEnd ? new Date(session.scheduledEnd) : null);
  const extensionEndTime = session.extensionEndTime?.toDate ? session.extensionEndTime.toDate() : (session.extensionEndTime ? new Date(session.extensionEndTime) : null);

  let validUntil = scheduledEnd;
  if (session.extensionStatus === 'EXTENDED' && extensionEndTime) {
    validUntil = extensionEndTime;
  }

  if (validUntil && now > validUntil) {
    // Expired! Auto logout
    await sessionDoc.ref.update({
      status: 'EXPIRED',
      logoutReason: 'SESSION_EXPIRED',
      actualLogoutTime: now
    });
    return { valid: false, reason: "SESSION_EXPIRED", session: null };
  }

  return { valid: true, session };
}

export function getCurrentTimeInKolkata() {
  const now = new Date();
  const zonedTime = toZonedTime(now, TIMEZONE);
  const dayOfWeek = zonedTime.getDay(); // 0 (Sun) to 6 (Sat)
  const timeString = formatInTimeZone(now, TIMEZONE, 'HH:mm'); // e.g. "17:30"
  return { now, zonedTime, dayOfWeek, timeString, TIMEZONE };
}
