import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const authResult = await verifyAuth(req, ['TENANT_ADMIN', 'SUPER_ADMIN']);
    if (authResult.error || !authResult.ctx) {
      return errorResponse(authResult.error || "Unauthorized", "UNAUTHORIZED", authResult.status);
    }
    const { tenantId } = authResult.ctx;

    const { sessionId } = await params;

    const sessionSnap = await adminDb.collection('tenants').doc(tenantId).collection('operatorSessions').doc(sessionId).get();

    if (!sessionSnap.exists) {
      return errorResponse("Session not found", "NOT_FOUND", 404);
    }
    const session = sessionSnap.data() as any;

    // Fetch operator details
    const operatorSnap = await adminDb.collection('tenants').doc(tenantId).collection('employees').doc(session.operatorId).get();
    const operatorName = operatorSnap.exists ? operatorSnap.data()?.name : 'Unknown Operator';

    // Aggregate collections
    const collectionsSnap = await adminDb.collection('tenants').doc(tenantId).collection('milkCollections')
      .where('operatorSessionId', '==', sessionId)
      .get();

    let totalQuantity = 0;
    let totalAmount = 0;
    const farmersServed = new Set<string>();
    const collectionDetails = [];

    // Pre-fetch all farmers for this tenant to join the data (in a real scenario, you'd batch get these or store denormalized names in the collection document)
    // To keep it simple and avoid massive reads, we'll fetch them individually since a session usually has < 100 collections.
    const farmerCache = new Map<string, any>();

    for (const doc of collectionsSnap.docs) {
      const c = doc.data() as any;
      
      let farmerName = 'Unknown';
      let farmerCode = 'Unknown';

      if (!farmerCache.has(c.farmerId)) {
         const farmerSnap = await adminDb.collection('tenants').doc(tenantId).collection('farmers').doc(c.farmerId).get();
         if (farmerSnap.exists) {
           farmerCache.set(c.farmerId, farmerSnap.data());
         }
      }
      
      if (farmerCache.has(c.farmerId)) {
         const f = farmerCache.get(c.farmerId);
         farmerName = f.name;
         farmerCode = f.farmerCode;
      }

      totalQuantity += Number(c.quantity);
      totalAmount += Number(c.amount);
      farmersServed.add(c.farmerId);

      collectionDetails.push({
        id: doc.id,
        farmerCode,
        farmerName,
        quantity: c.quantity,
        fat: c.fat,
        snf: c.snf,
        amount: c.amount,
        time: c.time
      });
    }

    // Convert Firestore Timestamp to Date for response
    const loginTime = session.actualLoginTime?.toDate ? session.actualLoginTime.toDate() : session.actualLoginTime;
    const logoutTime = session.actualLogoutTime?.toDate ? session.actualLogoutTime.toDate() : session.actualLogoutTime;

    return successResponse({
      sessionDetails: {
        id: sessionSnap.id,
        operatorName,
        status: session.status,
        loginTime,
        logoutTime,
      },
      stats: {
        totalEntries: collectionsSnap.size,
        totalMilkQuantity: totalQuantity,
        totalAmountValue: totalAmount,
        uniqueFarmersServed: farmersServed.size
      },
      collections: collectionDetails
    });

  } catch (error: any) {
    console.error("Session report error:", error);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}
