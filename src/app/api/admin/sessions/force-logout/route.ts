import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { successResponse, errorResponse } from "@/lib/api-response";
import { logAuditAction } from "@/lib/audit";
import { z } from "zod";

const forceLogoutSchema = z.object({
  sessionId: z.string(),
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
    const parseResult = forceLogoutSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse("Invalid input", "VALIDATION_ERROR", 400);
    }

    const { sessionId, reason } = parseResult.data;

    const sessionRef = adminDb.collection('tenants').doc(tenantId).collection('operatorSessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
      return errorResponse("Session not found", "NOT_FOUND", 404);
    }

    const session = sessionSnap.data() as any;

    if (session.status !== 'ACTIVE') {
      return errorResponse("Session is not active", "SESSION_NOT_ACTIVE", 400);
    }

    const now = new Date();

    // Use Firestore Batch
    const batch = adminDb.batch();

    batch.update(sessionRef, {
      status: 'FORCE_LOGGED_OUT',
      logoutReason: 'ADMIN_TERMINATED',
      actualLogoutTime: now
    });

    const auditRef = adminDb.collection('tenants').doc(tenantId).collection('auditLogs').doc();
    batch.set(auditRef, {
      actorId: user.id || user.uid,
      actorRole: user.role || 'TENANT_ADMIN',
      action: 'FORCE_LOGOUT_SESSION',
      entityType: 'OperatorSession',
      entityId: sessionId,
      reason,
      timestamp: now
    });

    await batch.commit();

    return successResponse({ success: true, message: "Operator force logged out" });

  } catch (error: any) {
    console.error("Force logout error:", error);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}
