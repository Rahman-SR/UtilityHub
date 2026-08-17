export interface PersonalInfo {
  name: string;
  position: string;
  address: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
}

export type SectionType =
  | 'summary'
  | 'skills'
  | 'experience'
  | 'education'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'custom';

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  details: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  link: string;
  technologies: string;
  bullets: string[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: string;
}

export interface CustomSectionData {
  title: string;
  bullets: string[];
  content?: string;
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  order: number;
  data: any;
}

export interface ResumeData {
  personal: PersonalInfo;
  sections: ResumeSection[];
}
