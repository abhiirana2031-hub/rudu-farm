import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getCurrentTimeInKolkata } from "@/lib/session";
import { adminDb } from "@/lib/firebase/admin";
import { successResponse, errorResponse } from "@/lib/api-response";
import { logAuditAction } from "@/lib/audit";
import { set } from "date-fns";

export async function POST(req: NextRequest) {
  try {
    const authResult = await verifyAuth(req, ['OPERATOR']);
    if (authResult.error || !authResult.ctx) {
      return errorResponse(authResult.error || "Unauthorized", "UNAUTHORIZED", authResult.status);
    }

    const { tenantId, user: dbUser, employee: operator } = authResult.ctx;
    
    if (!operator || !operator.collectionCenterId) {
      return errorResponse("Operator not properly configured", "OPERATOR_NOT_CONFIGURED", 400);
    }

    const { now, dayOfWeek, timeString } = getCurrentTimeInKolkata();
    const operatorId = operator.id;
    const centerId = operator.collectionCenterId;

    // Check for an already active session
    const sessionsRef = adminDb.collection('tenants').doc(tenantId).collection('operatorSessions');
    const existingSessionsSnap = await sessionsRef
      .where('operatorId', '==', operatorId)
      .where('status', '==', 'ACTIVE')
      .limit(1)
      .get();

    if (!existingSessionsSnap.empty) {
      return errorResponse("An active session already exists", "SESSION_ALREADY_ACTIVE", 400);
    }

    // Find valid schedule for today
    const schedulesRef = adminDb.collection('tenants').doc(tenantId).collection('operatorSchedules');
    const schedulesSnap = await schedulesRef
      .where('operatorId', '==', operatorId)
      .where('collectionCenterId', '==', centerId)
      .where('dayOfWeek', '==', dayOfWeek)
      .where('enabled', '==', true)
      .get();

    let schedule: any = null;
    for (const doc of schedulesSnap.docs) {
      const data = doc.data();
      if (data.startTime <= timeString && data.endTime >= timeString) {
        schedule = { id: doc.id, ...data };
        break;
      }
    }

    if (!schedule) {
      return errorResponse("Outside of permitted login window", "OUTSIDE_LOGIN_WINDOW", 403);
    }

    // Calculate actual end datetime based on schedule
    // Parse "HH:mm" to actual Date object for today
    const [startH, startM] = schedule.startTime.split(':').map(Number);
    const [endH, endM] = schedule.endTime.split(':').map(Number);

    const scheduledStart = set(now, { hours: startH, minutes: startM, seconds: 0, milliseconds: 0 });
    const scheduledEnd = set(now, { hours: endH, minutes: endM, seconds: 0, milliseconds: 0 });

    const newSessionRef = await sessionsRef.add({
      operatorId,
      scheduleId: schedule.id,
      scheduledStart,
      scheduledEnd,
      status: 'ACTIVE',
      actualLoginTime: now,
      createdAt: now
    });

    // Write audit log
    await logAuditAction({
      tenantId,
      actorId: dbUser.id || operator.authUserId,
      actorRole: 'OPERATOR',
      action: 'OPERATOR_LOGIN',
      entityType: 'OperatorSession',
      entityId: newSessionRef.id,
    });

    return successResponse({
      sessionId: newSessionRef.id,
      schedule: schedule.sessionName,
      endTime: scheduledEnd
    });

  } catch (error: any) {
    console.error("Session start error:", error);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}
