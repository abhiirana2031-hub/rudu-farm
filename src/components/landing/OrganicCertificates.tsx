import React from 'react';

export const IndiaOrganicLogo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 110 }) => (
  <svg 
    width={size} 
    height={size * 0.85} 
    viewBox="0 0 160 136" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block select-none ${className}`}
    aria-label="India Organic Certification Seal"
  >
    {/* Outer soft glow/circle backdrop */}
    <circle cx="86" cy="62" r="50" fill="#E8F1F8" />
    <path d="M42 66 C42 42 62 24 86 24 C110 24 130 42 130 66 C130 90 110 108 86 108" stroke="#D1E3F0" strokeWidth="2" fill="none" />
    
    {/* Blue Water Swirl (Water element) */}
    <path 
      d="M32 72 C32 60 40 48 52 44 C64 40 70 48 68 56 C66 64 56 70 50 78 C44 86 42 96 52 102 C60 107 72 104 80 96 C70 108 52 110 40 100 C32 93 30 82 32 72 Z" 
      fill="#4682B4" 
    />
    <path 
      d="M36 76 C36 68 42 58 52 56 C46 64 42 74 44 82 C46 90 54 94 62 92 C52 98 42 94 38 88 C36 84 36 80 36 76 Z" 
      fill="#6BA4D8" 
    />
    <path 
      d="M44 84 C48 76 54 70 60 66 C56 74 54 82 58 88 C52 90 46 88 44 84 Z" 
      fill="#8EC5FC" 
    />

    {/* Red Energy / Earth Swirl */}
    <path 
      d="M52 102 C56 105 64 106 72 102 C78 99 82 92 84 86 C86 78 84 72 88 66 C82 72 80 82 76 90 C72 98 64 100 58 98 C54 96 52 98 52 102 Z" 
      fill="#C0392B" 
    />

    {/* India Organic Green Sprout Leaf (Plant element) */}
    <g transform="translate(74, 52) scale(0.95)">
      {/* Central Stem & Star Leaf */}
      <path 
        d="M12 28 C12 28 14 18 22 14 C18 18 18 24 18 28 Z" 
        fill="#2E7D32" 
      />
      <path 
        d="M12 28 C8 24 6 18 8 12 C12 16 13 22 14 26 Z" 
        fill="#43A047" 
      />
      <path 
        d="M14 16 C16 10 22 6 28 8 C22 11 20 16 18 20 Z" 
        fill="#66BB6A" 
      />
      {/* Organic Star Leaves */}
      <path 
        d="M14 22 L20 18 L26 22 L22 28 L24 34 L18 30 L12 34 L14 28 Z" 
        fill="#388E3C" 
      />
    </g>

    {/* Arc Text "India Organic" */}
    <path id="indiaOrganicArc" d="M120 40 C130 52 134 66 132 82 C130 96 122 108 110 116" fill="none" />
    <text fill="#1F4E79" fontSize="9.5" fontWeight="700" letterSpacing="0.8">
      <textPath href="#indiaOrganicArc" startOffset="5%">
        India Organic
      </textPath>
    </text>

    {/* Jaivik Bharat Hindi & English Text */}
    <text x="80" y="122" textAnchor="middle" fill="#2E7D32" fontSize="9.5" fontWeight="800" letterSpacing="0.5">
      जैविक भारत
    </text>
    <text x="80" y="132" textAnchor="middle" fill="#C0392B" fontSize="7.5" fontWeight="700" letterSpacing="0.6">
      Jaivik Bharat
    </text>
  </svg>
);

export const UsdaOrganicLogo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 110 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 140 140" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block select-none ${className}`}
    aria-label="USDA Organic Certification Seal"
  >
    {/* Outer dark ring */}
    <circle cx="70" cy="70" r="66" fill="#1D4B27" stroke="#14351B" strokeWidth="2.5" />
    <circle cx="70" cy="70" r="61" fill="#FFFFFF" />

    {/* Inner green shield circle */}
    <circle cx="70" cy="70" r="55" fill="#1D4B27" />

    {/* Inner White Field (bottom half curved) */}
    <path 
      d="M22 68 C22 94.5 43.5 116 70 116 C96.5 116 118 94.5 118 68 C118 64 117.5 60 116.5 56 C98 57 84 57 70 57 C56 57 42 57 23.5 56 C22.5 60 22 64 22 68 Z" 
      fill="#FFFFFF" 
    />

    {/* Upper USDA text in white on dark green */}
    <text 
      x="70" 
      y="50" 
      textAnchor="middle" 
      fill="#FFFFFF" 
      fontSize="21" 
      fontWeight="900" 
      fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      letterSpacing="2.5"
    >
      USDA
    </text>

    {/* Lower ORGANIC text in dark green on white */}
    <text 
      x="70" 
      y="84" 
      textAnchor="middle" 
      fill="#1D4B27" 
      fontSize="17" 
      fontWeight="900" 
      fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      letterSpacing="1.2"
    >
      ORGANIC
    </text>

    {/* Lower sub-arcs / farm soil lines inside the white badge */}
    <path 
      d="M36 94 C46 104 58 109 70 109 C82 109 94 104 104 94" 
      stroke="#A3B899" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      fill="none" 
    />
    <path 
      d="M44 101 C52 107 61 110 70 110 C79 110 88 107 96 101" 
      stroke="#C2D6BA" 
      strokeWidth="1.6" 
      strokeLinecap="round" 
      fill="none" 
    />
  </svg>
);

