import React from 'react';
import { CategoryPageTemplate } from '@/components/layout/CategoryPageTemplate';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Quick Web Utilities — Age Calculator & QR Code Generator',
  description: 'Everyday quick tools including exact Age Calculator and instant QR Code Generator.',
  canonicalUrl: 'https://dailyutilityhub.com/quick-tools',
});

export default function QuickToolsPage() {
  return <CategoryPageTemplate categoryId="quick" />;
}
