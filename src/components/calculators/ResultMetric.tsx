import React from 'react';

export interface ResultMetricProps {
  title: string;
  value: string;
  subtitle?: string;
  variant?: 'primary' | 'success' | 'neutral' | 'accent';
  className?: string;
}

export function ResultMetric({
  title,
  value,
  subtitle,
  variant = 'neutral',
  className = '',
}: ResultMetricProps) {
  const variantStyles = {
    primary:
      'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 border-transparent',
    success:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 border border-emerald-200/80 dark:border-emerald-800',
    accent:
      'bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-100 border border-purple-200/80 dark:border-purple-800',
    neutral:
      'bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700',
  };

  const isPrimary = variant === 'primary';

  return (
    <div
      className={`p-5 rounded-2xl transition-all ${variantStyles[variant]} ${className}`}
    >
      <span
        className={`block text-xs font-extrabold uppercase tracking-wider ${
          isPrimary ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        {title}
      </span>
      <span
        className={`block font-heading font-black tracking-tight mt-1 ${
          isPrimary ? 'text-3xl sm:text-4xl text-white' : 'text-2xl sm:text-3xl text-slate-900 dark:text-slate-100'
        }`}
      >
        {value}
      </span>
      {subtitle && (
        <span
          className={`block text-xs font-semibold mt-1 ${
            isPrimary ? 'text-blue-100/90' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
}
