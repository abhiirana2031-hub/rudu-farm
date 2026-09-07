/**
 * Server-Side SMS API Middleware & Handlers
 * Operates strictly in Node.js / Server runtime.
 * Never exposes FAST2SMS_API_KEY to browser bundles.
 */

import { Fast2SMSProvider } from '../services/notification/providers/fast2sms.provider';
import { MockSMSProvider } from '../services/notification/providers/mock.provider';
import { SMSProvider } from '../services/notification/providers/sms-provider.interface';
import { SendSmsRequest, SmsResponse } from '../services/notification/sms.types';
import { MASTER_SMS_TEMPLATES } from '../services/notification/sms.templates';

declare const process: any;

// In-memory rate limiting tracker (per phone / per IP)
interface RateLimitEntry {
  count: number;
  firstRequest: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up stale rate limit entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now - entry.firstRequest > 600000) {
      rateLimitMap.delete(key);
    }
  }
}, 600000);

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now - record.firstRequest > windowMs) {
    rateLimitMap.set(key, { count: 1, firstRequest: now });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count += 1;
  return true;
}

/**
 * Clean & normalize Indian phone numbers to 10 digits
 */
export function normalizePhoneNumber(rawPhone: string): string | null {
  if (!rawPhone) return null;
  // Remove all non-numeric characters
  const digits = rawPhone.replace(/\D/g, '');
  
  // 10-digit number starting with 6-9
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return digits;
  }
  // 11-digit number with leading 0 (e.g. 09876543210)
  if (digits.length === 11 && digits.startsWith('0') && /^[6-9]\d{9}$/.test(digits.slice(1))) {
    return digits.slice(1);
  }
  // 12-digit number with +91 (e.g. 919876543210)
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]\d{9}$/.test(digits.slice(2))) {
    return digits.slice(2);
  }

  return null;
}

/**
 * Instantiate Server-side SMS Provider based on environment variables
 */
export function getServerSMSProvider(): SMSProvider {
  const providerType = (process.env.SMS_PROVIDER || 'mock').toLowerCase();

  if (providerType === 'fast2sms') {
    const templates: Record<string, string | undefined> = {};
    for (const [key, def] of Object.entries(MASTER_SMS_TEMPLATES)) {
      templates[key] = process.env[def.envTemplateKey];
    }

    return new Fast2SMSProvider({
      apiKey: process.env.FAST2SMS_API_KEY,
      baseUrl: process.env.FAST2SMS_BASE_URL || 'https://www.fast2sms.com/dev',
      route: (process.env.FAST2SMS_ROUTE as 'dlt' | 'q' | 'otp') || 'dlt',
      senderId: process.env.FAST2SMS_SENDER_ID,
      entityId: process.env.FAST2SMS_ENTITY_ID,
      templates,
    });
  }

  return new MockSMSProvider();
}

/**
 * Handle POST /api/notifications/send-sms
 */
export async function handleSendSmsRequest(body: any, clientIp: string = '127.0.0.1'): Promise<{ status: number; body: SmsResponse }> {
  const { phone, template, variables, tenantId, metadata, referenceType, referenceId, customMessage } = body || {};

  if (!phone || !template) {
    return {
      status: 400,
      body: {
        success: false,
        status: 'FAILED',
        error: 'Missing required parameters: phone and template are mandatory',
        errorCode: 'SMS_CONFIGURATION_ERROR',
      },
    };
  }

  const normalizedPhone = normalizePhoneNumber(phone);
  if (!normalizedPhone) {
    return {
      status: 400,
      body: {
        success: false,
        status: 'FAILED',
        error: 'Invalid recipient phone number. Must be a valid 10-digit Indian mobile number.',
        errorCode: 'SMS_INVALID_NUMBER',
      },
    };
  }

  // Rate limit: 30 requests per minute per IP for general SMS
  if (!checkRateLimit(`ip_sms_${clientIp}`, 30, 60000)) {
    return {
      status: 429,
      body: {
        success: false,
        status: 'FAILED',
        error: 'Too many SMS requests. Please wait before retrying.',
        errorCode: 'SMS_RATE_LIMITED',
      },
    };
  }

  const provider = getServerSMSProvider();
  const requestPayload: SendSmsRequest = {
    phone: normalizedPhone,
    template,
    variables,
    tenantId: tenantId || 'default-dairy',
    metadata,
    referenceType,
    referenceId,
    customMessage,
  };

  const result = await provider.send(requestPayload);
  return {
    status: result.success ? 200 : 400,
    body: result,
  };
}

/**
 * Handle POST /api/admin/notifications/test-sms
 */
export async function handleTestSmsRequest(body: any, role: string = 'admin', clientIp: string = '127.0.0.1'): Promise<{ status: number; body: SmsResponse }> {
  // Authorization check
  if (role !== 'admin' && role !== 'TENANT_ADMIN') {
    return {
      status: 403,
      body: {
        success: false,
        status: 'FAILED',
        error: 'Unauthorized: Only administrators can dispatch test SMS.',
        errorCode: 'SMS_CONFIGURATION_ERROR',
      },
    };
  }

  const { phone } = body || {};
  const normalizedPhone = normalizePhoneNumber(phone);
  if (!normalizedPhone) {
    return {
      status: 400,
      body: {
        success: false,
        status: 'FAILED',
        error: 'Invalid mobile number. Please enter a valid 10-digit number.',
        errorCode: 'SMS_INVALID_NUMBER',
      },
    };
  }

  // Strict rate limiting on Test SMS: max 5 per minute per IP
  if (!checkRateLimit(`test_sms_${clientIp}`, 5, 60000)) {
    return {
      status: 429,
      body: {
        success: false,
        status: 'FAILED',
        error: 'Test SMS rate limit exceeded (max 5 per minute). Please wait.',
        errorCode: 'SMS_RATE_LIMITED',
      },
    };
  }

  const provider = getServerSMSProvider();
  const result = await provider.send({
    phone: normalizedPhone,
    template: 'CUSTOM',
    customMessage: `RUDU FARM: Test SMS verification successful at ${new Date().toLocaleTimeString('en-IN')}. Gateway is operational.`,
    tenantId: body?.tenantId || 'default-dairy',
    metadata: { isTest: true },
  });

  return {
    status: result.success ? 200 : 400,
    body: result,
  };
}

/**
 * Handle POST /api/webhooks/fast2sms
 */
export async function handleFast2SMSWebhook(body: any): Promise<{ status: number; body: any }> {
  // Process Fast2SMS delivery status callback
  console.log('[Fast2SMS Webhook received]', body);
  return {
    status: 200,
    body: { received: true, timestamp: new Date().toISOString() },
  };
}
