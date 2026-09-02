import React, { useState, useEffect } from 'react';
import {
  Building,
  ShieldCheck,
  LogOut,
  Globe,
  Edit2,
  CheckCircle2,
  BadgeCheck,
  Check,
  CreditCard,
  Phone,
  Calendar,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FarmLandscapeHeader, ThreeDIcons, FarmerAvatar } from '../common/Illustrations';
import { AdminProfileView } from './AdminProfileView';
import { OperatorProfileView } from './OperatorProfileView';

export const BankProfileView: React.FC = () => {
  const {
    userRole,
    currentFarmer,
    updateFarmer,
    logout,
    setIsLanguageModalOpen,
    setIsSupportModalOpen,
    setCurrentTab,
    language,
    t,
  } = useApp();

  if (userRole === 'admin') {
    return <AdminProfileView />;
  }

  if (userRole === 'employee') {
    return <OperatorProfileView />;
  }

  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [upiInput, setUpiInput] = useState(currentFarmer?.bankDetails?.upiId || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentFarmer?.bankDetails?.upiId) {
      setUpiInput(currentFarmer.bankDetails.upiId);
    }
  }, [currentFarmer?.bankDetails?.upiId]);

  const handleSaveUpi = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUpi = upiInput.trim();
    if (currentFarmer?.id) {
      updateFarmer(currentFarmer.id, {
        bankDetails: {
          ...(currentFarmer.bankDetails || {
            accountHolder: currentFarmer.name || 'Farmer',
            bankName: 'State Bank of India',
            accountNumber: 'XXXX-XXXX-0000',
            ifscCode: 'SBIN0001000',
            kycStatus: 'Verified',
          }),
          upiId: cleanUpi,
        },
      });
    }
    setIsEditingUpi(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
    <div className="space-y-4 pb-28 max-w-5xl mx-auto">
      {/* Top Green Landscape Header */}
      <FarmLandscapeHeader
        title={t.bankProfileDetails}
        subtitle="Manage your KYC details, registered bank account and dairy preferences."
        onBack={() => setCurrentTab('dashboard')}
      />

      <div className="px-3 sm:px-4 space-y-4 -mt-4">
        {/* Top Farmer Identity Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <FarmerAvatar size={64} />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-gray-950 tracking-tight">
                  {currentFarmer?.name || 'Farmer'}
                </h2>
                <BadgeCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-xs text-gray-700 font-medium">
                Farmer ID: <span className="font-mono font-bold text-gray-900">{currentFarmer?.farmerCode || 'RF7237'}</span> • 📍 {currentFarmer?.village || 'Kheda'}, {currentFarmer?.district || 'Anand'}
              </div>
              <div className="text-[11px] text-emerald-800 font-semibold">
                Active Member since {currentFarmer?.memberSince || '2024'}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Bank Account Details */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Building className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-gray-950">
                  {t.bankDetails}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {currentFarmer?.bankDetails?.kycStatus || 'Verified'}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-700 font-medium">Bank Name</span>
                <span className="font-bold text-gray-900">{currentFarmer?.bankDetails?.bankName || 'State Bank of India'}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-700 font-medium">Account Number</span>
                <span className="font-bold font-mono text-gray-900">{currentFarmer?.bankDetails?.accountNumber || 'XXXX-XXXX-7447'}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-700 font-medium">IFSC Code</span>
                <span className="font-bold font-mono text-gray-900">{currentFarmer?.bankDetails?.ifscCode || 'SBIN0004829'}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-700 font-medium">Account Holder</span>
                <span className="font-bold text-gray-900">{currentFarmer?.bankDetails?.accountHolder || currentFarmer?.name || 'abhi'}</span>
              </div>

              <div className="flex justify-between py-1.5 items-center">
                <span className="text-gray-700 font-medium">UPI ID</span>
                {!isEditingUpi ? (
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-gray-900">{currentFarmer?.bankDetails?.upiId || '6396941307@upi'}</span>
                    <button
                      onClick={() => setIsEditingUpi(true)}
                      className="p-1 text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                      title="Edit UPI"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSaveUpi} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={upiInput}
                      onChange={(e) => setUpiInput(e.target.value)}
                      className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono font-medium outline-none focus:border-emerald-600"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Save
                    </button>
                  </form>
                )}
              </div>

              {savedSuccess && (
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  UPI ID updated successfully!
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Cattle Herd & App Preferences */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <span className="text-base">🐄</span>
                </div>
                <h3 className="text-sm font-black text-gray-950">
                  {t.cattleDetails} ({currentFarmer.cattleCount})
                </h3>
              </div>
              <span className="text-[10.5px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                RFID Tagged
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-[10.5px] font-semibold text-gray-700 block">Total Cattle</span>
                <span className="text-lg font-black text-emerald-950">{currentFarmer.cattleCount}</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
                <span className="text-[10.5px] font-semibold text-gray-700 block">Gir Cows</span>
                <span className="text-lg font-black text-amber-950">{currentFarmer.cowCount}</span>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
                <span className="text-[10.5px] font-semibold text-gray-700 block">Murrah Buffs</span>
                <span className="text-lg font-black text-purple-950">{currentFarmer.buffaloCount}</span>
              </div>
            </div>

            {/* Language & Support section */}
            <div className="pt-3 border-t border-gray-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                  <Globe className="w-4 h-4 text-emerald-700" />
                  <span>{t.language}</span>
                </div>
                <button
                  onClick={() => setIsLanguageModalOpen(true)}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                >
                  {getLanguageName(language)} →
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  <span>{t.contactSupport}</span>
                </div>
                <button
                  onClick={() => setIsSupportModalOpen(true)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Help Desk
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
