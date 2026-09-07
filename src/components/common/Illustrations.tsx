import React from 'react';

// Rudu Brand Wordmark SVG matching app theme
export const RuduBrandLogo: React.FC<{
  className?: string;
  height?: number | string;
  color?: string;
}> = ({
  className = '',
  height = 36,
  color = '#e31e24', // Vibrant Red app theme
}) => (
  <svg
    viewBox="0 0 380 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ height, width: 'auto', display: 'inline-block' }}
    className={className}
  >
    {/* Letter 'R' */}
    <path
      d="M 42 35 C 42 22 55 12 75 12 C 105 12 125 24 125 50 C 125 72 108 84 88 88 C 96 95 106 109 116 122 C 138 150 178 158 230 156 C 290 154 330 144 365 130 C 372 127 375 133 371 138 C 342 166 280 185 210 185 C 130 185 85 160 62 125 L 60 120 C 58 116 54 114 50 114 L 42 114 Z"
      fill={color}
    />
    <path
      d="M 12 35 C 12 22 22 12 35 12 L 55 12 C 90 12 118 26 118 52 C 118 76 92 90 60 90 L 42 90 L 42 135 C 42 147 32 155 20 155 C 8 155 0 147 0 135 L 0 35 C 0 22 10 12 22 12 Z"
      fill={color}
    />
    {/* Inner cut of R */}
    <path
      d="M 42 40 L 42 66 L 58 66 C 72 66 84 60 84 53 C 84 46 72 40 58 40 Z"
      fill="#FFFFFF"
    />

    {/* Letter 'u' (first) */}
    <path
      d="M 130 65 C 130 53 140 45 152 45 C 164 45 174 53 174 65 L 174 95 C 174 106 182 114 194 114 C 206 114 214 106 214 95 L 214 65 C 214 53 224 45 236 45 C 248 45 258 53 258 65 L 258 98 C 258 128 232 145 194 145 C 156 145 130 128 130 98 Z"
      fill={color}
    />

    {/* Dot above 'd' */}
    <circle cx="218" cy="38" r="14" fill={color} />

    {/* Letter 'd' */}
    <path
      d="M 285 30 C 285 18 295 10 307 10 C 319 10 329 18 329 30 L 329 122 C 329 134 319 142 307 142 C 295 142 285 134 285 122 L 285 116 C 274 135 252 145 228 145 C 190 145 165 118 165 88 C 165 58 190 31 228 31 C 252 31 274 41 285 60 Z M 228 62 C 208 62 195 74 195 88 C 195 102 208 114 228 114 C 248 114 261 102 261 88 C 261 74 248 62 228 62 Z"
      fill={color}
    />

    {/* Letter 'u' (second) */}
    <path
      d="M 338 65 C 338 53 348 45 360 45 C 372 45 382 53 382 65 L 382 95 C 382 106 390 114 402 114 C 414 114 422 106 422 95 L 422 65 C 422 53 432 45 444 45 C 456 45 466 53 466 65 L 466 98 C 466 128 440 145 402 145 C 364 145 338 128 338 98 Z"
      fill={color}
      transform="translate(-64, 0)"
    />
  </svg>
);

// High-Fidelity Brand Logo component matching the app's emerald theme
export const RuduFarmLogo: React.FC<{
  className?: string;
  size?: number;
  light?: boolean;
  color?: string;
}> = ({
  className = '',
  size = 36,
  light = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/images/rudu_logo.png"
        alt="Rudu Farm"
        className="h-8 sm:h-9 w-auto object-contain"
        style={{
          filter: 'brightness(0) saturate(100%) invert(18%) sepia(88%) saturate(5832%) hue-rotate(352deg) brightness(98%) contrast(96%)',
        }}
      />
      <div className="flex flex-col text-left pl-1.5 border-l border-red-200">
        <span className={`font-black tracking-tight text-xs uppercase leading-none ${light ? 'text-white' : 'text-red-950'}`}>
          FARM
        </span>
        <span className={`text-[9.5px] font-bold tracking-tight ${light ? 'text-red-200' : 'text-red-700'}`}>
          Smart Dairy
        </span>
      </div>
    </div>
  );
};

