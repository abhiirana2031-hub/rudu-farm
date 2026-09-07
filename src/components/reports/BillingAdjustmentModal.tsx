import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AdjustmentType, BillingAdjustment } from '../../types/billing';
import { useApp } from '../../context/AppContext';

interface BillingAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmerId: string;
  farmerName: string;
  billingPeriodId: string;
  onAddAdjustment: (adj: BillingAdjustment) => void;
}

export const BillingAdjustmentModal: React.FC<BillingAdjustmentModalProps> = ({
  isOpen,
  onClose,
  farmerId,
  farmerName,
  billingPeriodId,
  onAddAdjustment,
}) => {
  const { userRole } = useApp();
  const [type, setType] = useState<AdjustmentType>('INCENTIVE_BONUS');
  const [isAddition, setIsAddition] = useState(true); // true = + addition, false = - deduction
  const [amountStr, setAmountStr] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // RBAC Guard: Admin Only
  if (userRole !== 'admin') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
        <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">Access Restricted</h3>
          <p className="text-xs text-gray-600">Only Dairy Administrators are permitted to add financial billing adjustments.</p>
          <button onClick={onClose} className="w-full py-2.5 rounded-2xl bg-gray-900 text-white text-xs font-bold">
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(amountStr);
    if (isNaN(amountVal) || amountVal <= 0) {
      setError('Please enter a valid positive adjustment amount.');
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a mandatory reason for this adjustment.');
      return;
    }

    const signedAmount = isAddition ? amountVal : -amountVal;

    const labelMap: Record<AdjustmentType, string> = {
      INCENTIVE_BONUS: 'Incentive / Bonus',
      QUALITY_ADJUSTMENT: 'Quality Adjustment',
      FEED_MEDICINE_DEDUCTION: 'Cattle Feed / Medicine Deduction',
      ADVANCE_RECOVERY: 'Advance Loan Recovery',
      MANUAL_CORRECTION: 'Rate / Weight Manual Correction',
      OTHER_DEDUCTION: 'Other Adjustment / Deduction',
    };

    const newAdj: BillingAdjustment = {
      id: `ADJ-${Date.now()}`,
      farmerId,
      billingPeriodId,
      type,
      label: labelMap[type] || 'Adjustment',
      reason: reason.trim(),
      amount: signedAmount,
      adjustedBy: 'Dairy Administrator',
      createdAt: new Date().toISOString(),
    };

    onAddAdjustment(newAdj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-emerald-100 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-black text-gray-950">Add Billing Adjustment</h3>
            <p className="text-xs text-gray-500 font-medium">Farmer: <span className="font-bold text-emerald-800">{farmerName}</span></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Adjustment Direction */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsAddition(true)}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                isAddition
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              + Addition / Bonus
            </button>
            <button
              type="button"
              onClick={() => setIsAddition(false)}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                !isAddition
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              - Deduction / Recovery
            </button>
          </div>

          {/* Adjustment Category */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Adjustment Category</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AdjustmentType)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
            >
              {isAddition ? (
                <>
                  <option value="INCENTIVE_BONUS">Incentive / Quality Bonus (+)</option>
                  <option value="MANUAL_CORRECTION">Manual Rate / Weight Correction (+)</option>
                </>
              ) : (
                <>
                  <option value="FEED_MEDICINE_DEDUCTION">Cattle Feed / Medicine Purchase (-)</option>
                  <option value="ADVANCE_RECOVERY">Advance Loan Recovery (-)</option>
                  <option value="QUALITY_ADJUSTMENT">Quality Penalty / Deduction (-)</option>
                  <option value="OTHER_DEDUCTION">Other Miscellaneous Deduction (-)</option>
                </>
              )}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Amount (₹) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-gray-500">₹</span>
              <input
                type="number"
                step="0.01"
                min="1"
                placeholder="0.00"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                required
                className="w-full pl-8 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Mandatory Reason */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Mandatory Reason / Audit Note <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 5 bags of Cattle Feed supplied on 04 Aug or High FAT bonus"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Apply Adjustment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
