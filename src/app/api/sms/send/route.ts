import { NextRequest, NextResponse } from "next/server";
import { sendFast2SMS } from "@/lib/sms";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { numbers, message, apiKey } = body;

    if (!numbers || !message) {
      return NextResponse.json(
        { success: false, error: "Phone number(s) and message are required." },
        { status: 400 }
      );
    }

    const result = await sendFast2SMS({ numbers, message, apiKey });

    return NextResponse.json({
      success: true,
      message: "SMS sent successfully!",
      data: result,
    });
  } catch (error: any) {
    console.error("Fast2SMS Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send SMS." },
      { status: 500 }
    );
  }
}
