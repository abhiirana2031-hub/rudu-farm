# CLOUD FIRESTORE SCHEMA & SECURITY SPECIFICATION
**Project:** Rudu Dairy / Rudu Farm  
**Security Profile:** Multi-Role Isolated + Tenant Aware  

---

## 1. Document Collections Schema

### 1.1 `/entries/{entryId}` (Milk Collection Records)
- `id`: `string` (e.g., `RF-MC-20261027-073000-1042`)
- `receiptId`: `string` (e.g., `RCP-20261027-10421`)
- `tenantId`: `string` (e.g., `rudu-tenant-main`)
- `farmerId`: `string`
- `farmerName`: `string`
- `farmerCode`: `string`
- `date`: `string` (e.g., `27 Oct 2026`)
- `time`: `string` (e.g., `07:30 AM`)
- `shift`: `'morning' | 'evening'`
- `milkType`: `'cow' | 'buffalo'`
- `quantityLiters`: `number` (decimal liters)
- `fatPercentage`: `number` (e.g., 4.2)
- `snfPercentage`: `number` (e.g., 8.5)
- `ratePerLiter`: `number` (e.g., 51.10)
- `totalAmount`: `number` (e.g., 638.75)
- `status`: `'Approved' | 'Pending' | 'Flagged'`
- `source`: `'manual' | 'chart' | 'auto'`

### 1.2 `/farmers/{farmerId}` (Farmer Profiles)
- `id`: `string` (e.g., `RF101`)
- `farmerCode`: `string`
- `name`: `string`
- `phone`: `string`
- `village`: `string`
- `district`: `string`
- `cattleCount`: `number`
- `cowCount`: `number`
- `buffaloCount`: `number`
- `memberSince`: `string`
- `bankDetails`:
  - `accountHolder`: `string`
  - `bankName`: `string`
  - `accountNumber`: `string`
  - `ifscCode`: `string`
  - `upiId`: `string`
  - `kycStatus`: `'Verified' | 'Pending' | 'Rejected'`

### 1.3 `/payouts/{payoutId}` (Payout Settlements)
- `id`: `string` (e.g., `RF-PAY-20261027-1455-1002`)
- `payoutId`: `string`
- `farmerId`: `string`
- `farmerName`: `string`
- `farmerCode`: `string`
- `amount`: `number` (Rupees)
- `periodStart`: `string`
- `periodEnd`: `string`
- `paymentMethod`: `'UPI' | 'Bank Transfer' | 'Cash Settlement'`
- `paymentReference`: `string`
- `totalMilkSupplied`: `number`
- `avgRate`: `number`
- `paidOn`: `string`
- `status`: `'Cleared' | 'Pending' | 'Failed'`

### 1.4 `/tanker_dispatches/{dispatchId}` (Bulk Cold-Chain Logistics)
- `id`: `string` (e.g., `RF-DSP-20261027-1042`)
- `tankerNumber`: `string`
- `driverName`: `string`
- `driverPhone`: `string`
- `quantityLiters`: `number`
- `milkType`: `'cow' | 'buffalo' | 'mixed'`
- `dispatchDate`: `string`
- `destination`: `string`
- `sealNumber`: `string`
- `status`: `'In Transit' | 'Delivered' | 'Pending'`

### 1.5 `/audit_logs/{auditId}` (System Audit Trail)
- `id`: `string`
- `timestamp`: `string`
- `actorId`: `string`
- `actorRole`: `string`
- `action`: `string`
- `details`: `object`
- **Rule:** Append-only; strictly immutable (update and delete disabled).

---

## 2. Security Access Control Matrix

| Collection | Unauthenticated | Farmer | Operator | Admin |
| :--- | :--- | :--- | :--- | :--- |
| `/products` | Read | Read | Read | Read / Write |
| `/entries` | Denied | Read Own | Create / Read | Read / Write |
| `/farmers` | Denied | Read Own | Read / Create | Read / Write |
| `/payouts` | Denied | Read Own | Read Only | Create / Read |
| `/settings` | Denied | Read Only | Read Only | Read / Write |
| `/tanker_dispatches` | Denied | Denied | Create / Read | Read / Write |
| `/audit_logs` | Denied | Denied | Create Only | Read Only (No Delete) |
| `/orders` | Create | Read Own | Read Only | Read / Write |
