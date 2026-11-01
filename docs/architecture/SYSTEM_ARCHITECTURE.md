# RUDU DAIRY / RUDU FARM — SYSTEM ARCHITECTURE SPECIFICATION
**Version:** 2.0.0 (Production Hardened)  
**Location:** Khasra No. 277, Sikhreda, Uttar Pradesh, India  
**Platform Scope:** Smart Dairy ERP, Milk Collection, Farmer Ledger, Tanker Dispatch, Consumer Store  

---

## 1. Architectural Topology

Rudu Dairy is designed as a **Modular Dairy ERP and E-Commerce Web Architecture**. It operates as a unified web application serving 4 distinct user profiles with strict role isolation:

```
                                  ┌───────────────────────────────┐
                                  │      RUDU DAIRY PLATFORM       │
                                  └───────────────┬───────────────┘
                                                  │
          ┌───────────────────────┬───────────────┴───────────────┬───────────────────────┐
          ▼                       ▼                               ▼                       ▼
  [ CONSUMERS ]             [ FARMERS ]                     [ OPERATORS ]              [ ADMINS ]
  - Storefront              - Passbook Ledger              - Rapid Shift Intake       - ERP Dashboard
  - Subscriptions           - Payment Slips                - Thermal Slip Printing    - Rate Configuration
  - Batch Purity Verify     - Bank/UPI KYC                 - Quality (FAT/SNF) Tests  - Bulk Payout Approval
          │                       │                               │                       │
          └───────────────────────┼───────────────────────────────┼───────────────────────┘
                                  ▼
                   ┌─────────────────────────────┐
                   │    APPLICATION CORE LAYER   │
                   │  - AppContext State Hub     │
                   │  - Pricing Engine           │
                   │  - Identifier Generator     │
                   │  - Role-Based Permissions   │
                   └──────────────┬──────────────┘
                                  │
          ┌───────────────────────┴───────────────────────┐
          ▼                                               ▼
  [ CLOUD FIRESTORE ]                             [ FAST2SMS DLT ]
  - Collection Entries                            - Intake Notification SMS
  - Double-Entry Subledger                        - Payment Credit Alerts
  - Tanker Dispatches & QA                        - Broadcast Announcements
  - Immutable Audit Logs                          - Rate Revision Alerts
```

---

## 2. Core Modules & Responsibilities

### 2.1 Pricing & Valuation Engine (`src/utils/milkCalculation.ts`)
- **Authority:** Calculates milk rates based on dynamic FAT % and SNF % matrix according to active rate chart.
- **Precision:** Uses scaled integer paise (`calculateMilkAmountInPaise`) to eliminate IEEE 754 floating-point drift.
- **Boundaries:** Validates physical boundaries (e.g. Cow FAT: 2.5%–6.5%, SNF: 7.5%–10.5%; Buffalo FAT: 4.5%–12.0%, SNF: 8.0%–12.0%).
- **Floors:** Enforces minimum rate floors preventing negative or below-cost calculations.

### 2.2 Collision-Free Identifier System (`src/utils/identifiers.ts`)
- **Milk Intake IDs:** `RF-MC-YYYYMMDD-HHMMSS-XXXX`
- **Farmer Receipts:** `RCP-YYYYMMDD-XXXXX`
- **Payout Settlements:** `RF-PAY-YYYYMMDD-HHMM-XXXX`
- **Tanker Dispatches:** `RF-DSP-YYYYMMDD-XXXX`
- **Product Batches:** `BATCH-[SKU]-YYYYMMDD-XX`

### 2.3 Double-Entry Financial Subledger (`src/lib/firebase/ledger.ts`)
- **Credit:** When milk is collected, a credit entry is posted to the farmer's balance.
- **Debit:** When a payout is cleared, a debit entry is posted against payable earnings.
- **Idempotency:** Payment allocations check available payable balance and prevent double settlements.

### 2.4 Code-Splitting & Build Pipeline (`vite.config.js`)
- **Manual Chunks:** Vendor bundles isolated for React, Firebase SDK, PDF generation (`jspdf`/`html2canvas`), and UI icons.
- **Performance:** Reduced bundle size and dropped build time to ~1.26s.
