# MILK COLLECTION & QUALITY TESTING WORKFLOW
**Standard Operating Procedure (SOP)**  
**Rudu Dairy / Rudu Farm — Sikhreda Center**  

---

## 1. Shift Setup & Calibration
1. Operator arrives at collection center (Morning shift: 06:00 AM – 09:30 AM; Evening shift: 04:30 PM – 07:30 PM).
2. Clean and calibrate the digital milk analyzer / lactometer with reference distilled water sample.
3. Verify that the weighing balance is zeroed (tare set to 0.00 kg / L).

## 2. Intake Procedure
1. **Farmer Identification:**
   - Farmer enters center; operator scans farmer QR code or searches by Farmer Code / Phone Number / Name in the Operator Dashboard.
2. **Weighing & Milk Type Selection:**
   - Select milk category: **Desi Cow** or **Desi Buffalo**.
   - Record gross quantity in liters.
3. **Quality Testing (FAT % & SNF %):**
   - Sample milk using clean pipette.
   - Insert into analyzer; record FAT % and SNF % readings.
   - The pricing engine automatically validates readings against physical boundaries.
   - If values indicate possible dilution or adulteration, a warning indicator is flagged.
4. **Rate Calculation & Confirmation:**
   - The system looks up the active Rate Chart matrix for the selected milk type.
   - Rate per liter and total amount are calculated to the exact paise.
5. **Finalization & Thermal Slip Generation:**
   - Click "Submit Collection" to record the transaction.
   - System atomically:
     - Assigns collision-free entry ID: `RF-MC-YYYYMMDD-HHMMSS-XXXX`.
     - Assigns printable receipt number: `RCP-YYYYMMDD-XXXXX`.
     - Credits the farmer's passbook balance in the ledger.
     - Automatically prints thermal collection slip or sends DLT intake SMS.

## 3. Duplicate Protection
- The system checks if an entry for the same farmer, shift, date, and milk type already exists.
- If a match is found, operator is prompted with a confirmation dialog to prevent accidental double-scanning.
