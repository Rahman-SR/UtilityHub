import { Metadata } from 'next';
import { BRAND_CONFIG } from '@/config/brand';
import { ToolMetadata } from '@/types/tool';
import { CATEGORIES } from '@/data/categories';

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
    : `${BRAND_CONFIG.name} – Everyday Online Tools`;

  return {
    title: metaTitle,
    description,
    keywords: [
      'yoursthing',
      'online tools',
      'image compressor',
      'merge pdf',
      'gst calculator',
      'emi calculator',
      'resume builder',
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

/**
 * Generate homepage WebSite JSON-LD
 */
export function generateHomePageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND_CONFIG.name,
    url: BRAND_CONFIG.domain,
    description: BRAND_CONFIG.description,
    publisher: {
      '@type': 'Organization',
      name: BRAND_CONFIG.name,
      url: BRAND_CONFIG.domain,
    },
  };
}

/**
 * Generate Tool Page JSON-LD (WebApplication + BreadcrumbList + FAQPage)
 */
export function generateToolJsonLd(tool: ToolMetadata) {
  const category = CATEGORIES[tool.category];
  const toolUrl = `${BRAND_CONFIG.domain}/tools/${tool.slug}`;
  const categoryUrl = category ? `${BRAND_CONFIG.domain}/${category.slug}` : `${BRAND_CONFIG.domain}/tools`;

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    url: toolUrl,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BRAND_CONFIG.domain,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category ? category.name : 'Tools',
        item: categoryUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: toolUrl,
      },
    ],
  };

  const faqSchema = tool.faqs && tool.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  return [webAppSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])];
}

/**
 * Generate Category Page JSON-LD (BreadcrumbList)
 */
export function generateCategoryJsonLd(categoryName: string, categorySlug: string) {
  const categoryUrl = `${BRAND_CONFIG.domain}/${categorySlug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BRAND_CONFIG.domain,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryName,
        item: categoryUrl,
      },
    ],
  };
}
