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
  Check
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
}

const SAMPLE_BATCHES: Record<string, BatchData> = {
  'RD-COW-402': {
    id: 'RD-COW-402',
    name: 'A2 Indigenous Desi Gir Cow Milk',
    milkType: 'Desi Cow Milk (A2)',
    village: 'Sikhreda Organic Pastures (UP)',
    milkedAt: '04:30 AM Today',
    testedAt: '05:15 AM Today',
    chilledTemp: '3.8°C (Cold-Chain Verified)',
    fat: '6.4%',
    snf: '9.2%',
    clr: '30.5',
    adulteration: [
      { test: 'Urea & Chemical Additives', result: '0.00% (Negative)', status: 'passed' },
      { test: 'Starch & Reconstituted Powder', result: '0.00% (Negative)', status: 'passed' },
      { test: 'Detergents & Neutralizers', result: '0.00% (Negative)', status: 'passed' },
      { test: 'Added Water & Foreign Fats', result: '0.00% (Zero Dilution)', status: 'passed' },
      { test: 'Oxytocin & Hormone Traces', result: 'Not Detected', status: 'passed' },
    ],
    certNumber: 'FSSAI-LAB-2026-0907-88',
  },
  'RD-BUFF-819': {
    id: 'RD-BUFF-819',
    name: 'Premium Murrah Buffalo Farm Milk',
    milkType: 'Pure Buffalo Whole Milk',
    village: 'Bhopa Road Dairy Hub',
    milkedAt: '04:15 AM Today',
    testedAt: '05:00 AM Today',
    chilledTemp: '3.6°C (Cold-Chain Verified)',
    fat: '7.8%',
    snf: '9.6%',
    clr: '31.2',
    adulteration: [
      { test: 'Urea & Chemical Additives', result: '0.00% (Negative)', status: 'passed' },
      { test: 'Starch & Reconstituted Powder', result: '0.00% (Negative)', status: 'passed' },
      { test: 'Detergents & Neutralizers', result: '0.00% (Negative)', status: 'passed' },
      { test: 'Added Water & Foreign Fats', result: '0.00% (Zero Dilution)', status: 'passed' },
      { test: 'Oxytocin & Hormone Traces', result: 'Not Detected', status: 'passed' },
    ],
    certNumber: 'FSSAI-LAB-2026-0907-92',
  },
  'RD-GHEE-105': {
    id: 'RD-GHEE-105',
    name: 'A2 Bilona Vedic Desi Cow Ghee',
    milkType: 'Hand-Churned Curd Bilona Ghee',
    village: 'Sikhreda Heritage Dairy Unit',
    milkedAt: 'Yesterday Churned',
    testedAt: '06:00 AM Today (GC Tested)',
    chilledTemp: 'Ambient Room Temp (Granular)',
    fat: '99.8%',
    snf: '0.15% Moisture',
    clr: 'RM Value: 30.4',
    adulteration: [
      { test: 'Vanaspati & Palm Oil Impurities', result: '0.00% (GC Negative)', status: 'passed' },
      { test: 'Mineral Oils & Animal Tallow', result: '0.00% (Negative)', status: 'passed' },
      { test: 'Artificial Color & Fragrance', result: '100% Natural Golden Beta-Carotene', status: 'passed' },
      { test: 'Free Fatty Acids (FFA)', result: '0.28% (Well below 1.4% standard)', status: 'passed' },
      { test: 'Peroxide Value (Freshness)', result: '0.12 meq/kg (Extremely Fresh)', status: 'passed' },
    ],
    certNumber: 'FSSAI-LAB-2026-0907-104',
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
    }, 450);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    if (SAMPLE_BATCHES[query]) {
      handleSelectBatch(query);
    } else {
      // Default to closest match or cow
      handleSelectBatch('RD-COW-402');
    }
  };

  const handleDownloadSlip = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="bg-gradient-to-b from-white via-amber-50/40 to-white rounded-[32px] sm:rounded-[36px] border border-amber-200/70 p-5 sm:p-8 lg:p-10 shadow-xl shadow-amber-950/5 relative overflow-hidden">
      {/* Decorative ambient elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-red-400/10 blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs mb-3">
          <FlaskConical size={14} className="text-emerald-700" />
          <span>Live Purity Transparency Lab</span>
        </div>

        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Verify Today's Milk Quality Report
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium leading-relaxed">
          Every batch from our partner farms is tested twice daily using Gas Chromatography & ultrasonic fat analyzers. No adulteration. Ever.
        </p>

        {/* Quick Sample Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          <span className="text-xs font-bold text-slate-400 mr-1 hidden sm:inline">Select Sample Batch:</span>
          {Object.values(SAMPLE_BATCHES).map((batch) => (
            <button
              key={batch.id}
              onClick={() => handleSelectBatch(batch.id)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedBatchId === batch.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/25 scale-105'
                  : 'bg-white text-slate-700 hover:bg-amber-100/70 border border-slate-200 shadow-2xs'
              }`}
            >
              <Sparkles size={12} className={selectedBatchId === batch.id ? 'text-yellow-300' : 'text-slate-400'} />
              <span>#{batch.id}</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-4 max-w-md mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search batch code (e.g. RD-COW-402)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-full bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-400 shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Check
          </button>
        </form>
      </div>

      {/* Main Certificate Card Display */}
      <div className={`relative bg-white rounded-3xl border-2 border-emerald-500/30 p-5 sm:p-7 shadow-lg shadow-emerald-950/5 transition-opacity duration-300 ${isScanning ? 'opacity-50' : 'opacity-100'}`}>
        
        {/* Certificate Seal Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500 text-white font-black text-xs tracking-wider">
                PASSED 100% PURE
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                Cert #{currentBatch.certNumber}
              </span>
            </div>
            <h4 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              {currentBatch.name}
            </h4>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1 font-medium">
                📍 Origin: <strong>{currentBatch.village}</strong>
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Clock size={12} className="text-slate-400" /> Milked: <strong>{currentBatch.milkedAt}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
              <ShieldCheck size={28} />
            </div>
            <div className="text-left">
              <span className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">FSSAI Certified</span>
              <span className="block text-xs font-black text-emerald-800">Govt. Lab Approved</span>
            </div>
          </div>
        </div>

        {/* Core Laboratory Reading Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-6">
          <div className="bg-gradient-to-b from-red-50/60 to-red-100/30 rounded-2xl p-4 border border-red-200/60 text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-700 block">FAT Content</span>
            <span className="text-2xl sm:text-3xl font-black text-red-600 my-1 block">{currentBatch.fat}</span>
            <span className="text-[10px] text-red-800/80 font-medium">High Cream Layer</span>
          </div>

          <div className="bg-gradient-to-b from-amber-50/60 to-amber-100/30 rounded-2xl p-4 border border-amber-200/60 text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 block">SNF Reading</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-600 my-1 block">{currentBatch.snf}</span>
            <span className="text-[10px] text-amber-800/80 font-medium">Essential Minerals</span>
          </div>

          <div className="bg-gradient-to-b from-emerald-50/60 to-emerald-100/30 rounded-2xl p-4 border border-emerald-200/60 text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 block">Lactometer (CLR)</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 my-1 block">{currentBatch.clr}</span>
            <span className="text-[10px] text-emerald-800/80 font-medium">Ideal Natural Density</span>
          </div>

          <div className="bg-gradient-to-b from-blue-50/60 to-blue-100/30 rounded-2xl p-4 border border-blue-200/60 text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 block flex items-center justify-center gap-1">
              <ThermometerSnowflake size={12} /> Chilling Log
            </span>
            <span className="text-base sm:text-xl font-black text-blue-700 my-1 block leading-tight">{currentBatch.chilledTemp.split(' ')[0]}</span>
            <span className="text-[10px] text-blue-800/80 font-medium">Cold-Chain Maintained</span>
          </div>
        </div>

        {/* 5-Point Adulteration Safety Matrix */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:p-5">
          <h5 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
            <Award size={15} className="text-emerald-600" />
            <span>Adulteration & Quality Assurance Matrix (5 Rigorous Tests)</span>
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentBatch.adulteration.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white px-3.5 py-2 rounded-xl border border-slate-100 shadow-2xs">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                  <span>{item.test}</span>
                </span>
                <span className="text-xs font-black text-emerald-700 font-mono">
                  {item.result}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Lab Chemist Sign: <strong>Dr. R. K. Sharma (Chief Quality Officer)</strong></span>
          </div>

          <button
            onClick={handleDownloadSlip}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              downloadSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-105 active:scale-95'
            }`}
          >
            {downloadSuccess ? (
              <>
                <Check size={14} strokeWidth={2.5} />
                <span>Certificate Saved!</span>
              </>
            ) : (
              <>
                <FileText size={14} />
                <span>Download Quality Certificate</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
