import React from 'react';
import {
  Images,
  Scaling,
  RefreshCw,
  FileImage,
  Files,
  Scissors,
  FilePlus,
  FileArchive,
  Receipt,
  Calculator,
  TrendingUp,
  Percent,
  GraduationCap,
  CalendarCheck,
  Cake,
  QrCode,
  Wrench,
  Image as ImageIcon,
  FileText,
  Zap,
  LucideIcon,
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  Images,
  Scaling,
  RefreshCw,
  FileImage,
  Files,
  Scissors,
  FilePlus,
  FileArchive,
  Receipt,
  Calculator,
  TrendingUp,
  Percent,
  GraduationCap,
  CalendarCheck,
  Cake,
  QrCode,
  Wrench,
  Image: ImageIcon,
  FileText,
  Zap,
};

export type CategoryId = 'image' | 'pdf' | 'finance' | 'student' | 'quick';
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

export const CATEGORY_STYLE_MAP: Record<
  CategoryId,
  { container: string; icon: string; border: string }
> = {
  image: {
    container: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
    icon: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-100 dark:border-blue-900/60',
  },
  pdf: {
    container: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
    icon: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-100 dark:border-rose-900/60',
  },
  finance: {
    container: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
    icon: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-100 dark:border-emerald-900/60',
  },
  student: {
    container: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
    icon: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-100 dark:border-purple-900/60',
  },
  quick: {
    container: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
    icon: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-100 dark:border-amber-900/60',
  },
};

const SIZE_MAP: Record<IconSize, { box: string; icon: string }> = {
  sm: { box: 'w-8 h-8 rounded-xl', icon: 'w-4 h-4' },
  md: { box: 'w-11 h-11 rounded-2xl', icon: 'w-5 h-5' },
  lg: { box: 'w-12 h-12 rounded-2xl', icon: 'w-6 h-6' },
  xl: { box: 'w-16 h-16 rounded-3xl', icon: 'w-8 h-8' },
};

export interface CategoryIconContainerProps {
  category?: CategoryId | string;
  icon: string | LucideIcon;
  size?: IconSize;
  className?: string;
  strokeWidth?: number;
}

export function CategoryIconContainer({
  category = 'image',
  icon,
  size = 'md',
  className = '',
  strokeWidth = 1.75,
}: CategoryIconContainerProps) {
  const catKey = (category in CATEGORY_STYLE_MAP ? category : 'image') as CategoryId;
  const style = CATEGORY_STYLE_MAP[catKey];
  const sizeConfig = SIZE_MAP[size];

  const IconComponent =
    typeof icon === 'string' ? ICON_MAP[icon] || Wrench : icon;

  return (
    <div
      className={`${sizeConfig.box} ${style.container} ${style.border} border flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 ${className}`}
    >
      <IconComponent className={`${sizeConfig.icon} ${style.icon}`} strokeWidth={strokeWidth} />
    </div>
  );
}
