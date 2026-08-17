import React from 'react';
import { CATEGORY_LIST } from '@/data/categories';
import { POPULAR_TOOLS } from '@/data/tools';
import { ToolCard } from '@/components/cards/ToolCard';
import { CategoryCard } from '@/components/cards/CategoryCard';
import { HeroOrbitalVisual } from '@/components/home/HeroOrbitalVisual';
import { AdPlaceholder } from '@/components/ads/AdPlaceholder';
import { constructMetadata } from '@/lib/seo';
import { ShieldCheck, Zap, Lock, Sparkles, ArrowRight, Flame, Target } from 'lucide-react';
import Link from 'next/link';

export const metadata = constructMetadata({
  title: 'Daily Utility Hub — 100% Free Browser-Based Utility Tools',
  description:
    'POWERFUL EVERYDAY TOOLS FOR IMAGES, PDFS, CALCULATIONS, STUDENTS AND MORE. NO SIGNUP. NO LIMITS. 100% LOCAL BROWSER PROCESSING.',
  canonicalUrl: 'https://dailyutilityhub.com',
});

export default function HomePage() {
  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 2-Column Hero Section matching Design 1 & 2 */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50/20 dark:from-[#0B101D] dark:via-[#121829] dark:to-[#0B101D] border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column Text Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-100/80 dark:bg-indigo-950/80 text-blue-900 dark:text-indigo-200 text-xs sm:text-sm font-black tracking-wider uppercase border border-blue-200 dark:border-indigo-800 shadow-xs">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-indigo-400" strokeWidth={1.75} />
              <span>15+ TOOLS • 100% FREE • PRIVATE</span>
            </div>

            {/* Headline */}
            <h1 className="font-hero-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-slate-900 dark:text-slate-100 tracking-wider leading-[0.95] uppercase font-black">
              ONE TOOLBOX. <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 text-transparent bg-clip-text">
                ENDLESS POSSIBILITIES.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-800 dark:text-slate-200 max-w-2xl leading-relaxed font-black uppercase tracking-wide">
              POWERFUL EVERYDAY TOOLS FOR IMAGES, PDFS, CALCULATIONS, STUDENTS AND MORE. NO SIGNUP. NO LIMITS.
            </p>

            {/* 4 Trust Chips */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              <div className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 shadow-xs">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
                <span>BLAZING FAST</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 shadow-xs">
                <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
                <span>100% FREE</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 shadow-xs">
                <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
                <span>NO SIGNUP</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" strokeWidth={1.75} />
                <span>PRIVACY FIRST</span>
              </div>
            </div>
          </div>

          {/* Right Column Pure HTML/CSS/React Orbital Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroOrbitalVisual />
          </div>
        </div>
      </section>

      {/* Top Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 dark:text-slate-100">
            Top Categories
          </h2>
          <Link
            href="/tools"
            className="inline-flex items-center space-x-1 text-xs sm:text-sm font-extrabold text-blue-600 dark:text-indigo-400 hover:underline"
          >
            <span>Explore all</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORY_LIST.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-orange-500" strokeWidth={1.75} />
            <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 dark:text-slate-100">
              Popular Tools
            </h2>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center space-x-1 text-xs sm:text-sm font-extrabold text-blue-600 dark:text-indigo-400 hover:underline"
          >
            <span>View all tools</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Ad Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdPlaceholder />
      </div>

      {/* Why Choose Our Tools (Benefits Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-slate-100">
              100% Local Privacy Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your files never leave your device. All image compression, PDF merging, and QR generation are computed 100% locally in your browser memory.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800 flex items-center justify-center">
              <Zap className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-slate-100">
              Blazing Fast Speed
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No server queues or upload bandwidth limits. Experience near-instant processing powered directly by HTML5 Canvas & WebAssembly APIs.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800 flex items-center justify-center">
              <Lock className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-slate-100">
              Free & Unrestricted
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No subscription fees, no account registration required, and no hidden trial limits. Designed for daily seamless productivity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
