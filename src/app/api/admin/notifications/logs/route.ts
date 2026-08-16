import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId") || "default";

    const snap = await adminDb
      .collection("tenants")
      .doc(tenantId)
      .collection("notifications")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const logs = snap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        sentAt: data.sentAt?.toDate ? data.sentAt.toDate().toISOString() : data.sentAt,
      };
    });

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error("Fetch SMS Logs Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch SMS logs." },
      { status: 500 }
    );
  }
}
