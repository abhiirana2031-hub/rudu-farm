import React, { useState, useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  Phone,
  CheckCircle2,
  Lock,
  PlusCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { FarmerBillingReport, BillingAdjustment } from '../../types/billing';
import { useApp } from '../../context/AppContext';
import { formatWhatsAppBillingMessage, formatSmsBillingMessage } from '../../services/billingReportService';
import { BUSINESS } from '../../config/business';
import { RuduLogo } from '../RuduLogo';
import { BillingAdjustmentModal } from './BillingAdjustmentModal';

interface FarmerBillingReportModalProps {
  report: FarmerBillingReport | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateReport?: (updated: FarmerBillingReport) => void;
}

export const FarmerBillingReportModal: React.FC<FarmerBillingReportModalProps> = ({
  report,
  isOpen,
  onClose,
  onUpdateReport,
}) => {
  const { userRole } = useApp();
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !report) return null;

  // Print Handler (Admin / Authorized)
  const handlePrint = () => {
    window.print();
  };

  // WhatsApp Handler
  const handleSendWhatsApp = () => {
    const text = formatWhatsAppBillingMessage(report);
    let phoneClean = report.farmerMobile.replace(/\D/g, '');
    if (phoneClean.length === 10) phoneClean = `91${phoneClean}`;
    const url = `https://api.whatsapp.com/send?phone=${phoneClean}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setActionSuccess('WhatsApp statement generated!');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // SMS Handler (Admin Only)
  const handleSendSms = () => {
    if (userRole !== 'admin') {
      alert('Only Dairy Administrators have permission to dispatch SMS statements.');
      return;
    }
    const smsText = formatSmsBillingMessage(report);
    setActionSuccess(`SMS queued for ${report.farmerMobile}: "${smsText.slice(0, 45)}..."`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Add Adjustment Handler (Admin Only)
  const handleAddAdjustment = (adj: BillingAdjustment) => {
    const updatedAdjustments = [...report.adjustments, adj];
    const totalAdjustments = updatedAdjustments.reduce((s, a) => s + a.amount, 0);
    const updatedNetPayable = Number(
      (
        report.grossMilkAmount +
        report.previousBalance -
        report.advanceAmount -
        report.deductionAmount +
        totalAdjustments
      ).toFixed(2)
    );
    const updatedClosingBalance = Number((updatedNetPayable - report.paymentsMade).toFixed(2));

    const updatedReport: FarmerBillingReport = {
      ...report,
      adjustments: updatedAdjustments,
      adjustmentAmount: totalAdjustments,
      netPayable: updatedNetPayable,
      closingBalance: updatedClosingBalance,
      version: report.version + 1,
    };

    if (onUpdateReport) {
      onUpdateReport(updatedReport);
    }
    setActionSuccess('Billing adjustment applied and statement recalculated!');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Finalize / Lock Handler (Admin Only)
  const handleToggleFinalize = () => {
    if (userRole !== 'admin') return;
    const isAlreadyFinal = report.status === 'FINALIZED' || report.status === 'LOCKED';
    const nextStatus = isAlreadyFinal ? 'DRAFT' : 'FINALIZED';

    const updatedReport: FarmerBillingReport = {
      ...report,
      status: nextStatus,
      finalizedAt: nextStatus === 'FINALIZED' ? new Date().toISOString() : undefined,
      finalizedBy: nextStatus === 'FINALIZED' ? 'Dairy Administrator' : undefined,
      version: report.version + 1,
    };

    if (onUpdateReport) {
      onUpdateReport(updatedReport);
    }
    setActionSuccess(`Statement marked as ${nextStatus}!`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-emerald-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>10-Day Milk Billing Statement</span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    report.status === 'FINALIZED' || report.status === 'LOCKED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {report.status} • v{report.version}
                </span>
              </h3>
              <p className="text-[11px] text-slate-300 font-medium">
                {report.billingPeriod.label} • {report.farmerName} ({report.farmerCode})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Alert */}
        {actionSuccess && (
          <div className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Printable Document Body */}
        <div ref={printRef} className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 bg-white text-gray-900 printable-billing-document">
          {/* Document Letterhead */}
          <div className="border-b-2 border-emerald-800/20 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <RuduLogo height={38} />
                <div>
                  <h1 className="text-xl font-black text-emerald-950 tracking-tight">{BUSINESS.name.toUpperCase()}</h1>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Smart Village Milk Collection &amp; Chilling Network
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 font-medium">{BUSINESS.address.formattedAddress}</p>
              <p className="text-xs text-gray-600 font-medium">
                Phone: <span className="font-bold text-gray-900">{BUSINESS.phoneDisplay}</span> | Email:{' '}
                <span className="font-bold text-gray-900">{BUSINESS.email}</span>
              </p>
            </div>

            <div className="sm:text-right p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                10-DAY PERIOD BILLING STATEMENT
              </div>
              <div className="text-sm font-black text-gray-900">{report.billingPeriod.label}</div>
              <div className="text-[11px] font-mono font-bold text-emerald-900">ID: {report.id}</div>
              <div className="text-[10px] text-gray-500">
                Generated: {new Date(report.generatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Farmer & Center Information Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200/80 text-xs">
            <div>
              <span className="text-[10px] font-bold text-gray-700 block">Farmer Name</span>
              <span className="font-black text-gray-950 text-sm">{report.farmerName}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-700 block">Farmer ID / Code</span>
              <span className="font-mono font-black text-emerald-900 text-sm">{report.farmerCode}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-700 block">Village &amp; Center</span>
              <span className="font-bold text-gray-900">{report.village} • {report.collectionCenterName}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-700 block">Registered Phone</span>
              <span className="font-mono font-bold text-gray-900">{report.farmerMobile}</span>
            </div>
          </div>

          {/* Milk Collection Summary Box */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Milk Intake &amp; Quality Summary</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
                <span className="text-[10px] font-bold text-emerald-800 block">Total Collections</span>
                <span className="text-lg font-black text-emerald-950">{report.totalEntries} Shifts</span>
              </div>
              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
                <span className="text-[10px] font-bold text-emerald-800 block">Total Volume</span>
                <span className="text-lg font-black text-emerald-950">{report.totalMilk.toFixed(2)} L</span>
              </div>
              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
                <span className="text-[10px] font-bold text-emerald-800 block">Weighted Avg FAT</span>
                <span className="text-lg font-black text-emerald-950">{report.avgFat.toFixed(2)}%</span>
              </div>
              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
                <span className="text-[10px] font-bold text-emerald-800 block">Weighted Avg SNF</span>
                <span className="text-lg font-black text-emerald-950">{report.avgSnf.toFixed(2)}%</span>
              </div>
              <div className="p-3 bg-emerald-900 text-white rounded-2xl col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-emerald-200 block">Average Rate</span>
                <span className="text-lg font-black text-white">₹{report.avgRate.toFixed(2)}/L</span>
              </div>
            </div>

            {/* Cow vs Buffalo Breakdown */}
            {(report.cowMilk > 0 || report.buffaloMilk > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {report.cowSummary && (
                  <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="font-black text-blue-950">Cow Milk: {report.cowSummary.totalQuantity} L</span>
                      <span className="text-[11px] text-blue-800 block">Avg FAT: {report.cowSummary.avgFat}% | Avg Rate: ₹{report.cowSummary.avgRate}/L</span>
                    </div>
                    <span className="font-black text-blue-900 text-sm">₹{report.cowSummary.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {report.buffaloSummary && (
                  <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="font-black text-amber-950">Buffalo Milk: {report.buffaloSummary.totalQuantity} L</span>
                      <span className="text-[11px] text-amber-800 block">Avg FAT: {report.buffaloSummary.avgFat}% | Avg Rate: ₹{report.buffaloSummary.avgRate}/L</span>
                    </div>
                    <span className="font-black text-amber-900 text-sm">₹{report.buffaloSummary.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Daily Collection Entries Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900">
              Daily Milk Shift Logs (10-Day Period)
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">Date &amp; Shift</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3 text-right">FAT %</th>
                    <th className="py-2.5 px-3 text-right">SNF %</th>
                    <th className="py-2.5 px-3 text-right">Rate (₹)</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report.dailyEntries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-gray-500 font-medium">
                        No milk entries logged during this 10-day period.
                      </td>
                    </tr>
                  ) : (
                    report.dailyEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50/80">
                        <td className="py-2 px-3 font-semibold text-gray-900">
                          {entry.date} • <span className="capitalize font-bold text-emerald-800">{entry.shift}</span>
                        </td>
                        <td className="py-2 px-3 capitalize font-medium text-gray-700">{entry.milkType}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-gray-950">
                          {Number(entry.quantityLiters).toFixed(2)} L
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-gray-800">
                          {Number(entry.fatPercentage).toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-gray-800">
                          {Number(entry.snfPercentage).toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-gray-800">
                          ₹{Number(entry.ratePerLiter).toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-black text-gray-950">
                          ₹{Number(entry.totalAmount).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Adjustments Table (If Any) */}
          {report.adjustments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-900">
                Billing Adjustments &amp; Deductions Log
              </h4>
              <div className="divide-y divide-gray-100 rounded-2xl border border-purple-100 bg-purple-50/30 overflow-hidden text-xs">
                {report.adjustments.map((adj) => (
                  <div key={adj.id} className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900">{adj.label}</span>
                      <p className="text-[11px] text-gray-600">Reason: {adj.reason} (By: {adj.adjustedBy})</p>
                    </div>
                    <span
                      className={`font-mono font-black text-sm ${
                        adj.amount >= 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {adj.amount >= 0 ? '+' : ''}₹{adj.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial Settlement Breakdown */}
          <div className="p-5 bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-black text-emerald-300 uppercase tracking-wider">
                Financial Settlement Summary
              </h4>
              <span className="text-xs font-bold text-emerald-100">10-Day Period Net Computation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 border-r border-white/10 pr-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Gross Milk Value ({report.totalMilk} L):</span>
                  <span className="font-mono font-bold text-white">₹{report.grossMilkAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Previous Carry-Forward Balance:</span>
                  <span className="font-mono font-bold text-white">₹{report.previousBalance.toLocaleString('en-IN')}</span>
                </div>
                {report.advanceAmount > 0 && (
                  <div className="flex justify-between text-rose-300">
                    <span>Advance Recovery / Deduction:</span>
                    <span className="font-mono font-bold">-₹{report.advanceAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {report.adjustmentAmount !== 0 && (
                  <div className={`flex justify-between ${report.adjustmentAmount >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                    <span>Net Billing Adjustments:</span>
                    <span className="font-mono font-bold">{report.adjustmentAmount >= 0 ? '+' : ''}₹{report.adjustmentAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2.5 flex flex-col justify-center">
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-200 block uppercase tracking-wider">NET PAYABLE AMOUNT</span>
                    <span className="text-xs text-slate-300">Due for this 10-day period</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-300 font-mono">
                    ₹{report.netPayable.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-gray-300 px-1">
                  <span>Payments Disbursed: ₹{report.paymentsMade.toLocaleString('en-IN')}</span>
                  <span className="font-bold text-white">Closing Balance: ₹{report.closingBalance.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar with Strict RBAC Controls */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {/* WhatsApp (Available to Admin, Operator, Farmer) */}
            <button
              onClick={handleSendWhatsApp}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Send/Share Report via WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span>{userRole === 'farmer' ? 'Share Statement' : 'Send WhatsApp'}</span>
            </button>

            {/* SMS (ADMIN ONLY) */}
            {userRole === 'admin' && (
              <button
                onClick={handleSendSms}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Send Fast2SMS Notice (Admin Only)"
              >
                <Phone className="w-4 h-4" />
                <span>Send SMS</span>
              </button>
            )}

            {/* Print (Admin / Operator with print support) */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="Print Statement"
            >
              <Printer className="w-4 h-4 text-gray-600" />
              <span>Print</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Admin Only: Add Adjustment */}
            {userRole === 'admin' && (
              <button
                onClick={() => setIsAdjustmentModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Adjustment</span>
              </button>
            )}

            {/* Admin Only: Finalize / Lock */}
            {userRole === 'admin' && (
              <button
                onClick={handleToggleFinalize}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  report.status === 'FINALIZED' || report.status === 'LOCKED'
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                    : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-xs'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>{report.status === 'FINALIZED' ? 'Reopen Draft' : 'Finalize Statement'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Admin Adjustment Modal */}
      <BillingAdjustmentModal
        isOpen={isAdjustmentModalOpen}
        onClose={() => setIsAdjustmentModalOpen(false)}
        farmerId={report.farmerId}
        farmerName={report.farmerName}
        billingPeriodId={report.billingPeriodId}
        onAddAdjustment={handleAddAdjustment}
      />
    </div>
  );
};
