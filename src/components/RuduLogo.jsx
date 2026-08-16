import React from 'react';

export const RuduLogo = ({ className = '', style = {}, height = 40 }) => {
  // Maintaining the exact logo ratio (approx 2.2:1)
  const width = height * 2.2;

  return (
    <svg 
      viewBox="0 0 220 100" 
      className={className} 
      style={{ height, width, display: 'inline-block', verticalAlign: 'middle', ...style }}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer dark chocolate brush shape */}
      <path 
        d="M10 50 C 8 28, 48 10, 115 11 C 182 12, 212 28, 208 38 C 204 48, 175 52, 155 54 C 115 58, 40 68, 20 72 C 5 74, 2 70, 4 60 Z" 
        fill="#3B2214" 
      />
      
      {/* Inner soft cream ribbon overlay */}
      <path 
        d="M14 54 C 12 36, 46 18, 110 19 C 174 20, 198 32, 194 40 C 190 48, 166 50, 146 52 C 108 56, 44 64, 24 67 C 12 69, 10 65, 11 56 Z" 
        fill="#F5EBE1" 
      />

      {/* Decorative dark chocolate waves to match brush style */}
      <path 
        d="M100 11 C 135 9, 175 9, 192 23 C 194 24, 191 26, 185 25 C 170 22, 130 20, 100 19 Z" 
        fill="#3B2214" 
      />
      <path 
        d="M20 72 C 35 70, 70 66, 105 64 C 65 68, 40 74, 25 78 C 19 80, 17 78, 20 72 Z" 
        fill="#3B2214" 
      />

      {/* signature bold brand text "Rudu" */}
      <text 
        x="105" 
        y="50" 
        textAnchor="middle" 
        fill="#3B2214" 
        fontWeight="900" 
        fontSize="36" 
        fontStyle="italic"
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
        letterSpacing="-1.5px"
        transform="rotate(-5, 105, 45)"
      >
        Rudu
      </text>
    </svg>
  );
};
