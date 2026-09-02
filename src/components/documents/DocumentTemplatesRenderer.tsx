import React from 'react';
import {
  DocumentTemplateKey,
  PaperFormat,
  BusinessProfile,
  DocumentLineItem,
  DEFAULT_BUSINESS_PROFILE,
} from './document.types';
import {
  DocumentHeader,
  PartyInfoBox,
  DocumentSignatures,
  amountToWords,
} from './DocumentAtoms';

export interface DocumentRenderState {
  templateKey: DocumentTemplateKey;
  paperFormat: PaperFormat;
  docNumber: string;
  docDate: string;
  docTime: string;
  businessProfile?: BusinessProfile;

  // Beneficiary / Party Fields
  partyName: string;
  partyCode?: string;
  partyPhone?: string;
  partyVillage?: string;
  partyAddress?: string;
  partyGstin?: string;

  // Transaction Fields
  referenceId?: string;
  paymentMode: string;
  centerName?: string;
  operatorName?: string;
  notes?: string;

  // Financials & Line Items
  items: DocumentLineItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;

  // Specific Template Custom Fields
  milkType?: 'cow' | 'buffalo';
  quantityLiters?: number;
  fat?: number;
  snf?: number;
  clrReading?: number;
  ratePerLiter?: number;

  // Salary Slip specific
  designation?: string;
  department?: string;
  joiningDate?: string;
  bankAccount?: string;
  basicSalary?: number;
  allowances?: number;
  overtime?: number;
  deductions?: number;

  // Summary Tables data
  tableRecords?: Array<Record<string, any>>;
  summaryMetrics?: Record<string, any>;
}

