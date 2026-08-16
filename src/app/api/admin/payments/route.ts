import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

const paymentSchema = z.object({
  farmerId: z.string(),
  amount: z.number().positive(),
  paymentMethod: z.enum(['CASH', 'UPI', 'BANK_TRANSFER', 'OTHER']),
  transactionRef: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const authResult = await verifyAuth(req, ['TENANT_ADMIN']);
    if (authResult.error || !authResult.ctx) {
      return errorResponse(authResult.error || "Unauthorized", "UNAUTHORIZED", authResult.status);
    }
    
    const { tenantId, user } = authResult.ctx;

    const body = await req.json();
    const parseResult = paymentSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse("Invalid input", "VALIDATION_ERROR", 400);
    }

    const { farmerId, amount, paymentMethod, transactionRef, notes } = parseResult.data;

    // Use Firestore Transaction to ensure consistency
    const result = await adminDb.runTransaction(async (tx: any) => {
      // 1. Calculate Balance
      const ledgersRef = adminDb.collection('tenants').doc(tenantId).collection('ledgerTransactions');
      const ledgerSnaps = await tx.get(ledgersRef.where('farmerId', '==', farmerId));
      
      let credits = 0;
      let debits = 0;

      for (const doc of ledgerSnaps.docs) {
        const data = doc.data();
        if (data.transactionType === 'CREDIT') credits += Number(data.amount);
        if (data.transactionType === 'DEBIT') debits += Number(data.amount);
      }
      
      const balance = credits - debits;
      
      if (balance < amount) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      // Check for duplicate payment
      if (transactionRef) {
        const paymentsRef = adminDb.collection('tenants').doc(tenantId).collection('payments');
        const existing = await tx.get(paymentsRef.where('transactionRef', '==', transactionRef).limit(1));
        if (!existing.empty) {
          throw new Error("DUPLICATE_TRANSACTION");
        }
      }

      const now = new Date();

      // 2. Create Payment
      const paymentRef = adminDb.collection('tenants').doc(tenantId).collection('payments').doc();
      tx.set(paymentRef, {
        farmerId,
        amount,
        paymentMethod,
        transactionRef: transactionRef || null,
        notes: notes || null,
        processedById: user.id || user.uid,
        status: 'COMPLETED',
        date: now,
        createdAt: now
      });

      // 3. Create Ledger Debit
      const newLedgerRef = adminDb.collection('tenants').doc(tenantId).collection('ledgerTransactions').doc();
      tx.set(newLedgerRef, {
        farmerId,
        transactionType: 'DEBIT',
        amount,
        description: `Payment via ${paymentMethod}`,
        referenceId: paymentRef.id,
        date: now,
        createdAt: now
      });
      
      // 5. Audit Log
      const auditRef = adminDb.collection('tenants').doc(tenantId).collection('auditLogs').doc();
      tx.set(auditRef, {
        actorId: user.id || user.uid,
        actorRole: user.role || 'TENANT_ADMIN',
        action: 'CREATE_PAYMENT',
        entityType: 'Payment',
        entityId: paymentRef.id,
        newValues: { amount, paymentMethod, transactionRef },
        timestamp: now
      });

      return { id: paymentRef.id };
    });

    return successResponse({
      message: "Payment processed successfully",
      payment: result
    });

  } catch (error: any) {
    console.error("Payment error:", error);
    if (error.message === "INSUFFICIENT_BALANCE") {
      return errorResponse("Insufficient farmer balance", "INSUFFICIENT_BALANCE", 400);
    }
    if (error.message === "DUPLICATE_TRANSACTION") {
      return errorResponse("Duplicate transaction reference", "DUPLICATE_TRANSACTION", 400);
    }
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}
