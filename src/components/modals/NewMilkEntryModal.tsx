import React, { useState, useMemo } from 'react';
import { X, Milk, Sun, Moon, Check, Printer, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ShiftType, MilkType, QuantityUnit, RateUnit } from '../../types';
import { calculateMilkAmount, validateQualityReadings } from '../../utils/milkCalculation';

export const NewMilkEntryModal: React.FC = () => {
  const {
    isNewEntryModalOpen,
    setIsNewEntryModalOpen,
    farmers,
    addMilkEntry,
    calculateRate,
    setSelectedEntryForSlip,
    pricingMode,
    rateUnit: contextRateUnit,
    qualityValidation,
    checkDuplicateEntry,
  } = useApp();

  /** Auto-detect shift: Morning = 04:00–11:59, Evening = 12:00–23:59 / 00:00–03:59 */
  const getAutoShift = (): ShiftType => {
    const hour = new Date().getHours();
    return hour >= 4 && hour < 12 ? 'morning' : 'evening';
  };

  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || '');
  const [shift, setShift] = useState<ShiftType>(getAutoShift());
  const [milkType, setMilkType] = useState<MilkType>('cow');
  const [quantity, setQuantity] = useState<number>(2.3);
  const [quantityUnit, setQuantityUnit] = useState<QuantityUnit>(contextRateUnit || 'L');
  const [fat, setFat] = useState<number>(4.2);
  const [snf, setSnf] = useState<number>(8.5);
  const [manualRate, setManualRate] = useState<number>(45.0);
  const [rateUnit, setRateUnit] = useState<RateUnit>(contextRateUnit || 'L');
  const [rateOverrideActive, setRateOverrideActive] = useState<boolean>(false);
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [allowDuplicateOverride, setAllowDuplicateOverride] = useState<boolean>(false);

  const currentFarmer = useMemo(() => {
    return farmers.find((f) => f.id === selectedFarmerId) || farmers[0];
  }, [farmers, selectedFarmerId]);

  // Chart rate fallback
  const chartRateCalc = calculateRate(milkType, Number(fat) || 0, Number(snf) || 0);
  const chartRate = chartRateCalc.rate;

  // Effective rate
  const effectiveRate = useMemo(() => {
    if (pricingMode === 'MANUAL_RATE') {
      return Number(manualRate) || 0;
    }
    if (pricingMode === 'RATE_CHART') {
      return rateOverrideActive ? (Number(manualRate) || chartRate) : chartRate;
    }
    return rateOverrideActive ? (Number(manualRate) || chartRate) : 45.0;
  }, [pricingMode, manualRate, chartRate, rateOverrideActive]);

  // Decimal safe total amount
  const totalAmount = useMemo(() => {
    return calculateMilkAmount(Number(quantity) || 0, effectiveRate);
  }, [quantity, effectiveRate]);

  // Quality validation
  const qualityValidationResult = useMemo(() => {
    return validateQualityReadings(milkType, Number(fat) || 0, Number(snf) || 0, qualityValidation);
  }, [milkType, fat, snf, qualityValidation]);

  // Duplicate check
  const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const duplicateEntry = useMemo(() => {
    if (!currentFarmer?.id) return undefined;
    return checkDuplicateEntry({
      farmerId: currentFarmer.id,
      date: todayStr,
      shift,
      milkType,
    });
  }, [currentFarmer, todayStr, shift, milkType, checkDuplicateEntry]);

  if (!isNewEntryModalOpen) return null;

  const adjustQty = (delta: number) => {
    setQuantity((prev) => {
      const next = Math.max(0.1, Math.round(((Number(prev) || 0) + delta) * 1000) / 1000);
      return Number(next.toFixed(3));
    });
  };

  const adjustFat = (delta: number) => {
    setFat((prev) => {
      const next = Math.max(1.0, Math.min(18.0, Math.round(((Number(prev) || 0) + delta) * 10) / 10));
      return Number(next.toFixed(1));
    });
  };

  const adjustSnf = (delta: number) => {
    setSnf((prev) => {
      const next = Math.max(4.0, Math.min(15.0, Math.round(((Number(prev) || 0) + delta) * 10) / 10));
      return Number(next.toFixed(1));
    });
  };

  const handleFormSubmit = (shouldPrint: boolean) => {
    if (!currentFarmer) {
      alert('Please select a farmer.');
      return;
    }
    if (quantity <= 0 || isNaN(quantity)) {
      alert('Please enter a valid quantity.');
      return;
    }
    if (effectiveRate <= 0 || isNaN(effectiveRate)) {
      alert('Please enter a valid rate.');
      return;
    }
    if (duplicateEntry && !allowDuplicateOverride) {
      alert(`A collection entry for this farmer in this ${shift} session already exists. Check the override box to proceed.`);
      return;
    }

    const newEntry = addMilkEntry({
      farmerId: currentFarmer.id,
      shift,
      milkType,
      quantityLiters: Number(quantity),
      quantity: Number(quantity),
      quantityUnit,
      fatPercentage: Number(fat),
      fat: Number(fat),
      snfPercentage: Number(snf),
      snf: Number(snf),
      rate: effectiveRate,
      ratePerLiter: effectiveRate,
      rateUnit,
      pricingMode,
      rateSource: pricingMode === 'MANUAL_RATE' ? 'manual' : (rateOverrideActive ? 'manual' : 'chart'),
      rateOverridden: rateOverrideActive,
      originalRate: chartRate,
      overrideReason: rateOverrideActive ? overrideReason : '',
      allowDuplicateOverride,
    });

    setIsNewEntryModalOpen(false);
    if (shouldPrint) {
      setSelectedEntryForSlip(newEntry);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gray-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center">
              <Milk className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">Manual Milk Intake Entry</h2>
              <p className="text-[11px] text-gray-400 font-medium">
                Mode: {pricingMode === 'MANUAL_RATE' ? 'Manual Rate per Litre/Kg' : 'Rate Chart Mode'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewEntryModalOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Duplicate Warning */}
          {duplicateEntry && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Notice: Existing collection record found for this session ({duplicateEntry.receiptId})</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={allowDuplicateOverride}
                  onChange={(e) => setAllowDuplicateOverride(e.target.checked)}
                  className="rounded text-emerald-600 accent-emerald-700"
                />
                <span>Allow duplicate intake record</span>
              </label>
            </div>
          )}

          {/* Quality Soft Warning */}
          {!qualityValidationResult.isValid && (qualityValidationResult.fatWarning || qualityValidationResult.snfWarning) && (
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-950 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{qualityValidationResult.fatWarning} {qualityValidationResult.snfWarning}</span>
            </div>
          )}

          {/* Farmer Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              Select Farmer
            </label>
            <select
              value={selectedFarmerId || (farmers[0]?.id ?? '')}
              onChange={(e) => setSelectedFarmerId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
            >
              {farmers.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.farmerCode}) — {f.village}
                </option>
              ))}
            </select>
          </div>

          {/* Milk Type & Shift */}
          <div className="grid grid-cols-2 gap-3">
            {/* Milk Type */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Milk Type</label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMilkType('cow');
                    if (fat > 6.5) setFat(4.2);
                    if (snf > 10.0) setSnf(8.5);
                  }}
                  className={`py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    milkType === 'cow'
                      ? 'bg-white text-emerald-800 shadow-xs font-black'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>🐄 Cow</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMilkType('buffalo');
                    if (fat < 5.0) setFat(6.8);
                    if (snf < 8.5) setSnf(9.0);
                  }}
                  className={`py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    milkType === 'buffalo'
                      ? 'bg-white text-purple-800 shadow-xs font-black'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>🐃 Buffalo</span>
                </button>
              </div>
            </div>

            {/* Shift */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Session</label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setShift('morning')}
                  className={`py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    shift === 'morning'
                      ? 'bg-white text-amber-900 shadow-xs font-black'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Morning</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShift('evening')}
                  className={`py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    shift === 'evening'
                      ? 'bg-white text-indigo-900 shadow-xs font-black'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Evening</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quantity Stepper & Manual input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-800">Milk Quantity</label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-800 font-mono">
                  {quantity} {quantityUnit}
                </span>
                <div className="inline-flex rounded-lg bg-gray-100 p-0.5 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => { setQuantityUnit('L'); setRateUnit('L'); }}
                    className={`px-1.5 py-0.5 rounded cursor-pointer ${quantityUnit === 'L' ? 'bg-white font-black text-gray-900 shadow-2xs' : 'text-gray-600'}`}
                  >
                    L
                  </button>
                  <button
                    type="button"
                    onClick={() => { setQuantityUnit('Kg'); setRateUnit('Kg'); }}
                    className={`px-1.5 py-0.5 rounded cursor-pointer ${quantityUnit === 'Kg' ? 'bg-white font-black text-gray-900 shadow-2xs' : 'text-gray-600'}`}
                  >
                    Kg
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => adjustQty(-0.5)}
                className="px-2.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                -0.5
              </button>
              <button
                type="button"
                onClick={() => adjustQty(-0.1)}
                className="px-2.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                -0.1
              </button>
              <input
                type="number"
                step="0.001"
                min="0.1"
                max="500"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                className="flex-1 py-2 px-2 bg-gray-50 border-2 border-emerald-600 rounded-xl text-center text-base font-black text-gray-950 font-mono outline-none"
              />
              <button
                type="button"
                onClick={() => adjustQty(0.1)}
                className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                +0.1
              </button>
              <button
                type="button"
                onClick={() => adjustQty(0.5)}
                className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                +0.5
              </button>
            </div>
          </div>

          {/* Quality Details: Manual FAT & SNF */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
            {/* FAT % */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-gray-700">FAT %</span>
                <span className="text-xs font-black text-gray-950 font-mono">{fat}%</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => adjustFat(-0.1)}
                  className="w-7 h-8 bg-white border border-gray-300 rounded-lg text-xs font-black cursor-pointer"
                >
                  -
                </button>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="20.0"
                  value={fat}
                  onChange={(e) => setFat(parseFloat(e.target.value) || 0)}
                  className="flex-1 py-1 px-1 bg-white border border-gray-300 rounded-lg text-center text-xs font-bold font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={() => adjustFat(0.1)}
                  className="w-7 h-8 bg-white border border-gray-300 rounded-lg text-xs font-black cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* SNF % */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-gray-700">SNF %</span>
                <span className="text-xs font-black text-gray-950 font-mono">{snf}%</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => adjustSnf(-0.1)}
                  className="w-7 h-8 bg-white border border-gray-300 rounded-lg text-xs font-black cursor-pointer"
                >
                  -
                </button>
                <input
                  type="number"
                  step="0.1"
                  min="4.0"
                  max="18.0"
                  value={snf}
                  onChange={(e) => setSnf(parseFloat(e.target.value) || 0)}
                  className="flex-1 py-1 px-1 bg-white border border-gray-300 rounded-lg text-center text-xs font-bold font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={() => adjustSnf(0.1)}
                  className="w-7 h-8 bg-white border border-gray-300 rounded-lg text-xs font-black cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Rate Input Section */}
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-800">
              <span>Rate (₹ / {rateUnit})</span>
              {pricingMode !== 'MANUAL_RATE' && qualityValidation.allowRateOverride && (
                <button
                  type="button"
                  onClick={() => setRateOverrideActive(!rateOverrideActive)}
                  className="text-[10px] text-amber-800 underline font-bold cursor-pointer"
                >
                  {rateOverrideActive ? 'Use Chart' : 'Override Rate'}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">₹</span>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="200"
                  value={pricingMode === 'MANUAL_RATE' || rateOverrideActive ? manualRate : chartRate}
                  onChange={(e) => setManualRate(parseFloat(e.target.value) || 0)}
                  disabled={pricingMode !== 'MANUAL_RATE' && !rateOverrideActive}
                  className="w-full pl-7 pr-3 py-1.5 bg-white border border-gray-300 rounded-xl text-sm font-black font-mono outline-none"
                />
              </div>

              <select
                value={rateUnit}
                onChange={(e) => {
                  const u = e.target.value as RateUnit;
                  setRateUnit(u);
                  setQuantityUnit(u);
                }}
                className="py-1.5 px-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 outline-none cursor-pointer"
              >
                <option value="L">₹ / Liter</option>
                <option value="Kg">₹ / Kg</option>
              </select>
            </div>
          </div>

          {/* Live Formula & Amount Banner */}
          <div className="p-3.5 rounded-2xl bg-gray-950 text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block font-mono">
                Formula: {quantity} {quantityUnit} × ₹{effectiveRate.toFixed(2)} / {rateUnit}
              </span>
              <span className="text-sm font-bold text-gray-300">
                Total Payable
              </span>
            </div>

            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">
                ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleFormSubmit(false)}
              className="py-3 px-3 bg-emerald-800 hover:bg-emerald-900 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Record Intake</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormSubmit(true)}
              className="py-3 px-3 bg-gray-900 hover:bg-gray-800 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Save & Print Slip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
