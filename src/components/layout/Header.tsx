'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../ui/ThemeToggle';
import { MobileNav } from './MobileNav';
import { BRAND_CONFIG } from '@/config/brand';
import { Wrench, Menu, Search } from 'lucide-react';
import { SearchBar } from '../search/SearchBar';

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-indigo-50/70 dark:bg-slate-950/80 backdrop-blur-xl border-b border-indigo-100/60 dark:border-slate-800/60 transition-all duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-indigo-500/25 group-hover:scale-105 group-hover:bg-indigo-500 group-hover:shadow-lg group-hover:shadow-indigo-500/40 active:scale-95 transition-all duration-200">
            <Wrench className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {BRAND_CONFIG.name}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 -mt-1 hidden sm:inline">
              100% Free Browser Utilities
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links with 10/10 Micro-Interactions */}
        <nav className="hidden md:flex items-center space-x-2">
          {[
            { label: 'Image Tools', href: '/image-tools' },
            { label: 'PDF Tools', href: '/pdf-tools' },
            { label: 'Calculators', href: '/calculators' },
            { label: 'Student Tools', href: '/student-tools' },
            { label: 'Quick Tools', href: '/quick-tools' },
          ].map((nav) => (
            <Link
              key={nav.href}
              href={nav.href}
              className="px-4 py-2 rounded-xl text-sm font-extrabold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-xs hover:-translate-y-0.5 active:scale-95 transition-all duration-200 border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700"
            >
              {nav.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-xs hover:border-slate-200/80 dark:hover:border-slate-700 border border-transparent hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5" />
          </button>

          <ThemeToggle />

          <button
            onClick={() => setMobileNavOpen(true)}
            className="md:hidden p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-xs hover:border-slate-200/80 dark:hover:border-slate-700 border border-transparent hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Expandable Header Search Bar */}
      {searchOpen && (
        <div className="p-4 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800">
          <SearchBar onSelect={() => setSearchOpen(false)} />
        </div>
      )}

      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </header>
  );
}
