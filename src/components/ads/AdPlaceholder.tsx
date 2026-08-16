import React from 'react';
import { cn } from '@/lib/utils';

export function AdPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'w-full p-4 my-8 rounded-2xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center select-none flex flex-col items-center justify-center min-h-[100px]',
        className
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
        Advertisement
      </span>
      <p className="text-xs text-slate-400 dark:text-slate-600 italic">
        Reserved ad slot (monetization placeholder)
      </p>
    </div>
  );
}
