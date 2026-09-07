import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Droplets, 
  HeartHandshake, 
  ArrowRight 
} from 'lucide-react';

interface ComparisonPoint {
  title: string;
  category: string;
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
    storeMilk: {
      description: 'Milked 3 to 5 days ago. Stored in transit depots, re-boiled and packaged in plastic pouches.',
      tag: '3-5 Days Old',
    },
    ruduMilk: {
      description: 'Milked at 4:30 AM today, chilled immediately to 3.8°C, and on your doorstep by 6:30 AM.',
      tag: '< 2 Hours Fresh',
    },
  },
  {
    title: 'Natural Cream & Malai Layer',
    category: 'Taste & Texture',
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
  const [activeMode, setActiveMode] = useState<'both' | 'rudu' | 'store'>('both');

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs mb-3">
          <Sparkles size={14} className="text-amber-700" />
          <span>The Pure Milk Difference</span>
        </div>

        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Commercial Packet Milk vs. Rudu Farm Fresh
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2.5 font-medium leading-relaxed">
          Ever wondered why packet milk doesn't form thick malai or taste like the village milk you grew up with? Here is the honest comparison.
        </p>

        {/* Mobile Filter Toggle */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-5">
          <button
            onClick={() => setActiveMode('both')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeMode === 'both'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setActiveMode('rudu')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeMode === 'rudu'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            Rudu Fresh Only
          </button>
          <button
            onClick={() => setActiveMode('store')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeMode === 'store'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-red-50 text-red-800'
            }`}
          >
            Store Milk Only
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        
        {/* Left Column: Commercial Packet Milk */}
        {(activeMode === 'both' || activeMode === 'store') && (
          <div className="rounded-[32px] bg-white border-2 border-red-200/80 p-6 sm:p-8 shadow-xl shadow-red-950/5 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/40 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-5 border-b border-red-100 mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-600 block">
                    Conventional Supermarket Milk
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    Processed Pouch Milk
                  </h4>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <XCircle size={24} />
                </div>
              </div>

              <div className="space-y-5">
                {COMPARISON_DATA.map((item, idx) => (
                  <div key={idx} className="bg-red-50/40 rounded-2xl p-4 border border-red-100/60">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h5 className="text-xs font-black text-slate-900">{item.title}</h5>
                      <span className="text-[10px] font-extrabold text-red-700 bg-red-100 px-2 py-0.5 rounded-md shrink-0">
                        {item.storeMilk.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {item.storeMilk.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-red-100 flex items-center gap-2 text-xs font-bold text-red-700">
              <ShieldAlert size={16} />
              <span>Often contains reconstituted powder & preservatives</span>
            </div>
          </div>
        )}

        {/* Right Column: Rudu Farm Fresh */}
        {(activeMode === 'both' || activeMode === 'rudu') && (
          <div className="rounded-[32px] bg-gradient-to-b from-white via-emerald-50/20 to-white border-2 border-emerald-500/80 p-6 sm:p-8 shadow-2xl shadow-emerald-950/10 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-5 border-b border-emerald-100 mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                    Certified 100% Pure & Untouched
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                    Rudu Farm Fresh Milk
                  </h4>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30">
                  <CheckCircle2 size={24} />
                </div>
              </div>

              <div className="space-y-5">
                {COMPARISON_DATA.map((item, idx) => (
                  <div key={idx} className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-200/60 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h5 className="text-xs font-black text-slate-900">{item.title}</h5>
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md shrink-0">
                        {item.ruduMilk.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                      {item.ruduMilk.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-emerald-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-800">
                <ShieldCheck size={18} className="text-emerald-600" />
                <span>100% GC Lab Verified • Delivered by 6:30 AM</span>
              </div>
              <span className="text-xs font-extrabold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                Taste the Purity
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
