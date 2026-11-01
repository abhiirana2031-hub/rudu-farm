# RUDU DAIRY / RUDU FARM — INITIAL REPOSITORY AUDIT
**Date:** March 2026 / Local Execution  
**Project:** Rudu Dairy / Rudu Farm (Smart Dairy ERP & Consumer Platform)  
**Location:** Khasra No. 277, Sikhreda, Uttar Pradesh, India  
**Auditor:** Autonomous Principal Engineering Team  

---

## 1. Executive Summary

Rudu Dairy is a comprehensive web platform combining an operational Dairy ERP (for milk collection, FAT/SNF testing, farmer passbooks, and payouts) with a public-facing e-commerce and subscription portal for dairy consumers.

While the user interface is richly styled and contains advanced components (landing pages, farm journey, pricing calculators, modal workflows, document printers), an in-depth codebase audit reveals critical vulnerabilities, structural flaws, and financial calculation inaccuracies that prevent it from being production-ready in its current state.

### Key Baseline Metrics
- **Frontend Stack:** React 19.2.7, Vite 8.1.5, TypeScript 7.0.2, Tailwind CSS 4.3.3
- **Backend / Database:** Firebase Auth, Cloud Firestore (client-driven with Node backend middleware), Firebase Storage
- **Codebase Size:** ~96 source files across `src/`
- **Baseline Linting (oxlint):** 4 Errors, 205 Warnings
- **Baseline Typecheck (`tsc --noEmit`):** FAILED (TS2367 type overlap in `LandingPage.tsx`)
- **Baseline Build (`vite build`):** Built in 10.49s, but outputted an un-split **2,032 kB monolithic JavaScript bundle**
- **Automated Tests:** 0 tests configured (no test runner in `package.json`)

---

## 2. Technology Stack & Architecture Map

| Layer | Configured Technology | Health Status | Assessment |
| :--- | :--- | :--- | :--- |
| **Core UI** | React 19.2.7 + TypeScript 7 | ⚠️ Degraded | Broken Hook rules in Profile view; TS type mismatch |
| **Build & Tooling** | Vite 8.1.5, Oxlint 1.71.0 | ⚠️ Degraded | Monolithic 2MB bundle; missing test harness |
| **Styling** | Tailwind CSS 4.3.3 (Vite plugin) | ✅ Healthy | Clean modern UI; robust design tokens |
| **Database** | Google Cloud Firestore | ⚠️ Vulnerable | Overly permissive catch-all rule; flat vs nested collection mismatch |
| **Authentication** | Firebase Auth + Custom fallback | 🚨 Critical Flaw | Client-side plaintext password comparison against Firestore |
| **State Management**| React Context (`AppContext.tsx`) | ⚠️ Bloated | Over 1,380 lines handling state, modals, network, and calculations |
| **Financial Calculations**| Custom Utility (`milkCalculation.ts`) | 🚨 Critical Bug | `calculateMilkAmount` precision error rounds to 1 decimal instead of 2 |
| **Documents & PDF** | jsPDF 4.2.1, jspdf-autotable 5.0.8 | ✅ Healthy | Supports collection slips, passbooks, and ledger statements |
| **SMS Gateway** | Fast2SMS DLT + Mock Provider | ✅ Functional | Clean abstraction with template mapping and mock fallback |

---

## 3. Module Inventory & Status Matrix

| Module | Location | Status | Key Issues / Observations |
| :--- | :--- | :--- | :--- |
| **1. Public Website** | `src/components/landing/` | Implemented | High visual polish; minor type mismatch in section filter |
| **2. Auth & RBAC** | `src/lib/firebase/auth.ts`, `src/lib/rbac/` | Vulnerable (P0) | Plaintext credentials in Firestore fallback; missing password hashing |
| **3. Farmer Management** | `src/components/profile/`, `modals/` | Implemented | Profile view contains illegal conditional hook call |
| **4. Collection Centre** | `src/components/collection/` | Partially Verified | Center selection exists; missing multi-center validation |
| **5. Milk Collection** | `src/components/collection/`, `dashboard/` | Broken Logic (P0/P1) | ID generation uses random 4-digit numbers (collisions guaranteed) |
| **6. FAT/SNF Testing** | `src/utils/milkCalculation.ts` | Partially Verified | Range validation exists; needs stricter physical threshold checks |
| **7. Milk Rate Engine** | `src/utils/milkCalculation.ts`, `ledger.ts` | Inconsistent (P1) | Formula discrepancy between `calculateChartRate` and `calculateAuthoritativeRate` |
| **8. Farmer Passbook** | `src/components/ledger/` | Implemented | Clean UI; relies on formatted locale dates rather than ISO timestamps |
| **9. Farmer Ledger** | `src/lib/firebase/ledger.ts` | Partially Implemented | Atomic transaction exists in `ledger.ts` but bypassed in `AppContext.tsx` |
| **10. Farmer Payouts** | `src/components/payouts/`, `modals/` | Critical Flaw (P0) | Generates `PAY-XXX` (only 900 possible IDs); risk of data overwrite |
| **11. Tanker Dispatch** | `src/components/modals/AddDispatchModal.tsx` | Basic | Logs volume; missing raw milk inventory deduction |
| **12. Inventory Mgmt** | `src/types/` | Missing (P2) | No dedicated raw milk stock balancing ledger |
| **13. Dairy Production** | `src/components/products/` | Missing (P2) | No production intake/yield tracking for Ghee, Paneer, Dahi |
| **14. Product & Batches**| `src/components/products/` | Implemented | Catalog exists with variants and specifications |
| **15. Consumer Store** | `src/components/products/ProductOrderPage`| Implemented | Cart, variant selection, and order modal |
| **16. Subscriptions** | `src/components/landing/SubscriptionCalculator`| Implemented | Delivery scheduling logic and price calculations |
| **17. Delivery Tracking**| `src/types/` | Partially Implemented | Status states defined; lacks route-assignment views |
| **18. Batch Purity** | `src/components/landing/PurityBatchChecker` | Implemented | Clean customer-facing lab reading verification |
| **19. Admin Dashboard** | `src/components/dashboard/` | Implemented | KPI overview; needs real database aggregation verification |
| **20. PDF & Slips** | `src/utils/pdfGenerator.ts` | Implemented | Fully functional slips and passbook reports |
| **21. Audit Logging** | `src/utils/auditLogger.ts`, `firebase/audit.ts`| Implemented | Logs shift, rates, overrides, and user IDs |

