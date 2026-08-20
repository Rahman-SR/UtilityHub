import React from 'react';

interface LogoMarkProps {
  className?: string;
  size?: number;
}

export function YoursthingLogoMark({ className = 'w-9 h-9', size }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Yoursthing Logo"
    >
      <defs>
        <linearGradient id="yoursthing-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="45%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      {/* Amber head / crown dot */}
      <circle cx="24" cy="9.5" r="4.75" fill="#F59E0B" />
      {/* Y Symbol Body */}
      <path
        d="M 11.5 19 C 15.5 26.5 20.5 30 24 30 C 27.5 30 32.5 26.5 36.5 19 M 24 30 L 24 40.5"
        stroke="url(#yoursthing-gradient)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface FullLogoProps {
  className?: string;
  showTagline?: boolean;
  textClassName?: string;
}

export function YoursthingLogo({
  className = 'flex items-center space-x-2.5',
  showTagline = false,
  textClassName = 'text-xl font-extrabold',
}: FullLogoProps) {
  return (
    <div className={className}>
      <YoursthingLogoMark className="w-9 h-9 shrink-0 drop-shadow-xs" />
      <div className="flex flex-col">
        <span className={`font-heading tracking-tight leading-none text-slate-900 dark:text-white ${textClassName}`}>
          Yours<span className="relative">th<span className="inline-block relative">i<span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F59E0B]" /></span>ng</span>
        </span>
        {showTagline && (
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 tracking-normal">
            Everyday tools. Simplified for you.
          </span>
        )}
      </div>
    </div>
  );
}
