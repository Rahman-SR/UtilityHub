import { MetadataRoute } from 'next';
import { BRAND_CONFIG } from '@/config/brand';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${BRAND_CONFIG.domain}/sitemap.xml`,
  };
}
