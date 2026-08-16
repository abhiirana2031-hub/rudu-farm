import { NextRequest, NextResponse } from "next/server";
import { notificationService } from "@/services/notification/notification.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, tenantId = "default", recipient, variables, payload } = body;

    if (!type) {
      return NextResponse.json({ success: false, error: "Missing notification type" }, { status: 400 });
    }

    let result;

    if (recipient && variables) {
      // Master Template API signature
      result = await notificationService.send({
        type,
        tenantId,
        recipient,
        variables,
        referenceId: body.referenceId,
        referenceType: body.referenceType,
      });
    } else if (payload) {
      // Legacy wrapper fallback
      switch (type) {
        case "MILK_COLLECTION":
          result = await notificationService.sendMilkCollectionSMS({
            tenantId,
            farmerPhone: payload.farmerPhone,
            farmerName: payload.farmerName,
            quantity: payload.quantity,
            amount: payload.amount,
            collectionId: payload.collectionId,
          });
          break;

        case "PAYMENT":
        case "PAYMENT_SUCCESS":
          result = await notificationService.sendPaymentSMS({
            tenantId,
            farmerPhone: payload.farmerPhone,
            farmerName: payload.farmerName,
            amount: payload.amount,
            transactionId: payload.transactionId,
          });
          break;

        case "ADVANCE":
        case "ADVANCE_CREATED":
          result = await notificationService.sendAdvanceSMS({
            tenantId,
            farmerPhone: payload.farmerPhone,
            farmerName: payload.farmerName,
            amount: payload.amount,
            transactionId: payload.transactionId,
          });
          break;

        case "OTP":
        case "OTP_LOGIN":
          result = await notificationService.sendOtpSMS({
            tenantId,
            phone: payload.phone,
            otp: payload.otp,
            referenceId: payload.referenceId,
          });
          break;

        default:
          return NextResponse.json({ success: false, error: `Unsupported notification type '${type}'` }, { status: 400 });
      }
    } else {
      return NextResponse.json({ success: false, error: "Payload or recipient+variables required" }, { status: 400 });
    }

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Async SMS Dispatch Error:", error);
    return NextResponse.json({ success: false, error: error.message || "SMS_DISPATCH_FAILED" });
  }
}
