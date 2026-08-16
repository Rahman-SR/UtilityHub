import { Metadata } from 'next';
import { BRAND_CONFIG } from '@/config/brand';
import { ToolMetadata } from '@/types/tool';

export function constructMetadata({
  title,
  description = BRAND_CONFIG.description,
  image = '/og-image.png',
  noIndex = false,
  canonicalUrl,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
} = {}): Metadata {
  const metaTitle = title
    ? `${title} | ${BRAND_CONFIG.name}`
    : `${BRAND_CONFIG.name} — ${BRAND_CONFIG.tagline}`;

  return {
    title: metaTitle,
    description,
    keywords: [
      'utility hub',
      'online tools',
      'image compressor',
      'merge pdf',
      'gst calculator',
      'emi calculator',
      'qr generator',
      'free web tools',
      'browser tools',
    ],
    authors: [{ name: BRAND_CONFIG.name }],
    creator: BRAND_CONFIG.name,
    metadataBase: new URL(BRAND_CONFIG.domain),
    ...(canonicalUrl && {
      alternates: {
        canonical: canonicalUrl,
      },
    }),
    openGraph: {
      title: metaTitle,
      description,
      url: canonicalUrl || BRAND_CONFIG.domain,
      siteName: BRAND_CONFIG.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description,
      images: [image],
      creator: BRAND_CONFIG.social.twitter,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
  };
}

export function generateToolJsonLd(tool: ToolMetadata) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    url: `${BRAND_CONFIG.domain}/tools/${tool.slug}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}
