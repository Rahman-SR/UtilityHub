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

const CATEGORY_STYLE_MAP: Record<string, { bg: string; text: string; hoverBorder: string }> = {
  image: {
    bg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
    text: 'text-sky-700 dark:text-sky-300',
    hoverBorder: 'hover:border-sky-300 dark:hover:border-sky-700',
  },
  pdf: {
    bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
    text: 'text-rose-700 dark:text-rose-300',
    hoverBorder: 'hover:border-rose-300 dark:hover:border-rose-700',
  },
  finance: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
  },
  student: {
    bg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800',
    text: 'text-purple-700 dark:text-purple-300',
    hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-700',
  },
  quick: {
    bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    text: 'text-amber-800 dark:text-amber-300',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
  },
};

export function CategoryCard({ category, toolCount }: { category: CategoryInfo; toolCount?: number }) {
  const IconComponent = CATEGORY_ICON_MAP[category.icon] || Zap;
  const style = CATEGORY_STYLE_MAP[category.id] || CATEGORY_STYLE_MAP.image;

  return (
    <Link
      href={`/${category.slug}`}
      className={`group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 ${style.hoverBorder} transition-all duration-200 hover:-translate-y-1.5 flex flex-col justify-between`}
    >
      <div>
        <div className={`w-12 h-12 rounded-2xl ${style.bg} ${style.text} border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200 shadow-xs`}>
          <IconComponent className="w-6 h-6" />
        </div>

        <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {category.name}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {category.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 shadow-xs group-hover:shadow-md group-hover:shadow-indigo-500/20">
          <span>{toolCount ? `${toolCount} Tools` : 'Explore Category'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
        </span>
      </div>
    </Link>
  );
}
