import React from 'react';
import { CategoryPageTemplate } from '@/components/layout/CategoryPageTemplate';
import { constructMetadata } from '@/lib/seo';
import { BRAND_CONFIG } from '@/config/brand';

export const metadata = constructMetadata({
  title: 'Quick Web Utilities — Age Calculator & QR Code Generator',
  description: 'Everyday quick tools including exact Age Calculator and instant QR Code Generator.',
  canonicalUrl: `${BRAND_CONFIG.domain}/quick-tools`,
});

export default function QuickToolsPage() {
  return <CategoryPageTemplate categoryId="quick" />;
}
