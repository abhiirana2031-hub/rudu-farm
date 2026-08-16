import { smsService } from "./sms.service";
import { SmsTemplateType } from "./sms.types";

export class NotificationService {
  /**
   * Unified Entry Point for ALL System Notifications
   */
  async send(params: {
    type: SmsTemplateType;
    tenantId: string;
    recipient: string;
    variables: Record<string, any>;
    referenceType?: string;
    referenceId?: string;
    metadata?: Record<string, any>;
  }) {
    try {
      const settings = await smsService.getTenantSettings(params.tenantId);
      
      if (!settings.smsEnabled) {
        console.log(`[NOTIFICATION SERVICE] SMS globally disabled for tenant ${params.tenantId}`);
        return { success: false, reason: "SMS_GLOBALLY_DISABLED" };
      }

      // Check category toggles
      if (params.type === "MILK_COLLECTION" && !settings.milkCollectionSms) return { success: false, reason: "MILK_COLLECTION_DISABLED" };
      if (params.type === "PAYMENT_SUCCESS" && !settings.paymentSms) return { success: false, reason: "PAYMENT_SMS_DISABLED" };
      if (params.type === "ADVANCE_CREATED" && !settings.advanceSms) return { success: false, reason: "ADVANCE_SMS_DISABLED" };
      if (params.type === "LEDGER_STATEMENT" && !settings.ledgerStatementSms) return { success: false, reason: "LEDGER_STATEMENT_DISABLED" };
      if (params.type === "MONTHLY_STATEMENT" && !settings.monthlyStatementSms) return { success: false, reason: "MONTHLY_STATEMENT_DISABLED" };
      if (params.type === "RATE_CHANGE" && !settings.rateChangeSms) return { success: false, reason: "RATE_CHANGE_DISABLED" };
      if (params.type.startsWith("OTP") && !settings.otpSms) return { success: false, reason: "OTP_SMS_DISABLED" };

      return await smsService.sendSMS({
        tenantId: params.tenantId,
        phone: params.recipient,
        template: params.type,
        variables: params.variables,
        referenceType: params.referenceType || params.type,
        referenceId: params.referenceId,
        metadata: params.metadata || { variables: params.variables },
      });
    } catch (err: any) {
      console.error(`Error in notificationService.send (${params.type}):`, err);
      // Non-blocking isolation
      return { success: false, error: "NOTIFICATION_SERVICE_ERROR" };
    }
  }

  // --- FARMER CONVENIENCE WRAPPERS ---
  async sendMilkCollectionSMS(params: {
    tenantId: string;
    farmerPhone: string;
    farmerName: string;
    quantity: number;
    milkType?: string;
    centerName?: string;
    fat?: number;
    snf?: number;
    rate?: number;
    amount: number;
    collectionId: string;
  }) {
    const now = new Date();
    return this.send({
      type: "MILK_COLLECTION",
      tenantId: params.tenantId,
      recipient: params.farmerPhone,
      referenceType: "MILK_COLLECTION",
      referenceId: params.collectionId,
      variables: {
        FARMER_NAME: params.farmerName,
        QUANTITY: params.quantity,
        MILK_TYPE: params.milkType || 'Mixed',
        CENTER_NAME: params.centerName || 'Rudu Dairy Center',
        FAT: params.fat || 0,
        SNF: params.snf || 0,
        RATE: params.rate || 0,
        AMOUNT: params.amount,
        RECEIPT_NO: params.collectionId,
        DATE: now.toISOString().split('T')[0],
        TIME: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        // Legacy fallback fields
        quantity: params.quantity,
        amount: params.amount,
      }
    });
  }

  async sendPaymentSMS(params: {
    tenantId: string;
    farmerPhone: string;
    farmerName?: string;
    amount: number;
    transactionId: string;
  }) {
    return this.send({
      type: "PAYMENT_SUCCESS",
      tenantId: params.tenantId,
      recipient: params.farmerPhone,
      referenceType: "PAYMENT",
      referenceId: params.transactionId,
      variables: {
        FARMER_NAME: params.farmerName || 'Farmer',
        AMOUNT: params.amount,
        TRANSACTION_ID: params.transactionId,
        DATE: new Date().toISOString().split('T')[0],
        amount: params.amount,
        transactionId: params.transactionId
      }
    });
  }

  async sendAdvanceSMS(params: {
    tenantId: string;
    farmerPhone: string;
    farmerName?: string;
    amount: number;
    transactionId: string;
  }) {
    return this.send({
      type: "ADVANCE_CREATED",
      tenantId: params.tenantId,
      recipient: params.farmerPhone,
      referenceType: "ADVANCE",
      referenceId: params.transactionId,
      variables: {
        FARMER_NAME: params.farmerName || 'Farmer',
        AMOUNT: params.amount,
        TRANSACTION_ID: params.transactionId,
        DATE: new Date().toISOString().split('T')[0]
      }
    });
  }

  async sendOtpSMS(params: {
    tenantId: string;
    phone: string;
    otp: string;
    minutes?: number;
    referenceId?: string;
  }) {
    return this.send({
      type: "OTP_LOGIN",
      tenantId: params.tenantId,
      recipient: params.phone,
      referenceType: "OTP",
      referenceId: params.referenceId || `OTP-${Date.now()}`,
      variables: {
        OTP: params.otp,
        MINUTES: params.minutes || 10,
        otp: params.otp
      }
    });
  }
}

export const notificationService = new NotificationService();
