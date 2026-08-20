import React from 'react';
import { CategoryPageTemplate } from '@/components/layout/CategoryPageTemplate';
import { constructMetadata } from '@/lib/seo';
import { BRAND_CONFIG } from '@/config/brand';

export const metadata = constructMetadata({
  title: 'Student Calculators — Percentage, CGPA, Attendance',
  description: 'Handy tools for students and academe. Calculate grade percentages, CGPA conversions, and target class attendance.',
  canonicalUrl: `${BRAND_CONFIG.domain}/student-tools`,
});

export default function StudentToolsPage() {
  return <CategoryPageTemplate categoryId="student" />;
}