---

## 4. Prioritized Findings

### P0 — Critical (Security & Data Integrity)
1. **Unrestricted Firestore Access:** `firestore.rules` lines 167-169 has `match /{document=**} { allow read, write: if isAuthenticated(); }`. Any authenticated user can read, modify, or delete any document across the entire system.
2. **Plaintext Password Storage & Client Verification:** In `src/lib/firebase/auth.ts`, fallback authentication queries Firestore `/users` for `cleanEmail`, extracts `userDoc.password` in plaintext, and compares it in client-side code. This exposes all admin and operator passwords to anyone with Firestore read access.
3. **Collision-Prone ID Generation:** In `AppContext.tsx`, milk collection IDs are created as `ENTRY-${Math.floor(1000 + Math.random() * 9000)}` (9,000 slots) and payouts as `PAY-${Math.floor(100 + Math.random() * 900)}` (900 slots). Under continuous production use, IDs collide, overwriting past transaction records.
4. **React Hook Rule Violations:** In `src/components/profile/BankProfileView.tsx`, early returns for `userRole === 'admin'` and `userRole === 'employee'` precede calls to `useState` and `useEffect`. This triggers React error #300 / #310 and crashes the component on role switches.

### P1 — High (Financial Accuracy & Core Workflows)
1. **Financial Precision Drift:** In `src/utils/milkCalculation.ts`:
   ```typescript
   const totalCents = Math.round((quantity * qtyDecimals) * (rate * rateDecimals) / (qtyDecimals * 10));
   return totalCents / 10;
   ```
   This divides by 10 instead of 100, rounding monetary amounts to 1 decimal place (10 paise), resulting in systematic rounding loss on farmer milk deposits.
2. **Rate Engine Inconsistency:** Two separate rate computation algorithms exist (`calculateChartRate` in `milkCalculation.ts` vs `calculateAuthoritativeRate` in `ledger.ts`), using different base constants (e.g. cow base 45 vs 42, buffalo base 65 vs 68). One single source of truth must govern all calculations.
3. **Typecheck Failure (TS2367):** In `LandingPage.tsx`, TypeScript errors out due to narrowing after an early return, blocking strict builds and CI/CD pipelines.

### P2 — Medium (Performance, Reliability & Maintenance)
1. **Monolithic Bundle Size (2,032 kB):** Single JS chunk exceeds 2MB without code splitting. Firebase, jsPDF, and React are bundled together, increasing mobile first-contentful-paint (FCP) times on village networks.
2. **Missing Test Suite:** No automated tests exist for milk calculations, ledger balancing, duplicate entry protection, or subscription schedules.
3. **Missing Raw Milk & Production Stock Ledger:** Dispatches and collections do not update an inventory balance subledger.

### P3 — Low (Code Quality & Polish)
1. Over 200 unused variables, unhandled hook dependencies, and dead imports reported by oxlint.
2. Inconsistent date formatting (locale strings vs ISO 8601 UTC).

---

## 5. Prioritized Implementation Roadmap

1. **Step 1 — Immediate Critical Fixes (P0 & P1):**
   - Fix React hook rules in `BankProfileView.tsx`.
   - Fix TS2367 type narrowing error in `LandingPage.tsx`.
   - Fix `calculateMilkAmount` money arithmetic to exact 2-decimal paise rounding.
   - Fix ID generation to high-entropy, timestamped, collision-free identifiers (`RF-YYYYMMDD-XXXXXX`).
   - Unify milk calculation into a single authoritative engine.
   - Patch `firestore.rules` to eliminate the wild catch-all read/write vulnerability.
   - Sanitize client-side auth fallback to prevent plaintext password leakage.

2. **Step 2 — Code Splitting & Performance Optimization:**
   - Configure `vite.config.js` with manual chunks (`vendor-react`, `vendor-firebase`, `vendor-pdf`, `vendor-icons`).
   - Verify bundle size reduction.

3. **Step 3 — Architecture & Business Modules Completion:**
   - Ensure atomic transactions for milk collections and ledger entries.
   - Add Raw Milk Inventory Reconciliation module.
   - Add Production & Finished Goods Yield tracking (Ghee, Paneer, Dahi, Makhan).

4. **Step 4 — Automated Testing:**
   - Install and configure Vitest test runner.
   - Write comprehensive unit & integration tests covering calculation precision, rate charts, double-entry ledger, and duplicate detection.
   - Verify 100% test pass rate.

5. **Step 5 — Documentation & Final Audit:**
   - Update architecture, database schema, and operational workflow documents.
   - Generate `FINAL_AUDIT_REPORT.md`.
