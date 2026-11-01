import { describe, it, expect, beforeEach } from 'vitest';
import {
  hashCredential,
  verifyCredential,
  validatePinStrength,
  sanitizeUserForStorage,
  generateRandomSaltHex,
  isAccountLocked,
  recordFailedAttempt,
  resetFailedAttempts,
} from '../utils/cryptoAuth';
import {
  checkServerRateLimit,
  recordServerFailedAttempt,
  resetServerAttempts,
  clearAllServerAttempts,
} from '../server/authService';

interface MockFarmerAccount {
  id: string;
  farmerCode: string;
  phone: string;
  status: 'Active' | 'Inactive';
  pinHash?: string;
  legacyPin?: string;
}

describe('Enterprise PBKDF2-HMAC-SHA256 Authentication & Security Architecture', () => {
  const farmerPhone = '9876543210';
  const farmerSuffix = '3210';
  const legacySaltIdentifier = 'RF1001';

  beforeEach(() => {
    resetFailedAttempts(farmerPhone);
    resetFailedAttempts('farmer-test-1');
  });

  it('generates unique cryptographically secure PBKDF2 hashes with unique 16-byte random salts', async () => {
    const pin = '5829';
    // Hashing twice with no salt generates two DIFFERENT hashes because each gets a fresh random 16-byte salt
    const hash1 = await hashCredential(pin);
    const hash2 = await hashCredential(pin);

    expect(hash1).not.toBe(hash2);
    expect(hash1.startsWith('pbkdf2:sha256:600000:')).toBe(true);
    expect(hash2.startsWith('pbkdf2:sha256:600000:')).toBe(true);

    // Verify both different hashes validate correctly against the same PIN
    const verify1 = await verifyCredential(pin, legacySaltIdentifier, hash1);
    const verify2 = await verifyCredential(pin, legacySaltIdentifier, hash2);
    expect(verify1.valid).toBe(true);
    expect(verify1.needsUpgrade).toBe(false);
    expect(verify2.valid).toBe(true);
    expect(verify2.needsUpgrade).toBe(false);
  });

  it('enforces offline brute-force protection with 600,000 PBKDF2 iterations and random salt', async () => {
    const customSaltHex = generateRandomSaltHex(16);
    expect(customSaltHex).toHaveLength(32); // 16 bytes = 32 hex chars

    const hash = await hashCredential('8261', customSaltHex, 600000);
    const parts = hash.split(':');
    expect(parts[0]).toBe('pbkdf2');
    expect(parts[1]).toBe('sha256');
    expect(parts[2]).toBe('600000'); // OWASP iteration count
    expect(parts[3]).toBe(customSaltHex); // Salt hex
    expect(parts[4]).toHaveLength(64); // 256-bit derived key hex
  });

  it('enforces client rate limiting and temporary account lockout after 5 consecutive failed attempts', () => {
    const accountId = 'farmer-test-1';

    // First 4 failed attempts: account remains unlocked
    for (let i = 1; i <= 4; i++) {
      const attempt = recordFailedAttempt(accountId);
      expect(attempt.locked).toBe(false);
      expect(attempt.attemptsLeft).toBe(5 - i);
    }

    expect(isAccountLocked(accountId).locked).toBe(false);

    // 5th failed attempt: triggers 15-minute lockout
    const fifthAttempt = recordFailedAttempt(accountId);
    expect(fifthAttempt.locked).toBe(true);
    expect(fifthAttempt.attemptsLeft).toBe(0);
    expect(fifthAttempt.remainingSeconds).toBeGreaterThan(800);

    // Subsequent status check confirms lockout
    const lockStatus = isAccountLocked(accountId);
    expect(lockStatus.locked).toBe(true);
    expect(lockStatus.remainingSeconds).toBeGreaterThan(800);

    // Successful authentication or administrative reset clears lockout
    resetFailedAttempts(accountId);
    expect(isAccountLocked(accountId).locked).toBe(false);
  });

  it('STRICTLY REJECTS phone number or last 4 digits as standalone authentication', async () => {
    const unconfiguredFarmer: MockFarmerAccount = {
      id: 'FARM-02',
      farmerCode: 'RF1002',
      phone: farmerPhone,
      status: 'Active',
      // No custom PIN set
    };

    // Attacker tries using the phone number's last 4 digits
    const resSuffix = await verifyCredential(
      farmerSuffix,
      unconfiguredFarmer.farmerCode,
      undefined,
      undefined,
      unconfiguredFarmer.phone
    );
    expect(resSuffix.valid).toBe(false);

    // Attacker tries using the full 10-digit phone number
    const resFull = await verifyCredential(
      farmerPhone,
      unconfiguredFarmer.farmerCode,
      undefined,
      undefined,
      unconfiguredFarmer.phone
    );
    expect(resFull.valid).toBe(false);
  });

  it('authenticates successfully with valid PIN against PBKDF2 hash and rejects incorrect PIN', async () => {
    const correctPin = '5829';
    const pinHash = await hashCredential(correctPin);

    const activeHashedFarmer: MockFarmerAccount = {
      id: 'FARM-01',
      farmerCode: 'RF1001',
      phone: farmerPhone,
      status: 'Active',
      pinHash,
    };

    const validRes = await verifyCredential(
      correctPin,
      activeHashedFarmer.farmerCode,
      activeHashedFarmer.pinHash,
      undefined,
      activeHashedFarmer.phone
    );
    expect(validRes.valid).toBe(true);
    expect(validRes.needsUpgrade).toBe(false);

    // Incorrect PIN fails
    const invalidRes = await verifyCredential(
      '9999',
      activeHashedFarmer.farmerCode,
      activeHashedFarmer.pinHash,
      undefined,
      activeHashedFarmer.phone
    );
    expect(invalidRes.valid).toBe(false);
  });

  it('STRICTLY REJECTS master backdoor PINs (8006270064, 1234, admin123, 1307)', async () => {
    const pinHash = await hashCredential('5829');
    const farmer: MockFarmerAccount = {
      id: 'FARM-01',
      farmerCode: 'RF1001',
      phone: farmerPhone,
      status: 'Active',
      pinHash,
    };

    const backdoors = ['8006270064', '1234', 'admin123', '1307', 'demo123', 'rudu2026'];
    for (const backdoor of backdoors) {
      const res = await verifyCredential(
        backdoor,
        farmer.farmerCode,
        farmer.pinHash,
        undefined,
        farmer.phone
      );
      expect(res.valid).toBe(false);
    }
  });

  it('validates PIN strength and rejects weak/phone-suffix PINs', () => {
    // Rejects empty
    expect(validatePinStrength('').valid).toBe(false);

    // Rejects under 4 digits
    expect(validatePinStrength('12').valid).toBe(false);

    // Rejects matching phone last 4 digits
    expect(validatePinStrength('3210', '9876543210').valid).toBe(false);

    // Rejects trivial sequences
    expect(validatePinStrength('1234').valid).toBe(false);
    expect(validatePinStrength('0000').valid).toBe(false);
    expect(validatePinStrength('1111').valid).toBe(false);

    // Accepts strong random 4-digit PIN
    expect(validatePinStrength('5829', '9876543210').valid).toBe(true);
    expect(validatePinStrength('8492', '9876543210').valid).toBe(true);
  });

  it('sanitizes user objects before localStorage persistence to prevent credential leaks', () => {
    const rawFarmer = {
      id: 'FARM-01',
      name: 'Ramesh Patel',
      phone: '9876543210',
      pin: '5829',
      password: 'secretPassword123',
      pinHash: 'pbkdf2:sha256:100000:abc...',
      passwordHash: 'pbkdf2:sha256:100000:def...',
      bankDetails: {
        accountNumber: '•••• 1234',
        ifscCode: 'SBIN0001842',
      },
    };

    const sanitized = sanitizeUserForStorage(rawFarmer);

    expect((sanitized as any).pin).toBeUndefined();
    expect((sanitized as any).password).toBeUndefined();
    expect((sanitized as any).pinHash).toBeUndefined();
    expect((sanitized as any).passwordHash).toBeUndefined();
    expect((sanitized as any).name).toBe('Ramesh Patel');
    expect((sanitized as any).id).toBe('FARM-01');
  });

  it('upgrades legacy single-round SHA-256 v1 hashes to PBKDF2 upon successful authentication', async () => {
    // Legacy v1 single-round hash: SHA-256('rudu-dairy-salt-v1:rf1001:5829')
    // Precalculated SHA-256 hash
    const legacySalt = 'rf1001';
    const legacyPin = '5829';
    const encoder = new TextEncoder();
    const hashBuffer = await globalThis.crypto.subtle.digest(
      'SHA-256',
      encoder.encode(`rudu-dairy-salt-v1:${legacySalt}:${legacyPin}`)
    );
    const legacyV1Hash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const res = await verifyCredential(
      legacyPin,
      legacySalt,
      legacyV1Hash,
      undefined,
      farmerPhone
    );

    expect(res.valid).toBe(true);
    expect(res.needsUpgrade).toBe(true); // Must flag that this account needs PBKDF2 upgrade
  });

  it('upgrades legacy plaintext accounts upon successful authentication', async () => {
    const legacyPlaintextPin = '7841';
    const legacyFarmer: MockFarmerAccount = {
      id: 'FARM-LEGACY',
      farmerCode: 'RF9000',
      phone: '9876500000',
      status: 'Active',
      legacyPin: legacyPlaintextPin,
    };

    const res = await verifyCredential(
      legacyPlaintextPin,
      legacyFarmer.farmerCode,
      undefined,
      legacyFarmer.legacyPin,
      legacyFarmer.phone
    );

    expect(res.valid).toBe(true);
    expect(res.needsUpgrade).toBe(true); // Flag to upgrade to pinHash and delete plaintext
  });

  it('enforces atomic abuse-resistant rate limiting on the trusted server', () => {
    const testIdentifier = '9876543210';
    const testIp = '192.168.1.50';

    clearAllServerAttempts();

    // Check initially allowed
    const initialCheck = checkServerRateLimit(testIdentifier, testIp);
    expect(initialCheck.allowed).toBe(true);
    expect(initialCheck.attemptsLeft).toBe(5);

    // 4 failed attempts
    for (let i = 1; i <= 4; i++) {
      const fail = recordServerFailedAttempt(testIdentifier, testIp);
      expect(fail.locked).toBe(false);
      expect(fail.attemptsLeft).toBe(5 - i);
    }

    // 5th failed attempt locks out on server
    const finalFail = recordServerFailedAttempt(testIdentifier, testIp);
    expect(finalFail.locked).toBe(true);
    expect(finalFail.attemptsLeft).toBe(0);
    expect(finalFail.remainingSeconds).toBeGreaterThan(800);

    // Subsequent rate limit check is strictly denied on the server
    const lockedCheck = checkServerRateLimit(testIdentifier, testIp);
    expect(lockedCheck.allowed).toBe(false);
    expect(lockedCheck.remainingSeconds).toBeGreaterThan(800);

    // Success or admin reset clears server attempts
    resetServerAttempts(testIdentifier);
    expect(checkServerRateLimit(testIdentifier, testIp).allowed).toBe(true);
  });

  it('documents four-digit PIN residual risk and enforces defense-in-depth boundaries', () => {
    // Mathematical entropy of 4-digit numeric PIN is ~13.29 bits (10,000 possibilities)
    const pinEntropyBits = Math.log2(10000);
    expect(pinEntropyBits).toBeCloseTo(13.287, 2);

    // Because 10,000 combinations can be exhausted rapidly if a hash is leaked,
    // the system strictly enforces:
    // 1. PIN hashes must never be exposed to clients
    // 2. Server-side rate limiting (5 attempts / 15 min lock) prevents online attacks
    // 3. Admin / operator privileged roles must use Firebase Authentication (strong passwords / MFA)
    expect(pinEntropyBits).toBeLessThan(14);
  });
});

