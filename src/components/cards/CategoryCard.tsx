import React from 'react';
import Link from 'next/link';
import { CategoryInfo } from '@/types/category';
import { CategoryIconContainer } from '../ui/CategoryIconContainer';
import { ArrowRight } from 'lucide-react';

export function CategoryCard({ category, toolCount }: { category: CategoryInfo; toolCount?: number }) {
  return (
    <Link
      href={`/${category.slug}`}
      className="group relative p-5 rounded-3xl bg-white dark:bg-[#121829] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 hover:border-blue-300 dark:hover:border-indigo-600 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
    >
      <div>
        <CategoryIconContainer
          category={category.id}
          icon={category.icon}
          size="md"
          className="mb-4 group-hover:scale-105"
          strokeWidth={1.75}
        />

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
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}
