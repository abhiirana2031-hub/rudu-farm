import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Tag, 
  Calendar, 
  Droplets, 
  Phone, 
  MessageCircle, 
  Truck, 
  Star, 
  X, 
  RefreshCw,
  ShoppingBag,
  Leaf,
  Crown,
  Users,
  ChevronRight,
  Gift,
  Zap,
  FlaskConical
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RuduLogo } from '../RuduLogo';
import { PurityBatchChecker } from '../landing/PurityBatchChecker';

interface DairyOption {
  id: string;
  name: string;
  shortName: string;
  pricePerLiter: number;
  fatNote: string;
  desc: string;
  img: string;
  badgeType: 'bestseller' | 'a2' | 'buffalo' | 'light';
}

const DAIRY_OPTIONS: DairyOption[] = [
  {
    id: 'full-cream',
    name: 'Full Cream Milk',
    shortName: 'Full Cream Milk',
    pricePerLiter: 66,
    fatNote: '6.0% Natural Fat',
    desc: 'Rich natural malai layer, perfect for daily chai, growing children & traditional homemade sweets.',
    img: '/images/rudu_milk_product.png',
    badgeType: 'bestseller',
  },
  {
    id: 'cow-a2',
    name: 'A2 Gir Cow Milk',
    shortName: 'A2 Gir Cow Milk',
    pricePerLiter: 78,
    fatNote: '4.5% A2 Protein',
    desc: 'Pure indigenous Gir cow milk, light on digestion, rich in natural beta-casein nutrients.',
    img: '/images/blog_a2_milk.jpg',
    badgeType: 'a2',
  },
  {
    id: 'murrah-buffalo',
    name: 'Murrah Buffalo',
    shortName: 'Murrah Buffalo',
    pricePerLiter: 70,
    fatNote: '7.5% Dense Fat',
    desc: 'Traditional high-density creamy buffalo milk, perfect for thick set curd and aromatic bilona ghee.',
    img: '/images/rudu_creamy_curd.jpg',
    badgeType: 'buffalo',
  },
  {
    id: 'toned-slim',
    name: 'Toned Slim Milk',
    shortName: 'Toned Slim Milk',
    pricePerLiter: 52,
    fatNote: '3.0% Low Fat',
    desc: 'Homogenized light milk with high proteins, designed for active fitness and heart wellness.',
    img: '/images/fresh_dairy_products.png',
    badgeType: 'light',
  },
];

const QUANTITY_OPTIONS = [1, 2, 3, 4, 5];

const SCHEDULE_OPTIONS = [
  { id: 'daily', label: 'Everyday', daysPerMonth: 30, discount: 10, note: '30 Days / Mo', icon: 'calendar' },
  { id: 'alternate', label: 'Alternate', daysPerMonth: 15, discount: 5, note: '15 Days / Mo', icon: 'clock' },
  { id: 'weekdays', label: 'Mon–Fri', daysPerMonth: 22, discount: 5, note: '22 Days / Mo', icon: 'calendar' },
];

interface DailyMilkPlannerPageProps {
  onBackToHome: () => void;
  onExploreProducts?: () => void;
  onOpenLogin?: (role?: 'farmer' | 'admin' | 'employee') => void;
}

