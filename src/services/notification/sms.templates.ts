/**
 * Master SMS Template Registry
 * Centralized definition for all transactional, authentication, session, and security SMS templates.
 * DLT-compliant with variable interpolation and environment variable mapping.
 */

import { SmsTemplateType, SmsPriority, SmsCategory } from './sms.types';

export interface SmsTemplateDefinition {
  key: SmsTemplateType;
  name: string;
  description: string;
  recipient: 'farmer' | 'operator' | 'admin' | 'user' | 'all';
  trigger: string;
  envTemplateKey: string;
  requiredVariables: string[];
  priority: SmsPriority;
  category: SmsCategory;
  defaultTemplateText: string;
  isMandatory?: boolean;
  interpolate: (vars: (string | number)[] | Record<string, string | number>) => string;
}

const getVar = (
  vars: (string | number)[] | Record<string, string | number>,
  index: number,
  namedKey: string,
  fallback: string = ''
): string => {
  if (Array.isArray(vars)) {
    return vars[index] !== undefined ? String(vars[index]) : fallback;
  }
  if (vars && typeof vars === 'object') {
    return vars[namedKey] !== undefined ? String(vars[namedKey]) : fallback;
  }
  return fallback;
};

export const MASTER_SMS_TEMPLATES: Record<SmsTemplateType, SmsTemplateDefinition> = {
  // ─── A. Farmer Templates ─────────────────────────────────────────
  MILK_COLLECTION: {
    key: 'MILK_COLLECTION',
    name: 'Milk Collection Intake',
    description: 'Dispatched to farmer upon successful milk intake at collection center.',
    recipient: 'farmer',
    trigger: 'Milk intake recorded by operator',
    envTemplateKey: 'FAST2SMS_MILK_COLLECTION_TEMPLATE_ID',
    requiredVariables: ['FARMER_NAME', 'QUANTITY', 'MILK_TYPE', 'CENTER_NAME', 'FAT', 'SNF', 'RATE', 'AMOUNT', 'RECEIPT_NO', 'DATE', 'TIME'],
    priority: 'HIGH',
    category: 'transactional',
    defaultTemplateText: 'RUDU FARM: {FARMER_NAME}, {QUANTITY}L {MILK_TYPE} milk collected at {CENTER_NAME}. FAT {FAT}%, SNF {SNF}%, Rate Rs.{RATE}/L, Amount Rs.{AMOUNT}. Receipt: {RECEIPT_NO}. {DATE} {TIME}.',
    interpolate: (v) =>
      `RUDU FARM: ${getVar(v, 0, 'FARMER_NAME', 'Member')}, ${getVar(v, 1, 'QUANTITY', '0')}L ${getVar(v, 2, 'MILK_TYPE', 'milk')} collected at ${getVar(v, 3, 'CENTER_NAME', 'Dairy Hub')}. FAT ${getVar(v, 4, 'FAT', '0')}%, SNF ${getVar(v, 5, 'SNF', '0')}%, Rate Rs.${getVar(v, 6, 'RATE', '0')}/L, Amount Rs.${getVar(v, 7, 'AMOUNT', '0')}. Receipt: ${getVar(v, 8, 'RECEIPT_NO', 'REC')}. ${getVar(v, 9, 'DATE', '')} ${getVar(v, 10, 'TIME', '')}.`,
  },

  PAYMENT_SUCCESS: {
    key: 'PAYMENT_SUCCESS',
    name: 'Payment / Payout Success',
    description: 'Dispatched when farmer payment or bank settlement is completed.',
    recipient: 'farmer',
    trigger: 'Payment disbursement completed by admin',
    envTemplateKey: 'FAST2SMS_PAYMENT_TEMPLATE_ID',
    requiredVariables: ['FARMER_NAME', 'AMOUNT', 'TRANSACTION_ID', 'DATE'],
    priority: 'CRITICAL',
    category: 'transactional',
    defaultTemplateText: 'RUDU FARM: {FARMER_NAME}, payment of Rs.{AMOUNT} has been credited/recorded. Transaction ID: {TRANSACTION_ID}. Date: {DATE}.',
    interpolate: (v) =>
      `RUDU FARM: ${getVar(v, 0, 'FARMER_NAME', 'Member')}, payment of Rs.${getVar(v, 1, 'AMOUNT', '0')} has been credited/recorded. Transaction ID: ${getVar(v, 2, 'TRANSACTION_ID', 'TXN')}. Date: ${getVar(v, 3, 'DATE', '')}.`,
  },

  ADVANCE_CREATED: {
    key: 'ADVANCE_CREATED',
    name: 'Advance Issued',
    description: 'Dispatched when cattle feed or cash advance is issued to farmer.',
    recipient: 'farmer',
    trigger: 'Advance debited in farmer ledger',
    envTemplateKey: 'FAST2SMS_ADVANCE_TEMPLATE_ID',
    requiredVariables: ['FARMER_NAME', 'AMOUNT', 'TRANSACTION_ID', 'DATE'],
    priority: 'HIGH',
    category: 'transactional',
    defaultTemplateText: 'RUDU FARM: {FARMER_NAME}, an advance of Rs.{AMOUNT} has been recorded. Transaction ID: {TRANSACTION_ID}. Date: {DATE}.',
    interpolate: (v) =>
      `RUDU FARM: ${getVar(v, 0, 'FARMER_NAME', 'Member')}, an advance of Rs.${getVar(v, 1, 'AMOUNT', '0')} has been recorded. Transaction ID: ${getVar(v, 2, 'TRANSACTION_ID', 'TXN')}. Date: ${getVar(v, 3, 'DATE', '')}.`,
  },

  SETTLEMENT_PROCESSED: {
    key: 'SETTLEMENT_PROCESSED',
    name: 'Settlement Processed',
    description: 'Dispatched when cycle settlement balance is processed.',
    recipient: 'farmer',
    trigger: 'Farmer cycle balance cleared',
    envTemplateKey: 'FAST2SMS_PAYMENT_TEMPLATE_ID',
    requiredVariables: ['FARMER_NAME', 'AMOUNT', 'RECEIPT_NO', 'DATE'],
    priority: 'HIGH',
    category: 'transactional',
    defaultTemplateText: 'RUDU FARM: {FARMER_NAME}, your settlement of Rs.{AMOUNT} has been processed. Receipt: {RECEIPT_NO}. Date: {DATE}.',
    interpolate: (v) =>
      `RUDU FARM: ${getVar(v, 0, 'FARMER_NAME', 'Member')}, your settlement of Rs.${getVar(v, 1, 'AMOUNT', '0')} has been processed. Receipt: ${getVar(v, 2, 'RECEIPT_NO', 'REC')}. Date: ${getVar(v, 3, 'DATE', '')}.`,
  },

  LEDGER_STATEMENT: {
    key: 'LEDGER_STATEMENT',
    name: 'Ledger Statement Summary',
    description: 'Dispatched when a periodic ledger summary is requested.',
    recipient: 'farmer',
    trigger: 'Ledger statement export/request',
    envTemplateKey: 'FAST2SMS_LEDGER_STATEMENT_TEMPLATE_ID',
    requiredVariables: ['START_DATE', 'END_DATE', 'EARNINGS', 'PAYMENTS', 'ADVANCES', 'BALANCE'],
    priority: 'NORMAL',
    category: 'statement',
    defaultTemplateText: 'RUDU FARM: Your ledger statement from {START_DATE} to {END_DATE}: Milk earnings Rs.{EARNINGS}, Payments Rs.{PAYMENTS}, Advances Rs.{ADVANCES}, Balance Rs.{BALANCE}.',
    interpolate: (v) =>
      `RUDU FARM: Your ledger statement from ${getVar(v, 0, 'START_DATE', '')} to ${getVar(v, 1, 'END_DATE', '')}: Milk earnings Rs.${getVar(v, 2, 'EARNINGS', '0')}, Payments Rs.${getVar(v, 3, 'PAYMENTS', '0')}, Advances Rs.${getVar(v, 4, 'ADVANCES', '0')}, Balance Rs.${getVar(v, 5, 'BALANCE', '0')}.`,
  },

  MONTHLY_STATEMENT: {
    key: 'MONTHLY_STATEMENT',
    name: 'Monthly Statement',
    description: 'Monthly summary of milk supply and earnings.',
    recipient: 'farmer',
    trigger: 'Monthly billing cycle finalization',
    envTemplateKey: 'FAST2SMS_MONTHLY_STATEMENT_TEMPLATE_ID',
    requiredVariables: ['FARMER_NAME', 'MONTH', 'EARNINGS', 'PAYMENTS', 'BALANCE'],
    priority: 'NORMAL',
    category: 'statement',
    defaultTemplateText: 'RUDU FARM: {FARMER_NAME}, your {MONTH} milk earnings are Rs.{EARNINGS}. Payments: Rs.{PAYMENTS}. Balance: Rs.{BALANCE}.',
    interpolate: (v) =>
      `RUDU FARM: ${getVar(v, 0, 'FARMER_NAME', 'Member')}, your ${getVar(v, 1, 'MONTH', 'monthly')} milk earnings are Rs.${getVar(v, 2, 'EARNINGS', '0')}. Payments: Rs.${getVar(v, 3, 'PAYMENTS', '0')}. Balance: Rs.${getVar(v, 4, 'BALANCE', '0')}.`,
  },

  PAYMENT_REMINDER: {
    key: 'PAYMENT_REMINDER',
    name: 'Payment Reminder',
    description: 'Reminder sent to farmers with pending balance or payout clearance.',
    recipient: 'farmer',
    trigger: 'Pending payout follow-up',
    envTemplateKey: 'FAST2SMS_PAYMENT_REMINDER_TEMPLATE_ID',
    requiredVariables: ['FARMER_NAME', 'BALANCE'],
    priority: 'LOW',
    category: 'reminder',
    defaultTemplateText: 'RUDU FARM: {FARMER_NAME}, your current pending balance is Rs.{BALANCE}. Please contact the collection center for payment details.',
    interpolate: (v) =>
      `RUDU FARM: ${getVar(v, 0, 'FARMER_NAME', 'Member')}, your current pending balance is Rs.${getVar(v, 1, 'BALANCE', '0')}. Please contact the collection center for payment details.`,
  },

  RATE_CHANGE: {
    key: 'RATE_CHANGE',
    name: 'Milk Rate Matrix Revision',
    description: 'Notification dispatched when base rates or fat/SNF multipliers update.',
    recipient: 'farmer',
    trigger: 'Admin updates dairy rate chart',
    envTemplateKey: 'FAST2SMS_RATE_CHANGE_TEMPLATE_ID',
    requiredVariables: ['DATE', 'MILK_TYPE', 'RATE'],
    priority: 'NORMAL',
    category: 'announcement',
    defaultTemplateText: 'RUDU FARM: Milk rate update effective {DATE}: {MILK_TYPE} milk rate is now Rs.{RATE}/L. Please contact your collection center for details.',
    interpolate: (v) =>
      `RUDU FARM: Milk rate update effective ${getVar(v, 0, 'DATE', 'today')}: ${getVar(v, 1, 'MILK_TYPE', 'Cow/Buffalo')} milk rate is now Rs.${getVar(v, 2, 'RATE', '0')}/L. Please contact your collection center for details.`,
  },

  // ─── B. Authentication & Security (MANDATORY) ────────────────────
  OTP_LOGIN: {
    key: 'OTP_LOGIN',
    name: 'Login Verification OTP',
    description: 'Secure 6-digit one-time password for farmer and staff login.',
    recipient: 'user',
    trigger: 'OTP login requested',
    envTemplateKey: 'FAST2SMS_OTP_TEMPLATE_ID',
    requiredVariables: ['OTP', 'MINUTES'],
    priority: 'CRITICAL',
    category: 'authentication',
    isMandatory: true,
    defaultTemplateText: 'RUDU FARM: Your verification OTP is {OTP}. Do not share this OTP with anyone. Valid for {MINUTES} minutes.',
    interpolate: (v) =>
      `RUDU FARM: Your verification OTP is ${getVar(v, 0, 'OTP', '000000')}. Do not share this OTP with anyone. Valid for ${getVar(v, 1, 'MINUTES', '10')} minutes.`,
  },

  PASSWORD_RESET: {
    key: 'PASSWORD_RESET',
    name: 'Password Reset OTP',
    description: 'Verification code to reset portal password.',
    recipient: 'user',
    trigger: 'Password reset initiated',
    envTemplateKey: 'FAST2SMS_PASSWORD_RESET_TEMPLATE_ID',
    requiredVariables: ['OTP', 'MINUTES'],
    priority: 'CRITICAL',
    category: 'authentication',
    isMandatory: true,
    defaultTemplateText: 'RUDU FARM: Your password reset OTP is {OTP}. Do not share this OTP with anyone. Valid for {MINUTES} minutes.',
    interpolate: (v) =>
      `RUDU FARM: Your password reset OTP is ${getVar(v, 0, 'OTP', '000000')}. Do not share this OTP with anyone. Valid for ${getVar(v, 1, 'MINUTES', '10')} minutes.`,
  },

  ACCOUNT_CREATED: {
    key: 'ACCOUNT_CREATED',
    name: 'Account Created Confirmation',
    description: 'Sent upon successful registration of farmer or operator.',
    recipient: 'user',
    trigger: 'New farmer/user profile created',
    envTemplateKey: 'FAST2SMS_ACCOUNT_CREATED_TEMPLATE_ID',
    requiredVariables: ['USER_ID'],
    priority: 'HIGH',
    category: 'authentication',
    defaultTemplateText: 'RUDU FARM: Your account has been created successfully. User ID: {USER_ID}. Please login to access your account.',
    interpolate: (v) =>
      `RUDU FARM: Your account has been created successfully. User ID: ${getVar(v, 0, 'USER_ID', '')}. Please login to access your account.`,
  },

  PASSWORD_CHANGED: {
    key: 'PASSWORD_CHANGED',
    name: 'Password Changed Security Alert',
    description: 'Dispatched immediately when account credentials change.',
    recipient: 'user',
    trigger: 'Password changed successfully',
    envTemplateKey: 'FAST2SMS_GENERAL_NOTIFICATION_TEMPLATE_ID',
    requiredVariables: ['DATE', 'TIME'],
    priority: 'CRITICAL',
    category: 'security',
    isMandatory: true,
    defaultTemplateText: 'RUDU FARM: Your account password was changed successfully on {DATE} at {TIME}. If you did not make this change, contact your administrator.',
    interpolate: (v) =>
      `RUDU FARM: Your account password was changed successfully on ${getVar(v, 0, 'DATE', '')} at ${getVar(v, 1, 'TIME', '')}. If you did not make this change, contact your administrator.`,
  },

  // ─── C. Operator Notifications ──────────────────────────────────
  OPERATOR_ACCOUNT_CREATED: {
    key: 'OPERATOR_ACCOUNT_CREATED',
    name: 'Operator Account Provisioned',
    description: 'Welcome SMS for newly added staff operators.',
    recipient: 'operator',
    trigger: 'Admin creates operator profile',
    envTemplateKey: 'FAST2SMS_ACCOUNT_CREATED_TEMPLATE_ID',
    requiredVariables: ['USER_ID'],
    priority: 'HIGH',
    category: 'authentication',
    defaultTemplateText: 'RUDU FARM: Your operator account has been created. User ID: {USER_ID}. Please login during your assigned working hours.',
    interpolate: (v) =>
      `RUDU FARM: Your operator account has been created. User ID: ${getVar(v, 0, 'USER_ID', '')}. Please login during your assigned working hours.`,
  },

  OPERATOR_LOGIN: {
    key: 'OPERATOR_LOGIN',
    name: 'Operator Session Started',
    description: 'Sent when operator logs in during authorized schedule window.',
    recipient: 'operator',
    trigger: 'Operator logs in with valid schedule',
    envTemplateKey: 'FAST2SMS_OPERATOR_LOGIN_TEMPLATE_ID',
    requiredVariables: ['OPERATOR_NAME', 'SESSION_TYPE', 'TIME', 'START_TIME', 'END_TIME'],
    priority: 'NORMAL',
    category: 'session',
    defaultTemplateText: 'RUDU FARM: {OPERATOR_NAME}, your {SESSION_TYPE} session started at {TIME}. Scheduled session: {START_TIME}-{END_TIME}.',
    interpolate: (v) =>
      `RUDU FARM: ${getVar(v, 0, 'OPERATOR_NAME', 'Operator')}, your ${getVar(v, 1, 'SESSION_TYPE', 'morning')} session started at ${getVar(v, 2, 'TIME', '')}. Scheduled session: ${getVar(v, 3, 'START_TIME', '')}-${getVar(v, 4, 'END_TIME', '')}.`,
  },

  OPERATOR_SESSION_EXPIRING: {
    key: 'OPERATOR_SESSION_EXPIRING',
    name: 'Operator Session Expiring Warning',
    description: 'Warning dispatched 15 minutes prior to mandatory session closure.',
    recipient: 'operator',
    trigger: 'Session approaching scheduled end',
    envTemplateKey: 'FAST2SMS_SESSION_EXPIRY_TEMPLATE_ID',
    requiredVariables: ['OPERATOR_NAME', 'END_TIME'],
    priority: 'HIGH',
    category: 'session',
    defaultTemplateText: 'RUDU FARM: {OPERATOR_NAME}, your operator session will expire at {END_TIME}. Please complete pending work before logout.',
    interpolate: (v) =>
      `RUDU FARM: ${getVar(v, 0, 'OPERATOR_NAME', 'Operator')}, your operator session will expire at ${getVar(v, 1, 'END_TIME', '')}. Please complete pending work before logout.`,
  },

  OPERATOR_SESSION_EXPIRED: {
    key: 'OPERATOR_SESSION_EXPIRED',
    name: 'Operator Session Expired',
    description: 'Sent upon automated session timeout.',
    recipient: 'operator',
    trigger: 'Operator session expires automatically',
    envTemplateKey: 'FAST2SMS_OPERATOR_LOGOUT_TEMPLATE_ID',
    requiredVariables: ['OPERATOR_NAME', 'TIME'],
    priority: 'HIGH',
    category: 'session',
    defaultTemplateText: 'RUDU FARM: {OPERATOR_NAME}, your operator session has ended at {TIME}. Please login again during an authorized session.',
    interpolate: (v) =>
      `RUDU FARM: ${getVar(v, 0, 'OPERATOR_NAME', 'Operator')}, your operator session has ended at ${getVar(v, 1, 'TIME', '')}. Please login again during an authorized session.`,
  },

  OPERATOR_SESSION_EXTENDED: {
    key: 'OPERATOR_SESSION_EXTENDED',
    name: 'Operator Session Extended by Admin',
    description: 'Dispatched when admin grants an emergency session time extension.',
    recipient: 'operator',
    trigger: 'Admin extends operator shift',
    envTemplateKey: 'FAST2SMS_GENERAL_NOTIFICATION_TEMPLATE_ID',
    requiredVariables: ['OPERATOR_NAME', 'ADMIN_NAME', 'NEW_END_TIME', 'REASON'],
    priority: 'HIGH',
    category: 'session',
    defaultTemplateText: 'RUDU FARM: {OPERATOR_NAME}, your session has been extended by {ADMIN_NAME} until {NEW_END_TIME}. Reason: {REASON}.',
    interpolate: (v) =>
      `RUDU FARM: ${getVar(v, 0, 'OPERATOR_NAME', 'Operator')}, your session has been extended by ${getVar(v, 1, 'ADMIN_NAME', 'Administrator')} until ${getVar(v, 2, 'NEW_END_TIME', '')}. Reason: ${getVar(v, 3, 'REASON', 'Emergency work')}.`,
  },

  OPERATOR_FORCE_LOGOUT: {
    key: 'OPERATOR_FORCE_LOGOUT',
    name: 'Operator Force Logout Notice',
    description: 'Dispatched when an administrator manually terminates an operator session.',
    recipient: 'operator',
    trigger: 'Admin invokes force logout',
    envTemplateKey: 'FAST2SMS_OPERATOR_LOGOUT_TEMPLATE_ID',
    requiredVariables: ['OPERATOR_NAME', 'TIME', 'REASON'],
    priority: 'CRITICAL',
    category: 'session',
    defaultTemplateText: 'RUDU FARM: {OPERATOR_NAME}, your operator session was ended by an administrator at {TIME}. Reason: {REASON}.',
    interpolate: (v) =>
      `RUDU FARM: ${getVar(v, 0, 'OPERATOR_NAME', 'Operator')}, your operator session was ended by an administrator at ${getVar(v, 1, 'TIME', '')}. Reason: ${getVar(v, 2, 'REASON', 'Administrative override')}.`,
  },

  // ─── D. Admin & System Alerts ────────────────────────────────────
  UNUSUAL_COLLECTION_ALERT: {
    key: 'UNUSUAL_COLLECTION_ALERT',
    name: 'Unusual Intake Anomaly Alert',
    description: 'High priority alert to admin when an extraordinarily large milk intake is recorded.',
    recipient: 'admin',
    trigger: 'Single intake volume exceeds threshold (> 100L)',
    envTemplateKey: 'FAST2SMS_GENERAL_NOTIFICATION_TEMPLATE_ID',
    requiredVariables: ['CENTER_NAME', 'OPERATOR_NAME', 'FARMER_NAME', 'QUANTITY', 'TIME'],
    priority: 'HIGH',
    category: 'alert',
    defaultTemplateText: 'RUDU FARM ALERT: Unusual milk collection recorded at {CENTER_NAME}. Operator: {OPERATOR_NAME}, Farmer: {FARMER_NAME}, Quantity: {QUANTITY}L, Time: {TIME}.',
    interpolate: (v) =>
      `RUDU FARM ALERT: Unusual milk collection recorded at ${getVar(v, 0, 'CENTER_NAME', 'Dairy Hub')}. Operator: ${getVar(v, 1, 'OPERATOR_NAME', '')}, Farmer: ${getVar(v, 2, 'FARMER_NAME', '')}, Quantity: ${getVar(v, 3, 'QUANTITY', '0')}L, Time: ${getVar(v, 4, 'TIME', '')}.`,
  },

  OPERATOR_SESSION_ALERT: {
    key: 'OPERATOR_SESSION_ALERT',
    name: 'Operator Shift Check-in Alert',
    description: 'Admin notification when an operator opens a center shift.',
    recipient: 'admin',
    trigger: 'Operator shift check-in',
    envTemplateKey: 'FAST2SMS_GENERAL_NOTIFICATION_TEMPLATE_ID',
    requiredVariables: ['OPERATOR_NAME', 'TIME', 'SESSION_TYPE', 'CENTER_NAME'],
    priority: 'NORMAL',
    category: 'alert',
    defaultTemplateText: 'RUDU FARM ALERT: Operator {OPERATOR_NAME} logged in at {TIME} for the {SESSION_TYPE} session at {CENTER_NAME}.',
    interpolate: (v) =>
      `RUDU FARM ALERT: Operator ${getVar(v, 0, 'OPERATOR_NAME', '')} logged in at ${getVar(v, 1, 'TIME', '')} for the ${getVar(v, 2, 'SESSION_TYPE', 'morning')} session at ${getVar(v, 3, 'CENTER_NAME', 'BMC')}.`,
  },

  OPERATOR_MISSED_SESSION: {
    key: 'OPERATOR_MISSED_SESSION',
    name: 'Operator Missed Shift Alert',
    description: 'Alert sent when scheduled center session fails to open on time.',
    recipient: 'admin',
    trigger: 'Center shift window opened without operator login',
    envTemplateKey: 'FAST2SMS_GENERAL_NOTIFICATION_TEMPLATE_ID',
    requiredVariables: ['OPERATOR_NAME', 'SESSION_TYPE', 'CENTER_NAME', 'START_TIME', 'END_TIME'],
    priority: 'HIGH',
    category: 'alert',
    defaultTemplateText: 'RUDU FARM ALERT: Operator {OPERATOR_NAME} did not login for the scheduled {SESSION_TYPE} session at {CENTER_NAME}. Scheduled time: {START_TIME}-{END_TIME}.',
    interpolate: (v) =>
      `RUDU FARM ALERT: Operator ${getVar(v, 0, 'OPERATOR_NAME', '')} did not login for the scheduled ${getVar(v, 1, 'SESSION_TYPE', 'morning')} session at ${getVar(v, 2, 'CENTER_NAME', 'BMC')}. Scheduled time: ${getVar(v, 3, 'START_TIME', '')}-${getVar(v, 4, 'END_TIME', '')}.`,
  },

  PAYMENT_ALERT: {
    key: 'PAYMENT_ALERT',
    name: 'High-Value Payment Disbursed Alert',
    description: 'Executive alert for batch or large payouts.',
    recipient: 'admin',
    trigger: 'Payout exceeds threshold (e.g. > Rs. 50,000)',
    envTemplateKey: 'FAST2SMS_GENERAL_NOTIFICATION_TEMPLATE_ID',
    requiredVariables: ['AMOUNT', 'FARMER_NAME', 'ADMIN_NAME', 'TRANSACTION_ID'],
    priority: 'HIGH',
    category: 'alert',
    defaultTemplateText: 'RUDU FARM ALERT: Payment of Rs.{AMOUNT} processed for {FARMER_NAME} by {ADMIN_NAME}. Transaction ID: {TRANSACTION_ID}.',
    interpolate: (v) =>
      `RUDU FARM ALERT: Payment of Rs.${getVar(v, 0, 'AMOUNT', '0')} processed for ${getVar(v, 1, 'FARMER_NAME', '')} by ${getVar(v, 2, 'ADMIN_NAME', 'Admin')}. Transaction ID: ${getVar(v, 3, 'TRANSACTION_ID', 'TXN')}.`,
  },

  // ─── E. Security Alerts ──────────────────────────────────────────
  SECURITY_LOGIN_ALERT: {
    key: 'SECURITY_LOGIN_ALERT',
    name: 'New Device Login Alert',
    description: 'Dispatched to user when a login occurs from an unrecognized device/IP.',
    recipient: 'user',
    trigger: 'New device authentication detected',
    envTemplateKey: 'FAST2SMS_GENERAL_NOTIFICATION_TEMPLATE_ID',
    requiredVariables: ['TIME', 'DEVICE'],
    priority: 'CRITICAL',
    category: 'security',
    isMandatory: true,
    defaultTemplateText: 'RUDU FARM SECURITY: New login detected for your account at {TIME} from {DEVICE}. If this was not you, contact your administrator.',
    interpolate: (v) =>
      `RUDU FARM SECURITY: New login detected for your account at ${getVar(v, 0, 'TIME', '')} from ${getVar(v, 1, 'DEVICE', 'Web Browser')}. If this was not you, contact your administrator.`,
  },

  ACCOUNT_LOCKED: {
    key: 'ACCOUNT_LOCKED',
    name: 'Account Temporarily Locked Alert',
    description: 'Alert sent when account is locked due to repeated PIN/password failures.',
    recipient: 'user',
    trigger: 'Exceeded maximum failed login attempts (5 tries)',
    envTemplateKey: 'FAST2SMS_GENERAL_NOTIFICATION_TEMPLATE_ID',
    requiredVariables: [],
    priority: 'CRITICAL',
    category: 'security',
    isMandatory: true,
    defaultTemplateText: 'RUDU FARM SECURITY: Your account has been temporarily locked due to multiple failed login attempts. Contact your administrator if required.',
    interpolate: () =>
      `RUDU FARM SECURITY: Your account has been temporarily locked due to multiple failed login attempts. Contact your administrator if required.`,
  },

  ACCOUNT_DEACTIVATED: {
    key: 'ACCOUNT_DEACTIVATED',
    name: 'Account Deactivated Notice',
    description: 'Notification dispatched when user profile is disabled by administration.',
    recipient: 'user',
    trigger: 'Admin deactivates farmer/operator account',
    envTemplateKey: 'FAST2SMS_GENERAL_NOTIFICATION_TEMPLATE_ID',
    requiredVariables: [],
    priority: 'CRITICAL',
    category: 'security',
    isMandatory: true,
    defaultTemplateText: 'RUDU FARM: Your account has been deactivated. Please contact your administrator for assistance.',
    interpolate: () =>
      `RUDU FARM: Your account has been deactivated. Please contact your administrator for assistance.`,
  },

  // ─── F. Generic & Custom Notifications ───────────────────────────
  GENERAL_NOTIFICATION: {
    key: 'GENERAL_NOTIFICATION',
    name: 'General Broadcast Notification',
    description: 'Controlled broadcast announcement dispatched by authorized administrators.',
    recipient: 'all',
    trigger: 'Admin triggers announcement broadcast',
    envTemplateKey: 'FAST2SMS_GENERAL_NOTIFICATION_TEMPLATE_ID',
    requiredVariables: ['MESSAGE'],
    priority: 'NORMAL',
    category: 'general',
    defaultTemplateText: 'RUDU FARM: {MESSAGE}',
    interpolate: (v) => `RUDU FARM: ${getVar(v, 0, 'MESSAGE', 'Important update.')}`,
  },

  CUSTOM: {
    key: 'CUSTOM',
    name: 'Custom Admin Message',
    description: 'Direct transactional test or custom message dispatch.',
    recipient: 'all',
    trigger: 'Admin test SMS or custom notification',
    envTemplateKey: 'FAST2SMS_GENERAL_NOTIFICATION_TEMPLATE_ID',
    requiredVariables: [],
    priority: 'NORMAL',
    category: 'general',
    defaultTemplateText: 'RUDU FARM: {MESSAGE}',
    interpolate: (v) => `RUDU FARM: ${getVar(v, 0, 'MESSAGE', 'Test notification.')}`,
  },
};
