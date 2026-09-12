import React, { useState, useRef } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Droplets, 
  Heart, 
  Layers,
  ArrowRight,
  Check,
  X,
  Columns2,
  SlidersHorizontal
} from 'lucide-react';

interface ComparisonPoint {
  title: string;
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
    category: 'Freshness',
    icon: <Clock size={16} className="text-[#16a34a]" />,
    storeMilk: {
      description: 'Milked 3 to 5 days ago. Stored in transit depots, re-boiled, and sealed in plastic pouches.',
      tag: '3-5 Days Old',
    },
    ruduMilk: {
      description: 'Milked at 4:30 AM today, chilled immediately to 3.8°C, and on your doorstep by 6:30 AM.',
      tag: '< 2 Hours Fresh',
    },
  },
  {
    title: 'Natural Cream & Malai Layer',
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
  const [viewMode, setViewMode] = useState<'horizontal' | 'compact-grid' | 'point-by-point'>('horizontal');
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToCard = (index: number) => {
    setActiveCardIndex(index);
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.clientWidth * 0.88;
    scrollRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const newIdx = Math.round(scrollLeft / (clientWidth * 0.88));
    setActiveCardIndex(Math.min(Math.max(newIdx, 0), 1));
  };

  return (
    <section id="comparison" className="py-14 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 shadow-xs mb-3">
          <Sparkles size={14} className="text-amber-600" />
          <span>The Pure Milk Difference</span>
        </div>

        <h2 className="font-editorial-serif text-2xl sm:text-4xl lg:text-[2.65rem] font-bold text-slate-900 tracking-tight leading-tight mb-3">
          Rudu Farm Fresh vs. Commercial Packet Milk
        </h2>
        
        <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
          Ever wondered why packet milk doesn't form thick golden malai or taste like authentic village milk? Here is the honest, lab-tested comparison.
        </p>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5 sm:mt-7">
          <div className="inline-flex p-1 rounded-full bg-slate-100 border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setViewMode('horizontal')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'horizontal'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal size={13} />
              <span>Side-by-Side</span>
            </button>
            <button
              onClick={() => setViewMode('compact-grid')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 md:hidden ${
                viewMode === 'compact-grid'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns2 size={13} />
              <span>2-Columns</span>
            </button>
            <button
              onClick={() => setViewMode('point-by-point')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
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

        {/* Mobile Horizontal Switcher Buttons (only in horizontal carousel mode) */}
        {viewMode === 'horizontal' && (
          <div className="flex md:hidden items-center justify-center gap-2 mt-4">
            <button 
              onClick={() => scrollToCard(0)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCardIndex === 0
                  ? 'bg-[#15803d] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activeCardIndex === 0 ? 'bg-white' : 'bg-[#15803d]'}`} />
              <span>Rudu Farm Fresh</span>
            </button>
            <button 
              onClick={() => scrollToCard(1)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCardIndex === 1
                  ? 'bg-rose-700 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activeCardIndex === 1 ? 'bg-white' : 'bg-rose-600'}`} />
              <span>Commercial Packet</span>
            </button>
          </div>
        )}

        {viewMode === 'horizontal' && (
          <div className="text-center md:hidden mt-2 text-[11px] font-semibold text-slate-400 flex items-center justify-center gap-1">
            <span>← Swipe horizontally to compare →</span>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODE 1: HORIZONTAL ALIGNED CARDS (SIDE-BY-SIDE TRACK ON MOBILE)
         ───────────────────────────────────────────────────────────── */}
      {viewMode === 'horizontal' && (
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto md:grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto pb-4 snap-x snap-mandatory no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0 items-stretch"
        >
          {/* Card 1: Rudu Farm Fresh Milk (Vibrant Farm Green) */}
          <div className="w-[88vw] max-w-[440px] md:w-auto flex-shrink-0 snap-center rounded-[2rem] sm:rounded-[2.25rem] bg-gradient-to-b from-[#f0fdf4] via-white to-[#f0fdf4] border-2 border-[#22c55e] p-5 sm:p-8 shadow-xl shadow-emerald-950/10 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#16a34a] via-[#22c55e] to-[#4ade80]" />
            <div className="absolute top-2 right-2 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#dcfce7] mb-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#15803d] bg-[#dcfce7] border border-[#86efac] px-2.5 py-0.5 rounded-full mb-1.5">
                    <Sparkles size={11} className="text-[#16a34a]" />
                    <span>Recommended • Pure & Untouched</span>
                  </span>
                  <h3 className="font-editorial-serif text-xl sm:text-3xl font-extrabold text-[#14532d] leading-tight">
                    Rudu Farm Fresh Milk
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                    Milked at 4:30 AM • Delivered fresh before tea
                  </p>
                </div>
                
                {/* Green Check Badge */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#16a34a] text-white flex items-center justify-center shrink-0 shadow-lg shadow-green-700/25">
                  <CheckCircle2 size={24} strokeWidth={2.4} />
                </div>
              </div>

              {/* Benefits List */}
              <div className="space-y-3.5 sm:space-y-4">
                {COMPARISON_DATA.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white/90 rounded-2xl p-3.5 sm:p-4 border border-[#bbf7d0] shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-[#dcfce7] text-[#15803d] flex items-center justify-center shrink-0 text-[10px] font-bold">
                          ✓
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-[#14532d] leading-tight">{item.title}</h4>
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-extrabold text-[#15803d] bg-[#dcfce7] border border-[#86efac] px-2 py-0.5 rounded-md shrink-0">
                        {item.ruduMilk.tag}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed font-medium pl-5 sm:pl-6">
                      {item.ruduMilk.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Badge */}
            <div className="mt-6 pt-4 border-t border-[#dcfce7] flex items-center justify-between gap-2 bg-[#ecfdf5]/70 -mx-5 -mb-5 sm:-mx-8 sm:-mb-8 p-4 sm:p-5 rounded-b-[2rem]">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#15803d]">
                <ShieldCheck size={16} className="text-[#16a34a] shrink-0" />
                <span>100% GC Lab Verified • Delivered 6:30 AM</span>
              </div>
              <span className="text-[10px] sm:text-xs font-extrabold text-white bg-[#15803d] px-2.5 py-1 rounded-full shadow-sm shrink-0">
                Pure Milk
              </span>
            </div>
          </div>

          {/* Card 2: Commercial Packet Milk (Muted Red/Slate) */}
          <div className="w-[88vw] max-w-[440px] md:w-auto flex-shrink-0 snap-center rounded-[2rem] sm:rounded-[2.25rem] bg-white border-2 border-slate-200 p-5 sm:p-8 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-slate-300" />

            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full mb-1.5">
                    <ShieldAlert size={11} className="text-rose-600" />
                    <span>Supermarket Standard</span>
                  </span>
                  <h3 className="font-editorial-serif text-xl sm:text-3xl font-bold text-slate-700 leading-tight">
                    Commercial Packet Milk
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">
                    Multi-day cold transit & depot storage
                  </p>
                </div>
                
                {/* Red Cross Badge */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                  <XCircle size={24} strokeWidth={2.2} />
                </div>
              </div>

              {/* Drawbacks List */}
              <div className="space-y-3.5 sm:space-y-4">
                {COMPARISON_DATA.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="bg-slate-50/80 rounded-2xl p-3.5 sm:p-4 border border-slate-200/60"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 text-[10px] font-bold">
                          ✕
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-700 leading-tight">{item.title}</h4>
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-extrabold text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-md shrink-0">
                        {item.storeMilk.tag}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-normal pl-5 sm:pl-6">
                      {item.storeMilk.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Alert */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] sm:text-xs font-medium text-rose-700 bg-rose-50/60 -mx-5 -mb-5 sm:-mx-8 sm:-mb-8 p-4 sm:p-5 rounded-b-[2rem]">
              <ShieldAlert size={15} className="shrink-0" />
              <span>Often reconstituted with milk powder & stabilizers</span>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODE 2: 2-COLUMNS COMPACT SIDE-BY-SIDE (MOBILE & DESKTOP)
         ───────────────────────────────────────────────────────────── */}
      {viewMode === 'compact-grid' && (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-6 max-w-6xl mx-auto items-stretch">
          {/* Column 1: Rudu */}
          <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#f0fdf4] to-white border-2 border-[#22c55e] p-3 sm:p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-[#dcfce7] mb-3">
                <div>
                  <span className="text-[9px] sm:text-xs font-extrabold uppercase text-[#15803d] block">
                    ✓ Recommended
                  </span>
                  <h3 className="font-editorial-serif text-sm sm:text-2xl font-black text-[#14532d] leading-tight">
                    Rudu Farm Fresh
                  </h3>
                </div>
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-xl bg-[#16a34a] text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} strokeWidth={2.4} />
                </div>
              </div>

              <div className="space-y-2.5">
                {COMPARISON_DATA.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-2 sm:p-3 border border-[#bbf7d0]">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] sm:text-xs font-bold text-[#14532d] truncate">{item.title}</span>
                      <span className="text-[8px] sm:text-[10px] font-extrabold bg-[#dcfce7] text-[#166534] px-1.5 py-0.5 rounded shrink-0">
                        {item.ruduMilk.tag}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-slate-700 leading-snug font-medium">
                      {item.ruduMilk.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-[#dcfce7] text-[9px] sm:text-xs font-bold text-[#15803d]">
              100% GC Lab Pure • Delivered 6:30 AM
            </div>
          </div>

          {/* Column 2: Commercial Packet */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border-2 border-slate-200 p-3 sm:p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
                <div>
                  <span className="text-[9px] sm:text-xs font-bold uppercase text-rose-600 block">
                    ✕ Packet Milk
                  </span>
                  <h3 className="font-editorial-serif text-sm sm:text-2xl font-bold text-slate-700 leading-tight">
                    Supermarket Milk
                  </h3>
                </div>
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <XCircle size={16} strokeWidth={2.2} />
                </div>
              </div>

              <div className="space-y-2.5">
                {COMPARISON_DATA.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-2 sm:p-3 border border-slate-200">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] sm:text-xs font-bold text-slate-700 truncate">{item.title}</span>
                      <span className="text-[8px] sm:text-[10px] font-extrabold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded shrink-0">
                        {item.storeMilk.tag}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-slate-500 leading-snug font-normal">
                      {item.storeMilk.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-100 text-[9px] sm:text-xs font-medium text-rose-700">
              Preservatives & Neutralizers Added
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODE 3: POINT-BY-POINT COMPARISON VIEW
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
