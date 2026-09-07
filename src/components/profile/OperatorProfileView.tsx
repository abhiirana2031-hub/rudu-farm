import React from 'react';
import {
  ShieldCheck,
  Building2,
  Phone,
  LogOut,
  Clock,
  CheckCircle2,
  Globe,
  HelpCircle,
  Smartphone,
  MapPin,
  Flame,
  Sun,
  Moon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FarmLandscapeHeader } from '../common/Illustrations';

export const OperatorProfileView: React.FC = () => {
  const { logout, setCurrentTab, operatorShift, setOperatorShift, milkEntries, setIsLanguageModalOpen, setIsSupportModalOpen, language } = useApp();

  const savedOpStr = localStorage.getItem('rudu_current_operator');
  const opData = savedOpStr ? JSON.parse(savedOpStr) : {
    name: 'Ramesh Patel',
    employeeCode: 'OP-101',
    phone: '+91 98765 43210',
    center: 'Kheda Main Center #01',
    role: 'Center Incharge',
    email: 'ramesh.kheda@rudufarm.com',
  };

  const getLanguageName = (code: string) => {
    switch (code) {
      case 'hi': return 'हिन्दी (Hindi)';
      case 'gu': return 'ગુજરાતી (Gujarati)';
      case 'pa': return 'ਪੰਜਾਬੀ (Punjabi)';
      case 'mr': return 'मराठी (Marathi)';
      default: return 'English';
    }
  };

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto px-2 sm:px-4">
      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-emerald-100">
              {opData.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">{opData.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black border border-emerald-200">
                  {opData.role || 'Center Operator'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 font-medium">
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded-md text-gray-700 font-bold">{opData.employeeCode}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-gray-700">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{opData.center}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Terminal</span>
          </button>
        </div>

        {/* Shift Controls and Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/80 border border-gray-100">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <span className="block text-[10px] font-bold text-gray-400 uppercase">Operator Mobile</span>
              <span className="text-xs font-bold text-gray-800 truncate block">{opData.phone || '+91 98765 43210'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/80 border border-gray-100">
            <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <span className="block text-[10px] font-bold text-gray-400 uppercase">Current Shift</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {operatorShift === 'morning' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-bold text-amber-900">Morning Shift</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-950">Evening Shift</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/80 border border-gray-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <span className="block text-[10px] font-bold text-gray-400 uppercase">Hardware Link</span>
              <span className="text-xs font-bold text-emerald-700 truncate block">Fat Analyzer & Scale OK</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Active Shift Switcher */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
        <h3 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>Active Shift Selection</span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setOperatorShift('morning')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
              operatorShift === 'morning'
                ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-200 shadow-xs'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${operatorShift === 'morning' ? 'bg-amber-400 text-amber-950' : 'bg-gray-200 text-gray-600'}`}>
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-black text-gray-900">Morning Shift</div>
              <div className="text-xs text-gray-500 font-semibold mt-0.5">05:30 AM – 10:30 AM</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setOperatorShift('evening')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
              operatorShift === 'evening'
                ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-200 shadow-xs'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${operatorShift === 'evening' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-black text-gray-900">Evening Shift</div>
              <div className="text-xs text-gray-500 font-semibold mt-0.5">04:30 PM – 09:30 PM</div>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Language & Support */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs space-y-4">
        <h3 className="text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-600" />
          <span>Terminal Preferences</span>
        </h3>

        <div className="divide-y divide-gray-100">
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-800 block">Terminal Language</span>
                <span className="text-[11px] font-medium text-gray-500">{getLanguageName(language)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Change Language
            </button>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-800 block">Support & Troubleshooting</span>
                <span className="text-[11px] font-medium text-gray-500">Contact Dairy Admin Desk</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSupportModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Help Desk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
