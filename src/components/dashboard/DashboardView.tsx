import React from 'react';
import {
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Droplets,
  IndianRupee,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThreeDIcons, SparklineMini } from '../common/Illustrations';
import { AdminDashboard } from './AdminDashboard';
import { OperatorDashboard } from './OperatorDashboard';
import { Translations } from '../../data/translations';

/** Returns the greeting key and emoji based on the current hour */
function getGreeting(t: Translations): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: t.goodMorning, emoji: '🌅' };
  if (hour >= 12 && hour < 13) return { text: t.goodNoon, emoji: '☀️' };
  if (hour >= 13 && hour < 17) return { text: t.goodAfternoon, emoji: '🌤️' };
  if (hour >= 17 && hour < 21) return { text: t.goodEvening, emoji: '🌇' };
  return { text: t.goodNight, emoji: '🌙' };
}

export const DashboardView: React.FC = () => {
  const {
    userRole,
    t,
    currentFarmer,
    milkEntries = [],
    payouts = [],
    setCurrentTab,
    setSelectedEntryForSlip,
    setIsVideoModalOpen,
  } = useApp();

  if (userRole === 'admin') {
    return <AdminDashboard />;
  }

  if (userRole === 'employee') {
    return <OperatorDashboard />;
  }

  // Farmer's milk entries
  const farmerEntries = currentFarmer?.id
    ? milkEntries.filter(
        (e) => e.farmerId === currentFarmer.id || e.farmerCode === currentFarmer.farmerCode
      )
    : milkEntries;

  const calculatedMilk = farmerEntries.reduce(
    (sum, e) => sum + (Number(e.quantityLiters) || 0),
    0
  );
  const totalMilkSupplied = calculatedMilk > 0
    ? calculatedMilk
    : (Number((currentFarmer as any)?.totalSupplied) || Number((currentFarmer as any)?.thisMonthSupplied) || 0);

  // Farmer's payouts
  const farmerPayouts = currentFarmer?.id
    ? payouts.filter(
        (p) => p.farmerId === currentFarmer.id || p.farmerCode === currentFarmer.farmerCode
      )
    : payouts;

  const calculatedPayouts = farmerPayouts
    .filter((p) => p.status === 'Cleared')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const totalFarmerPayouts = calculatedPayouts > 0
    ? calculatedPayouts
    : (Number((currentFarmer as any)?.totalEarned) || 0);

  const pendingFarmerPayouts = farmerPayouts
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const pendingBalance = currentFarmer?.pendingBalance ?? (Number((currentFarmer as any)?.pendingPayout) || pendingFarmerPayouts);

  // Today's collection entries
  const todayStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const todayEntries = farmerEntries.filter((e) => e.date === todayStr);
  const todayMilk = todayEntries.length > 0
    ? todayEntries.reduce((sum, e) => sum + (Number(e.quantityLiters) || 0), 0)
    : (farmerEntries.slice(0, 2).reduce((sum, e) => sum + (Number(e.quantityLiters) || 0), 0));
  const todayAmount = todayEntries.length > 0
    ? todayEntries.reduce((sum, e) => sum + (Number(e.totalAmount) || 0), 0)
    : (farmerEntries.slice(0, 2).reduce((sum, e) => sum + (Number(e.totalAmount) || 0), 0));
  const todayCount = todayEntries.length > 0 ? todayEntries.length : Math.min(farmerEntries.length, 2);

  // Recent 4 entries for the bottom list
  const recentEntries = farmerEntries.slice(0, 4);

  return (
    <div className="space-y-4 sm:space-y-5 pb-24 max-w-5xl mx-auto px-3 sm:px-4 pt-2">
      {/* 1. Good Morning Greeting Card with Farm Landscape Blend */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-100/90 via-emerald-50 to-teal-50/80 p-5 sm:p-7 border border-emerald-200/70 shadow-xs">
        {/* Subtle decorative elements */}
        <div className="absolute right-0 bottom-0 top-0 opacity-15 pointer-events-none w-1/3">
          <svg viewBox="0 0 300 120" fill="none" className="h-full w-auto">
            <path d="M0 100 Q 80 50, 180 80 T 300 60 L 300 120 L 0 120 Z" fill="#047857" />
            <rect x="200" y="55" width="40" height="25" rx="2" fill="#064E3B" />
            <polygon points="195,55 220,38 245,55" fill="#064E3B" />
          </svg>
        </div>

        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
            {(() => { const g = getGreeting(t); return `${g.text}, ${currentFarmer?.name || 'Farmer'}! ${g.emoji}`; })()}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800/80 font-medium">
            {t.farmStatus}
          </p>
        </div>
      </div>

      {/* 2. Top 4 Stat Cards in 2x2 Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Milk Supplied */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100/80 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5 fill-sky-500 stroke-sky-600" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-700 leading-tight">
              {t.totalMilkSupplied}
            </span>
          </div>

          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight font-mono">
              {totalMilkSupplied.toLocaleString('en-IN')} L
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{farmerEntries.length} {t.entriesLogged}</span>
            </div>
            <SparklineMini className="w-14 h-5 text-emerald-500 hidden sm:block" />
          </div>
        </div>

        {/* Card 2: Member Since */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100/80 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-700 leading-tight">
              {t.memberSince}
            </span>
          </div>

          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
              {currentFarmer?.memberSince || 'Member'}
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100 text-[11px] font-bold text-rose-600">
            <span>❤️</span>
            <span>{t.thankYou}</span>
          </div>
        </div>

        {/* Card 3: Total Payouts */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100/80 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <IndianRupee className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-700 leading-tight">
              {t.totalPayouts}
            </span>
          </div>

          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight font-mono">
              ₹{totalFarmerPayouts.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100 text-[11px] font-bold text-emerald-700">
            <span>💰</span>
            <span>{t.settledTransactions}</span>
          </div>
        </div>

        {/* Card 4: Pending Balance */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100/80 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-700 leading-tight">
              {t.pendingBalance}
            </span>
          </div>

          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight font-mono">
              ₹{Number(pendingBalance || 0).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100 text-[11px] font-bold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{pendingBalance === 0 ? t.allClear : 'Pending Settlement'}</span>
          </div>
        </div>
      </div>

      {/* 3. "TODAY'S COLLECTION" Card */}
      <div className="rounded-3xl bg-white border-2 border-emerald-200/90 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: 3D Milk Can & Metrics */}
        <div className="flex items-center gap-4 sm:gap-5 w-full md:w-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
            <ThreeDIcons.MilkCanSplash3D className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider block">
              {t.todaysCollection}
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight font-mono">
                {todayMilk} L
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-xs sm:text-sm font-mono">
                ₹{todayAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-xs text-gray-700 font-medium">
              {todayCount} {todayCount === 1 ? 'Entry' : 'Entries'} • {t.lastUpdated}
            </p>
          </div>
        </div>

        {/* Right Side: Growth Chart & View Details Button */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
          <div className="hidden sm:block w-20 h-14">
            <ThreeDIcons.GrowthChart3D className="w-full h-full" />
          </div>

          <button
            onClick={() => setCurrentTab('collection')}
            className="w-full md:w-auto px-5 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs whitespace-nowrap"
          >
            <span>{t.viewDetails}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. 4 Feature Action Cards in 2x2 Grid with 3D Illustrations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Feature 1: Milk Collection Log */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-100/90 shadow-xs flex items-center justify-between gap-4 hover:border-emerald-300 transition-all group">
          <div className="space-y-2 flex-1">
            <h2 className="text-base font-bold text-gray-950 tracking-tight">
              {t.milkCollectionLog}
            </h2>
            <p className="text-xs text-gray-700 leading-snug">
              {t.milkCollectionDesc}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentTab('collection')}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
              >
                <span>{t.viewLogs}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
            <ThreeDIcons.MilkCanSplash3D className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
        </div>

        {/* Feature 2: Payouts & Settlements */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-100/90 shadow-xs flex items-center justify-between gap-4 hover:border-emerald-300 transition-all group">
          <div className="space-y-2 flex-1">
            <h2 className="text-base font-bold text-gray-950 tracking-tight">
              {t.payoutsSettlement}
            </h2>
            <p className="text-xs text-gray-700 leading-snug">
              {t.payoutsSettlementDesc}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentTab('payouts')}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
              >
                <span>{t.viewPayouts}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
            <ThreeDIcons.LeatherWallet3D className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
        </div>

        {/* Feature 3: Milk Supply Ledger */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-100/90 shadow-xs flex items-center justify-between gap-4 hover:border-emerald-300 transition-all group">
          <div className="space-y-2 flex-1">
            <h2 className="text-base font-bold text-gray-950 tracking-tight">
              {t.milkSupplyLedger}
            </h2>
            <p className="text-xs text-gray-700 leading-snug">
              {t.milkSupplyLedgerDesc}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentTab('ledger')}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
              >
                <span>{t.viewLedger}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
            <ThreeDIcons.ClipboardLedger3D className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
        </div>

        {/* Feature 4: Bank & Profile Details */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-100/90 shadow-xs flex items-center justify-between gap-4 hover:border-emerald-300 transition-all group">
          <div className="space-y-2 flex-1">
            <h2 className="text-base font-bold text-gray-950 tracking-tight">
              {t.bankProfileDetails}
            </h2>
            <p className="text-xs text-gray-700 leading-snug">
              {t.bankProfileDesc}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentTab('profile')}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
              >
                <span>{t.manageProfile}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
            <ThreeDIcons.BankBuilding3D className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
        </div>
      </div>

      {/* 5. "Who We Are" Carousel / Video Card matching Image 5 */}
      <div className="rounded-3xl bg-white border border-emerald-100/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Brand Story */}
        <div className="space-y-2 flex-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <span>🌿</span>
            <span>{t.whoWeAre}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-emerald-900 tracking-tight leading-snug">
            {t.whoWeAreHeading}
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed max-w-lg">
            {t.whoWeAreDesc}
          </p>
        </div>

        {/* Right Side: Farm Sunrise Video Card with Play Button */}
        <div className="w-full md:w-64 flex flex-col items-center gap-2.5">
          <div
            onClick={() => setIsVideoModalOpen(true)}
            className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-tr from-amber-700 via-emerald-800 to-amber-500 shadow-sm cursor-pointer group flex items-center justify-center"
          >
            {/* Pastoral Illustration Backdrop */}
            <div className="absolute inset-0 bg-cover bg-center opacity-85 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
              <svg viewBox="0 0 240 135" fill="none" className="w-full h-full object-cover">
                <defs>
                  <radialGradient id="videoSun" cx="120" cy="40" r="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FDE047" />
                    <stop offset="0.7" stopColor="#F59E0B" />
                    <stop offset="1" stopColor="#047857" />
                  </radialGradient>
                </defs>
                <circle cx="120" cy="40" r="45" fill="url(#videoSun)" />
                <path d="M0 90 Q 60 70, 120 85 T 240 75 L 240 135 L 0 135 Z" fill="#065F46" />
                <path d="M0 105 Q 80 85, 160 100 T 240 90 L 240 135 L 0 135 Z" fill="#022C22" />
                <rect x="150" y="65" width="40" height="24" rx="2" fill="#78350F" />
                <polygon points="145,65 170,50 195,65" fill="#451A03" />
              </svg>
            </div>

            {/* Circular Play Button */}
            <div className="relative z-10 w-12 h-12 rounded-full bg-white/90 group-hover:bg-white text-emerald-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
              <Play className="w-5 h-5 fill-emerald-800 ml-0.5" />
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
            <span className="w-2 h-2 rounded-full bg-emerald-200" />
            <span className="w-2 h-2 rounded-full bg-emerald-200" />
            <span className="w-2 h-2 rounded-full bg-emerald-200" />
          </div>
        </div>
      </div>

      {/* 6. "Recent Milk Collection" List matching Image 5 */}
      <div className="bg-white rounded-3xl border border-emerald-100/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-gray-950 tracking-tight">
            {t.recentMilkCollection}
          </h2>
          <button
            onClick={() => setCurrentTab('collection')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {recentEntries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => setSelectedEntryForSlip(entry)}
              className="py-3 sm:py-3.5 flex items-center justify-between gap-3 hover:bg-emerald-50/40 px-2 rounded-2xl transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-gray-950 font-mono tracking-tight">
                    {entry.receiptId}
                  </div>
                  <div className="text-[11px] text-gray-700">
                    {entry.date}, {entry.time}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs sm:text-sm font-black text-gray-950">
                  {entry.quantityLiters} L
                </div>
                <div className="text-[11px] text-gray-700">
                  {entry.fatPercentage}% Fat
                </div>
              </div>

              <div className="shrink-0">
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    entry.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : entry.status === 'Pending'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-sky-50 text-sky-800 border border-sky-200'
                  }`}
                >
                  {entry.status === 'Completed' ? t.completed : entry.status === 'Pending' ? t.pending : t.inProgress}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
