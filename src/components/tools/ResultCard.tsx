import React from 'react';
import { cn } from '@/lib/utils';

export interface ResultCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: 'primary' | 'success' | 'neutral';
  className?: string;
}

export function ResultCard({ title, value, subtitle, variant = 'primary', className }: ResultCardProps) {
  const variants = {
    primary: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100',
    neutral: 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100',
  };

  return (
    <div className={cn('p-5 rounded-2xl border transition-all', variants[variant], className)}>
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
        {title}
      </span>
      <div className="font-heading font-extrabold text-2xl md:text-3xl tracking-tight">
        {value}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}
