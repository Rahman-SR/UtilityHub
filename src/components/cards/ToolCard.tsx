import React from 'react';
import Link from 'next/link';
import { ToolMetadata } from '@/types/tool';
import { Badge } from '../ui/Badge';
import {
  Minimize2,
  Maximize2,
  ArrowRightLeft,
  FileImage,
  FilePlus,
  Scissors,
  FileCheck,
  Receipt,
  BadgePercent,
  TrendingUp,
  Percent,
  GraduationCap,
  CalendarCheck,
  Calendar,
  QrCode,
  Wrench,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Minimize2,
  Maximize2,
  ArrowRightLeft,
  FileImage,
  FilePlus,
  Scissors,
  FileCheck,
  Receipt,
  BadgePercent,
  TrendingUp,
  Percent,
  GraduationCap,
  CalendarCheck,
  Calendar,
  QrCode,
};

const CATEGORY_ACCENT_MAP: Record<string, { bg: string; text: string; hoverBg: string }> = {
  image: {
    bg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
    text: 'text-sky-700 dark:text-sky-300',
    hoverBg: 'group-hover:bg-sky-600',
  },
  pdf: {
    bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
    text: 'text-rose-700 dark:text-rose-300',
    hoverBg: 'group-hover:bg-rose-600',
  },
  finance: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    hoverBg: 'group-hover:bg-emerald-600',
  },
  student: {
    bg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800',
    text: 'text-purple-700 dark:text-purple-300',
    hoverBg: 'group-hover:bg-purple-600',
  },
  quick: {
    bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    text: 'text-amber-800 dark:text-amber-300',
    hoverBg: 'group-hover:bg-amber-600',
  },
};

export function ToolCard({ tool }: { tool: ToolMetadata }) {
  const IconComponent = ICON_MAP[tool.icon] || Wrench;
  const accent = CATEGORY_ACCENT_MAP[tool.category] || CATEGORY_ACCENT_MAP.image;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-600 hover:-translate-y-1.5 transition-all duration-200 ease-out"
    >
      <div>
        {/* Top Bar with Category Accent Icon & Badges */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-2xl ${accent.bg} ${accent.text} border flex items-center justify-center ${accent.hoverBg} group-hover:text-white group-hover:border-transparent transition-all duration-200 shadow-xs group-hover:scale-105`}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="flex items-center space-x-1.5">
            {tool.popular && <Badge variant="warning">Popular</Badge>}
            {tool.localProcessing && (
              <Badge variant="success" className="hidden sm:inline-flex">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Local
              </Badge>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {tool.name}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* 10/10 Production Pill Action Button */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 shadow-xs group-hover:shadow-md group-hover:shadow-indigo-500/20">
          <span>Use Tool</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
        </span>
      </div>
    </Link>
  );
}
