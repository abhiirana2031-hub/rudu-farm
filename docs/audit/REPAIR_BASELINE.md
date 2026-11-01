# RUDU DAIRY / RUDU FARM — REPAIR BASELINE AUDIT
**Date:** March 2026 / Local Execution  
**Project:** Rudu Dairy / Rudu Farm (Smart Dairy ERP & Consumer Platform)  
**Location:** Khasra No. 277, Sikhreda, Uttar Pradesh, India  
**Auditor:** Senior Engineering, Security, and QA Reliability Team  

---

## 1. Baseline System Status

### 1.1 Git Working Tree & Environment
- **Branch:** `main` (clean tracking of `origin/main`)
- **OS / Shell:** Windows (PowerShell)
- **Node.js Environment:** v20+ with npm v10+
- **Dev Server Status:** Active at `http://localhost:5176/` (Vite 8.1.5)

### 1.2 Verification Pipeline Results
| Command | Result | Details |
| :--- | :---: | :--- |
| `npm run typecheck` (`tsc --noEmit`) | ✅ **PASSED** | 0 TypeScript errors found across the codebase |
| `npm test` (`vitest run`) | ✅ **PASSED** | 19 tests passed across 4 test suites in 342ms |
| `npm run lint` (`oxlint`) | ✅ **PASSED** | 0 errors (196 non-breaking unused-variable warnings) |
| `npm run build` (`vite build`) | ✅ **PASSED** | Production bundle built in 1.18s with code-split vendor chunks |

---

## 2. Verified Vulnerabilities & Defect Analysis

### Defect 1: Hardcoded Master PIN Bypass in Authentication (P0 — Critical)
- **Affected File:** `src/context/AppContext.tsx` (lines 1178, 1247–1248)
- **Evidence:**
  ```typescript
  // Operator check:
  if (secret !== expectedPin && secret !== '8006270064' && secret !== 'admin123')
  // Farmer check:
  isPinMatch = expectedFarmerPin
    ? secret === expectedFarmerPin || secret === '8006270064' || secret === '1234'
    : secret === fPhoneLast4 || secret === '1234' || secret === '1307' || secret === '8006270064';
  ```
- **Severity:** P0 — Critical Vulnerability
- **Impact:** Any user entering the public dairy helpline `8006270064` or `'1234'` can log in as any farmer or operator without knowing their real password or PIN, bypassing all authentication and gaining access to private passbooks, bank details, and collection operations.
- **Remediation:** Remove hardcoded master PIN backdoors. Enforce verification exclusively against the user's registered PIN/passcode (or default phone last 4 digits for newly onboarded farmers).

### Defect 2: Overly Permissive Firestore Security Rules (P0 — Critical)
- **Affected File:** `firestore.rules`
- **Evidence:**
  ```firestore
  match /farmers/{farmerId} {
    allow read: if isAuthenticated();
    allow write: if isAuthenticated();
  }
  match /orders/{orderId} {
    allow read, create: if isAuthenticated() || true;
  }
  match /users/{userId} {
    allow read: if isAuthenticated();
  }
  ```
- **Severity:** P0 — Critical Vulnerability
- **Impact:**
  - `allow write: if isAuthenticated()` on `/farmers` permits any logged-in farmer or consumer to overwrite or delete any other farmer's account and bank account details.
  - `allow read: if isAuthenticated() || true` on `/orders` exposes customer delivery addresses and phone numbers to unauthenticated public queries.
  - `allow read: if isAuthenticated()` on `/users` permits any logged-in user to view the full administrative user directory.
- **Remediation:**
  - Restrict `/orders` reads to the customer who created the order or SuperAdmin.
  - Restrict `/users` reads to the user themselves or SuperAdmin.
  - Restrict `/farmers` updates to authenticated profile owners, center operators, or SuperAdmin; forbid delete operations by non-admins.
  - Restrict `/payouts` creation strictly to SuperAdmin.

### Defect 3: Local Firebase Rules Emulator Test Blocker
- **Tooling:** Firebase Emulator Suite (`firebase emulators:start`)
- **Blocker Evidence:** Running `java -version` returns `The term 'java' is not recognized as the name of a cmdlet...`
- **Severity:** P2 — Environmental Limitation
- **Impact:** The Cloud Firestore security rules unit tests requiring the Java-based Firestore Emulator cannot be started on the local Windows host without a JRE installation.
- **Remediation:** Document limitation explicitly per Directive Section 4; implement offline rule constraint logic tests in Vitest.

---

## 3. Prioritized Action Plan

1. **Security Fix:** Eliminate hardcoded master PIN backdoors in `AppContext.tsx`.
2. **Security Fix:** Tighten Firestore rules for `/farmers`, `/orders`, `/payouts`, and `/users`.
3. **Data Integrity:** Add automated tests for authentication, order totals, and subscription frequency calculations.
4. **Verification:** Execute `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`.
5. **Documentation:** Produce `docs/audit/FINAL_REPAIR_REPORT.md`.
