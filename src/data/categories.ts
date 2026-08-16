import { CategoryInfo } from '@/types/category';

export const CATEGORIES: Record<string, CategoryInfo> = {
  image: {
    id: 'image',
    name: 'Image Tools',
    slug: 'image-tools',
    description: 'Compress, resize, convert, and manage your images 100% locally in your browser.',
    icon: 'Image',
    color: 'from-blue-500 to-cyan-500',
  },
  pdf: {
    id: 'pdf',
    name: 'PDF Tools',
    slug: 'pdf-tools',
    description: 'Merge, split, and convert PDF documents securely without cloud upload.',
    icon: 'FileText',
    color: 'from-indigo-500 to-blue-600',
  },
  finance: {
    id: 'finance',
    name: 'Finance Tools',
    slug: 'calculators',
    description: 'Accurate GST, EMI, and SIP financial calculators for quick decision making.',
    icon: 'Calculator',
    color: 'from-emerald-500 to-teal-600',
  },
  student: {
    id: 'student',
    name: 'Student Tools',
    slug: 'student-tools',
    description: 'Percentage, CGPA, and attendance calculators tailored for students and academe.',
    icon: 'GraduationCap',
    color: 'from-amber-500 to-orange-500',
  },
  quick: {
    id: 'quick',
    name: 'Quick Tools',
    slug: 'quick-tools',
    description: 'Everyday utilities including Age Calculator and instant QR Code Generator.',
    icon: 'Zap',
    color: 'from-purple-500 to-pink-500',
  },
};

export const CATEGORY_LIST: CategoryInfo[] = Object.values(CATEGORIES);
