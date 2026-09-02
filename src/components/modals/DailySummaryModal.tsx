import React from 'react';
import { X, Milk, Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThreeDIcons } from '../common/Illustrations';

export const DailySummaryModal: React.FC = () => {
  const { isSummaryModalOpen, setIsSummaryModalOpen, milkEntries, t } = useApp();

  if (!isSummaryModalOpen) return null;

  const morningEntries = milkEntries.filter((e) => e.shift === 'morning');
  const eveningEntries = milkEntries.filter((e) => e.shift === 'evening');

  const morningQty = morningEntries.reduce((s, e) => s + e.quantityLiters, 0);
  const morningVal = morningEntries.reduce((s, e) => s + e.totalAmount, 0);

  const eveningQty = eveningEntries.reduce((s, e) => s + e.quantityLiters, 0);
  const eveningVal = eveningEntries.reduce((s, e) => s + e.totalAmount, 0);

  const cowEntries = milkEntries.filter((e) => e.milkType === 'cow');
  const buffEntries = milkEntries.filter((e) => e.milkType === 'buffalo');

  const cowQty = cowEntries.reduce((s, e) => s + e.quantityLiters, 0);
  const buffQty = buffEntries.reduce((s, e) => s + e.quantityLiters, 0);

  const totalQty = morningQty + eveningQty;
  const totalVal = morningVal + eveningVal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-emerald-100 flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center">
              <Milk className="w-4 h-4 text-emerald-100" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">{t.dailySummary}</h2>
              <p className="text-[11px] text-emerald-100/80 font-medium">16 May 2025 • Center Overview</p>
            </div>
          </div>
          <button
            onClick={() => setIsSummaryModalOpen(false)}
            className="w-8 h-8 rounded-full bg-emerald-700 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Total Highlight */}
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
                {t.totalCollection}
              </span>
              <div className="text-2xl font-black text-gray-950 mt-0.5 tracking-tight">{totalQty} L</div>
              <span className="text-xs font-bold text-emerald-800">₹{totalVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="w-14 h-14 shrink-0 flex items-center justify-center">
              <ThreeDIcons.MilkCanSplash3D className="w-14 h-14" />
            </div>
          </div>

          {/* Shift Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>{t.morningShift}</span>
              </div>
              <div className="text-lg font-black text-gray-950 mt-1">{morningQty} L</div>
              <div className="text-xs font-semibold text-gray-700">₹{morningVal.toLocaleString()}</div>
              <div className="text-[10px] text-gray-700 mt-0.5">{morningEntries.length} {t.entriesLogged}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                <Moon className="w-4 h-4 text-indigo-500" />
                <span>{t.eveningShift}</span>
              </div>
              <div className="text-lg font-black text-gray-950 mt-1">{eveningQty} L</div>
              <div className="text-xs font-semibold text-gray-700">₹{eveningVal.toLocaleString()}</div>
              <div className="text-[10px] text-gray-700 mt-0.5">{eveningEntries.length} {t.entriesLogged}</div>
            </div>
          </div>

          {/* Cow vs Buffalo split */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2.5">
            <span className="text-xs font-bold text-gray-900 block">Milk Type Distribution</span>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">🐄 {t.cowMilk}:</span>
                <span className="font-bold text-gray-900">{cowQty} L ({Math.round((cowQty / (totalQty || 1)) * 100)}%)</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-700 rounded-full"
                  style={{ width: `${Math.round((cowQty / (totalQty || 1)) * 100)}%` }}
                />
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-gray-700 font-medium">🐃 {t.buffaloMilk}:</span>
                <span className="font-bold text-gray-900">{buffQty} L ({Math.round((buffQty / (totalQty || 1)) * 100)}%)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSummaryModalOpen(false)}
            className="w-full py-2.5 bg-emerald-800 text-white rounded-2xl text-xs font-bold hover:bg-emerald-900 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
