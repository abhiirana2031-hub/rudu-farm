import { RuduLogo } from '../components/RuduLogo';
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
  User
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
    <text x="50" y="27" fill="#4E2A18" fontSize="7.5" fontWeight="800" textAnchor="middle">BANK</text>
  </svg>
);

const CowPastureSilhouette = () => (
  <svg viewBox="0 0 800 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="pasture-silhouette-svg" preserveAspectRatio="none">
    {/* Hills */}
    <path d="M0 80c100-20 200-10 350-30s300 10 450-20v70H0V80z" fill="#DCC5B3" opacity="0.25" />
    <path d="M0 90c150-10 300-30 450-20s200 20 350 10v20H0V90z" fill="#4E2A18" opacity="0.12" />
    {/* Simple cows & house silhouettes */}
    <path d="M120 75h8v4h-2v2h-1v-2h-3v2h-1v-2h-1v-4z" fill="#4E2A18" opacity="0.3" />
    <circle cx="129" cy="74" r="2.5" fill="#4E2A18" opacity="0.3" />
    <path d="M160 70l6-4 6 4v8h-12v-8z" fill="#4E2A18" opacity="0.2" />
    
    <path d="M680 73h10v5h-2v3h-1v-3h-4v3h-1v-3h-2v-5z" fill="#4E2A18" opacity="0.3" />
    <circle cx="691" cy="72" r="3" fill="#4E2A18" opacity="0.3" />
  </svg>
);

