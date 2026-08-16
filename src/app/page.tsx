import React from 'react';
import { CATEGORY_LIST } from '@/data/categories';
import { POPULAR_TOOLS } from '@/data/tools';
import { ToolCard } from '@/components/cards/ToolCard';
import { CategoryCard } from '@/components/cards/CategoryCard';
import { SearchBar } from '@/components/search/SearchBar';
import { AdPlaceholder } from '@/components/ads/AdPlaceholder';
import { constructMetadata } from '@/lib/seo';
import { ShieldCheck, Zap, Lock, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = constructMetadata({
  title: 'Daily Utility Hub — 100% Free Browser-Based Utility Tools',
  description:
    'Free online tools to compress images, merge PDFs, split PDFs, generate QR codes, calculate GST & EMI. 100% local browser processing — your files never leave your device.',
  canonicalUrl: 'https://dailyutilityhub.com',
});

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50/70 via-slate-50 to-slate-50/40 dark:from-slate-950 dark:via-indigo-950/40 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-indigo-100/90 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 text-xs sm:text-sm font-black tracking-widest uppercase border border-indigo-300 dark:border-indigo-800 shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>100% FREE • NO SIGN UP • ZERO FILE UPLOADS</span>
          </div>

          {/* Bold & Capitalized Large Main Heading */}
          <h1 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-slate-900 dark:text-slate-100 tracking-tight leading-[1.05] uppercase">
            EVERYTHING YOU NEED. <br className="hidden sm:inline" />
            <span className="text-indigo-600 dark:text-indigo-400">ONE TOOLBOX.</span>
          </h1>

          {/* Subtitle Bold & Capitalized */}
          <p className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-200 max-w-3xl mx-auto leading-relaxed font-bold uppercase tracking-wider">
            ESSENTIAL UTILITIES TO COMPRESS IMAGES, MERGE PDFS, GENERATE QR CODES, AND CALCULATE FINANCES DIRECTLY IN YOUR BROWSER. FAST, SECURE, AND ALWAYS PRIVATE.
          </p>

          {/* Prominent Product Search Control */}
          <div className="pt-2">
            <SearchBar placeholder="SEARCH 15+ BROWSER TOOLS (E.G. COMPRESS IMAGE, MERGE PDF, EMI)..." />
          </div>

          {/* Trust Indicators Bar */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>100% BROWSER LOCAL</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>INSTANT FILE PROCESSING</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>NO REGISTRATION REQUIRED</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdPlaceholder />
      </div>

      {/* Category Section (White Surface Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-slate-100">
              Browse Tool Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Organized for quick access to your daily tasks
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORY_LIST.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Popular Tools Section (Soft Secondary Background) */}
      <section className="py-16 bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Most Used Utilities
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-slate-100 mt-1">
                Popular Tools
              </h2>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center space-x-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
            >
              <span>View All 15 Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_TOOLS.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Privacy Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center mx-auto sm:mx-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100">
              Privacy First Engine
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Your files never leave your device. All image compression, PDF merging, and QR generation are computed 100% locally in your browser memory.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800 flex items-center justify-center mx-auto sm:mx-0">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100">
              Blazing Fast Speed
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              No server queues or upload bandwidth limits. Experience near-instant processing powered directly by HTML5 Canvas & WebAssembly APIs.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800 flex items-center justify-center mx-auto sm:mx-0">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100">
              Free & Unrestricted
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              No subscription fees, no account registration required, and no hidden trial limits. Designed for daily seamless productivity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
