import React from 'react';

export default function ToolLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      <div className="space-y-3 max-w-2xl">
        <div className="h-10 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-5 w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
      <div className="max-w-4xl mx-auto h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
    </div>
  );
}
