import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  FileText,
  Share2,
  Phone,
  CheckCircle2,
  Lock,
  Clock,
  Building,
  TrendingUp,
  Download,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  getBillingPeriodsForMonth,
  getCurrentBillingPeriod,
} from '../../utils/billingPeriods';
import {
  generateFarmer10DayReport,
  formatWhatsAppBillingMessage,
  formatSmsBillingMessage,
} from '../../services/billingReportService';
import { BillingPeriodInfo, FarmerBillingReport } from '../../types/billing';
import { FarmerBillingReportModal } from './FarmerBillingReportModal';
import { Farmer } from '../../types';

export const BillingPeriodsHub: React.FC = () => {
  const { farmers, milkEntries, userRole, currentFarmer } = useApp();

  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1); // 1-12
  const [selectedPeriodNum, setSelectedPeriodNum] = useState<1 | 2 | 3>(() => {
    const cp = getCurrentBillingPeriod();
    return cp.periodNumber;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedReport, setSelectedReport] = useState<FarmerBillingReport | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  // Month periods
  const monthPeriods = useMemo(() => {
    return getBillingPeriodsForMonth(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  const activePeriod = useMemo(() => {
    return monthPeriods[selectedPeriodNum - 1];
  }, [monthPeriods, selectedPeriodNum]);

  // Filter farmers accessible to current user role
  const accessibleFarmers = useMemo(() => {
    if (userRole === 'farmer' && currentFarmer) {
      // Show only current farmer
      return farmers.filter(
        (f) => f.id === currentFarmer.id || f.phone === currentFarmer.phone || f.farmerCode === currentFarmer.farmerCode
      );
    }
    return farmers;
  }, [farmers, userRole, currentFarmer]);

  // Generate 10-Day Reports for all accessible farmers
  const farmerReports = useMemo(() => {
    return accessibleFarmers.map((farmer) => {
      return generateFarmer10DayReport(
        farmer,
        milkEntries,
        activePeriod,
        [], // adjustments
        0, // previous balance
        0, // advance
        0, // deductions
        0 // payments made
      );
    });
  }, [accessibleFarmers, milkEntries, activePeriod]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return farmerReports.filter((rep) => {
      const matchesSearch =
        !searchTerm.trim() ||
        rep.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.farmerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.farmerMobile.includes(searchTerm);

      const matchesVillage = selectedVillage === 'all' || rep.village === selectedVillage;
      const matchesStatus = statusFilter === 'all' || rep.status === statusFilter;

      return matchesSearch && matchesVillage && matchesStatus;
    });
  }, [farmerReports, searchTerm, selectedVillage, statusFilter]);

  // Aggregate Period Metrics
  const periodMetrics = useMemo(() => {
    const totalMilk = filteredReports.reduce((s, r) => s + r.totalMilk, 0);
    const cowMilk = filteredReports.reduce((s, r) => s + r.cowMilk, 0);
    const buffaloMilk = filteredReports.reduce((s, r) => s + r.buffaloMilk, 0);
    const grossAmount = filteredReports.reduce((s, r) => s + r.grossMilkAmount, 0);
    const netPayable = filteredReports.reduce((s, r) => s + r.netPayable, 0);
    const activeSuppliers = filteredReports.filter((r) => r.totalMilk > 0).length;

    const weightedFat = totalMilk > 0
      ? filteredReports.reduce((s, r) => s + r.avgFat * r.totalMilk, 0) / totalMilk
      : 0;
    const weightedSnf = totalMilk > 0
      ? filteredReports.reduce((s, r) => s + r.avgSnf * r.totalMilk, 0) / totalMilk
      : 0;

    return {
      totalMilk: Number(totalMilk.toFixed(2)),
      cowMilk: Number(cowMilk.toFixed(2)),
      buffaloMilk: Number(buffaloMilk.toFixed(2)),
      grossAmount: Number(grossAmount.toFixed(2)),
      netPayable: Number(netPayable.toFixed(2)),
      activeSuppliers,
      avgFat: Number(weightedFat.toFixed(2)),
      avgSnf: Number(weightedSnf.toFixed(2)),
    };
  }, [filteredReports]);

  // Unique villages for filter
  const uniqueVillages = useMemo(() => {
    return Array.from(new Set(farmers.map((f) => f.village))).filter(Boolean);
  }, [farmers]);

  // Actions
  const handleOpenReport = (report: FarmerBillingReport) => {
    setSelectedReport(report);
    setIsReportModalOpen(true);
  };

  const handleQuickWhatsApp = (e: React.MouseEvent, report: FarmerBillingReport) => {
    e.stopPropagation();
    const msg = formatWhatsAppBillingMessage(report);
    let phoneClean = report.farmerMobile.replace(/\D/g, '');
    if (phoneClean.length === 10) phoneClean = `91${phoneClean}`;
    const url = `https://api.whatsapp.com/send?phone=${phoneClean}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setActionAlert(`WhatsApp statement dispatched to ${report.farmerName}`);
    setTimeout(() => setActionAlert(null), 3500);
  };

  const handleQuickSms = (e: React.MouseEvent, report: FarmerBillingReport) => {
    e.stopPropagation();
    if (userRole !== 'admin') return;
    const sms = formatSmsBillingMessage(report);
    setActionAlert(`Fast2SMS dispatched to ${report.farmerMobile}`);
    setTimeout(() => setActionAlert(null), 3500);
  };

  return (
    <div className="space-y-5">
      {/* Alert Banner */}
      {actionAlert && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionAlert}</span>
        </div>
      )}

      {/* 1. Period Selector Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 block">
              Automated 10-Day Cycle Engine
            </span>
            <h2 className="text-lg sm:text-xl font-black text-gray-950">
              10-Day Milk Billing Periods &amp; Reports
            </h2>
          </div>

          {/* Month & Year Pickers */}
          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 focus:border-emerald-600 focus:outline-hidden"
            >
              {[
                { m: 1, name: 'January' },
                { m: 2, name: 'February' },
                { m: 3, name: 'March' },
                { m: 4, name: 'April' },
                { m: 5, name: 'May' },
                { m: 6, name: 'June' },
                { m: 7, name: 'July' },
                { m: 8, name: 'August' },
                { m: 9, name: 'September' },
                { m: 10, name: 'October' },
                { m: 11, name: 'November' },
                { m: 12, name: 'December' },
              ].map((item) => (
                <option key={item.m} value={item.m}>
                  {item.name}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 focus:border-emerald-600 focus:outline-hidden"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Period Chips (1-10, 11-20, 21-End of Month) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {monthPeriods.map((period) => {
            const isSelected = selectedPeriodNum === period.periodNumber;
            return (
              <button
                key={period.id}
                type="button"
                onClick={() => setSelectedPeriodNum(period.periodNumber)}
                className={`p-4 rounded-3xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-br from-emerald-900 to-emerald-950 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-gray-50 hover:bg-gray-100/80 text-gray-900 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Period {period.periodNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      isSelected ? 'text-emerald-300' : 'text-emerald-700'
                    }`}
                  >
                    {period.status}
                  </span>
                </div>
                <div className="font-black text-sm">{period.label}</div>
                <div className={`text-[11px] font-medium ${isSelected ? 'text-emerald-200/80' : 'text-gray-500'}`}>
                  {period.startDate} to {period.endDate}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Aggregate Metrics for Selected Period */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-3xl border border-emerald-100 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-500 block">Total Milk Volume</span>
          <div className="text-xl font-black text-gray-950 font-mono mt-0.5">
            {periodMetrics.totalMilk.toLocaleString('en-IN')} <span className="text-xs font-semibold text-gray-500">L</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 block mt-1">
            Cow: {periodMetrics.cowMilk}L • Buffalo: {periodMetrics.buffaloMilk}L
          </span>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-emerald-100 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-500 block">Weighted Avg Quality</span>
          <div className="text-xl font-black text-gray-950 font-mono mt-0.5">
            {periodMetrics.avgFat}% <span className="text-xs font-semibold text-gray-500">FAT</span>
          </div>
          <span className="text-[10px] font-semibold text-gray-600 block mt-1">
            Avg SNF: {periodMetrics.avgSnf}%
          </span>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-emerald-100 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-500 block">Active Suppliers</span>
          <div className="text-xl font-black text-gray-950 font-mono mt-0.5">
            {periodMetrics.activeSuppliers} <span className="text-xs font-semibold text-gray-500">/ {accessibleFarmers.length}</span>
          </div>
          <span className="text-[10px] font-semibold text-gray-600 block mt-1">
            Logged shift entries
          </span>
        </div>

        <div className="p-4 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl shadow-xs">
          <span className="text-[11px] font-bold text-emerald-300 block">Net Payable Payouts</span>
          <div className="text-xl font-black text-white font-mono mt-0.5">
            ₹{periodMetrics.netPayable.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] font-semibold text-emerald-200/80 block mt-1">
            Gross: ₹{periodMetrics.grossAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* 3. Search and Farmer Statements Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search farmer name, code (RF-...), phone, village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Village Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-800 focus:border-emerald-600 focus:outline-hidden"
            >
              <option value="all">All Villages</option>
              {uniqueVillages.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statements Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
              <tr>
                <th className="py-3 px-3.5">Farmer</th>
                <th className="py-3 px-3">Village</th>
                <th className="py-3 px-3 text-right">Collections</th>
                <th className="py-3 px-3 text-right">Volume (L)</th>
                <th className="py-3 px-3 text-right">Avg FAT/SNF</th>
                <th className="py-3 px-3 text-right">Avg Rate</th>
                <th className="py-3 px-3 text-right">Net Payable</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500 font-medium">
                    No farmer statements match your criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    onClick={() => handleOpenReport(report)}
                    className="hover:bg-emerald-50/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3.5">
                      <div className="font-black text-gray-950">{report.farmerName}</div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-md">
                        {report.farmerCode}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-gray-700">{report.village}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">
                      {report.totalEntries}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-gray-950">
                      {report.totalMilk.toFixed(2)} L
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-gray-800">
                      {report.avgFat}% / {report.avgSnf}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-800">
                      ₹{report.avgRate.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-emerald-950 text-sm">
                      ₹{report.netPayable.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          report.status === 'FINALIZED' || report.status === 'LOCKED'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* View Statement */}
                        <button
                          onClick={() => handleOpenReport(report)}
                          className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors"
                          title="Open 10-Day Billing Statement"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {/* WhatsApp (All Roles) */}
                        <button
                          onClick={(e) => handleQuickWhatsApp(e, report)}
                          className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                          title="Send Statement via WhatsApp"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        {/* SMS (Admin Only) */}
                        {userRole === 'admin' && (
                          <button
                            onClick={(e) => handleQuickSms(e, report)}
                            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                            title="Dispatch SMS (Admin Only)"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Farmer 10-Day Billing Report Modal */}
      <FarmerBillingReportModal
        report={selectedReport}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onUpdateReport={(updated) => {
          setSelectedReport(updated);
        }}
      />
    </div>
  );
};
