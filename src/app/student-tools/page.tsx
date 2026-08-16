import React from 'react';
import { CategoryPageTemplate } from '@/components/layout/CategoryPageTemplate';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Student Calculators — Percentage, CGPA, Attendance',
  description: 'Handy tools for students and academe. Calculate grade percentages, CGPA conversions, and target class attendance.',
  canonicalUrl: 'https://dailyutilityhub.com/student-tools',
});

export default function StudentToolsPage() {
  return <CategoryPageTemplate categoryId="student" />;
}