export const FarmerDashboard = ({ initialTab }) => {
  const { farmers, selectedFarmerId, entries, payouts, openSlip } = useFarm();
  const [activeSubTab, setActiveSubTab] = useState(initialTab || 'Withdrawal Passbook'); // 'Withdrawal Passbook' | 'Supply History' | 'Details'
  const [selectedPayoutSlip, setSelectedPayoutSlip] = useState(null);
  const [showDetailedPassbook, setShowDetailedPassbook] = useState(false);

  // Request Advance States
  const [isRequestAdvanceOpen, setIsRequestAdvanceOpen] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [advanceReason, setAdvanceReason] = useState('Cattle Feed Purchase');
  const [advanceLoading, setAdvanceLoading] = useState(false);
  const [advanceSuccess, setAdvanceSuccess] = useState(false);
  const [createdTransactionId, setCreatedTransactionId] = useState('');

  const handleRequestAdvanceSubmit = (e) => {
    e.preventDefault();
    if (!advanceAmount || parseFloat(advanceAmount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    setAdvanceLoading(true);
    setTimeout(() => {
      setAdvanceLoading(false);
      setAdvanceSuccess(true);
      const fakeTxnId = 'TXN' + Math.floor(Math.random() * 9000000 + 1000000);
      setCreatedTransactionId(fakeTxnId);
      
      // Update local memory data dynamically
      farmer.advanceBalance += parseFloat(advanceAmount);
    }, 1500);
  };

  const closeAdvanceModal = () => {
    setIsRequestAdvanceOpen(false);
    setAdvanceAmount('');
    setAdvanceSuccess(false);
  };

  useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);

  const farmer = farmers.find(f => f.id === selectedFarmerId) || farmers[0];
  const farmerEntries = entries.filter(e => e.farmerId === farmer.id);
  const farmerPayouts = payouts.filter(p => p.farmerId === farmer.id || p.farmerName.toLowerCase().includes(farmer.name.toLowerCase()));

  const totalClearedPayouts = farmerPayouts.reduce((acc, p) => acc + p.amount, 0);

  const handlePrintPayoutSlip = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '24px' }}>
      {/* Farmer Profile Card - Redesigned v2 */}
      <div className="farmer-profile-card-v2">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="avatar-square">
              <User size={36} style={{ strokeWidth: 1.5 }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#3B2214' }}>{farmer.name}</h2>
                <span className="badge-active-farmer">Active Farmer</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span>ID: <strong>{farmer.id}</strong></span>
                <span>•</span>
                <span>Phone: <strong>{farmer.phone}</strong></span>
              </div>
              <div style={{ fontSize: '12px', color: '#4E2A18', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontWeight: '700' }}>
                <MapPin size={13} /> Village: <span>{farmer.village}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid inside the card */}
        <div className="stats-row">
          <div className="stat-col">
            <span className="stat-label">Total Supply</span>
            <span className="stat-val">{farmer.totalSupplied} L</span>
          </div>
          <div className="stat-col">
            <span className="stat-label">This Month</span>
            <span className="stat-val">{farmer.thisMonthSupplied} L</span>
          </div>
          <div className="stat-col">
            <span className="stat-label">Member Since</span>
            <span className="stat-val">Jan 2024</span>
          </div>
        </div>
      </div>

      {/* Premium Sub-tabs row */}
      <div className="farmer-subtabs-row">
        <div
          className={`farmer-subtab-btn ${activeSubTab === 'Withdrawal Passbook' ? 'active' : ''}`}
          onClick={() => {
            setActiveSubTab('Withdrawal Passbook');
            setShowDetailedPassbook(false);
          }}
        >
          <WalletIcon />
          <div className="tab-title">Payout Passbook</div>
          <div className="tab-subtitle">(Withdrawals)</div>
        </div>
        
        <div
          className={`farmer-subtab-btn ${activeSubTab === 'Supply History' ? 'active' : ''}`}
          onClick={() => {
            setActiveSubTab('Supply History');
          }}
        >
          <MilkCanIcon />
          <div className="tab-title" style={{ marginTop: '4px' }}>Milk Supply Ledger</div>
        </div>
        
        <div
          className={`farmer-subtab-btn ${activeSubTab === 'Details' ? 'active' : ''}`}
          onClick={() => {
            setActiveSubTab('Details');
          }}
        >
          <BankIcon />
          <div className="tab-title" style={{ marginTop: '4px' }}>Bank & Profile Details</div>
        </div>
      </div>

      {/* Tab 1: Payout Passbook Dashboard Overview */}
      {activeSubTab === 'Withdrawal Passbook' && !showDetailedPassbook && (
        <div>
          {/* Lifetime Value Card Banner */}
          <div className="lifetime-value-banner" style={{ background: 'linear-gradient(135deg, #FFFDF9 0%, #FDF4E7 100%)', borderColor: '#FBE5C9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 2 }}>
              <MilkCansIllustration />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '11px', color: '#C48434', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' }}>LIFETIME VALUE</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#4E2A18', margin: '2px 0' }}>
                  ₹{farmer.totalEarned.toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: '#AB988B', fontWeight: '500' }}>Total earned from milk supply</div>
              </div>
            </div>
            <button className="summary-badge" onClick={() => setShowDetailedPassbook(true)}>
              <span>View Summary</span>
              <ChevronRight size={14} />
            </button>
            <MilkSplashIllustration />
          </div>


          {/* Sub-cards 2x2 Grid */}
          <div className="dashboard-subcards-grid">
            {/* Cleared Payouts */}
            <div className="premium-subcard cleared">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ textAlign: 'left' }}>
                  <div className="icon-container">
                    <ClearedBankIcon />
                  </div>
                  <div className="card-title">Cleared Payouts</div>
                  <div className="card-value">₹{(farmer.clearedPayout || totalClearedPayouts).toLocaleString()}</div>
                  <div className="card-subtext">Settled into bank account</div>
                </div>
              </div>
              <div className="card-badge">✓ Cleared</div>
              <button className="arrow-btn" onClick={() => setShowDetailedPassbook(true)} title="View detailed passbook">
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Pending Balance */}
            <div className="premium-subcard pending">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ textAlign: 'left' }}>
                  <div className="icon-container">
                    <PendingHourglassIcon />
                  </div>
                  <div className="card-title">Pending Balance</div>
                  <div className="card-value">₹{farmer.pendingPayout.toLocaleString()}</div>
                  <div className="card-subtext">Next settlement cycle</div>
                </div>
              </div>
              <div className="card-badge">⌛ Pending</div>
              <button className="arrow-btn" onClick={() => setShowDetailedPassbook(true)} title="View detailed passbook">
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Advance Balance */}
            <div className="premium-subcard advance">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ textAlign: 'left' }}>
                  <div className="icon-container">
                    <AdvanceTrendIcon />
                  </div>
                  <div className="card-title">Advance Balance</div>
                  <div className="card-value">₹{farmer.advanceBalance.toLocaleString()}</div>
                  <div className="card-subtext">Feed / cash advance</div>
                </div>
              </div>
              <button className="pill-button" onClick={() => setIsRequestAdvanceOpen(true)}>
                <span>Request Advance</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {/* View Passbook Card */}
            <div className="premium-subcard passbook">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ textAlign: 'left' }}>
                  <div className="icon-container">
                    <PassbookBookIcon />
                  </div>
                  <div className="card-title">View Passbook</div>
                  <div className="card-value" style={{ fontSize: '16px', marginTop: '10px', height: '28px', lineHeight: '28px' }}>Passbook</div>
                  <div className="card-subtext" style={{ marginBottom: '8px' }}>Check all your payout transactions</div>
                </div>
              </div>
              <button className="pill-button" onClick={() => setShowDetailedPassbook(true)}>
                <span>View Passbook</span>
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

          {/* Linked Bank & Account Details Card */}
          <div className="direct-deposit-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <PremiumBankBuildingSVG />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '10px', color: '#7C695D', fontWeight: '800', letterSpacing: '0.5px' }}>DIRECT DEPOSIT BANK ACCOUNT</div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#3B2214', margin: '2px 0' }}>
                  {farmer.bankName || 'State Bank of India'}
                </div>
                <div style={{ fontSize: '12px', color: '#7C695D', fontWeight: '600' }}>
                  A/C: {farmer.accNumber || 'XXXX-XXXX-4910'}
                </div>
                <div style={{ fontSize: '11px', color: '#AB988B', marginTop: '2px' }}>
                  IFSC: {farmer.ifsc || 'SBIN0001234'} | UPI ID: {farmer.upiId || `${farmer.name.toLowerCase().replace(/\s+/g, '')}@upi`}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="verified-badge">
                <ShieldCheck size={14} />
                <span>Verified Bank Account</span>
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

      {/* Tab 1 (Alternative View): Detailed Passbook Table List */}
      {activeSubTab === 'Withdrawal Passbook' && showDetailedPassbook && (
        <div style={{ background: '#ffffff', borderRadius: '24px', border: '1.5px solid #EFE2D5', padding: '24px', boxShadow: '0 8px 30px rgba(78, 42, 24, 0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ textAlign: 'left' }}>
              <button 
                onClick={() => setShowDetailedPassbook(false)} 
                style={{ background: 'none', border: 'none', color: '#4E2A18', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: 0, marginBottom: '8px' }}
              >
                <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back to Overview
              </button>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#3B2214' }}>Farmer Payout Passbook</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Complete audit log of all withdrawals and bank/UPI transfers received</p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#4E2A18', background: '#EAF4EE', padding: '6px 14px', borderRadius: '12px' }}>
              {farmerPayouts.length} Withdrawal Transactions
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tx ID & Date</th>
                  <th>Payment Transfer Method</th>
                  <th>Reference Code / UTR</th>
                  <th>Amount Cleared</th>
                  <th>Status</th>
                  <th>Withdrawal Slip</th>
                </tr>
              </thead>
              <tbody>
                {farmerPayouts.length > 0 ? (
                  farmerPayouts.map(p => (
                    <tr key={p.id}>
                      <td>
                        <strong style={{ color: '#0F172A' }}>{p.id}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.date}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: '700', color: '#4E2A18' }}>{p.method}</span>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.notes}</div>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#475569', fontWeight: '700' }}>
                        {p.reference}
                      </td>
                      <td>
                        <strong style={{ color: '#4E2A18', fontSize: '16px' }}>
                          +₹{p.amount.toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        <span className="badge badge-success">✓ {p.status || 'Cleared'}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedPayoutSlip(p)}
                          className="btn btn-secondary btn-sm"
                          style={{ background: '#EAF4EE', color: '#4E2A18', border: '1px solid #DCC5B3', fontWeight: '800', fontSize: '11px' }}
                        >
                          <FileText size={12} /> Receipt Slip
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No withdrawal transactions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Supply History */}
      {activeSubTab === 'Supply History' && (
        <div style={{ background: '#ffffff', borderRadius: '24px', border: '1.5px solid #EFE2D5', padding: '24px', boxShadow: '0 8px 30px rgba(78, 42, 24, 0.02)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px', color: '#3B2214', textAlign: 'left' }}>Complete Milk Supply Ledger</h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Shift</th>
                  <th>Quantity</th>
                  <th>Fat / SNF</th>
                  <th>Rate / L</th>
                  <th>Total (₹)</th>
                  <th>Slip</th>
                </tr>
              </thead>
              <tbody>
                {farmerEntries.map(e => (
                  <tr key={e.id}>
                    <td>{e.date}</td>
                    <td><span className="badge badge-info">{e.shift}</span></td>
                    <td><strong>{e.quantity} L</strong></td>
                    <td>{e.fat}% / {e.snf}%</td>
                    <td>₹{e.rate.toFixed(2)}</td>
                    <td><strong style={{ color: '#4E2A18' }}>₹{e.totalAmount.toFixed(2)}</strong></td>
                    <td>
                      <button onClick={() => openSlip(e)} className="btn btn-secondary btn-sm">
                        <Printer size={12} /> Milk Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Details & Bank info */}
      {activeSubTab === 'Details' && (
        <div style={{ background: '#ffffff', borderRadius: '24px', border: '1.5px solid #EFE2D5', padding: '24px', boxShadow: '0 8px 30px rgba(78, 42, 24, 0.02)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '18px', color: '#3B2214', textAlign: 'left' }}>Farmer Profile & Bank Account</h3>

          <div className="grid-2col-responsive" style={{ gap: "20px", fontSize: "14px", textAlign: 'left' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}>Full Name</div>
              <strong style={{ color: '#3B2214' }}>{farmer.name}</strong>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}>Farmer ID</div>
              <strong style={{ color: '#3B2214' }}>{farmer.id}</strong>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}>Mobile Number</div>
              <strong style={{ color: '#3B2214' }}>{farmer.phone}</strong>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}>Village Center</div>
              <strong style={{ color: '#3B2214' }}>{farmer.village}</strong>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}>Aadhaar KYC</div>
              <strong style={{ color: '#3B2214' }}>{farmer.aadhaarNumber || '9842 1048 5912'}</strong>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}>Farmer UPI ID</div>
              <strong style={{ color: '#3B2214' }}>{farmer.upiId || `${farmer.name.toLowerCase().replace(/\s+/g, '')}@upi`}</strong>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}>Bank Name</div>
              <strong style={{ color: '#3B2214' }}>{farmer.bankName || 'State Bank of India'}</strong>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}>Account Number</div>
              <strong style={{ color: '#3B2214' }}>{farmer.accNumber || 'XXXX-XXXX-4910'}</strong>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}>IFSC Code</div>
              <strong style={{ color: '#3B2214' }}>{farmer.ifsc || 'SBIN0001234'}</strong>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}>Branch Name</div>
              <strong style={{ color: '#3B2214' }}>{farmer.branchName || 'Kheda Main Branch'}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Payout Receipt Slip Modal */}
      {selectedPayoutSlip && (
        <div className="modal-overlay" style={{ zIndex: 1200 }}>
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #4E2A18 0%, #8C4E2D 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Printer size={18} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'white' }}>Withdrawal Payout Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedPayoutSlip(null)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ background: '#F8FAF9', padding: '20px' }}>
              <div className="thermal-slip printable-area">
                <div className="header">
                  <RuduLogo height={32} />
                  <h2>RUDU FARM</h2>
                  <div style={{ fontSize: '11px' }}>Official Payout Settlement Slip</div>
                  <div style={{ fontSize: '10px', marginTop: '4px' }}>Kheda Dairy Center | Settlement Ledger</div>
                </div>

                <div className="line-item">
                  <span>Payout Voucher ID:</span>
                  <strong>{selectedPayoutSlip.id}</strong>
                </div>
                <div className="line-item">
                  <span>Transfer Date:</span>
                  <span>{selectedPayoutSlip.date}</span>
                </div>
                <div className="line-item">
                  <span>Transfer Mode:</span>
                  <strong>{selectedPayoutSlip.method}</strong>
                </div>

                <hr style={{ border: 'none', borderTop: '1px dashed #000', margin: '8px 0' }} />

                <div className="line-item">
                  <span>Farmer Name:</span>
                  <strong>{farmer.name}</strong>
                </div>
                <div className="line-item">
                  <span>Farmer ID:</span>
                  <strong>{farmer.id}</strong>
                </div>
                <div className="line-item">
                  <span>Bank Account / VPA:</span>
                  <span>{farmer.upiId || farmer.accNumber}</span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px dashed #000', margin: '8px 0' }} />

                <div className="line-item">
                  <span>Transaction UTR Code:</span>
                  <strong style={{ fontSize: '11px' }}>{selectedPayoutSlip.reference}</strong>
                </div>
                <div className="line-item">
                  <span>Status:</span>
                  <strong style={{ color: '#4E2A18' }}>CLEARED & DEPOSITED</strong>
                </div>

                <div className="total-box" style={{ marginTop: '12px' }}>
                  <span>AMOUNT CLEARED:</span>
                  <span>₹{selectedPayoutSlip.amount.toLocaleString()}</span>
                </div>

                <div className="footer" style={{ marginTop: '16px' }}>
                  Thank you for trusting Rudu Farm!<br />
                  _Better Dairy. Better Tomorrow._
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button onClick={handlePrintPayoutSlip} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>
                  <Printer size={16} /> Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Advance Modal Sheet */}
      {isRequestAdvanceOpen && (
        <div className="modal-overlay" style={{ zIndex: 1200 }}>
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #4E2A18 0%, #8C4E2D 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'white' }}>Request Cash / Feed Advance</h3>
              </div>
              <button
                onClick={closeAdvanceModal}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: '24px' }}>
              {!advanceSuccess ? (
                <form onSubmit={handleRequestAdvanceSubmit}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '850', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                      Request Amount (₹)
                    </label>
                    <div className="auth-input-wrapper">
                      <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-muted)', marginLeft: '12px' }}>₹</span>
                      <input
                        type="number"
                        placeholder="Enter advance amount"
                        value={advanceAmount}
                        onChange={(e) => setAdvanceAmount(e.target.value)}
                        style={{ fontSize: '18px', fontWeight: '800', paddingLeft: '4px' }}
                        required
                      />
                    </div>
                    {/* Quick Amount Suggestion Chips */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                      {['500', '1000', '2000', '5000', '10000'].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setAdvanceAmount(amt)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '16px',
                            border: '1.5px solid var(--border)',
                            background: advanceAmount === amt ? 'var(--primary)' : '#FFFFFF',
                            color: advanceAmount === amt ? '#FFFFFF' : 'var(--text-main)',
                            fontWeight: '800',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '850', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                      Purpose / Reason
                    </label>
                    <select
                      value={advanceReason}
                      onChange={(e) => setAdvanceReason(e.target.value)}
                      style={{
                        width: '100%',
                        height: '46px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--border)',
                        padding: '0 12px',
                        fontSize: '13.5px',
                        fontWeight: '700',
                        color: 'var(--text-main)',
                        background: '#FFFFFF'
                      }}
                    >
                      <option value="Cattle Feed Purchase">Cattle Feed Purchase</option>
                      <option value="Veterinary Care & Medicines">Veterinary Care & Medicines</option>
                      <option value="Seeds & Farming Supplies">Seeds & Farming Supplies</option>
                      <option value="Family Expense / Emergency">Family Expense / Emergency</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={advanceLoading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {advanceLoading ? (
                      <span>Processing Request...</span>
                    ) : (
                      <>
                        <span>Submit Advance Request</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#22C55E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '950', color: 'var(--text-main)', margin: '0 0 8px' }}>Request Approved!</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: '1.4' }}>
                    An amount of <strong>₹{parseFloat(advanceAmount).toLocaleString()}</strong> for <em>{advanceReason}</em> has been approved and credited to your Advance account.
                  </p>
                  
                  <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '12px', fontSize: '12px', color: 'var(--text-main)', marginBottom: '24px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span>Transaction ID:</span>
                      <strong style={{ fontFamily: 'monospace' }}>{createdTransactionId}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Settlement Mode:</span>
                      <strong>Insta-Credit (Direct)</strong>
                    </div>
                  </div>

                  <button
                    onClick={closeAdvanceModal}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px', borderRadius: '30px', justifyContent: 'center' }}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
