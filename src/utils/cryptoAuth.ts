/**
 * Enterprise Cryptographic Authentication & Credential Management
 * Rudu Dairy / Rudu Farm
 *
 * Implements PBKDF2-HMAC-SHA256 with 100,000 iterations and 16-byte (128-bit)
 * cryptographically secure random salts generated via Web Crypto API.
 * 
 * Provides:
 * - High work factor (100k rounds) to neutralize offline brute-force attacks against short PINs
 * - Unique random per-credential salts preventing precomputation / rainbow tables
 * - Client-side rate limiting and account lockout after repeated failed attempts
 * - Zero plaintext passwords/PINs in Firestore and localStorage
 * - Seamless backward-compatible migration for legacy credentials without lockouts
 */

const LEGACY_SALT_PREFIX = 'rudu-dairy-salt-v1:';
const PBKDF2_PREFIX = 'pbkdf2:sha256:';
const PBKDF2_ITERATIONS = 600000; // OWASP recommended work factor for PBKDF2-HMAC-SHA256
const SALT_BYTES = 16;
const KEY_BITS = 256;

// In-memory rate limiting tracker: max 5 failed attempts per identifier in 15 minutes
interface FailedAttemptEntry {
  count: number;
  firstAttempt: number;
  lockedUntil: number;
}
const failedAttemptsMap = new Map<string, FailedAttemptEntry>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

/**
 * Checks if an account/identifier is currently locked out due to failed attempts.
 */
export function isAccountLocked(identifier: string): { locked: boolean; remainingSeconds?: number } {
  const cleanId = (identifier || '').trim().toLowerCase();
  const entry = failedAttemptsMap.get(cleanId);
  if (!entry) return { locked: false };

  const now = Date.now();
  if (entry.lockedUntil > now) {
    const remainingSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
    return { locked: true, remainingSeconds };
  }

  // Lockout expired
  if (entry.lockedUntil > 0 && entry.lockedUntil <= now) {
    failedAttemptsMap.delete(cleanId);
  }
  return { locked: false };
}

/**
 * Records a failed attempt for an account/identifier.
 */
export function recordFailedAttempt(identifier: string): { locked: boolean; attemptsLeft: number; remainingSeconds?: number } {
  const cleanId = (identifier || '').trim().toLowerCase();
  const now = Date.now();
  const entry = failedAttemptsMap.get(cleanId);

  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    failedAttemptsMap.set(cleanId, { count: 1, firstAttempt: now, lockedUntil: 0 });
    return { locked: false, attemptsLeft: MAX_ATTEMPTS - 1 };
  }

  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
    const remainingSeconds = Math.ceil(LOCKOUT_MS / 1000);
    return { locked: true, attemptsLeft: 0, remainingSeconds };
  }

  return { locked: false, attemptsLeft: MAX_ATTEMPTS - entry.count };
}

/**
 * Resets failed attempts after a successful login.
 */
export function resetFailedAttempts(identifier: string): void {
  const cleanId = (identifier || '').trim().toLowerCase();
  failedAttemptsMap.delete(cleanId);
}

/**
 * Generates cryptographically secure random bytes as a hex string.
 */
export function generateRandomSaltHex(numBytes: number = SALT_BYTES): string {
  const bytes = new Uint8Array(numBytes);
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Web Cryptography API (crypto.getRandomValues) is not available.');
  }
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToUint8Array(hex: string): Uint8Array {
  const cleanHex = hex.trim();
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
  }
  return bytes;
}

function uint8ArrayToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Computes PBKDF2-HMAC-SHA256 derived key bits using Web Crypto API.
 */
async function derivePbkdf2Hash(
  credential: string,
  saltBytes: Uint8Array,
  iterations: number
): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('Web Cryptography API (crypto.subtle) is not available.');
  }

  const encoder = new TextEncoder();
  const keyMaterial = await subtle.importKey(
    'raw',
    encoder.encode(credential),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes as any,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    KEY_BITS
  );

  return uint8ArrayToHex(new Uint8Array(derivedBits));
}

/**
 * Legacy single-round SHA-256 hash computation (used strictly for migrating v1 hashes).
 */
