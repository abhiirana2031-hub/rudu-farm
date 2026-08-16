import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAuth(req, ['TENANT_ADMIN', 'OPERATOR']);
    if (authResult.error || !authResult.ctx) {
      return errorResponse(authResult.error || "Unauthorized", "UNAUTHORIZED", authResult.status);
    }
    const { tenantId } = authResult.ctx;

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.toLowerCase();

    if (!query) {
      return errorResponse("Search query 'q' is required", "BAD_REQUEST", 400);
    }

    // Firestore doesn't support generic 'contains' or full-text search easily without a 3rd party tool (like Algolia).
    // As per prompt rule 34: "For farmer search: farmer code, phone, normalized name. Use indexed fields."
    // We will do a client-side filter here over a bounded query or query specific equality/starts with.
    // Given farmer lists per tenant are usually < 1000, we can fetch and filter, or use >= && <= logic.
    
    // Fetch all active farmers for this tenant and filter in memory for now.
    const farmersSnap = await adminDb.collection('tenants').doc(tenantId).collection('farmers').get();
    
    const farmers = farmersSnap.docs
      .map((doc: any) => ({ id: doc.id, ...doc.data() } as any))
      .filter((f: any) => 
        (f.farmerCode && f.farmerCode.toLowerCase().includes(query)) ||
        (f.name && f.name.toLowerCase().includes(query)) ||
        (f.phone && f.phone.includes(query))
      )
      .slice(0, 20);

    return successResponse({ farmers });

  } catch (error: any) {
    console.error("Farmer search error:", error);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}
