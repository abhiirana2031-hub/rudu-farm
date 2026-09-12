import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FlaskConical, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  Clock, 
  ThermometerSnowflake, 
  Award, 
  FileText,
  Check,
  QrCode,
  MapPin,
  FileCheck
} from 'lucide-react';

interface BatchData {
  id: string;
  name: string;
  milkType: string;
  village: string;
  milkedAt: string;
  testedAt: string;
  chilledTemp: string;
  fat: string;
  snf: string;
  clr: string;
  adulteration: Array<{ test: string; result: string; status: 'passed' }>;
  certNumber: string;
  batchDate: string;
}

const SAMPLE_BATCHES: Record<string, BatchData> = {
  'RD-COW-402': {
    id: 'RD-COW-402',
    name: 'A2 Indigenous Desi Gir Cow Milk',
    milkType: 'Desi Cow Milk (A2 Protein)',
    village: 'Sikhreda Organic Pastures (UP)',
    milkedAt: '04:30 AM Today',
    testedAt: '05:15 AM Today',
    chilledTemp: '3.8°C',
    fat: '6.4%',
    snf: '9.2%',
    clr: '30.5',
    adulteration: [
      { test: 'Urea & Chemical Additives', result: '0.00% (Negative)', status: 'passed' },
      { test: 'Starch & Reconstituted Powder', result: '0.00% (Negative)', status: 'passed' },
      { test: 'Detergents & Neutralizers', result: '0.00% (Negative)', status: 'passed' },
      { test: 'Added Water & Foreign Fats', result: '0.00% (Zero Dilution)', status: 'passed' },
      { test: 'Oxytocin & Hormone Traces', result: 'Not Detected (Negative)', status: 'passed' },
    ],
    certNumber: 'FSSAI-LAB-2026-0907-88',
    batchDate: 'Today Morning Batch #01',
  },
  'RD-BUFF-819': {
    id: 'RD-BUFF-819',
    name: 'Premium Murrah Buffalo Farm Milk',
    milkType: 'Pure Whole Buffalo Milk',
    village: 'Bhopa Road Dairy Hub',
    milkedAt: '04:15 AM Today',
    testedAt: '05:00 AM Today',
    chilledTemp: '3.6°C',
    fat: '7.8%',
    snf: '9.6%',
    clr: '31.2',
    adulteration: [
      { test: 'Urea & Chemical Additives', result: '0.00% (Negative)', status: 'passed' },
      { test: 'Starch & Reconstituted Powder', result: '0.00% (Negative)', status: 'passed' },
      { test: 'Detergents & Neutralizers', result: '0.00% (Negative)', status: 'passed' },
      { test: 'Added Water & Foreign Fats', result: '0.00% (Zero Dilution)', status: 'passed' },
      { test: 'Oxytocin & Hormone Traces', result: 'Not Detected (Negative)', status: 'passed' },
    ],
    certNumber: 'FSSAI-LAB-2026-0907-92',
    batchDate: 'Today Morning Batch #02',
  },
  'RD-GHEE-105': {
    id: 'RD-GHEE-105',
    name: 'A2 Bilona Vedic Desi Cow Ghee',
    milkType: 'Hand-Churned Curd Bilona Ghee',
    village: 'Sikhreda Heritage Dairy Unit',
    milkedAt: 'Yesterday Churned',
    testedAt: '06:00 AM Today (GC Tested)',
    chilledTemp: '24.5°C (Granular)',
    fat: '99.8%',
    snf: '0.15% Moisture',
    clr: 'RM: 30.4',
    adulteration: [
      { test: 'Vanaspati & Palm Oil Impurities', result: '0.00% (GC Negative)', status: 'passed' },
      { test: 'Mineral Oils & Animal Tallow', result: '0.00% (Negative)', status: 'passed' },
      { test: 'Artificial Color & Fragrance', result: '100% Pure Beta-Carotene', status: 'passed' },
      { test: 'Free Fatty Acids (FFA)', result: '0.28% (Well below 1.4% max)', status: 'passed' },
      { test: 'Peroxide Value (Freshness)', result: '0.12 meq/kg (Fresh Batch)', status: 'passed' },
    ],
    certNumber: 'FSSAI-LAB-2026-0907-104',
    batchDate: 'Artisanal Batch #B-105',
  },
};

