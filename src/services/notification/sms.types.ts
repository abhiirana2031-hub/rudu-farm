export type SmsTemplateType =
  | "MILK_COLLECTION"
  | "PAYMENT_SUCCESS"
  | "ADVANCE_CREATED"
  | "PAYMENT_SETTLEMENT"
  | "LEDGER_STATEMENT"
  | "MONTHLY_STATEMENT"
  | "PAYMENT_REMINDER"
  | "RATE_CHANGE"
  | "OTP_LOGIN"
  | "PASSWORD_RESET"
  | "ACCOUNT_CREATED"
  | "PASSWORD_CHANGED"
  | "OPERATOR_ACCOUNT_CREATED"
  | "OPERATOR_LOGIN"
  | "OPERATOR_SESSION_EXPIRING"
  | "OPERATOR_SESSION_EXPIRED"
  | "OPERATOR_SESSION_EXTENDED"
  | "OPERATOR_FORCE_LOGOUT"
  | "ADMIN_COLLECTION_ALERT"
  | "ADMIN_SESSION_ALERT"
  | "ADMIN_PAYMENT_ALERT"
  | "SECURITY_LOGIN"
  | "ACCOUNT_LOCKED"
  | "ACCOUNT_DEACTIVATED"
  | "GENERAL_NOTIFICATION";

export type SmsPriority = "CRITICAL" | "HIGH" | "NORMAL" | "LOW";

export type SmsStatus =
  | "QUEUED"
  | "SENDING"
  | "SENT"
  | "DELIVERED"
  | "FAILED"
  | "CANCELLED";

export interface MasterTemplateDefinition {
  key: SmsTemplateType;
  name: string;
  description: string;
  recipientRole: "Farmer" | "Operator" | "Admin" | "Security";
  priority: SmsPriority;
  dltEnvVar: string;
  requiredVariables: string[];
  formatMessage: (variables: Record<string, any>) => string;
}

export interface SmsNotificationPayload {
  tenantId: string;
  phone: string;
  template: SmsTemplateType;
  variables: Record<string, any>;
  referenceType?: string;
  referenceId?: string;
  metadata?: Record<string, any>;
}

export interface ISmsProviderResult {
  success: boolean;
  providerMessageId?: string;
  rawResponse?: any;
  error?: string;
  errorCode?: string;
}

export interface ISmsProvider {
  name: string;
  send(payload: SmsNotificationPayload): Promise<ISmsProviderResult>;
}

export interface SmsLogRecord {
  id: string;
  tenantId: string;
  recipient: string;
  recipientUserId?: string;
  type: SmsTemplateType;
  templateKey: SmsTemplateType;
  templateId: string;
  provider: "FAST2SMS" | "MOCK";
  status: SmsStatus;
  providerMessageId?: string;
  referenceType?: string;
  referenceId?: string;
  metadata?: Record<string, any>;
  failureReason?: string;
  retryCount: number;
  createdAt: any;
  sentAt?: any;
  deliveredAt?: any;
}

export interface NotificationSettings {
  smsEnabled: boolean;
  milkCollectionSms: boolean;
  paymentSms: boolean;
  advanceSms: boolean;
  ledgerStatementSms: boolean;
  monthlyStatementSms: boolean;
  rateChangeSms: boolean;
  otpSms: boolean;
  securityAlertsSms: boolean;
  operatorSessionAlertsSms: boolean;
}
