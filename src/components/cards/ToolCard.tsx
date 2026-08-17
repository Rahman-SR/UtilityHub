import React from 'react';
import Link from 'next/link';
import { ToolMetadata } from '@/types/tool';
import { Badge } from '../ui/Badge';
import { CategoryIconContainer } from '../ui/CategoryIconContainer';
import { ArrowRight } from 'lucide-react';

export function ToolCard({ tool }: { tool: ToolMetadata }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative p-5 rounded-3xl bg-white dark:bg-[#121829] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 hover:border-blue-300 dark:hover:border-indigo-600 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between h-full"
    >
      <div>
        {/* Icon at top left */}
        <CategoryIconContainer
          category={tool.category}
          icon={tool.icon}
          size="md"
          className="mb-4 group-hover:scale-105"
          strokeWidth={1.75}
        />

        {/* Tool Name + Popular Badge */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors truncate">
            {tool.name}
          </h3>
          {tool.popular && (
            <Badge variant="warning" className="text-[10px] py-0.5 px-2 font-black shrink-0">
              Popular
            </Badge>
          )}
        </div>

        {/* Short useful description */}
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
          {tool.description}
        </p>
      </div>

      {/* Divider + Bottom Action */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors">
          <span>Open Tool</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}
