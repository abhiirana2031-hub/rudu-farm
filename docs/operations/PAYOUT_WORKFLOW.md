# FARMER SETTLEMENT & PAYOUT WORKFLOW
**Standard Operating Procedure (SOP)**  
**Rudu Dairy / Rudu Farm Financial Ledger Operations**  

---

## 1. Settlement Cycle
- Payout settlements run on standard 7-day or 10-day cycles (1st–10th, 11th–20th, 21st–end of month).
- All unbilled approved milk collections for the selected billing period are aggregated into the farmer's payable balance.

## 2. Settlement Calculation & Verification
1. Admin opens the **Payouts Settlement View**.
2. Select settlement billing period (Start Date to End Date).
3. The system computes for each farmer:
   - Total Milk Delivered (Liters)
   - Weighted Average FAT % and SNF %
   - Total Gross Earnings (Paise precision)
   - Prior Unpaid Balance / Advance Deductions
   - Net Payable Amount
4. Review farmer bank details (Account Number, IFSC, UPI ID) and KYC status.

## 3. Payout Execution & Idempotency
1. Admin initiates payout via UPI, Direct Bank Settlement, or Cash.
2. System assigns collision-free Payout ID: `RF-PAY-YYYYMMDD-HHMM-XXXX`.
3. Unique payment reference is generated (`UPI/TXN-...`).
4. Financial Subledger is updated:
   - Debit posted against Farmer Payable Balance.
   - Status marked as `Cleared`.
5. Payout receipt is generated and notification SMS is dispatched to the farmer's registered phone number.
