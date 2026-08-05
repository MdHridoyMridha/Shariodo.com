import React from 'react';

interface SharidoLogoProps {
  variant?: 'full' | 'compact' | 'icon';
  theme?: 'dark' | 'light' | 'gold';
  className?: string;
  iconOnlySize?: number;
}

export default function SharidoLogo({
  variant = 'compact',
  theme = 'dark',
  className = '',
  iconOnlySize = 36,
}: SharidoLogoProps) {
  // Theme color definitions matching the official logo
  // Dark theme: for light backgrounds (slate green / gold accent)
  // Light theme: for dark backgrounds (cream / gold)
  const isLight = theme === 'light';
  
  const emblemGold = isLight ? '#E8D8B8' : '#3A2E1E';
  const emblemCream = isLight ? '#FAF5EB' : '#1F1C18';
  const emblemTerracotta = '#D87A38';
  const emblemTeal = isLight ? '#E8F1EF' : '#0E3330';
  const textPrimary = isLight ? '#FAF5EB' : '#1F1C18';
  const textSecondary = isLight ? '#D8C3A5' : '#786C5A';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* SVG Geometric Dreamcatcher Emblem */}
      <svg
        width={variant === 'icon' ? iconOnlySize : 38}
        height={variant === 'icon' ? iconOnlySize : 38}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        {/* Deep Teal Background Circle Container (optional subtle backing) */}
        <rect width="100" height="100" rx="24" fill={isLight ? '#0B2E2B' : '#F3EFE6'} />

        {/* Outer Arch Frame Ring */}
        <path
          d="M 22 55 A 32 32 0 1 1 78 55"
          stroke={isLight ? '#E8D8B8' : '#8C6D33'}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Inner Circle Ring */}
        <circle
          cx="50"
          cy="32"
          r="16"
          stroke={isLight ? '#E8D8B8' : '#8C6D33'}
          strokeWidth="2.5"
          fill="none"
        />

        {/* Inverted Terracotta Triangle */}
        <polygon
          points="28,24 72,24 50,56"
          stroke={emblemTerracotta}
          strokeWidth="3"
          fill="none"
          strokeLinejoin="round"
        />

        {/* Delicate Swag Lines inside Triangle */}
        <path
          d="M 34 26 Q 50 38 66 26"
          stroke={isLight ? '#E8D8B8' : '#8C6D33'}
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 38 29 Q 50 42 62 29"
          stroke={isLight ? '#E8D8B8' : '#8C6D33'}
          strokeWidth="1.2"
          fill="none"
        />

        {/* Hanging Central Diamond Pendant String */}
        <line
          x1="50"
          y1="56"
          x2="50"
          y2="72"
          stroke={isLight ? '#E8D8B8' : '#8C6D33'}
          strokeWidth="1.5"
        />
        {/* Diamond Charm */}
        <polygon
          points="50,72 54,77 50,86 46,77"
          stroke={isLight ? '#E8D8B8' : '#8C6D33'}
          strokeWidth="1.5"
          fill={emblemTerracotta}
        />
        <polygon
          points="50,77 52,80 50,84 48,80"
          stroke={isLight ? '#E8D8B8' : '#8C6D33'}
          strokeWidth="1"
          fill="none"
        />

        {/* Left Hanging Stylized Feathers / Tassels */}
        <path
          d="M 28 50 L 32 58 L 26 62 L 32 68 L 24 74 L 30 80 L 26 88"
          stroke={emblemTerracotta}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Right Hanging Stylized Feathers / Tassels */}
        <path
          d="M 72 50 L 68 58 L 74 62 L 68 68 L 76 74 L 70 80 L 74 88"
          stroke={emblemTerracotta}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Brand Name & Subtitle */}
      {variant !== 'icon' && (
        <div className="flex flex-col justify-center">
          <span
            className="font-black tracking-widest leading-none font-serif text-xl sm:text-2xl"
            style={{
              color: textPrimary,
              letterSpacing: '0.12em',
              fontFamily: '"Playfair Display", "Cinzel", "Bodoni MT", serif',
            }}
          >
            SHARIDO
          </span>
          {variant === 'full' && (
            <span
              className="text-[10px] sm:text-[11px] italic font-serif mt-1 font-medium tracking-normal"
              style={{ color: textSecondary }}
            >
              Crafted with Heart, Inspired by Tradition
            </span>
          )}
          {variant === 'compact' && (
            <span
              className="text-[9px] uppercase font-bold tracking-widest mt-0.5"
              style={{ color: textSecondary }}
            >
              Handcrafted Heritage
            </span>
          )}
        </div>
      )}
    </div>
  );
}
