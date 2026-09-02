import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Calendar,
  Clock,
  Users,
  Search,
  Filter,
  Download,
  Building2,
  Headphones,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PayoutStatus } from '../../types';
import { FarmLandscapeHeader, ThreeDIcons } from '../common/Illustrations';
import { BillingPeriodsHub } from '../reports/BillingPeriodsHub';

export const PayoutsSettlementView: React.FC = () => {
  const {
    payouts = [],
    farmers = [],
    userRole,
    currentFarmer,
    setSelectedPayout,
    setIsSupportModalOpen,
    setCurrentTab,
    t,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'payouts' | '10dayBilling'>('payouts');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PayoutStatus>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [expandedPayoutId, setExpandedPayoutId] = useState<string | null>(payouts[0]?.id || null);

  // Enforce strict farmer data isolation: farmer can ONLY view their own payout passbook records
  const basePayouts = useMemo(() => {
    if (userRole === 'farmer' && currentFarmer?.id) {
      return payouts.filter(
        (p) => p.farmerId === currentFarmer.id || p.farmerCode === currentFarmer.farmerCode
      );
    }
    return payouts;
  }, [payouts, userRole, currentFarmer]);

  // Dynamic calculations across scoped payouts
  const clearedPayouts = useMemo(() => basePayouts.filter((p) => p.status === 'Cleared'), [basePayouts]);
  const pendingPayouts = useMemo(() => basePayouts.filter((p) => p.status === 'Pending'), [basePayouts]);
  const upcomingPayouts = useMemo(() => basePayouts.filter((p) => p.status === 'Upcoming'), [basePayouts]);

  const totalPaid = useMemo(
    () => clearedPayouts.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    [clearedPayouts]
  );

  const pendingAmount = useMemo(
    () => pendingPayouts.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    [pendingPayouts]
  );

  const upcomingAmount = useMemo(
    () => upcomingPayouts.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    [upcomingPayouts]
  );

  const pendingFarmersCount = useMemo(() => {
    return new Set(pendingPayouts.map((p) => p.farmerId || p.farmerCode)).size;
  }, [pendingPayouts]);

  const paidFarmersCount = useMemo(() => {
    const uniquePaid = new Set(clearedPayouts.map((p) => p.farmerId || p.farmerCode)).size;
    return uniquePaid > 0 ? uniquePaid : (farmers.length || 0);
  }, [clearedPayouts, farmers]);

  const avgPayout = useMemo(() => {
    return clearedPayouts.length > 0 ? totalPaid / clearedPayouts.length : 0;
  }, [clearedPayouts, totalPaid]);

  // Unique dates available in payouts list
  const uniqueDates = useMemo(() => {
    const dates = new Set<string>();
    payouts.forEach((p) => {
      if (p.date) dates.add(p.date);
    });
    return Array.from(dates);
  }, [payouts]);

  const filteredPayouts = useMemo(() => {
    return basePayouts.filter((p) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const match =
          (p.farmerName || '').toLowerCase().includes(query) ||
          (p.farmerCode || '').toLowerCase().includes(query) ||
          (p.payoutId || p.id || '').toLowerCase().includes(query) ||
          (p.village || '').toLowerCase().includes(query);
        if (!match) return false;
      }
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (methodFilter !== 'all' && p.paymentMethod !== methodFilter) return false;
      if (dateFilter !== 'all' && p.date !== dateFilter) return false;
      return true;
    });
  }, [payouts, searchTerm, statusFilter, methodFilter, dateFilter]);

  const handleExportCSV = () => {
    const headers = [
      'Payout ID',
      'Date',
      'Time',
      'Farmer Name',
      'Farmer Code',
      'Village',
      'Method',
      'Reference',
      'Period Start',
      'Period End',
      'Milk Supplied (L)',
      'Avg Rate',
      'Total Amount (INR)',
      'Status',
    ];
    const rows = filteredPayouts.map((p) => [
      `"${p.payoutId || p.id}"`,
      `"${p.date || ''}"`,
      `"${p.time || ''}"`,
      `"${p.farmerName || ''}"`,
      `"${p.farmerCode || ''}"`,
      `"${p.village || ''}"`,
      `"${p.paymentMethod || ''}"`,
      `"${p.paymentReference || ''}"`,
      `"${p.periodStart || ''}"`,
      `"${p.periodEnd || ''}"`,
      Number(p.totalMilkSupplied) || 0,
      (Number(p.avgRate) || 0).toFixed(2),
      Number(p.amount) || 0,
      `"${p.status || 'Cleared'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rudu_payouts_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-28 max-w-5xl mx-auto">
      {/* 1. Top Green Landscape Header */}
      <FarmLandscapeHeader
        title={t.payoutsSettlement}
        subtitle="Track your payments, settlements and earnings in one place."
        onBack={() => setCurrentTab('dashboard')}
      />

      <div className="px-3 sm:px-4 space-y-4 -mt-4">
        {/* Sub-tab Switcher: Direct Payouts vs 10-Day Billing Cycles */}
        <div className="bg-white rounded-3xl p-1.5 border border-emerald-100 shadow-xs flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveSubTab('payouts')}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'payouts'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Direct Payouts &amp; Passbook
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('10dayBilling')}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === '10dayBilling'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            10-Day Billing Cycles &amp; Statements
          </button>
        </div>

        {activeSubTab === '10dayBilling' ? (
          <BillingPeriodsHub />
        ) : (
          <>
            {/* 2. Top 4 Dynamic Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Card 1: Total Paid */}
          <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-emerald-100/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-gray-700">{t.totalPaid}</span>
            </div>
            <div className="my-2">
              <div className="text-xl sm:text-2xl font-black text-gray-950 font-mono">
                ₹{totalPaid.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-[10.5px] font-semibold text-gray-700">
              {clearedPayouts.length} {clearedPayouts.length === 1 ? 'Settled Payment' : 'Settled Payments'}
            </div>
          </div>

          {/* Card 2: Pending Amount */}
          <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-emerald-100/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-gray-700">{t.pendingAmount}</span>
            </div>
            <div className="my-2">
              <div className="text-xl sm:text-2xl font-black text-gray-950 font-mono">
                ₹{pendingAmount.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-[10.5px] font-semibold text-gray-700">
              {pendingFarmersCount} {pendingFarmersCount === 1 ? 'Farmer' : 'Farmers'} Pending
            </div>
          </div>

          {/* Card 3: Upcoming */}
          <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-emerald-100/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-gray-700">{t.upcoming}</span>
            </div>
            <div className="my-2">
              <div className="text-xl sm:text-2xl font-black text-gray-950 font-mono">
                ₹{upcomingAmount.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-[10.5px] font-semibold text-gray-700">
              {upcomingPayouts.length} {t.thisMonth}
            </div>
          </div>

          {/* Card 4: Total Farmers */}
          <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-emerald-100/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-gray-700">{t.activeFarmers}</span>
            </div>
            <div className="my-2">
              <div className="text-xl sm:text-2xl font-black text-gray-950 font-mono">
                {paidFarmersCount}
              </div>
            </div>
            <div className="text-[10.5px] font-semibold text-gray-700">
              Paid Members
            </div>
          </div>
        </div>

        {/* 3. Search and Dynamic Filter Bar */}
        <div className="bg-white rounded-3xl p-3 sm:p-4 border border-emerald-100/90 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by farmer name, code, or payout ID..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 outline-none focus:border-emerald-600 focus:bg-white transition-all font-medium"
              />
            </div>

            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setMethodFilter('all');
                setDateFilter('all');
              }}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none cursor-pointer"
              >
                <option value="all">All Dates</option>
                {uniqueDates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              {/* Method Filter */}
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none cursor-pointer"
              >
                <option value="all">All Methods</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash Settlement">Cash Settlement</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none cursor-pointer"
              >
                <option value="all">{t.allStatus}</option>
                <option value="Cleared">{t.cleared}</option>
                <option value="Pending">{t.pending}</option>
                <option value="Upcoming">{t.upcoming}</option>
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.export} CSV</span>
            </button>
          </div>
        </div>

        {/* 4. Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All Payouts ({payouts.length})
          </button>

          <button
            onClick={() => setStatusFilter('Cleared')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'Cleared'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            ✓ {t.cleared} ({clearedPayouts.length})
          </button>

          <button
            onClick={() => setStatusFilter('Pending')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'Pending'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            ⏱ {t.pending} ({pendingPayouts.length})
          </button>

          <button
            onClick={() => setStatusFilter('Upcoming')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'Upcoming'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            📅 {t.upcoming} ({upcomingPayouts.length})
          </button>
        </div>

        {/* 5. Detailed Payout Cards with Safe Numeric Fallbacks */}
        {filteredPayouts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
              <Wallet className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">No Payout Records Found</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No transactions match your search or filter criteria. Try resetting the filters or logging a new settlement.
            </p>
          </div>
        ) : (
          filteredPayouts.map((payout) => {
            const isExpanded = expandedPayoutId === payout.id;
            const safeAmount = Number(payout.amount) || 0;
            const safeAvgRate = Number(payout.avgRate) || 0;
            const safeMilk = Number(payout.totalMilkSupplied) || 0;
            const safeStatus = payout.status || 'Cleared';

            return (
              <div
                key={payout.id}
                className="bg-white rounded-3xl border border-emerald-100/90 shadow-xs overflow-hidden"
              >
                {/* Card Header Row */}
                <div
                  onClick={() => {
                    setExpandedPayoutId(isExpanded ? null : payout.id);
                    setSelectedPayout(payout);
                  }}
                  className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-emerald-50/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-black text-gray-950 font-mono">
                        {payout.payoutId || payout.id}
                      </div>
                      <div className="text-[11px] text-gray-700">
                        {payout.date || 'Recent'} {payout.time ? `• ${payout.time}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <div className="text-xs sm:text-sm font-bold text-gray-900">
                      {payout.farmerName || 'Farmer'}
                    </div>
                    <div className="text-[11px] text-gray-700">
                      ID: {payout.farmerCode || payout.farmerId || 'N/A'} • 📍 {payout.village || 'Center'}
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <div className="text-xs sm:text-sm font-bold text-gray-900">
                      {t.settlementMethod}
                    </div>
                    <div className="text-[11px] text-gray-700 font-mono">
                      {payout.paymentReference || payout.paymentMethod || 'Direct Settlement'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-black text-gray-950 font-mono">
                        ₹{safeAmount.toLocaleString('en-IN')}
                      </div>
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          safeStatus === 'Cleared'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : safeStatus === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-sky-50 text-sky-800 border border-sky-200'
                        }`}
                      >
                        {safeStatus === 'Cleared' ? t.cleared : safeStatus === 'Pending' ? t.pending : t.upcoming}
                      </span>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-700" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-700" />
                    )}
                  </div>
                </div>

                {/* Collapsible Payout Details Sub-Card */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-gray-50/80 border-t border-gray-100 space-y-3">
                    <div className="bg-white rounded-2xl p-4 border border-gray-200/80 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-900 pb-2 border-b border-gray-100">
                        <Calendar className="w-4 h-4 text-emerald-700" />
                        <span>{t.payoutDetails}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-gray-50">
                          <span className="text-gray-700">{t.collectionPeriod}:</span>
                          <span className="font-bold text-gray-900">
                            {payout.periodStart || '1st'} - {payout.periodEnd || '15th'}
                          </span>
                        </div>

                        <div className="flex justify-between py-1 border-b border-gray-50">
                          <span className="text-gray-700">{t.totalMilkSupplied}:</span>
                          <span className="font-bold text-gray-900">{safeMilk} L</span>
                        </div>

                        <div className="flex justify-between py-1 border-b border-gray-50">
                          <span className="text-gray-700">{t.avgRate}:</span>
                          <span className="font-bold text-gray-900">₹{safeAvgRate.toFixed(2)} / L</span>
                        </div>

                        <div className="flex justify-between py-1 border-b border-gray-50">
                          <span className="text-gray-700">{t.totalAmount}:</span>
                          <span className="font-black text-emerald-800">
                            ₹{safeAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-700 pt-2 border-t border-gray-100">
                        <span>{t.paidOn}: {payout.paidOn || payout.date || 'Settled'}</span>
                        <span>
                          {t.receivedBy}:{' '}
                          <strong className="text-gray-900">
                            {payout.receivedBy || payout.farmerName || 'Member'}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* 6. Info Banner with 3D Gold Money Bag & Shield */}
        <div className="rounded-3xl bg-emerald-50/70 border border-emerald-200/80 p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
              {t.payoutNotice}
            </p>
          </div>
          <div className="w-16 h-16 shrink-0 flex items-center justify-center">
            <ThreeDIcons.MoneyBagShield3D className="w-16 h-16" />
          </div>
        </div>

        {/* 7. Dynamic Payout Summary Banner */}
        <div className="rounded-3xl bg-white border border-emerald-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-gray-950">{t.payoutSummary}</h3>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
            >
              <span>{t.viewReport}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 shrink-0">
                <ThreeDIcons.MilkCanSplash3D className="w-full h-full" />
              </div>
              <div>
                <span className="text-[10.5px] text-gray-700 block">{t.totalPaid}</span>
                <span className="text-base font-black text-gray-950 font-mono">
                  ₹{totalPaid.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-around w-full sm:w-auto gap-4 text-center sm:text-left">
              <div>
                <span className="text-[10.5px] text-gray-700 block">{t.thisMonthPaid}</span>
                <span className="text-sm font-extrabold text-gray-950 font-mono">
                  ₹{totalPaid.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[10.5px] text-gray-700 block">{t.avgPayout}</span>
                <span className="text-sm font-extrabold text-gray-950 font-mono">
                  ₹{Math.round(avgPayout).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[10.5px] text-gray-700 block">{t.nextPayoutDate}</span>
                <span className="text-sm font-extrabold text-purple-700 font-mono">
                  15th & 30th
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 8. Need Help Support Banner */}
        <div className="rounded-3xl bg-gray-50 border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-950">{t.needHelp}</h4>
              <p className="text-[11px] text-gray-700">{t.assistYou}</p>
            </div>
          </div>

          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
          >
            <span>{t.contactSupport}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

