'use client';

import React, { useState } from 'react';
import { Search, X, Wrench, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { searchTools } from '@/lib/search';
import { ToolMetadata } from '@/types/tool';

export interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSelect?: () => void;
}

export function SearchBar({
  placeholder = 'Search for a tool (e.g. compress, merge PDF, GST, EMI)...',
  className,
  onSelect,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const results: ToolMetadata[] = query.trim() ? searchTools(query) : [];

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className || ''}`}>
      {/* Input Container */}
      <div className="relative flex items-center">
        <div className="absolute left-4.5 text-slate-400 pointer-events-none">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full pl-13 pr-10 py-4 text-sm md:text-base bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-md shadow-indigo-500/5 transition-all font-medium"
        />

        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Live Dropdown Results */}
      {isFocused && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto p-2">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Found {results.length} tool{results.length > 1 ? 's' : ''}
              </div>
              {results.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  onClick={() => {
                    setIsFocused(false);
                    if (onSelect) onSelect();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50/70 dark:hover:bg-slate-800/80 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {tool.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm font-semibold">No tools found matching &quot;{query}&quot;</p>
              <p className="text-xs mt-1 text-slate-400">
                Try searching for &quot;compress&quot;, &quot;pdf&quot;, &quot;emi&quot;, &quot;gst&quot;, or &quot;qr&quot;.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
