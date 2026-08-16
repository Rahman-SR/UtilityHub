import React from 'react';
import { CategoryPageTemplate } from '@/components/layout/CategoryPageTemplate';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Financial & Business Calculators — GST, EMI, SIP',
  description: 'Accurate instant financial calculators. Compute GST inclusive/exclusive rates, loan EMI payments, and investment SIP projections.',
  canonicalUrl: 'https://dailyutilityhub.com/calculators',
});

export default function FinanceCalculatorsPage() {
  return <CategoryPageTemplate categoryId="finance" />;
}