// Farmer Avatar with traditional turban
export const FarmerAvatar: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 40,
}) => (
  <div
    style={{ width: size, height: size }}
    className={`rounded-full border-2 border-white/80 shadow-sm overflow-hidden bg-gradient-to-tr from-amber-600 via-emerald-600 to-amber-400 p-0.5 shrink-0 ${className}`}
  >
    <div className="w-full h-full rounded-full bg-amber-50 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        {/* Sky / Morning glow background */}
        <circle cx="24" cy="24" r="24" fill="#FEF3C7" />
        {/* Farmer Face */}
        <ellipse cx="24" cy="27" rx="9" ry="11" fill="#D97706" />
        {/* Eyes & Mustache */}
        <circle cx="20.5" cy="26" r="1.2" fill="#451A03" />
        <circle cx="27.5" cy="26" r="1.2" fill="#451A03" />
        <path d="M19 31 C 21 34, 27 34, 29 31 C 31 33, 27 35, 24 35 C 21 35, 17 33, 19 31 Z" fill="#451A03" />
        {/* Emerald Traditional Turban (Pagri) */}
        <path
          d="M12 21 C 12 11, 21 8, 27 9 C 33 10, 36 15, 36 21 C 36 23, 31 23, 24 23 C 17 23, 12 23, 12 21 Z"
          fill="#047857"
        />
        <path
          d="M13 18 C 17 14, 29 13, 35 17"
          stroke="#10B981"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M15 14 C 20 10, 28 9, 33 13"
          stroke="#34D399"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Turban Knot Jewel/Feather */}
        <ellipse cx="24" cy="11" rx="2" ry="3" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />
        {/* Kurta Collar */}
        <path d="M14 44 C 14 38, 20 37, 24 37 C 28 37, 34 38, 34 44 Z" fill="#FFFFFF" />
        <path d="M24 37 V 44" stroke="#D1D5DB" strokeWidth="1.5" />
      </svg>
    </div>
  </div>
);

// Green Landscape Banner Art for Top Header
export const FarmLandscapeHeader: React.FC<{ title: string; subtitle: string; onBack?: () => void }> = ({
  title,
  subtitle,
  onBack,
}) => (
  <div className="relative w-full rounded-b-3xl overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-700 text-white pt-3 pb-8 px-4 sm:px-6 shadow-md">
    {/* Background Landscape Elements (cows, pastures, sunrise glow) */}
    <div className="absolute inset-0 pointer-events-none opacity-35 overflow-hidden">
      <svg viewBox="0 0 600 240" fill="none" className="w-full h-full object-cover">
        <defs>
          <radialGradient id="sunGlow" cx="450" cy="50" r="160" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="1" stopColor="#047857" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Sun Glow */}
        <circle cx="450" cy="50" r="80" fill="url(#sunGlow)" />
        {/* Distant Hills */}
        <path d="M0 160 Q 150 90, 320 140 T 600 120 L 600 240 L 0 240 Z" fill="#064E3B" fillOpacity="0.6" />
        <path d="M0 180 Q 200 130, 420 170 T 600 150 L 600 240 L 0 240 Z" fill="#065F46" fillOpacity="0.8" />
        
        {/* Dairy Silo & Shed Silhouettes */}
        <rect x="360" y="110" width="30" height="40" rx="3" fill="#022C22" />
        <polygon points="360,110 375,90 390,110" fill="#022C22" />
        <rect x="400" y="120" width="60" height="30" rx="2" fill="#022C22" />
        <polygon points="395,120 430,105 465,120" fill="#022C22" />

        {/* Grazing Cattle Silhouettes */}
        <g fill="#022C22" transform="translate(180, 155) scale(0.65)">
          <ellipse cx="40" cy="25" rx="18" ry="10" />
          <ellipse cx="22" cy="18" rx="8" ry="7" />
          <rect x="26" y="32" width="3.5" height="15" rx="1.5" />
          <rect x="34" y="32" width="3.5" height="15" rx="1.5" />
          <rect x="46" y="32" width="3.5" height="15" rx="1.5" />
          <rect x="52" y="32" width="3.5" height="15" rx="1.5" />
        </g>
        <g fill="#022C22" transform="translate(260, 165) scale(0.5)">
          <ellipse cx="40" cy="25" rx="18" ry="10" />
          <ellipse cx="22" cy="18" rx="8" ry="7" />
          <rect x="26" y="32" width="3.5" height="15" rx="1.5" />
          <rect x="34" y="32" width="3.5" height="15" rx="1.5" />
          <rect x="46" y="32" width="3.5" height="15" rx="1.5" />
          <rect x="52" y="32" width="3.5" height="15" rx="1.5" />
        </g>
      </svg>
    </div>

    {/* Title & Subtitle */}
    <div className="relative z-10 mt-3 flex items-start justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 -ml-1.5 mr-1 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/90"
              aria-label="Back"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mt-1 max-w-md leading-snug">
          {subtitle}
        </p>
      </div>
    </div>
  </div>
);

