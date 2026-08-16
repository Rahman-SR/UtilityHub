'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../ui/ThemeToggle';
import { MobileNav } from './MobileNav';
import { BRAND_CONFIG } from '@/config/brand';
import { Zap, Menu, Search, LayoutGrid, ChevronDown } from 'lucide-react';
import { SearchBar } from '../search/SearchBar';

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#0B101D]/85 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/80 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo matching Design 1 & 2 */}
        <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 dark:bg-gradient-to-br dark:from-blue-600 dark:to-indigo-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-lg transition-all duration-200">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors">
              {BRAND_CONFIG.name}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation matching Reference dropdowns */}
        <nav className="hidden md:flex items-center space-x-1 font-heading">
          <Link
            href="/tools"
            className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-indigo-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-all duration-200 flex items-center space-x-1"
          >
            <span>All Tools</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </Link>
          <Link
            href="/image-tools"
            className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-indigo-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-all duration-200 flex items-center space-x-1"
          >
            <span>Image</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </Link>
          <Link
            href="/pdf-tools"
            className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-indigo-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-all duration-200 flex items-center space-x-1"
          >
            <span>PDF</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </Link>
          <Link
            href="/calculators"
            className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-indigo-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-all duration-200 flex items-center space-x-1"
          >
            <span>Calculators</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </Link>
          <Link
            href="/student-tools"
            className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-indigo-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-all duration-200"
          >
            <span>Student</span>
          </Link>
          <Link
            href="/quick-tools"
            className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-indigo-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-all duration-200 flex items-center space-x-1"
          >
            <span>Quick</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </nav>

        {/* Right Actions matching Design 1 & 2 */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5" />
          </button>

          <ThemeToggle />

          <Link
            href="/tools"
            className="hidden sm:inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs tracking-wide uppercase shadow-md shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 dark:bg-gradient-to-r dark:from-blue-600 dark:via-indigo-600 dark:to-violet-600"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>All Tools</span>
          </Link>

          <button
            onClick={() => setMobileNavOpen(true)}
            className="md:hidden p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="p-4 bg-white/95 dark:bg-[#121829]/95 border-b border-slate-200 dark:border-slate-800">
          <SearchBar onSelect={() => setSearchOpen(false)} />
        </div>
      )}

      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </header>
  );
}
