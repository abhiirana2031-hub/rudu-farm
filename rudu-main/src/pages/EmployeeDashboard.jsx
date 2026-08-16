import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import {
  UserCheck,
  PlusCircle,
  Printer,
  Droplets,
  Calculator,
  CheckCircle,
  TrendingUp,
  Search,
  ShieldCheck,
  Zap,
  ArrowRight,
  ChevronRight,
  User as UserIcon,
  MapPin,
  Headphones,
  X,
  FileText
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
    <text x="50" y="27" fill="#4E2A18" fontSize="7.5" fontWeight="800" textAnchor="middle">CENTER</text>
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

export const EmployeeDashboard = () => {
  const { farmers, entries, addMilkEntry, openSlip, calculateRate } = useFarm();

  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || '');
  const [shift, setShift] = useState('Morning');
  const [quantity, setQuantity] = useState('42.5');
  const [fat, setFat] = useState('4.2');
  const [snf, setSnf] = useState('8.6');
  const [temperature, setTemperature] = useState('4.0');
  
  // Tab View state
  const [subView, setSubView] = useState('overview'); // 'overview' | 'calculator' | 'shift-log'

  const currentRate = calculateRate(fat, snf);
  const qtyVal = parseFloat(quantity) || 0;
  const totalAmount = (qtyVal * currentRate).toFixed(2);
  const selectedFarmer = farmers.find(f => f.id === selectedFarmerId) || farmers[0];

  const handleFastEntry = (e) => {
    e.preventDefault();
    if (!selectedFarmerId || !quantity) return;

    const newEntry = addMilkEntry({
      farmerId: selectedFarmerId,
      farmerName: selectedFarmer?.name,
      shift,
      quantity,
      fat,
      snf,
      temperature
    });

    if (newEntry) {
      openSlip(newEntry);
      setSubView('shift-log'); // Swich to log view after submission
    }
  };

  const todayEntries = entries.filter(e => e.date === '2026-07-24' || e.date === new Date().toISOString().split('T')[0]);
  const todayTotalVolume = todayEntries.reduce((acc, e) => acc + e.quantity, 0);
  const todayTotalAmount = todayEntries.reduce((acc, e) => acc + e.totalAmount, 0);

  const avgFat = todayEntries.length > 0 ? (todayEntries.reduce((acc, e) => acc + e.fat, 0) / todayEntries.length).toFixed(1) : '4.2';
  const avgSnf = todayEntries.length > 0 ? (todayEntries.reduce((acc, e) => acc + e.snf, 0) / todayEntries.length).toFixed(1) : '8.6';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '24px' }}>
      
      {/* Operator Profile Card - Redesigned v2 */}
      <div className="farmer-profile-card-v2">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="avatar-square" style={{ background: '#F6F0EB' }}>
              <UserIcon size={36} style={{ strokeWidth: 1.5, color: '#B28461' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#3B2214' }}>Amit Kumar</h2>
                <span className="badge-active-farmer" style={{ background: '#FFF7ED', color: '#B28461', borderColor: '#FFEDD5' }}>Active Operator</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span>ID: <strong>EMP101</strong></span>
                <span>•</span>
                <span>Phone: <strong>+91 98123 45678</strong></span>
              </div>
              <div style={{ fontSize: '12px', color: '#4E2A18', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontWeight: '700' }}>
                <MapPin size={13} /> Active Terminal: <span>Kheda Dairy Center</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid inside the card */}
        <div className="stats-row">
          <div className="stat-col">
            <span className="stat-label">Today's Intake</span>
            <span className="stat-val">{todayTotalVolume} L</span>
          </div>
          <div className="stat-col">
            <span className="stat-label">Shift Entries</span>
            <span className="stat-val">{todayEntries.length} Entries</span>
          </div>
          <div className="stat-col">
            <span className="stat-label">Active Shift</span>
            <span className="stat-val">Morning Shift</span>
          </div>
        </div>
      </div>

      {/* Premium Sub-tabs row */}
      <div className="farmer-subtabs-row">
        <div
          className={`farmer-subtab-btn ${subView === 'overview' ? 'active' : ''}`}
          onClick={() => setSubView('overview')}
        >
          <WalletIcon />
          <div className="tab-title">Intake Hub</div>
          <div className="tab-subtitle">(Overview)</div>
        </div>
        
        <div
          className={`farmer-subtab-btn ${subView === 'calculator' ? 'active' : ''}`}
          onClick={() => setSubView('calculator')}
        >
          <MilkCanIcon />
          <div className="tab-title" style={{ marginTop: '4px' }}>Fast Milk Entry</div>
        </div>
        
        <div
          className={`farmer-subtab-btn ${subView === 'shift-log' ? 'active' : ''}`}
          onClick={() => setSubView('shift-log')}
        >
          <BankIcon />
          <div className="tab-title" style={{ marginTop: '4px' }}>Shift History Log</div>
        </div>
      </div>

      {/* View 1: Intake Hub Overview */}
      {subView === 'overview' && (
        <div>
          {/* Today's Logged Volume Banner */}
          <div className="lifetime-value-banner" style={{ background: 'linear-gradient(135deg, #FFFDF9 0%, #FDF4E7 100%)', borderColor: '#FBE5C9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 2 }}>
              <MilkCansIllustration />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '11px', color: '#C48434', fontWeight: '800', letterSpacing: '0.5px' }}>TODAY'S INTENDED VOLUME</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#4E2A18', margin: '2px 0' }}>
                  {todayTotalVolume} L
                </div>
                <div style={{ fontSize: '11px', color: '#AB988B', fontWeight: '500' }}>Logged intake at Kheda center today</div>
              </div>
            </div>
            <button className="summary-badge" onClick={() => setSubView('shift-log')}>
              <span>View Shift</span>
              <ChevronRight size={14} />
            </button>
            <MilkSplashIllustration />
          </div>

          {/* Sub-cards 2x2 Grid */}
          <div className="dashboard-subcards-grid">
            {/* Today's Collection Value */}
            <div className="premium-subcard cleared">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ textAlign: 'left' }}>
                  <div className="icon-container">
                    <ClearedBankIcon />
                  </div>
                  <div className="card-title">Today's Value</div>
                  <div className="card-value">₹{todayTotalAmount.toLocaleString()}</div>
                  <div className="card-subtext">Logged milk value today</div>
                </div>
              </div>
              <div className="card-badge">✓ Logged</div>
              <button className="arrow-btn" onClick={() => setSubView('shift-log')} title="View entries">
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Average Quality Ratings */}
            <div className="premium-subcard pending">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ textAlign: 'left' }}>
                  <div className="icon-container">
                    <PendingHourglassIcon />
                  </div>
                  <div className="card-title">Quality Ratings</div>
                  <div className="card-value" style={{ fontSize: '18px', marginTop: '10px', height: '28px', lineHeight: '28px' }}>
                    {avgFat}% F / {avgSnf}% S
                  </div>
                  <div className="card-subtext">Avg FAT & SNF metrics today</div>
                </div>
              </div>
              <div className="card-badge">✓ Premium Grade</div>
              <button className="arrow-btn" onClick={() => setSubView('calculator')} title="Add entry">
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Active Collection Rate */}
            <div className="premium-subcard advance">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ textAlign: 'left' }}>
                  <div className="icon-container">
                    <AdvanceTrendIcon />
                  </div>
                  <div className="card-title">Base Rate / L</div>
                  <div className="card-value">₹54.00</div>
                  <div className="card-subtext">Base collection rate chart</div>
                </div>
              </div>
              <div className="card-badge">₹ Active</div>
              <button className="arrow-btn" onClick={() => setSubView('calculator')} title="Open entry window">
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Fast Entry Shortcut */}
            <div className="premium-subcard passbook">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ textAlign: 'left' }}>
                  <div className="icon-container">
                    <PassbookBookIcon />
                  </div>
                  <div className="card-title">Fast Entry</div>
                  <div className="card-value" style={{ fontSize: '16px', marginTop: '10px', height: '28px', lineHeight: '28px' }}>Launch Entry</div>
                  <div className="card-subtext" style={{ marginBottom: '8px' }}>Log milk delivery instantly</div>
                </div>
              </div>
              <button className="pill-button" onClick={() => setSubView('calculator')}>
                <span>New Entry</span>
                <ArrowRight size={12} />
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

          {/* Connected Producer Details Card */}
          <div className="direct-deposit-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <PremiumBankBuildingSVG />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '10px', color: '#7C695D', fontWeight: '800', letterSpacing: '0.5px' }}>CONNECTED PRODUCERS</div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#3B2214', margin: '2px 0' }}>
                  Kheda Center Producers
                </div>
                <div style={{ fontSize: '12px', color: '#7C695D', fontWeight: '600' }}>
                  Active Farmers Logged: {farmers.filter(f => f.village === 'Kheda').length}
                </div>
                <div style={{ fontSize: '11px', color: '#AB988B', marginTop: '2px' }}>
                  Intake Location: Kheda Center | Shift: Morning Shift | Terminal: ONLINE
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="verified-badge" style={{ background: '#FFF7ED', color: '#C48434', borderColor: '#FFEDD5' }}>
                <ShieldCheck size={14} />
                <span>Verified Shift</span>
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
      )}

      {/* View 2: Calculator Form Sub-Tab */}
      {subView === 'calculator' && (
        <div style={{ background: '#ffffff', borderRadius: '24px', border: '1.5px solid #EFE2D5', padding: '24px', boxShadow: '0 8px 30px rgba(78, 42, 24, 0.02)', textAlign: 'left' }}>
          <button 
            onClick={() => setSubView('overview')} 
            style={{ background: 'none', border: 'none', color: '#4E2A18', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: 0, marginBottom: '14px' }}
          >
            <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back to Dashboard
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EFE2D5', paddingBottom: '12px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#3B2214' }}>⚡ Fast Milk Entry Calculator</h3>
            <span style={{ fontSize: '12px', background: '#F5EBE1', color: '#4E2A18', fontWeight: '700', padding: '4px 10px', borderRadius: '20px' }}>
              Shift: {shift}
            </span>
          </div>

          <form onSubmit={handleFastEntry}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#3B2214', display: 'block', marginBottom: '6px' }}>Select Farmer</label>
              <select
                value={selectedFarmerId}
                onChange={(e) => setSelectedFarmerId(e.target.value)}
                className="form-input"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                required
              >
                {farmers.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.id}) - {f.village}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#3B2214', display: 'block', marginBottom: '6px' }}>Shift Selection</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['Morning', 'Evening'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setShift(s)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: shift === s ? '2px solid #4E2A18' : '1px solid #E2E8F0',
                      background: shift === s ? '#F5EBE1' : '#FFFFFF',
                      fontWeight: '800',
                      color: shift === s ? '#4E2A18' : '#64748B'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid-2col-responsive" style={{ gap: "12px", marginBottom: '16px' }}>
              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#3B2214', display: 'block', marginBottom: '6px' }}>Weight (Liters)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#3B2214', display: 'block', marginBottom: '6px' }}>Fat %</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  required
                />
              </div>
            </div>

            <div className="grid-2col-responsive" style={{ gap: "12px", marginBottom: '20px' }}>
              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#3B2214', display: 'block', marginBottom: '6px' }}>SNF %</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={snf}
                  onChange={(e) => setSnf(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#3B2214', display: 'block', marginBottom: '6px' }}>Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  required
                />
              </div>
            </div>

            {/* Live Calculation Display Box */}
            <div style={{ background: '#FAF7F2', border: '1.5px solid #EFE2D5', borderRadius: '16px', padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#7C695D', fontWeight: '700', textTransform: 'uppercase' }}>Calculated Milk Value</span>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#3B2214', marginTop: '2px' }}>
                  Rate per Liter: <strong style={{ color: '#4E2A18' }}>₹{currentRate.toFixed(2)}</strong>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#7C695D', fontWeight: '700' }}>TOTAL AMOUNT</span>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#4E2A18' }}>
                  ₹{parseFloat(totalAmount).toLocaleString()}
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', borderRadius: '14px' }}>
              <PlusCircle size={16} /> Submit & Print Slip
            </button>
          </form>
        </div>
      )}

      {/* View 3: Shift History Log */}
      {subView === 'shift-log' && (
        <div style={{ background: '#ffffff', borderRadius: '24px', border: '1.5px solid #EFE2D5', padding: '24px', boxShadow: '0 8px 30px rgba(78, 42, 24, 0.02)', textAlign: 'left' }}>
          <button 
            onClick={() => setSubView('overview')} 
            style={{ background: 'none', border: 'none', color: '#4E2A18', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: 0, marginBottom: '14px' }}
          >
            <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back to Dashboard
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#3B2214' }}>Shift Collection Stream</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Logged milk delivery slips for Kheda Center today</p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#4E2A18', background: '#EAF4EE', padding: '6px 12px', borderRadius: '12px' }}>
              {todayEntries.length} Milk Deliveries
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time / ID</th>
                  <th>Farmer Producer</th>
                  <th>Quantity</th>
                  <th>FAT / SNF</th>
                  <th>Rate/L</th>
                  <th>Total Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {todayEntries.length > 0 ? (
                  todayEntries.map(e => (
                    <tr key={e.id}>
                      <td>
                        <strong style={{ color: '#3B2214' }}>{e.timestamp}</strong>
                        <div style={{ fontSize: '11px', color: '#AB988B' }}>{e.id}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: '800', color: '#3B2214' }}>{e.farmerName}</span>
                        <div style={{ fontSize: '11px', color: '#7C695D' }}>{e.farmerId}</div>
                      </td>
                      <td><strong>{e.quantity} L</strong></td>
                      <td>{e.fat}% / {e.snf}%</td>
                      <td>₹{e.rate.toFixed(2)}</td>
                      <td><strong style={{ color: '#4E2A18' }}>₹{e.totalAmount.toFixed(2)}</strong></td>
                      <td>
                        <button onClick={() => openSlip(e)} className="btn btn-secondary btn-sm" style={{ background: '#EAF4EE', color: '#4E2A18', border: '1px solid #DCC5B3' }}>
                          <Printer size={12} /> Slip
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No milk entries logged in this shift yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
