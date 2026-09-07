import React, { useState } from 'react';
import { Bell, Globe, ChevronDown, Check, LogOut, Cloud } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RuduFarmLogo, FarmerAvatar } from './Illustrations';
import { LanguageCode } from '../../types';

export const Header: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    unreadNotificationCount,
    setIsNotificationsOpen,
    setIsGoogleDriveModalOpen,
    language,
    setLanguage,
    userRole,
    currentFarmer,
    logout,
    t,
  } = useApp();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const languages: Array<{ code: LanguageCode; label: string; native: string }> = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  const navItems: Array<{ id: 'dashboard' | 'collection' | 'payouts' | 'ledger' | 'profile'; label: string }> = [
    { id: 'dashboard', label: t.dashboard },
    { id: 'collection', label: t.collection },
    { id: 'payouts', label: t.payouts },
    { id: 'ledger', label: t.ledger },
    { id: 'profile', label: t.profile },
  ];

  const rolePortalLabel = userRole === 'admin'
    ? '👑 Admin (Full Control)'
    : userRole === 'employee'
    ? '🧑🌾 Operator Terminal'
    : '🌾 Farmer Portal';

  const rolePortalColor = userRole === 'admin'
    ? 'bg-purple-50 text-purple-900 border-purple-200'
    : userRole === 'employee'
    ? 'bg-amber-50 text-amber-900 border-amber-200'
    : 'bg-emerald-50 text-emerald-900 border-emerald-200';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs px-3 sm:px-6 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            onClick={() => setCurrentTab('dashboard')}
            className="cursor-pointer select-none flex items-center gap-2"
          >
            <RuduFarmLogo size={34} />
          </div>

          {/* Read-only portal badge for admin/operator — no switcher */}
          {rolePortalLabel && (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold border shadow-2xs ${rolePortalColor}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {rolePortalLabel}
            </span>
          )}
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 shrink-0 bg-emerald-50/60 p-1 rounded-2xl border border-emerald-100/80">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100/70'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Language, Drive, Notifications, Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-bold bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 rounded-xl px-2.5 sm:px-3 py-1.5 transition-all cursor-pointer whitespace-nowrap shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">{currentLangObj.native}</span>
              <span className="sm:hidden">{currentLangObj.code.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-emerald-600" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-emerald-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100">
                  Select Language
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold hover:bg-emerald-50 text-left transition-colors cursor-pointer ${
                      language === lang.code ? 'text-emerald-700 bg-emerald-50/60 font-bold' : 'text-gray-700'
                    }`}
                  >
                    <span>{lang.native} ({lang.label})</span>
                    {language === lang.code && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Google Drive Cloud Vault Button */}
          <button
            onClick={() => setIsGoogleDriveModalOpen(true)}
            aria-label="Google Drive Cloud Vault"
            className="flex items-center gap-1 text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200/80 rounded-xl px-2.5 sm:px-3 py-1.5 transition-all cursor-pointer whitespace-nowrap shadow-2xs active:scale-95"
            title="Google Drive Cloud Backup & Vault"
          >
            <Cloud className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Drive Vault</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            aria-label="Notifications"
            className="relative w-9 h-9 rounded-full bg-white hover:bg-emerald-50 border border-emerald-200/80 text-emerald-800 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Bell className="w-4 h-4 text-emerald-800" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Farmer Profile Avatar */}
          {userRole === 'farmer' && (
            <div
              onClick={() => setCurrentTab('profile')}
              className="cursor-pointer active:scale-95 transition-all"
              title={`${currentFarmer?.name || 'Farmer'} (${currentFarmer?.farmerCode || 'RF'})`}
            >
              <FarmerAvatar size={38} />
            </div>
          )}

          {/* Logout for admin / operator */}
          {(userRole === 'admin' || userRole === 'employee') && (
            <button
              onClick={() => {
                logout();
                // Redirect back to portal-specific login page
                if (userRole === 'admin') window.location.href = '/admin';
                else window.location.href = '/operator';
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
