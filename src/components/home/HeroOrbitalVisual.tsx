import React from 'react';
import { Image as ImageIcon, FileText, QrCode, GraduationCap, Calculator } from 'lucide-react';
import { YoursthingLogoMark } from '../brand/YoursthingLogo';

export function HeroOrbitalVisual() {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center p-4 select-none pointer-events-none">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-purple-500/20 dark:from-blue-600/30 dark:via-indigo-600/30 dark:to-violet-600/40 blur-3xl opacity-80 animate-orbital-pulse" />

      {/* Orbital Ring Guide Lines */}
      <div className="absolute inset-8 rounded-full border border-dashed border-indigo-200/60 dark:border-indigo-800/40 opacity-60" />
      <div className="absolute inset-16 rounded-full border border-indigo-100/50 dark:border-indigo-900/30 opacity-40" />

      {/* Central Glowing Core Hub Card */}
      <div className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-white dark:bg-[#121829] text-white flex items-center justify-center shadow-2xl shadow-indigo-500/30 dark:shadow-indigo-500/50 border-4 border-indigo-100 dark:border-indigo-900 animate-orbital-pulse">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-50/80 dark:bg-indigo-950/60 flex items-center justify-center shadow-inner">
          <YoursthingLogoMark className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md" />
        </div>
      </div>

      {/* Floating Orbital Tool Cards */}

      {/* 1. Top: Image Tool */}
      <div className="absolute -top-1 sm:top-2 right-1/2 translate-x-1/2 z-20 animate-orbital-float">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-[#1A2238] border border-slate-200/80 dark:border-indigo-500/40 shadow-xl shadow-indigo-500/10 dark:shadow-indigo-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <ImageIcon className="w-7 h-7" />
        </div>
      </div>

      {/* 2. Top Right: PDF Tool */}
      <div className="absolute top-10 right-2 sm:right-6 z-20 animate-orbital-float-delayed">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-[#1A2238] border border-slate-200/80 dark:border-rose-500/40 shadow-xl shadow-rose-500/10 dark:shadow-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
          <FileText className="w-7 h-7" />
        </div>
      </div>

      {/* 3. Right: QR Code Tool */}
      <div className="absolute bottom-16 -right-2 sm:right-2 z-20 animate-orbital-float">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-[#1A2238] border border-slate-200/80 dark:border-amber-500/40 shadow-xl shadow-amber-500/10 dark:shadow-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <QrCode className="w-7 h-7" />
        </div>
      </div>

      {/* 4. Bottom Right: Student Tool */}
      <div className="absolute -bottom-1 right-10 sm:right-14 z-20 animate-orbital-float-delayed">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-[#1A2238] border border-slate-200/80 dark:border-purple-500/40 shadow-xl shadow-purple-500/10 dark:shadow-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <GraduationCap className="w-7 h-7" />
        </div>
      </div>

      {/* 5. Bottom Left / Left: Calculator Tool */}
      <div className="absolute bottom-10 left-2 sm:left-6 z-20 animate-orbital-float">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-[#1A2238] border border-slate-200/80 dark:border-emerald-500/40 shadow-xl shadow-emerald-500/10 dark:shadow-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Calculator className="w-7 h-7" />
        </div>
      </div>

      {/* 6. Top Left: Document Convert Tool */}
      <div className="absolute top-12 left-2 sm:left-6 z-20 animate-orbital-float-delayed">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-[#1A2238] border border-slate-200/80 dark:border-indigo-500/40 shadow-xl shadow-indigo-500/10 dark:shadow-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <FileText className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
}
