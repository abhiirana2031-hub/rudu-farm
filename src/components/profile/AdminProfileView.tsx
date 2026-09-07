import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  LogOut,
  Key,
  Users,
  Award,
  CheckCircle2,
  Lock,
  Globe,
  HelpCircle,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FarmLandscapeHeader } from '../common/Illustrations';
import { saveDocument, COLLECTIONS } from '../../services/firebase';

export const AdminProfileView: React.FC = () => {
  const { logout, setCurrentTab, farmers, milkEntries, payouts, rateChart, setIsLanguageModalOpen, setIsSupportModalOpen, language } = useApp();

  // Admin profile state from storage
  const [adminProfile, setAdminProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('rudu_admin_profile');
      return saved ? JSON.parse(saved) : {
        name: 'Dairy Owner / Executive Admin',
        email: 'abhayrana8272@gmail.com',
        phone: '+91 99999 88888',
        password: 'Admin@#005',
      };
    } catch {
      return {
        name: 'Dairy Owner / Executive Admin',
        email: 'abhayrana8272@gmail.com',
        phone: '+91 99999 88888',
        password: 'Admin@#005',
      };
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(adminProfile.name);
  const [editPhone, setEditPhone] = useState(adminProfile.phone);
  const [editEmail, setEditEmail] = useState(adminProfile.email);
  const [editPassword, setEditPassword] = useState(adminProfile.password);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      name: editName.trim() || 'Dairy Owner',
      phone: editPhone.trim(),
      email: editEmail.trim(),
      password: editPassword.trim(),
    };
    setAdminProfile(updated);
    localStorage.setItem('rudu_admin_profile', JSON.stringify(updated));

    // Save to Firestore if available
    saveDocument(COLLECTIONS.USERS || 'users', 'admin-master', {
      ...updated,
      role: 'SUPER_ADMIN',
      updatedAt: new Date().toISOString(),
    }).catch(console.warn);

    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
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
    <div className="space-y-4 pb-28 max-w-5xl mx-auto px-3 sm:px-4">
      {/* Landscape Header */}
      <FarmLandscapeHeader
        title="Admin Profile & Control Console"
        subtitle="Manage your dairy profile, executive phone number, and security password."
        onBack={() => setCurrentTab('dashboard')}
      />

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Admin profile & security credentials successfully updated!</span>
        </div>
      )}

      {/* 1. Admin Identity Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-800 text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {adminProfile.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold text-[11px] uppercase tracking-wide">
                  Owner
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">
                Rudu Dairy Farm · Enterprise Administration Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setEditName(adminProfile.name);
                setEditPhone(adminProfile.phone);
                setEditEmail(adminProfile.email);
                setEditPassword(adminProfile.password);
                setIsEditing(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold transition-all cursor-pointer border border-purple-200"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Details & Password</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-rose-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Contact & Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
            <Mail className="w-4 h-4 text-purple-600 shrink-0" />
            <div className="min-w-0">
              <span className="block text-[10px] font-bold text-gray-400 uppercase">Admin Email</span>
              <span className="text-xs font-bold text-gray-800 truncate block">{adminProfile.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
            <Phone className="w-4 h-4 text-purple-600 shrink-0" />
            <div className="min-w-0">
              <span className="block text-[10px] font-bold text-gray-400 uppercase">Phone Number</span>
              <span className="text-xs font-bold text-gray-800 truncate block">{adminProfile.phone}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
            <Key className="w-4 h-4 text-purple-600 shrink-0" />
            <div className="min-w-0">
              <span className="block text-[10px] font-bold text-gray-400 uppercase">Password / Passcode</span>
              <span className="text-xs font-bold text-gray-800 truncate block font-mono">••••••••</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dairy Operation Statistics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-3xl p-5 border border-purple-50 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-1">
            <Users className="w-4 h-4 text-purple-600" />
            <span>Registered Farmers</span>
          </div>
          <div className="text-2xl font-black text-gray-900 font-mono">
            {farmers.length}
          </div>
          <span className="text-[11px] font-semibold text-emerald-600">Active Supply Base</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-purple-50 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-1">
            <Building2 className="w-4 h-4 text-purple-600" />
            <span>Total Intake Logs</span>
          </div>
          <div className="text-2xl font-black text-gray-900 font-mono">
            {milkEntries.length}
          </div>
          <span className="text-[11px] font-semibold text-emerald-600">Verified Slips</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-purple-50 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-1">
            <Award className="w-4 h-4 text-purple-600" />
            <span>Base Cow Rate</span>
          </div>
          <div className="text-2xl font-black text-gray-900 font-mono">
            ₹{rateChart.cowBaseRate || 52}/L
          </div>
          <span className="text-[11px] font-semibold text-purple-600">Active Matrix</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-purple-50 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Payout Records</span>
          </div>
          <div className="text-2xl font-black text-gray-900 font-mono">
            {payouts.length}
          </div>
          <span className="text-[11px] font-semibold text-emerald-600">Settled Clean</span>
        </div>
      </div>

      {/* 3. Security & App Preferences */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs space-y-4">
        <h3 className="text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Lock className="w-4 h-4 text-purple-600" />
          <span>System Preferences</span>
        </h3>

        <div className="divide-y divide-gray-100">
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-800 block">System Language</span>
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
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-800 block">System Diagnostics & Support</span>
                <span className="text-[11px] font-medium text-gray-500">Fast2SMS Gateway, SMS Logs</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSupportModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              System Info
            </button>
          </div>
        </div>
      </div>

      {/* Edit Admin Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-purple-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  👑
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Edit Admin Profile</h3>
                  <p className="text-[11px] font-semibold text-gray-500">Update your phone number & password</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Admin Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mobile Number</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:border-purple-600"
                  placeholder="+91 99999 88888"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Admin Email / Username</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">New Password / Security PIN</label>
                <input
                  type="text"
                  required
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 font-mono outline-none focus:border-purple-600"
                  placeholder="Enter password or PIN"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
