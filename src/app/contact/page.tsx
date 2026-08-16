import React from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { BRAND_CONFIG } from '@/config/brand';
import { constructMetadata } from '@/lib/seo';
import { Mail, MessageSquare } from 'lucide-react';

export const metadata = constructMetadata({
  title: `Contact Us — ${BRAND_CONFIG.name}`,
  description: `Get in touch with the ${BRAND_CONFIG.name} team for feedback, tool requests, or support.`,
});

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Contact' }]} />

      <div className="space-y-4">
        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-slate-900 dark:text-slate-100 tracking-tight">
          Contact Us
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
          Have feedback or a tool suggestion? We would love to hear from you.
        </p>

        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-800 w-fit">
          Note: Development Copy — Subject to final review prior to production release.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100">Email Support</h3>
          <p className="text-xs text-slate-500">Reach out directly via email for inquiry or support.</p>
          <a
            href={`mailto:${BRAND_CONFIG.supportEmail}`}
            className="inline-block text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-2"
          >
            {BRAND_CONFIG.supportEmail}
          </a>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100">Tool Request</h3>
          <p className="text-xs text-slate-500">Suggest a new utility tool for future platform updates.</p>
          <span className="inline-block text-xs font-medium text-slate-400 pt-2">
            Submit ideas via email
          </span>
        </div>
      </div>
    </div>
  );
}
