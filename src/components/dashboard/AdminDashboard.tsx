import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Milk,
  Sliders,
  PlusCircle,
  Megaphone,
  Download,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  Edit2,
  Trash2,
  CreditCard,
  Layers,
  Sparkles,
  ArrowUpRight,
  Filter,
  Check,
  ChevronRight,
  Printer,
  Calendar,
  UserCheck,
  Send,
  FileText,
  AlertTriangle,
  RefreshCw,
  Phone,
  MapPin,
  Flame,
  CheckCircle,
  XCircle,
  Cloud,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Farmer, MilkType, OperatorUser, CollectionCenter } from '../../types';
import { AddOperatorModal } from '../modals/AddOperatorModal';
import { EditOperatorModal } from '../modals/EditOperatorModal';
import { AddCenterModal } from '../modals/AddCenterModal';
import { SmsSettingsView } from '../admin/SmsSettingsView';
import { PrintDocumentsView } from '../documents/PrintDocumentsView';
import { BillingPeriodsHub } from '../reports/BillingPeriodsHub';

export const AdminDashboard: React.FC = () => {
  const {
    farmers,
    operators,
    centers,
    milkEntries,
    payouts,
    rateChart,
    updateRateChart,
    disburseBulkPayouts,
    disburseIndividualPayout,
    setIsAddFarmerModalOpen,
    setEditingFarmer,
    deleteFarmer,
    toggleKycStatus,
    toggleOperatorStatus,
    assignOperatorCenter,
    deleteOperator,
    deleteCenter,
    setIsBroadcastModalOpen,
    setIsBulkPayoutModalOpen,
    setIsRateChartModalOpen,
    setSelectedEntryForSlip,
    setSelectedPayout,
    setCurrentTab,
    broadcastAnnouncement,
    setIsGoogleDriveModalOpen,
    seedDatabase,
    pricingMode,
    setPricingMode,
    rateUnit,
    setRateUnit,
    qualityValidation,
    updateQualityValidation,
    t,
  } = useApp();

  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  const handleSeedDatabase = async (force: boolean = false) => {
    if (force && !window.confirm('Are you sure you want to overwrite all records in Firestore with clean master records?')) {
      return;
    }
    setIsSeeding(true);
    const res = await seedDatabase(force);
    setSeedMessage(res.message);
    setIsSeeding(false);
    setTimeout(() => setSeedMessage(null), 5000);
  };

  const [adminTab, setAdminTab] = useState<
    'analytics' | 'pnl' | 'billingPeriods' | 'farmers' | 'operators' | 'centers' | 'rateChart' | 'payouts' | 'broadcast' | 'smsSettings' | 'reports'
  >('analytics');

  const [farmerSearch, setFarmerSearch] = useState('');
  const [filterKyc, setFilterKyc] = useState<'all' | 'Verified' | 'Pending'>('all');
  const [operatorSearch, setOperatorSearch] = useState('');
  const [centerSearch, setCenterSearch] = useState('');
  const [isAddOperatorModalOpen, setIsAddOperatorModalOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<OperatorUser | null>(null);
  const [isAddCenterModalOpen, setIsAddCenterModalOpen] = useState(false);

  // Rate simulator state
  const [simMilkType, setSimMilkType] = useState<MilkType>('cow');
  const [simFat, setSimFat] = useState(4.2);
  const [simSnf, setSimSnf] = useState(8.6);

  // Live editable rate chart values
  const [editableCowBase, setEditableCowBase] = useState(rateChart.cowBaseRate);
  const [editableCowFat, setEditableCowFat] = useState(rateChart.cowFatMultiplier);
  const [editableCowSnf, setEditableCowSnf] = useState(rateChart.cowSnfMultiplier);

  const [editableBuffBase, setEditableBuffBase] = useState(rateChart.buffaloBaseRate);
  const [editableBuffFat, setEditableBuffFat] = useState(rateChart.buffaloFatMultiplier);
  const [editableBuffSnf, setEditableBuffSnf] = useState(rateChart.buffaloSnfMultiplier);

  const [rateSavedAlert, setRateSavedAlert] = useState(false);
  const [broadcastSentAlert, setBroadcastSentAlert] = useState<string | null>(null);

  // Custom Quick Broadcast Form
  const [broadcastAudience, setBroadcastAudience] = useState<'all' | 'pending_kyc' | 'kheda' | 'anand'>('all');
  const [broadcastCategory, setBroadcastCategory] = useState<'rate' | 'payout' | 'announcement'>('rate');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Calculations
  const totalVolume = milkEntries.reduce((sum, e) => sum + e.quantityLiters, 0);
  const totalMilkValue = milkEntries.reduce((sum, e) => sum + e.totalAmount, 0);
  const totalDisbursed = payouts.reduce((sum, p) => sum + p.amount, 0);
  const pendingLiability = Math.max(0, totalMilkValue - totalDisbursed);
  const activeFarmersCount = farmers.length;
  const activeOperatorsCount = operators.filter((o) => o.status === 'Active').length;

  // Profit & Loss calculations
  const cowVolume = milkEntries.filter((e) => e.milkType === 'cow').reduce((s, e) => s + e.quantityLiters, 0);
  const buffVolume = milkEntries.filter((e) => e.milkType === 'buffalo').reduce((s, e) => s + e.quantityLiters, 0);
  const wholesaleCowRate = 67.5; // Dairy selling price to processing plant
  const wholesaleBuffRate = 86.0;
  const wholesaleRevenue = Math.round(cowVolume * wholesaleCowRate + buffVolume * wholesaleBuffRate);
  const logisticsAndChillingCost = Math.round(totalVolume * 2.2);
  const grossMargin = wholesaleRevenue - totalMilkValue;
  const netOperatingProfit = grossMargin - logisticsAndChillingCost;
  const profitMarginPercent = wholesaleRevenue > 0 ? ((netOperatingProfit / wholesaleRevenue) * 100).toFixed(1) : '18.4';

  // Filtered farmers
  const filteredFarmers = farmers.filter((f) => {
    const matchesQuery =
      !farmerSearch.trim() ||
      f.name.toLowerCase().includes(farmerSearch.toLowerCase()) ||
      f.farmerCode.toLowerCase().includes(farmerSearch.toLowerCase()) ||
      f.village.toLowerCase().includes(farmerSearch.toLowerCase()) ||
      f.phone.includes(farmerSearch);

    const matchesKyc = filterKyc === 'all' || f.bankDetails.kycStatus === filterKyc;

    return matchesQuery && matchesKyc;
  });

  // Filtered operators
  const filteredOperators = operators.filter((op) => {
    if (!operatorSearch.trim()) return true;
    const q = operatorSearch.toLowerCase();
    return (
      op.name.toLowerCase().includes(q) ||
      op.employeeCode.toLowerCase().includes(q) ||
      op.centerName.toLowerCase().includes(q) ||
      op.phone.includes(q)
    );
  });

  // Calculate live simulated rate
  const simulatedRate =
    simMilkType === 'cow'
      ? Math.round((editableCowBase + simFat * editableCowFat + simSnf * editableCowSnf) * 100) / 100
      : Math.round((editableBuffBase + simFat * editableBuffFat + simSnf * editableBuffSnf) * 100) / 100;

  const handleSaveRateChart = () => {
    updateRateChart({
      cowBaseRate: Number(editableCowBase),
      cowFatMultiplier: Number(editableCowFat),
      cowSnfMultiplier: Number(editableCowSnf),
      buffaloBaseRate: Number(editableBuffBase),
      buffaloFatMultiplier: Number(editableBuffFat),
      buffaloSnfMultiplier: Number(editableBuffSnf),
    });
    setRateSavedAlert(true);
    setTimeout(() => setRateSavedAlert(false), 4000);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    broadcastAnnouncement(broadcastTitle, broadcastMessage, broadcastCategory);
    setBroadcastSentAlert(`Broadcast alert dispatched to ${broadcastAudience === 'all' ? 'all registered farmers' : broadcastAudience}!`);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSentAlert(null), 4000);
  };

  const handleExportCSV = () => {
    const headers = 'Farmer Code,Name,Village,Phone,Cow Count,Buffalo Count,KYC Status,Total Supplied (L),Total Earnings (INR)\n';
    const rows = farmers
      .map((f) => {
        const farmerEntries = milkEntries.filter((e) => e.farmerId === f.id);
        const totalL = farmerEntries.reduce((s, e) => s + e.quantityLiters, 0);
        const totalE = farmerEntries.reduce((s, e) => s + e.totalAmount, 0);
        return `"${f.farmerCode}","${f.name}","${f.village}","${f.phone}",${f.cowCount},${f.buffaloCount},"${f.bankDetails.kycStatus}",${totalL},${totalE}`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Rudu_Farm_Dairy_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-28 max-w-5xl mx-auto px-2 sm:px-4 pt-1">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 text-white p-5 sm:p-6 shadow-md border border-emerald-700/50">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-black tracking-wider uppercase">
              <Building className="w-3.5 h-3.5" />
              <span>Dairy Executive Console • All Hubs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t.adminDashboard}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
              Rate Chart Configuration, P&L Financials, Farmer/Operator Management, and Centralized Analytics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSeedDatabase(false)}
              disabled={isSeeding}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all border border-teal-400/40 cursor-pointer disabled:opacity-50"
              title="Populate empty Firestore collections with default master records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? 'Seeding...' : 'Seed Database'}</span>
            </button>

            <button
              onClick={() => setIsAddFarmerModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-black transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.addFarmer}</span>
            </button>

            <button
              onClick={() => setIsAddOperatorModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all border border-emerald-500/40 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Add Operator</span>
            </button>

            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer"
            >
              <Megaphone className="w-4 h-4" />
              <span>{t.broadcastAlert}</span>
            </button>
          </div>
        </div>

        {seedMessage && (
          <div className="mt-4 px-4 py-2.5 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-xs font-bold text-teal-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
            <span>{seedMessage}</span>
          </div>
        )}
      </div>

      {/* 2. Top Metric Cards for Admin */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Volume */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Milk className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-700 leading-tight">
              Total Milk Inflow
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
              {totalVolume.toFixed(1)} L
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px] font-bold text-emerald-700">
            <span>Across 4 Hubs</span>
            <span>+14.2% MoM</span>
          </div>
        </div>

        {/* Metric 2: Total Farmers & Operators */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-700 leading-tight">
              Active Network
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
              {activeFarmersCount} <span className="text-sm font-medium text-gray-500">Farmers</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px] font-bold text-blue-800">
            <span>{activeOperatorsCount} Staff Operators</span>
            <span>100% KYC OK</span>
          </div>
        </div>

        {/* Metric 3: P&L Realized Revenue */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-700 leading-tight">
              Net Operating Profit
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
              ₹{netOperatingProfit.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px] font-bold text-purple-800">
            <span>Margin: {profitMarginPercent}%</span>
            <button onClick={() => setAdminTab('pnl')} className="text-purple-900 hover:underline cursor-pointer">
              View P&L →
            </button>
          </div>
        </div>

        {/* Metric 4: Pending Payout Liability */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-700 leading-tight">
              Pending Liability
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
              ₹{pendingLiability.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px] font-bold text-amber-800">
            <span>Ready for Batch</span>
            <button
              onClick={() => setIsBulkPayoutModalOpen(true)}
              className="text-emerald-800 font-black hover:underline cursor-pointer"
            >
              Batch Disburse 🚀
            </button>
          </div>
        </div>
      </div>

      {/* 3. Admin Sub-navigation Tabs */}
      <div className="bg-white rounded-3xl p-1.5 sm:p-2 border border-emerald-100/90 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
          <button
            onClick={() => setAdminTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'analytics'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setAdminTab('pnl')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'pnl'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Profit & Loss</span>
          </button>

          <button
            onClick={() => setAdminTab('billingPeriods')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'billingPeriods'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>10-Day Billing Cycles</span>
          </button>

          <button
            onClick={() => setAdminTab('farmers')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'farmers'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Farmers</span>
          </button>

          <button
            onClick={() => setAdminTab('operators')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'operators'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Operators ({operators.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('centers')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'centers'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Collection Hubs ({centers.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('rateChart')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'rateChart'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Rate Chart</span>
          </button>

          <button
            onClick={() => setAdminTab('payouts')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'payouts'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payouts Engine</span>
          </button>

          <button
            onClick={() => setAdminTab('broadcast')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'broadcast'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Communication</span>
          </button>

          <button
            onClick={() => setAdminTab('smsSettings')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'smsSettings'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>SMS & Alerts</span>
          </button>

          <button
            onClick={() => setAdminTab('reports')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'reports'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print & Documents</span>
          </button>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* 4. Tab 1: Dairy Analytics Overview */}
      {adminTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Volume chart & Breakdown (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-950">Daily Volume & Shift Intake Trend</h3>
                <p className="text-xs text-gray-700 font-medium">Morning vs Evening intake across collection hubs</p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Avg: 202.5 L/day
              </span>
            </div>

            {/* Visual Bar Chart */}
            <div className="space-y-3 pt-2">
              {[
                { day: '16 May (Today)', morn: 145.0, eve: 52.5, total: 197.5, max: 220 },
                { day: '15 May', morn: 138.0, eve: 64.0, total: 202.0, max: 220 },
                { day: '14 May', morn: 142.5, eve: 58.0, total: 200.5, max: 220 },
                { day: '13 May', morn: 151.0, eve: 62.0, total: 213.0, max: 220 },
                { day: '12 May', morn: 139.0, eve: 56.5, total: 195.5, max: 220 },
              ].map((item) => (
                <div key={item.day} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-900">{item.day}</span>
                    <span className="text-emerald-950 font-mono">{item.total} Liters</span>
                  </div>
                  <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${(item.morn / item.max) * 100}%` }}
                      className="bg-amber-400 h-full transition-all"
                      title={`Morning: ${item.morn}L`}
                    />
                    <div
                      style={{ width: `${(item.eve / item.max) * 100}%` }}
                      className="bg-indigo-600 h-full transition-all"
                      title={`Evening: ${item.eve}L`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 pt-2 border-t border-gray-100 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-amber-800">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span>Morning Shift (71%)</span>
              </span>
              <span className="flex items-center gap-1.5 text-indigo-800">
                <span className="w-3 h-3 rounded-full bg-indigo-600" />
                <span>Evening Shift (29%)</span>
              </span>
            </div>
          </div>

          {/* Village & Quality Distribution (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-emerald-100/90 shadow-xs space-y-3">
              <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider">
                Collection Hub Inflow
              </h4>
              <div className="space-y-2.5">
                {centers.map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-xs p-2.5 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <span className="font-bold text-gray-900 block">{c.name}</span>
                      <span className="text-[10px] text-gray-600">Op: {c.assignedOperator}</span>
                    </div>
                    <span className="font-black text-emerald-800 font-mono">{c.dailyIntakeAvg} L/day</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-emerald-100/90 shadow-xs space-y-3">
              <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider">
                Quality Compliance
              </h4>
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1.5">
                <div className="flex justify-between font-bold text-emerald-950">
                  <span>Adulteration Rejections:</span>
                  <span className="text-emerald-700">0 (100% Pure)</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-950">
                  <span>Avg Fat Content:</span>
                  <span className="text-emerald-700">4.32%</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-950">
                  <span>Avg SNF:</span>
                  <span className="text-emerald-700">8.66%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab 2: Profit & Loss Statement */}
      {adminTab === 'pnl' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100/90 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-950">Dairy Business Profit & Loss Statement</h3>
                <p className="text-xs text-gray-700 font-medium">
                  Complete real-time accounting: Processing sales vs Farmer procurement vs Cold-chain logistics
                </p>
              </div>
              <span className="px-3 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-full text-xs font-black">
                Cycle: 01 May - 16 May 2025
              </span>
            </div>

            {/* P&L Financial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="text-xs font-bold text-emerald-900 uppercase">Gross Revenue (Wholesale Inflow)</span>
                <div className="text-2xl font-black text-emerald-950">₹{wholesaleRevenue.toLocaleString()}</div>
                <p className="text-[11px] text-emerald-800">
                  {cowVolume.toFixed(1)}L Cow @ ₹{wholesaleCowRate} + {buffVolume.toFixed(1)}L Buffalo @ ₹{wholesaleBuffRate}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <span className="text-xs font-bold text-amber-900 uppercase">Farmer Procurement Cost</span>
                <div className="text-2xl font-black text-amber-950">₹{totalMilkValue.toLocaleString()}</div>
                <p className="text-[11px] text-amber-800">
                  Calculated automatically via Dynamic Rate Matrix based on Fat & SNF
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                <span className="text-xs font-bold text-purple-900 uppercase">Net Operating Profit</span>
                <div className="text-2xl font-black text-purple-950">₹{netOperatingProfit.toLocaleString()}</div>
                <p className="text-[11px] text-purple-800">
                  After cold storage, chilling electricity & logistics (₹{logisticsAndChillingCost.toLocaleString()})
                </p>
              </div>
            </div>

            {/* Detailed Ledger Breakdown Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 font-bold text-gray-700 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Line Item</th>
                    <th className="py-3 px-4">Volume / Basis</th>
                    <th className="py-3 px-4">Effective Unit Rate</th>
                    <th className="py-3 px-4 text-right">Total Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  <tr className="bg-emerald-50/40">
                    <td className="py-3 px-4 font-bold text-gray-900">1. Bulk Cow Milk Sales to Processing Plant</td>
                    <td className="py-3 px-4 text-gray-700">{cowVolume.toFixed(1)} Liters</td>
                    <td className="py-3 px-4 font-mono text-gray-900">₹{wholesaleCowRate}/L</td>
                    <td className="py-3 px-4 text-right font-black text-emerald-800 font-mono">
                      +₹{Math.round(cowVolume * wholesaleCowRate).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-emerald-50/40">
                    <td className="py-3 px-4 font-bold text-gray-900">2. Bulk Buffalo Milk Sales to Processing Plant</td>
                    <td className="py-3 px-4 text-gray-700">{buffVolume.toFixed(1)} Liters</td>
                    <td className="py-3 px-4 font-mono text-gray-900">₹{wholesaleBuffRate}/L</td>
                    <td className="py-3 px-4 text-right font-black text-emerald-800 font-mono">
                      +₹{Math.round(buffVolume * wholesaleBuffRate).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-gray-50/80 font-bold">
                    <td className="py-2.5 px-4 text-gray-950">Total Wholesale Revenue (A)</td>
                    <td className="py-2.5 px-4 text-gray-700">{totalVolume.toFixed(1)} Liters</td>
                    <td className="py-2.5 px-4 font-mono">Avg ₹{((wholesaleRevenue / (totalVolume || 1))).toFixed(2)}/L</td>
                    <td className="py-2.5 px-4 text-right font-black text-gray-950 font-mono">
                      ₹{wholesaleRevenue.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-amber-50/30">
                    <td className="py-3 px-4 font-bold text-amber-950">3. Less: Farmer Procurement Payables (B)</td>
                    <td className="py-3 px-4 text-gray-700">{farmers.length} Registered Suppliers</td>
                    <td className="py-3 px-4 font-mono text-gray-900">Avg ₹{((totalMilkValue / (totalVolume || 1))).toFixed(2)}/L</td>
                    <td className="py-3 px-4 text-right font-black text-amber-900 font-mono">
                      -₹{totalMilkValue.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="py-3 px-4 font-bold text-gray-800">4. Less: Hub Chilling & Tanker Freight (C)</td>
                    <td className="py-3 px-4 text-gray-700">4 Active Tanker Runs</td>
                    <td className="py-3 px-4 font-mono text-gray-900">₹2.20/L</td>
                    <td className="py-3 px-4 text-right font-bold text-gray-800 font-mono">
                      -₹{logisticsAndChillingCost.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-purple-100 font-black text-sm">
                    <td className="py-3.5 px-4 text-purple-950">Net Dairy Operating Surplus (A - B - C)</td>
                    <td className="py-3.5 px-4 text-purple-900">{totalVolume.toFixed(1)} L Intake</td>
                    <td className="py-3.5 px-4 font-mono text-purple-950">{profitMarginPercent}% Net Margin</td>
                    <td className="py-3.5 px-4 text-right text-purple-950 font-mono">
                      ₹{netOperatingProfit.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: 10-Day Billing Cycles & Statements */}
      {adminTab === 'billingPeriods' && <BillingPeriodsHub />}

      {/* 6. Tab 3: Farmer Directory (CRUD & KYC & Quick Payout) */}
      {adminTab === 'farmers' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-black text-gray-950">Farmer Master Directory</h3>
              <p className="text-xs text-gray-700 font-medium">
                Manage registered suppliers, cattle count, bank KYC status, and instant settlements
              </p>
            </div>

            <button
              onClick={() => setIsAddFarmerModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-black shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.addFarmer}</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by name, ID (e.g. RF7237), phone, village..."
                value={farmerSearch}
                onChange={(e) => setFarmerSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700">KYC:</span>
              <select
                value={filterKyc}
                onChange={(e) => setFilterKyc(e.target.value as any)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-800 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="Verified">Verified Only</option>
                <option value="Pending">Pending KYC</option>
              </select>
            </div>
          </div>

          {/* Farmers Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 font-bold text-gray-700 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Farmer Details</th>
                  <th className="py-3 px-4">Village / District</th>
                  <th className="py-3 px-4">Cattle Herd</th>
                  <th className="py-3 px-4">Bank / UPI Details</th>
                  <th className="py-3 px-4">KYC Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFarmers.map((farmer) => {
                  const farmerEntries = milkEntries.filter((e) => e.farmerId === farmer.id);
                  const farmerTotalEarnings = farmerEntries.reduce((s, e) => s + e.totalAmount, 0);
                  const farmerPayouts = payouts.filter((p) => p.farmerId === farmer.id);
                  const farmerPaid = farmerPayouts.reduce((s, e) => s + e.amount, 0);
                  const pendingBal = Math.max(0, farmerTotalEarnings - farmerPaid);

                  return (
                    <tr key={farmer.id} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {farmer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-950">{farmer.name}</div>
                            <div className="text-[10px] font-mono text-gray-600">
                              {farmer.farmerCode} • {farmer.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-800">{farmer.village}</span>
                        <div className="text-[10px] text-gray-600">{farmer.district}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{farmer.cattleCount} Cattle</div>
                        <div className="text-[10px] text-gray-600">
                          🐄 {farmer.cowCount} Cows | 🐃 {farmer.buffaloCount} Buff
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{farmer?.bankDetails?.bankName || 'State Bank of India'}</div>
                        <div className="text-[10px] font-mono text-gray-600">
                          {farmer?.bankDetails?.upiId || farmer?.bankDetails?.accountNumber || 'Pending'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleKycStatus(farmer.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                            farmer?.bankDetails?.kycStatus === 'Verified'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                          }`}
                          title="Click to toggle KYC status"
                        >
                          {farmer?.bankDetails?.kycStatus === 'Verified' ? (
                            <>
                              <ShieldCheck className="w-3 h-3 text-emerald-700" />
                              <span>Verified</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-amber-700" />
                              <span>Pending KYC</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Instant Payout Button */}
                          <button
                            onClick={() => disburseIndividualPayout(farmer.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[11px] font-bold transition-colors cursor-pointer"
                            title={`Disburse settlement to ${farmer.name} (Pending: ₹${pendingBal})`}
                          >
                            Pay ₹{pendingBal > 0 ? pendingBal : 'Settled'}
                          </button>

                          <button
                            onClick={() => setEditingFarmer(farmer)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                            title="Edit Farmer Profile"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => deleteFarmer(farmer.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                            title="Deactivate / Remove Farmer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. Tab 4: Operators & Collection Hubs Management */}
      {adminTab === 'operators' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-950">Collection Hub Staff & Operators</h3>
                <p className="text-xs text-gray-700 font-medium">
                  Register collection agents, activate/deactivate accounts, and assign intake centers
                </p>
              </div>

              <button
                onClick={() => setIsAddOperatorModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-black shadow-xs cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Add Operator</span>
              </button>
            </div>

            {/* Hubs Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {centers.map((center) => (
                <div key={center.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-950 text-xs">{center.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full font-bold">
                      {center.code}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600">Location: {center.village}</div>
                  <div className="pt-1 flex items-center justify-between text-xs font-bold text-gray-800 border-t border-gray-200">
                    <span>{center.activeFarmers} Farmers</span>
                    <span className="text-emerald-800 font-mono">{center.dailyIntakeAvg} L/day</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Operator Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search operator by name, employee code (OP-101), hub..."
                value={operatorSearch}
                onChange={(e) => setOperatorSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Operators Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 font-bold text-gray-700 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Operator Name</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">Assigned Collection Hub</th>
                    <th className="py-3 px-4">Shift Authorization</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredOperators.map((op) => (
                    <tr key={op.id} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-950">{op.name}</div>
                        <div className="text-[10px] font-mono text-gray-600">ID: {op.employeeCode} • Joined {op.joinDate}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-800">{op.phone}</td>
                      <td className="py-3 px-4">
                        <select
                          value={op.centerId}
                          onChange={(e) => assignOperatorCenter(op.id, e.target.value)}
                          className="px-2.5 py-1 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 focus:outline-hidden cursor-pointer"
                        >
                          {centers.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-md text-[11px] font-bold">
                          {op.shiftAssigned} Shift
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleOperatorStatus(op.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                            op.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                          }`}
                          title="Click to toggle status"
                        >
                          {op.status === 'Active' ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-700" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-rose-700" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingOperator(op)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                            title="Edit Operator Profile & PIN"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteOperator(op.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                            title="Remove Operator"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Collection Centers Management */}
      {adminTab === 'centers' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-950">Village Milk Collection Centers (BMC Hubs)</h3>
                <p className="text-xs text-gray-700 font-medium">
                  Add new collection stations, monitor daily intake averages, and manage station infrastructure
                </p>
              </div>

              <button
                onClick={() => setIsAddCenterModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-purple-800 hover:bg-purple-700 text-white text-xs font-black shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Collection Center</span>
              </button>
            </div>

            {/* Centers Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search collection centers by name, village, code (BMC-01)..."
                value={centerSearch}
                onChange={(e) => setCenterSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-purple-600 focus:outline-hidden"
              />
            </div>

            {/* Centers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {centers
                .filter((c) => {
                  if (!centerSearch.trim()) return true;
                  const term = centerSearch.toLowerCase();
                  return (
                    c.name.toLowerCase().includes(term) ||
                    c.code.toLowerCase().includes(term) ||
                    c.village.toLowerCase().includes(term) ||
                    c.district.toLowerCase().includes(term)
                  );
                })
                .map((center) => (
                  <div
                    key={center.id}
                    className="p-5 rounded-3xl bg-gradient-to-br from-purple-50/40 via-white to-gray-50/50 border border-purple-100 shadow-2xs hover:shadow-xs transition-all space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                          <Building className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-gray-900 text-sm">{center.name}</h4>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-purple-100 text-purple-900 rounded-full">
                            {center.code}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to remove collection center "${center.name}"?`)) {
                            deleteCenter(center.id);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                        title="Delete Center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>{center.village}, {center.district}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>Manager: {center.assignedOperator || 'Unassigned'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-purple-100/60 flex items-center justify-between text-xs font-bold">
                      <div className="text-gray-600">
                        <span className="text-purple-950 font-black">{center.activeFarmers}</span> Active Farmers
                      </div>
                      <div className="text-emerald-700 font-mono">
                        {center.dailyIntakeAvg} L/day
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. Tab 5: Dynamic Rate Chart Matrix & Pricing Mode */}
      {adminTab === 'rateChart' && (
        <div className="space-y-4">
          {/* Pricing Mode Selector Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-950">Dairy Pricing Mode & Policy Configuration</h3>
                <p className="text-xs text-gray-700 font-medium">
                  Configure how milk rates and collection totals are calculated across all centers.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-black">
                Active: {pricingMode === 'MANUAL_RATE' ? 'Manual Rate' : pricingMode === 'RATE_CHART' ? 'Rate Chart' : 'Admin Defined'}
              </span>
            </div>

            {/* Mode Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: MANUAL_RATE */}
              <button
                type="button"
                onClick={() => setPricingMode('MANUAL_RATE')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  pricingMode === 'MANUAL_RATE'
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-600'
                    : 'bg-white text-gray-800 border-gray-200 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black uppercase tracking-wider">Mode 1</span>
                    {pricingMode === 'MANUAL_RATE' && (
                      <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded-full text-emerald-200 font-bold">Active</span>
                    )}
                  </div>
                  <h4 className={`text-sm font-black mb-1 ${pricingMode === 'MANUAL_RATE' ? 'text-white' : 'text-gray-950'}`}>
                    Manual Rate Entry
                  </h4>
                  <p className={`text-[11px] ${pricingMode === 'MANUAL_RATE' ? 'text-emerald-100' : 'text-gray-600'}`}>
                    Operator manually enters Quantity, FAT %, SNF %, and Rate per Litre/Kg. Total = Quantity × Rate.
                  </p>
                </div>
              </button>

              {/* Option 2: RATE_CHART */}
              <button
                type="button"
                onClick={() => setPricingMode('RATE_CHART')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  pricingMode === 'RATE_CHART'
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-600'
                    : 'bg-white text-gray-800 border-gray-200 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black uppercase tracking-wider">Mode 2</span>
                    {pricingMode === 'RATE_CHART' && (
                      <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded-full text-emerald-200 font-bold">Active</span>
                    )}
                  </div>
                  <h4 className={`text-sm font-black mb-1 ${pricingMode === 'RATE_CHART' ? 'text-white' : 'text-gray-950'}`}>
                    FAT/SNF Rate Chart
                  </h4>
                  <p className={`text-[11px] ${pricingMode === 'RATE_CHART' ? 'text-emerald-100' : 'text-gray-600'}`}>
                    System automatically calculates rate from FAT & SNF formula matrix. Amount = Quantity × Chart Rate.
                  </p>
                </div>
              </button>

              {/* Option 3: ADMIN_DEFINED */}
              <button
                type="button"
                onClick={() => setPricingMode('ADMIN_DEFINED')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  pricingMode === 'ADMIN_DEFINED'
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-600'
                    : 'bg-white text-gray-800 border-gray-200 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black uppercase tracking-wider">Mode 3</span>
                    {pricingMode === 'ADMIN_DEFINED' && (
                      <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded-full text-emerald-200 font-bold">Active</span>
                    )}
                  </div>
                  <h4 className={`text-sm font-black mb-1 ${pricingMode === 'ADMIN_DEFINED' ? 'text-white' : 'text-gray-950'}`}>
                    Admin Fixed Rates
                  </h4>
                  <p className={`text-[11px] ${pricingMode === 'ADMIN_DEFINED' ? 'text-emerald-100' : 'text-gray-600'}`}>
                    Admin sets fixed base rates per milk type. Operator records intake with system-locked rates.
                  </p>
                </div>
              </button>
            </div>

            {/* Quality & Override Policies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <span className="text-xs font-black text-gray-950 block">Allow Operator Rate Override</span>
                  <span className="text-[10.5px] text-gray-600">Permit authorized operators to manually adjust rate in chart mode</span>
                </div>
                <input
                  type="checkbox"
                  checked={qualityValidation.allowRateOverride}
                  onChange={(e) => updateQualityValidation({ allowRateOverride: e.target.checked })}
                  className="w-5 h-5 text-emerald-600 accent-emerald-700 rounded cursor-pointer"
                />
              </label>

              <label className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <span className="text-xs font-black text-gray-950 block">Strict FAT/SNF Validation</span>
                  <span className="text-[10.5px] text-gray-600">Reject collections outside configured threshold ranges</span>
                </div>
                <input
                  type="checkbox"
                  checked={qualityValidation.strictValidation}
                  onChange={(e) => updateQualityValidation({ strictValidation: e.target.checked })}
                  className="w-5 h-5 text-emerald-600 accent-emerald-700 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100/90 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-950">Dynamic Milk Rate Matrix Configuration</h3>
                <p className="text-xs text-gray-700 font-medium">
                  Automated payout calculation: Base Rate + (Fat % × Fat Factor) + (SNF % × SNF Factor)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveRateChart}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-black shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Matrix</span>
                </button>
              </div>
            </div>

            {rateSavedAlert && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Rate chart updated! New entries across all operator terminals will calculate with this matrix.</span>
              </div>
            )}

            {/* Grid of Cow & Buffalo Config */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cow Milk Pricing */}
              <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200 space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🐄</span>
                    <h4 className="font-black text-amber-950 text-sm">Cow Milk Pricing Formula</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-200/80 text-amber-950 rounded-full">
                    Active
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800">Base Price (₹/L)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editableCowBase}
                      onChange={(e) => setEditableCowBase(Number(e.target.value))}
                      className="w-24 px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-bold font-mono text-gray-900 text-right focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800">Fat Multiplier (₹ / % Fat)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editableCowFat}
                      onChange={(e) => setEditableCowFat(Number(e.target.value))}
                      className="w-24 px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-bold font-mono text-gray-900 text-right focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800">SNF Multiplier (₹ / % SNF)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editableCowSnf}
                      onChange={(e) => setEditableCowSnf(Number(e.target.value))}
                      className="w-24 px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-bold font-mono text-gray-900 text-right focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white/80 rounded-2xl border border-amber-200 text-xs font-mono text-amber-950 font-bold">
                  Sample: 4.2% Fat + 8.6% SNF = ₹
                  {(editableCowBase + 4.2 * editableCowFat + 8.6 * editableCowSnf).toFixed(2)}/L
                </div>
              </div>

              {/* Buffalo Milk Pricing */}
              <div className="p-5 rounded-3xl bg-indigo-50/60 border border-indigo-200 space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🐃</span>
                    <h4 className="font-black text-indigo-950 text-sm">Buffalo Milk Pricing Formula</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-200/80 text-indigo-950 rounded-full">
                    Active
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800">Base Price (₹/L)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editableBuffBase}
                      onChange={(e) => setEditableBuffBase(Number(e.target.value))}
                      className="w-24 px-3 py-1.5 bg-white border border-indigo-300 rounded-xl text-xs font-bold font-mono text-gray-900 text-right focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800">Fat Multiplier (₹ / % Fat)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editableBuffFat}
                      onChange={(e) => setEditableBuffFat(Number(e.target.value))}
                      className="w-24 px-3 py-1.5 bg-white border border-indigo-300 rounded-xl text-xs font-bold font-mono text-gray-900 text-right focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800">SNF Multiplier (₹ / % SNF)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editableBuffSnf}
                      onChange={(e) => setEditableBuffSnf(Number(e.target.value))}
                      className="w-24 px-3 py-1.5 bg-white border border-indigo-300 rounded-xl text-xs font-bold font-mono text-gray-900 text-right focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white/80 rounded-2xl border border-indigo-200 text-xs font-mono text-indigo-950 font-bold">
                  Sample: 6.5% Fat + 9.0% SNF = ₹
                  {(editableBuffBase + 6.5 * editableBuffFat + 9.0 * editableBuffSnf).toFixed(2)}/L
                </div>
              </div>
            </div>

            {/* Live Interactive Rate Simulator */}
            <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-800" />
                  <h4 className="font-black text-emerald-950 text-sm">Interactive Rate Simulator</h4>
                </div>
                <span className="text-xs font-bold text-emerald-800">Test live calculations before saving</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Milk Type</label>
                  <select
                    value={simMilkType}
                    onChange={(e) => setSimMilkType(e.target.value as MilkType)}
                    className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden cursor-pointer"
                  >
                    <option value="cow">Cow Milk</option>
                    <option value="buffalo">Buffalo Milk</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Fat % ({simFat}%)</label>
                  <input
                    type="range"
                    min="3.0"
                    max="10.0"
                    step="0.1"
                    value={simFat}
                    onChange={(e) => setSimFat(Number(e.target.value))}
                    className="w-full accent-emerald-800 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">SNF % ({simSnf}%)</label>
                  <input
                    type="range"
                    min="7.5"
                    max="10.5"
                    step="0.1"
                    value={simSnf}
                    onChange={(e) => setSimSnf(Number(e.target.value))}
                    className="w-full accent-emerald-800 cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-emerald-900 text-white rounded-2xl flex flex-col justify-center items-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-300">Simulated Rate</span>
                  <div className="text-xl font-black font-mono">₹{simulatedRate.toFixed(2)}/L</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. Tab 6: Payouts & Bulk Settlement Engine */}
      {adminTab === 'payouts' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-black text-gray-950">Bulk Payout & Settlement Engine</h3>
              <p className="text-xs text-gray-700 font-medium">
                Execute batch transfers directly to farmer registered bank accounts and UPI IDs
              </p>
            </div>

            <button
              onClick={() => setIsBulkPayoutModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-black shadow-xs cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              <span>Disburse Batch (₹{pendingLiability.toLocaleString()})</span>
            </button>
          </div>

          {/* Past Settlements Log */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 font-bold text-gray-700 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Payout ID</th>
                  <th className="py-3 px-4">Farmer Details</th>
                  <th className="py-3 px-4">Settlement Cycle</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {payouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">{payout.payoutId}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-950">{payout.farmerName}</div>
                      <div className="text-[10px] text-gray-600">{payout.village}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {payout.periodStart} - {payout.periodEnd}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-900">{payout.paymentMethod}</span>
                      <div className="text-[10px] font-mono text-gray-600">{payout.paymentReference}</div>
                    </td>
                    <td className="py-3 px-4 font-black text-gray-950 font-mono">
                      ₹{payout.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>Cleared</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedPayout(payout)}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        View Voucher
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 10. Tab 7: Communication Hub (SMS & Alerts) */}
      {adminTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100/90 shadow-xs space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-950">Farmer Communication Hub</h3>
              <p className="text-xs text-gray-700 font-medium">
                Broadcast instant SMS and app alerts regarding rate updates, payouts, and center notices
              </p>
            </div>

            {broadcastSentAlert && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{broadcastSentAlert}</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-800">Target Audience</label>
                <select
                  value={broadcastAudience}
                  onChange={(e) => setBroadcastAudience(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden cursor-pointer"
                >
                  <option value="all">All Registered Farmers ({farmers.length} Farmers)</option>
                  <option value="pending_kyc">Farmers with Pending KYC Only</option>
                  <option value="kheda">Kheda Hub #01 Suppliers Only</option>
                  <option value="anand">Anand Central Suppliers Only</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-800">Alert Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'rate', label: 'Rate Revision' },
                    { id: 'payout', label: 'Payout Released' },
                    { id: 'announcement', label: 'Center Notice' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setBroadcastCategory(cat.id as any)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        broadcastCategory === cat.id
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-800">Alert Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Milk Base Rate Increased by ₹1.50/L"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-800">Detailed Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Type clear notice message in English or local language..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send SMS & In-App Broadcast</span>
              </button>
            </form>
          </div>

          {/* Quick Pre-saved Templates */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-emerald-100/90 shadow-xs space-y-3">
              <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider">
                Quick Alert Templates
              </h4>
              <div className="space-y-2">
                {[
                  {
                    title: 'Center Holiday Notice',
                    text: 'Evening collection shift on 18th May will operate with 1 hour extended timing (05:00 PM - 09:00 PM).',
                  },
                  {
                    title: 'Veterinary Checkup Camp',
                    text: 'Free cattle deworming & vaccination camp at Rudu Farm Center this Sunday 10 AM.',
                  },
                  {
                    title: 'Pending KYC Reminder',
                    text: 'Please submit your bank passbook copy at the collection terminal to avoid payout delays.',
                  },
                ].map((tpl, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setBroadcastTitle(tpl.title);
                      setBroadcastMessage(tpl.text);
                    }}
                    className="p-3 bg-gray-50 hover:bg-emerald-50 rounded-2xl border border-gray-200 hover:border-emerald-300 transition-all cursor-pointer space-y-1"
                  >
                    <div className="font-bold text-xs text-gray-950">{tpl.title}</div>
                    <p className="text-[11px] text-gray-600 line-clamp-2">{tpl.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. Tab 8: Centralized Print & ERP Document System */}
      {adminTab === 'reports' && <PrintDocumentsView />}

      {/* 5. Tab: SMS Notification Gateway Settings & Audit Trail */}
      {adminTab === 'smsSettings' && <SmsSettingsView />}

      {/* Operator Add Modal */}
      <AddOperatorModal
        isOpen={isAddOperatorModalOpen}
        onClose={() => setIsAddOperatorModalOpen(false)}
      />

      {/* Operator Edit Modal */}
      <EditOperatorModal
        operator={editingOperator}
        onClose={() => setEditingOperator(null)}
      />

      {/* Add Collection Center Modal */}
      <AddCenterModal
        isOpen={isAddCenterModalOpen}
        onClose={() => setIsAddCenterModalOpen(false)}
      />
    </div>
  );
};
