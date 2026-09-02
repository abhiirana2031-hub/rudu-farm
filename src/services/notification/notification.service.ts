/**
 * High-Level Centralized Business Notification Service
 * Primary facade for triggering all SMS notifications across Rudu Farm.
 * Provider-independent, failure-tolerant, and fully tenant-aware.
 */

import { dispatchSMS, retrySmsNotification, fetchTenantSmsLogs } from './sms.service';
import { SendSmsRequest, SmsResponse, SmsNotificationRecord, SmsTemplateType, SmsPriority } from './sms.types';
import { DEFAULT_TENANT_ID } from '../../lib/firebase/firestore';

export interface UnifiedSendOptions {
  type: SmsTemplateType;
  recipient: string;
  tenantId?: string;
  recipientUserId?: string;
  referenceType?: string;
  referenceId?: string;
  variables?: (string | number)[] | Record<string, string | number>;
  metadata?: Record<string, any>;
  priority?: SmsPriority;
  customMessage?: string;
}

export class NotificationService {
  /**
   * Unified Generic Send Method
   * All business modules use this method for dispatching notifications.
   */
  public static async send({
    type,
    recipient,
    tenantId = DEFAULT_TENANT_ID,
    recipientUserId,
    referenceType,
    referenceId,
    variables,
    metadata,
    priority,
    customMessage,
  }: UnifiedSendOptions): Promise<SmsResponse> {
    return dispatchSMS({
      phone: recipient,
      template: type,
      variables,
      tenantId,
      recipientUserId,
      referenceType: referenceType || type,
      referenceId,
      metadata,
      priority,
      customMessage,
    });
  }

  // ─── Typed Convenience Facades ───────────────────────────────────

  /**
   * 🥛 Milk Collection Intake SMS
   */
  public static async sendMilkCollectionSMS({
    phone,
    farmerName,
    quantityLiters,
    milkType = 'Cow',
    centerName = 'BMC Hub',
    fat = 4.0,
    snf = 8.5,
    rate = 45,
    totalAmount,
    receiptId,
    tenantId = DEFAULT_TENANT_ID,
  }: {
    phone: string;
    farmerName: string;
    quantityLiters: number;
    milkType?: string;
    centerName?: string;
    fat?: number;
    snf?: number;
    rate?: number;
    totalAmount: number;
    receiptId: string;
    tenantId?: string;
  }): Promise<SmsResponse> {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    return this.send({
      type: 'MILK_COLLECTION',
      recipient: phone,
      tenantId,
      referenceType: 'MILK_COLLECTION',
      referenceId: receiptId,
      variables: [
        farmerName,
        quantityLiters.toFixed(1),
        milkType,
        centerName,
        fat.toFixed(1),
        snf.toFixed(1),
        rate.toFixed(2),
        Math.round(totalAmount).toString(),
        receiptId,
        dateStr,
        timeStr,
      ],
      metadata: { receiptId, farmerName, quantityLiters, totalAmount },
    });
  }

  /**
   * 💰 Payment / Payout Credit SMS
   */
  public static async sendPaymentSMS({
    phone,
    farmerName,
    amount,
    transactionId,
    tenantId = DEFAULT_TENANT_ID,
  }: {
    phone: string;
    farmerName: string;
    amount: number;
    transactionId: string;
    tenantId?: string;
  }): Promise<SmsResponse> {
    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return this.send({
      type: 'PAYMENT_SUCCESS',
      recipient: phone,
      tenantId,
      referenceType: 'PAYMENT',
      referenceId: transactionId,
      variables: [farmerName, Math.round(amount).toString(), transactionId, dateStr],
      metadata: { farmerName, amount, transactionId },
    });
  }

