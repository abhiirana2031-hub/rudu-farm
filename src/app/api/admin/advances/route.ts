import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

const advanceSchema = z.object({
  farmerId: z.string(),
  amount: z.number().positive(),
  reason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const authResult = await verifyAuth(req, ['TENANT_ADMIN']);
    if (authResult.error || !authResult.ctx) {
      return errorResponse(authResult.error || "Unauthorized", "UNAUTHORIZED", authResult.status);
    }
    
    const { tenantId, user } = authResult.ctx;

    const body = await req.json();
    const parseResult = advanceSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse("Invalid input", "VALIDATION_ERROR", 400);
    }

    const { farmerId, amount, reason } = parseResult.data;

    // Use Firestore Batch to ensure atomic creation of advance + ledger + audit
    const batch = adminDb.batch();
    const now = new Date();

    const advanceRef = adminDb.collection('tenants').doc(tenantId).collection('advances').doc();
    batch.set(advanceRef, {
      farmerId,
      amount,
      reason: reason || null,
      authorizedById: user.id || user.uid,
      status: 'APPROVED',
      date: now,
      createdAt: now
    });

    const ledgerRef = adminDb.collection('tenants').doc(tenantId).collection('ledgerTransactions').doc();
    batch.set(ledgerRef, {
      farmerId,
      transactionType: 'DEBIT',
      amount,
      description: reason ? `Advance: ${reason}` : 'Advance given',
      referenceId: advanceRef.id,
      date: now,
      createdAt: now
    });

    const auditRef = adminDb.collection('tenants').doc(tenantId).collection('auditLogs').doc();
    batch.set(auditRef, {
      actorId: user.id || user.uid,
      actorRole: user.role || 'TENANT_ADMIN',
      action: 'CREATE_ADVANCE',
      entityType: 'Advance',
      entityId: advanceRef.id,
      newValues: { amount, reason },
      timestamp: now
    });

    await batch.commit();

    return successResponse({
      message: "Advance processed successfully",
      advance: { id: advanceRef.id }
    });

  } catch (error: any) {
    console.error("Advance error:", error);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}
