'use client';

import React from 'react';
import { ToolMetadata } from '@/types/tool';
import { CATEGORIES } from '@/data/categories';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { FAQSection } from '@/components/tools/FAQSection';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { AdPlaceholder } from '@/components/ads/AdPlaceholder';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolPageShellProps {
  tool: ToolMetadata;
  children: React.ReactNode;
  maxWidthClassName?: string;
}

export function ToolPageShell({ tool, children, maxWidthClassName = 'max-w-6xl' }: ToolPageShellProps) {
  const category = CATEGORIES[tool.category];

  return (
    <div className={cn('mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6', maxWidthClassName)}>
      {/* Compact Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: category ? category.name : 'Tools', href: category ? `/${category.slug}` : '/tools' },
          { label: tool.name },
        ]}
      />

      {/* Compact Header Section — Above the fold priority */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-indigo-950 text-blue-800 dark:text-indigo-300 text-[11px] font-black uppercase tracking-wider">
            {category ? category.name : tool.category}
          </span>
          {tool.localProcessing && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
              <ShieldCheck className="w-3 h-3" />
              <span>Browser Local Processing</span>
            </span>
          )}
        </div>

        <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 dark:text-slate-100 tracking-tight">
          {tool.name}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-snug font-medium max-w-3xl">
          {tool.description}
        </p>
      </div>

      {/* Main Tool Workspace — The Visual Hero */}
      <section className="pt-1">{children}</section>

      {/* Ad Slot */}
      <AdPlaceholder />

      {/* How To Use Steps */}
      {tool.howToSteps && tool.howToSteps.length > 0 && (
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 dark:text-slate-100">
            How to use {tool.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tool.howToSteps.map((step, idx) => (
              <div key={idx} className="space-y-2 relative">
                <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                  {idx + 1}
                </div>
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-slate-100">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <FAQSection faqs={tool.faqs} />

      {/* Related Tools */}
      <RelatedTools currentTool={tool} />
    </div>
  );
}
