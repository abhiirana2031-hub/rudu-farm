import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { validateOperatorSession, getCurrentTimeInKolkata } from "@/lib/session";
import { adminDb } from "@/lib/firebase/admin";
import { successResponse, errorResponse } from "@/lib/api-response";
import { calculateMilkAmount } from "@/lib/rate-calculator";
import { z } from "zod";
import { format } from "date-fns";

const collectionSchema = z.object({
  farmerId: z.string(),
  milkType: z.enum(['COW', 'BUFFALO', 'MIXED']),
  quantity: z.number().positive(),
  fat: z.number().min(1).max(15),
  snf: z.number().min(5).max(12),
});

function generateReceiptNumber() {
  const dateStr = format(new Date(), "yyyyMMdd");
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `RF-${dateStr}-${randomNum}`;
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await verifyAuth(req, ['OPERATOR']);
    if (authResult.error || !authResult.ctx || !authResult.ctx.employee) {
      return errorResponse(authResult.error || "Unauthorized", "UNAUTHORIZED", authResult.status);
    }

    const { tenantId, user, employee: operator } = authResult.ctx;
    
    if (!operator || !operator.collectionCenterId) {
      return errorResponse("Operator not properly configured", "OPERATOR_NOT_CONFIGURED", 400);
    }
    const operatorId = operator.id;
    const centerId = operator.collectionCenterId;

    // 1. Validate Session
    const sessionCheck = await validateOperatorSession(operatorId, tenantId);
    if (!sessionCheck.valid || !sessionCheck.session) {
      return errorResponse(`Operator session invalid: ${sessionCheck.reason}`, "SESSION_INVALID", 403);
    }

    const session = sessionCheck.session;

    // 2. Validate Input
    const body = await req.json();
    const parseResult = collectionSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse("Invalid input data", "VALIDATION_ERROR", 400);
    }

    const { farmerId, milkType, quantity, fat, snf } = parseResult.data;

    const farmerSnap = await adminDb.collection('tenants').doc(tenantId).collection('farmers').doc(farmerId).get();
    if (!farmerSnap.exists) {
      return errorResponse("Farmer not found", "FARMER_NOT_FOUND", 404);
    }

    // 3. Find active rate rule
    const now = new Date();
    const ratesSnap = await adminDb.collection('tenants').doc(tenantId).collection('rateRules')
      .where('milkType', '==', milkType)
      .where('status', '==', 'ACTIVE')
      .get();

    let rateRule = null;
    for (const doc of ratesSnap.docs) {
       const data = doc.data();
       const start = data.effectiveStartDate?.toDate ? data.effectiveStartDate.toDate() : new Date(data.effectiveStartDate);
       const end = data.effectiveEndDate ? (data.effectiveEndDate?.toDate ? data.effectiveEndDate.toDate() : new Date(data.effectiveEndDate)) : null;
       
       if (start <= now && (!end || end >= now)) {
           rateRule = { id: doc.id, ...data };
           break; // Usually there should be only 1 active at a time
       }
    }

    if (!rateRule) {
      return errorResponse("No active rate rule found for this milk type", "NO_RATE_RULE", 400);
    }

    // 4. Calculate Amount
    const { rate, amount } = calculateMilkAmount(quantity, fat, snf, rateRule);

    const { timeString } = getCurrentTimeInKolkata();

    // 5. Database Batch (Atomic)
    const batch = adminDb.batch();

    const collectionRef = adminDb.collection('tenants').doc(tenantId).collection('milkCollections').doc();
    batch.set(collectionRef, {
      farmerId,
      operatorId,
      operatorSessionId: session.id,
      collectionCenterId: centerId,
      date: now,
      time: timeString,
      sessionType: session.scheduleId ? "SCHEDULED" : "MANUAL",
      milkType,
      quantity,
      fat,
      snf,
      rate,
      amount,
      createdAt: now
    });

    const ledgerRef = adminDb.collection('tenants').doc(tenantId).collection('ledgerTransactions').doc();
    batch.set(ledgerRef, {
      farmerId,
      transactionType: 'CREDIT',
      amount,
      description: `Milk collection: ${quantity}L @ ₹${rate}`,
      referenceId: collectionRef.id,
      date: now,
      createdAt: now
    });

    const receiptNumber = generateReceiptNumber();
    const receiptRef = adminDb.collection('tenants').doc(tenantId).collection('receipts').doc();
    batch.set(receiptRef, {
      receiptNumber,
      farmerId,
      collectionId: collectionRef.id,
      date: now,
      time: timeString,
      milkType,
      quantity,
      fat,
      snf,
      rate,
      amount,
      operatorId,
      collectionCenterId: centerId,
      createdAt: now
    });

    await batch.commit();

    return successResponse({
      message: "Collection saved successfully",
      receipt: { id: receiptRef.id, receiptNumber },
      amount: amount
    });

  } catch (error: any) {
    console.error("Milk collection error:", error);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}