export const EuOrganicLogo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 110 }) => (
  <svg 
    width={size} 
    height={size * 0.85} 
    viewBox="0 0 160 136" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block select-none ${className}`}
    aria-label="EU Organic Leaf Seal"
  >
    {/* EU Organic Green Rounded Banner */}
    <rect x="18" y="10" width="124" height="84" rx="14" fill="#669900" />

    {/* 12 White 5-pointed Stars forming the EU organic leaf */}
    {/* Helper star path definition */}
    <g fill="#FFFFFF">
      {/* Leaf Tip / Stem */}
      <polygon points="80,18 82,23 87,23 83,26 84,31 80,28 76,31 77,26 73,23 78,23" transform="scale(0.8) translate(20, 6)" />
      
      {/* Right curve of the leaf */}
      <polygon points="96,24 98,29 103,29 99,32 100,37 96,34 92,37 93,32 89,29 94,29" transform="scale(0.8) translate(22, 10)" />
      <polygon points="106,36 108,41 113,41 109,44 110,49 106,46 102,49 103,44 99,41 104,41" transform="scale(0.8) translate(25, 13)" />
      <polygon points="108,50 110,55 115,55 111,58 112,63 108,60 104,63 105,58 101,55 106,55" transform="scale(0.8) translate(25, 17)" />
      <polygon points="100,64 102,69 107,69 103,72 104,77 100,74 96,77 97,72 93,69 98,69" transform="scale(0.8) translate(23, 20)" />
      
      {/* Leaf Center Ridge */}
      <polygon points="82,34 84,39 89,39 85,42 86,47 82,44 78,47 79,42 75,39 80,39" transform="scale(0.8) translate(21, 13)" />
      <polygon points="76,48 78,53 83,53 79,56 80,61 76,58 72,61 73,56 69,53 74,53" transform="scale(0.8) translate(20, 17)" />
      <polygon points="70,62 72,67 77,67 73,70 74,75 70,72 66,75 67,70 63,67 68,67" transform="scale(0.8) translate(18, 20)" />

      {/* Left curve of the leaf */}
      <polygon points="62,26 64,31 69,31 65,34 66,39 62,36 58,39 59,34 55,31 60,31" transform="scale(0.8) translate(16, 11)" />
      <polygon points="50,38 52,43 57,43 53,46 54,51 50,48 46,51 47,46 43,43 48,43" transform="scale(0.8) translate(13, 14)" />
      <polygon points="46,54 48,59 53,59 49,62 50,67 46,64 42,67 43,62 39,59 44,59" transform="scale(0.8) translate(12, 18)" />
      <polygon points="56,68 58,73 63,73 59,76 60,81 56,78 52,81 53,76 49,73 54,73" transform="scale(0.8) translate(15, 22)" />
    </g>

    {/* Subtitle accreditation text */}
    <text x="80" y="112" textAnchor="middle" fill="#2C4D18" fontSize="10.5" fontWeight="800" letterSpacing="0.4">
      IN-BIO-132
    </text>
    <text x="80" y="125" textAnchor="middle" fill="#556B2F" fontSize="8.5" fontWeight="700" letterSpacing="0.2">
      Non-EU Agriculture
    </text>
  </svg>
);
