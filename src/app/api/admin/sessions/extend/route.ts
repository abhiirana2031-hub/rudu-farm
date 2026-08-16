import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { successResponse, errorResponse } from "@/lib/api-response";
import { logAuditAction } from "@/lib/audit";
import { z } from "zod";
import { parseISO, isAfter, isBefore } from "date-fns";

const extendSchema = z.object({
  sessionId: z.string(),
  newEndTime: z.string().datetime(), // ISO string
  reason: z.string().min(5)
});

export async function POST(req: NextRequest) {
  try {
    const authResult = await verifyAuth(req, ['TENANT_ADMIN']);
    if (authResult.error || !authResult.ctx) {
      return errorResponse(authResult.error || "Unauthorized", "UNAUTHORIZED", authResult.status);
    }
    
    const { tenantId, user } = authResult.ctx;

    const body = await req.json();
    const parseResult = extendSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse("Invalid input", "VALIDATION_ERROR", 400);
    }

    const { sessionId, newEndTime, reason } = parseResult.data;
    const newEnd = parseISO(newEndTime);

    const sessionRef = adminDb.collection('tenants').doc(tenantId).collection('operatorSessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
      return errorResponse("Session not found", "NOT_FOUND", 404);
    }
    const session = sessionSnap.data() as any;

    if (session.status !== 'ACTIVE') {
      return errorResponse("Can only extend active sessions", "SESSION_NOT_ACTIVE", 400);
    }

    const scheduledEnd = session.scheduledEnd?.toDate ? session.scheduledEnd.toDate() : new Date(session.scheduledEnd);
    if (scheduledEnd && isBefore(newEnd, scheduledEnd)) {
      return errorResponse("New end time must be after scheduled end time", "INVALID_TIME", 400);
    }

    const batch = adminDb.batch();

    batch.update(sessionRef, {
      extensionStatus: 'EXTENDED',
      extensionEndTime: newEnd,
      extensionReason: reason
    });

    const extensionRef = adminDb.collection('tenants').doc(tenantId).collection('operatorSessionExtensions').doc();
    batch.set(extensionRef, {
      sessionId,
      adminId: user.id || user.uid,
      newEndTime: newEnd,
      reason,
      createdAt: new Date()
    });

    const auditRef = adminDb.collection('tenants').doc(tenantId).collection('auditLogs').doc();
    batch.set(auditRef, {
      actorId: user.id || user.uid,
      actorRole: user.role || 'TENANT_ADMIN',
      action: 'EXTEND_SESSION',
      entityType: 'OperatorSession',
      entityId: sessionId,
      newValues: { newEndTime, reason },
      reason,
      timestamp: new Date()
    });

    await batch.commit();

    return successResponse({ success: true, message: "Session extended" });

  } catch (error: any) {
    console.error("Session extend error:", error);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}
