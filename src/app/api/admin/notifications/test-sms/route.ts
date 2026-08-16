import { NextRequest, NextResponse } from "next/server";
import { smsService } from "@/services/notification/sms.service";

// Simple in-memory rate limiting map for test SMS
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.expiresAt) {
    rateLimitMap.set(identifier, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, tenantId = "default" } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "SMS_INVALID_NUMBER: Phone number is required." },
        { status: 400 }
      );
    }

    // Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for") || "admin-client";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "SMS_RATE_LIMITED: Maximum 5 test SMS allowed per 10 minutes." },
        { status: 429 }
      );
    }

    const normalized = smsService.normalizePhoneNumber(phone);
    if (!normalized) {
      return NextResponse.json(
        { success: false, error: "SMS_INVALID_NUMBER: Please provide a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    // Dispatch Test SMS via Service
    const result = await smsService.sendSMS({
      tenantId,
      phone: normalized,
      template: "OTP_LOGIN",
      variables: {
        otp: "TEST-99",
      },
      referenceType: "TEST",
      referenceId: `TEST-${Date.now()}`,
      metadata: {
        isTestSms: true,
      },
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test SMS dispatched successfully!",
        logId: result.logId,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || "Failed to send SMS."
      });
    }
  } catch (error: any) {
    console.error("Test SMS Error:", error);
    return NextResponse.json(
      { success: false, error: `SMS_PROVIDER_ERROR: ${error?.message || error}` },
      { status: 500 }
    );
  }
}
