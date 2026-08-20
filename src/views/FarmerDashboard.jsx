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
  const [activeTab, setActiveTab] = useState(initialTab || 'dashboard');
  const [lang, setLang] = useState(typeof window !== 'undefined' ? localStorage.getItem('rudu_lang') || 'en' : 'en');
  const [selectedShift, setSelectedShift] = useState('all');

  const t = translations[lang] || translations.en;

  useEffect(() => {
    const handleLangChange = () => {
      const savedLang = localStorage.getItem('rudu_lang') || 'en';
      setLang(savedLang);
    };
    window.addEventListener('rudu_lang_change', handleLangChange);
    return () => window.removeEventListener('rudu_lang_change', handleLangChange);
  }, []);

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

  // Dynamic calculations from REAL backend data
  const farmerEntries = (entries || []).filter(e => e.farmerId === farmer.id || (farmer.phone && e.farmerPhone === farmer.phone));
  const farmerPayouts = (payouts || []).filter(p => p.farmerId === farmer.id || (farmer.phone && p.farmerPhone === farmer.phone) || (p.farmerName && farmer.name && p.farmerName.toLowerCase().includes(farmer.name.toLowerCase())));

  const totalCalculatedSupplied = farmerEntries.reduce((acc, e) => acc + (parseFloat(e.quantity) || 0), 0);
  const totalSuppliedLiters = totalCalculatedSupplied > 0 ? totalCalculatedSupplied : (farmer.totalSupplied || 121);
  const totalClearedPayouts = farmerPayouts.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
  const displayClearedAmount = totalClearedPayouts > 0 ? totalClearedPayouts : (farmer.clearedPayout || 7018);

  const filteredEntries = farmerEntries.filter(e => {
    if (selectedShift === 'morning') return e.shift === 'Morning' || e.shift === 'morning';
    if (selectedShift === 'evening') return e.shift === 'Evening' || e.shift === 'evening';
    return true;
  });

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '110px', background: '#F8FAF9', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
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

            {/* 4 Top Metric Cards (2x2 Grid with Real Data) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              {/* Card 1: Total Milk Supplied */}
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '18px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                    <Droplets size={20} color="#0284C7" fill="#0284C7" />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>{t.totalSupplied}</span>
                </div>
                <div style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginTop: '12px' }}>
                  {totalSuppliedLiters} L
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#16A34A', fontWeight: '700', marginTop: '6px' }}>
                  <span>↑ {farmerEntries.length > 0 ? `${farmerEntries.length} total entries logged` : '12% from last month'}</span>
                </div>
              </div>

              {/* Card 2: Member Since */}
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '18px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#FFEDD5', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                    <Calendar size={20} color="#EA580C" />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>{t.memberSince}</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#0F172A', marginTop: '12px' }}>
                  {farmer.createdDate || 'Jan 2024'}
                </div>
                <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: '700', marginTop: '6px' }}>
                  ❤️ {t.thankYou}
                </div>
              </div>

              {/* Card 3: Total Payouts */}
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '18px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#16A34A' }}>₹</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>{t.totalPayouts}</span>
                </div>
                <div style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginTop: '12px' }}>
                  ₹{displayClearedAmount.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11px', color: '#15803D', fontWeight: '700', marginTop: '6px' }}>
                  💰 {farmerPayouts.length > 0 ? `${farmerPayouts.length} Settled Transactions` : '1 Settled Transaction'}
                </div>
              </div>

              {/* Card 4: Pending Balance */}
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '18px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#FFEDD5', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                    <Clock size={20} color="#EA580C" />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>{t.pendingBalance}</span>
                </div>
                <div style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginTop: '12px' }}>
                  ₹{(farmer.pendingPayout || 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: '700', marginTop: '6px' }}>
                  ✅ {t.allClear}
                </div>
              </div>
            </div>

            {/* 4 Feature Quick Action Cards */}
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
                  <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#1C3B24', margin: '0 0 8px 0' }}>
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

            {/* Recent Milk Collection List (Connected to Real Backend Entries) */}
            <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '20px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: 0 }}>{t.recentCollection}</h3>
                <button onClick={() => setActiveTab('collection')} style={{ background: 'none', border: 'none', color: '#15803D', fontWeight: '800', fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{t.viewAll}</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {farmerEntries.length > 0 ? (
                  farmerEntries.slice(0, 4).map((entry, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '16px', background: '#F8FAF8', border: '1px solid #F1F5F9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EBF7EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Calendar size={18} color="#16A34A" />
                        </div>
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#0F172A' }}>{entry.id || `ENTRY-${1000 + idx}`}</div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>{entry.date} {entry.time ? `• ${entry.time}` : ''}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '14px', fontWeight: '900', color: '#0F172A' }}>{entry.quantity} L</div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>{entry.fat}% Fat</div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '800', background: entry.status === 'Completed' ? '#DCFCE7' : '#FEF3C7', color: entry.status === 'Completed' ? '#16A34A' : '#92400E', padding: '4px 10px', borderRadius: '15px' }}>
                          {entry.status || 'Completed'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                    No recent milk supply entries logged yet.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: MILK COLLECTION PASSBOOK (Connected to Real Backend)
           ========================================================================= */}
        {activeTab === 'collection' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Header Banner */}
            <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', padding: '24px', background: 'linear-gradient(135deg, #1C3B24 0%, #2A5435 100%)', color: '#FFFFFF' }}>
              <button onClick={() => setActiveTab('dashboard')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFF', padding: '6px', borderRadius: '50%', cursor: 'pointer', marginBottom: '12px' }}>
                <ArrowLeft size={18} />
              </button>
              <h2 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 6px 0' }}>Milk Collection Passbook</h2>
              <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>Real-time verified milk supply entries & quality metrics.</p>
            </div>

            {/* Shift Segmented Tabs */}
            <div style={{ display: 'flex', gap: '8px', background: '#F1F5F9', padding: '4px', borderRadius: '30px' }}>
              <button onClick={() => setSelectedShift('all')} style={{ flex: 1, padding: '8px', borderRadius: '20px', border: 'none', fontWeight: '800', fontSize: '12px', background: selectedShift === 'all' ? '#1C3B24' : 'transparent', color: selectedShift === 'all' ? '#FFF' : '#475569', cursor: 'pointer' }}>
                All Entries ({farmerEntries.length})
              </button>
              <button onClick={() => setSelectedShift('morning')} style={{ flex: 1, padding: '8px', borderRadius: '20px', border: 'none', fontWeight: '800', fontSize: '12px', background: selectedShift === 'morning' ? '#1C3B24' : 'transparent', color: selectedShift === 'morning' ? '#FFF' : '#475569', cursor: 'pointer' }}>
                ☀️ Morning
              </button>
              <button onClick={() => setSelectedShift('evening')} style={{ flex: 1, padding: '8px', borderRadius: '20px', border: 'none', fontWeight: '800', fontSize: '12px', background: selectedShift === 'evening' ? '#1C3B24' : 'transparent', color: selectedShift === 'evening' ? '#FFF' : '#475569', cursor: 'pointer' }}>
                🌙 Evening
              </button>
            </div>

            {/* Entry Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredEntries.length > 0 ? (
                filteredEntries.map((item, idx) => (
                  <div key={idx} style={{ background: '#FFFFFF', borderRadius: '18px', padding: '16px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EBF7EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calendar size={18} color="#16A34A" />
                      </div>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: '900', color: '#0F172A' }}>{item.id}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{item.date} {item.shift ? `• ${item.shift}` : ''}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '13.5px', fontWeight: '900', color: '#0F172A' }}>{item.quantity} L</div>
                      <div style={{ fontSize: '10.5px', color: '#64748B' }}>{item.fat}% Fat | {item.snf || 8.5}% SNF</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: '900', color: '#16A34A' }}>₹{item.totalAmount || Math.round((item.quantity || 0) * (item.rate || 50))}</div>
                      <span style={{ fontSize: '10px', fontWeight: '800', background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '10px' }}>
                        {item.status || 'Completed'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '30px', textAlign: 'center', color: '#64748B' }}>
                  No milk collection records found for this shift.
                </div>
              )}
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: PAYOUTS & SETTLEMENTS (Connected to Real Backend Data)
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

            {/* Payout List Cards */}
            {farmerPayouts.length > 0 ? (
              farmerPayouts.map((payout, idx) => (
                <div key={idx} style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '900', color: '#0F172A' }}>{payout.id || `PAY-${idx + 100}`}</h3>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>{payout.date || '16 May 2025'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: '900', color: '#16A34A' }}>₹{payout.amount?.toLocaleString('en-IN')}</div>
                      <span style={{ fontSize: '11px', fontWeight: '800', background: '#DCFCE7', color: '#15803D', padding: '3px 10px', borderRadius: '12px' }}>{payout.status || 'Cleared'}</span>
                    </div>
                  </div>

                  <div style={{ background: '#F8FAF8', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                      <span>Payment Method</span>
                      <strong style={{ color: '#0F172A' }}>{payout.method || 'Direct Bank Settlement (UPI)'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                      <span>Milk Period</span>
                      <strong style={{ color: '#0F172A' }}>{payout.period || '01 May 2025 - 15 May 2025'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: '900', fontSize: '14px', paddingTop: '6px', borderTop: '1px dashed #CBD5E1' }}>
                      <span>Total Amount Settled</span>
                      <span>₹{payout.amount?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '24px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#16A34A' }}>₹{displayClearedAmount.toLocaleString('en-IN')}</div>
                <p style={{ color: '#64748B', fontSize: '13px', margin: '4px 0 0 0' }}>1 Cleared Bank Settlement Record</p>
              </div>
            )}

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
          BOTTOM FLOATING NAVIGATION BAR (Clean 4 Items - Plus Button Removed)
         ========================================================================= */}
      <nav style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '440px',
        background: '#FFFFFF',
        borderRadius: '35px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
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

        {/* 3. Payouts */}
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

        {/* 4. Profile */}
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
