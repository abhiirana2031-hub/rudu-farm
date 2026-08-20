import React, { useState, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import {
  MapPin,
  Printer,
  Plus,
  CreditCard,
  Building,
  CheckCircle2,
  Calendar,
  X,
  FileText,
  ShieldCheck,
  Zap,
  Droplets,
  UserCheck,
  Headphones,
  ArrowRight,
  ChevronRight,
  User,
  Bell,
  Search,
  Filter,
  Download,
  Clock,
  Play,
  TrendingUp,
  Globe,
  ArrowLeft,
  Sun,
  Moon,
  Sparkles,
  Wallet,
  Receipt,
  LayoutDashboard,
  DollarSign
} from 'lucide-react';

// Language Dictionary for Farmer Portal (English ↔ Hindi)
const translations = {
  en: {
    greeting: "Good Morning",
    todaySubtitle: "Here's what's happening on your farm today.",
    totalSupplied: "Total Milk Supplied",
    thisMonth: "This Month",
    memberSince: "Member Since",
    proudMember: "Proud member",
    thankYou: "Thank you!",
    totalPayouts: "Total Payouts",
    totalCleared: "Total Cleared",
    pendingBalance: "Pending Balance",
    noPending: "No pending amount",
    allClear: "All clear!",
    milkLogTitle: "Milk Collection Log",
    milkLogDesc: "View your daily milk collection entries",
    viewLogs: "View Logs",
    payoutsTitle: "Payouts & Settlements",
    payoutsDesc: "Track your payments & settlements",
    viewPayouts: "View Payouts",
    ledgerTitle: "Milk Supply Ledger",
    ledgerDesc: "See your complete supply history",
    viewLedger: "View Ledger",
    bankTitle: "Bank & Profile Details",
    bankDesc: "Manage your bank & profile info",
    manageProfile: "Manage Profile",
    whoWeAre: "Who We Are",
    empoweringTitle: "Empowering Farmers, Enriching Futures",
    empoweringDesc: "We are your partners in growth. Simplifying dairy management with transparency, technology & trust.",
    recentCollection: "Recent Milk Collection",
    viewAll: "View All",
    navDashboard: "Dashboard",
    navCollection: "Collection",
    navPayouts: "Payouts",
    navProfile: "Profile",
    todayCollection: "Today's Collection",
    activeFarmers: "Active Farmers",
    avgRate: "Avg. Rate",
    allEntries: "All Entries",
    morningShift: "Morning",
    eveningShift: "Evening",
    completed: "Completed",
    pending: "Pending",
    inProgress: "In Progress",
    cleared: "Cleared",
    requestAdvance: "Request Advance",
    supportHelp: "Need help with your payout?",
    supportDesc: "We're here to assist you.",
    contactSupport: "Contact Support"
  },
  hi: {
    greeting: "शुभ प्रभात",
    todaySubtitle: "आज आपके फार्म में क्या हो रहा है।",
    totalSupplied: "कुल दूध आपूर्ति",
    thisMonth: "इस महीने",
    memberSince: "सदस्यता की तारीख",
    proudMember: "गौरवान्वित सदस्य",
    thankYou: "धन्यवाद!",
    totalPayouts: "कुल भुगतान",
    totalCleared: "कुल चुकता",
    pendingBalance: "बकाया राशि",
    noPending: "कोई बकाया नहीं",
    allClear: "सब साफ है!",
    milkLogTitle: "दूध संग्रह लॉग",
    milkLogDesc: "अपनी दैनिक दूध संग्रह प्रविष्टियां देखें",
    viewLogs: "लॉग देखें",
    payoutsTitle: "भुगतान एवं निपटान",
    payoutsDesc: "अपने भुगतान और बहीखाता ट्रैक करें",
    viewPayouts: "भुगतान देखें",
    ledgerTitle: "दूध आपूर्ति बहीखाता",
    ledgerDesc: "अपनी पूरी आपूर्ति का इतिहास देखें",
    viewLedger: "बहीखाता देखें",
    bankTitle: "बैंक एवं प्रोफ़ाइल विवरण",
    bankDesc: "अपनी बैंक और प्रोफ़ाइल जानकारी प्रबंधित करें",
    manageProfile: "प्रोफ़ाइल प्रबंधित करें",
    whoWeAre: "हम कौन हैं",
    empoweringTitle: "किसानों को सशक्त बनाना, भविष्य को समृद्ध बनाना",
    empoweringDesc: "हम विकास में आपके भागीदार हैं। पारदर्शिता, तकनीक और विश्वास के साथ डेयरी प्रबंधन को सरल बना रहे हैं।",
    recentCollection: "हाल की दूध संग्रह प्रविष्टियां",
    viewAll: "सभी देखें",
    navDashboard: "डैशबोर्ड",
    navCollection: "संग्रह",
    navPayouts: "भुगतान",
    navProfile: "प्रोफ़ाइल",
    todayCollection: "आज का संग्रह",
    activeFarmers: "सक्रिय किसान",
    avgRate: "औसत दर",
    allEntries: "सभी प्रविष्टियां",
    morningShift: "सुबह",
    eveningShift: "शाम",
    completed: "पूर्ण",
    pending: "बकाया",
    inProgress: "प्रगति में",
    cleared: "चुकता",
    requestAdvance: "अग्रिम अनुरोध करें",
    supportHelp: "भुगतान सहायता चाहिए?",
    supportDesc: "हम आपकी सहायता के लिए तत्पर हैं।",
    contactSupport: "सहायता संपर्क करें"
  }
};

export const FarmerDashboard = ({ initialTab }) => {
  const { farmers, selectedFarmerId, entries, payouts, currentUser, currentRole } = useFarm();
  
  // Navigation & Language States
  const [activeTab, setActiveTab] = useState(initialTab || 'dashboard'); // 'dashboard' | 'collection' | 'payouts' | 'profile' | 'ledger'
  const [lang, setLang] = useState('en'); // 'en' | 'hi'
  const [selectedShift, setSelectedShift] = useState('all'); // 'all' | 'morning' | 'evening'
  const [searchQuery, setSearchQuery] = useState('');

  // Request Advance Modal State
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [advanceLoading, setAdvanceLoading] = useState(false);
  const [advanceSuccess, setAdvanceSuccess] = useState(false);

  const t = translations[lang] || translations.en;

  useEffect(() => {
    if (initialTab) {
      if (initialTab === 'Withdrawal Passbook') setActiveTab('payouts');
      else if (initialTab === 'Supply History') setActiveTab('collection');
      else if (initialTab === 'Details') setActiveTab('profile');
      else setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Isolate current logged-in farmer
  const loggedInFarmer = (currentRole === 'farmer' || currentUser?.role === 'farmer') && currentUser
    ? (farmers || []).find(f => 
        f?.phone === currentUser?.phone || 
        f?.id === currentUser?.id || 
        f?.id === currentUser?.farmerId || 
        (f?.name && currentUser?.name && f.name.toLowerCase() === currentUser.name.toLowerCase())
      )
    : null;

  const farmer = loggedInFarmer || farmers.find(f => f.id === selectedFarmerId) || farmers[0];

  if (!farmer) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#1C3B24' }}>No Farmer Profile Found</h2>
        <p style={{ color: '#64748B' }}>Please contact your collection center manager for access.</p>
      </div>
    );
  }

  const farmerEntries = entries.filter(e => e.farmerId === farmer.id || (farmer.phone && e.farmerPhone === farmer.phone));
  const farmerPayouts = payouts.filter(p => p.farmerId === farmer.id || (farmer.phone && p.farmerPhone === farmer.phone) || (p.farmerName && farmer.name && p.farmerName.toLowerCase().includes(farmer.name.toLowerCase())));

  const totalClearedPayouts = farmerPayouts.reduce((acc, p) => acc + (p.amount || 0), 0);

  const handleAdvanceSubmit = (e) => {
    e.preventDefault();
    if (!advanceAmount || parseFloat(advanceAmount) <= 0) return;
    setAdvanceLoading(true);
    setTimeout(() => {
      setAdvanceLoading(false);
      setAdvanceSuccess(true);
      if (farmer) farmer.advanceBalance = (farmer.advanceBalance || 0) + parseFloat(advanceAmount);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '110px', background: '#F8FAF9', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* 1. Header Bar matching Reference UI */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        {/* Left Side: Menu Icon Button + Language Toggle Switcher + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#1C3B24',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(28,59,36,0.2)'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </div>

          {/* Language Switcher Button (EN ↔ हिंदी) */}
          <button 
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#EBF7EE',
              border: '1.5px solid #A7F3D0',
              color: '#166534',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Switch Language / भाषा बदलें"
          >
            <Globe size={14} />
            <span>{lang === 'en' ? 'हिंदी' : 'EN'}</span>
          </button>

          {/* Rudu Farm Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EBF7EE', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
              <Droplets size={18} color="#15803D" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '18px', fontWeight: '900', color: '#1C3B24', letterSpacing: '-0.3px', lineHeight: 1 }}>RUDU FARM</span>
              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: '600', marginTop: '2px' }}>Smart Dairy Management</span>
            </div>
          </div>
        </div>

        {/* Right Side: Notification Bell + Avatar Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: 'pointer'
          }}>
            <Bell size={18} color="#334155" />
            <span style={{ position: 'absolute', top: '9px', right: '9px', width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626' }} />
          </div>

          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #1C3B24',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <img src="/images/rudu_hero_farmer.jpg" alt={farmer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/images/rudu_farmer_clean.jpg'; }} />
          </div>
        </div>
      </header>

      {/* Main Content View Switcher */}
      <div style={{ padding: '16px' }}>

        {/* =========================================================================
            TAB 1: MAIN DASHBOARD OVERVIEW (Exact Reference Image 1)
           ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Greeting Header & Sunny Farm Card */}
            <div style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #F4FAF5 100%)',
              padding: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 10px 25px rgba(28,59,36,0.04)'
            }}>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#0F172A', margin: '0 0 4px 0' }}>
                  {t.greeting}, {farmer.name.split(' ')[0]}! ☀️
                </h1>
                <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0 }}>
                  {t.todaySubtitle}
                </p>
              </div>

              {/* Background Farm Landscape Art Overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '55%',
                backgroundImage: 'url(/images/rudu_farmer_clean.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center right',
                opacity: 0.25,
                maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
              }} />
            </div>

            {/* 4 Top Metric Cards (2x2 Grid) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              {/* Card 1: Total Milk Supplied */}
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '18px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Droplets size={20} color="#0284C7" fill="#0284C7" />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>{t.totalSupplied}</span>
                </div>
                <div style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginTop: '12px' }}>
                  {farmer.totalSupplied || 121} L
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#16A34A', fontWeight: '700', marginTop: '6px' }}>
                  <span>↑ 12% from last month</span>
                </div>
              </div>

              {/* Card 2: Member Since */}
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '18px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={20} color="#EA580C" />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>{t.memberSince}</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#0F172A', marginTop: '12px' }}>
                  Jan 2024
                </div>
                <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: '700', marginTop: '6px' }}>
                  ❤️ {t.thankYou}
                </div>
              </div>

              {/* Card 3: Total Payouts */}
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '18px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#16A34A' }}>₹</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>{t.totalPayouts}</span>
                </div>
                <div style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginTop: '12px' }}>
                  ₹{(totalClearedPayouts || 7018).toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: '#15803D', fontWeight: '700', marginTop: '6px' }}>
                  💰 1 Settled Transaction
                </div>
              </div>

              {/* Card 4: Pending Balance */}
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '18px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={20} color="#EA580C" />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>{t.pendingBalance}</span>
                </div>
                <div style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginTop: '12px' }}>
                  ₹{(farmer.pendingPayout || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: '700', marginTop: '6px' }}>
                  ✅ {t.allClear}
                </div>
              </div>
            </div>

            {/* 4 Feature Quick Action Cards (2x2 Grid matching Reference Image 1) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              
              {/* Feature 1: Milk Collection Log */}
              <div style={{ background: '#F8FAF8', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '18px', position: 'relative', overflow: 'hidden' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>{t.milkLogTitle}</h4>
                <p style={{ margin: '0 0 16px 0', fontSize: '11.5px', color: '#64748B', lineHeight: '1.4' }}>{t.milkLogDesc}</p>
                <button 
                  onClick={() => setActiveTab('collection')}
                  style={{ background: '#1C3B24', color: '#FFFFFF', border: 'none', borderRadius: '20px', padding: '8px 14px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>{t.viewLogs}</span>
                  <ArrowRight size={13} />
                </button>
                <img src="/milk_can_realistic.png" alt="Milk Can" style={{ position: 'absolute', right: '-10px', bottom: '-10px', width: '85px', height: '85px', opacity: 0.85, pointerEvents: 'none' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>

              {/* Feature 2: Payouts & Settlements */}
              <div style={{ background: '#F8FAF8', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '18px', position: 'relative', overflow: 'hidden' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>{t.payoutsTitle}</h4>
                <p style={{ margin: '0 0 16px 0', fontSize: '11.5px', color: '#64748B', lineHeight: '1.4' }}>{t.payoutsDesc}</p>
                <button 
                  onClick={() => setActiveTab('payouts')}
                  style={{ background: '#1C3B24', color: '#FFFFFF', border: 'none', borderRadius: '20px', padding: '8px 14px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>{t.viewPayouts}</span>
                  <ArrowRight size={13} />
                </button>
                <img src="/images/fresh_dairy_products.png" alt="Wallet" style={{ position: 'absolute', right: '-10px', bottom: '-10px', width: '85px', height: '85px', opacity: 0.85, pointerEvents: 'none' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>

              {/* Feature 3: Milk Supply Ledger */}
              <div style={{ background: '#FFFDF9', border: '1px solid #FDE68A', borderRadius: '20px', padding: '18px', position: 'relative', overflow: 'hidden' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>{t.ledgerTitle}</h4>
                <p style={{ margin: '0 0 16px 0', fontSize: '11.5px', color: '#64748B', lineHeight: '1.4' }}>{t.ledgerDesc}</p>
                <button 
                  onClick={() => setActiveTab('collection')}
                  style={{ background: '#1C3B24', color: '#FFFFFF', border: 'none', borderRadius: '20px', padding: '8px 14px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>{t.viewLedger}</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Feature 4: Bank & Profile Details */}
              <div style={{ background: '#F8FAF8', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '18px', position: 'relative', overflow: 'hidden' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>{t.bankTitle}</h4>
                <p style={{ margin: '0 0 16px 0', fontSize: '11.5px', color: '#64748B', lineHeight: '1.4' }}>{t.bankDesc}</p>
                <button 
                  onClick={() => setActiveTab('profile')}
                  style={{ background: '#1C3B24', color: '#FFFFFF', border: 'none', borderRadius: '20px', padding: '8px 14px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>{t.manageProfile}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Showcase Video Banner ("Who We Are") */}
            <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', color: '#16A34A', background: '#DCFCE7', padding: '4px 10px', borderRadius: '15px', marginBottom: '8px' }}>
                    <span>🍃 {t.whoWeAre}</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#1C3B24', margin: '0 0 8px 0', leading: '1.2' }}>
                    {t.empoweringTitle}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                    {t.empoweringDesc}
                  </p>
                </div>

                <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '140px', background: '#000' }}>
                  <img src="/images/rudu_hero_farmer.jpg" alt="Farm Sunset" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', cursor: 'pointer' }}>
                      <Play size={20} color="#1C3B24" fill="#1C3B24" style={{ marginLeft: '3px' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Milk Collection List */}
            <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '20px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: 0 }}>{t.recentCollection}</h3>
                <button onClick={() => setActiveTab('collection')} style={{ background: 'none', border: 'none', color: '#15803D', fontWeight: '800', fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{t.viewAll}</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(farmerEntries.length > 0 ? farmerEntries.slice(0, 4) : [
                  { id: 'ENTRY-1484', date: '16 Aug 2025, 10:36 AM', quantity: 12, fat: 4.2, status: 'Pending' },
                  { id: 'ENTRY-3410', date: '16 Aug 2025, 07:59 PM', quantity: 42.5, fat: 4.2, status: 'Pending' },
                  { id: 'ENTRY-4888', date: '17 Aug 2025, 03:23 PM', quantity: 42.5, fat: 4.2, status: 'Pending' }
                ]).map((entry, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '16px', background: '#F8FAF8', border: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EBF7EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calendar size={18} color="#16A34A" />
                      </div>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#0F172A' }}>{entry.id || `ENTRY-${1000 + idx}`}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{entry.date || '16 Aug 2025'}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: '900', color: '#0F172A' }}>{entry.quantity || 12} L</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{entry.fat || 4.2}% Fat</div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: '800', background: '#FEF3C7', color: '#92400E', padding: '4px 10px', borderRadius: '15px' }}>
                        {entry.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: MILK COLLECTION PASSBOOK (Exact Reference Image 2)
           ========================================================================= */}
        {activeTab === 'collection' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Header with Sunset Background */}
            <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', padding: '24px', background: 'linear-gradient(135deg, #1C3B24 0%, #2A5435 100%)', color: '#FFFFFF' }}>
              <button onClick={() => setActiveTab('dashboard')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFF', padding: '6px', borderRadius: '50%', cursor: 'pointer', marginBottom: '12px' }}>
                <ArrowLeft size={18} />
              </button>
              <h2 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 6px 0' }}>Milk Collection</h2>
              <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>Track and manage all milk collection entries in real-time.</p>
            </div>

            {/* Top Stats Bar */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '16px', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Today's Collection</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#16A34A', marginTop: '2px' }}>254 L</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>This Month</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#0284C7', marginTop: '2px' }}>2,842 L</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Active Farmers</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#EA580C', marginTop: '2px' }}>48</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Avg. Rate</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#15803D', marginTop: '2px' }}>₹58.00</div>
              </div>
            </div>

            {/* Shift Segmented Tabs */}
            <div style={{ display: 'flex', gap: '8px', background: '#F1F5F9', padding: '4px', borderRadius: '30px' }}>
              <button onClick={() => setSelectedShift('all')} style={{ flex: 1, padding: '8px', borderRadius: '20px', border: 'none', fontWeight: '800', fontSize: '12px', background: selectedShift === 'all' ? '#1C3B24' : 'transparent', color: selectedShift === 'all' ? '#FFF' : '#475569', cursor: 'pointer' }}>
                All Entries ({farmerEntries.length || 28})
              </button>
              <button onClick={() => setSelectedShift('morning')} style={{ flex: 1, padding: '8px', borderRadius: '20px', border: 'none', fontWeight: '800', fontSize: '12px', background: selectedShift === 'morning' ? '#1C3B24' : 'transparent', color: selectedShift === 'morning' ? '#FFF' : '#475569', cursor: 'pointer' }}>
                ☀️ Morning (14)
              </button>
              <button onClick={() => setSelectedShift('evening')} style={{ flex: 1, padding: '8px', borderRadius: '20px', border: 'none', fontWeight: '800', fontSize: '12px', background: selectedShift === 'evening' ? '#1C3B24' : 'transparent', color: selectedShift === 'evening' ? '#FFF' : '#475569', cursor: 'pointer' }}>
                🌙 Evening (14)
              </button>
            </div>

            {/* Entry Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(farmerEntries.length > 0 ? farmerEntries : [
                { id: 'ENTRY-1484', date: '16 May 2025 • 06:35 AM', farmerName: farmer.name, farmerId: farmer.id, village: farmer.village, quantity: 12, fat: 4.2, snf: 8.6, amount: 696, status: 'Completed' },
                { id: 'ENTRY-3410', date: '16 May 2025 • 07:59 AM', farmerName: 'Ramesh Kumar', farmerId: 'RF6124', village: 'Kheda', quantity: 42.5, fat: 4.2, snf: 8.6, amount: 2465, status: 'Completed' },
                { id: 'ENTRY-4888', date: '16 May 2025 • 08:45 AM', farmerName: 'Suresh Yadav', farmerId: 'RF3311', village: 'Kheda', quantity: 42.5, fat: 4.2, snf: 8.6, amount: 2465, status: 'Completed' }
              ]).map((item, idx) => (
                <div key={idx} style={{ background: '#FFFFFF', borderRadius: '18px', padding: '16px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EBF7EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Calendar size={18} color="#16A34A" />
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: '900', color: '#0F172A' }}>{item.id}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{item.date}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: '900', color: '#0F172A' }}>{item.quantity} L</div>
                    <div style={{ fontSize: '10.5px', color: '#64748B' }}>{item.fat}% Fat | {item.snf || 8.6}% SNF</div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: '900', color: '#16A34A' }}>₹{item.amount}</div>
                    <span style={{ fontSize: '10px', fontWeight: '800', background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '10px' }}>
                      {item.status || 'Completed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: PAYOUTS & SETTLEMENTS (Exact Reference Image 3)
           ========================================================================= */}
        {activeTab === 'payouts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Header Banner */}
            <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', padding: '24px', background: 'linear-gradient(135deg, #1C3B24 0%, #15803D 100%)', color: '#FFFFFF' }}>
              <button onClick={() => setActiveTab('dashboard')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFF', padding: '6px', borderRadius: '50%', cursor: 'pointer', marginBottom: '12px' }}>
                <ArrowLeft size={18} />
              </button>
              <h2 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 6px 0' }}>Payouts & Settlement</h2>
              <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>Track your payments, settlements and earnings in one place.</p>
            </div>

            {/* Top Metrics Cards */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '16px', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Total Paid</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#16A34A', marginTop: '2px' }}>₹{(totalClearedPayouts || 7018).toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Pending Amount</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#EA580C', marginTop: '2px' }}>₹0</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Upcoming</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#0284C7', marginTop: '2px' }}>₹0</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Total Farmers</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#1C3B24', marginTop: '2px' }}>48</div>
              </div>
            </div>

            {/* Payout Card & Breakdown */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '900', color: '#0F172A' }}>PAY-281</h3>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>16 May 2025 • 10:36 AM</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: '#16A34A' }}>₹7,018</div>
                  <span style={{ fontSize: '11px', fontWeight: '800', background: '#DCFCE7', color: '#15803D', padding: '3px 10px', borderRadius: '12px' }}>Cleared</span>
                </div>
              </div>

              {/* Breakdown Sheet */}
              <div style={{ background: '#F8FAF8', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Milk Collection Period</span>
                  <strong style={{ color: '#0F172A' }}>01 May 2025 - 15 May 2025</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Total Milk Supplied</span>
                  <strong style={{ color: '#0F172A' }}>121 L</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Avg. Rate</span>
                  <strong style={{ color: '#0F172A' }}>₹58.00 / L</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: '900', fontSize: '14px', paddingTop: '8px', borderTop: '1px dashed #CBD5E1' }}>
                  <span>Total Amount</span>
                  <span>₹7,018</span>
                </div>
              </div>
            </div>

            {/* Support Callout Box */}
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '20px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#16A34A', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Headphones size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#14532D' }}>{t.supportHelp}</div>
                  <div style={{ fontSize: '11.5px', color: '#166534' }}>{t.supportDesc}</div>
                </div>
              </div>
              <button style={{ background: '#1C3B24', color: '#FFF', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>
                {t.contactSupport}
              </button>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 4: BANK & PROFILE DETAILS
           ========================================================================= */}
        {activeTab === 'profile' && (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1C3B24', marginBottom: '16px' }}>Bank & Profile Info</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              <div style={{ background: '#F8FAF8', padding: '14px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Farmer Name</div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>{farmer.name}</div>
              </div>
              <div style={{ background: '#F8FAF8', padding: '14px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Farmer Code / ID</div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>{farmer.id}</div>
              </div>
              <div style={{ background: '#F8FAF8', padding: '14px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Mobile Phone</div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>{farmer.phone}</div>
              </div>
              <div style={{ background: '#F8FAF8', padding: '14px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Village / Location</div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>{farmer.village}</div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          BOTTOM FLOATING NAVIGATION BAR (Exact Reference Image 1 & 2)
         ========================================================================= */}
      <nav style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '480px',
        background: '#FFFFFF',
        borderRadius: '35px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
        border: '1px solid #E2E8F0',
        zIndex: 1000
      }}>
        {/* 1. Dashboard */}
        <button 
          onClick={() => setActiveTab('dashboard')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            border: 'none',
            background: activeTab === 'dashboard' ? '#EBF7EE' : 'transparent',
            color: activeTab === 'dashboard' ? '#1C3B24' : '#64748B',
            padding: '6px 14px',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          <LayoutDashboard size={18} />
          <span style={{ fontSize: '10.5px', fontWeight: '800' }}>{t.navDashboard}</span>
        </button>

        {/* 2. Collection */}
        <button 
          onClick={() => setActiveTab('collection')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            border: 'none',
            background: activeTab === 'collection' ? '#EBF7EE' : 'transparent',
            color: activeTab === 'collection' ? '#1C3B24' : '#64748B',
            padding: '6px 14px',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          <Receipt size={18} />
          <span style={{ fontSize: '10.5px', fontWeight: '800' }}>{t.navCollection}</span>
        </button>

        {/* 3. Floating Center Action Button (+) */}
        <button 
          onClick={() => setActiveTab('collection')}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: '#1C3B24',
            color: '#FFFFFF',
            border: '4px solid #FFFFFF',
            boxShadow: '0 8px 20px rgba(28,59,36,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginTop: '-24px'
          }}
        >
          <Plus size={24} />
        </button>

        {/* 4. Payouts */}
        <button 
          onClick={() => setActiveTab('payouts')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            border: 'none',
            background: activeTab === 'payouts' ? '#EBF7EE' : 'transparent',
            color: activeTab === 'payouts' ? '#1C3B24' : '#64748B',
            padding: '6px 14px',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          <Wallet size={18} />
          <span style={{ fontSize: '10.5px', fontWeight: '800' }}>{t.navPayouts}</span>
        </button>

        {/* 5. Profile */}
        <button 
          onClick={() => setActiveTab('profile')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            border: 'none',
            background: activeTab === 'profile' ? '#EBF7EE' : 'transparent',
            color: activeTab === 'profile' ? '#1C3B24' : '#64748B',
            padding: '6px 14px',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          <User size={18} />
          <span style={{ fontSize: '10.5px', fontWeight: '800' }}>{t.navProfile}</span>
        </button>
      </nav>

    </div>
  );
};
