import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Download,
  Search,
  FileSpreadsheet,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportLedgerToPDF } from '../../utils/pdfGenerator';
import { ShiftType, MilkType } from '../../types';
import { FarmLandscapeHeader, ThreeDIcons } from '../common/Illustrations';

export const MilkSupplyLedgerView: React.FC = () => {
  const { milkEntries, userRole, currentFarmer, setSelectedEntryForSlip, setCurrentTab, t } = useApp();
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShift, setSelectedShift] = useState<'all' | ShiftType>('all');
  const [selectedType, setSelectedType] = useState<'all' | MilkType>('all');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Enforce strict farmer data isolation: farmer can ONLY view their own ledger records
  const baseEntries = useMemo(() => {
    if (userRole === 'farmer' && currentFarmer?.id) {
      return milkEntries.filter(
        (e) => e.farmerId === currentFarmer.id || e.farmerCode === currentFarmer.farmerCode
      );
    }
    return milkEntries;
  }, [milkEntries, userRole, currentFarmer]);

  // Filtered Entries
  const filteredEntries = useMemo(() => {
    return baseEntries.filter((entry) => {
      if (selectedMonth !== 'All' && !entry.date.toLowerCase().includes(selectedMonth.toLowerCase())) {
        return false;
      }
      if (selectedShift !== 'all' && entry.shift !== selectedShift) return false;
      if (selectedType !== 'all' && entry.milkType !== selectedType) return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchReceipt = entry.receiptId.toLowerCase().includes(query);
        const matchDate = entry.date.toLowerCase().includes(query);
        const matchTime = entry.time.toLowerCase().includes(query);
        if (!matchReceipt && !matchDate && !matchTime) return false;
      }

      return true;
    });
  }, [milkEntries, selectedMonth, selectedShift, selectedType, searchTerm]);

  const totalQuantity = filteredEntries.reduce((sum, e) => sum + e.quantityLiters, 0);
  const totalAmount = filteredEntries.reduce((sum, e) => sum + e.totalAmount, 0);
  const avgFat = (
    filteredEntries.reduce((sum, e) => sum + e.fatPercentage, 0) /
    (filteredEntries.length || 1)
  ).toFixed(2);
  const avgSnf = (
    filteredEntries.reduce((sum, e) => sum + e.snfPercentage, 0) /
    (filteredEntries.length || 1)
  ).toFixed(2);
  const avgRate = (totalAmount / (totalQuantity || 1)).toFixed(2);

  const handleExportPDF = () => {
    exportLedgerToPDF(
      currentFarmer,
      filteredEntries,
      selectedMonth === 'All' ? 'Supply Statement' : selectedMonth
    );
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleExportCSV = () => {
    const headers = [
      'Receipt ID,Date,Time,Shift,Milk Type,Quantity (L),Fat (%),SNF (%),Rate/L (INR),Total Amount (INR),Status',
    ];
    const rows = filteredEntries.map(
      (e) =>
        `"${e.receiptId}","${e.date}","${e.time}","${e.shift}","${e.milkType}",${e.quantityLiters},${e.fatPercentage},${e.snfPercentage},${e.ratePerLiter},${e.totalAmount},"${e.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rudu_Passbook_${currentFarmer.farmerCode}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-28 max-w-5xl mx-auto">
      {/* Top Green Landscape Header */}
      <FarmLandscapeHeader
        title={t.milkSupplyLedger}
        subtitle="See your complete supply history and official passbook statements."
        onBack={() => setCurrentTab('dashboard')}
      />

      <div className="px-3 sm:px-4 space-y-4 -mt-4">
        {/* Passbook Statement Summary Banner */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-100/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 shrink-0 flex items-center justify-center">
              <ThreeDIcons.ClipboardLedger3D className="w-14 h-14" />
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-black text-emerald-800 uppercase tracking-wider">
                {t.milkSupplyLedger} • {filteredEntries.length} {t.entriesLogged}
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-gray-950">
                  {totalQuantity.toFixed(1)} L
                </span>
                <span className="text-lg sm:text-xl font-black text-emerald-800">
                  ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-xs text-gray-700 font-medium">
                Avg: <strong className="text-gray-900">{avgFat}% Fat</strong> • <strong className="text-gray-900">{avgSnf}% SNF</strong> • Rate: <strong className="text-gray-900">₹{avgRate}/L</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleExportCSV}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-2xl text-xs font-bold transition-all border border-gray-200 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? 'Downloaded!' : 'Export PDF'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-3xl p-3 sm:p-4 border border-emerald-100/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by receipt ID, date..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-900 outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 outline-none cursor-pointer"
            >
              <option value="All">All Months</option>
              <option value="May">May 2025</option>
              <option value="Aug">August 2025</option>
            </select>

            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value as any)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 outline-none cursor-pointer"
            >
              <option value="all">{t.allShifts}</option>
              <option value="morning">{t.morningShift}</option>
              <option value="evening">{t.eveningShift}</option>
            </select>
          </div>
        </div>

        {/* Entries Table / List */}
        <div className="space-y-2.5">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => setSelectedEntryForSlip(entry)}
              className="bg-white rounded-3xl p-3.5 sm:p-4 border border-emerald-100/80 hover:border-emerald-300 shadow-xs flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99] group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-gray-950 font-mono tracking-tight">
                    {entry.receiptId}
                  </div>
                  <div className="text-[11px] text-gray-700 font-medium">
                    {entry.date} • {entry.time} ({entry.shift === 'morning' ? t.morningShift : t.eveningShift})
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs sm:text-sm font-black text-gray-950">
                  {entry.quantityLiters} L
                </div>
                <div className="text-[11px] text-gray-700 font-medium">
                  {entry.fatPercentage}% Fat • {entry.snfPercentage}% SNF
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-black text-gray-950 font-mono">
                    ₹{entry.totalAmount.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    @ ₹{entry.ratePerLiter}/L
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-700 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
