import React, { useState, useMemo } from 'react';
import {
  Milk,
  Sun,
  Moon,
  PlusCircle,
  Truck,
  FlaskConical,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ChevronRight,
  TrendingUp,
  Clock,
  Send,
  Sliders,
  Sparkles,
  Users,
  ShieldCheck,
  Building,
  Info,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ShiftType, MilkType, QuantityUnit, RateUnit } from '../../types';
import { calculateMilkAmount, validateQualityReadings } from '../../utils/milkCalculation';
import { FarmLandscapeHeader, ThreeDIcons } from '../common/Illustrations';

export const OperatorDashboard: React.FC = () => {
  const {
    farmers,
    milkEntries,
    addMilkEntry,
    calculateRate,
    rateChart,
    setSelectedEntryForSlip,
    tankerDispatches,
    setIsAddDispatchModalOpen,
    setIsQualityTestModalOpen,
    setIsSummaryModalOpen,
    operatorShift,
    setOperatorShift,
    pricingMode,
    rateUnit: contextRateUnit,
    qualityValidation,
    checkDuplicateEntry,
    t,
  } = useApp();

  // Sub-tabs in operator dashboard
  const [operatorTab, setOperatorTab] = useState<'terminal' | 'queue' | 'dispatch' | 'handover'>('terminal');

  // Terminal state
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(farmers[0]?.id || '');
  const [milkType, setMilkType] = useState<MilkType>('cow');
  const [quantity, setQuantity] = useState<number>(2.3);
  const [quantityUnit, setQuantityUnit] = useState<QuantityUnit>(contextRateUnit || 'L');
  const [fat, setFat] = useState<number>(4.2);
  const [snf, setSnf] = useState<number>(8.5);
  const [manualRate, setManualRate] = useState<number>(45.0);
  const [rateUnit, setRateUnit] = useState<RateUnit>(contextRateUnit || 'L');
  const [rateOverrideActive, setRateOverrideActive] = useState<boolean>(false);
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [farmerSearch, setFarmerSearch] = useState('');
  const [recentPouredSuccess, setRecentPouredSuccess] = useState<string | null>(null);
  const [allowDuplicateOverride, setAllowDuplicateOverride] = useState<boolean>(false);
  const [validationWarningDismissed, setValidationWarningDismissed] = useState<boolean>(false);

  // Selected farmer object
  const currentSelectedFarmer = farmers.find((f) => f.id === selectedFarmerId) || farmers[0];

  // Calculated rate from rate chart (for comparison / fallback)
  const chartRateCalc = calculateRate(milkType, Number(fat) || 0, Number(snf) || 0);
  const chartRate = chartRateCalc.rate;

  // Determine effective rate based on active pricing mode
  const effectiveRate = useMemo(() => {
    if (pricingMode === 'MANUAL_RATE') {
      return Number(manualRate) || 0;
    }
    if (pricingMode === 'RATE_CHART') {
      return rateOverrideActive ? (Number(manualRate) || chartRate) : chartRate;
    }
    // ADMIN_DEFINED
    return rateOverrideActive ? (Number(manualRate) || chartRate) : (rateChart.cowBaseRate || 45.0);
  }, [pricingMode, manualRate, chartRate, rateOverrideActive, rateChart]);

  // Live total amount with decimal-safe precision
  const totalAmount = useMemo(() => {
    return calculateMilkAmount(Number(quantity) || 0, effectiveRate);
  }, [quantity, effectiveRate]);

  // Quality validation
  const qualityValidationResult = useMemo(() => {
    return validateQualityReadings(milkType, Number(fat) || 0, Number(snf) || 0, qualityValidation);
  }, [milkType, fat, snf, qualityValidation]);

  // Duplicate entry check for current farmer, date & shift
  const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const duplicateEntry = useMemo(() => {
    if (!currentSelectedFarmer?.id) return undefined;
    return checkDuplicateEntry({
      farmerId: currentSelectedFarmer.id,
      date: todayStr,
      shift: operatorShift,
      milkType,
    });
  }, [currentSelectedFarmer, todayStr, operatorShift, milkType, checkDuplicateEntry, milkEntries]);

  // Filter farmers for selector
  const filteredFarmers = farmers.filter((f) => {
    if (!farmerSearch.trim()) return true;
    const q = farmerSearch.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.farmerCode.toLowerCase().includes(q) ||
      f.phone.includes(q) ||
      f.village.toLowerCase().includes(q)
    );
  });

  // Calculate today's shift stats
  const todaysEntries = milkEntries.filter((e) => e.date === todayStr);
  const shiftEntries = todaysEntries.filter((e) => e.shift === operatorShift);
  const totalShiftLiters = shiftEntries.reduce((sum, e) => sum + e.quantityLiters, 0);
  const totalShiftAmount = shiftEntries.reduce((sum, e) => sum + e.totalAmount, 0);
  const avgShiftFat = (
    shiftEntries.reduce((sum, e) => sum + e.fatPercentage, 0) / (shiftEntries.length || 1)
  ).toFixed(2);
  const avgShiftSnf = (
    shiftEntries.reduce((sum, e) => sum + e.snfPercentage, 0) / (shiftEntries.length || 1)
  ).toFixed(2);

  // Stepper helper functions
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

  // Handle rapid milk pour submit
  const handleIntakeSubmit = (shouldPrintSlip: boolean) => {
    if (!currentSelectedFarmer) {
      alert('Please select a farmer before recording intake.');
      return;
    }

    if (quantity <= 0 || isNaN(quantity)) {
      alert('Please enter a valid milk quantity greater than 0.');
      return;
    }

    if (effectiveRate <= 0 || isNaN(effectiveRate)) {
      alert('Please enter a valid milk rate greater than 0.');
      return;
    }

    if (qualityValidationResult.isFatal && qualityValidation.strictValidation) {
      alert(`Cannot record intake: ${qualityValidationResult.fatWarning || qualityValidationResult.snfWarning}`);
      return;
    }

    if (duplicateEntry && !allowDuplicateOverride) {
      alert(`A collection entry for ${currentSelectedFarmer.name} in this ${operatorShift} session already exists (${duplicateEntry.receiptId}). Please enable duplicate override to proceed.`);
      return;
    }

    const newEntry = addMilkEntry({
      farmerId: currentSelectedFarmer.id,
      shift: operatorShift,
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

    setRecentPouredSuccess(`${newEntry.receiptId} • ${currentSelectedFarmer.name} (${quantity} ${quantityUnit} @ ₹${effectiveRate}/${rateUnit} = ₹${totalAmount.toFixed(2)})`);
    setTimeout(() => setRecentPouredSuccess(null), 5000);

    // Reset quantity & duplicate override flag for next intake
    setQuantity(2.3);
    setAllowDuplicateOverride(false);
    setOverrideReason('');

    if (shouldPrintSlip) {
      setSelectedEntryForSlip(newEntry);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-28 max-w-5xl mx-auto px-2 sm:px-4 pt-1">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white p-5 sm:p-6 shadow-md border border-emerald-600/50">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 text-xs font-black tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Center Incharge Terminal • Kheda Hub #01</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t.operatorDashboard}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
              Manual FAT, SNF & Rate intake terminal with instant calculation and thermal receipt.
            </p>
          </div>

          {/* Shift Toggle & Status */}
          <div className="flex flex-wrap items-center gap-2 bg-emerald-950/60 p-1.5 rounded-2xl border border-emerald-600/40">
            <button
              onClick={() => setOperatorShift('morning')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                operatorShift === 'morning'
                  ? 'bg-amber-400 text-amber-950 shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>{t.morningShift}</span>
            </button>

            <button
              onClick={() => setOperatorShift('evening')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                operatorShift === 'evening'
                  ? 'bg-indigo-400 text-indigo-950 shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>{t.eveningShift}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards for Operator */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Shift Collection */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Milk className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-700 leading-tight">
              {operatorShift === 'morning' ? t.morningShift : t.eveningShift} Intake
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
              {totalShiftLiters.toFixed(1)} L
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px] font-bold text-emerald-700">
            <span>{shiftEntries.length} {t.entriesLogged}</span>
            <span>₹{totalShiftAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Metric 2: Average Quality */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-700 leading-tight">
              Center Avg Quality
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl sm:text-3xl font-black text-sky-950 tracking-tight">
              {avgShiftFat}% <span className="text-base text-gray-700 font-semibold">Fat</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px] font-bold text-sky-800">
            <span>SNF: {avgShiftSnf}%</span>
            <span>CLR: ~29.5</span>
          </div>
        </div>

        {/* Metric 3: Active Tanker Dispatches */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-700 leading-tight">
              Tanker Logistics
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
              {tankerDispatches.length} Trips
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px] font-bold text-amber-800">
            <span>Chilling: 3.8°C</span>
            <span className="text-emerald-700">✓ On Track</span>
          </div>
        </div>

        {/* Metric 4: Shift Status */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-700 leading-tight">
              Pricing Mode
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-lg sm:text-xl font-black text-emerald-800 tracking-tight flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{pricingMode === 'MANUAL_RATE' ? 'Manual Rate' : pricingMode === 'RATE_CHART' ? 'Rate Chart' : 'Admin Flat'}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px] font-bold text-purple-800">
            <span>Unit: ₹ / {rateUnit}</span>
            <span>Manual Quality: Active</span>
          </div>
        </div>
      </div>

      {/* 3. Operator Navigation Tabs */}
      <div className="bg-white rounded-3xl p-1.5 sm:p-2 border border-emerald-100/90 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <button
            onClick={() => setOperatorTab('terminal')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              operatorTab === 'terminal'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{t.rapidIntakeTerminal}</span>
          </button>

          <button
            onClick={() => setOperatorTab('queue')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              operatorTab === 'queue'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Farmer Intake Queue</span>
          </button>

          <button
            onClick={() => setOperatorTab('dispatch')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              operatorTab === 'dispatch'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{t.tankerDispatch}</span>
          </button>

          <button
            onClick={() => setOperatorTab('handover')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              operatorTab === 'handover'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.shiftClosing}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsQualityTestModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-2xl text-xs font-bold transition-all cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Lab Test</span>
          </button>
          <button
            onClick={() => setIsSummaryModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold transition-all cursor-pointer"
          >
            <span>📊 Summary</span>
          </button>
        </div>
      </div>

      {/* 4. Tab 1: Rapid Milk Intake Terminal */}
      {operatorTab === 'terminal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Form: Terminal Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-950">Milk Intake Terminal</h3>
                  <p className="text-[11px] text-gray-700 font-medium">Manual FAT + SNF + Rate per {rateUnit} Entry</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10.5px] font-bold border border-emerald-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {pricingMode === 'MANUAL_RATE' ? 'Manual Mode' : 'Chart Mode'}
                </span>
              </div>
            </div>

            {/* Success alert banner */}
            {recentPouredSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs font-bold text-emerald-950 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Entry Logged: {recentPouredSuccess}</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider bg-emerald-200 px-2 py-0.5 rounded-md font-mono">Slip Saved</span>
              </div>
            )}

            {/* Duplicate detection warning banner */}
            {duplicateEntry && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs space-y-2 text-amber-950">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Possible Duplicate Collection Entry:</strong>
                    <span>A collection entry ({duplicateEntry.receiptId}) for {currentSelectedFarmer?.name} ({duplicateEntry.quantityLiters}L {duplicateEntry.milkType}) in today's {operatorShift} session already exists.</span>
                  </div>
                </div>
                <label className="flex items-center gap-2 font-bold cursor-pointer pt-1 border-t border-amber-200">
                  <input
                    type="checkbox"
                    checked={allowDuplicateOverride}
                    onChange={(e) => setAllowDuplicateOverride(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-700 cursor-pointer"
                  />
                  <span>Authorize second collection for this farmer & shift</span>
                </label>
              </div>
            )}

            {/* Quality validation soft warning banner */}
            {!qualityValidationResult.isValid && (qualityValidationResult.fatWarning || qualityValidationResult.snfWarning) && !validationWarningDismissed && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs flex items-start justify-between gap-2 text-blue-950">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Quality Reading Notice: </span>
                    <span>{qualityValidationResult.fatWarning} {qualityValidationResult.snfWarning}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setValidationWarningDismissed(true)}
                  className="text-[10px] font-bold text-blue-700 hover:underline shrink-0 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="space-y-4">
              {/* Farmer Search & Select */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Select Farmer / Pourer
                </label>
                <div className="relative mb-2">
                  <Search className="w-4 h-4 text-gray-700 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={farmerSearch}
                    onChange={(e) => setFarmerSearch(e.target.value)}
                    placeholder="Search by code (e.g. RF7237), name, phone, village..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1 bg-gray-50/70 rounded-2xl border border-gray-200">
                  {filteredFarmers.map((f) => {
                    const isSelected = selectedFarmerId === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSelectedFarmerId(f.id)}
                        className={`p-2 rounded-xl text-left transition-all cursor-pointer text-xs ${
                          isSelected
                            ? 'bg-emerald-800 text-white font-bold shadow-xs'
                            : 'bg-white text-gray-800 hover:bg-emerald-50 border border-gray-100'
                        }`}
                      >
                        <div className="font-bold truncate">{f.name}</div>
                        <div className={`text-[10px] font-mono ${isSelected ? 'text-emerald-200' : 'text-gray-700'}`}>
                          {f.farmerCode} • {f.village}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Milk Type & Session */}
              <div className="grid grid-cols-2 gap-3">
                {/* Milk Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">Milk Type</label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => {
                        setMilkType('cow');
                        if (fat > 7.0) setFat(4.2);
                        if (snf > 10.0) setSnf(8.5);
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        milkType === 'cow'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-gray-700 hover:text-black'
                      }`}
                    >
                      <span>🐄 {t.cowMilk}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMilkType('buffalo');
                        if (fat < 5.0) setFat(6.8);
                        if (snf < 8.5) setSnf(9.0);
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        milkType === 'buffalo'
                          ? 'bg-purple-700 text-white shadow-xs'
                          : 'text-gray-700 hover:text-black'
                      }`}
                    >
                      <span>🐃 {t.buffaloMilk}</span>
                    </button>
                  </div>
                </div>

                {/* Session */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">Collection Session</label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setOperatorShift('morning')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        operatorShift === 'morning'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-gray-700 hover:text-black'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span>{t.morningShift}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOperatorShift('evening')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        operatorShift === 'evening'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-gray-700 hover:text-black'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>{t.eveningShift}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Milk Quantity with Steppers & Unit Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-800">
                    Milk Quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-800 font-mono">
                      {quantity} {quantityUnit}
                    </span>
                    {/* Unit Toggle */}
                    <div className="inline-flex rounded-lg bg-gray-100 p-0.5 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => { setQuantityUnit('L'); setRateUnit('L'); }}
                        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                          quantityUnit === 'L' ? 'bg-white text-gray-900 shadow-2xs font-black' : 'text-gray-600'
                        }`}
                      >
                        Liters
                      </button>
                      <button
                        type="button"
                        onClick={() => { setQuantityUnit('Kg'); setRateUnit('Kg'); }}
                        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                          quantityUnit === 'Kg' ? 'bg-white text-gray-900 shadow-2xs font-black' : 'text-gray-600'
                        }`}
                      >
                        Kg
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => adjustQty(-0.5)}
                    className="px-2.5 sm:px-3 py-2.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-800 rounded-xl text-xs font-black cursor-pointer transition-transform"
                    title="Subtract 0.5"
                  >
                    -0.5
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustQty(-0.1)}
                    className="px-2.5 sm:px-3 py-2.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-800 rounded-xl text-xs font-black cursor-pointer transition-transform"
                    title="Subtract 0.1"
                  >
                    -0.1
                  </button>
                  <input
                    type="number"
                    step="0.001"
                    min="0.1"
                    max="1000"
                    value={quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                    className="flex-1 py-2.5 px-3 bg-gray-50 border-2 border-emerald-600 rounded-xl text-center text-lg font-black text-gray-950 font-mono outline-none focus:bg-white"
                    placeholder="2.300"
                  />
                  <button
                    type="button"
                    onClick={() => adjustQty(0.1)}
                    className="px-2.5 sm:px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-800 rounded-xl text-xs font-black cursor-pointer transition-transform"
                    title="Add 0.1"
                  >
                    +0.1
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustQty(0.5)}
                    className="px-2.5 sm:px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-800 rounded-xl text-xs font-black cursor-pointer transition-transform"
                    title="Add 0.5"
                  >
                    +0.5
                  </button>
                </div>
              </div>

              {/* Quality Details: Manual FAT % and SNF % */}
              <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-800 border-b border-emerald-100/80 pb-1.5">
                  <span>Quality Details (Manual Readings)</span>
                  <span className="text-[10px] text-gray-600 font-medium">Type or use +/- steppers</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* FAT % */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-800">FAT %</span>
                      <span className="text-emerald-950 font-mono font-black">{fat}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => adjustFat(-0.1)}
                        className="w-8 h-9 bg-white border border-emerald-200 hover:bg-emerald-50 active:scale-95 text-gray-800 rounded-xl text-xs font-black flex items-center justify-center cursor-pointer"
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
                        className="flex-1 py-1.5 px-2 bg-white border border-emerald-300 rounded-xl text-center text-sm font-black text-gray-900 font-mono outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => adjustFat(0.1)}
                        className="w-8 h-9 bg-white border border-emerald-200 hover:bg-emerald-50 active:scale-95 text-gray-800 rounded-xl text-xs font-black flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* SNF % */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-800">SNF %</span>
                      <span className="text-emerald-950 font-mono font-black">{snf}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => adjustSnf(-0.1)}
                        className="w-8 h-9 bg-white border border-emerald-200 hover:bg-emerald-50 active:scale-95 text-gray-800 rounded-xl text-xs font-black flex items-center justify-center cursor-pointer"
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
                        className="flex-1 py-1.5 px-2 bg-white border border-emerald-300 rounded-xl text-center text-sm font-black text-gray-900 font-mono outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => adjustSnf(0.1)}
                        className="w-8 h-9 bg-white border border-emerald-200 hover:bg-emerald-50 active:scale-95 text-gray-800 rounded-xl text-xs font-black flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rate Input Section */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                  <div className="flex items-center gap-1.5">
                    <span>Rate (₹ per {rateUnit})</span>
                    <span className="text-[10px] font-normal text-gray-500">
                      ({pricingMode === 'MANUAL_RATE' ? 'Direct Manual Input' : 'Rate Chart Mode'})
                    </span>
                  </div>
                  {pricingMode !== 'MANUAL_RATE' && qualityValidation.allowRateOverride && (
                    <button
                      type="button"
                      onClick={() => setRateOverrideActive(!rateOverrideActive)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                        rateOverrideActive ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {rateOverrideActive ? 'Override Active' : 'Manual Override'}
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
                      className={`w-full pl-7 pr-3 py-2 bg-white border rounded-xl text-base font-black font-mono outline-none ${
                        pricingMode === 'MANUAL_RATE' || rateOverrideActive
                          ? 'border-emerald-500 text-gray-900 focus:ring-2 focus:ring-emerald-500'
                          : 'border-gray-200 text-gray-600 bg-gray-100 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* Unit Selector */}
                  <select
                    value={rateUnit}
                    onChange={(e) => {
                      const u = e.target.value as RateUnit;
                      setRateUnit(u);
                      setQuantityUnit(u);
                    }}
                    className="py-2 px-3 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 outline-none cursor-pointer"
                  >
                    <option value="L">Per Liter (₹/L)</option>
                    <option value="Kg">Per Kg (₹/Kg)</option>
                  </select>
                </div>

                {rateOverrideActive && (
                  <div className="pt-1">
                    <input
                      type="text"
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder="Reason for rate override (e.g. Special bonus, quality exception)..."
                      className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-gray-800 outline-none placeholder:text-gray-400"
                    />
                  </div>
                )}
              </div>

              {/* Live Calculated Total & Formula Display */}
              <div className="p-4 bg-gray-950 text-white rounded-2xl space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Calculated Total
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono font-medium">
                    Formula: {quantity} {quantityUnit} × ₹{effectiveRate.toFixed(2)} / {rateUnit}
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-0.5">
                  <div className="text-xs text-gray-400">
                    Payable to: <strong className="text-white">{currentSelectedFarmer?.name || 'Farmer'}</strong>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Record Intake & Save & Print Slip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleIntakeSubmit(false)}
                  className="py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Record Intake</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleIntakeSubmit(true)}
                  className="py-3.5 px-4 bg-gray-900 hover:bg-gray-800 active:scale-[0.99] text-white rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>Save & Print Slip 🖨️</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Live Farmer Card & Recent Pours (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Selected Farmer Info Card */}
            {currentSelectedFarmer && (
              <div className="bg-white rounded-3xl p-5 border border-emerald-100/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base">
                      👨‍🌾
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-950">{currentSelectedFarmer.name}</h4>
                      <span className="text-xs font-mono text-emerald-800 font-bold">
                        {currentSelectedFarmer.farmerCode} • {currentSelectedFarmer.village}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-bold text-emerald-800">
                    {currentSelectedFarmer?.bankDetails?.kycStatus || 'Verified'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-100">
                  <div className="p-2 bg-gray-50 rounded-xl">
                    <span className="text-[10px] text-gray-700 block">Phone</span>
                    <span className="font-bold text-gray-900 font-mono">{currentSelectedFarmer.phone}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-xl">
                    <span className="text-[10px] text-gray-700 block">Herd Size</span>
                    <span className="font-bold text-gray-900">
                      {currentSelectedFarmer.cowCount} Cows • {currentSelectedFarmer.buffaloCount} Buff
                    </span>
                  </div>
                </div>

                <div className="p-2 bg-gray-50 rounded-xl text-xs flex items-center justify-between">
                  <span className="text-gray-700">UPI / Settlement:</span>
                  <span className="font-bold font-mono text-emerald-900">{currentSelectedFarmer?.bankDetails?.upiId || currentSelectedFarmer?.bankDetails?.accountNumber || 'UPI / Bank Transfer'}</span>
                </div>
              </div>
            )}

            {/* Live Center Feed */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider">
                  Live Intake Queue ({shiftEntries.length} Poured)
                </h4>
                <span className="text-[11px] text-emerald-700 font-bold">Today</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {shiftEntries.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => setSelectedEntryForSlip(entry)}
                    className="p-2.5 rounded-2xl bg-gray-50 hover:bg-emerald-50/70 border border-gray-200 flex items-center justify-between gap-2 cursor-pointer transition-all text-xs"
                  >
                    <div>
                      <div className="font-bold text-gray-950">{entry.farmerName}</div>
                      <div className="text-[10px] text-gray-700">
                        {entry.time} • <span className="font-mono">{entry.receiptId}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-gray-950">{entry.quantityLiters} L</div>
                      <div className="text-[10px] text-emerald-700 font-bold font-mono">
                        ₹{entry.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab 2: Farmer Queue / Roster */}
      {operatorTab === 'queue' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-black text-gray-950">Farmer Intake Roster & Attendance</h3>
              <p className="text-xs text-gray-700 font-medium">Track who has poured and pending center arrivals</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                {shiftEntries.length} / {farmers.length} Completed
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            {farmers.map((farmer) => {
              const hasPoured = shiftEntries.find((e) => e.farmerId === farmer.id);

              return (
                <div
                  key={farmer.id}
                  className="p-3.5 rounded-2xl border border-gray-200 bg-white hover:border-emerald-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                      👨‍🌾
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-950">{farmer.name}</span>
                        <span className="text-xs font-mono font-bold text-emerald-800">
                          ({farmer.farmerCode})
                        </span>
                      </div>
                      <div className="text-xs text-gray-700 font-medium">
                        📍 {farmer.village} • Herd: {farmer.cattleCount} Cattle • {farmer.phone}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {hasPoured ? (
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Poured: {hasPoured.quantityLiters} L @ {hasPoured.time}
                        </span>
                        <div className="text-[11px] text-gray-700 font-mono mt-0.5">
                          ₹{hasPoured.totalAmount.toFixed(2)} ({hasPoured.fatPercentage}% Fat)
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Pending Intake
                      </span>
                    )}

                    <button
                      onClick={() => {
                        setSelectedFarmerId(farmer.id);
                        setOperatorTab('terminal');
                      }}
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                    >
                      {hasPoured ? 'Add Entry' : 'Take Pour 🥛'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Tab 3: Tanker Dispatch & Logistics */}
      {operatorTab === 'dispatch' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-black text-gray-950">Bulk Milk Tanker Logistics</h3>
              <p className="text-xs text-gray-700 font-medium">
                Log chilling center tanker dispatches to main dairy processing plant
              </p>
            </div>
            <button
              onClick={() => setIsAddDispatchModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Dispatch New Tanker</span>
            </button>
          </div>

          <div className="space-y-3">
            {tankerDispatches.map((disp) => (
              <div
                key={disp.id}
                className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-emerald-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-gray-950 font-mono">
                        {disp.tankerNumber}
                      </span>
                      <span className="text-xs font-mono font-bold text-gray-700">
                        ({disp.dispatchId})
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          disp.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                        }`}
                      >
                        {disp.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-700 font-medium mt-0.5">
                      Driver: <strong className="text-gray-900">{disp.driverName}</strong> ({disp.driverPhone}) • 📍 {disp.destination}
                    </div>
                    <div className="text-[11px] text-gray-700 mt-0.5">
                      Dispatched: {disp.dispatchTime} • Seal: <span className="font-mono font-bold text-gray-900">{disp.sealNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <div className="text-right">
                    <div className="text-sm font-black text-gray-950 font-mono">
                      {disp.quantityLiters.toLocaleString()} Liters
                    </div>
                    <div className="text-xs text-sky-700 font-bold">
                      Temp: {disp.temperatureCelsius}°C • Fat: {disp.testedFat}%
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
                    Pass (Adulteration Free)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Tab 4: Shift Closing & Handover */}
      {operatorTab === 'handover' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-black text-gray-950">Shift Closing & Reconciliation</h3>
              <p className="text-xs text-gray-700 font-medium">
                Verify center accounts, total milk volume collected, and generate handover certificate
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold">
              Shift Reconciled
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 uppercase block">Total Shift Liters</span>
              <span className="text-2xl font-black text-gray-950 mt-1 block font-mono">
                {totalShiftLiters.toFixed(1)} L
              </span>
              <span className="text-xs text-gray-700 font-medium">Weighted Quality: {avgShiftFat}% Fat</span>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
              <span className="text-xs font-bold text-sky-800 uppercase block">Total Payout Liability</span>
              <span className="text-2xl font-black text-gray-950 mt-1 block font-mono">
                ₹{totalShiftAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-gray-700 font-medium">Transferred to Central Ledger</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <span className="text-xs font-bold text-amber-800 uppercase block">Cans in Cold Storage</span>
              <span className="text-2xl font-black text-gray-950 mt-1 block font-mono">
                {Math.ceil(totalShiftLiters / 40)} Cans (40L)
              </span>
              <span className="text-xs text-gray-700 font-medium">Chilled at 3.8°C</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-700 font-medium">Center Incharge:</span>
              <span className="font-bold text-gray-900">Rajesh Patel (Emp #OP-104)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-700 font-medium">Shift Date & Timing:</span>
              <span className="font-bold text-gray-900">16 May 2025 (06:00 AM - 11:30 AM)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-700 font-medium">Adulteration Tests Conducted:</span>
              <span className="font-bold text-emerald-800">100% Passed (Urea, Starch, Neutralizer Free)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-700 font-medium">Closing Status:</span>
              <span className="font-bold text-emerald-800">Ready for Night Dispatch</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                alert('Shift Closing Report generated and archived to central dairy audit vault.');
              }}
              className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Shift Closing Statement</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
