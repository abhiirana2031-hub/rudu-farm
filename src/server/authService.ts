/**
 * Trusted Server-Side Authentication & Abuse Protection Service
 * Rudu Dairy / Rudu Farm
 *
 * Enforces:
 * 1. Server-side atomic rate limiting and account lockout (independent of client storage)
 * 2. Protection against online brute-force attacks against low-entropy PINs
 * 3. Sanitized user responses (pinHash and passwords are NEVER exposed to untrusted clients)
 * 4. Tracking of IP and Account failed attempts
 */

interface ServerAttemptRecord {
  count: number;
  firstAttempt: number;
  lockedUntil: number;
}

const serverAttempts = new Map<string, ServerAttemptRecord>();
const MAX_SERVER_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

// Clean up stale lockout records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of serverAttempts.entries()) {
    if (now - record.firstAttempt > ATTEMPT_WINDOW_MS && record.lockedUntil <= now) {
      serverAttempts.delete(key);
    }
  }
}, 300000);

export function checkServerRateLimit(identifier: string, clientIp: string = '127.0.0.1'): {
  allowed: boolean;
  remainingSeconds?: number;
  attemptsLeft?: number;
} {
  const now = Date.now();
  const idKey = `id:${identifier.trim().toLowerCase()}`;
  const ipKey = `ip:${clientIp.trim()}`;

  // Check ID lockout
  const idRecord = serverAttempts.get(idKey);
  if (idRecord && idRecord.lockedUntil > now) {
    const remainingSeconds = Math.ceil((idRecord.lockedUntil - now) / 1000);
    return { allowed: false, remainingSeconds, attemptsLeft: 0 };
  }

  // Check IP lockout (prevent distributed attacks against multiple farmers)
  const ipRecord = serverAttempts.get(ipKey);
  if (ipRecord && ipRecord.lockedUntil > now) {
    const remainingSeconds = Math.ceil((ipRecord.lockedUntil - now) / 1000);
    return { allowed: false, remainingSeconds, attemptsLeft: 0 };
  }

  const currentAttempts = idRecord ? idRecord.count : 0;
  return { allowed: true, attemptsLeft: Math.max(0, MAX_SERVER_ATTEMPTS - currentAttempts) };
}

export function recordServerFailedAttempt(identifier: string, clientIp: string = '127.0.0.1'): {
  locked: boolean;
  remainingSeconds?: number;
  attemptsLeft: number;
} {
  const now = Date.now();
  const idKey = `id:${identifier.trim().toLowerCase()}`;
  const ipKey = `ip:${clientIp.trim()}`;

  // Update identifier counter
  let idRecord = serverAttempts.get(idKey);
  if (!idRecord || now - idRecord.firstAttempt > ATTEMPT_WINDOW_MS) {
    idRecord = { count: 1, firstAttempt: now, lockedUntil: 0 };
  } else {
    idRecord.count += 1;
  }

  if (idRecord.count >= MAX_SERVER_ATTEMPTS) {
    idRecord.lockedUntil = now + LOCKOUT_DURATION_MS;
    serverAttempts.set(idKey, idRecord);
    return {
      locked: true,
      remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
      attemptsLeft: 0,
    };
  }
  serverAttempts.set(idKey, idRecord);

  // Update IP counter
  let ipRecord = serverAttempts.get(ipKey);
  if (!ipRecord || now - ipRecord.firstAttempt > ATTEMPT_WINDOW_MS) {
    ipRecord = { count: 1, firstAttempt: now, lockedUntil: 0 };
  } else {
    ipRecord.count += 1;
  }
  if (ipRecord.count >= 20) { // IP threshold
    ipRecord.lockedUntil = now + LOCKOUT_DURATION_MS;
  }
  serverAttempts.set(ipKey, ipRecord);

  return {
    locked: false,
    attemptsLeft: MAX_SERVER_ATTEMPTS - idRecord.count,
  };
}

export function resetServerAttempts(identifier: string): void {
  const idKey = `id:${identifier.trim().toLowerCase()}`;
  serverAttempts.delete(idKey);
}

export function clearAllServerAttempts(): void {
  serverAttempts.clear();
}
