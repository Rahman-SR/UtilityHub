import React from 'react';
import { LucideIcon } from 'lucide-react';
import { CalculatorActions } from './CalculatorActions';

export interface CalculatorShellProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  onReset: () => void;
  copySummaryText?: string;
  inputs: React.ReactNode;
  results: React.ReactNode;
  className?: string;
}

export function CalculatorShell({
  title,
  subtitle = 'Real-time browser calculation',
  icon: Icon,
  iconColor = 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
  onReset,
  copySummaryText,
  inputs,
  results,
  className = '',
}: CalculatorShellProps) {
  return (
    <div
      className={`w-full max-w-4xl mx-auto p-6 sm:p-8 bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-8 ${className}`}
    >
      {/* Header Toolbar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4 flex-wrap">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold ${iconColor}`}>
            <Icon className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-slate-500 font-semibold">{subtitle}</p>
          </div>
        </div>

        <CalculatorActions onReset={onReset} copySummaryText={copySummaryText} />
      </div>

      {/* 2-Column Responsive Layout: Inputs Left, Results Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Inputs */}
        <div className="space-y-6">{inputs}</div>

        {/* Right Column: Results */}
        <div className="space-y-6">{results}</div>
      </div>
    </div>
  );
}
