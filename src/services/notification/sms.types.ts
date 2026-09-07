/**
 * Master SMS Notification System Types
 * Strongly typed templates, priorities, categories, and multi-tenant settings.
 */

export type SmsTemplateType =
  // Farmer Notifications
  | 'MILK_COLLECTION'
  | 'PAYMENT_SUCCESS'
  | 'ADVANCE_CREATED'
  | 'SETTLEMENT_PROCESSED'
  | 'LEDGER_STATEMENT'
  | 'MONTHLY_STATEMENT'
  | 'PAYMENT_REMINDER'
  | 'RATE_CHANGE'
  // Authentication & Account
  | 'OTP_LOGIN'
  | 'PASSWORD_RESET'
  | 'ACCOUNT_CREATED'
  | 'PASSWORD_CHANGED'
  // Operator Notifications
  | 'OPERATOR_ACCOUNT_CREATED'
  | 'OPERATOR_LOGIN'
  | 'OPERATOR_SESSION_EXPIRING'
  | 'OPERATOR_SESSION_EXPIRED'
  | 'OPERATOR_SESSION_EXTENDED'
  | 'OPERATOR_FORCE_LOGOUT'
  // Admin & System Alerts
  | 'UNUSUAL_COLLECTION_ALERT'
  | 'OPERATOR_SESSION_ALERT'
  | 'OPERATOR_MISSED_SESSION'
  | 'PAYMENT_ALERT'
  // Security Alerts
  | 'SECURITY_LOGIN_ALERT'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_DEACTIVATED'
  // Generic
  | 'GENERAL_NOTIFICATION'
  | 'CUSTOM';

export type SmsPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export type SmsCategory =
  | 'transactional'
  | 'statement'
  | 'authentication'
  | 'security'
  | 'session'
  | 'alert'
  | 'reminder'
  | 'announcement'
  | 'general';

export type SmsStatus =
  | 'QUEUED'
  | 'SENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELLED';

export type SmsProviderType = 'FAST2SMS' | 'MOCK' | 'MSG91' | 'TWILIO';

export type SmsErrorCode =
  | 'SMS_PROVIDER_ERROR'
  | 'SMS_INVALID_NUMBER'
  | 'SMS_TEMPLATE_ERROR'
  | 'SMS_RATE_LIMITED'
  | 'SMS_CONFIGURATION_ERROR';

export interface SendSmsRequest {
  phone: string;
  template: SmsTemplateType;
  variables?: (string | number)[] | Record<string, string | number>;
  tenantId?: string;
  recipientUserId?: string;
  metadata?: Record<string, any>;
  referenceType?: string;
  referenceId?: string;
  customMessage?: string;
  priority?: SmsPriority;
}

export interface SmsResponse {
  success: boolean;
  notificationId?: string;
  providerMessageId?: string;
  status: SmsStatus;
  message?: string;
  error?: string;
  errorCode?: SmsErrorCode;
}

export interface SmsNotificationRecord {
  id: string;
  tenantId: string;
  recipient: string;
  recipientUserId?: string;
  type: SmsTemplateType;
  templateKey?: SmsTemplateType;
  templateId?: string;
  provider: SmsProviderType;
  status: SmsStatus;
  priority?: SmsPriority;
  providerMessageId?: string;
  referenceType?: string;
  referenceId?: string;
  metadata?: Record<string, any>;
  failureReason?: string;
  retryCount: number;
  createdAt: string;
  sentAt?: string;
  deliveredAt?: string;
}

export interface TenantSmsSettings {
  smsEnabled: boolean;
  // Category switches
  milkCollectionSms: boolean;
  paymentSms: boolean;
  advanceSms: boolean;
  ledgerStatementSms: boolean;
  monthlyStatementSms: boolean;
  paymentReminderSms: boolean;
  rateChangeSms: boolean;
  otpSms: boolean; // MANDATORY - cannot be disabled
  securityAlertsSms: boolean; // MANDATORY - cannot be disabled
  operatorSessionSms: boolean;
  adminAlertsSms: boolean;
  lastUpdated?: string;
  updatedBy?: string;
}

export const DEFAULT_SMS_SETTINGS: TenantSmsSettings = {
  smsEnabled: true,
  milkCollectionSms: true,
  paymentSms: true,
  advanceSms: true,
  ledgerStatementSms: true,
  monthlyStatementSms: true,
  paymentReminderSms: true,
  rateChangeSms: true,
  otpSms: true,
  securityAlertsSms: true,
  operatorSessionSms: true,
  adminAlertsSms: true,
};
