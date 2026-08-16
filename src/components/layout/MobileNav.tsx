'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORY_LIST } from '@/data/categories';
import { Wrench, ShieldCheck, ChevronRight } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-x-0 top-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-xl transition-all z-30 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="px-4 pt-4 pb-6 space-y-4">
        <div className="space-y-1">
          <Link
            href="/tools"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <div className="flex items-center space-x-3">
              <Wrench className="w-5 h-5 text-blue-600" />
              <span>All 15 Tools</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <div className="pt-2 pb-1 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Categories
          </div>

          {CATEGORY_LIST.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span>{cat.name}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          ))}
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
          <div className="px-3 py-2 flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Browser-Local Privacy Guaranteed</span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 px-3 text-xs text-slate-500">
            <Link href="/about" onClick={onClose} className="hover:underline">About</Link>
            <Link href="/privacy" onClick={onClose} className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" onClick={onClose} className="hover:underline">Terms of Service</Link>
            <Link href="/contact" onClick={onClose} className="hover:underline">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
