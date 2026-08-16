import React from 'react';
import { TOOLS } from '@/data/tools';
import { CATEGORY_LIST } from '@/data/categories';
import { ToolCard } from '@/components/cards/ToolCard';
import { SearchBar } from '@/components/search/SearchBar';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { AdPlaceholder } from '@/components/ads/AdPlaceholder';
import { constructMetadata } from '@/lib/seo';
import { Wrench } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'All Free Utility Tools — Daily Utility Hub',
  description:
    'Browse all 15 free online tools for image compression, PDF merging, QR code generation, GST calculation, EMI calculation, and student tools. 100% browser-based.',
  canonicalUrl: 'https://dailyutilityhub.com/tools',
});

export default function AllToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs items={[{ label: 'All Tools' }]} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-200/80 dark:border-indigo-800">
          <Wrench className="w-3.5 h-3.5" />
          <span>Full Tool Directory</span>
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 dark:text-slate-100 tracking-tight">
          All Utility Tools
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Fast, free, and privacy-focused online utilities. Select a tool to start processing directly in your browser.
        </p>

        <div className="pt-4">
          <SearchBar />
        </div>
      </div>

      <AdPlaceholder />

      {/* Tools Grouped by Category */}
      <div className="space-y-16">
        {CATEGORY_LIST.map((category) => {
          const categoryTools = TOOLS.filter((t) => t.category === category.id);
          if (categoryTools.length === 0) return null;

          return (
            <section key={category.id} className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-slate-100">
                    {category.name}
                  </h2>
                  <p className="text-xs text-slate-500">{category.description}</p>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  {categoryTools.length} Tools
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
