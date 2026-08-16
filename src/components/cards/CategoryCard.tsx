import React from 'react';
import Link from 'next/link';
import { CategoryInfo } from '@/types/category';
import { Image, FileText, Calculator, GraduationCap, Zap, ArrowRight } from 'lucide-react';

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  Image,
  FileText,
  Calculator,
  GraduationCap,
  Zap,
};

const CATEGORY_STYLE_MAP: Record<string, { bg: string; text: string; hoverBorder: string; darkBg: string }> = {
  image: {
    bg: 'bg-blue-50 text-blue-600 border-blue-100',
    darkBg: 'dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900/60',
    text: 'text-blue-600 dark:text-blue-400',
    hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
  },
  pdf: {
    bg: 'bg-rose-50 text-rose-600 border-rose-100',
    darkBg: 'dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900/60',
    text: 'text-rose-600 dark:text-rose-400',
    hoverBorder: 'hover:border-rose-300 dark:hover:border-rose-700',
  },
  finance: {
    bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    darkBg: 'dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900/60',
    text: 'text-emerald-600 dark:text-emerald-400',
    hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
  },
  student: {
    bg: 'bg-purple-50 text-purple-600 border-purple-100',
    darkBg: 'dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-900/60',
    text: 'text-purple-600 dark:text-purple-400',
    hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-700',
  },
  quick: {
    bg: 'bg-amber-50 text-amber-600 border-amber-100',
    darkBg: 'dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900/60',
    text: 'text-amber-600 dark:text-amber-400',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
  },
};

export function CategoryCard({ category, toolCount }: { category: CategoryInfo; toolCount?: number }) {
  const IconComponent = CATEGORY_ICON_MAP[category.icon] || Zap;
  const style = CATEGORY_STYLE_MAP[category.id] || CATEGORY_STYLE_MAP.image;

  return (
    <Link
      href={`/${category.slug}`}
      className={`group relative p-5 rounded-3xl bg-white dark:bg-[#121829] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 ${style.hoverBorder} transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between`}
    >
      <div>
        <div className={`w-11 h-11 rounded-2xl ${style.bg} ${style.darkBg} border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200 shadow-xs`}>
          <IconComponent className="w-5 h-5" />
        </div>

        <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors">
          {category.name}
        </h3>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="inline-flex items-center space-x-1 text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors">
          <span>{toolCount ? `${toolCount} Tools` : 'Browse Category'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
        </span>
      </div>
    </Link>
  );
}
