import React from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { BRAND_CONFIG } from '@/config/brand';
import { constructMetadata } from '@/lib/seo';
import { ShieldCheck } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Privacy Policy — 100% Client-Side Processing',
  description: `Our privacy policy explaining our 100% browser-side local file processing commitment.`,
  canonicalUrl: `${BRAND_CONFIG.domain}/privacy`,
});

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <div className="space-y-4">
        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-slate-900 dark:text-slate-100 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-800 w-fit">
          Note: Development Copy — Subject to final review prior to production release.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start space-x-3 text-sm text-emerald-900 dark:text-emerald-100">
        <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-heading font-bold text-base">Client-Side Local Processing Guarantee</h3>
          <p className="text-xs text-emerald-800 dark:text-emerald-200 mt-1">
            {BRAND_CONFIG.name} processes files (including images and PDFs) locally within your browser using HTML5 Web APIs. Your uploaded files are never transmitted to or stored on our servers.
          </p>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
        <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100">1. Information Collection</h2>
        <p>
          We do not require user accounts, email addresses, or personal registration to access our core utility suite. We do not inspect, log, or harvest file contents processed through our tools.
        </p>

        <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100">2. Local Storage & Preferences</h2>
        <p>
          We may use standard browser local storage (`localStorage`) to remember non-sensitive settings, such as your dark/light mode preference.
        </p>

        <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100">3. Advertising & Analytics</h2>
        <p>
          Future platform monetization may incorporate non-intrusive advertising providers. Any analytics collected will strictly avoid collecting personal file data.
        </p>
      </div>
    </div>
  );
}
