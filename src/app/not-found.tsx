import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, Grid, Search } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-indigo-950/80 text-blue-600 dark:text-indigo-400 flex items-center justify-center border border-blue-200 dark:border-indigo-800 shadow-sm">
        <Search className="w-10 h-10" strokeWidth={1.75} />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-indigo-400">
          404 — Page Not Found
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 dark:text-slate-100 tracking-tight">
          Oops! Tool or page not found
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          The requested route doesn&apos;t exist or has moved. Explore our suite of free online web tools on {BRAND_CONFIG.name}.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link href="/">
          <Button variant="primary" size="md">
            <Home className="w-4 h-4 mr-2" strokeWidth={1.75} />
            <span>Return Home</span>
          </Button>
        </Link>

        <Link href="/tools">
          <Button variant="outline" size="md">
            <Grid className="w-4 h-4 mr-2" strokeWidth={1.75} />
            <span>Browse All Tools</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
