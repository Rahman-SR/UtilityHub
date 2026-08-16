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
    bg: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900/60',
    text: 'text-blue-600 dark:text-blue-400',
    hoverBg: 'group-hover:bg-blue-600',
  },
  pdf: {
    bg: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900/60',
    text: 'text-rose-600 dark:text-rose-400',
    hoverBg: 'group-hover:bg-rose-600',
  },
  finance: {
    bg: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900/60',
    text: 'text-emerald-600 dark:text-emerald-400',
    hoverBg: 'group-hover:bg-emerald-600',
  },
  student: {
    bg: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-900/60',
    text: 'text-purple-600 dark:text-purple-400',
    hoverBg: 'group-hover:bg-purple-600',
  },
  quick: {
    bg: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900/60',
    text: 'text-amber-600 dark:text-amber-400',
    hoverBg: 'group-hover:bg-amber-600',
  },
};

export function ToolCard({ tool }: { tool: ToolMetadata }) {
  const IconComponent = ICON_MAP[tool.icon] || Wrench;
  const accent = CATEGORY_ACCENT_MAP[tool.category] || CATEGORY_ACCENT_MAP.image;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex items-center p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#121829] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 hover:border-blue-300 dark:hover:border-indigo-600 hover:-translate-y-1 transition-all duration-200 ease-out"
    >
      <div
        className={`w-12 h-12 rounded-2xl ${accent.bg} border flex items-center justify-center shrink-0 mr-4 group-hover:scale-105 transition-transform duration-200 shadow-xs`}
      >
        <IconComponent className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center space-x-1.5 mb-1">
          <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors truncate">
            {tool.name}
          </h3>
          {tool.popular && <Badge variant="warning" className="text-[10px] py-0.5 px-1.5">Popular</Badge>}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {tool.description}
        </p>
      </div>

      <div className="shrink-0 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-indigo-400">
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
      </div>
    </Link>
  );
}
