import React, { useState } from 'react';
import { X, DollarSign, CheckCircle2, CreditCard, Sparkles, Building } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BulkPayoutModal: React.FC = () => {
  const {
    isBulkPayoutModalOpen,
    setIsBulkPayoutModalOpen,
    farmers,
    milkEntries,
    disburseBulkPayouts,
    t,
  } = useApp();

  const [isProcessing, setIsProcessing] = useState(false);
  const [successTotal, setSuccessTotal] = useState<number | null>(null);

  if (!isBulkPayoutModalOpen) return null;

  // Calculate pending details for farmers
  const farmerPendingList = farmers.map((f) => {
    const entries = milkEntries.filter((e) => e.farmerId === f.id);
    const totalLiters = entries.reduce((s, e) => s + e.quantityLiters, 0);
    const totalEarnings = entries.reduce((s, e) => s + e.totalAmount, 0);

    return {
      farmer: f,
      totalLiters,
      totalEarnings,
      entryCount: entries.length,
    };
  }).filter((item) => item.totalEarnings > 0);

  const totalLiability = farmerPendingList.reduce((s, item) => s + item.totalEarnings, 0);

  const handleDisburse = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const disbursed = disburseBulkPayouts();
      setIsProcessing(false);
      setSuccessTotal(disbursed);
      setTimeout(() => {
        setSuccessTotal(null);
        setIsBulkPayoutModalOpen(false);
      }, 2500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">{t.bulkDisbursement}</h2>
              <p className="text-[11px] text-emerald-200/80 font-medium">Batch settle farmer balances via direct bank UPI</p>
            </div>
          </div>
          <button
            onClick={() => setIsBulkPayoutModalOpen(false)}
            className="w-8 h-8 rounded-full bg-emerald-800 hover:bg-emerald-700 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {successTotal !== null ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-black text-emerald-950">
                ₹{successTotal.toLocaleString()} Disbursed Successfully!
              </h3>
              <p className="text-xs text-gray-700 font-medium max-w-xs mx-auto">
                Payment vouchers generated and pushed to farmer passbooks & UPI bank channels.
              </p>
            </div>
          ) : (
            <>
              {/* Batch Summary Card */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block">
                    Total Batch Value
                  </span>
                  <span className="text-2xl font-black text-gray-950 font-mono">
                    ₹{totalLiability.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-right text-xs font-bold text-emerald-900">
                  <span>{farmerPendingList.length} Eligible Farmers</span>
                  <div className="text-[10px] text-emerald-700 font-medium">Fortnightly Cycle #09</div>
                </div>
              </div>

              {/* Roster of farmers receiving settlement */}
              <div className="space-y-2">
                <span className="font-bold text-gray-900 block">Pending Payout Breakdown</span>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {farmerPendingList.map(({ farmer, totalLiters, totalEarnings, entryCount }) => (
                    <div
                      key={farmer.id}
                      className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-gray-900">{farmer.name} ({farmer.farmerCode})</div>
                        <div className="text-[10px] text-gray-700">
                          {totalLiters.toFixed(1)} L • {entryCount} entries • UPI: {farmer?.bankDetails?.upiId || farmer?.bankDetails?.accountNumber || 'Bank UPI'}
                        </div>
                      </div>
                      <div className="font-black text-gray-950 font-mono">
                        ₹{totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] font-medium">
                ⚡ <strong>Direct Credit Guarantee:</strong> Funds will be debited from Rudu Farm Central Reserve Account and credited to registered UPI handles.
              </div>

              <button
                disabled={isProcessing || totalLiability === 0}
                onClick={handleDisburse}
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 disabled:bg-gray-300 text-white rounded-2xl font-black text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Processing Batch Bank Settlement...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Authorize & Disburse ₹{totalLiability.toLocaleString()} 💰</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
