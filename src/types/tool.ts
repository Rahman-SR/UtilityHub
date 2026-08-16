import { CategoryId } from './category';

export type ToolFamily = 'file' | 'calculator' | 'generator';

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolStep {
  title: string;
  description: string;
}

export interface ToolMetadata {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  category: CategoryId;
  family: ToolFamily;
  icon: string;
  keywords: string[];
  featured?: boolean;
  popular?: boolean;
  localProcessing: boolean;
  acceptedFileTypes?: string[];
  maxFileSizeMB?: number;
  howToSteps?: ToolStep[];
  faqs?: ToolFAQ[];
  relatedToolIds?: string[];
}