export const DocumentTemplatesRenderer: React.FC<{ state: DocumentRenderState }> = ({ state }) => {
  const profile = state.businessProfile || DEFAULT_BUSINESS_PROFILE;
  const isThermal = state.paperFormat === 'THERMAL_80MM' || state.paperFormat === 'THERMAL_58MM';
  const thermalWidthClass = state.paperFormat === 'THERMAL_58MM' ? 'w-[58mm] max-w-[58mm]' : 'w-[80mm] max-w-[80mm]';

  // ───────────────────────────────────────────────────────────────────────────
  // 1. THERMAL PRINT LAYOUT (For Milk Intake & POS Receipts)
  // ───────────────────────────────────────────────────────────────────────────
  if (isThermal) {
    return (
      <div
        id="printable-document-root"
        className={`${thermalWidthClass} mx-auto bg-white p-3 font-mono text-[11px] text-gray-950 leading-tight border border-gray-300 shadow-sm print:border-none print:shadow-none print:p-0 print:m-0`}
      >
        {/* Thermal Header */}
        <div className="text-center pb-2 border-b border-dashed border-gray-700 space-y-0.5">
          <div className="text-xs font-black uppercase tracking-wider">{profile.name}</div>
          <div className="text-[9px] text-gray-600">{profile.address}</div>
          <div className="text-[9px]">Ph: {profile.phone}</div>
          <div className="text-[10px] font-black uppercase tracking-widest pt-1 border-t border-dotted border-gray-400 mt-1">
            *** MILK INTAKE RECEIPT ***
          </div>
        </div>

        {/* Receipt Meta */}
        <div className="py-2 border-b border-dashed border-gray-700 space-y-0.5 text-[10px]">
          <div className="flex justify-between">
            <span>Doc #:</span> <span className="font-bold">{state.docNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Date/Time:</span> <span>{state.docDate} {state.docTime}</span>
          </div>
          <div className="flex justify-between">
            <span>Center:</span> <span className="font-bold">{state.centerName || 'AMCU Hub #01'}</span>
          </div>
          <div className="flex justify-between">
            <span>Operator:</span> <span>{state.operatorName || 'Staff Operator'}</span>
          </div>
        </div>

        {/* Farmer Info */}
        <div className="py-2 border-b border-dashed border-gray-700 space-y-0.5 text-[10px]">
          <div className="flex justify-between">
            <span>Farmer:</span> <span className="font-black text-right">{state.partyName}</span>
          </div>
          <div className="flex justify-between">
            <span>Code / ID:</span> <span className="font-bold">{state.partyCode || 'RF-MEM'}</span>
          </div>
          <div className="flex justify-between">
            <span>Village:</span> <span>{state.partyVillage || 'Local Hub'}</span>
          </div>
        </div>

        {/* Milk Quality & Quantity Grid */}
        <div className="py-2 border-b-2 border-gray-900 space-y-1">
          <div className="flex justify-between text-[11px] font-bold">
            <span>Milk Type:</span> <span className="uppercase">{state.milkType || 'COW'}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center py-1 bg-gray-100 rounded text-[10px]">
            <div>
              <span className="block text-[8px] uppercase text-gray-500">Qty (L)</span>
              <span className="font-bold text-xs">{(state.quantityLiters || 0).toFixed(1)}</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase text-gray-500">FAT %</span>
              <span className="font-bold text-xs">{(state.fat || 0).toFixed(1)}%</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase text-gray-500">SNF %</span>
              <span className="font-bold text-xs">{(state.snf || 0).toFixed(1)}%</span>
            </div>
          </div>
          <div className="flex justify-between text-[11px] pt-1">
            <span>Rate / Liter:</span>
            <span className="font-bold font-sans">₹{(state.ratePerLiter || 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Prominent Amount */}
        <div className="py-2.5 text-center border-b border-dashed border-gray-700">
          <span className="text-[9px] uppercase tracking-wider block text-gray-600 font-bold">
            Total Milk Payable
          </span>
          <div className="text-lg font-black font-sans tracking-tight">
            ₹{state.grandTotal.toFixed(2)}
          </div>
          <div className="text-[8px] text-gray-500 italic mt-0.5">
            {amountToWords(state.grandTotal)}
          </div>
        </div>

        {/* Thermal Footer */}
        <div className="pt-2 text-center text-[9px] text-gray-600 space-y-1">
          <p>Thank you for supplying to Rudu Farm!</p>
          <p className="font-mono text-[8px]">Powered by Rudu Smart Dairy ERP</p>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. STANDARD A4 / A5 PRINT LAYOUTS
  // ───────────────────────────────────────────────────────────────────────────
  const pageClass = state.paperFormat === 'A5' ? 'max-w-[148mm] min-h-[210mm]' : 'max-w-[210mm] min-h-[297mm]';

  return (
    <div
      id="printable-document-root"
      className={`${pageClass} mx-auto bg-white p-8 font-sans text-gray-900 border border-gray-200 shadow-md print:border-none print:shadow-none print:p-0 print:m-0 print:w-full`}
    >
      {/* Dynamic Template Switcher */}
      {(() => {
        switch (state.templateKey) {
          // ─── 1. GENERAL RECEIPT ─────────────────────────────────────────────
          case 'GENERAL_RECEIPT':
            return (
              <div>
                <DocumentHeader
                  profile={profile}
                  title="MONEY RECEIPT"
                  docNumber={state.docNumber}
                  docDate={state.docDate}
                  docTime={state.docTime}
                  badgeText="Official Acknowledgement"
                />

                <PartyInfoBox
                  leftTitle="Received From"
                  leftData={[
                    { label: 'Name', value: state.partyName },
                    { label: 'ID / Phone', value: state.partyPhone || state.partyCode },
                    { label: 'Address', value: state.partyAddress || state.partyVillage },
                  ]}
                  rightTitle="Payment Particulars"
                  rightData={[
                    { label: 'Payment Mode', value: state.paymentMode },
                    { label: 'Ref / Txn ID', value: state.referenceId },
                    { label: 'Collection Center', value: state.centerName },
                  ]}
                />

                <div className="my-6 p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-bold uppercase">Receipt Description:</span>
                    <span className="font-bold text-gray-900">{state.notes || 'Dairy intake credit settlement / general receipt'}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="text-sm font-black text-gray-700">Total Amount Received:</span>
                    <span className="text-2xl font-black text-emerald-950 font-sans">₹{state.grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-500 italic bg-white p-2 rounded border border-gray-100">
                    <span className="font-bold text-gray-700">In Words:</span> {amountToWords(state.grandTotal)}
                  </div>
                </div>

                <DocumentSignatures sign1Title="Depositor Sign" sign2Title="Cashier / Operator" sign2Name={state.operatorName} />
              </div>
            );

          // ─── 2. TAX INVOICE / BILL PRINT & SALE BILL ────────────────────────
          case 'BILL_PRINT':
          case 'SALE_BILL':
          case 'PURCHASE_BILL':
          case 'MISCELLANEOUS_BILL':
            return (
              <div>
                <DocumentHeader
                  profile={profile}
                  title={
                    state.templateKey === 'PURCHASE_BILL'
                      ? 'PURCHASE INWARD BILL'
                      : state.templateKey === 'SALE_BILL'
                      ? 'COMMERCIAL SALE BILL'
                      : state.templateKey === 'MISCELLANEOUS_BILL'
                      ? 'MISCELLANEOUS INVOICE'
                      : 'TAX INVOICE'
                  }
                  docNumber={state.docNumber}
                  docDate={state.docDate}
                  badgeText="Original For Recipient"
                />

                <PartyInfoBox
                  leftTitle={state.templateKey === 'PURCHASE_BILL' ? 'Supplier Details' : 'Billed To (Customer / Member)'}
                  leftData={[
                    { label: 'Name / Business', value: state.partyName },
                    { label: 'Code / ID', value: state.partyCode },
                    { label: 'Phone', value: state.partyPhone },
                    { label: 'Address', value: state.partyAddress || state.partyVillage },
                    { label: 'GSTIN', value: state.partyGstin || 'Unregistered Consumer' },
                  ]}
                  rightTitle="Invoice Meta"
                  rightData={[
                    { label: 'Invoice No', value: state.docNumber },
                    { label: 'Date of Issue', value: state.docDate },
                    { label: 'Payment Mode', value: state.paymentMode },
                    { label: 'Place of Supply', value: 'Gujarat (24)' },
                  ]}
                />

                {/* Items Table */}
                <div className="overflow-x-auto my-4">
                  <table className="w-full text-xs text-left border border-gray-300">
                    <thead className="bg-gray-100 text-gray-700 uppercase font-bold border-b border-gray-300">
                      <tr>
                        <th className="py-2 px-3 border-r border-gray-300 w-10 text-center">#</th>
                        <th className="py-2 px-3 border-r border-gray-300">Item Description</th>
                        <th className="py-2 px-3 border-r border-gray-300 text-right">Qty</th>
                        <th className="py-2 px-3 border-r border-gray-300 text-right">Rate (₹)</th>
                        <th className="py-2 px-3 border-r border-gray-300 text-right">Disc (₹)</th>
                        <th className="py-2 px-3 border-r border-gray-300 text-right">Tax</th>
                        <th className="py-2 px-3 text-right">Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {state.items.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="py-2 px-3 border-r border-gray-200 text-center font-mono">{idx + 1}</td>
                          <td className="py-2 px-3 border-r border-gray-200 font-bold">{item.description}</td>
                          <td className="py-2 px-3 border-r border-gray-200 text-right font-mono">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="py-2 px-3 border-r border-gray-200 text-right font-mono">
                            ₹{item.rate.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 border-r border-gray-200 text-right font-mono">
                            ₹{(item.discount || 0).toFixed(2)}
                          </td>
                          <td className="py-2 px-3 border-r border-gray-200 text-right font-mono">
                            {item.taxPercent || 0}%
                          </td>
                          <td className="py-2 px-3 text-right font-bold font-mono">
                            ₹{item.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Calculation Totals */}
                <div className="flex justify-between items-start gap-6 my-4">
                  <div className="w-1/2 text-xs space-y-2">
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                      <span className="font-bold text-gray-700 block text-[10px] uppercase tracking-wider">Amount in Words:</span>
                      <p className="italic text-gray-600 font-medium">{amountToWords(state.grandTotal)}</p>
                    </div>
                    {state.notes && (
                      <p className="text-[11px] text-gray-500">
                        <span className="font-bold">Remarks:</span> {state.notes}
                      </p>
                    )}
                  </div>

                  <div className="w-1/2 text-xs space-y-1.5 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal:</span>
                      <span className="font-mono font-bold">₹{state.subtotal.toFixed(2)}</span>
                    </div>
                    {state.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-800">
                        <span>Discount:</span>
                        <span className="font-mono font-bold">- ₹{state.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {state.taxAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">GST / Tax:</span>
                        <span className="font-mono font-bold">₹{state.taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-300 pt-1.5 text-sm font-black text-gray-950">
                      <span>Grand Total:</span>
                      <span className="font-mono text-emerald-900">₹{state.grandTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] pt-1 border-t border-dashed border-gray-200">
                      <span className="text-gray-500">Amount Paid:</span>
                      <span className="font-mono font-bold">₹{state.amountPaid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-amber-900">
                      <span>Balance Due:</span>
                      <span className="font-mono">₹{state.balanceDue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <DocumentSignatures
                  sign1Title="Receiver's Signature"
                  sign2Title="Prepared By"
                  sign2Name={state.operatorName}
                  terms="Payment is due upon receipt. Goods once sold are not returnable. Subject to Anand jurisdiction."
                />
              </div>
            );

          // ─── 3. SALARY SLIP ─────────────────────────────────────────────────
          case 'SALARY_SLIP':
            const basic = state.basicSalary || 18000;
            const allowance = state.allowances || 4500;
            const overtimePay = state.overtime || 1200;
            const gross = basic + allowance + overtimePay;
            const ded = state.deductions || 500;
            const net = gross - ded;

            return (
              <div>
                <DocumentHeader
                  profile={profile}
                  title="EMPLOYEE SALARY SLIP"
                  docNumber={state.docNumber}
                  docDate={state.docDate}
                  badgeText="Confidential Payroll Document"
                />

                <PartyInfoBox
                  leftTitle="Employee Particulars"
                  leftData={[
                    { label: 'Employee Name', value: state.partyName },
                    { label: 'Staff ID', value: state.partyCode || 'EMP-104' },
                    { label: 'Designation', value: state.designation || 'Collection Center Incharge' },
                    { label: 'Department', value: state.department || 'Dairy Operations & BMC' },
                    { label: 'Date of Joining', value: state.joiningDate || '12 Jan 2024' },
                  ]}
                  rightTitle="Salary & Banking Info"
                  rightData={[
                    { label: 'Pay Period', value: state.docDate },
                    { label: 'Bank Name', value: 'State Bank of India' },
                    { label: 'Account No', value: state.bankAccount || '•••• •••• 4892' },
                    { label: 'Payment Mode', value: state.paymentMode || 'Direct Bank NEFT' },
                  ]}
                />

                <div className="grid grid-cols-2 gap-4 my-4">
                  {/* Earnings */}
                  <div className="border border-emerald-200 rounded-xl overflow-hidden text-xs">
                    <div className="bg-emerald-800 text-white font-bold px-3 py-1.5 uppercase text-[10px]">
                      Earnings Breakdown
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="flex justify-between"><span>Basic Salary:</span> <span className="font-mono font-bold">₹{basic.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>House Rent / Dearness Allowance:</span> <span className="font-mono font-bold">₹{allowance.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Overtime & Shift Bonus:</span> <span className="font-mono font-bold">₹{overtimePay.toFixed(2)}</span></div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-emerald-950">
                        <span>Gross Salary:</span> <span className="font-mono">₹{gross.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="border border-red-200 rounded-xl overflow-hidden text-xs">
                    <div className="bg-red-900 text-white font-bold px-3 py-1.5 uppercase text-[10px]">
                      Deductions
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="flex justify-between"><span>Provident Fund (PF):</span> <span className="font-mono font-bold">₹350.00</span></div>
                      <div className="flex justify-between"><span>Advance / Loan Recovery:</span> <span className="font-mono font-bold">₹{ded.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Professional Tax:</span> <span className="font-mono font-bold">₹150.00</span></div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-red-950">
                        <span>Total Deductions:</span> <span className="font-mono">₹{(ded + 500).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Salary Highlight */}
                <div className="p-4 bg-emerald-900 text-white rounded-xl flex justify-between items-center my-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-300 block">Net Payable Amount</span>
                    <span className="text-xs italic text-emerald-100">{amountToWords(net - 500)}</span>
                  </div>
                  <div className="text-2xl font-black font-sans">
                    ₹{(net - 500).toFixed(2)}
                  </div>
                </div>

                <DocumentSignatures sign1Title="Employee Signature" sign1Name={state.partyName} sign2Title="HR / Accounts Manager" />
              </div>
            );

          // ─── 4. SALE MILK RECEIPT (A4 Full Professional) ───────────────────
          case 'SALE_MILK_RECEIPT':
            return (
              <div>
                <DocumentHeader
                  profile={profile}
                  title="MILK INTAKE COLLECTION SLIP"
                  docNumber={state.docNumber}
                  docDate={state.docDate}
                  docTime={state.docTime}
                  badgeText="Farmer Digital Passbook Entry"
                />

                <PartyInfoBox
                  leftTitle="Farmer Details"
                  leftData={[
                    { label: 'Farmer Name', value: state.partyName },
                    { label: 'Farmer Code', value: state.partyCode },
                    { label: 'Mobile No', value: state.partyPhone },
                    { label: 'Village / Hub', value: state.partyVillage },
                  ]}
                  rightTitle="Collection Center & Shift"
                  rightData={[
                    { label: 'Collection Center', value: state.centerName || 'AMCU Kheda Center #01' },
                    { label: 'Operator Name', value: state.operatorName || 'Staff Incharge' },
                    { label: 'Intake Date & Time', value: `${state.docDate} ${state.docTime}` },
                    { label: 'Payment Status', value: 'Credited to Ledger' },
                  ]}
                />

                {/* Milk Testing Analysis Card */}
                <div className="my-5 p-4 rounded-2xl border-2 border-emerald-800/80 bg-emerald-50/40">
                  <div className="text-xs font-black text-emerald-950 uppercase tracking-wider mb-3 flex justify-between">
                    <span>Quality Lab & Rate Analysis</span>
                    <span className="bg-emerald-800 text-white px-2 py-0.5 rounded text-[10px]">
                      {(state.milkType || 'Cow').toUpperCase()} MILK
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-3 text-center mb-4">
                    <div className="p-3 bg-white rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-gray-500 font-bold uppercase block">Quantity</span>
                      <span className="text-xl font-black text-gray-950 font-mono">{(state.quantityLiters || 0).toFixed(1)} L</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-gray-500 font-bold uppercase block">FAT %</span>
                      <span className="text-xl font-black text-emerald-800 font-mono">{(state.fat || 0).toFixed(1)}%</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-gray-500 font-bold uppercase block">SNF %</span>
                      <span className="text-xl font-black text-blue-800 font-mono">{(state.snf || 0).toFixed(1)}%</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-gray-500 font-bold uppercase block">Rate / Liter</span>
                      <span className="text-xl font-black text-emerald-950 font-mono">₹{(state.ratePerLiter || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-900 text-white rounded-xl flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-emerald-300 uppercase font-bold block">Total Milk Value</span>
                      <span className="text-xs italic text-emerald-100">{amountToWords(state.grandTotal)}</span>
                    </div>
                    <div className="text-2xl font-black font-sans">
                      ₹{state.grandTotal.toFixed(2)}
                    </div>
                  </div>
                </div>

                <DocumentSignatures
                  sign1Title="Farmer's Signature"
                  sign1Name={state.partyName}
                  sign2Title="Tester / Operator"
                  sign2Name={state.operatorName}
                />
              </div>
            );

          // ─── 5. EXPENSE BILL ────────────────────────────────────────────────
          case 'EXPENSE_BILL':
            return (
              <div>
                <DocumentHeader
                  profile={profile}
                  title="EXPENSE VOUCHER"
                  docNumber={state.docNumber}
                  docDate={state.docDate}
                  badgeText="Accounts Department"
                />

                <PartyInfoBox
                  leftTitle="Payee Particulars"
                  leftData={[
                    { label: 'Paid To', value: state.partyName },
                    { label: 'Phone / Contact', value: state.partyPhone },
                    { label: 'Category', value: state.notes || 'Center Operational Maintenance' },
                  ]}
                  rightTitle="Voucher Details"
                  rightData={[
                    { label: 'Voucher Number', value: state.docNumber },
                    { label: 'Payment Mode', value: state.paymentMode },
                    { label: 'Reference / Chq #', value: state.referenceId },
                  ]}
                />

                <div className="my-6 p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-bold">Expense Description:</span>
                    <span className="font-bold text-gray-900 text-right">{state.notes || 'BMC chiller service and diesel generator fuel'}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="text-sm font-black text-gray-700">Total Expense Amount:</span>
                    <span className="text-2xl font-black text-gray-950 font-sans">₹{state.grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-500 italic bg-white p-2 rounded border border-gray-100">
                    <span className="font-bold text-gray-700">In Words:</span> {amountToWords(state.grandTotal)}
                  </div>
                </div>

                <DocumentSignatures
                  sign1Title="Payee Receiver Sign"
                  sign1Name={state.partyName}
                  sign2Title="Prepared By"
                  sign3Title="Approved By Manager"
                />
              </div>
            );

          // ─── 6. 10-DAY FARMER MILK SUMMARY ─────────────────────────────────
          case 'FARMER_10DAY_SUMMARY':
            const summaryTable = state.tableRecords || [];

            return (
              <div>
                <DocumentHeader
                  profile={profile}
                  title="10-DAY FARMER MILK SUMMARY"
                  docNumber={state.docNumber}
                  docDate={state.docDate}
                  badgeText="Billing Cycle Settlement"
                />

                <PartyInfoBox
                  leftTitle="Farmer Identification"
                  leftData={[
                    { label: 'Farmer Name', value: state.partyName },
                    { label: 'Farmer Code', value: state.partyCode },
                    { label: 'Mobile', value: state.partyPhone },
                    { label: 'Village', value: state.partyVillage },
                  ]}
                  rightTitle="Cycle Particulars"
                  rightData={[
                    { label: 'Billing Period', value: state.referenceId || '10-Day Cycle' },
                    { label: 'Center Hub', value: state.centerName || 'Collection Hub' },
                    { label: 'Settlement Status', value: 'Calculated' },
                  ]}
                />

                {/* Cycle Intake Table */}
                <div className="overflow-x-auto my-4">
                  <table className="w-full text-xs text-left border border-gray-300">
                    <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-300 text-[10px] uppercase">
                      <tr>
                        <th className="py-2 px-2 border-r border-gray-300">Date</th>
                        <th className="py-2 px-2 border-r border-gray-300">Shift</th>
                        <th className="py-2 px-2 border-r border-gray-300">Type</th>
                        <th className="py-2 px-2 border-r border-gray-300 text-right">Qty (L)</th>
                        <th className="py-2 px-2 border-r border-gray-300 text-right">FAT%</th>
                        <th className="py-2 px-2 border-r border-gray-300 text-right">SNF%</th>
                        <th className="py-2 px-2 border-r border-gray-300 text-right">Rate/L</th>
                        <th className="py-2 px-2 text-right">Gross (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {summaryTable.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-4 text-center text-gray-400">
                            No collection records found for this period.
                          </td>
                        </tr>
                      ) : (
                        summaryTable.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="py-1.5 px-2 border-r border-gray-200">{row.date}</td>
                            <td className="py-1.5 px-2 border-r border-gray-200">{row.shift}</td>
                            <td className="py-1.5 px-2 border-r border-gray-200 capitalize">{row.type}</td>
                            <td className="py-1.5 px-2 border-r border-gray-200 text-right font-mono font-bold">{Number(row.qty).toFixed(1)}</td>
                            <td className="py-1.5 px-2 border-r border-gray-200 text-right font-mono">{Number(row.fat).toFixed(1)}</td>
                            <td className="py-1.5 px-2 border-r border-gray-200 text-right font-mono">{Number(row.snf).toFixed(1)}</td>
                            <td className="py-1.5 px-2 border-r border-gray-200 text-right font-mono">₹{Number(row.rate).toFixed(2)}</td>
                            <td className="py-1.5 px-2 text-right font-mono font-bold">₹{Number(row.amt).toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Summary Metrics & Net Payable */}
                <div className="grid grid-cols-2 gap-4 my-4 text-xs">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                    <span className="font-bold text-gray-700 block text-[10px] uppercase">Summary Metrics:</span>
                    <p>Total Milk Supplied: <span className="font-bold font-mono">{state.quantityLiters || 0} Liters</span></p>
                    <p>Average FAT: <span className="font-bold font-mono">{state.fat || 0}%</span> • Average SNF: <span className="font-bold font-mono">{state.snf || 0}%</span></p>
                    <p className="italic text-gray-500 pt-1">{amountToWords(state.grandTotal)}</p>
                  </div>

                  <div className="p-3 bg-emerald-950 text-white rounded-xl flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-emerald-300">Net Payable for Cycle</span>
                      <span className="text-2xl font-black font-sans">₹{state.grandTotal.toFixed(2)}</span>
                    </div>
                    <div className="text-[10px] text-emerald-200 pt-1 border-t border-emerald-800/80 flex justify-between">
                      <span>Gross: ₹{state.grandTotal.toFixed(2)}</span>
                      <span>Deductions: ₹0.00</span>
                    </div>
                  </div>
                </div>

                <DocumentSignatures sign1Title="Farmer's Signature" sign1Name={state.partyName} sign2Title="Center Operator" sign3Title="Dairy Executive" />
              </div>
            );

          // ─── 7. FARMER PAYOUT RECEIPT ───────────────────────────────────────
          case 'FARMER_PAYOUT_RECEIPT':
            return (
              <div>
                <DocumentHeader
                  profile={profile}
                  title="FARMER PAYOUT RECEIPT"
                  docNumber={state.docNumber}
                  docDate={state.docDate}
                  badgeText="Bank Disbursement Confirmed"
                />

                <PartyInfoBox
                  leftTitle="Farmer Beneficiary"
                  leftData={[
                    { label: 'Farmer Name', value: state.partyName },
                    { label: 'Farmer Code', value: state.partyCode },
                    { label: 'Phone', value: state.partyPhone },
                    { label: 'Village', value: state.partyVillage },
                  ]}
                  rightTitle="Disbursement Details"
                  rightData={[
                    { label: 'Payment Method', value: state.paymentMode },
                    { label: 'UTR / Ref ID', value: state.referenceId },
                    { label: 'Settlement Period', value: state.notes || 'Cycle Payout' },
                    { label: 'Disbursed By', value: state.operatorName || 'Finance Manager' },
                  ]}
                />

                <div className="my-6 p-5 rounded-2xl bg-emerald-900 text-white flex justify-between items-center shadow-sm">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">Total Amount Disbursed</span>
                    <span className="text-sm italic text-emerald-100">{amountToWords(state.grandTotal)}</span>
                  </div>
                  <div className="text-3xl font-black font-sans tracking-tight">
                    ₹{state.grandTotal.toFixed(2)}
                  </div>
                </div>

                <DocumentSignatures sign1Title="Farmer Receiver Sign" sign1Name={state.partyName} sign2Title="Disbursing Officer" />
              </div>
            );

          // ─── 8. FARMER LEDGER STATEMENT ─────────────────────────────────────
          case 'FARMER_LEDGER_STATEMENT':
            const ledgerRows = state.tableRecords || [];

            return (
              <div>
                <DocumentHeader
                  profile={profile}
                  title="FARMER PASSBOOK LEDGER STATEMENT"
                  docNumber={state.docNumber}
                  docDate={state.docDate}
                  badgeText="Official Statement of Account"
                />

                <PartyInfoBox
                  leftTitle="Account Holder"
                  leftData={[
                    { label: 'Farmer Name', value: state.partyName },
                    { label: 'Farmer Code', value: state.partyCode },
                    { label: 'Phone', value: state.partyPhone },
                    { label: 'Village', value: state.partyVillage },
                  ]}
                  rightTitle="Statement Overview"
                  rightData={[
                    { label: 'Statement Date', value: state.docDate },
                    { label: 'Opening Balance', value: '₹0.00' },
                    { label: 'Closing Balance', value: `₹${state.balanceDue.toFixed(2)}` },
                  ]}
                />

                <div className="overflow-x-auto my-4">
                  <table className="w-full text-xs text-left border border-gray-300">
                    <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-300 text-[10px] uppercase">
                      <tr>
                        <th className="py-2 px-3 border-r border-gray-300">Date</th>
                        <th className="py-2 px-3 border-r border-gray-300 font-mono">Reference</th>
                        <th className="py-2 px-3 border-r border-gray-300">Transaction Description</th>
                        <th className="py-2 px-3 border-r border-gray-300 text-right text-emerald-800">Credit (₹)</th>
                        <th className="py-2 px-3 border-r border-gray-300 text-right text-red-800">Debit (₹)</th>
                        <th className="py-2 px-3 text-right font-black">Running Bal (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-mono">
                      {ledgerRows.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-4 text-center text-gray-400 font-sans">
                            No ledger transactions recorded.
                          </td>
                        </tr>
                      ) : (
                        ledgerRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="py-2 px-3 border-r border-gray-200 font-sans">{row.date}</td>
                            <td className="py-2 px-3 border-r border-gray-200 text-gray-600">{row.ref}</td>
                            <td className="py-2 px-3 border-r border-gray-200 font-sans text-gray-900 font-medium">{row.desc}</td>
                            <td className="py-2 px-3 border-r border-gray-200 text-right text-emerald-900 font-bold">
                              {row.cr > 0 ? `₹${row.cr.toFixed(2)}` : '—'}
                            </td>
                            <td className="py-2 px-3 border-r border-gray-200 text-right text-red-900 font-bold">
                              {row.dr > 0 ? `₹${row.dr.toFixed(2)}` : '—'}
                            </td>
                            <td className="py-2 px-3 text-right font-black">₹{row.bal.toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <DocumentSignatures sign1Title="Farmer Signature" sign1Name={state.partyName} sign2Title="Accountant / Cashier" />
              </div>
            );

          // ─── 9. OPERATIONAL SUMMARIES & REPORTS ──────────────────────────────
          case 'CENTER_DAILY_SUMMARY':
          case 'OPERATOR_DAILY_SUMMARY':
          case 'MONTHLY_COLLECTION_REPORT':
            return (
              <div>
                <DocumentHeader
                  profile={profile}
                  title={
                    state.templateKey === 'CENTER_DAILY_SUMMARY'
                      ? 'COLLECTION CENTER DAILY SUMMARY'
                      : state.templateKey === 'OPERATOR_DAILY_SUMMARY'
                      ? 'OPERATOR SHIFT ACTIVITY REPORT'
                      : 'MONTHLY MILK COLLECTION REPORT'
                  }
                  docNumber={state.docNumber}
                  docDate={state.docDate}
                  badgeText="Operational Audit Report"
                />

                <PartyInfoBox
                  leftTitle="Operational Details"
                  leftData={[
                    { label: 'Collection Center', value: state.centerName || 'AMCU Center #01' },
                    { label: 'Incharge / Operator', value: state.operatorName || 'Staff Incharge' },
                    { label: 'Report Date / Month', value: state.docDate },
                  ]}
                  rightTitle="Volume & Intake Metrics"
                  rightData={[
                    { label: 'Total Milk Inflow', value: `${(state.quantityLiters || 245.5).toFixed(1)} Liters` },
                    { label: 'Gross Milk Value', value: `₹${state.grandTotal.toFixed(2)}` },
                    { label: 'Active Farmers Served', value: state.partyCode || '24 Members' },
                  ]}
                />

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-4 gap-3 my-4 text-center">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Total Volume</span>
                    <span className="text-xl font-black text-emerald-950 font-mono">{(state.quantityLiters || 245.5).toFixed(1)} L</span>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Cow Milk</span>
                    <span className="text-xl font-black text-blue-950 font-mono">165.0 L (67%)</span>
                  </div>
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Buffalo Milk</span>
                    <span className="text-xl font-black text-indigo-950 font-mono">80.5 L (33%)</span>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Avg Quality</span>
                    <span className="text-xl font-black text-amber-950 font-mono">4.2F / 8.6S</span>
                  </div>
                </div>

                <DocumentSignatures
                  sign1Title="Center Manager"
                  sign1Name={state.operatorName}
                  sign2Title="Quality Control Officer"
                  sign3Title="Dairy Executive"
                />
              </div>
            );

          default:
            return <div>Select a template to preview.</div>;
        }
      })()}
    </div>
  );
};
