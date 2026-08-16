import React from 'react';
import { Milk, Users, BarChart3, ArrowRight } from 'lucide-react';
import { RuduLogo } from '../components/RuduLogo';

const FarmLandscapeSVG = () => (
  <svg viewBox="0 0 375 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
    <rect width="375" height="140" fill="url(#skyGrad)" />
    
    {/* Far Hill (Muted warm brown) */}
    <path d="M0 110 C 80 90, 160 120, 240 100 C 290 88, 330 92, 375 105 L 375 140 L 0 140 Z" fill="#7C695D" opacity="0.3" />
    
    {/* Mid Hill with Barn (Lighter warm chocolate) */}
    <path d="M0 120 C 60 110, 120 100, 180 115 C 240 130, 310 100, 375 118 L 375 140 L 0 140 Z" fill="#B28461" opacity="0.4" />
    
    {/* Barn and Silo Silhouette */}
    <rect x="290" y="82" width="10" height="25" rx="2" fill="#4E2A18" opacity="0.75" />
    <path d="M288 83 C290 77, 300 77, 302 83 Z" fill="#4E2A18" opacity="0.75" />
    <rect x="303" y="87" width="22" height="20" fill="#4E2A18" opacity="0.75" />
    <path d="M301 87 L314 77 L327 87 Z" fill="#4E2A18" opacity="0.75" />
    
    {/* Trees */}
    <circle cx="90" cy="105" r="5" fill="#3C1F10" opacity="0.4" />
    <circle cx="95" cy="107" r="4" fill="#3C1F10" opacity="0.4" />
    <line x1="90" y1="105" x2="90" y2="114" stroke="#3C1F10" strokeWidth="1.5" opacity="0.4" />
    <line x1="95" y1="107" x2="95" y2="115" stroke="#3C1F10" strokeWidth="1.5" opacity="0.4" />

    <circle cx="210" cy="110" r="6" fill="#3C1F10" opacity="0.5" />
    <line x1="210" y1="110" x2="210" y2="120" stroke="#3C1F10" strokeWidth="1.5" opacity="0.5" />

    {/* Near Hill (Dark Chocolate) */}
    <path d="M0 130 C 50 118, 120 118, 170 128 C 230 140, 300 115, 375 125 L 375 140 L 0 140 Z" fill="#4E2A18" />
    
    {/* Cows Silhouette */}
    <g transform="translate(60, 116) scale(0.65)" opacity="0.85">
      <rect x="10" y="8" width="16" height="8" rx="2" fill="#3C1F10" />
      <rect x="12" y="16" width="1.5" height="6" fill="#3C1F10" />
      <rect x="15" y="16" width="1.5" height="6" fill="#3C1F10" />
      <rect x="21" y="16" width="1.5" height="6" fill="#3C1F10" />
      <rect x="23" y="16" width="1.5" height="6" fill="#3C1F10" />
      <path d="M6 16 L11 8 L13 11 L9 17 Z" fill="#3C1F10" />
      <rect x="3" y="14" width="5" height="3" rx="1" fill="#3C1F10" />
      <line x1="25" y1="9" x2="27" y2="14" stroke="#3C1F10" strokeWidth="1" />
    </g>

    <g transform="translate(130, 122) scale(0.6)" opacity="0.9">
      <rect x="10" y="8" width="16" height="8" rx="2" fill="#3C1F10" />
      <rect x="12" y="16" width="1.5" height="6" fill="#3C1F10" />
      <rect x="15" y="16" width="1.5" height="6" fill="#3C1F10" />
      <rect x="21" y="16" width="1.5" height="6" fill="#3C1F10" />
      <rect x="23" y="16" width="1.5" height="6" fill="#3C1F10" />
      <path d="M6 16 L11 8 L13 11 L9 17 Z" fill="#3C1F10" />
      <rect x="3" y="14" width="5" height="3" rx="1" fill="#3C1F10" />
      <line x1="25" y1="9" x2="27" y2="14" stroke="#3C1F10" strokeWidth="1" />
    </g>

    <g transform="translate(245, 110) scale(0.4)" opacity="0.5">
      <rect x="10" y="8" width="16" height="8" rx="2" fill="#3C1F10" />
      <rect x="12" y="16" width="1.5" height="5" fill="#3C1F10" />
      <rect x="15" y="16" width="1.5" height="5" fill="#3C1F10" />
      <rect x="21" y="16" width="1.5" height="5" fill="#3C1F10" />
      <rect x="23" y="16" width="1.5" height="5" fill="#3C1F10" />
      <path d="M6 16 L11 8 L13 11 L9 17 Z" fill="#3C1F10" />
      <rect x="3" y="14" width="5" height="3" rx="1" fill="#3C1F10" />
    </g>
    
    <defs>
      <linearGradient id="skyGrad" x1="187.5" y1="0" x2="187.5" y2="140" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0" />
        <stop offset="0.6" stopColor="#F5EBE1" stopOpacity="0.4" />
        <stop offset="1" stopColor="#F5EBE1" stopOpacity="0.9" />
      </linearGradient>
    </defs>
  </svg>
);

export const SplashScreen = ({ onGetStarted }) => {
  return (
    <div className="splash-container">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Brand Logo Banner */}
        <div className="splash-logo-box" style={{ width: '130px', height: '60px', marginTop: '48px', marginBottom: '18px' }}>
          <RuduLogo height={50} />
        </div>

        <h1 className="splash-title" style={{ marginTop: '12px' }}>RUDU FARM</h1>
        <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Better Dairy. Better Tomorrow.
        </div>
        <p className="splash-subtitle" style={{ marginTop: '16px' }}>
          Smart Management for a Stronger Dairy Community
        </p>
      </div>

      {/* 3 Feature Pills */}
      <div className="splash-features-grid">
        <div className="splash-feature-pill">
          <div className="splash-feature-icon-box">
            <Milk size={18} strokeWidth={2.5} />
          </div>
          <span>Milk Collection</span>
        </div>

        <div className="splash-feature-pill">
          <div className="splash-feature-icon-box">
            <Users size={18} strokeWidth={2.5} />
          </div>
          <span>Farmer Management</span>
        </div>

        <div className="splash-feature-pill">
          <div className="splash-feature-icon-box">
            <BarChart3 size={18} strokeWidth={2.5} />
          </div>
          <span>Transparent Payments</span>
        </div>
      </div>

      {/* Decorative Farm Landscape SVG */}
      <div className="splash-hill-svg-container">
        <FarmLandscapeSVG />
      </div>

      <button onClick={onGetStarted} className="details-action-btn-filled" style={{ padding: '14px', borderRadius: '14px', fontSize: '13px', width: '100%', marginBottom: '10px' }}>
        Get Started <ArrowRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
};
