import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { request_id, status, tenant_id = "default" } = body;

    if (!request_id) {
      return NextResponse.json({ success: false, error: "Missing request_id" }, { status: 400 });
    }

    // Locate matching notification document
    const snap = await adminDb
      .collection("tenants")
      .doc(tenant_id)
      .collection("notifications")
      .where("providerMessageId", "==", String(request_id))
      .limit(1)
      .get();

    if (!snap.empty) {
      const docRef = snap.docs[0].ref;
      const normalizedStatus = String(status).toUpperCase() === "DELIVERED" ? "DELIVERED" : "FAILED";
      await docRef.update({
        status: normalizedStatus,
        deliveredAt: normalizedStatus === "DELIVERED" ? new Date() : null,
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error: any) {
    console.error("Fast2SMS Webhook Error:", error);
    return NextResponse.json({ success: false, error: "Webhook Error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Fast2SMS Webhook Endpoint Active" });
}
