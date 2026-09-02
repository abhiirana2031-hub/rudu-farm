import React from 'react';

interface RuduLogoProps {
  className?: string;
  style?: React.CSSProperties;
  height?: number;
  alt?: string;
}

export const RuduLogo: React.FC<RuduLogoProps> = ({
  className = '',
  style = {},
  height = 42,
  alt = 'Rudu Farm Logo',
}) => {
  return (
    <img
      src="/images/rudu_logo.png"
      alt={alt}
      className={`object-contain transition-transform hover:scale-105 duration-200 ${className}`}
      style={{
        height: `${height}px`,
        width: 'auto',
        display: 'inline-block',
        verticalAlign: 'middle',
        filter: 'brightness(0) saturate(100%) invert(18%) sepia(88%) saturate(5832%) hue-rotate(352deg) brightness(98%) contrast(96%)',
        ...style,
      }}
    />
  );
};


