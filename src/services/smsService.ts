/**
 * Fast2SMS Gateway Integration & Legacy Compatibility Layer
 * Routes all notification requests through the centralized NotificationService pipeline.
 * NO API keys or credentials are stored or exposed in this file.
 */

import { NotificationService } from './notification/notification.service';
import { dispatchSMS, normalizePhoneNumber } from './notification/sms.service';
import { SmsResponse } from './notification/sms.types';

export interface SendSmsPayload {
  numbers: string | string[];
  message: string;
  senderId?: string;
  route?: 'q' | 'dlt' | 'otp';
  templateId?: string;
}

/**
 * Dispatch generic SMS via the secure NotificationService pipeline
 */
export const sendFast2SMS = async (payload: SendSmsPayload): Promise<SmsResponse> => {
  const numberStr = Array.isArray(payload.numbers) ? payload.numbers[0] : payload.numbers;
  const cleanNumber = normalizePhoneNumber(numberStr);

  if (!cleanNumber) {
    return {
      success: false,
      status: 'FAILED',
      error: 'Invalid phone number',
    };
  }

  return dispatchSMS({
    phone: cleanNumber,
    template: 'CUSTOM',
    customMessage: payload.message,
    metadata: {
      route: payload.route,
      templateId: payload.templateId,
    },
  });
};

/**
 * 🥛 Milk Intake Collection Slip SMS
 */
export const sendMilkIntakeSms = async (
  phone: string,
  farmerName: string,
  receiptId: string,
  liters: number,
  fat: number,
  snf: number,
  rate: number,
  totalAmount: number
) => {
  return NotificationService.sendMilkCollectionSMS({
    phone,
    farmerName,
    quantityLiters: liters,
    totalAmount,
    receiptId,
    rate,
    fat,
    snf,
  });
};

/**
 * 💰 Payment Disbursement & Bank Credit SMS
 */
export const sendPayoutCreditSms = async (
  phone: string,
  farmerName: string,
  amount: number,
  _bankName: string,
  reference: string,
  _period: string
) => {
  return NotificationService.sendPaymentSMS({
    phone,
    farmerName,
    amount,
    transactionId: reference,
  });
};

/**
 * 📊 10-Day Billing Cycle Summary SMS
 */
export const send10DaySettlementSms = async (
  phone: string,
  farmerName: string,
  cycleName: string,
  _totalLiters: number,
  grossAmount: number,
  netPayable: number
) => {
  return NotificationService.sendMonthlyStatementSMS({
    phone,
    farmerName,
    month: cycleName,
    earnings: grossAmount,
    payments: Math.max(0, grossAmount - netPayable),
    balance: netPayable,
  });
};

/**
 * 📈 Rate Chart Change Notification SMS
 */
export const sendRateRevisionSms = async (
  numbers: string[],
  effectiveDate: string,
  cowBase: number,
  buffBase: number
) => {
  for (const num of numbers) {
    const clean = normalizePhoneNumber(num);
    if (clean) {
      await NotificationService.sendRateChangeSMS({
        phone: clean,
        effectiveDate,
        milkType: `Cow (₹${cowBase}) / Buffalo (₹${buffBase})`,
        rate: cowBase,
      }).catch(console.warn);
    }
  }
};

/**
 * 📢 General Dairy Announcement Broadcast SMS
 */
export const sendBroadcastSms = async (
  numbers: string[],
  title: string,
  announcementText: string
) => {
  for (const num of numbers) {
    const clean = normalizePhoneNumber(num);
    if (clean) {
      await NotificationService.sendBroadcastSMS({
        phone: clean,
        message: `${title}: ${announcementText}`,
      }).catch(console.warn);
    }
  }
};

/**
 * 🔐 Security PIN / OTP SMS
 */
export const sendOtpSecuritySms = async (phone: string, otpCode: string) => {
  return NotificationService.sendOtpSMS({
    phone,
    otpCode,
  });
};
