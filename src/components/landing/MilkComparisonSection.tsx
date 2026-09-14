import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Clock, 
  Droplets, 
  Heart, 
  Layers,
  Check,
  X,
  Columns2,
  ShieldCheck
} from 'lucide-react';

interface ComparisonPoint {
  title: string;
  shortTitle: string;
  category: string;
  icon: React.ReactNode;
  storeMilk: {
    description: string;
    tag: string;
  };
  ruduMilk: {
    description: string;
    tag: string;
  };
}

const COMPARISON_DATA: ComparisonPoint[] = [
  {
    title: 'Milking Timeline & Freshness',
    shortTitle: 'Milking Time',
    category: 'Freshness',
    icon: <Clock size={16} className="text-[#16a34a]" />,
    storeMilk: {
      description: 'Milked 3 to 5 days ago. Stored in transit depots, re-boiled, and sealed in plastic pouches.',
      tag: '3–5 Days Old',
    },
    ruduMilk: {
      description: 'Milked at 4:30 AM today, chilled immediately to 3.8°C, and on your doorstep by 6:30 AM.',
      tag: '< 2 Hours Fresh',
    },
  },
  {
    title: 'Natural Cream & Malai Layer',
    shortTitle: 'Natural Cream',
    category: 'Taste & Nutrition',
    icon: <Droplets size={16} className="text-[#16a34a]" />,
    storeMilk: {
      description: 'Heavily homogenized. Natural butterfat is stripped away to manufacture commercial butter and ghee.',
      tag: 'Cream Stripped',
    },
    ruduMilk: {
      description: 'Whole natural milk with intact natural fat globules. Yields a rich, spoonable golden malai upon boiling.',
      tag: 'Thick Golden Malai',
    },
  },
  {
    title: 'Chemical Preservatives & Additives',
    shortTitle: 'Chemicals',
    category: 'Safety',
    icon: <ShieldCheck size={16} className="text-[#16a34a]" />,
    storeMilk: {
      description: 'May contain chemical neutralizers, starch, or milk powders to artificially sustain shelf life and volume.',
      tag: 'Stabilizers Added',
    },
    ruduMilk: {
      description: 'Zero chemical neutralizers, zero milk solids, and zero preservatives. Tested 100% pure on Gas Chromatography.',
      tag: '0% Adulteration',
    },
  },
  {
    title: 'Cow Welfare & Cattle Nutrition',
    shortTitle: 'Cow Welfare',
    category: 'Ethics & Origin',
    icon: <Heart size={16} className="text-[#16a34a]" />,
    storeMilk: {
      description: 'Confined commercial stalls, synthetic concentrate feed, and frequent synthetic hormone stimulation.',
      tag: 'Industrial Stalls',
    },
    ruduMilk: {
      description: 'Desi cows graze freely in green village pastures with seasonal organic fodder, clean water, and loving care.',
      tag: 'Free-Range Organic',
    },
  },
  {
    title: 'Transparency & Batch Testing',
    shortTitle: 'Transparency',
    category: 'Accountability',
    icon: <Sparkles size={16} className="text-[#16a34a]" />,
    storeMilk: {
      description: 'Bulk blended from unknown anonymous sources. No per-packet lab certificate accessible to buyers.',
      tag: 'Anonymous Blend',
    },
    ruduMilk: {
      description: 'Every batch is computerized with FAT, SNF, and FSSAI lab certificates verifiable online in real-time.',
      tag: 'Live Batch Reports',
    },
  },
];

