import React from 'react';

export default function Loading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="space-y-4 max-w-3xl">
        <div className="h-12 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-6 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
      <div className="h-96 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl" />
    </div>
  );
}
