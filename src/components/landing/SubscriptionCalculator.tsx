import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Calendar, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  CheckCircle2,
  Milk,
  Minus,
  Plus,
  Clock,
  Heart,
  MapPin,
  Navigation,
  X
} from 'lucide-react';

interface DairyOption {
  id: string;
  name: string;
  shortName: string;
  pricePerLiter: number;
  tag: string;
  fatNote: string;
  desc: string;
  badgeBg: string;
  badgeText: string;
  emoji: string;
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
    badgeBg: 'bg-red-50 border-red-200',
    badgeText: 'text-red-700',
    emoji: '🥛',
  },
  {
    id: 'cow-a2',
    name: 'A2 Desi Gir Cow Milk',
    shortName: 'A2 Gir Cow Milk',
    pricePerLiter: 78,
    tag: 'A2 Vedic Pure',
    fatNote: '4.5% A2 Protein',
    desc: 'Indigenous desi breed, easy to digest for all ages',
    badgeBg: 'bg-amber-50 border-amber-200',
    badgeText: 'text-amber-800',
    emoji: '🐄',
  },
  {
    id: 'buffalo-pure',
    name: 'Murrah Buffalo Milk',
    shortName: 'Murrah Buffalo',
    pricePerLiter: 70,
    tag: 'Thick & Creamy',
    fatNote: '7.5% Dense Fat',
    desc: 'Rich & thick, ideal for morning curd and paneer',
    badgeBg: 'bg-emerald-50 border-emerald-200',
    badgeText: 'text-emerald-800',
    emoji: '🐃',
  },
  {
    id: 'toned-slim',
    name: 'Toned Slim Light Milk',
    shortName: 'Toned Slim Milk',
    pricePerLiter: 52,
    tag: 'Low-Fat',
    fatNote: '3.0% Low Fat',
    desc: 'Homogenized light milk packed with calcium',
    badgeBg: 'bg-blue-50 border-blue-200',
    badgeText: 'text-blue-800',
    emoji: '🍃',
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
  const [selectedProduct, setSelectedProduct] = useState<DairyOption>(DAIRY_OPTIONS[0]); // Full cream default
  const [litersPerDay, setLitersPerDay] = useState<number>(2);
  const [frequency, setFrequency] = useState<'daily' | 'alternate' | 'weekdays'>('daily');
  const [deliveryLocation, setDeliveryLocation] = useState<string>('Civil Lines');
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [isTrialBooked, setIsTrialBooked] = useState<boolean>(false);

  const daysInMonth = frequency === 'daily' ? 30 : frequency === 'alternate' ? 15 : 22;
  const rawMonthlyCost = selectedProduct.pricePerLiter * litersPerDay * daysInMonth;
  // Subscriber gets 12% off + ₹0 delivery fee
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
    <div className="w-full bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#FFF7ED] rounded-[28px] sm:rounded-[36px] border border-amber-200/90 p-4 sm:p-7 lg:p-9 shadow-xl shadow-amber-950/5 relative overflow-hidden my-8 sm:my-12">
      {/* Decorative ambient gradients */}
      <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-red-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />

      {/* Header Badge & Title */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-red-100/90 text-red-700 border border-red-200/80 shadow-2xs mb-2.5">
          <Sparkles size={13} className="text-red-600 animate-pulse" />
          <span>Morning Dairy Planner</span>
        </div>

        <h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Build Your Daily Milk Plan
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-medium leading-relaxed max-w-lg mx-auto">
          Freshly milked at 4:30 AM & delivered to your doorstep before 6:30 AM. Choose your preferred milk, liters & schedule.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
        
        {/* Left: Customizer Steps */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          
          {/* STEP 1: Select Dairy Variety (Compact 2x2 Grid on Mobile) */}
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-amber-100 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Select Milk Variety</span>
              </span>
              <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                ₹{selectedProduct.pricePerLiter}/L
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {DAIRY_OPTIONS.map((option) => {
                const isSelected = selectedProduct.id === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => setSelectedProduct(option)}
                    className={`relative p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${
                      isSelected
                        ? 'border-red-600 bg-white shadow-md shadow-red-600/10 ring-2 ring-red-500/20'
                        : 'border-slate-200/80 bg-white/60 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    {/* Active Radio Dot */}
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="text-base sm:text-xl leading-none">{option.emoji}</span>
                      <span className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md border ${option.badgeBg} ${option.badgeText} truncate max-w-[85px] sm:max-w-none`}>
                        {option.tag}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                        {option.shortName}
                      </h4>
                      <div className="flex items-baseline justify-between gap-1 mt-1">
                        <span className="text-[10px] font-bold text-slate-400">
                          {option.fatNote}
                        </span>
                        <span className="text-xs sm:text-sm font-black text-red-600 font-mono">
                          ₹{option.pricePerLiter}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Choose Liters Per Day */}
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-amber-100 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Daily Requirement</span>
              </span>
              <span className="text-xs sm:text-sm font-black text-red-600 font-mono">
                {litersPerDay} Liter{litersPerDay > 1 ? 's' : ''} Daily
              </span>
            </div>

            {/* Quick Segmented Pill Stepper */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100/80 p-1.5 rounded-xl sm:rounded-2xl border border-slate-200/80">
              {[1, 2, 3, 4, 5].map((num) => {
                const isSelected = litersPerDay === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setLitersPerDay(num)}
                    className={`flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/25 scale-[1.02]'
                        : 'text-slate-700 hover:bg-white/70'
                    }`}
                  >
                    <span>{num}L</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Family Tip */}
            <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-medium text-slate-500 bg-amber-50/70 px-3 py-1.5 rounded-lg border border-amber-200/50">
              <span className="text-amber-600">💡</span>
              <span>{FAMILY_TIPS[litersPerDay] || FAMILY_TIPS[2]}</span>
            </div>
          </div>

          {/* STEP 3: Delivery Schedule */}
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-amber-100 shadow-xs">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Delivery Frequency</span>
            </span>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {[
                { id: 'daily', title: 'Everyday', tag: '30 Days' },
                { id: 'alternate', title: 'Alternate', tag: '15 Days' },
                { id: 'weekdays', title: 'Mon–Fri', tag: '22 Days' },
              ].map((freq) => {
                const isSelected = frequency === freq.id;
                return (
                  <button
                    key={freq.id}
                    type="button"
                    onClick={() => setFrequency(freq.id as any)}
                    className={`py-2 sm:py-3 px-1.5 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-xs'
                        : 'border-slate-200/80 bg-white text-slate-600 font-bold hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs sm:text-sm leading-snug">{freq.title}</span>
                    <span className="text-[9.5px] sm:text-[10px] text-slate-400 font-semibold">{freq.tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Delivery Location & Route Serviceability */}
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-amber-100 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">4</span>
                <span>Delivery Locality / Area</span>
              </span>
              {deliveryLocation ? (
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Route 6:15 AM Active
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-semibold">Enter Address</span>
              )}
            </div>

            {/* Location Input with Auto-Detect & Clear */}
            <div className="relative flex items-center">
              <MapPin size={16} className="absolute left-3 text-red-500 shrink-0 pointer-events-none" />
              <input
                type="text"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="Enter society, apartment, sector or pincode..."
                className="w-full pl-9 pr-24 sm:pr-28 py-2.5 sm:py-3 bg-white rounded-xl border-2 border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400 transition-all outline-hidden"
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                {deliveryLocation && (
                  <button
                    type="button"
                    onClick={() => setDeliveryLocation('')}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                    title="Clear location"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation}
                  className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-900 border border-amber-200 text-[10px] sm:text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                  title="Detect route via GPS"
                >
                  <Navigation size={11} className={isDetectingLocation ? 'animate-spin' : ''} />
                  <span>{isDetectingLocation ? 'Locating...' : 'Auto Detect'}</span>
                </button>
              </div>
            </div>

            {/* Quick Popular Zone Selectors */}
            <div className="mt-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Popular Delivery Routes:</span>
              </div>
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
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <span>📍 {zone}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Route Serviceability Notification */}
            {deliveryLocation ? (
              <div className="mt-2.5 p-2.5 bg-emerald-50/90 rounded-xl border border-emerald-200 flex items-start gap-2 text-emerald-950 text-[11px] font-medium leading-relaxed">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-emerald-900">Direct Route Confirmed:</span> Doorstep morning delivery available for <strong className="font-black text-emerald-950">{deliveryLocation}</strong>. Farm-fresh batch dispatched daily at 5:00 AM!
                </div>
              </div>
            ) : (
              <div className="mt-2.5 p-2 bg-amber-50/70 rounded-xl border border-amber-200 flex items-center gap-1.5 text-amber-800 text-[11px] font-medium">
                <MapPin size={13} className="text-amber-600 shrink-0" />
                <span>Type or tap your locality above to verify free morning doorstep delivery.</span>
              </div>
            )}
          </div>

        </div>

        {/* Right: Modern Price Summary & Checkout Card */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-amber-200/90 p-4 sm:p-6 lg:p-7 shadow-xl shadow-amber-950/5 relative overflow-hidden">
            
            {/* Top Savings Banner */}
            <div className="bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 text-white py-2 px-3 rounded-xl text-xs font-black mb-4 shadow-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-200 shrink-0" />
                <span>Subscription Savings</span>
              </div>
              <span className="bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-extrabold">
                -₹{discountAmount}/mo
              </span>
            </div>

            {/* Quick Specs List */}
            <div className="space-y-2 py-2 text-xs border-b border-slate-100">
              <div className="flex items-center justify-between text-slate-600">
                <span>Selected:</span>
                <strong className="text-slate-900 font-black text-right">{selectedProduct.shortName}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Rate & Quantity:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {litersPerDay}L × ₹{selectedProduct.pricePerLiter}/L ({daysInMonth} deliveries)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Morning Delivery:</span>
                <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  FREE by 6:15 AM
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin size={12} className="text-red-500 shrink-0" />
                  <span>Deliver To:</span>
                </span>
                <span className="font-extrabold text-slate-900 truncate max-w-[150px] sm:max-w-[190px] text-right">
                  {deliveryLocation || 'Select Locality'}
                </span>
              </div>
            </div>

            {/* Monthly Total Display */}
            <div className="pt-4 pb-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                  Estimated Monthly Total
                </span>
                <span className="text-[11px] font-bold text-emerald-700">
                  ~₹{perDayCost}/day
                </span>
              </div>

              <div className="flex items-baseline gap-2.5 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
                  ₹{finalMonthlyCost.toLocaleString('en-IN')}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-400 line-through">
                  ₹{rawMonthlyCost.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] sm:text-xs font-black text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                  12% OFF
                </span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-2 mb-5 text-[10px] sm:text-[11px] text-slate-600 font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span>Zero deposit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span>Pause anytime</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span>FSSAI Certified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span>Glass bottle refill</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleBookTrial}
              className={`w-full py-3.5 sm:py-4 px-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 ${
                isTrialBooked
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-gradient-to-r from-red-600 via-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white shadow-red-600/30 hover:shadow-red-600/40'
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
