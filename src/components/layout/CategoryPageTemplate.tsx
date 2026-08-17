import React from 'react';
import { CATEGORIES } from '@/data/categories';
import { getToolsByCategory } from '@/data/tools';
import { ToolCard } from '@/components/cards/ToolCard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { AdPlaceholder } from '@/components/ads/AdPlaceholder';

export function CategoryPageTemplate({ categoryId }: { categoryId: string }) {
  const category = CATEGORIES[categoryId];
  const tools = getToolsByCategory(categoryId);

  if (!category) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs items={[{ label: category.name }]} />

      {/* Clean Category Header Banner */}
      <div className="space-y-2 max-w-3xl pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-indigo-950/80 text-blue-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider border border-blue-200/80 dark:border-indigo-800">
          Category Directory
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 dark:text-slate-100 tracking-tight">
          {category.name}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {category.description}
        </p>
      </div>

      {/* Available Tools Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 dark:text-slate-100">
            Available {category.name} ({tools.length})
          </h2>
        </div>

        {tools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
            No tools found in this category yet.
          </div>
        )}
      </section>

      {/* Ad Slot placed below tools */}
      <AdPlaceholder />
    </div>
  );
}
