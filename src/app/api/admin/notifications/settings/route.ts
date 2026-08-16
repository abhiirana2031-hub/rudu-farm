import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { NotificationSettings } from "@/services/notification/sms.types";

const defaultSettings: NotificationSettings = {
  smsEnabled: true,
  milkCollectionSms: true,
  paymentSms: true,
  advanceSms: true,
  ledgerStatementSms: true,
  monthlyStatementSms: true,
  rateChangeSms: true,
  otpSms: true,
  securityAlertsSms: true,
  operatorSessionAlertsSms: true,
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId") || "default";

    const doc = await adminDb
      .collection("tenants")
      .doc(tenantId)
      .collection("settings")
      .doc("notifications")
      .get();

    if (doc.exists) {
      return NextResponse.json({ success: true, settings: { ...defaultSettings, ...doc.data() } });
    }

    return NextResponse.json({ success: true, settings: defaultSettings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenantId = "default", settings } = body;

    if (!settings) {
      return NextResponse.json({ success: false, error: "Settings object is required." }, { status: 400 });
    }

    await adminDb
      .collection("tenants")
      .doc(tenantId)
      .collection("settings")
      .doc("notifications")
      .set({ ...settings, updatedAt: new Date() }, { merge: true });

    return NextResponse.json({ success: true, message: "Notification settings saved successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
