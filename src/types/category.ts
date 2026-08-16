export type CategoryId = 'image' | 'pdf' | 'finance' | 'student' | 'quick';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  toolCount?: number;
}
