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
      'inline-flex items-center justify-center font-extrabold tracking-wide transition-all duration-200 ease-out rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none cursor-pointer select-none';

    const variants = {
      primary:
        'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] dark:bg-gradient-to-r dark:from-blue-600 dark:via-indigo-600 dark:to-violet-600 dark:hover:from-blue-500 dark:hover:to-violet-500 dark:shadow-indigo-500/20',
      secondary:
        'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-indigo-500 hover:text-blue-600 dark:hover:text-indigo-400 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]',
      outline:
        'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-600 hover:text-blue-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]',
      ghost:
        'text-slate-700 dark:text-slate-300 hover:bg-blue-50/80 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-indigo-400 active:scale-[0.97]',
      danger:
        'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]',
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
