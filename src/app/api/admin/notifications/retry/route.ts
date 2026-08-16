import { NextRequest, NextResponse } from "next/server";
import { smsService } from "@/services/notification/sms.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { notificationId, tenantId = "default" } = body;

    if (!notificationId) {
      return NextResponse.json({ success: false, error: "Missing notificationId" }, { status: 400 });
    }

    const result = await smsService.retrySMS(tenantId, notificationId);

    if (result.success) {
      return NextResponse.json({ success: true, message: "SMS retried successfully!" });
    } else {
      return NextResponse.json({ success: false, error: result.error || "Retry failed." });
    }
  } catch (error: any) {
    console.error("SMS Retry Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to retry SMS." }, { status: 500 });
  }
}
