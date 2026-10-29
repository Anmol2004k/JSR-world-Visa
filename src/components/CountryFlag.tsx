import React, { useState } from 'react';

interface CountryFlagProps {
  countryName: string;
  flagCode?: string;
  code?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const IndiaFlagSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 900 600" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="Flag of India">
    <rect width="900" height="200" fill="#FF9933" />
    <rect y="200" width="900" height="200" fill="#FFFFFF" />
    <rect y="400" width="900" height="200" fill="#138808" />
    <g transform="translate(450, 300)">
      <circle r="72" fill="none" stroke="#000080" strokeWidth="8" />
      <circle r="14" fill="#000080" />
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="0"
          y1="0"
          x2="0"
          y2="-68"
          stroke="#000080"
          strokeWidth="4"
          transform={`rotate(${i * 15})`}
        />
      ))}
    </g>
  </svg>
);

export const AustraliaFlagSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 1200 600" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="Flag of Australia">
    <rect width="1200" height="600" fill="#00008B" />
    {/* Union Jack in Canton */}
    <g id="au-canton">
      <clipPath id="au-canton-clip">
        <rect width="600" height="300" />
      </clipPath>
      <g clipPath="url(#au-canton-clip)">
        <line x1="0" y1="0" x2="600" y2="300" stroke="#FFFFFF" strokeWidth="60" />
        <line x1="600" y1="0" x2="0" y2="300" stroke="#FFFFFF" strokeWidth="60" />
        <line x1="0" y1="0" x2="600" y2="300" stroke="#CC0000" strokeWidth="20" />
        <line x1="600" y1="0" x2="0" y2="300" stroke="#CC0000" strokeWidth="20" />
        <rect x="250" width="100" height="300" fill="#FFFFFF" />
        <rect y="100" width="600" height="100" fill="#FFFFFF" />
        <rect x="270" width="60" height="300" fill="#CC0000" />
        <rect y="120" width="600" height="60" fill="#CC0000" />
      </g>
    </g>
    {/* Commonwealth Star */}
    <g transform="translate(300, 450) scale(45)" fill="#FFFFFF">
      <polygon points="0,-1 0.22,-0.22 0.97,-0.22 0.35,0.22 0.62,0.9 0,0.5 -0.62,0.9 -0.35,0.22 -0.97,-0.22 -0.22,-0.22" />
    </g>
    {/* Southern Cross */}
    <g fill="#FFFFFF">
      <circle cx="900" cy="490" r="20" />
      <circle cx="780" cy="320" r="20" />
      <circle cx="900" cy="130" r="20" />
      <circle cx="1020" cy="260" r="20" />
      <circle cx="950" cy="370" r="13" />
    </g>
  </svg>
);

export const CountryFlag: React.FC<CountryFlagProps> = ({
  countryName,
  flagCode,
  code: codeProp,
  size = 'md',
  className = '',
}) => {
  const code = (flagCode || codeProp || '').toLowerCase();
  const [loadError, setLoadError] = useState(false);

  const sizeStyles = {
    xs: 'w-5 h-3.5 text-[8px]',
    sm: 'w-6 h-4 text-[9px]',
    md: 'w-8 h-5.5 text-[10px]',
    lg: 'w-10 h-7 text-xs',
    xl: 'w-14 h-9 text-sm',
  }[size];

  // Specific dedicated SVG rendering for India and Australia
  if (code === 'in' || code === 'india') {
    return (
      <div
        className={`relative inline-flex items-center justify-center overflow-hidden rounded-xs sm:rounded shadow-xs border border-slate-300/80 bg-white shrink-0 ${sizeStyles} ${className}`}
        title={`${countryName || 'India'} Flag`}
      >
        <IndiaFlagSvg />
      </div>
    );
  }

  if (code === 'au' || code === 'australia') {
    return (
      <div
        className={`relative inline-flex items-center justify-center overflow-hidden rounded-xs sm:rounded shadow-xs border border-slate-300/80 bg-[#00008B] shrink-0 ${sizeStyles} ${className}`}
        title={`${countryName || 'Australia'} Flag`}
      >
        <AustraliaFlagSvg />
      </div>
    );
  }

  // Primary WebP and PNG representations from reliable high-availability FlagCDN
  const safeCode = code || 'un';
  const webpUrl = `https://flagcdn.com/w80/${safeCode}.webp`;
  const pngUrl = `https://flagcdn.com/w80/${safeCode}.png`;

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-xs sm:rounded shadow-xs border border-slate-700/60 bg-slate-900 shrink-0 ${sizeStyles} ${className}`}
      title={`${countryName} National Flag`}
    >
      {!loadError ? (
        <picture>
          <source type="image/webp" srcSet={`${webpUrl} 1x, https://flagcdn.com/w160/${safeCode}.webp 2x`} />
          <img
            src={pngUrl}
            alt={`${countryName} flag`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setLoadError(true)}
            className="w-full h-full object-cover"
          />
        </picture>
      ) : (
        <span className="font-mono font-bold uppercase tracking-wider text-slate-300">
          {safeCode}
        </span>
      )}
    </div>
  );
};
