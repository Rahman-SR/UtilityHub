import React from 'react';
import { CategoryPageTemplate } from '@/components/layout/CategoryPageTemplate';
import { constructMetadata } from '@/lib/seo';
import { BRAND_CONFIG } from '@/config/brand';

export const metadata = constructMetadata({
  title: 'Free Image Tools — Compress, Resize, Convert Images',
  description: 'Fast, free, 100% private browser-side image utilities. Compress JPG, resize PNG, and convert formats without cloud uploads.',
  canonicalUrl: `${BRAND_CONFIG.domain}/image-tools`,
});

export default function ImageToolsPage() {
  return <CategoryPageTemplate categoryId="image" />;
}
