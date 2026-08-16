import React from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { BRAND_CONFIG } from '@/config/brand';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: `Terms of Service — ${BRAND_CONFIG.name}`,
  description: `Terms of service governing the usage of ${BRAND_CONFIG.name} web utilities.`,
});

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Terms of Service' }]} />

      <div className="space-y-4">
        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-slate-900 dark:text-slate-100 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-800 w-fit">
          Note: Development Copy — Subject to final review prior to production release.
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
        <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100">1. Acceptance of Terms</h2>
        <p>
          By accessing and using {BRAND_CONFIG.name}, you agree to comply with these terms. If you do not agree, please discontinue using the service.
        </p>

        <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100">2. Permitted Use</h2>
        <p>
          You may use our free web tools for personal, academic, or commercial everyday utility tasks. You agree not to attempt to reverse engineer or disrupt the service.
        </p>

        <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100">3. Disclaimer of Warranties</h2>
        <p>
          The platform and tools are provided &quot;as is&quot; without warranties of any kind. Users are responsible for verifying calculations before making financial or legal decisions.
        </p>
      </div>
    </div>
  );
}
