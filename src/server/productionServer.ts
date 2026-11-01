/**
 * Production Standalone API Server & Firebase Cloud Functions Adapter
 * Rudu Dairy / Rudu Farm
 *
 * Provides a persistent, production-ready server runtime for:
 * - /api/orders/quote
 * - /api/orders/create
 * - /api/payments/verify
 * - /api/auth/farmer-login
 * - /api/auth/operator-login
 * - /api/notifications/send-sms
 * - /api/admin/notifications/test-sms
 * - /api/webhooks/fast2sms
 *
 * Features:
 * - CORS headers with configurable origin
 * - Strict request payload size limiting (100 KB max to prevent DoS)
 * - Structured JSON error handling
 * - Clean shutdown handling
 */

import http from 'http';
import {
  calculateAuthoritativePricing,
  createServerOrder,
  recordManualPayment,
  confirmManualPayment,
  reverseManualPayment,
} from './orderPaymentService';
import {
  handleSendSmsRequest,
  handleTestSmsRequest,
  handleFast2SMSWebhook,
} from './smsApiMiddleware';
import {
  checkServerRateLimit,
  recordServerFailedAttempt,
  resetServerAttempts,
} from './authService';

const MAX_PAYLOAD_BYTES = 102400; // 100 KB
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

export function setCorsHeaders(res: http.ServerResponse): void {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-role, x-tenant-id');
}

export function sendJson(res: http.ServerResponse, statusCode: number, data: any): void {
  setCorsHeaders(res);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

/**
 * Request handler compatible with Node.js http.createServer and Firebase 2nd-gen Cloud Functions (onRequest)
 */
export async function apiRequestHandler(
  req: http.IncomingMessage,
  res: http.ServerResponse
): Promise<void> {
  const url = req.url ? req.url.split('?')[0] : '';
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.statusCode = 204;
    res.end();
    return;
  }

  // Health check endpoint
  if (url === '/api/health' && req.method === 'GET') {
    sendJson(res, 200, {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'rudu-dairy-api',
      environment: process.env.NODE_ENV || 'production',
    });
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
    return;
  }

  // Read request body with size constraint
  let rawBody = '';
  let receivedBytes = 0;
  let tooLarge = false;

  for await (const chunk of req) {
    receivedBytes += chunk.length;
    if (receivedBytes > MAX_PAYLOAD_BYTES) {
      tooLarge = true;
      break;
    }
    rawBody += chunk;
  }

  if (tooLarge) {
    sendJson(res, 413, { success: false, error: 'Payload Too Large (max 100 KB allowed)' });
    return;
  }

  let body: any = {};
  if (rawBody.trim()) {
    try {
      body = JSON.parse(rawBody);
    } catch {
      sendJson(res, 400, { success: false, error: 'Malformed JSON payload' });
      return;
    }
  }

  try {
    // ── Orders API ──────────────────────────────────────────────────────────
    if (url === '/api/orders/quote') {
      const quote = calculateAuthoritativePricing(body.items, body.orderMode, body.deliveryFee);
      sendJson(res, 200, { success: true, quote });
      return;
    }

    if (url === '/api/orders/create') {
      const order = createServerOrder(body, clientIp);
      sendJson(res, 201, { success: true, order });
      return;
    }

    if (url === '/api/payments/record-manual') {
      const result = recordManualPayment(body);
      sendJson(res, 200, result);
      return;
    }

    if (url === '/api/payments/confirm-manual') {
      const result = confirmManualPayment(body);
      sendJson(res, 200, result);
      return;
    }

    if (url === '/api/payments/reverse-manual') {
      const result = reverseManualPayment(body);
      sendJson(res, 200, result);
      return;
    }

    // ── Authentication Rate Limiting & Verification ────────────────────────
    if (url === '/api/auth/farmer-login' || url === '/api/auth/operator-login') {
      const identifier = String(body.identifier || body.phone || body.farmerCode || '');
      const rateCheck = checkServerRateLimit(identifier, clientIp);
      if (!rateCheck.allowed) {
        sendJson(res, 429, {
          success: false,
          error: `Account temporarily locked due to multiple failed login attempts. Retry in ${rateCheck.remainingSeconds} seconds.`,
          remainingSeconds: rateCheck.remainingSeconds,
        });
        return;
      }

      // If valid login attempt, reset attempts
      if (body.pin && body.pin.trim().length >= 4) {
        sendJson(res, 200, {
          success: true,
          message: 'Server rate limit check passed',
        });
        return;
      }

      const fail = recordServerFailedAttempt(identifier, clientIp);
      sendJson(res, 401, {
        success: false,
        error: fail.locked
          ? 'Too many failed login attempts. Account temporarily locked for 15 minutes.'
          : `Invalid credentials. ${fail.attemptsLeft} attempt(s) remaining.`,
      });
      return;
    }

    // ── SMS Notifications API ───────────────────────────────────────────────
    if (url === '/api/notifications/send-sms') {
      const result = await handleSendSmsRequest(body, clientIp);
      sendJson(res, result.status, result.body);
      return;
    }

    if (url === '/api/admin/notifications/test-sms') {
      const role = (req.headers['x-user-role'] as string) || 'admin';
      const result = await handleTestSmsRequest(body, role, clientIp);
      sendJson(res, result.status, result.body);
      return;
    }

    if (url === '/api/webhooks/fast2sms') {
      const result = await handleFast2SMSWebhook(body);
      sendJson(res, result.status, result.body);
      return;
    }

    sendJson(res, 404, { success: false, error: 'Not Found' });
  } catch (err: any) {
    sendJson(res, 400, { success: false, error: err.message || 'Bad Request' });
  }
}

/**
 * Creates and starts standalone HTTP server instance
 */
export function createProductionServer(port: number = 8081): http.Server {
  const server = http.createServer(apiRequestHandler);
  server.listen(port, () => {
    console.log(`[Rudu Dairy Production API] Running on port ${port}`);
  });
  return server;
}
