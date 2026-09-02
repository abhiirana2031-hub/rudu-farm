import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Download,
  ChevronRight,
  Sun,
  Moon,
  Users,
  IndianRupee,
  Milk,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ShiftType, EntryStatus } from '../../types';
import { FarmLandscapeHeader, ThreeDIcons } from '../common/Illustrations';

export const MilkCollectionView: React.FC = () => {
  const {
    milkEntries,
    userRole,
    currentFarmer,
    setSelectedEntryForSlip,
    setIsSummaryModalOpen,
    setCurrentTab,
    t,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShift, setSelectedShift] = useState<'all' | ShiftType>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | EntryStatus>('all');
  const [selectedDate, setSelectedDate] = useState('All');

  // Enforce strict farmer data isolation: farmer can ONLY see their own milk records
  const baseEntries = useMemo(() => {
    if (userRole === 'farmer' && currentFarmer?.id) {
      return milkEntries.filter(
        (e) => e.farmerId === currentFarmer.id || e.farmerCode === currentFarmer.farmerCode
      );
    }
    return milkEntries;
  }, [milkEntries, userRole, currentFarmer]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return baseEntries.filter((entry) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matches =
          entry.farmerName.toLowerCase().includes(query) ||
          entry.farmerCode.toLowerCase().includes(query) ||
          entry.receiptId.toLowerCase().includes(query) ||
          entry.village.toLowerCase().includes(query);
        if (!matches) return false;
      }

      if (selectedShift !== 'all' && entry.shift !== selectedShift) return false;
      if (selectedStatus !== 'all' && entry.status !== selectedStatus) return false;
      if (selectedDate !== 'All' && !entry.date.includes(selectedDate)) return false;

      return true;
    });
  }, [milkEntries, searchTerm, selectedShift, selectedStatus, selectedDate]);

  const totalFilteredLiters = filteredEntries.reduce((sum, e) => sum + e.quantityLiters, 0);
  const totalFilteredAmount = filteredEntries.reduce((sum, e) => sum + e.totalAmount, 0);

  const morningCount = milkEntries.filter((e) => e.shift === 'morning').length;
  const eveningCount = milkEntries.filter((e) => e.shift === 'evening').length;

  const handleExportCSV = () => {
    const headers = [
      'Receipt ID',
      'Date',
      'Time',
      'Farmer Name',
      'Farmer Code',
      'Village',
      'Shift',
      'Milk Type',
      'Quantity (L)',
      'Fat %',
      'SNF %',
      'Rate/L (INR)',
      'Total Amount (INR)',
      'Status',
    ];
    const rows = filteredEntries.map((e) => [
      `"${e.receiptId}"`,
      `"${e.date}"`,
      `"${e.time}"`,
      `"${e.farmerName}"`,
      `"${e.farmerCode}"`,
      `"${e.village}"`,
      `"${e.shift}"`,
      `"${e.milkType}"`,
      e.quantityLiters,
      e.fatPercentage,
      e.snfPercentage,
      e.ratePerLiter,
      e.totalAmount,
      `"${e.status}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rudu_milk_collection_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-28 max-w-5xl mx-auto">
      {/* 1. Top Green Landscape Header */}
      <FarmLandscapeHeader
        title={t.collection}
        subtitle="Track and manage all milk collection entries in real-time."
        onBack={() => setCurrentTab('dashboard')}
      />

      <div className="px-3 sm:px-4 space-y-4 -mt-4">
        {/* 2. Top 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Card 1: Today's Collection */}
          <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-emerald-100/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Milk className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-gray-700">{t.todaysCollection}</span>
            </div>
            <div className="my-2">
              <div className="text-xl sm:text-2xl font-black text-gray-950">254 L</div>
            </div>
            <div className="text-[10.5px] font-bold text-emerald-700">
              ↑ 15% {t.fromYesterday}
            </div>
          </div>

          {/* Card 2: This Month */}
          <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-emerald-100/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-gray-700">{t.thisMonth}</span>
            </div>
            <div className="my-2">
              <div className="text-xl sm:text-2xl font-black text-gray-950">2,842 L</div>
            </div>
            <div className="text-[10.5px] font-semibold text-gray-700">
              {t.totalCollected}
            </div>
          </div>

          {/* Card 3: Active Farmers */}
          <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-emerald-100/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-gray-700">{t.activeFarmers}</span>
            </div>
            <div className="my-2">
              <div className="text-xl sm:text-2xl font-black text-gray-950">48</div>
            </div>
            <div className="text-[10.5px] font-semibold text-gray-700">
              {t.thisMonth}
            </div>
          </div>

          {/* Card 4: Avg Rate */}
          <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-emerald-100/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <IndianRupee className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-gray-700">{t.avgRate}</span>
            </div>
            <div className="my-2">
              <div className="text-xl sm:text-2xl font-black text-gray-950">₹58.00</div>
            </div>
            <div className="text-[10.5px] font-semibold text-gray-700">
              {t.perLiter}
            </div>
          </div>
        </div>

        {/* 3. Search and Filter Bar matching Image 4 */}
        <div className="bg-white rounded-3xl p-3 sm:p-4 border border-emerald-100/90 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 outline-none focus:border-emerald-600 focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedShift('all');
                setSelectedStatus('all');
                setSelectedDate('All');
              }}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{t.filter}</span>
            </button>
          </div>

          {/* Secondary Filter Dropdowns & Export */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              {/* Date Select */}
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none cursor-pointer"
              >
                <option value="All">All Dates</option>
                <option value="16 May 2025">16 May 2025</option>
                <option value="16 Aug 2025">16 Aug 2025</option>
                <option value="17 Aug 2025">17 Aug 2025</option>
              </select>

              {/* Shift Select */}
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value as any)}
                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none cursor-pointer"
              >
                <option value="all">{t.allShifts}</option>
                <option value="morning">{t.morningShift}</option>
                <option value="evening">{t.eveningShift}</option>
              </select>

              {/* Status Select */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none cursor-pointer"
              >
                <option value="all">{t.allStatus}</option>
                <option value="Completed">{t.completed}</option>
                <option value="Pending">{t.pending}</option>
                <option value="In Progress">{t.inProgress}</option>
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.export}</span>
            </button>
          </div>
        </div>

        {/* 4. Shift Filter Pills matching Image 4 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedShift('all')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedShift === 'all'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{t.allEntries} ({milkEntries.length})</span>
          </button>

          <button
            onClick={() => setSelectedShift('morning')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedShift === 'morning'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.morningShift} ({morningCount})</span>
          </button>

          <button
            onClick={() => setSelectedShift('evening')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedShift === 'evening'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
            <span>{t.eveningShift} ({eveningCount})</span>
          </button>
        </div>

        {/* 5. Milk Entries Card List */}
        <div className="space-y-2.5">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => setSelectedEntryForSlip(entry)}
              className="bg-white rounded-3xl p-3.5 sm:p-4 border border-emerald-100/80 hover:border-emerald-300 shadow-xs flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99] group"
            >
              {/* Left Column: Calendar Icon & Entry ID */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    entry.shift === 'morning'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-purple-50 text-purple-700 border border-purple-100'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-gray-950 font-mono tracking-tight">
                    {entry.receiptId}
                  </div>
                  <div className="text-[11px] text-gray-700 font-medium">
                    {entry.date} • {entry.time}
                  </div>
                </div>
              </div>

              {/* Center Left: Farmer Info */}
              <div className="hidden sm:block">
                <div className="text-xs sm:text-sm font-bold text-gray-900">
                  {entry.farmerName}
                </div>
                <div className="text-[11px] text-gray-700 flex items-center gap-1">
                  <span>ID: {entry.farmerCode}</span>
                  <span>•</span>
                  <span>📍 {entry.village}</span>
                </div>
              </div>

              {/* Center Right: Quantity & Fat */}
              <div className="text-right">
                <div className="text-xs sm:text-sm font-black text-gray-950">
                  {entry.quantityLiters} L
                </div>
                <div className="text-[11px] text-gray-700 font-medium">
                  {entry.fatPercentage}% Fat • {entry.snfPercentage}% SNF
                </div>
              </div>

              {/* Right Column: Amount & Status Badge */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-black text-gray-950 font-mono">
                    ₹{entry.totalAmount.toFixed(2)}
                  </div>
                  <div>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
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

                <ChevronRight className="w-4 h-4 text-gray-700 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* 6. Sticky / Floating Collection Summary matching Image 4 */}
        <div className="rounded-3xl bg-white border border-emerald-200/80 p-4 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 shrink-0">
              <ThreeDIcons.MilkCanSplash3D className="w-full h-full" />
            </div>
            <div>
              <span className="text-[10.5px] font-semibold text-gray-700 block">{t.totalCollection}</span>
              <span className="text-base sm:text-lg font-black text-gray-950">{totalFilteredLiters} L</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10.5px] font-semibold text-gray-700 block">{t.totalAmount}</span>
            <span className="text-base sm:text-lg font-black text-gray-950">
              ₹{totalFilteredAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={() => setIsSummaryModalOpen(true)}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap"
          >
            <span>{t.viewSummary}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