  /**
   * 💳 Advance Issued SMS
   */
  public static async sendAdvanceSMS({
    phone,
    farmerName,
    amount,
    transactionId,
    tenantId = DEFAULT_TENANT_ID,
  }: {
    phone: string;
    farmerName: string;
    amount: number;
    transactionId: string;
    tenantId?: string;
  }): Promise<SmsResponse> {
    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return this.send({
      type: 'ADVANCE_CREATED',
      recipient: phone,
      tenantId,
      referenceType: 'ADVANCE',
      referenceId: transactionId,
      variables: [farmerName, Math.round(amount).toString(), transactionId, dateStr],
      metadata: { farmerName, amount, transactionId },
    });
  }

  /**
   * 🔐 Security OTP SMS (Mandatory)
   */
  public static async sendOtpSMS({
    phone,
    otpCode,
    minutes = 10,
    tenantId = DEFAULT_TENANT_ID,
  }: {
    phone: string;
    otpCode: string;
    minutes?: number;
    tenantId?: string;
  }): Promise<SmsResponse> {
    return this.send({
      type: 'OTP_LOGIN',
      recipient: phone,
      tenantId,
      referenceType: 'OTP',
      referenceId: `OTP-${Date.now()}`,
      variables: [otpCode, String(minutes)],
      metadata: { isOtp: true },
      priority: 'CRITICAL',
    });
  }

  /**
   * 👤 Account Created SMS
   */
  public static async sendAccountCreatedSMS({
    phone,
    userId,
    isOperator = false,
    tenantId = DEFAULT_TENANT_ID,
  }: {
    phone: string;
    userId: string;
    isOperator?: boolean;
    tenantId?: string;
  }): Promise<SmsResponse> {
    return this.send({
      type: isOperator ? 'OPERATOR_ACCOUNT_CREATED' : 'ACCOUNT_CREATED',
      recipient: phone,
      tenantId,
      referenceType: 'ACCOUNT_CREATED',
      referenceId: userId,
      variables: [userId],
      metadata: { userId, isOperator },
    });
  }

  /**
   * 🕒 Operator Session Started SMS
   */
  public static async sendOperatorSessionLoginSMS({
    phone,
    operatorName,
    sessionType,
    startTime,
    endTime,
    tenantId = DEFAULT_TENANT_ID,
  }: {
    phone: string;
    operatorName: string;
    sessionType: string;
    startTime: string;
    endTime: string;
    tenantId?: string;
  }): Promise<SmsResponse> {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    return this.send({
      type: 'OPERATOR_LOGIN',
      recipient: phone,
      tenantId,
      referenceType: 'OPERATOR_SESSION',
      referenceId: `OP-LOGIN-${Date.now()}`,
      variables: [operatorName, sessionType, timeNow, startTime, endTime],
      metadata: { operatorName, sessionType },
    });
  }

  /**
   * 🕒 Operator Session Extended SMS
   */
  public static async sendOperatorSessionExtendedSMS({
    phone,
    operatorName,
    adminName,
    newEndTime,
    reason,
    tenantId = DEFAULT_TENANT_ID,
  }: {
    phone: string;
    operatorName: string;
    adminName: string;
    newEndTime: string;
    reason: string;
    tenantId?: string;
  }): Promise<SmsResponse> {
    return this.send({
      type: 'OPERATOR_SESSION_EXTENDED',
      recipient: phone,
      tenantId,
      referenceType: 'OPERATOR_SESSION',
      referenceId: `OP-EXT-${Date.now()}`,
      variables: [operatorName, adminName, newEndTime, reason],
      metadata: { operatorName, newEndTime, reason },
    });
  }

  /**
   * 🚪 Operator Force Logout SMS
   */
  public static async sendOperatorForceLogoutSMS({
    phone,
    operatorName,
    reason,
    tenantId = DEFAULT_TENANT_ID,
  }: {
    phone: string;
    operatorName: string;
    reason: string;
    tenantId?: string;
  }): Promise<SmsResponse> {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    return this.send({
      type: 'OPERATOR_FORCE_LOGOUT',
      recipient: phone,
      tenantId,
      referenceType: 'OPERATOR_SESSION',
      referenceId: `OP-FORCELOGOUT-${Date.now()}`,
      variables: [operatorName, timeNow, reason],
      metadata: { operatorName, reason },
      priority: 'CRITICAL',
    });
  }

