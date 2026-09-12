import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  CheckCircle2,
  MapPin, 
  Navigation, 
  X,
  Clock,
  Zap,
  Tag
} from 'lucide-react';

const MilkGlassIcon = ({ className = "w-5 h-5 text-[#c1121f]" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 2h10l1 18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L7 2Z" />
    <path d="M6.5 8h11" strokeDasharray="2 2" />
  </svg>
);

const CowEmblemIcon = ({ className = "w-5 h-5 text-amber-600" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 8l2.5 1.5M20 8l-2.5 1.5" />
    <path d="M5 6c0-2 2-3 4-3h6c2 0 4 1 4 3" />
    <path d="M6.5 9.5C6.2 11 6 12.5 6 14c0 3 2.5 5 6 5s6-2 6-5c0-1.5-.2-3-.5-4.5" />
    <ellipse cx="12" cy="15.5" rx="3.5" ry="2.5" />
    <circle cx="10" cy="15.5" r="0.75" fill="currentColor" />
    <circle cx="14" cy="15.5" r="0.75" fill="currentColor" />
    <circle cx="9" cy="11.5" r="1" fill="currentColor" />
    <circle cx="15" cy="11.5" r="1" fill="currentColor" />
  </svg>
);

const BuffaloIcon = ({ className = "w-5 h-5 text-[#166534]" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6c2 3 5 4 9 4s7-1 9-4" />
    <path d="M6 10v4c0 3 2.5 6 6 6s6-3 6-6v-4" />
    <ellipse cx="12" cy="16" rx="3" ry="2" />
    <circle cx="10.5" cy="16" r="0.6" fill="currentColor" />
    <circle cx="13.5" cy="16" r="0.6" fill="currentColor" />
    <circle cx="9" cy="12.5" r="0.9" fill="currentColor" />
    <circle cx="15" cy="12.5" r="0.9" fill="currentColor" />
  </svg>
);

const LeafSlimIcon = ({ className = "w-5 h-5 text-teal-600" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 12" />
  </svg>
);

interface DairyOption {
  id: string;
  name: string;
  shortName: string;
  pricePerLiter: number;
  tag: string;
  fatNote: string;
  desc: string;
  badgeClass: string;
  icon: React.ReactNode;
}

const DAIRY_OPTIONS: DairyOption[] = [
  {
    id: 'full-cream',
    name: 'Full Cream Fresh Milk',
    shortName: 'Full Cream Milk',
    pricePerLiter: 66,
    tag: 'Best Seller',
    fatNote: '6.0% Natural Fat',
    desc: 'Rich cream for thick malai, tea & desserts',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    icon: <MilkGlassIcon className="w-5 h-5 text-[#c1121f]" />,
  },
  {
    id: 'cow-a2',
    name: 'A2 Desi Gir Cow Milk',
    shortName: 'A2 Gir Cow Milk',
    pricePerLiter: 78,
    tag: 'A2 Vedic Pure',
    fatNote: '4.5% A2 Protein',
    desc: 'Indigenous desi breed, easy to digest for all ages',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: <CowEmblemIcon className="w-5 h-5 text-amber-600" />,
  },
  {
    id: 'buffalo-pure',
    name: 'Murrah Buffalo Milk',
    shortName: 'Murrah Buffalo',
    pricePerLiter: 70,
    tag: 'Thick & Creamy',
    fatNote: '7.5% Dense Fat',
    desc: 'Rich & thick, ideal for morning curd and paneer',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: <BuffaloIcon className="w-5 h-5 text-[#15803d]" />,
  },
  {
    id: 'toned-slim',
    name: 'Toned Slim Light Milk',
    shortName: 'Toned Slim Milk',
    pricePerLiter: 52,
    tag: 'Low-Fat',
    fatNote: '3.0% Low Fat',
    desc: 'Homogenized light milk packed with calcium',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    icon: <LeafSlimIcon className="w-5 h-5 text-sky-600" />,
  },
];

const FAMILY_TIPS: Record<number, string> = {
  1: 'Ideal for 1-2 people (Daily tea, coffee & children)',
  2: 'Most Popular: Perfect for 3-4 family members',
  3: 'Great for joint families (Daily milk, thick dahi & tea)',
  4: 'Large family plan with extra savings & fresh dahi set',
  5: 'Wholesale home plan for large dairy-loving households',
};

const POPULAR_ZONES = [
  'Sikhreda Hub',
  'Civil Lines',
  'Model Town',
  'Sector 14',
  'Bhopa Road',
  'New Mandi',
];

interface SubscriptionCalculatorProps {
  onSelectPlan?: (planDetails: { 
    product: string; 
    quantity: number; 
    frequency: string; 
    monthlyCost: number;
    locality?: string;
  }) => void;
}

export const SubscriptionCalculator: React.FC<SubscriptionCalculatorProps> = ({ onSelectPlan }) => {
  const [selectedProduct, setSelectedProduct] = useState<DairyOption>(DAIRY_OPTIONS[0]);
  const [litersPerDay, setLitersPerDay] = useState<number>(2);
  const [frequency, setFrequency] = useState<'daily' | 'alternate' | 'weekdays'>('daily');
  const [deliveryLocation, setDeliveryLocation] = useState<string>('Civil Lines');
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [isTrialBooked, setIsTrialBooked] = useState<boolean>(false);

  const daysInMonth = frequency === 'daily' ? 30 : frequency === 'alternate' ? 15 : 22;
  const rawMonthlyCost = selectedProduct.pricePerLiter * litersPerDay * daysInMonth;
  const discountAmount = Math.round(rawMonthlyCost * 0.12);
  const finalMonthlyCost = rawMonthlyCost - discountAmount;
  const perDayCost = Math.round(finalMonthlyCost / daysInMonth);

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsDetectingLocation(false);
          setDeliveryLocation('Sikhreda Hub, Main Route');
        },
        () => {
          setIsDetectingLocation(false);
          setDeliveryLocation('Civil Lines, Sector 14');
        },
        { timeout: 3500 }
      );
    } else {
      setTimeout(() => {
        setIsDetectingLocation(false);
        setDeliveryLocation('Civil Lines, Sector 14');
      }, 500);
    }
  };

  const handleBookTrial = () => {
    setIsTrialBooked(true);
    if (onSelectPlan) {
      onSelectPlan({
        product: selectedProduct.name,
        quantity: litersPerDay,
        frequency,
        monthlyCost: finalMonthlyCost,
        locality: deliveryLocation,
      });
    }
    setTimeout(() => setIsTrialBooked(false), 3500);
  };

  return (
    <div className="w-full bg-[#FAF8F5] rounded-[2rem] sm:rounded-[2.75rem] border border-stone-200/90 p-4 sm:p-7 lg:p-9 shadow-xl shadow-stone-900/5 relative overflow-hidden my-8 sm:my-12">
      
      {/* Subtle ambient light accents */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-red-100/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />

      {/* Header Badge & Title */}
      <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-9">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-[#c1121f] border border-red-200/80 shadow-xs mb-3">
          <Sparkles size={13} className="text-[#c1121f]" />
          <span>Morning Dairy Planner</span>
        </div>

        <h2 className="font-editorial-serif text-2xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#14281d] tracking-tight leading-tight mb-2 sm:mb-3">
          Build Your Daily Milk Plan
        </h2>
        
        <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed max-w-lg mx-auto">
          Freshly milked at 4:30 AM & delivered to your doorstep before 6:30 AM. Choose your preferred milk, liters & schedule.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
        
        {/* Left: Customizer Steps */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          
          {/* STEP 1: Select Dairy Variety */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200/70 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#c1121f] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Select Milk Variety</span>
              </span>
              <span className="text-xs font-bold text-[#c1121f] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                ₹{selectedProduct.pricePerLiter}/L
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {DAIRY_OPTIONS.map((option) => {
                const isSelected = selectedProduct.id === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => setSelectedProduct(option)}
                    className={`relative p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                      isSelected
                        ? 'border-[#c1121f] bg-white shadow-lg shadow-red-950/5 ring-2 ring-red-500/10'
                        : 'border-stone-200/80 bg-stone-50/50 hover:bg-white hover:border-stone-300'
                    }`}
                  >
                    {/* Top Row: Vector Icon + Tag */}
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-white border border-stone-200/60 shadow-xs flex items-center justify-center shrink-0">
                        {option.icon}
                      </div>
                      <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border ${option.badgeClass} truncate max-w-[90px] sm:max-w-none`}>
                        {option.tag}
                      </span>
                    </div>

                    {/* Bottom Info */}
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#14281d] leading-snug">
                        {option.shortName}
                      </h4>
                      <div className="flex items-baseline justify-between gap-1 mt-1.5 pt-1.5 border-t border-stone-100">
                        <span className="text-[10px] font-medium text-stone-400">
                          {option.fatNote}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#c1121f]">
                          ₹{option.pricePerLiter}
                          <span className="text-[10px] text-stone-400 font-normal">/L</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Choose Liters Per Day */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200/70 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#c1121f] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Daily Requirement</span>
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#c1121f]">
                {litersPerDay} Liter{litersPerDay > 1 ? 's' : ''} Daily
              </span>
            </div>

            {/* Segmented Stepper */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200/60">
              {[1, 2, 3, 4, 5].map((num) => {
                const isSelected = litersPerDay === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setLitersPerDay(num)}
                    className={`py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-[#c1121f] text-white shadow-md shadow-red-700/20'
                        : 'text-stone-600 hover:bg-white/80 hover:text-stone-900'
                    }`}
                  >
                    <span>{num}L</span>
                  </button>
                );
              })}
            </div>

            {/* Family Tip Card */}
            <div className="flex items-center gap-2 mt-3 text-[11px] font-medium text-stone-600 bg-amber-50/80 px-3.5 py-2 rounded-xl border border-amber-200/60">
              <span className="text-amber-700 text-xs">💡</span>
              <span>{FAMILY_TIPS[litersPerDay] || FAMILY_TIPS[2]}</span>
            </div>
          </div>

          {/* STEP 3: Delivery Schedule */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200/70 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-[#c1121f] text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Delivery Frequency</span>
            </span>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'daily', title: 'Everyday', tag: '30 Days / Mo' },
                { id: 'alternate', title: 'Alternate', tag: '15 Days / Mo' },
                { id: 'weekdays', title: 'Mon–Fri', tag: '22 Days / Mo' },
              ].map((freq) => {
                const isSelected = frequency === freq.id;
                return (
                  <button
                    key={freq.id}
                    type="button"
                    onClick={() => setFrequency(freq.id as any)}
                    className={`py-2.5 sm:py-3 px-2 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center select-none ${
                      isSelected
                        ? 'border-[#15803d] bg-[#f0fdf4] text-[#14532d] shadow-sm font-bold'
                        : 'border-stone-200 bg-stone-50/50 text-stone-600 hover:border-stone-300 hover:bg-white font-medium'
                    }`}
                  >
                    <span className="text-xs sm:text-sm leading-snug">{freq.title}</span>
                    <span className="text-[10px] text-stone-400 font-normal mt-0.5">{freq.tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Delivery Location & Route Serviceability */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200/70 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#c1121f] text-white flex items-center justify-center text-[10px] font-bold">4</span>
                <span>Delivery Locality / Area</span>
              </span>
              {deliveryLocation ? (
                <span className="text-[10px] sm:text-[11px] font-bold text-[#15803d] bg-[#dcfce7] px-2.5 py-0.5 rounded-full border border-[#86efac] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
                  Route 6:15 AM Active
                </span>
              ) : (
                <span className="text-[10px] text-stone-400 font-semibold">Enter Address</span>
              )}
            </div>

            {/* Location Input with Auto-Detect & Clear */}
            <div className="relative flex items-center">
              <MapPin size={16} className="absolute left-3 text-red-500 shrink-0 pointer-events-none" />
              <input
                type="text"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="Enter society, sector or street..."
                className="w-full pl-9 pr-24 sm:pr-28 py-2.5 sm:py-3 bg-stone-50 rounded-xl border-2 border-stone-200 focus:border-[#c1121f] focus:bg-white text-xs sm:text-sm font-bold text-stone-800 placeholder-stone-400 transition-all outline-hidden"
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                {deliveryLocation && (
                  <button
                    type="button"
                    onClick={() => setDeliveryLocation('')}
                    className="p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-200 transition-colors"
                    title="Clear location"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-100/70 hover:bg-amber-100 text-amber-900 text-[10px] sm:text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                  title="Detect route via GPS"
                >
                  <Navigation size={11} className={isDetectingLocation ? 'animate-spin' : ''} />
                  <span>{isDetectingLocation ? 'Locating...' : 'Auto Detect'}</span>
                </button>
              </div>
            </div>

            {/* Popular Delivery Routes */}
            <div className="mt-3">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">Popular Delivery Routes:</span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_ZONES.map((zone) => {
                  const isActive = deliveryLocation.toLowerCase().includes(zone.toLowerCase());
                  return (
                    <button
                      key={zone}
                      type="button"
                      onClick={() => setDeliveryLocation(zone)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        isActive
                          ? 'bg-[#c1121f] text-white border-[#c1121f] shadow-xs'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <span>📍 {zone}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Route Confirmation */}
            {deliveryLocation && (
              <div className="mt-3 p-3 bg-[#f0fdf4] rounded-xl border border-[#bbf7d0] flex items-start gap-2.5 text-[11px] leading-relaxed">
                <CheckCircle2 size={16} className="text-[#16a34a] shrink-0 mt-0.5" />
                <div className="text-[#14532d]">
                  <span className="font-bold">Direct Morning Route Confirmed:</span> Doorstep morning delivery guaranteed for <strong className="font-extrabold">{deliveryLocation}</strong> before 6:30 AM!
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right: Modern Price Summary & Checkout Card */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xl shadow-stone-900/5 relative overflow-hidden">
            
            {/* Top Savings Banner */}
            <div className="bg-gradient-to-r from-[#15803d] to-[#16a34a] text-white py-2 px-3.5 rounded-xl text-xs font-bold mb-4 shadow-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-200 shrink-0" />
                <span>Subscription Savings</span>
              </div>
              <span className="bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] font-extrabold">
                -₹{discountAmount}/mo
              </span>
            </div>

            {/* Details Table */}
            <div className="space-y-2.5 py-2 text-xs border-b border-stone-100">
              <div className="flex items-center justify-between text-stone-600">
                <span>Selected Variety:</span>
                <strong className="text-stone-900 font-bold">{selectedProduct.shortName}</strong>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>Rate & Quantity:</span>
                <span className="font-semibold text-stone-900">
                  {litersPerDay}L × ₹{selectedProduct.pricePerLiter}/L ({daysInMonth} deliveries)
                </span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>Morning Delivery:</span>
                <span className="font-bold text-[#15803d] bg-[#dcfce7] px-2 py-0.5 rounded-md border border-[#86efac]">
                  FREE by 6:15 AM
                </span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span className="flex items-center gap-1 text-stone-500">
                  <MapPin size={12} className="text-red-500 shrink-0" />
                  <span>Deliver To:</span>
                </span>
                <span className="font-bold text-stone-900 truncate max-w-[170px] text-right">
                  {deliveryLocation || 'Select Locality'}
                </span>
              </div>
            </div>

            {/* Monthly Total Display */}
            <div className="pt-4 pb-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400">
                  Estimated Monthly Total
                </span>
                <span className="text-xs font-bold text-[#15803d]">
                  ~₹{perDayCost}/day
                </span>
              </div>

              <div className="flex items-baseline gap-2.5 mt-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                  ₹{finalMonthlyCost.toLocaleString('en-IN')}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-stone-400 line-through">
                  ₹{rawMonthlyCost.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-[#c1121f] bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                  12% OFF
                </span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-2 mb-5 text-[11px] text-stone-600 font-medium bg-stone-50 p-3 rounded-xl border border-stone-100">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#16a34a] shrink-0" />
                <span>Zero deposit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#16a34a] shrink-0" />
                <span>Pause anytime</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#16a34a] shrink-0" />
                <span>FSSAI Certified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#16a34a] shrink-0" />
                <span>Glass bottle refill</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleBookTrial}
              className={`w-full py-3.5 sm:py-4 px-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 ${
                isTrialBooked
                  ? 'bg-[#15803d] text-white shadow-green-700/25'
                  : 'bg-[#c1121f] hover:bg-[#a60f1b] text-white shadow-red-700/25 hover:shadow-red-700/35'
              }`}
            >
              {isTrialBooked ? (
                <>
                  <Check size={17} strokeWidth={2.5} />
                  <span>Trial Plan Configured!</span>
                </>
              ) : (
                <>
                  <span>Book 3-Day Risk-Free Trial</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
