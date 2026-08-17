import React from 'react';
import { ToolMetadata } from '@/types/tool';
import { getRelatedTools } from '@/data/tools';
import { ToolCard } from '../cards/ToolCard';
import { Sparkles } from 'lucide-react';

export function RelatedTools({ currentTool }: { currentTool: ToolMetadata }) {
  const related = getRelatedTools(currentTool);

  if (related.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto my-16 space-y-6">
      <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-100 font-heading font-extrabold text-xl md:text-2xl">
        <Sparkles className="w-6 h-6 text-blue-600 dark:text-indigo-400" strokeWidth={1.75} />
        <h2>Related Tools You Might Need</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {related.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