export const DailyMilkPlannerPage: React.FC<DailyMilkPlannerPageProps> = ({
  onBackToHome,
  onExploreProducts,
}) => {
  const [selectedDairyId, setSelectedDairyId] = useState<string>('full-cream');
  const [quantityLiters, setQuantityLiters] = useState<number>(2);
  const [scheduleId, setScheduleId] = useState<string>('daily');
  const [deliverySlot, setDeliverySlot] = useState<'early' | 'prime'>('early');
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPct: number } | null>(null);
  const [promoError, setPromoError] = useState<string>('');

  // Checkout modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userPincode, setUserPincode] = useState('281401');
  const [paymentOption, setPaymentOption] = useState<'whatsapp' | 'cod' | 'upi'>('whatsapp');
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const selectedDairy = useMemo(
    () => DAIRY_OPTIONS.find((d) => d.id === selectedDairyId) || DAIRY_OPTIONS[0],
    [selectedDairyId]
  );

  const selectedSchedule = useMemo(
    () => SCHEDULE_OPTIONS.find((s) => s.id === scheduleId) || SCHEDULE_OPTIONS[0],
    [scheduleId]
  );

  // Billing calculations
  const totalMonthlyLiters = useMemo(
    () => Math.round(quantityLiters * selectedSchedule.daysPerMonth * 10) / 10,
    [quantityLiters, selectedSchedule]
  );

  const baseMonthlySpend = useMemo(
    () => Math.round(totalMonthlyLiters * selectedDairy.pricePerLiter),
    [totalMonthlyLiters, selectedDairy]
  );

  const planDiscountAmount = useMemo(
    () => Math.round(baseMonthlySpend * (selectedSchedule.discount / 100)),
    [baseMonthlySpend, selectedSchedule]
  );

  const promoDiscountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    const remaining = baseMonthlySpend - planDiscountAmount;
    return Math.round(remaining * (appliedPromo.discountPct / 100));
  }, [baseMonthlySpend, planDiscountAmount, appliedPromo]);

  const netMonthlyCost = useMemo(
    () => Math.max(0, baseMonthlySpend - planDiscountAmount - promoDiscountAmount),
    [baseMonthlySpend, planDiscountAmount, promoDiscountAmount]
  );

  const totalDiscount = planDiscountAmount + promoDiscountAmount;
  const effectiveDailyCost = Math.round(netMonthlyCost / selectedSchedule.daysPerMonth);

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError('Please enter a coupon code.');
      return;
    }
    if (code === 'RUDU25' || code === 'FRESH25') {
      setAppliedPromo({ code, discountPct: 25 });
      setPromoError('');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else if (code === 'WELCOME10') {
      setAppliedPromo({ code, discountPct: 10 });
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try RUDU25 for 25% OFF.');
    }
  };

  const handleApply25Offer = () => {
    setPromoCode('RUDU25');
    setAppliedPromo({ code: 'RUDU25', discountPct: 25 });
    setPromoError('');
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.75 } });
  };

  const getDynamicTip = (liters: number) => {
    switch (liters) {
      case 1:
        return 'Ideal for 1–2 members: Daily morning tea & coffee';
      case 2:
        return 'Most Popular: Perfect for 3–4 family members';
      case 3:
        return 'Great for growing families with children & daily curd';
      case 4:
        return 'Ideal for large households & frequent dairy cooking';
      case 5:
        return 'Ideal for joint families, daily paneer & ghee making';
      default:
        return `Custom volume: ${liters}L fresh dairy daily`;
    }
  };

  const handleConfirmSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim() || !userAddress.trim()) {
      alert('Please fill in all required fields to activate your subscription.');
      return;
    }

    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });

    if (paymentOption === 'whatsapp') {
      const msg = `*Rudu Farm Daily Milk Subscription Activated!* 🥛✨%0A%0A*Name:* ${userName}%0A*Phone:* ${userPhone}%0A*Address:* ${userAddress}, Pincode: ${userPincode}%0A*Variety:* ${selectedDairy.name}%0A*Quantity:* ${quantityLiters}L / day%0A*Schedule:* ${selectedSchedule.label} (${selectedSchedule.daysPerMonth} days/mo)%0A*Slot:* ${deliverySlot === 'early' ? '5:30 AM - 6:30 AM (Early Dawn)' : '6:30 AM - 7:30 AM (Morning Prime)'}%0A*Monthly Bill:* ₹${netMonthlyCost} (Saved ₹${totalDiscount})%0A%0APlease confirm my starting date from tomorrow morning!`;
      window.open(`https://wa.me/919411985444?text=${msg}`, '_blank');
    }

    setOrderConfirmed(true);
  };

  return (
    <div className="daily-milk-planner-page bg-[#FBF9F5] min-h-screen text-[#1A202C] font-sans antialiased">
      
      {/* ── Top Navigation Bar ── */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#EAE4D9] sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={onBackToHome}
              className="flex items-center gap-1.5 text-xs font-bold text-[#4B5563] hover:text-[#144A29] transition-colors py-1.5 px-3 rounded-full hover:bg-emerald-50 cursor-pointer border border-[#E5E7EB]"
              title="Return to Main Website"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>

            <div className="h-4 w-[1px] bg-slate-200" />

            <div className="cursor-pointer" onClick={onBackToHome}>
              <RuduLogo height={32} className="landing-logo-img sm:h-[36px]" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onExploreProducts && (
              <button
                onClick={onExploreProducts}
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
              >
                <ShoppingBag size={13} />
                <span>All Products</span>
              </button>
            )}

            <a 
              href="https://wa.me/919411985444?text=Hello%20Rudu%20Farm,%20I%20need%20assistance%20setting%20up%20my%20Daily%20Milk%20Planner%20subscription."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#144A29] bg-[#EAF6ED] border border-[#C6E7D1] px-3 py-1.5 rounded-full hover:bg-[#DDF0E3] transition-all shadow-2xs"
            >
              <MessageCircle size={13} className="text-[#144A29]" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Daily Milk Delivery System Hero Header ── */}
      <section className="bg-gradient-to-b from-white via-white/90 to-[#FBF9F5] border-b border-[#EDE8DF] pt-6 pb-6 sm:pt-10 sm:pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center gap-1.5 bg-[#EAF6ED] border border-[#C6E7D1] text-[#144A29] px-3.5 py-1 rounded-full text-xs font-black tracking-wide uppercase mb-3 shadow-2xs">
            <Sparkles size={13} className="text-[#144A29]" />
            <span>Smart Morning Milk Delivery System</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight leading-[1.15] mb-2.5 sm:mb-3">
            Pure Farm Fresh Milk, <span className="text-[#144A29]">Delivered Every Sunrise</span>
          </h1>

          <p className="text-xs sm:text-base text-[#4B5563] max-w-2xl mx-auto leading-relaxed font-medium mb-5 sm:mb-7">
            Milked fresh at 4:00 AM from healthy local herds, verified across 26 lab purity checks, 
            rapidly chilled to 4°C, and delivered to your doorstep before 6:30 AM every morning.
          </p>

          {/* 4 Feature Badges Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto">
            <div className="bg-white p-2.5 sm:p-3.5 rounded-2xl border border-[#EDE8DF] shadow-xs flex items-center gap-2.5 sm:gap-3 text-left">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EAF6ED] text-[#144A29] flex items-center justify-center font-black flex-shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-[#111827] leading-tight">6:00 AM Delivery</h4>
                <p className="text-[10px] sm:text-[11px] text-[#6B7280] font-medium">Before morning tea</p>
              </div>
            </div>

            <div className="bg-white p-2.5 sm:p-3.5 rounded-2xl border border-[#EDE8DF] shadow-xs flex items-center gap-2.5 sm:gap-3 text-left">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EAF6ED] text-[#144A29] flex items-center justify-center font-black flex-shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-[#111827] leading-tight">26 Lab Tests</h4>
                <p className="text-[10px] sm:text-[11px] text-[#6B7280] font-medium">Zero adulteration</p>
              </div>
            </div>

            <div className="bg-white p-2.5 sm:p-3.5 rounded-2xl border border-[#EDE8DF] shadow-xs flex items-center gap-2.5 sm:gap-3 text-left">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EAF6ED] text-[#144A29] flex items-center justify-center font-black flex-shrink-0">
                <Droplets size={16} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-[#111827] leading-tight">4°C Cold Chain</h4>
                <p className="text-[10px] sm:text-[11px] text-[#6B7280] font-medium">Naturally preserved</p>
              </div>
            </div>

            <div className="bg-white p-2.5 sm:p-3.5 rounded-2xl border border-[#EDE8DF] shadow-xs flex items-center gap-2.5 sm:gap-3 text-left">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EAF6ED] text-[#144A29] flex items-center justify-center font-black flex-shrink-0">
                <RefreshCw size={16} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-[#111827] leading-tight">1-Tap Pause</h4>
                <p className="text-[10px] sm:text-[11px] text-[#6B7280] font-medium">Flexible WhatsApp</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Main Planner Section ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Interactive Cards 1, 2, 3 + Offer Bar (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            
            {/* ── CARD 1: Select Milk Variety ── */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EDE8DF] shadow-xs">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#144A29] text-white font-extrabold flex items-center justify-center text-sm flex-shrink-0 shadow-xs">
                    1
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-[#111827] tracking-tight leading-none">
                      Select Milk Variety
                    </h2>
                    <p className="text-[11px] sm:text-xs text-[#6B7280] font-medium mt-1">
                      Pure | Fresh | Natural
                    </p>
                  </div>
                </div>

                {/* Selected Rate Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAF6ED] text-[#1B5E20] text-xs sm:text-sm font-black border border-[#C6E7D1]/50 shadow-2xs">
                  <Leaf size={14} className="fill-[#1B5E20] text-[#1B5E20]" />
                  <span>₹{selectedDairy.pricePerLiter}/L</span>
                </div>
              </div>

              {/* 2x2 Grid matching Image 2 */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {DAIRY_OPTIONS.map((opt) => {
                  const isSelected = selectedDairyId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedDairyId(opt.id)}
                      className={`rounded-2xl p-2 sm:p-2.5 transition-all cursor-pointer bg-white relative flex flex-col justify-between ${
                        isSelected 
                          ? 'border-2 border-[#144A29] shadow-sm ring-1 ring-[#144A29]/15' 
                          : 'border border-[#E5E7EB] hover:border-[#144A29]/50 hover:shadow-xs'
                      }`}
                    >
                      {/* Image Frame */}
                      <div className="w-full h-24 sm:h-28 rounded-xl overflow-hidden relative mb-2 bg-[#F3F4F6] border border-slate-100">
                        <img 
                          src={opt.img} 
                          alt={opt.name} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />

                        {/* Top-Right Badge on Image */}
                        {opt.badgeType === 'bestseller' && (
                          <div className="absolute top-1.5 right-1.5 bg-[#144A29] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Crown size={10} className="text-amber-300 fill-amber-300" />
                            <span>Best Seller</span>
                          </div>
                        )}

                        {opt.badgeType === 'a2' && (
                          <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                            <span className="bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                              A2
                            </span>
                            <span className="w-5 h-5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-[10px] flex items-center justify-center">
                              🐄
                            </span>
                          </div>
                        )}

                        {opt.badgeType === 'buffalo' && (
                          <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#144A29] text-white flex items-center justify-center text-xs shadow-sm" title="Murrah Breed Buffalo">
                            🐃
                          </div>
                        )}

                        {opt.badgeType === 'light' && (
                          <div className="absolute top-1.5 right-1.5 bg-[#0284C7] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Leaf size={10} className="fill-white" />
                            <span>Light</span>
                          </div>
                        )}
                      </div>

                      {/* Product Titles & Info */}
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-[#111827] truncate">
                          {opt.shortName}
                        </h4>
                        
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] sm:text-[11px] text-[#6B7280] font-medium truncate">
                            {opt.fatNote}
                          </span>
                          <span className="text-xs sm:text-sm font-black text-[#111827]">
                            ₹{opt.pricePerLiter}/L
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>


            {/* ── CARD 2: Daily Requirement ── */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EDE8DF] shadow-xs">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#144A29] text-white font-extrabold flex items-center justify-center text-sm flex-shrink-0 shadow-xs">
                    2
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-[#111827] tracking-tight leading-none">
                    Daily Requirement
                  </h2>
                </div>

                {/* Liters Daily Pill */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAF6ED] text-[#1B5E20] text-xs sm:text-sm font-black border border-[#C6E7D1]/50 shadow-2xs">
                  <Droplets size={14} className="fill-[#1B5E20] text-[#1B5E20]" />
                  <span>{quantityLiters} Liter{quantityLiters > 1 ? 's' : ''} Daily</span>
                </div>
              </div>

              {/* Segmented 1L - 5L Bar */}
              <div className="bg-[#F3F4F6] rounded-2xl p-1.5 flex items-center justify-between gap-1">
                {QUANTITY_OPTIONS.map((val) => {
                  const isSelected = quantityLiters === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setQuantityLiters(val)}
                      className={`flex-1 py-2 sm:py-2.5 text-center rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#144A29] text-white shadow-sm'
                          : 'text-[#374151] hover:text-[#111827] hover:bg-black/5'
                      }`}
                    >
                      {val}L
                    </button>
                  );
                })}
              </div>

              {/* Recommendation Tip Banner */}
              <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-3 sm:p-3.5 flex items-center justify-between mt-3.5 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#84CC16]/20 text-[#4D7C0F] flex items-center justify-center flex-shrink-0 text-sm">
                    💡
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#1F2937] truncate">
                    {getDynamicTip(quantityLiters)}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[#4B5563] ml-2 flex-shrink-0">
                  <Users size={16} />
                  <ChevronRight size={16} />
                </div>
              </div>

            </div>


            {/* ── CARD 3: Delivery Frequency ── */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EDE8DF] shadow-xs">
              
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#144A29] text-white font-extrabold flex items-center justify-center text-sm flex-shrink-0 shadow-xs">
                  3
                </div>
                <h2 className="text-base sm:text-lg font-black text-[#111827] tracking-tight leading-none">
                  Delivery Frequency
                </h2>
              </div>

              {/* 3 Frequency Options Row */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {SCHEDULE_OPTIONS.map((sched) => {
                  const isSelected = scheduleId === sched.id;
                  return (
                    <div
                      key={sched.id}
                      onClick={() => setScheduleId(sched.id)}
                      className={`rounded-2xl p-3 sm:p-3.5 cursor-pointer relative transition-all text-left flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#F0FDF4] border-2 border-[#144A29] shadow-xs'
                          : 'bg-white border border-[#E5E7EB] hover:border-[#144A29]/50 hover:bg-slate-50'
                      }`}
                    >
                      {/* Top Checkmark if selected */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#144A29] text-white flex items-center justify-center shadow-2xs">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                        {sched.icon === 'clock' ? (
                          <Clock size={16} className={isSelected ? 'text-[#144A29]' : 'text-[#6B7280]'} />
                        ) : (
                          <Calendar size={16} className={isSelected ? 'text-[#144A29]' : 'text-[#6B7280]'} />
                        )}
                        <span className="font-bold text-xs sm:text-sm text-[#111827]">
                          {sched.label}
                        </span>
                      </div>

                      <span className="text-[10px] sm:text-xs text-[#6B7280] font-medium block mt-0.5">
                        {sched.note}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Morning Time Slots */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Morning Delivery Window
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDeliverySlot('early')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-2 ${
                      deliverySlot === 'early'
                        ? 'bg-[#EAF6ED] border-[#144A29] text-[#144A29] font-bold'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Clock size={14} className="text-[#144A29] flex-shrink-0" />
                    <div>
                      <span className="text-xs font-black block">Early Dawn Slot</span>
                      <span className="text-[10px] opacity-80 block">5:30 AM – 6:30 AM</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliverySlot('prime')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-2 ${
                      deliverySlot === 'prime'
                        ? 'bg-[#EAF6ED] border-[#144A29] text-[#144A29] font-bold'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Clock size={14} className="text-[#144A29] flex-shrink-0" />
                    <div>
                      <span className="text-xs font-black block">Morning Prime</span>
                      <span className="text-[10px] opacity-80 block">6:30 AM – 7:30 AM</span>
                    </div>
                  </button>
                </div>
              </div>

            </div>


            {/* ── CARD 4: 25% OFF Offer Banner (matching Image 2 bottom) ── */}
            <div 
              onClick={handleApply25Offer}
              className="bg-gradient-to-r from-[#144A29] via-[#1A4D2E] to-[#2E6B34] text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 flex items-center justify-between shadow-lg relative overflow-hidden cursor-pointer hover:shadow-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-xs">
                  <Gift size={20} className="text-white" />
                </div>
                <div>
                  <span className="font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-1.5">
                    25% OFF Offer 
                    <ChevronRight size={16} className="text-emerald-300 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-emerald-100 font-medium block">
                    Use code RUDU25 for first monthly order
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs font-extrabold text-white border border-white/20">
                <Leaf size={13} className="text-emerald-300 fill-emerald-300" />
                <span>{appliedPromo?.code === 'RUDU25' ? 'Applied ✓' : 'Tap to Apply'}</span>
              </div>
            </div>

          </div>


          {/* ── Right Column: Live Bill Summary & Instant Checkout Card (5 cols on desktop) ── */}
          <div className="lg:col-span-5 sticky top-20">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EDE8DF] shadow-xl overflow-hidden relative">
              
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 bg-[#EAF6ED] text-[#1B5E20] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-[#C6E7D1]">
                  <Sparkles size={11} />
                  Live Bill Calculator
                </span>
                <span className="text-xs text-slate-400 font-bold">4°C Cold Chain</span>
              </div>

              <h3 className="text-lg font-black text-[#111827]">
                Subscription Plan Summary
              </h3>
              <p className="text-xs text-[#6B7280] font-medium mb-4">
                Freshly milked & chilled delivery to your doorstep
              </p>

              {/* Chosen plan preview card */}
              <div className="bg-[#FAF8F5] rounded-2xl p-3.5 border border-[#EDE8DF] mb-4 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7280] font-medium">Selected Milk:</span>
                  <strong className="text-[#111827] font-bold">{selectedDairy.shortName}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7280] font-medium">Daily Quantity:</span>
                  <strong className="text-[#111827] font-bold">{quantityLiters} Liter(s) / day</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7280] font-medium">Frequency:</span>
                  <strong className="text-[#144A29] font-bold">{selectedSchedule.label} ({selectedSchedule.daysPerMonth} deliveries)</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7280] font-medium">Morning Window:</span>
                  <strong className="text-[#111827] font-bold">
                    {deliverySlot === 'early' ? '5:30 – 6:30 AM' : '6:30 – 7:30 AM'}
                  </strong>
                </div>
              </div>

              {/* Promo Coupon Box */}
              <div className="mb-4">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Have a Coupon? (Code: <strong className="text-[#144A29]">RUDU25</strong>)
                </label>
                <div className="flex gap-1.5">
                  <input 
                    type="text"
                    placeholder="Enter coupon code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-[#FAF8F5] border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-xs font-bold uppercase focus:outline-none focus:border-[#144A29]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="bg-[#144A29] hover:bg-[#0E361D] text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-[11px] text-emerald-700 font-bold mt-1.5 flex items-center gap-1">
                    <Check size={12} strokeWidth={3} /> Coupon {appliedPromo.code} applied (-{appliedPromo.discountPct}%)!
                  </p>
                )}
                {promoError && (
                  <p className="text-[11px] text-red-600 font-bold mt-1.5">
                    {promoError}
                  </p>
                )}
              </div>

              {/* Bill Line Items */}
              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs mb-5">
                <div className="flex justify-between text-[#4B5563]">
                  <span>Base Monthly Bill ({totalMonthlyLiters} L)</span>
                  <span className="font-semibold text-slate-800">₹{baseMonthlySpend}</span>
                </div>

                <div className="flex justify-between text-[#1B5E20] font-semibold">
                  <span>Subscriber Discount ({selectedSchedule.discount}%)</span>
                  <span>-₹{planDiscountAmount}</span>
                </div>

                {promoDiscountAmount > 0 && (
                  <div className="flex justify-between text-[#1B5E20] font-semibold">
                    <span>Special Coupon Discount</span>
                    <span>-₹{promoDiscountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#1B5E20] font-semibold">
                  <span>4°C Chilled Storage</span>
                  <span>FREE</span>
                </div>

                <div className="flex justify-between text-[#1B5E20] font-semibold">
                  <span>6:00 AM Punctual Doorstep Delivery</span>
                  <span>FREE</span>
                </div>

                {/* Total Net */}
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-black text-[#111827] block">Total Monthly Cost:</span>
                    <span className="text-[10px] text-slate-500 font-bold">≈ ₹{effectiveDailyCost} / day</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black text-[#144A29]">
                      ₹{netMonthlyCost}
                    </span>
                    {totalDiscount > 0 && (
                      <span className="text-[10px] text-emerald-700 font-extrabold block">
                        Saved ₹{totalDiscount}!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => { setIsCheckoutOpen(true); setOrderConfirmed(false); }}
                  className="w-full bg-[#144A29] hover:bg-[#0E361D] text-white py-3.5 px-5 rounded-2xl font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Zap size={16} />
                  <span>Start Morning Delivery</span>
                  <ArrowRight size={16} />
                </button>

                <a
                  href={`https://wa.me/919411985444?text=${encodeURIComponent(`Hello Rudu Farm! 🥛 I want to subscribe to ${selectedDairy.shortName} (${quantityLiters}L daily). Monthly cost ₹${netMonthlyCost}. Please confirm!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#EAF6ED] hover:bg-[#DDF0E3] text-[#144A29] border border-[#C6E7D1] py-3 px-5 rounded-2xl font-extrabold text-xs shadow-2xs transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={15} />
                  <span>Instant 1-Click Order on WhatsApp</span>
                </a>
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* ── Live Purity & Transparency Lab Section ── */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#FBF9F5] via-white to-[#FBF9F5] border-t border-[#EDE8DF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <PurityBatchChecker />
        </div>
      </section>

      {/* ── Quality Guarantee Banner ── */}
      <section className="bg-white border-y border-[#EDE8DF] py-10 mt-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-[#111827]">
              The Rudu Dairy Subscription Guarantee
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Zero compromises on purity, farm hygiene, and morning punctuality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-[#FBF9F5] p-5 rounded-2xl border border-[#EDE8DF]">
              <div className="w-10 h-10 rounded-full bg-[#EAF6ED] text-[#144A29] flex items-center justify-center font-black mx-auto mb-3">
                <Clock size={20} />
              </div>
              <h4 className="text-sm font-black text-[#111827] mb-1">Delivered Before 6:30 AM</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Guaranteed early morning delivery every single day before your tea kettle boils.
              </p>
            </div>

            <div className="bg-[#FBF9F5] p-5 rounded-2xl border border-[#EDE8DF]">
              <div className="w-10 h-10 rounded-full bg-[#EAF6ED] text-[#144A29] flex items-center justify-center font-black mx-auto mb-3">
                <ShieldCheck size={20} />
              </div>
              <h4 className="text-sm font-black text-[#111827] mb-1">26 Daily Lab Checks</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every batch is lab-screened for antibiotics, adulterants, urea, water and neutralizers.
              </p>
            </div>

            <div className="bg-[#FBF9F5] p-5 rounded-2xl border border-[#EDE8DF]">
              <div className="w-10 h-10 rounded-full bg-[#EAF6ED] text-[#144A29] flex items-center justify-center font-black mx-auto mb-3">
                <RefreshCw size={20} />
              </div>
              <h4 className="text-sm font-black text-[#111827] mb-1">100% Flexible Pausing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Traveling or away? Simply send a quick WhatsApp message to pause with zero penalties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#111827] text-white py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <RuduLogo height={28} className="filter brightness-0 invert" />
            <span className="text-xs text-slate-400 font-medium">
              © {new Date().getFullYear()} Rudu Dairy & Farm Management. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <button onClick={onBackToHome} className="hover:text-white cursor-pointer">
              Home
            </button>
            {onExploreProducts && (
              <button onClick={onExploreProducts} className="hover:text-white cursor-pointer">
                Products
              </button>
            )}
            <a href="tel:+919411985444" className="hover:text-white flex items-center gap-1">
              <Phone size={13} />
              <span>+91 94119 85444</span>
            </a>
          </div>
        </div>
      </footer>


      {/* ─────────────────────────────────────────────────────────────
          SUBSCRIPTION CHECKOUT MODAL
      ─────────────────────────────────────────────────────────────── */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 my-auto animate-in fade-in zoom-in duration-200">
            
            <div className="bg-[#144A29] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="stroke-[2.5]" />
                <h3 className="text-base font-black">
                  {orderConfirmed ? 'Subscription Active!' : 'Confirm Daily Milk Subscription'}
                </h3>
              </div>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {orderConfirmed ? (
              <div className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#EAF6ED] text-[#144A29] flex items-center justify-center mx-auto mb-4 font-black">
                  <CheckCircle2 size={36} />
                </div>

                <h4 className="text-xl font-black text-[#111827] mb-1">
                  Subscription Confirmed!
                </h4>
                <p className="text-xs text-[#4B5563] leading-relaxed mb-5 max-w-sm mx-auto">
                  Thank you, <strong>{userName}</strong>! Your daily delivery of <strong>{quantityLiters}L {selectedDairy.shortName}</strong> ({selectedSchedule.label}) has been scheduled.
                </p>

                <div className="bg-[#FBF9F5] rounded-2xl p-4 border border-[#EDE8DF] mb-6 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] font-bold">First Delivery:</span>
                    <strong className="text-[#111827]">Tomorrow Morning (by 6:30 AM)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] font-bold">Monthly Bill:</span>
                    <strong className="text-[#144A29] font-black">₹{netMonthlyCost}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] font-bold">Delivery Address:</span>
                    <strong className="text-[#111827] truncate max-w-[200px]">{userAddress}</strong>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsCheckoutOpen(false)}
                    className="flex-1 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
                  >
                    Close Window
                  </button>
                  <a
                    href="https://wa.me/919411985444"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-full bg-[#144A29] hover:bg-[#0E361D] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmSubscription} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                
                {/* Plan Summary */}
                <div className="bg-[#FBF9F5] p-3.5 rounded-2xl border border-[#EDE8DF] flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-[#111827]">{selectedDairy.shortName}</h4>
                    <p className="text-xs text-[#6B7280] font-semibold">{quantityLiters}L • {selectedSchedule.label} • {deliverySlot === 'early' ? '5:30-6:30 AM' : '6:30-7:30 AM'}</p>
                  </div>
                  <span className="text-lg font-black text-[#144A29]">₹{netMonthlyCost}<span className="text-[10px] text-slate-500 font-bold">/mo</span></span>
                </div>

                {/* Form fields */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#4B5563] block mb-1">
                      Full Name *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-[#144A29]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#4B5563] block mb-1">
                        Phone Number *
                      </label>
                      <input 
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-[#144A29]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#4B5563] block mb-1">
                        Pincode *
                      </label>
                      <input 
                        type="text"
                        required
                        value={userPincode}
                        onChange={(e) => setUserPincode(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-[#144A29]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#4B5563] block mb-1">
                      Delivery Address (House/Flat, Street, Area) *
                    </label>
                    <textarea 
                      rows={2}
                      required
                      placeholder="e.g. Flat 302, Krishna Heights, Radhika Vihar, Mathura"
                      value={userAddress}
                      onChange={(e) => setUserAddress(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-[#144A29]"
                    />
                  </div>
                </div>

                {/* Payment Option */}
                <div>
                  <label className="text-[11px] font-bold text-[#4B5563] block mb-2">
                    Payment Preference:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentOption('whatsapp')}
                      className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                        paymentOption === 'whatsapp'
                          ? 'bg-[#EAF6ED] border-[#144A29] text-[#144A29] font-black'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="text-xs block">WhatsApp</span>
                      <span className="text-[9px] opacity-80 block">Confirm on chat</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentOption('cod')}
                      className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                        paymentOption === 'cod'
                          ? 'bg-[#EAF6ED] border-[#144A29] text-[#144A29] font-black'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="text-xs block">Cash Postpaid</span>
                      <span className="text-[9px] opacity-80 block">Monthly settlement</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentOption('upi')}
                      className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                        paymentOption === 'upi'
                          ? 'bg-[#EAF6ED] border-[#144A29] text-[#144A29] font-black'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="text-xs block">UPI / QR</span>
                      <span className="text-[9px] opacity-80 block">GPay / PhonePe</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#144A29] hover:bg-[#0E361D] text-white py-3.5 px-6 rounded-2xl font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>Confirm & Activate Subscription</span>
                    <ArrowRight size={16} />
                  </button>
                  <p className="text-[10px] text-center text-slate-400 font-medium mt-2">
                    🔒 No lock-in period • Pause or modify anytime with 1-click on WhatsApp
                  </p>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
