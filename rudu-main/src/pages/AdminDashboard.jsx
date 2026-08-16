import React from 'react';
import { useFarm } from '../context/FarmContext';
import {
  Droplets,
  Users,
  Wallet,
  Clock,
  UserPlus,
  UserCheck,
  PlusCircle,
  CreditCard,
  FileText,
  Printer,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Zap,
  ArrowRight,
  User as UserIcon,
  MapPin,
  Headphones
} from 'lucide-react';

// Custom inline SVG assets to ensure identical premium visuals without missing files
const WalletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4E2A18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 7V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
    <path d="M16 11h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-6a3 3 0 0 1-3-3v0a3 3 0 0 1 3-3Z" fill="#FFFDFB" />
    <circle cx="18" cy="14" r="1.2" fill="#4E2A18" />
  </svg>
);

const MilkCanIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4E2A18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 6h10M6 9h12M5 13h14M5 13v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7M5 13l1-4h12l1 4" fill="#FFFDFB" />
    <path d="M12 9V3M10 3h4" />
  </svg>
);

const BankIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4E2A18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M5 11h14M12 2L3 7h18L12 2Z" fill="#FFFDFB" />
  </svg>
);

const ClearedBankIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M5 11h14M12 2L3 7h18L12 2Z" />
  </svg>
);

const PendingHourglassIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 2h14M5 22h14M19 2v4a7 7 0 0 1-7 7 7 7 0 0 1-7-7V2M5 22v-4a7 7 0 0 1 7-7 7 7 0 0 1 7 7v4" />
  </svg>
);

const AdvanceTrendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 7L13.5 15.5L8.5 10.5L2 17M22 7H16M22 7V13" />
  </svg>
);

const PassbookBookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5V4.5z" />
  </svg>
);

const MilkCansIllustration = () => (
  <img src="/milk_can_realistic.png" alt="Rudu Milk Can" style={{ width: '68px', height: '68px', objectFit: 'contain' }} />
);

const MilkSplashIllustration = () => (
  <img src="/milk_splash_realistic.png" alt="Milk Splash" className="milk-splash-bg" style={{ position: 'absolute', right: '-10px', bottom: '-10px', width: '170px', height: '130px', opacity: 0.18, pointerEvents: 'none' }} />
);

const PremiumBankBuildingSVG = () => (
  <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="80" width="70" height="10" rx="3" fill="#E2E8F0" stroke="#4E2A18" strokeWidth="2.5" />
    <rect x="20" y="70" width="60" height="10" rx="2" fill="#CBD5E1" stroke="#4E2A18" strokeWidth="2.5" />
    <path d="M25 70v-30M38 70v-30M50 70v-30M62 70v-30M75 70v-30" stroke="#4E2A18" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="22" y="32" width="56" height="8" rx="2" fill="#E2E8F0" stroke="#4E2A18" strokeWidth="2.5" />
    <polygon points="50,10 18,32 82,32" fill="#CBD5E1" stroke="#4E2A18" strokeWidth="2.5" strokeLinejoin="round" />
    <text x="50" y="27" fill="#4E2A18" fontSize="7.5" fontWeight="800" textAnchor="middle">CENTRAL</text>
  </svg>
);

const CowPastureSilhouette = () => (
  <svg viewBox="0 0 800 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="pasture-silhouette-svg" preserveAspectRatio="none">
    <path d="M0 80c100-20 200-10 350-30s300 10 450-20v70H0V80z" fill="#DCC5B3" opacity="0.25" />
    <path d="M0 90c150-10 300-30 450-20s200 20 350 10v20H0V90z" fill="#4E2A18" opacity="0.12" />
    <path d="M120 75h8v4h-2v2h-1v-2h-3v2h-1v-2h-1v-4z" fill="#4E2A18" opacity="0.3" />
    <circle cx="129" cy="74" r="2.5" fill="#4E2A18" opacity="0.3" />
    <path d="M160 70l6-4 6 4v8h-12v-8z" fill="#4E2A18" opacity="0.2" />
    <path d="M680 73h10v5h-2v3h-1v-3h-4v3h-1v-3h-2v-5z" fill="#4E2A18" opacity="0.3" />
    <circle cx="691" cy="72" r="3" fill="#4E2A18" opacity="0.3" />
  </svg>
);

