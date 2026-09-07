import React, { useState } from 'react';
import { X, Wallet, Building, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NewPayoutModal: React.FC = () => {
  const {
    isNewPayoutModalOpen,
    setIsNewPayoutModalOpen,
    farmers,
    addPayout,
  } = useApp();

  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || 'f1');
  const [amount, setAmount] = useState(7018);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Bank Transfer' | 'Cash Settlement'>('Cash Settlement');
  const [periodStart, setPeriodStart] = useState('01 May 2025');
  const [periodEnd, setPeriodEnd] = useState('15 May 2025');
  const [totalMilk, setTotalMilk] = useState(121);
  const [avgRate, setAvgRate] = useState(58.0);

  if (!isNewPayoutModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPayout({
      farmerId: selectedFarmerId,
      amount: Number(amount),
      paymentMethod,
      periodStart,
      periodEnd,
      totalMilk: Number(totalMilk),
      avgRate: Number(avgRate),
    });
    setIsNewPayoutModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gray-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-gray-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">Process Payout Settlement</h2>
              <p className="text-[11px] text-gray-400 font-medium">Disburse fortnightly milk earnings</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewPayoutModalOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">Farmer</label>
            <select
              value={selectedFarmerId}
              onChange={(e) => setSelectedFarmerId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-950"
            >
              {farmers.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.farmerCode}) - {f.village}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">Period Start</label>
              <input
                type="text"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-950"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">Period End</label>
              <input
                type="text"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">Total Milk (L)</label>
              <input
                type="number"
                value={totalMilk}
                onChange={(e) => setTotalMilk(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">Avg Rate (₹/L)</label>
              <input
                type="number"
                step="0.1"
                value={avgRate}
                onChange={(e) => setAvgRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Cash Settlement', 'UPI', 'Bank Transfer'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    paymentMethod === m
                      ? 'bg-gray-950 border-gray-950 text-white shadow-xs'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">Total Settlement Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-lg font-extrabold text-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-950"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gray-950 hover:bg-gray-800 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span>Disburse & Settle Payout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