  /**
   * 📈 Milk Rate Matrix Revised SMS
   */
  public static async sendRateChangeSMS({
    phone,
    effectiveDate,
    milkType,
    rate,
    tenantId = DEFAULT_TENANT_ID,
  }: {
    phone: string;
    effectiveDate: string;
    milkType: string;
    rate: number;
    tenantId?: string;
  }): Promise<SmsResponse> {
    return this.send({
      type: 'RATE_CHANGE',
      recipient: phone,
      tenantId,
      referenceType: 'RATE_CHANGE',
      referenceId: `RATE-${Date.now()}`,
      variables: [effectiveDate, milkType, rate.toFixed(2)],
      metadata: { effectiveDate, milkType, rate },
    });
  }

  /**
   * 📊 Monthly Earnings Statement SMS
   */
  public static async sendMonthlyStatementSMS({
    phone,
    farmerName,
    month,
    earnings,
    payments,
    balance,
    tenantId = DEFAULT_TENANT_ID,
  }: {
    phone: string;
    farmerName: string;
    month: string;
    earnings: number;
    payments: number;
    balance: number;
    tenantId?: string;
  }): Promise<SmsResponse> {
    return this.send({
      type: 'MONTHLY_STATEMENT',
      recipient: phone,
      tenantId,
      referenceType: 'MONTHLY_STATEMENT',
      referenceId: `${month}-${phone}`,
      variables: [
        farmerName,
        month,
        Math.round(earnings).toString(),
        Math.round(payments).toString(),
        Math.round(balance).toString(),
      ],
      metadata: { farmerName, month, earnings, payments, balance },
    });
  }

  /**
   * 📢 General Broadcast SMS
   */
  public static async sendBroadcastSMS({
    phone,
    message,
    tenantId = DEFAULT_TENANT_ID,
  }: {
    phone: string;
    message: string;
    tenantId?: string;
  }): Promise<SmsResponse> {
    return this.send({
      type: 'GENERAL_NOTIFICATION',
      recipient: phone,
      tenantId,
      referenceType: 'BROADCAST',
      referenceId: `BROADCAST-${Date.now()}`,
      variables: [message],
      customMessage: `RUDU FARM: ${message}`,
    });
  }

  /**
   * ⚡ Admin Test SMS Dispatch
   */
  public static async sendTestSMS({
    phone,
    templateType = 'CUSTOM',
    variables,
    tenantId = DEFAULT_TENANT_ID,
    role = 'admin',
  }: {
    phone: string;
    templateType?: SmsTemplateType;
    variables?: (string | number)[];
    tenantId?: string;
    role?: string;
  }): Promise<SmsResponse> {
    try {
      const res = await fetch('/api/admin/notifications/test-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': role,
        },
        body: JSON.stringify({ phone, template: templateType, variables, tenantId }),
      });
      return await res.json();
    } catch (err: any) {
      return {
        success: false,
        status: 'FAILED',
        error: err.message || 'Failed to dispatch test SMS',
        errorCode: 'SMS_PROVIDER_ERROR',
      };
    }
  }

  /**
   * 🔄 Retry a failed SMS notification
   */
  public static async retryFailedSMS(
    tenantId: string,
    notificationId: string
  ): Promise<{ success: boolean; message: string }> {
    return retrySmsNotification(tenantId, notificationId);
  }

  /**
   * 📋 Query SMS Logs for a Tenant
   */
  public static async getTenantLogs(
    tenantId: string = DEFAULT_TENANT_ID,
    limitCount: number = 50
  ): Promise<SmsNotificationRecord[]> {
    return fetchTenantSmsLogs(tenantId, limitCount);
  }
}
