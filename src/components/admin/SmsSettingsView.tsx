import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Search,
  Shield,
  Sliders,
  Check,
  RotateCcw,
  Zap,
  BookOpen,
  Lock,
  Layers,
  FileText,
  Eye,
  X,
} from 'lucide-react';
import {
  TenantSmsSettings,
  SmsNotificationRecord,
  SmsTemplateType,
  SmsStatus,
  DEFAULT_SMS_SETTINGS,
} from '../../services/notification/sms.types';
import {
  getTenantSmsSettings,
  updateTenantSmsSettings,
  fetchTenantSmsLogs,
  retrySmsNotification,
} from '../../services/notification/sms.service';
import { NotificationService } from '../../services/notification/notification.service';
import { MASTER_SMS_TEMPLATES, SmsTemplateDefinition } from '../../services/notification/sms.templates';
import { DEFAULT_TENANT_ID } from '../../lib/firebase/firestore';

export const SmsSettingsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'settings' | 'templates' | 'logs'>('settings');
  const [settings, setSettings] = useState<TenantSmsSettings>(DEFAULT_SMS_SETTINGS);
  const [logs, setLogs] = useState<SmsNotificationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Test SMS form state
  const [testPhone, setTestPhone] = useState('');
  const [testTemplate, setTestTemplate] = useState<SmsTemplateType>('CUSTOM');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Filter & Search state for logs
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [selectedLogForDetails, setSelectedLogForDetails] = useState<SmsNotificationRecord | null>(null);

  // Template Search state
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>('ALL');

  // Load initial settings and logs
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedSettings, fetchedLogs] = await Promise.all([
        getTenantSmsSettings(DEFAULT_TENANT_ID),
        fetchTenantSmsLogs(DEFAULT_TENANT_ID, 50),
      ]);
      setSettings(fetchedSettings);
      setLogs(fetchedLogs);
    } catch (err) {
      console.warn('[SmsSettingsView] Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleSetting = async (key: keyof TenantSmsSettings) => {
    if (key === 'otpSms' || key === 'securityAlertsSms') {
      alert('Security & OTP alerts are mandatory and cannot be disabled.');
      return;
    }

    const updated = {
      ...settings,
      [key]: !settings[key],
    };
    setSettings(updated);
    setIsSaving(true);
    try {
      await updateTenantSmsSettings(DEFAULT_TENANT_ID, updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('[SmsSettingsView] Error updating settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone) return;

    setIsSendingTest(true);
    setTestResult(null);

    try {
      const res = await NotificationService.sendTestSMS({
        phone: testPhone,
        templateType: testTemplate,
        tenantId: DEFAULT_TENANT_ID,
        role: 'admin',
      });

      if (res.success) {
        setTestResult({
          success: true,
          message: res.message || 'Test SMS sent successfully!',
        });
        setTestPhone('');
        loadData();
      } else {
        setTestResult({
          success: false,
          message: res.error || 'Failed to dispatch test SMS',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Network error occurred while dispatching test SMS',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleRetry = async (notificationId: string) => {
    setRetryingId(notificationId);
    try {
      const res = await retrySmsNotification(DEFAULT_TENANT_ID, notificationId);
      if (res.success) {
        const updatedLogs = await fetchTenantSmsLogs(DEFAULT_TENANT_ID, 50);
        setLogs(updatedLogs);
      } else {
        alert(res.message);
      }
    } catch (err: any) {
      alert(err.message || 'Error retrying SMS');
    } finally {
      setRetryingId(null);
    }
  };

  // Filtered logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.referenceId && log.referenceId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.providerMessageId && log.providerMessageId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || log.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Filtered templates
  const templateList = Object.values(MASTER_SMS_TEMPLATES).filter((tmpl) => {
    const matchesSearch =
      tmpl.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
      tmpl.key.toLowerCase().includes(templateSearch.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(templateSearch.toLowerCase());

    const matchesCat = templateCategoryFilter === 'ALL' || tmpl.category === templateCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const getPriorityBadge = (priority: string = 'NORMAL') => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-red-100 text-red-800 border border-red-200">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">HIGH</span>;
      case 'NORMAL':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">NORMAL</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-gray-100 text-gray-800 border border-gray-200">LOW</span>;
    }
  };

  const getStatusBadge = (status: SmsStatus) => {
    switch (status) {
      case 'SENT':
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {status}
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-300">
            <XCircle className="w-3 h-3 text-red-600" />
            FAILED
          </span>
        );
      case 'SENDING':
      case 'QUEUED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600 animate-spin" />
            {status}
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-300">
            CANCELLED
          </span>
        );
      default:
        return <span className="text-xs text-gray-500">{status}</span>;
    }
  };

  const getTypeBadge = (type: SmsTemplateType) => {
    const def = MASTER_SMS_TEMPLATES[type];
    const categoryColors: Record<string, string> = {
      transactional: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      authentication: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      security: 'bg-red-50 text-red-800 border-red-200',
      session: 'bg-amber-50 text-amber-800 border-amber-200',
      statement: 'bg-teal-50 text-teal-800 border-teal-200',
      alert: 'bg-rose-50 text-rose-800 border-rose-200',
      announcement: 'bg-blue-50 text-blue-800 border-blue-200',
      general: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    const color = (def && categoryColors[def.category]) || 'bg-gray-100 text-gray-800 border-gray-200';
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border ${color}`}>
        {def?.name || type}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Header Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black uppercase">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Centralized Master Notification Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              SMS Gateway, Master Templates & Audit Trail
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Manage 26 DLT-compliant templates, tenant dispatch switches, live simulation, and delivery history.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-bold animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Settings Saved</span>
              </div>
            )}
            <button
              onClick={loadData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-100">
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'settings'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Switches & Test Console</span>
          </button>

          <button
            onClick={() => setActiveSubTab('templates')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'templates'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Master Templates (26)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('logs')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'logs'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Delivery Logs ({logs.length})</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-TAB 1: Settings & Test Console */}
      {activeSubTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Toggles (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Tenant Transactional Switches</h3>
                  <p className="text-[11px] text-gray-500">Configure outbound triggers for this tenant</p>
                </div>
              </div>
              {isSaving && <span className="text-[11px] font-bold text-emerald-600">Updating...</span>}
            </div>

            {/* Master Toggle */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                  Global SMS Service
                </div>
                <div className="text-xs text-emerald-800">
                  Master switch for all non-mandatory SMS notifications across this tenant.
                </div>
              </div>
              <button
                onClick={() => handleToggleSetting('smsEnabled')}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  settings.smsEnabled ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Category Switches Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* Milk Collection */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-900">🥛 Milk Collection SMS</div>
                  <div className="text-[11px] text-gray-500">Intake receipts to farmers</div>
                </div>
                <button
                  onClick={() => handleToggleSetting('milkCollectionSms')}
                  disabled={!settings.smsEnabled}
                  className={`w-11 h-5.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer disabled:opacity-40 ${
                    settings.milkCollectionSms ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
                  }`}
                >
                  <div className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              {/* Payment Success */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-900">💰 Payment Credit SMS</div>
                  <div className="text-[11px] text-gray-500">Payout & settlement alerts</div>
                </div>
                <button
                  onClick={() => handleToggleSetting('paymentSms')}
                  disabled={!settings.smsEnabled}
                  className={`w-11 h-5.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer disabled:opacity-40 ${
                    settings.paymentSms ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
                  }`}
                >
                  <div className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              {/* Advance Created */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-900">💳 Advance Issued SMS</div>
                  <div className="text-[11px] text-gray-500">Feed & advance debit alerts</div>
                </div>
                <button
                  onClick={() => handleToggleSetting('advanceSms')}
                  disabled={!settings.smsEnabled}
                  className={`w-11 h-5.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer disabled:opacity-40 ${
                    settings.advanceSms ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
                  }`}
                >
                  <div className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              {/* Monthly Statement */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-900">📊 Monthly Statement SMS</div>
                  <div className="text-[11px] text-gray-500">Cycle billing summaries</div>
                </div>
                <button
                  onClick={() => handleToggleSetting('monthlyStatementSms')}
                  disabled={!settings.smsEnabled}
                  className={`w-11 h-5.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer disabled:opacity-40 ${
                    settings.monthlyStatementSms ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
                  }`}
                >
                  <div className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              {/* Operator Session */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-900">🕒 Operator Session SMS</div>
                  <div className="text-[11px] text-gray-500">Login, extend, & logout shifts</div>
                </div>
                <button
                  onClick={() => handleToggleSetting('operatorSessionSms')}
                  disabled={!settings.smsEnabled}
                  className={`w-11 h-5.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer disabled:opacity-40 ${
                    settings.operatorSessionSms ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
                  }`}
                >
                  <div className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              {/* Rate Chart Revision */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-900">📈 Rate Chart Change SMS</div>
                  <div className="text-[11px] text-gray-500">Base price updates</div>
                </div>
                <button
                  onClick={() => handleToggleSetting('rateChangeSms')}
                  disabled={!settings.smsEnabled}
                  className={`w-11 h-5.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer disabled:opacity-40 ${
                    settings.rateChangeSms ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
                  }`}
                >
                  <div className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              {/* Security OTP (MANDATORY) */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <span>🔐 Login OTP SMS</span>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-200/80 text-[9px] font-black text-emerald-900">
                      <Lock className="w-2.5 h-2.5" /> MANDATORY
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-800">Auth verification codes</div>
                </div>
                <div className="w-11 h-5.5 flex items-center rounded-full p-0.5 bg-emerald-600 justify-end opacity-90 cursor-not-allowed">
                  <div className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
                </div>
              </div>

              {/* Security Alerts (MANDATORY) */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <span>🛡️ Security Alerts</span>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-200/80 text-[9px] font-black text-emerald-900">
                      <Lock className="w-2.5 h-2.5" /> MANDATORY
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-800">Password change & lock alerts</div>
                </div>
                <div className="w-11 h-5.5 flex items-center rounded-full p-0.5 bg-emerald-600 justify-end opacity-90 cursor-not-allowed">
                  <div className="w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Send Test SMS Box (1 Col) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Master Test Dispatcher</h3>
                  <p className="text-[11px] text-gray-500">Test any template via server API</p>
                </div>
              </div>

              <form onSubmit={handleSendTestSms} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Select Template to Test
                  </label>
                  <select
                    value={testTemplate}
                    onChange={(e) => setTestTemplate(e.target.value as SmsTemplateType)}
                    className="w-full px-3 py-2 text-xs font-bold bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="CUSTOM">Custom Gateway Ping</option>
                    <option value="MILK_COLLECTION">MILK_COLLECTION (Intake Slip)</option>
                    <option value="PAYMENT_SUCCESS">PAYMENT_SUCCESS (Payout)</option>
                    <option value="ADVANCE_CREATED">ADVANCE_CREATED (Advance)</option>
                    <option value="OTP_LOGIN">OTP_LOGIN (Security OTP)</option>
                    <option value="OPERATOR_LOGIN">OPERATOR_LOGIN (Session Start)</option>
                    <option value="RATE_CHANGE">RATE_CHANGE (Price Matrix)</option>
                    <option value="MONTHLY_STATEMENT">MONTHLY_STATEMENT (Statement)</option>
                    <option value="ACCOUNT_CREATED">ACCOUNT_CREATED (Welcome)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Recipient Mobile (+91)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">+91</span>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      maxLength={13}
                      className="w-full pl-11 pr-3 py-2 text-xs font-bold bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingTest || !testPhone}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${isSendingTest ? 'animate-bounce' : ''}`} />
                  <span>{isSendingTest ? 'Dispatching...' : 'Dispatch Test SMS'}</span>
                </button>
              </form>

              {testResult && (
                <div
                  className={`mt-3 p-3 rounded-2xl text-xs font-medium flex items-start gap-2 ${
                    testResult.success
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-red-50 text-red-900 border border-red-200'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Rate-limited to 5 test dispatches/min for security.</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. SUB-TAB 2: Master Templates Catalog */}
      {activeSubTab === 'templates' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-black text-gray-950">Master SMS Template Catalog</h3>
              <p className="text-xs text-gray-500">
                26 standardized templates categorized for Farmer, Authentication, Operator, Admin Alerts, and Security.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <select
                value={templateCategoryFilter}
                onChange={(e) => setTemplateCategoryFilter(e.target.value)}
                className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="transactional">Transactional</option>
                <option value="authentication">Authentication</option>
                <option value="security">Security</option>
                <option value="session">Session</option>
                <option value="alert">Admin Alerts</option>
                <option value="statement">Statements</option>
                <option value="announcement">Announcements</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templateList.map((tmpl) => (
              <div
                key={tmpl.key}
                className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-black text-emerald-950">{tmpl.key}</span>
                    <div className="flex items-center gap-1.5">
                      {getPriorityBadge(tmpl.priority)}
                      {tmpl.isMandatory && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-200 text-emerald-900">
                          MANDATORY
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-gray-900">{tmpl.name}</h4>
                  <p className="text-[11px] text-gray-500">{tmpl.description}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-gray-200 text-[11px] font-sans text-gray-800">
                  {tmpl.defaultTemplateText}
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-100 font-mono">
                  <span>Env: {tmpl.envTemplateKey}</span>
                  <span className="capitalize font-bold text-gray-700">For: {tmpl.recipient}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SUB-TAB 3: Delivery Logs Table */}
      {activeSubTab === 'logs' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-gray-950">SMS Delivery Audit Trail</h3>
              <p className="text-xs text-gray-500">
                Audited logs of all outbound notifications with delivery statuses, message IDs, and failure reasons.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search phone / ref..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-44 pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="SENT">SENT</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="FAILED">FAILED</option>
                <option value="QUEUED">QUEUED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="MILK_COLLECTION">Milk Intake</option>
                <option value="PAYMENT_SUCCESS">Payment</option>
                <option value="ADVANCE_CREATED">Advance</option>
                <option value="OTP_LOGIN">OTP Login</option>
                <option value="OPERATOR_LOGIN">Operator Login</option>
                <option value="RATE_CHANGE">Rate Change</option>
                <option value="MONTHLY_STATEMENT">Statement</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Recipient</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Reference / ID</th>
                  <th className="py-2.5 px-3">Dispatched At</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No SMS notification records found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-gray-900">
                        +91 {log.recipient}
                      </td>
                      <td className="py-3 px-3">
                        {getTypeBadge(log.type)}
                      </td>
                      <td className="py-3 px-3">
                        {getStatusBadge(log.status)}
                        {log.failureReason && (
                          <div className="text-[10px] text-red-500 font-medium mt-0.5 truncate max-w-xs">
                            {log.failureReason}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-gray-500">
                        {log.referenceId || log.providerMessageId || log.id}
                      </td>
                      <td className="py-3 px-3 text-gray-500 text-[11px]">
                        {new Date(log.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedLogForDetails(log)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                            title="View log details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {log.status === 'FAILED' && (
                            <button
                              onClick={() => handleRetry(log.id)}
                              disabled={retryingId === log.id || (log.retryCount || 0) >= 3}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] border border-amber-200 cursor-pointer disabled:opacity-40"
                              title={`Retry count: ${log.retryCount || 0}/3`}
                            >
                              <RotateCcw className={`w-3 h-3 ${retryingId === log.id ? 'animate-spin' : ''}`} />
                              <span>Retry ({log.retryCount || 0}/3)</span>
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
      )}

      {/* 5. Log Details Modal */}
      {selectedLogForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 animate-in fade-in duration-150">
            <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-300" />
                <h3 className="font-bold text-sm">SMS Notification Record Details</h3>
              </div>
              <button
                onClick={() => setSelectedLogForDetails(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-gray-50">
                  <span className="text-gray-400 font-bold uppercase text-[10px] block">Record ID</span>
                  <span className="font-mono font-bold text-gray-900">{selectedLogForDetails.id}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50">
                  <span className="text-gray-400 font-bold uppercase text-[10px] block">Tenant ID</span>
                  <span className="font-mono font-bold text-gray-900">{selectedLogForDetails.tenantId}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50">
                  <span className="text-gray-400 font-bold uppercase text-[10px] block">Recipient</span>
                  <span className="font-bold text-gray-900">+91 {selectedLogForDetails.recipient}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50">
                  <span className="text-gray-400 font-bold uppercase text-[10px] block">Status</span>
                  <span>{getStatusBadge(selectedLogForDetails.status)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 space-y-1">
                <span className="text-gray-400 font-bold uppercase text-[10px] block">Template Key</span>
                <span className="font-mono font-bold text-emerald-900">{selectedLogForDetails.type}</span>
              </div>

              {selectedLogForDetails.failureReason && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 space-y-1">
                  <span className="font-bold text-[10px] uppercase block text-red-700">Failure Reason</span>
                  <span>{selectedLogForDetails.failureReason}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-gray-50 space-y-1">
                <span className="text-gray-400 font-bold uppercase text-[10px] block">Metadata & Variables</span>
                <pre className="font-mono text-[11px] bg-white p-2 rounded-lg border border-gray-200 overflow-x-auto">
                  {JSON.stringify(selectedLogForDetails.metadata || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedLogForDetails(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