export const AdminDashboard = ({ setActiveTab }) => {
  const { farmers, entries, payouts, setActiveModal, openSlip } = useFarm();

  const totalVolume = entries.reduce((acc, curr) => acc + curr.quantity, 0);
  const todayEntries = entries.filter(e => e.date === '2026-07-24' || e.date === new Date().toISOString().split('T')[0]);
  const todayVolume = todayEntries.reduce((acc, curr) => acc + curr.quantity, 0);
  
  const totalPayoutThisMonth = farmers.reduce((acc, f) => acc + f.totalEarned, 0);
  const totalPendingPayout = farmers.reduce((acc, f) => acc + f.pendingPayout, 0);
  const totalAdvances = farmers.reduce((acc, f) => acc + (f.advanceBalance || 0), 0);
  const activeFarmersCount = farmers.filter(f => f.status === 'Active').length;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '24px' }}>
      
      {/* Admin Profile Card - Redesigned v2 */}
      <div className="farmer-profile-card-v2">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="avatar-square" style={{ background: '#EAF0F6' }}>
              <UserIcon size={36} style={{ strokeWidth: 1.5, color: '#2B6CB0' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#3B2214' }}>Rajesh Sharma</h2>
                <span className="badge-active-farmer" style={{ background: '#EBF8FF', color: '#2B6CB0', borderColor: '#BEE3F8' }}>Active Admin</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span>ID: <strong>AD1001</strong></span>
                <span>•</span>
                <span>Phone: <strong>+91 97978 77700</strong></span>
              </div>
              <div style={{ fontSize: '12px', color: '#4E2A18', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontWeight: '700' }}>
                <MapPin size={13} /> Headquarters: <span>Rudu Main HQ, Kheda</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid inside the card */}
        <div className="stats-row">
          <div className="stat-col">
            <span className="stat-label">Total Volume</span>
            <span className="stat-val">{totalVolume.toLocaleString()} L</span>
          </div>
          <div className="stat-col">
            <span className="stat-label">Active Farmers</span>
            <span className="stat-val">{activeFarmersCount}</span>
          </div>
          <div className="stat-col">
            <span className="stat-label">Operating Centers</span>
            <span className="stat-val">4 Centers</span>
          </div>
        </div>
      </div>

      {/* Premium Sub-tabs row */}
      <div className="farmer-subtabs-row">
        <div
          className="farmer-subtab-btn active"
          onClick={() => {
            // Keep on Dashboard Hub
          }}
        >
          <WalletIcon />
          <div className="tab-title">Dashboard Hub</div>
          <div className="tab-subtitle">(Overview)</div>
        </div>
        
        <div
          className="farmer-subtab-btn"
          onClick={() => {
            setActiveTab('farmers');
          }}
        >
          <MilkCanIcon />
          <div className="tab-title" style={{ marginTop: '4px' }}>Farmers Directory</div>
        </div>
        
        <div
          className="farmer-subtab-btn"
          onClick={() => {
            setActiveTab('collection');
          }}
        >
          <BankIcon />
          <div className="tab-title" style={{ marginTop: '4px' }}>Collection Stream</div>
        </div>
      </div>

      {/* Overview Dashboard Hub Content */}
      <div>
        {/* Today's Intake Card Banner */}
        <div className="lifetime-value-banner" style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)', borderColor: '#DCFCE7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 2 }}>
            <MilkCansIllustration />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '11px', color: '#166534', fontWeight: '800', letterSpacing: '0.5px' }}>TODAY'S TOTAL INTAKE</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#14532D', margin: '2px 0' }}>
                {todayVolume.toLocaleString()} L
              </div>
              <div style={{ fontSize: '11px', color: '#15803D', fontWeight: '500' }}>Real-time dairy intake across centers</div>
            </div>
          </div>
          <button className="summary-badge" style={{ background: '#166534' }} onClick={() => setActiveTab('collection')}>
            <span>View Stream</span>
            <ChevronRight size={14} />
          </button>
          <MilkSplashIllustration />
        </div>

        {/* Sub-cards 2x2 Grid */}
        <div className="dashboard-subcards-grid">
          {/* Total Monthly Payout */}
          <div className="premium-subcard cleared">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ textAlign: 'left' }}>
                <div className="icon-container">
                  <ClearedBankIcon />
                </div>
                <div className="card-title">Monthly Payouts</div>
                <div className="card-value">₹{totalPayoutThisMonth.toLocaleString()}</div>
                <div className="card-subtext">Total settled payments</div>
              </div>
            </div>
            <div className="card-badge">✓ Settled</div>
            <button className="arrow-btn" onClick={() => setActiveTab('payouts')} title="View all payouts">
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Pending Payouts */}
          <div className="premium-subcard pending">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ textAlign: 'left' }}>
                <div className="icon-container">
                  <PendingHourglassIcon />
                </div>
                <div className="card-title">Pending Payouts</div>
                <div className="card-value">₹{totalPendingPayout.toLocaleString()}</div>
                <div className="card-subtext">Awaiting next cycles</div>
              </div>
            </div>
            <div className="card-badge">⌛ Pending</div>
            <button className="arrow-btn" onClick={() => setActiveTab('payouts')} title="Issue bank settlements">
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Advances Disbursed */}
          <div className="premium-subcard advance">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ textAlign: 'left' }}>
                <div className="icon-container">
                  <AdvanceTrendIcon />
                </div>
                <div className="card-title">Advances Disbursed</div>
                <div className="card-value">₹{totalAdvances.toLocaleString()}</div>
                <div className="card-subtext">Total feed & cash advance</div>
              </div>
            </div>
            <div className="card-badge">₹ Advances</div>
            <button className="arrow-btn" onClick={() => setActiveTab('farmers')} title="Manage advances">
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Staff Terminal View */}
          <div className="premium-subcard passbook">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ textAlign: 'left' }}>
                <div className="icon-container">
                  <PassbookBookIcon />
                </div>
                <div className="card-title">System Staff</div>
                <div className="card-value" style={{ fontSize: '16px', marginTop: '10px', height: '28px', lineHeight: '28px' }}>Operators</div>
                <div className="card-subtext" style={{ marginBottom: '8px' }}>Manage collection terminals</div>
              </div>
            </div>
            <button className="pill-button" onClick={() => setActiveTab('operators')}>
              <span>Manage Staff</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Quick action buttons row */}
        <div style={{ background: '#FFFFFF', border: '1.5px solid #EFE2D5', borderRadius: '24px', padding: '20px', marginBottom: '24px', textAlign: 'left' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#3B2214', marginBottom: '14px' }}>Quick Operations</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            <button onClick={() => setActiveModal('milkEntry')} className="btn btn-secondary" style={{ justifyContent: 'center', fontSize: '12px', padding: '10px 4px' }}>
              <PlusCircle size={14} /> Milk Entry
            </button>
            <button onClick={() => setActiveModal('addFarmer')} className="btn btn-secondary" style={{ justifyContent: 'center', fontSize: '12px', padding: '10px 4px' }}>
              <UserPlus size={14} /> Add Farmer
            </button>
            <button onClick={() => setActiveModal('addOperator')} className="btn btn-secondary" style={{ justifyContent: 'center', fontSize: '12px', padding: '10px 4px' }}>
              <UserCheck size={14} /> Add Operator
            </button>
            <button onClick={() => setActiveModal('makePayment')} className="btn btn-secondary" style={{ justifyContent: 'center', fontSize: '12px', padding: '10px 4px' }}>
              <CreditCard size={14} /> Issue Payment
            </button>
          </div>
        </div>

        {/* Trust badges row */}
        <div className="trust-badges-banner">
          <div className="trust-badge-item">
            <div className="trust-badge-icon-container">
              <ShieldCheck size={18} />
            </div>
            <div className="trust-badge-title">100% Secure</div>
            <div className="trust-badge-desc">Your transactions are fully protected</div>
          </div>
          
          <div className="trust-badge-item">
            <div className="trust-badge-icon-container">
              <Zap size={18} />
            </div>
            <div className="trust-badge-title">Fast Payouts</div>
            <div className="trust-badge-desc">Quick settlements direct to bank</div>
          </div>
          
          <div className="trust-badge-item">
            <div className="trust-badge-icon-container">
              <Droplets size={18} />
            </div>
            <div className="trust-badge-title">Transparent</div>
            <div className="trust-badge-desc">Clear ledger & no hidden charges</div>
          </div>
          
          <div className="trust-badge-item">
            <div className="trust-badge-icon-container">
              <UserCheck size={18} />
            </div>
            <div className="trust-badge-title">Farmer First</div>
            <div className="trust-badge-desc">Built for farmers, by farmers</div>
          </div>
          
          <div className="trust-badge-item">
            <div className="trust-badge-icon-container">
              <Headphones size={18} />
            </div>
            <div className="trust-badge-title">24x7 Support</div>
            <div className="trust-badge-desc">We're here to help you anytime</div>
          </div>
        </div>

        {/* Processing Plant Center details Card */}
        <div className="direct-deposit-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <PremiumBankBuildingSVG />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', color: '#7C695D', fontWeight: '800', letterSpacing: '0.5px' }}>MAIN DAIRY PROCESSING CENTER</div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#3B2214', margin: '2px 0' }}>
                Kheda Processing Plant
              </div>
              <div style={{ fontSize: '12px', color: '#7C695D', fontWeight: '600' }}>
                Plant Manager: Rajesh Sharma
              </div>
              <div style={{ fontSize: '11px', color: '#AB988B', marginTop: '2px' }}>
                Active Operators: Amit Kumar | Daily Capacity: 5,000L | Logins Active: 2
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="verified-badge" style={{ background: '#EAF4EE', color: '#2F855A', borderColor: '#C6F6D5' }}>
              <ShieldCheck size={14} />
              <span>Verified Plant</span>
            </div>
            <ChevronRight size={20} style={{ color: '#7C695D' }} />
          </div>
        </div>

        {/* Rural silhouette and tagline footer */}
        <div className="pasture-footer-decoration">
          <div className="pasture-footer-text">
            <span><ShieldCheck size={12} /> Secure</span>
            <span>•</span>
            <span><ShieldCheck size={12} /> Verified</span>
            <span>•</span>
            <span>Trusted by Thousands of Farmers</span>
          </div>
          <CowPastureSilhouette />
        </div>
      </div>
    </div>
  );
};
