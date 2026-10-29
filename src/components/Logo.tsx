import React, { useState, useEffect } from 'react';
import { RemixIcon } from './RemixIcon';
import { COMPANY_CONFIG } from '../data/config';

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  theme?: 'light' | 'dark';
  size?: LogoSize;
  className?: string;
  imgClassName?: string;
  showTextAlways?: boolean;
}

// Default file paths to probe automatically for the uploaded logo
const DEFAULT_LOGO_CANDIDATES = [
  '/images/logo.jpeg',
  COMPANY_CONFIG.logoImage || '',
  '/public/images/logo.jpeg',
  '/images/logo.png',
  '/images/logo.jpg',
  '/images/logo.webp',
  '/images/jsr-logo.png',
  '/images/jsr-logo.jpeg',
].filter(Boolean);

export const Logo: React.FC<LogoProps> = ({
  theme = 'light',
  size = 'md',
  className = '',
  imgClassName = '',
  showTextAlways = true,
}) => {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [allFailed, setAllFailed] = useState(false);

  const currentSrc = DEFAULT_LOGO_CANDIDATES[candidateIndex];

  // Reset if candidates change
  useEffect(() => {
    setCandidateIndex(0);
    setImageLoaded(false);
    setAllFailed(false);
  }, []);

  const handleImageError = () => {
    if (candidateIndex < DEFAULT_LOGO_CANDIDATES.length - 1) {
      setCandidateIndex((prev) => prev + 1);
    } else {
      setAllFailed(true);
      setImageLoaded(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setAllFailed(false);
  };

  const isDark = theme === 'dark';

  // Dimension presets for balanced, elegant, and compact corporate display
  const sizeConfig = {
    sm: {
      img: 'h-[68px] w-[68px] sm:h-20 sm:w-20',
      badge: 'w-[68px] h-[68px] sm:w-20 sm:h-20',
      iconText: 'text-2xl',
      nameText: 'text-base sm:text-lg lg:text-xl font-black tracking-tight',
      taglineText: 'text-[11px] sm:text-xs font-bold tracking-wider',
    },
    md: {
      img: 'h-16 w-16 sm:h-20 sm:w-20', 
      badge: 'w-16 h-16 sm:w-20 sm:h-20',
      iconText: 'text-xl',
      nameText: 'text-base sm:text-lg font-bold tracking-tight',
      taglineText: 'text-[10px] sm:text-[11px] tracking-wider',
    },
    lg: {
      img: 'h-14 w-14 sm:h-16 sm:w-16',
      badge: 'w-14 h-14 sm:w-16 sm:h-16',
      iconText: 'text-2xl',
      nameText: 'text-lg sm:text-xl font-bold tracking-tight',
      taglineText: 'text-xs tracking-wider',
    },
    xl: {
      img: 'h-20 w-20 sm:h-24 sm:w-24',
      badge: 'w-20 h-20 sm:w-24 sm:h-24',
      iconText: 'text-3xl',
      nameText: 'text-xl sm:text-2xl font-black tracking-tight',
      taglineText: 'text-xs sm:text-sm tracking-wide',
    },
  }[size];

  return (
    <div className={`flex items-center gap-3.5 sm:gap-4 ${className}`}>
      {/* Probe and render logo image element with prominent circular styling */}
      {!allFailed && currentSrc && (
        <div
          className={`${
            imageLoaded
              ? 'relative flex items-center justify-center shrink-0 rounded-full overflow-hidden'
              : 'hidden'
          }`}
        >
          <img
            key={currentSrc}
            src={currentSrc}
            alt="JSR World Visas Brand Logo"
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`${sizeConfig.img} rounded-full object-cover shadow-md transition-transform duration-300 group-hover:scale-105 bg-white ${
              isDark
                ? 'border-2 border-amber-400/80 ring-2 ring-slate-800 shadow-amber-400/10'
                : 'border-2 border-amber-400/60 ring-2 ring-amber-100/80 shadow-slate-200'
            } ${imgClassName}`}
          />
        </div>
      )}

      {/* Fallback Icon badge when image is not loaded or not found */}
      {(!imageLoaded || allFailed) && (
        <div
          className={`${sizeConfig.badge} rounded-2xl flex items-center justify-center text-white shrink-0 transition-transform ${
            isDark
              ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-900/40 border border-blue-500/30'
              : 'bg-gradient-to-tr from-blue-600 to-indigo-700 shadow-md shadow-blue-600/20'
          }`}
        >
          <RemixIcon name="ri-compass-3-line" className={sizeConfig.iconText} />
        </div>
      )}

      {/* Brand Typography: Displayed alongside the logo mark */}
      {(!imageLoaded || allFailed || showTextAlways) && (
        <div className="flex flex-col text-left">
          <span
      className={`font-heading ${sizeConfig.nameText} tracking-tight leading-tight block text-[#155dfc] ${
        isDark ? 'tracking-wide uppercase' : ''
      }`}
    >
      {COMPANY_CONFIG.name}
    </span>
          <span
            className={`font-bold tracking-wider uppercase block mt-0.5 ${sizeConfig.taglineText} ${
              isDark ? 'text-black-400' : 'text-black'
            }`}
          >
            {COMPANY_CONFIG.tagline}
          </span>
        </div>
      )}
    </div>
  );
};
