import { ResumeData } from '@/types/resume';

const RESUME_STORAGE_KEY = 'yoursthing_resume_draft_v1';
const LEGACY_STORAGE_KEY = 'daily_utility_hub_resume_draft_v1';

export const INITIAL_RESUME_DATA: ResumeData = {
  personal: {
    name: '',
    position: '',
    address: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
  },
  sections: [
    {
      id: 'summary',
      type: 'summary',
      title: 'Professional Summary',
      visible: true,
      order: 0,
      data: { text: '' },
    },
    {
      id: 'skills',
      type: 'skills',
      title: 'Skills',
      visible: true,
      order: 1,
      data: { skills: [] },
    },
    {
      id: 'experience',
      type: 'experience',
      title: 'Work Experience',
      visible: true,
      order: 2,
      data: { entries: [] },
    },
    {
      id: 'education',
      type: 'education',
      title: 'Education',
      visible: true,
      order: 3,
      data: { entries: [] },
    },
    {
      id: 'projects',
      type: 'projects',
      title: 'Projects',
      visible: true,
      order: 4,
      data: { entries: [] },
    },
    {
      id: 'certifications',
      type: 'certifications',
      title: 'Certifications',
      visible: true,
      order: 5,
      data: { entries: [] },
    },
    {
      id: 'languages',
      type: 'languages',
      title: 'Languages',
      visible: true,
      order: 6,
      data: { entries: [] },
    },
    {
      id: 'custom',
      type: 'custom',
      title: 'Additional Information',
      visible: true,
      order: 7,
      data: { content: '' },
    },
  ],
};

export function loadResumeDraft(): ResumeData {
  if (typeof window === 'undefined') return INITIAL_RESUME_DATA;
  try {
    const raw = localStorage.getItem(RESUME_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return INITIAL_RESUME_DATA;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.personal && Array.isArray(parsed.sections)) {
      // Ensure all standard sections exist even in older saved drafts
      const existingIds = new Set(parsed.sections.map((s: { id: string }) => s.id));
      const mergedSections = [...parsed.sections];
      
      INITIAL_RESUME_DATA.sections.forEach((initialSec) => {
        if (!existingIds.has(initialSec.id)) {
          mergedSections.push({ ...initialSec, order: mergedSections.length });
        }
      });

      return {
        ...parsed,
        sections: mergedSections,
      };
    }
  } catch {
    // Return default fallback safely
  }
  return INITIAL_RESUME_DATA;
}

export function saveResumeDraft(data: ResumeData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function clearResumeDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RESUME_STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Ignore
  }
}