// High-Fidelity 3D Isometric Components
export const ThreeDIcons = {
  // 1. 3D Milk Can with Splash (exact match to cards in Image 1 & 5)
  MilkCanSplash3D: ({ className = 'w-16 h-16' }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="canBodyGrad" cx="35" cy="45" r="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F1F5F9" />
          <stop offset="0.45" stopColor="#CBD5E1" />
          <stop offset="0.85" stopColor="#94A3B8" />
          <stop offset="1" stopColor="#64748B" />
        </radialGradient>
        <linearGradient id="lidGrad" x1="25" y1="18" x2="65" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#CBD5E1" />
          <stop offset="1" stopColor="#64748B" />
        </linearGradient>
        <linearGradient id="splashGrad" x1="10" y1="70" x2="90" y2="95" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.6" stopColor="#F8FAFC" />
          <stop offset="1" stopColor="#E2E8F0" />
        </linearGradient>
        <filter id="splashShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.22" />
        </filter>
      </defs>
      <g filter="url(#splashShadow)">
        {/* Milk Splash Base Ring */}
        <path
          d="M12 78 C12 74, 25 70, 48 70 C71 70, 88 74, 88 78 C88 84, 76 92, 48 92 C20 92, 12 84, 12 78 Z"
          fill="url(#splashGrad)"
        />
        {/* Splash Droplets */}
        <circle cx="16" cy="66" r="3.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.5" />
        <circle cx="82" cy="68" r="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.5" />
        <circle cx="88" cy="60" r="2.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.5" />
        <path d="M18 76 Q 10 68 15 62 Q 22 70 24 74" fill="#FFFFFF" />
        <path d="M78 76 Q 86 66 82 58 Q 74 68 72 74" fill="#FFFFFF" />

        {/* Milk Can Cylinder */}
        <ellipse cx="48" cy="30" rx="18" ry="5.5" fill="url(#lidGrad)" stroke="#64748B" strokeWidth="1" />
        <ellipse cx="48" cy="27" rx="14" ry="4" fill="#F8FAFC" />
        <ellipse cx="48" cy="22" rx="7" ry="2.5" fill="#94A3B8" />

        {/* Neck */}
        <path d="M34 29 L32 37 H64 L62 29 Z" fill="#94A3B8" />
        {/* Main Tank */}
        <path
          d="M32 37 L26 78 C26 84 36 88 48 88 C60 88 70 84 70 78 L64 37 Z"
          fill="url(#canBodyGrad)"
          stroke="#64748B"
          strokeWidth="1.2"
        />
        {/* Steel Highlight */}
        <path d="M32 40 C31 52 29 68 29 78" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.8" />
        {/* Handles */}
        <path d="M30 44 C20 40 20 54 28 56" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M66 44 C76 40 76 54 68 56" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        {/* Can Mini Logo */}
        <circle cx="48" cy="58" r="8" fill="#047857" opacity="0.15" />
        <path d="M48 53 C46 56 46 61 48 63 C50 61 50 56 48 53 Z" fill="#047857" />
      </g>
    </svg>
  ),

  // 2. 3D Leather Wallet with Coins (matching Payouts card in Image 1 & 5)
  LeatherWallet3D: ({ className = 'w-16 h-16' }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="walletBrown" x1="20" y1="25" x2="80" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#92400E" />
          <stop offset="0.6" stopColor="#78350F" />
          <stop offset="1" stopColor="#451A03" />
        </linearGradient>
        <linearGradient id="walletFlap" x1="45" y1="35" x2="85" y2="65" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B45309" />
          <stop offset="1" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="goldCoin" x1="10" y1="60" x2="40" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="0.6" stopColor="#EAB308" />
          <stop offset="1" stopColor="#A16207" />
        </linearGradient>
        <filter id="walletShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#451A03" floodOpacity="0.28" />
        </filter>
      </defs>
      <g filter="url(#walletShadow)">
        {/* Wallet Back & Body */}
        <rect x="30" y="24" width="56" height="52" rx="10" fill="url(#walletBrown)" stroke="#B45309" strokeWidth="1.2" />
        {/* White Stitching detail */}
        <rect x="33" y="27" width="50" height="46" rx="7" fill="none" stroke="#FEF3C7" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
        
        {/* Wallet Flap with Clasp */}
        <path
          d="M52 38 H86 C88 38 90 40 90 42 V60 C90 62 88 64 86 64 H52 C45 64 45 38 52 38 Z"
          fill="url(#walletFlap)"
          stroke="#D97706"
          strokeWidth="1"
        />
        {/* Golden Clasp Button */}
        <circle cx="78" cy="51" r="5.5" fill="#FACC15" stroke="#854D0E" strokeWidth="1.2" />
        <circle cx="78" cy="51" r="2.5" fill="#FEF08A" />

        {/* Stack of Gold Rupee Coins spilled in front */}
        <ellipse cx="26" cy="80" rx="14" ry="5.5" fill="url(#goldCoin)" stroke="#FEF08A" strokeWidth="1" />
        <ellipse cx="26" cy="74" rx="14" ry="5.5" fill="url(#goldCoin)" stroke="#FEF08A" strokeWidth="1" />
        <ellipse cx="26" cy="68" rx="14" ry="5.5" fill="url(#goldCoin)" stroke="#FEF08A" strokeWidth="1" />
        <text x="23" y="71" fill="#78350F" fontSize="8" fontWeight="bold">₹</text>

        <circle cx="44" cy="78" r="9" fill="url(#goldCoin)" stroke="#FEF08A" strokeWidth="1.2" />
        <text x="40.5" y="82" fill="#78350F" fontSize="11" fontWeight="bold">₹</text>
      </g>
    </svg>
  ),

  // 3. 3D Clipboard Ledger with Pen (matching Milk Supply Ledger in Image 1 & 5)
  ClipboardLedger3D: ({ className = 'w-16 h-16' }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="boardGrad" x1="20" y1="15" x2="80" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D97706" />
          <stop offset="0.6" stopColor="#B45309" />
          <stop offset="1" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="clipPaper" x1="25" y1="25" x2="75" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F8FAFC" />
        </linearGradient>
        <filter id="clipShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.22" />
        </filter>
      </defs>
      <g filter="url(#clipShadow)" transform="rotate(-6 50 50)">
        {/* Wooden Board */}
        <rect x="22" y="14" width="56" height="72" rx="8" fill="url(#boardGrad)" stroke="#F59E0B" strokeWidth="1.2" />
        {/* White Paper Sheets */}
        <rect x="28" y="24" width="44" height="58" rx="4" fill="url(#clipPaper)" />
        {/* Lined Ledger Rows */}
        <line x1="34" y1="36" x2="66" y2="36" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="34" y1="44" x2="66" y2="44" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="34" y1="52" x2="66" y2="52" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="34" y1="60" x2="66" y2="60" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="34" y1="68" x2="54" y2="68" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />

        {/* Golden Metal Clip on Top */}
        <rect x="38" y="10" width="24" height="12" rx="3" fill="#FACC15" stroke="#A16207" strokeWidth="1.2" />
        <circle cx="50" cy="16" r="3" fill="#78350F" />

        {/* 3D Pen on side */}
        <g transform="translate(68, 48) rotate(35)">
          <rect x="0" y="0" width="6" height="30" rx="3" fill="#2563EB" />
          <polygon points="0,30 6,30 3,36" fill="#FACC15" />
          <polygon points="2,34 4,34 3,37" fill="#0F172A" />
        </g>
      </g>
    </svg>
  ),

  // 4. 3D Classical Bank Building (matching Bank & Profile in Image 1 & 5)
  BankBuilding3D: ({ className = 'w-16 h-16' }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="marbleGrad" x1="20" y1="15" x2="80" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8FAFC" />
          <stop offset="0.5" stopColor="#E2E8F0" />
          <stop offset="1" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="pillarGrad" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#F1F5F9" />
          <stop offset="0.5" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#94A3B8" />
        </linearGradient>
        <filter id="bankShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#334155" floodOpacity="0.24" />
        </filter>
      </defs>
      <g filter="url(#bankShadow)">
        {/* Triangular Pediment / Roof */}
        <polygon points="50,16 16,36 84,36" fill="url(#marbleGrad)" stroke="#94A3B8" strokeWidth="1.2" />
        <ellipse cx="50" cy="28" rx="6" ry="4" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />

        {/* Architrave Beam */}
        <rect x="18" y="36" width="64" height="6" rx="1.5" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.8" />

        {/* Classical Columns (4 Pillars) */}
        <rect x="22" y="42" width="7" height="30" rx="2" fill="url(#pillarGrad)" stroke="#94A3B8" strokeWidth="0.8" />
        <rect x="36" y="42" width="7" height="30" rx="2" fill="url(#pillarGrad)" stroke="#94A3B8" strokeWidth="0.8" />
        <rect x="57" y="42" width="7" height="30" rx="2" fill="url(#pillarGrad)" stroke="#94A3B8" strokeWidth="0.8" />
        <rect x="71" y="42" width="7" height="30" rx="2" fill="url(#pillarGrad)" stroke="#94A3B8" strokeWidth="0.8" />

        {/* Stepped Base / Plinth */}
        <rect x="14" y="72" width="72" height="6" rx="1.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
        <rect x="10" y="78" width="80" height="8" rx="2" fill="url(#marbleGrad)" stroke="#64748B" strokeWidth="1" />
        
        {/* Verified Shield Badge on front */}
        <circle cx="50" cy="57" r="9" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
        <path d="M46 57 L49 60 L55 54" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  ),

  // 5. 3D Money Bag with Shield (matching Payouts notice card in Image 3)
  MoneyBagShield3D: ({ className = 'w-16 h-16' }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="sackGrad" x1="25" y1="20" x2="75" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="0.6" stopColor="#D97706" />
          <stop offset="1" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id="shieldGreen" x1="50" y1="50" x2="85" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <filter id="sackShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#78350F" floodOpacity="0.25" />
        </filter>
      </defs>
      <g filter="url(#sackShadow)">
        {/* Money Sack Body */}
        <path
          d="M48 24 C40 24 38 34 30 44 C22 54 22 76 34 82 C46 88 56 88 68 82 C80 76 80 54 72 44 C64 34 62 24 54 24 Z"
          fill="url(#sackGrad)"
          stroke="#FBBF24"
          strokeWidth="1.2"
        />
        {/* Tied Rope */}
        <ellipse cx="51" cy="30" rx="14" ry="4" fill="#78350F" />
        {/* Sack Top Ruffle */}
        <path d="M42 20 C42 16, 60 16, 60 20 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
        
        {/* Currency ₹ Symbol */}
        <circle cx="51" cy="54" r="10" fill="#FEF3C7" opacity="0.9" />
        <text x="47" y="58" fill="#78350F" fontSize="12" fontWeight="bold">₹</text>

        {/* Security Verified Shield Badge in front corner */}
        <g transform="translate(60, 58)">
          <path
            d="M16 2 L2 8 V18 C2 27 8 34 16 38 C24 34 30 27 30 18 V8 L16 2 Z"
            fill="url(#shieldGreen)"
            stroke="#A7F3D0"
            strokeWidth="1.2"
          />
          <path d="M10 18 L14 22 L22 14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  ),

  // 6. 3D Growth Trend Chart (matching Today's Collection in Image 1)
  GrowthChart3D: ({ className = 'w-16 h-16' }: { className?: string }) => (
    <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#A7F3D0" />
          <stop offset="1" stopColor="#6EE7B7" />
        </linearGradient>
        <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="barGrad3" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
      </defs>
      {/* Light circular backdrop */}
      <circle cx="50" cy="40" r="35" fill="#ECFDF5" />
      {/* 3D Vertical Bars */}
      <rect x="22" y="48" width="8" height="18" rx="3" fill="url(#barGrad1)" />
      <rect x="36" y="38" width="8" height="28" rx="3" fill="url(#barGrad2)" />
      <rect x="50" y="26" width="8" height="40" rx="3" fill="url(#barGrad3)" />
      <rect x="64" y="16" width="8" height="50" rx="3" fill="#047857" />

      {/* Upward Curved Green Arrow */}
      <path
        d="M20 54 C34 48, 48 30, 72 14"
        stroke="#047857"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <polygon points="78,10 68,14 74,20" fill="#047857" />
    </svg>
  ),

  // 7. Backward compatible aliases
  MilkBucket3D: ({ className = 'w-12 h-12' }: { className?: string }) => (
    <ThreeDIcons.MilkCanSplash3D className={className} />
  ),
  RupeeStack3D: ({ className = 'w-12 h-12' }: { className?: string }) => (
    <ThreeDIcons.LeatherWallet3D className={className} />
  ),
  LedgerBook3D: ({ className = 'w-12 h-12' }: { className?: string }) => (
    <ThreeDIcons.ClipboardLedger3D className={className} />
  ),
  BankShield3D: ({ className = 'w-12 h-12' }: { className?: string }) => (
    <ThreeDIcons.BankBuilding3D className={className} />
  ),
  Tester3D: ({ className = 'w-12 h-12' }: { className?: string }) => (
    <ThreeDIcons.MilkCanSplash3D className={className} />
  ),
};

// Mini Sparkline Graph for Card
export const SparklineMini: React.FC<{ className?: string }> = ({ className = 'w-20 h-7' }) => (
  <svg viewBox="0 0 70 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M2 18 C 14 20, 22 10, 34 14 C 46 18, 54 6, 68 6"
      stroke="#10B981"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
