import React from 'react';

export interface CalculatorInputProps {
  label: string;
  helperText?: string;
  error?: string;
  children: React.ReactNode;
  id?: string;
}

export function CalculatorInput({ label, helperText, error, children, id }: CalculatorInputProps) {
  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{helperText}</p>
      ) : null}
    </div>
  );
}
