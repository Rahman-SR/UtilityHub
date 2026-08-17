import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface ValidationMessageProps {
  message?: string;
  className?: string;
}

export function ValidationMessage({ message, className = '' }: ValidationMessageProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 flex items-start space-x-2.5 text-xs font-bold ${className}`}
    >
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
      <span>{message}</span>
    </div>
  );
}
