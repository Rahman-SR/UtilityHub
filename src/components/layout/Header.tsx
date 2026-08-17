'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../ui/ThemeToggle';
import { MobileNav } from './MobileNav';
import { BRAND_CONFIG } from '@/config/brand';
import { Zap, Menu, Search } from 'lucide-react';
import { SearchBar } from '../search/SearchBar';

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-blue-50/70 dark:bg-[#0B101D]/90 backdrop-blur-xl transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 dark:bg-gradient-to-br dark:from-blue-600 dark:to-indigo-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-lg transition-all duration-200">
            <Zap className="w-5 h-5 fill-current" strokeWidth={1.75} />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors">
              {BRAND_CONFIG.name}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Clean Text Links without unneeded icons) */}
        <nav className="hidden md:flex items-center space-x-1 font-heading">
          <Link
            href="/tools"
            className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-indigo-400 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-200"
          >
            All Tools
          </Link>
          <Link
            href="/image-tools"
            className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-indigo-400 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-200"
          >
            Image
          </Link>
          <Link
            href="/pdf-tools"
            className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-indigo-400 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-200"
          >
            PDF
          </Link>
          <Link
            href="/calculators"
            className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-indigo-400 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-200"
          >
            Calculators
          </Link>
          <Link
            href="/student-tools"
            className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-indigo-400 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-200"
          >
            Student
          </Link>
          <Link
            href="/quick-tools"
            className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-indigo-400 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-200"
          >
            Quick
          </Link>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              searchOpen
                ? 'bg-blue-600 text-white dark:bg-indigo-600'
                : 'text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800'
            }`}
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5" strokeWidth={1.75} />
          </button>

          <ThemeToggle />

          <button
            onClick={() => setMobileNavOpen(true)}
            className="md:hidden p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="p-4 bg-white/95 dark:bg-[#121829]/95 border-b border-slate-200/80 dark:border-slate-800 flex justify-center items-center shadow-lg transition-all animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-full max-w-2xl mx-auto flex justify-center">
            <SearchBar onSelect={() => setSearchOpen(false)} className="w-full" />
          </div>
        </div>
      )}

      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </header>
  );
}
