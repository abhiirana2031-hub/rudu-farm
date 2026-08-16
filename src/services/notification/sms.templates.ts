import { SmsTemplateType, MasterTemplateDefinition } from "./sms.types";

export const MASTER_SMS_TEMPLATES: Record<SmsTemplateType, MasterTemplateDefinition> = {
  // --- FARMER TEMPLATES ---
  MILK_COLLECTION: {
    key: "MILK_COLLECTION",
    name: "Milk Collection Receipt",
    description: "Sent to farmer when milk collection is recorded at center.",
    recipientRole: "Farmer",
    priority: "HIGH",
    dltEnvVar: "FAST2SMS_MILK_COLLECTION_TEMPLATE_ID",
    requiredVariables: ["FARMER_NAME", "QUANTITY", "MILK_TYPE", "CENTER_NAME", "FAT", "SNF", "RATE", "AMOUNT", "RECEIPT_NO", "DATE", "TIME"],
    formatMessage: (v) =>
      `RUDU FARM: ${v.FARMER_NAME || 'Farmer'}, ${v.QUANTITY || 0}L ${v.MILK_TYPE || 'Mixed'} milk collected at ${v.CENTER_NAME || 'Center'}. FAT ${v.FAT || 0}%, SNF ${v.SNF || 0}%, Rate Rs.${v.RATE || 0}/L, Amount Rs.${v.AMOUNT || 0}. Receipt: ${v.RECEIPT_NO || 'N/A'}. ${v.DATE || ''} ${v.TIME || ''}.`
  },

  PAYMENT_SUCCESS: {
    key: "PAYMENT_SUCCESS",
    name: "Payment Confirmation",
    description: "Sent when a payment is credited/recorded for a farmer.",
    recipientRole: "Farmer",
    priority: "CRITICAL",
    dltEnvVar: "FAST2SMS_PAYMENT_SUCCESS_TEMPLATE_ID",
    requiredVariables: ["FARMER_NAME", "AMOUNT", "TRANSACTION_ID", "DATE"],
    formatMessage: (v) =>
      `RUDU FARM: ${v.FARMER_NAME || 'Farmer'}, payment of Rs.${v.AMOUNT || 0} has been credited/recorded. Transaction ID: ${v.TRANSACTION_ID || 'N/A'}. Date: ${v.DATE || ''}.`
  },

  ADVANCE_CREATED: {
    key: "ADVANCE_CREATED",
    name: "Advance Issued",
    description: "Sent when an advance is recorded in farmer account.",
    recipientRole: "Farmer",
    priority: "HIGH",
    dltEnvVar: "FAST2SMS_ADVANCE_CREATED_TEMPLATE_ID",
    requiredVariables: ["FARMER_NAME", "AMOUNT", "TRANSACTION_ID", "DATE"],
    formatMessage: (v) =>
      `RUDU FARM: ${v.FARMER_NAME || 'Farmer'}, an advance of Rs.${v.AMOUNT || 0} has been recorded. Transaction ID: ${v.TRANSACTION_ID || 'N/A'}. Date: ${v.DATE || ''}.`
  },

  PAYMENT_SETTLEMENT: {
    key: "PAYMENT_SETTLEMENT",
    name: "Settlement Cleared",
    description: "Sent when farmer pending balance is settled.",
    recipientRole: "Farmer",
    priority: "HIGH",
    dltEnvVar: "FAST2SMS_PAYMENT_SETTLEMENT_TEMPLATE_ID",
    requiredVariables: ["FARMER_NAME", "AMOUNT", "RECEIPT_NO", "DATE"],
    formatMessage: (v) =>
      `RUDU FARM: ${v.FARMER_NAME || 'Farmer'}, your settlement of Rs.${v.AMOUNT || 0} has been processed. Receipt: ${v.RECEIPT_NO || 'N/A'}. Date: ${v.DATE || ''}.`
  },

  LEDGER_STATEMENT: {
    key: "LEDGER_STATEMENT",
    name: "Ledger Statement",
    description: "Sent when farmer requests ledger summary.",
    recipientRole: "Farmer",
    priority: "NORMAL",
    dltEnvVar: "FAST2SMS_LEDGER_STATEMENT_TEMPLATE_ID",
    requiredVariables: ["START_DATE", "END_DATE", "EARNINGS", "PAYMENTS", "ADVANCES", "BALANCE"],
    formatMessage: (v) =>
      `RUDU FARM: Your ledger statement from ${v.START_DATE || ''} to ${v.END_DATE || ''}: Milk earnings Rs.${v.EARNINGS || 0}, Payments Rs.${v.PAYMENTS || 0}, Advances Rs.${v.ADVANCES || 0}, Balance Rs.${v.BALANCE || 0}.`
  },

  MONTHLY_STATEMENT: {
    key: "MONTHLY_STATEMENT",
    name: "Monthly Earnings Statement",
    description: "Sent when monthly earnings statement is generated.",
    recipientRole: "Farmer",
    priority: "NORMAL",
    dltEnvVar: "FAST2SMS_MONTHLY_STATEMENT_TEMPLATE_ID",
    requiredVariables: ["FARMER_NAME", "MONTH", "EARNINGS", "PAYMENTS", "BALANCE"],
    formatMessage: (v) =>
      `RUDU FARM: ${v.FARMER_NAME || 'Farmer'}, your ${v.MONTH || 'this month'} milk earnings are Rs.${v.EARNINGS || 0}. Payments: Rs.${v.PAYMENTS || 0}. Balance: Rs.${v.BALANCE || 0}.`
  },

  PAYMENT_REMINDER: {
    key: "PAYMENT_REMINDER",
    name: "Pending Balance Reminder",
    description: "Sent to remind farmer of pending account balance.",
    recipientRole: "Farmer",
    priority: "LOW",
    dltEnvVar: "FAST2SMS_PAYMENT_REMINDER_TEMPLATE_ID",
    requiredVariables: ["FARMER_NAME", "BALANCE"],
    formatMessage: (v) =>
      `RUDU FARM: ${v.FARMER_NAME || 'Farmer'}, your current pending balance is Rs.${v.BALANCE || 0}. Please contact the collection center for payment details.`
  },

  RATE_CHANGE: {
    key: "RATE_CHANGE",
    name: "Milk Rate Chart Update",
    description: "Sent when milk collection rates are revised.",
    recipientRole: "Farmer",
    priority: "NORMAL",
    dltEnvVar: "FAST2SMS_RATE_CHANGE_TEMPLATE_ID",
    requiredVariables: ["DATE", "MILK_TYPE", "RATE"],
    formatMessage: (v) =>
      `RUDU FARM: Milk rate update effective ${v.DATE || ''}: ${v.MILK_TYPE || 'Mixed'} milk rate is now Rs.${v.RATE || 0}/L. Please contact your collection center for details.`
  },

  // --- AUTHENTICATION TEMPLATES ---
  OTP_LOGIN: {
    key: "OTP_LOGIN",
    name: "Login OTP",
    description: "Sent when user requests login verification code.",
    recipientRole: "Security",
    priority: "CRITICAL",
    dltEnvVar: "FAST2SMS_OTP_LOGIN_TEMPLATE_ID",
    requiredVariables: ["OTP", "MINUTES"],
    formatMessage: (v) =>
      `RUDU FARM: Your verification OTP is ${v.OTP || '000000'}. Do not share this OTP with anyone. Valid for ${v.MINUTES || 10} minutes.`
  },

  PASSWORD_RESET: {
    key: "PASSWORD_RESET",
    name: "Password Reset OTP",
    description: "Sent when password reset verification code is requested.",
    recipientRole: "Security",
    priority: "CRITICAL",
    dltEnvVar: "FAST2SMS_PASSWORD_RESET_TEMPLATE_ID",
    requiredVariables: ["OTP", "MINUTES"],
    formatMessage: (v) =>
      `RUDU FARM: Your password reset OTP is ${v.OTP || '000000'}. Do not share this OTP with anyone. Valid for ${v.MINUTES || 10} minutes.`
  },

  ACCOUNT_CREATED: {
    key: "ACCOUNT_CREATED",
    name: "Account Created",
    description: "Sent when a new farmer/user account is registered.",
    recipientRole: "Farmer",
    priority: "HIGH",
    dltEnvVar: "FAST2SMS_ACCOUNT_CREATED_TEMPLATE_ID",
    requiredVariables: ["USER_ID"],
    formatMessage: (v) =>
      `RUDU FARM: Your account has been created successfully. User ID: ${v.USER_ID || 'N/A'}. Please login to access your account.`
  },

  PASSWORD_CHANGED: {
    key: "PASSWORD_CHANGED",
    name: "Password Changed Alert",
    description: "Sent when user changes their account password.",
    recipientRole: "Security",
    priority: "CRITICAL",
    dltEnvVar: "FAST2SMS_PASSWORD_CHANGED_TEMPLATE_ID",
    requiredVariables: ["DATE", "TIME"],
    formatMessage: (v) =>
      `RUDU FARM: Your account password was changed successfully on ${v.DATE || ''} at ${v.TIME || ''}. If you did not make this change, contact your administrator.`
  },

  // --- OPERATOR TEMPLATES ---
  OPERATOR_ACCOUNT_CREATED: {
    key: "OPERATOR_ACCOUNT_CREATED",
    name: "Operator Account Registered",
    description: "Sent when a new operator account is registered.",
    recipientRole: "Operator",
    priority: "HIGH",
    dltEnvVar: "FAST2SMS_OPERATOR_ACCOUNT_CREATED_TEMPLATE_ID",
    requiredVariables: ["USER_ID"],
    formatMessage: (v) =>
      `RUDU FARM: Your operator account has been created. User ID: ${v.USER_ID || 'N/A'}. Please login during your assigned working hours.`
  },

  OPERATOR_LOGIN: {
    key: "OPERATOR_LOGIN",
    name: "Operator Session Started",
    description: "Sent when operator logs in to shift terminal.",
    recipientRole: "Operator",
    priority: "NORMAL",
    dltEnvVar: "FAST2SMS_OPERATOR_LOGIN_TEMPLATE_ID",
    requiredVariables: ["OPERATOR_NAME", "SESSION_TYPE", "TIME", "START_TIME", "END_TIME"],
    formatMessage: (v) =>
      `RUDU FARM: ${v.OPERATOR_NAME || 'Operator'}, your ${v.SESSION_TYPE || 'Shift'} session started at ${v.TIME || ''}. Scheduled session: ${v.START_TIME || ''}-${v.END_TIME || ''}.`
  },

  OPERATOR_SESSION_EXPIRING: {
    key: "OPERATOR_SESSION_EXPIRING",
    name: "Session Expiring Warning",
    description: "Sent when operator session is near conclusion.",
    recipientRole: "Operator",
    priority: "HIGH",
    dltEnvVar: "FAST2SMS_OPERATOR_SESSION_EXPIRING_TEMPLATE_ID",
    requiredVariables: ["OPERATOR_NAME", "END_TIME"],
    formatMessage: (v) =>
      `RUDU FARM: ${v.OPERATOR_NAME || 'Operator'}, your operator session will expire at ${v.END_TIME || ''}. Please complete pending work before logout.`
  },

  OPERATOR_SESSION_EXPIRED: {
    key: "OPERATOR_SESSION_EXPIRED",
    name: "Session Expired Notification",
    description: "Sent when operator working shift session ends.",
    recipientRole: "Operator",
    priority: "NORMAL",
    dltEnvVar: "FAST2SMS_OPERATOR_SESSION_EXPIRED_TEMPLATE_ID",
    requiredVariables: ["OPERATOR_NAME", "TIME"],
    formatMessage: (v) =>
      `RUDU FARM: ${v.OPERATOR_NAME || 'Operator'}, your operator session has ended at ${v.TIME || ''}. Please login again during an authorized session.`
  },

  OPERATOR_SESSION_EXTENDED: {
    key: "OPERATOR_SESSION_EXTENDED",
    name: "Session Extended",
    description: "Sent when admin extends operator shift duration.",
    recipientRole: "Operator",
    priority: "HIGH",
    dltEnvVar: "FAST2SMS_OPERATOR_SESSION_EXTENDED_TEMPLATE_ID",
    requiredVariables: ["OPERATOR_NAME", "ADMIN_NAME", "NEW_END_TIME", "REASON"],
    formatMessage: (v) =>
      `RUDU FARM: ${v.OPERATOR_NAME || 'Operator'}, your session has been extended by ${v.ADMIN_NAME || 'Admin'} until ${v.NEW_END_TIME || ''}. Reason: ${v.REASON || 'Shift Extension'}.`
  },

  OPERATOR_FORCE_LOGOUT: {
    key: "OPERATOR_FORCE_LOGOUT",
    name: "Force Logout Alert",
    description: "Sent when admin forcibly ends operator session.",
    recipientRole: "Operator",
    priority: "HIGH",
    dltEnvVar: "FAST2SMS_OPERATOR_FORCE_LOGOUT_TEMPLATE_ID",
    requiredVariables: ["OPERATOR_NAME", "TIME", "REASON"],
    formatMessage: (v) =>
      `RUDU FARM: ${v.OPERATOR_NAME || 'Operator'}, your operator session was ended by an administrator at ${v.TIME || ''}. Reason: ${v.REASON || 'Administrative action'}.`
  },

  // --- ADMIN ALERTS ---
  ADMIN_COLLECTION_ALERT: {
    key: "ADMIN_COLLECTION_ALERT",
    name: "Large Collection Alert",
    description: "Alerts admin of unusually large milk entry.",
    recipientRole: "Admin",
    priority: "HIGH",
    dltEnvVar: "FAST2SMS_ADMIN_COLLECTION_ALERT_TEMPLATE_ID",
    requiredVariables: ["CENTER_NAME", "OPERATOR_NAME", "FARMER_NAME", "QUANTITY", "TIME"],
    formatMessage: (v) =>
      `RUDU FARM ALERT: Unusual milk collection recorded at ${v.CENTER_NAME || 'Center'}. Operator: ${v.OPERATOR_NAME || 'Staff'}, Farmer: ${v.FARMER_NAME || 'Farmer'}, Quantity: ${v.QUANTITY || 0}L, Time: ${v.TIME || ''}.`
  },

  ADMIN_SESSION_ALERT: {
    key: "ADMIN_SESSION_ALERT",
    name: "Operator Login Alert",
    description: "Alerts admin when operator starts shift.",
    recipientRole: "Admin",
    priority: "NORMAL",
    dltEnvVar: "FAST2SMS_ADMIN_SESSION_ALERT_TEMPLATE_ID",
    requiredVariables: ["OPERATOR_NAME", "TIME", "SESSION_TYPE", "CENTER_NAME"],
    formatMessage: (v) =>
      `RUDU FARM ALERT: Operator ${v.OPERATOR_NAME || 'Staff'} logged in at ${v.TIME || ''} for the ${v.SESSION_TYPE || 'Shift'} session at ${v.CENTER_NAME || 'Center'}.`
  },

  ADMIN_PAYMENT_ALERT: {
    key: "ADMIN_PAYMENT_ALERT",
    name: "Payout Processed Alert",
    description: "Alerts admin when large farmer payout is settled.",
    recipientRole: "Admin",
    priority: "HIGH",
    dltEnvVar: "FAST2SMS_ADMIN_PAYMENT_ALERT_TEMPLATE_ID",
    requiredVariables: ["AMOUNT", "FARMER_NAME", "ADMIN_NAME", "TRANSACTION_ID"],
    formatMessage: (v) =>
      `RUDU FARM ALERT: Payment of Rs.${v.AMOUNT || 0} processed for ${v.FARMER_NAME || 'Farmer'} by ${v.ADMIN_NAME || 'Admin'}. Transaction ID: ${v.TRANSACTION_ID || 'N/A'}.`
  },

  // --- SECURITY / SYSTEM TEMPLATES ---
  SECURITY_LOGIN: {
    key: "SECURITY_LOGIN",
    name: "New Login Alert",
    description: "Alerts user of account access from new device.",
    recipientRole: "Security",
    priority: "CRITICAL",
    dltEnvVar: "FAST2SMS_SECURITY_LOGIN_TEMPLATE_ID",
    requiredVariables: ["TIME", "DEVICE"],
    formatMessage: (v) =>
      `RUDU FARM SECURITY: New login detected for your account at ${v.TIME || ''} from ${v.DEVICE || 'Device'}. If this was not you, contact your administrator.`
  },

  ACCOUNT_LOCKED: {
    key: "ACCOUNT_LOCKED",
    name: "Account Locked Alert",
    description: "Alerts user when account is locked due to failed attempts.",
    recipientRole: "Security",
    priority: "CRITICAL",
    dltEnvVar: "FAST2SMS_ACCOUNT_LOCKED_TEMPLATE_ID",
    requiredVariables: [],
    formatMessage: () =>
      `RUDU FARM SECURITY: Your account has been temporarily locked due to multiple failed login attempts. Contact your administrator if required.`
  },

  ACCOUNT_DEACTIVATED: {
    key: "ACCOUNT_DEACTIVATED",
    name: "Account Deactivated",
    description: "Sent when an account is disabled by admin.",
    recipientRole: "Security",
    priority: "HIGH",
    dltEnvVar: "FAST2SMS_ACCOUNT_DEACTIVATED_TEMPLATE_ID",
    requiredVariables: [],
    formatMessage: () =>
      `RUDU FARM: Your account has been deactivated. Please contact your administrator for assistance.`
  },

  GENERAL_NOTIFICATION: {
    key: "GENERAL_NOTIFICATION",
    name: "General Broadcast Message",
    description: "System message sent by authorized administrators.",
    recipientRole: "Admin",
    priority: "NORMAL",
    dltEnvVar: "FAST2SMS_GENERAL_NOTIFICATION_TEMPLATE_ID",
    requiredVariables: ["MESSAGE"],
    formatMessage: (v) =>
      `RUDU FARM: ${v.MESSAGE || 'Important notification.'}`
  }
};