export const PurityBatchChecker: React.FC = () => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>('RD-COW-402');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const currentBatch = SAMPLE_BATCHES[selectedBatchId] || SAMPLE_BATCHES['RD-COW-402'];

  const handleSelectBatch = (id: string) => {
    if (id === selectedBatchId) return;
    setIsScanning(true);
    setSelectedBatchId(id);
    setTimeout(() => {
      setIsScanning(false);
    }, 350);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    if (SAMPLE_BATCHES[query]) {
      handleSelectBatch(query);
    } else {
      handleSelectBatch('RD-COW-402');
    }
  };

  const handleDownloadSlip = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="bg-[#FAF8F5] rounded-[2rem] sm:rounded-[2.75rem] border border-stone-200/90 p-4 sm:p-8 lg:p-10 shadow-xl shadow-stone-900/5 relative overflow-hidden">
      
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-100/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-[#15803d] border border-emerald-200/80 shadow-xs mb-3">
          <FlaskConical size={14} className="text-[#16a34a]" />
          <span>Live Purity Transparency Lab</span>
        </div>

        <h2 className="font-editorial-serif text-2xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#14281d] tracking-tight leading-tight mb-2 sm:mb-3">
          Verify Today's Milk Quality Report
        </h2>
        
        <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed max-w-xl mx-auto">
          Every batch from our partner farms is tested twice daily using Gas Chromatography & digital fat analyzers. No adulteration. Ever.
        </p>

        {/* Sample Batch Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          <span className="text-xs font-bold text-stone-400 mr-1 hidden sm:inline">Select Sample Batch:</span>
          {Object.values(SAMPLE_BATCHES).map((batch) => {
            const isSelected = selectedBatchId === batch.id;
            return (
              <button
                key={batch.id}
                onClick={() => handleSelectBatch(batch.id)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#15803d] text-white shadow-md shadow-green-900/20 scale-105'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/90 shadow-xs'
                }`}
              >
                <Sparkles size={12} className={isSelected ? 'text-amber-200' : 'text-stone-400'} />
                <span>#{batch.id}</span>
              </button>
            );
          })}
        </div>

        {/* Batch Code Search Bar */}
        <form onSubmit={handleSearch} className="mt-4 max-w-md mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search batch code (e.g. RD-COW-402)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-full bg-white border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-emerald-500/15 shadow-xs transition-all text-stone-800 placeholder-stone-400"
            />
          </div>
          <button
            type="submit"
            className="px-4.5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Verify
          </button>
        </form>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          OFFICIAL CERTIFICATE OF QUALITY (COA CARD)
         ───────────────────────────────────────────────────────────── */}
      <div className={`relative bg-white rounded-3xl sm:rounded-[2.25rem] border-2 border-[#bbf7d0] p-5 sm:p-8 lg:p-9 shadow-2xl shadow-emerald-950/5 transition-opacity duration-300 ${isScanning ? 'opacity-50' : 'opacity-100'}`}>
        
        {/* Certificate Decorative Top Border Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#15803d] via-[#22c55e] to-[#86efac] rounded-t-[2.25rem]" />

        {/* Certificate Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-stone-100">
          
          <div>
            {/* Verification Status Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15803d] text-white font-extrabold text-[11px] tracking-wider uppercase shadow-xs">
                <CheckCircle2 size={13} className="text-[#86efac]" />
                <span>PASSED 100% PURE</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600 font-mono text-[11px] font-bold">
                Cert #{currentBatch.certNumber}
              </span>

              <span className="text-[11px] font-semibold text-stone-400 hidden sm:inline">
                • {currentBatch.batchDate}
              </span>
            </div>

            {/* Milk Batch Name */}
            <h3 className="font-editorial-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#14281d] leading-tight mt-1">
              {currentBatch.name}
            </h3>

            {/* Origin & Milking Details */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-500 mt-2">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin size={13} className="text-red-600 shrink-0" />
                <span>Origin: <strong className="text-stone-800">{currentBatch.village}</strong></span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Clock size={13} className="text-stone-400 shrink-0" />
                <span>Milked: <strong className="text-stone-800">{currentBatch.milkedAt}</strong></span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <FileCheck size={13} className="text-[#16a34a] shrink-0" />
                <span>Tested: <strong className="text-stone-800">{currentBatch.testedAt}</strong></span>
              </span>
            </div>
          </div>

          {/* Government / FSSAI Gold Seal */}
          <div className="flex items-center gap-3 bg-[#f0fdf4] border border-[#bbf7d0] px-3.5 py-2.5 rounded-2xl shrink-0 self-start sm:self-center shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#16a34a] text-white flex items-center justify-center shadow-md shadow-green-900/20">
              <ShieldCheck size={22} strokeWidth={2.4} />
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">
                FSSAI Lic. 10021051000189
              </span>
              <span className="block text-xs font-bold text-[#14532d]">
                Govt. Lab Approved
              </span>
            </div>
          </div>

        </div>

        {/* ─────────────────────────────────────────────────────────────
            4 KEY METRIC CARDS (CLEAN, REFINED VISUAL HIERARCHY)
           ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-6 sm:my-7">
          
          {/* 1. FAT Content Card */}
          <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-[#fffbeb] to-white border border-[#fde68a] text-center shadow-xs">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-900/80 block">
              FAT Content
            </span>
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-700 my-1 block font-mono">
              {currentBatch.fat}
            </span>
            <span className="text-[10px] sm:text-[11px] text-amber-950/70 font-medium inline-block bg-amber-100/60 px-2 py-0.5 rounded-md">
              Thick Cream Layer
            </span>
          </div>

          {/* 2. SNF Reading Card */}
          <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-[#f0fdf4] to-white border border-[#bbf7d0] text-center shadow-xs">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#14532d]/80 block">
              SNF Reading
            </span>
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#15803d] my-1 block font-mono">
              {currentBatch.snf}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#14532d] font-medium inline-block bg-[#dcfce7] px-2 py-0.5 rounded-md">
              Essential Minerals
            </span>
          </div>

          {/* 3. Lactometer (CLR) Card */}
          <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-[#ecfeff] to-white border border-[#a5f3fc] text-center shadow-xs">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-cyan-900/80 block">
              Lactometer (CLR)
            </span>
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-cyan-700 my-1 block font-mono">
              {currentBatch.clr}
            </span>
            <span className="text-[10px] sm:text-[11px] text-cyan-950/70 font-medium inline-block bg-cyan-100/60 px-2 py-0.5 rounded-md">
              Ideal Natural Density
            </span>
          </div>

          {/* 4. Chilling Log Card */}
          <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-[#eff6ff] to-white border border-[#bfdbfe] text-center shadow-xs">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-900/80 block flex items-center justify-center gap-1">
              <ThermometerSnowflake size={12} className="text-blue-600" />
              <span>Chilling Log</span>
            </span>
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-700 my-1 block font-mono">
              {currentBatch.chilledTemp.split(' ')[0]}
            </span>
            <span className="text-[10px] sm:text-[11px] text-blue-950/70 font-medium inline-block bg-blue-100/60 px-2 py-0.5 rounded-md">
              Cold-Chain Verified
            </span>
          </div>

        </div>

        {/* ─────────────────────────────────────────────────────────────
            5-POINT ADULTERATION SAFETY MATRIX (TRUE GREEN PASSED LAB MARKS)
           ───────────────────────────────────────────────────────────── */}
        <div className="rounded-2xl sm:rounded-3xl border border-stone-200/80 bg-stone-50/70 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
              <Award size={16} className="text-[#16a34a]" />
              <span>Adulteration & Quality Assurance Matrix (5 Rigorous Tests)</span>
            </h4>
            <span className="text-[11px] font-bold text-[#15803d] bg-[#dcfce7] px-2.5 py-0.5 rounded-full border border-[#86efac]">
              ✓ All 5 Parameters Cleared
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentBatch.adulteration.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-stone-200/60 shadow-xs"
              >
                <span className="text-xs font-medium text-stone-700 flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#dcfce7] text-[#15803d] flex items-center justify-center shrink-0">
                    <Check size={13} strokeWidth={3} className="text-[#16a34a]" />
                  </span>
                  <span>{item.test}</span>
                </span>

                {/* Celebratory Emerald Passed Text */}
                <span className="text-xs font-bold text-[#15803d] font-mono bg-[#f0fdf4] px-2 py-0.5 rounded border border-[#bbf7d0]">
                  {item.result}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CERTIFICATE FOOTER & DOWNLOAD ACTION
           ───────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-5 border-t border-stone-100">
          
          {/* Signatory & Timestamp */}
          <div className="text-xs text-stone-500 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
            <span>
              Signed by: <strong className="text-stone-800">Dr. R. K. Sharma</strong> (Chief Dairy Scientist, Ex-NDRI)
            </span>
          </div>

          {/* Download Quality Certificate Button */}
          <button
            onClick={handleDownloadSlip}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 ${
              downloadSuccess
                ? 'bg-[#15803d] text-white shadow-green-900/20'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            {downloadSuccess ? (
              <>
                <Check size={14} strokeWidth={2.5} />
                <span>Certificate Downloaded!</span>
              </>
            ) : (
              <>
                <FileText size={14} />
                <span>Download Lab Certificate (PDF)</span>
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
};
