import React from 'react';
import { Info } from 'lucide-react';

export interface ResultPanelProps {
  children: React.ReactNode;
  note?: string;
  className?: string;
}

export function ResultPanel({ children, note, className = '' }: ResultPanelProps) {
  return (
    <div className={`space-y-4 flex flex-col justify-center ${className}`}>
      {children}
      {note && (
        <div className="flex items-start space-x-2 text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          <Info className="w-4 h-4 text-blue-600 dark:text-indigo-400 shrink-0 mt-0.5" strokeWidth={1.75} />
          <span>{note}</span>
        </div>
      )}
    </div>
  );
}
