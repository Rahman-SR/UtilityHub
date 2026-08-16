import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-extrabold tracking-wide transition-all duration-200 cubic-bezier(0.16,1,0.3,1) rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none cursor-pointer select-none';

    const variants = {
      primary:
        'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] dark:bg-indigo-600 dark:hover:bg-indigo-500',
      secondary:
        'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]',
      outline:
        'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-600 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]',
      ghost:
        'text-slate-700 dark:text-slate-300 hover:bg-indigo-50/80 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-[0.97]',
      danger:
        'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] dark:bg-red-600 dark:hover:bg-red-500',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs h-9',
      md: 'px-6 py-2.5 text-sm h-11',
      lg: 'px-8 py-3.5 text-base h-13',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
