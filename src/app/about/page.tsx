import React from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { BRAND_CONFIG } from '@/config/brand';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'About Us — Free Privacy-First Browser Tools',
  description: `Learn more about ${BRAND_CONFIG.name}, our privacy principles, and our fast browser-based utility collection.`,
  canonicalUrl: `${BRAND_CONFIG.domain}/about`,
});

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <div className="space-y-4">
        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-slate-900 dark:text-slate-100 tracking-tight">
          About {BRAND_CONFIG.name}
        </h1>

        <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-800 w-fit">
          Note: Development Copy — Subject to final review prior to production release.
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-300 text-base leading-relaxed">
        <p>
          <strong>{BRAND_CONFIG.name}</strong> was engineered to provide internet users with a fast, reliable, and completely private collection of daily utilities. From compressing images and merging PDFs to calculating financial metrics and generating QR codes, our tools work directly inside your browser DOM.
        </p>

        <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100">
          Our Core Mission
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Zero Cloud Uploads:</strong> Your documents and images process locally in client memory.</li>
          <li><strong>No Paywalls:</strong> All core V1 utilities are free without mandatory account creation.</li>
          <li><strong>High Performance:</strong> Optimized JavaScript and minimal dependencies ensure instant results.</li>
        </ul>
      </div>
    </div>
  );
}
