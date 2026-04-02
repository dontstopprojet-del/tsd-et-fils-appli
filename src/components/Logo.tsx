import React, { useId } from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'horizontal' | 'icon';
  darkMode?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', variant = 'horizontal', darkMode = false }) => {
  const uid = useId().replace(/:/g, '');
  const bgId = `bg${uid}`;
  const dropId = `drop${uid}`;

  const sizes = {
    small: { height: 36, fontSize: 15 },
    medium: { height: 44, fontSize: 19 },
    large: { height: 60, fontSize: 26 },
  };

  const currentSize = sizes[size];

  const LogoSvg = ({ w }: { w: number }) => (
    <svg width={w} height={w} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <linearGradient id={dropId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="96" height="96" rx="22" fill={`url(#${bgId})`} />
      <path
        d="M50 18c0 0 26 36 26 54c0 14-12 26-26 26s-26-12-26-26C24 54 50 18 50 18z"
        fill={`url(#${dropId})`}
      />
      <path
        d="M50 18c0 0 26 36 26 54c0 14-12 26-26 26s-26-12-26-26C24 54 50 18 50 18z"
        fill="none"
        stroke="white"
        strokeWidth="3"
        opacity="0.35"
      />
      <ellipse cx="42" cy="62" rx="7" ry="11" fill="white" opacity="0.45" transform="rotate(-18 42 62)" />
    </svg>
  );

  if (variant === 'icon') {
    return <LogoSvg w={currentSize.height} />;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <LogoSvg w={currentSize.height} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <span style={{
          fontSize: currentSize.fontSize,
          fontWeight: '900',
          background: darkMode
            ? 'linear-gradient(135deg, #22d3ee, #06b6d4)'
            : 'linear-gradient(135deg, #0891b2, #0e7490)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.3px',
          lineHeight: '1.1',
        }}>
          TSD & FILS
        </span>
        <span style={{
          fontSize: Math.max(currentSize.fontSize * 0.48, 9),
          fontWeight: '700',
          color: darkMode ? '#94a3b8' : '#64748b',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          lineHeight: '1',
        }}>
          Plomberie Pro
        </span>
      </div>
    </div>
  );
};

export default Logo;