export const MilkComparisonSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<'compact-grid' | 'point-by-point'>('compact-grid');

  return (
    <section id="comparison" className="py-12 sm:py-20 px-2.5 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 shadow-xs mb-2.5">
          <Sparkles size={13} className="text-amber-600" />
          <span>The Pure Milk Difference</span>
        </div>

        <h2 className="font-editorial-serif text-2xl sm:text-4xl lg:text-[2.65rem] font-bold text-slate-900 tracking-tight leading-tight mb-2.5">
          Rudu Farm Fresh vs. Commercial Packet Milk
        </h2>
        
        <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
          Ever wondered why packet milk doesn't form thick golden malai or taste like authentic village milk? Here is the honest, lab-tested comparison.
        </p>

        {/* View Mode Switcher (Desktop and Tablet) */}
        <div className="hidden sm:flex items-center justify-center gap-2 mt-5">
          <div className="inline-flex p-1 rounded-full bg-slate-100 border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setViewMode('compact-grid')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'compact-grid'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns2 size={13} />
              <span>Side-by-Side</span>
            </button>
            <button
              onClick={() => setViewMode('point-by-point')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'point-by-point'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers size={13} />
              <span>Point-by-Point</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2-COLUMNS COMPACT SIDE-BY-SIDE (MATCHING USER REFERENCE IMAGE)
         ───────────────────────────────────────────────────────────── */}
      {viewMode === 'compact-grid' && (
        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 max-w-6xl mx-auto items-stretch">
          
          {/* Column 1: Rudu Farm Fresh Milk (Green Border & Checkmark) */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border-2 border-[#16a34a] p-2.5 sm:p-5 shadow-lg shadow-emerald-950/5 flex flex-col justify-between relative overflow-hidden">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-2 sm:pb-3 border-b border-[#dcfce7] mb-2.5 sm:mb-3">
                <div>
                  <span className="text-[9px] sm:text-xs font-black uppercase tracking-wider text-[#15803d] block mb-0.5">
                    ✓ RECOMMENDED
                  </span>
                  <h3 className="font-editorial-serif text-xs sm:text-xl md:text-2xl font-black text-[#14532d] leading-tight">
                    Rudu Farm Fresh
                  </h3>
                </div>
                
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 shadow-sm ml-1">
                  <Check size={13} strokeWidth={3} />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 sm:space-y-3">
                {COMPARISON_DATA.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-[#bbf7d0] shadow-2xs flex flex-col justify-between min-h-[92px] sm:min-h-[112px]"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] sm:text-xs font-bold text-[#14532d] truncate">
                        {item.shortTitle}
                      </span>
                      <span className="text-[8px] sm:text-[9.5px] font-extrabold bg-[#dcfce7] text-[#166534] px-1.5 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                        {item.ruduMilk.tag}
                      </span>
                    </div>
                    <p className="text-[9px] sm:text-xs text-slate-600 leading-snug font-normal">
                      {item.ruduMilk.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 sm:mt-4 pt-2 border-t border-[#dcfce7] text-[9px] sm:text-xs font-black text-[#15803d] flex items-center gap-1">
              <CheckCircle2 size={12} className="text-[#16a34a] shrink-0" />
              <span className="truncate">100% GC Lab Pure • Delivered 6:30 AM</span>
            </div>
          </div>

          {/* Column 2: Commercial Packet Milk (Gray Border & Cross) */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-2.5 sm:p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-2 sm:pb-3 border-b border-slate-100 mb-2.5 sm:mb-3">
                <div>
                  <span className="text-[9px] sm:text-xs font-black uppercase tracking-wider text-rose-600 block mb-0.5">
                    ✕ PACKET MILK
                  </span>
                  <h3 className="font-editorial-serif text-xs sm:text-xl md:text-2xl font-bold text-slate-800 leading-tight">
                    Supermarket Milk
                  </h3>
                </div>
                
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 ml-1">
                  <X size={13} strokeWidth={3} />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 sm:space-y-3">
                {COMPARISON_DATA.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="bg-slate-50/70 rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-slate-200/80 shadow-2xs flex flex-col justify-between min-h-[92px] sm:min-h-[112px]"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] sm:text-xs font-bold text-slate-700 truncate">
                        {item.shortTitle}
                      </span>
                      <span className="text-[8px] sm:text-[9.5px] font-extrabold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                        {item.storeMilk.tag}
                      </span>
                    </div>
                    <p className="text-[9px] sm:text-xs text-slate-500 leading-snug font-normal">
                      {item.storeMilk.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 sm:mt-4 pt-2 border-t border-slate-100 text-[9px] sm:text-xs font-medium text-rose-700 flex items-center gap-1">
              <XCircle size={12} className="text-rose-500 shrink-0" />
              <span className="truncate">Preservatives & Neutralizers Added</span>
            </div>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          POINT-BY-POINT COMPARISON VIEW (DESKTOP OPTIONAL)
         ───────────────────────────────────────────────────────────── */}
      {viewMode === 'point-by-point' && (
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-2 text-xs font-black uppercase tracking-wider text-slate-500">
            <div className="col-span-4">Comparison Parameter</div>
            <div className="col-span-4 text-[#15803d] flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#16a34a]" />
              <span>Rudu Farm Fresh</span>
            </div>
            <div className="col-span-4 text-rose-700 flex items-center gap-1.5">
              <XCircle size={14} className="text-rose-600" />
              <span>Commercial Packet</span>
            </div>
          </div>

          {COMPARISON_DATA.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-md p-4 sm:p-6 transition-all hover:shadow-lg hover:border-emerald-300"
            >
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-[#ecfdf5] flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-base leading-snug">
                    {item.title}
                  </h4>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">{item.category}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <div className="rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#15803d]">
                      <Check size={13} strokeWidth={3} className="text-[#16a34a]" />
                      <span>Rudu Farm Fresh</span>
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-extrabold bg-[#dcfce7] text-[#166534] border border-[#86efac] px-2 py-0.5 rounded-full">
                      {item.ruduMilk.tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {item.ruduMilk.description}
                  </p>
                </div>

                <div className="rounded-xl bg-rose-50/60 border border-rose-200/70 p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800">
                      <X size={13} strokeWidth={3} className="text-rose-600" />
                      <span>Commercial Packet Milk</span>
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                      {item.storeMilk.tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.storeMilk.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