async function computeLegacyV1Hash(credential: string, salt: string): Promise<string> {
  const cleanCred = credential.trim();
  const cleanSalt = salt.trim().toLowerCase();
  const payload = `${LEGACY_SALT_PREFIX}${cleanSalt}:${cleanCred}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(payload);

  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('Web Cryptography API is not available.');
  }

  const hashBuffer = await subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Computes a secure PBKDF2-HMAC-SHA256 hash of a PIN or password.
 * If saltHex is not provided, a fresh cryptographically secure random 16-byte salt is generated.
 * Output format: "pbkdf2:sha256:<iterations>:<saltHex>:<hashHex>"
 */
export async function hashCredential(
  credential: string,
  saltHex?: string,
  iterations: number = PBKDF2_ITERATIONS
): Promise<string> {
  const cleanCred = credential.trim();
  if (!cleanCred) {
    throw new Error('Cannot hash empty credential.');
  }

  const actualSaltHex = (saltHex && /^[0-9a-fA-F]+$/.test(saltHex))
    ? saltHex.toLowerCase()
    : generateRandomSaltHex(SALT_BYTES);

  const saltBytes = hexToUint8Array(actualSaltHex);
  const hashHex = await derivePbkdf2Hash(cleanCred, saltBytes, iterations);

  return `${PBKDF2_PREFIX}${iterations}:${actualSaltHex}:${hashHex}`;
}

/**
 * Validates PIN strength against enterprise security policies.
 * Forbids:
 *  - Under 4 characters
 *  - Matching the last 4 digits of the phone number
 *  - Trivial sequences (e.g., 1234, 0000)
 */
export function validatePinStrength(
  pin: string,
  phone?: string
): { valid: boolean; error?: string } {
  const cleanPin = pin.trim();

  if (!cleanPin) {
    return { valid: false, error: 'PIN / Passcode cannot be empty.' };
  }

  if (cleanPin.length < 4) {
    return { valid: false, error: 'PIN must be at least 4 digits.' };
  }

  if (phone) {
    const phoneDigits = phone.replace(/\D/g, '');
    const phoneSuffix = phoneDigits.slice(-4);
    if (phoneSuffix.length === 4 && cleanPin === phoneSuffix) {
      return {
        valid: false,
        error: 'Insecure PIN: You cannot use the last 4 digits of your mobile number as a PIN.',
      };
    }
  }

  const trivialPins = ['1234', '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '123456'];
  if (trivialPins.includes(cleanPin)) {
    return {
      valid: false,
      error: 'Insecure PIN: Trivial repeating or sequential numbers are not allowed.',
    };
  }

  return { valid: true };
}

/**
 * Verifies an entered credential against stored cryptographic hash.
 * Supports:
 *  1. PBKDF2-HMAC-SHA256 (format "pbkdf2:sha256:<iterations>:<saltHex>:<hashHex>") -> needsUpgrade: false
 *  2. Legacy v1 SHA-256 (64 hex characters) -> needsUpgrade: true
 *  3. Migration fallback for existing accounts with legacy plaintext PIN -> needsUpgrade: true
 *
 * CRITICAL: Under NO circumstances will knowledge of phone suffix alone authenticate.
 */
export async function verifyCredential(
  inputCredential: string,
  legacySaltIdentifier: string,
  storedHash?: string,
  legacyPlaintext?: string,
  phone?: string
): Promise<{ valid: boolean; needsUpgrade: boolean }> {
  const cleanInput = (inputCredential || '').trim();
  if (!cleanInput) {
    return { valid: false, needsUpgrade: false };
  }

  // Reject phone suffix standalone authentication
  if (phone) {
    const phoneDigits = phone.replace(/\D/g, '');
    const phoneSuffix = phoneDigits.slice(-4);
    if (phoneSuffix && cleanInput === phoneSuffix && !storedHash && (!legacyPlaintext || legacyPlaintext === phoneSuffix)) {
      return { valid: false, needsUpgrade: false };
    }
  }

  // 1. Verify against PBKDF2 hash ("pbkdf2:sha256:<iterations>:<saltHex>:<hashHex>")
  if (storedHash && storedHash.startsWith(PBKDF2_PREFIX)) {
    const parts = storedHash.slice(PBKDF2_PREFIX.length).split(':');
    if (parts.length === 3) {
      const iterations = parseInt(parts[0], 10);
      const saltHex = parts[1];
      const expectedHashHex = parts[2];

      if (iterations > 0 && saltHex && expectedHashHex) {
        const saltBytes = hexToUint8Array(saltHex);
        const computedHashHex = await derivePbkdf2Hash(cleanInput, saltBytes, iterations);
        const valid = computedHashHex === expectedHashHex;
        return { valid, needsUpgrade: false };
      }
    }
  }

  // 2. Migration fallback for v1 single-round SHA-256 hashes (64-char hex)
  if (storedHash && /^[0-9a-fA-F]{64}$/.test(storedHash)) {
    const computedLegacy = await computeLegacyV1Hash(cleanInput, legacySaltIdentifier);
    if (computedLegacy === storedHash) {
      return { valid: true, needsUpgrade: true };
    }
  }

  // 3. Migration fallback for existing accounts with legacy plaintext PIN
  if (legacyPlaintext) {
    const cleanLegacy = legacyPlaintext.trim();
    if (cleanInput === cleanLegacy) {
      return { valid: true, needsUpgrade: true };
    }
  }

  return { valid: false, needsUpgrade: false };
}

/**
 * Strips all sensitive credential fields (pin, password, pinHash, passwordHash)
 * from an object before writing to localStorage or client memory caches.
 */
export function sanitizeUserForStorage<T extends Record<string, any>>(user: T): Omit<T, 'pin' | 'password' | 'pinHash' | 'passwordHash'> {
  if (!user || typeof user !== 'object') return user;
  const clone = { ...user };
  delete (clone as any).pin;
  delete (clone as any).password;
  delete (clone as any).pinHash;
  delete (clone as any).passwordHash;
  return clone;
}

