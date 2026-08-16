import React from 'react';
import { CategoryPageTemplate } from '@/components/layout/CategoryPageTemplate';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Free PDF Tools — Merge, Split, and Convert PDFs',
  description: 'Combine and manipulate PDF documents securely directly in your browser. No server upload, no registration.',
  canonicalUrl: 'https://dailyutilityhub.com/pdf-tools',
});

export default function PdfToolsPage() {
  return <CategoryPageTemplate categoryId="pdf" />;
}
