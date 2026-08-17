'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ToolMetadata } from '@/types/tool';
import {
  ResumeData,
  ResumeSection,
  ExperienceEntry,
  EducationEntry,
  ProjectEntry,
  CertificationEntry,
  LanguageEntry,
} from '@/types/resume';
import {
  loadResumeDraft,
  saveResumeDraft,
  INITIAL_RESUME_DATA,
} from '@/lib/resume-storage';
import { downloadResumePdf, printResume } from '@/lib/resume-pdf';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  Download,
  Printer,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ShieldCheck,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export function ResumeBuilderWorkspace({ tool: _ }: { tool?: ToolMetadata }) {
  const [data, setData] = useState<ResumeData>(() => loadResumeDraft());
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Accordion toggle states for editor sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    summary: true,
    skills: true,
    experience: true,
    education: true,
    projects: false,
    certifications: false,
    languages: false,
    custom: false,
  });

  const previewRef = useRef<HTMLDivElement>(null);

  // Autosave draft on data change
  useEffect(() => {
    saveResumeDraft(data);
  }, [data]);

  const toggleAccordion = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Update personal details
  const handlePersonalChange = (field: keyof ResumeData['personal'], value: string) => {
    setData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  };

  // Section Reordering
  const moveSection = (id: string, direction: 'up' | 'down') => {
    setData((prev) => {
      const sorted = [...prev.sections].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((s) => s.id === id);
      if (index === -1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= sorted.length) return prev;

      const temp = sorted[index].order;
      sorted[index].order = sorted[targetIndex].order;
      sorted[targetIndex].order = temp;

      return {
        ...prev,
        sections: sorted.sort((a, b) => a.order - b.order),
      };
    });
  };

  // Toggle Visibility
  const toggleVisibility = (id: string) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)),
    }));
  };

  // Reset Resume
  const handleReset = () => {
    setData(INITIAL_RESUME_DATA);
    setShowResetConfirm(false);
  };

  // Helper: Get sorted sections
  const sortedSections = [...data.sections].sort((a, b) => a.order - b.order);

  // Check if section has non-empty content for ATS output
  const hasContent = (section: ResumeSection): boolean => {
    if (!section.visible) return false;
    switch (section.type) {
      case 'summary':
        return !!section.data.text && section.data.text.trim().length > 0;
      case 'skills':
        return Array.isArray(section.data.skills) && section.data.skills.length > 0;
      case 'experience':
        return (
          Array.isArray(section.data.entries) &&
          section.data.entries.some(
            (e: ExperienceEntry) => e.title || e.company || e.bullets.some((b) => b.trim())
          )
        );
      case 'education':
        return (
          Array.isArray(section.data.entries) &&
          section.data.entries.some((e: EducationEntry) => e.degree || e.institution)
        );
      case 'projects':
        return (
          Array.isArray(section.data.entries) &&
          section.data.entries.some((p: ProjectEntry) => p.title || p.link)
        );
      case 'certifications':
        return (
          Array.isArray(section.data.entries) &&
          section.data.entries.some((c: CertificationEntry) => c.name)
        );
      case 'languages':
        return (
          Array.isArray(section.data.entries) &&
          section.data.entries.some((l: LanguageEntry) => l.language)
        );
      case 'custom':
        return (
          (section.data.bullets && section.data.bullets.some((b: string) => b.trim())) ||
          (section.data.content && section.data.content.trim().length > 0)
        );
      default:
        return false;
    }
  };

  const visibleSectionsWithContent = sortedSections.filter(hasContent);

  return (
    <div className="w-full space-y-6">
      {/* Mobile-Only Segmented Control ([ EDIT FORM ] [ LIVE PREVIEW ]) */}
      <div className="lg:hidden flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
        <button
          type="button"
          onClick={() => setMobileTab('edit')}
          className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-colors ${
            mobileTab === 'edit'
              ? 'bg-white dark:bg-[#121829] text-blue-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Edit Form
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-colors ${
            mobileTab === 'preview'
              ? 'bg-white dark:bg-[#121829] text-blue-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* PERMANENT TWO-COLUMN DESKTOP WORKSPACE (lg:grid lg:grid-cols-12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT COLUMN: RESUME FORM EDITOR (lg:col-span-6) */}
        <div className={`lg:col-span-6 space-y-6 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          
          {/* Top Status & Reset Toolbar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" strokeWidth={2} />
              <span>Saved locally in browser</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResetConfirm(true)}
              className="text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.75} />
              <span>Reset Resume</span>
            </Button>
          </div>

          {/* Section Order & Visibility Manager Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Section Ordering & Visibility
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">
                Use ↑ ↓ to reorder
              </span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {sortedSections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs font-bold"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] flex items-center justify-center font-black">
                      {idx + 1}
                    </span>
                    <span className={`truncate ${!sec.visible ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'}`}>
                      {sec.title}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveSection(sec.id, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(sec.id, 'down')}
                      disabled={idx === sortedSections.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleVisibility(sec.id)}
                      className={`p-1 transition-colors cursor-pointer ${
                        sec.visible ? 'text-blue-600 dark:text-indigo-400' : 'text-slate-400'
                      }`}
                      title={sec.visible ? 'Hide Section' : 'Show Section'}
                    >
                      {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 1. PERSONAL INFORMATION CARD */}
          <div className="rounded-3xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('personal')}
              className="w-full p-4 sm:p-5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 cursor-pointer text-left"
            >
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-600" strokeWidth={2} />
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Personal Information
                </h3>
              </div>
              {openSections.personal ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.personal && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="e.g. John Smith"
                    value={data.personal.name}
                    onChange={(e) => handlePersonalChange('name', e.target.value)}
                  />
                  <Input
                    label="Target Job Title"
                    placeholder="e.g. IT Support Specialist"
                    value={data.personal.position}
                    onChange={(e) => handlePersonalChange('position', e.target.value)}
                  />
                  <Input
                    label="Location / Address"
                    placeholder="e.g. New York, USA"
                    value={data.personal.address}
                    onChange={(e) => handlePersonalChange('address', e.target.value)}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="e.g. +1 555 123 4567"
                    value={data.personal.phone}
                    onChange={(e) => handlePersonalChange('phone', e.target.value)}
                  />
                  <Input
                    label="Email Address"
                    placeholder="e.g. john@example.com"
                    value={data.personal.email}
                    onChange={(e) => handlePersonalChange('email', e.target.value)}
                  />
                  <Input
                    label="LinkedIn Profile URL"
                    placeholder="linkedin.com/in/johnsmith"
                    value={data.personal.linkedin}
                    onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                  />
                  <Input
                    label="GitHub / Portfolio URL"
                    placeholder="github.com/johnsmith"
                    value={data.personal.github}
                    onChange={(e) => handlePersonalChange('github', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. PROFESSIONAL SUMMARY CARD */}
          <div className="rounded-3xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('summary')}
              className="w-full p-4 sm:p-5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 cursor-pointer text-left"
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" strokeWidth={2} />
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Professional Summary
                </h3>
              </div>
              {openSections.summary ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.summary && (
              <div className="p-4 sm:p-6 space-y-2">
                <textarea
                  rows={4}
                  placeholder="Detail your professional background, technical core competencies, and career goals..."
                  value={data.sections.find((s) => s.id === 'summary')?.data.text || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setData((prev) => ({
                      ...prev,
                      sections: prev.sections.map((s) =>
                        s.id === 'summary' ? { ...s, data: { text: val } } : s
                      ),
                    }));
                  }}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-right text-[11px] font-bold text-slate-400">
                  {(data.sections.find((s) => s.id === 'summary')?.data.text || '').length} characters
                </div>
              </div>
            )}
          </div>

          {/* 3. SKILLS CARD */}
          <div className="rounded-3xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('skills')}
              className="w-full p-4 sm:p-5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 cursor-pointer text-left"
            >
              <div className="flex items-center space-x-2">
                <Wrench className="w-4 h-4 text-blue-600" strokeWidth={2} />
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Skills
                </h3>
              </div>
              {openSections.skills ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.skills && (
              <div className="p-4 sm:p-6 space-y-4">
                <Input
                  label="Add Skill (Type & Press Enter)"
                  placeholder="e.g. IT Support, Windows Server, Networking, Troubleshooting"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val) {
                        setData((prev) => ({
                          ...prev,
                          sections: prev.sections.map((s) =>
                            s.id === 'skills'
                              ? { ...s, data: { skills: [...(s.data.skills || []), val] } }
                              : s
                          ),
                        }));
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />

                <div className="flex flex-wrap gap-2 pt-1">
                  {(data.sections.find((s) => s.id === 'skills')?.data.skills || []).map(
                    (sk: string, sIdx: number) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 text-xs font-bold border border-blue-200 dark:border-blue-800"
                      >
                        <span>{sk}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s) =>
                                s.id === 'skills'
                                  ? {
                                      ...s,
                                      data: {
                                        skills: (s.data as { skills: string[] }).skills.filter((_: string, i: number) => i !== sIdx),
                                      },
                                    }
                                  : s
                              ),
                            }));
                          }}
                          className="hover:text-rose-600 cursor-pointer ml-1 font-extrabold"
                        >
                          ×
                        </button>
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 4. WORK EXPERIENCE CARD */}
          <div className="rounded-3xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('experience')}
              className="w-full p-4 sm:p-5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 cursor-pointer text-left"
            >
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-blue-600" strokeWidth={2} />
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Work Experience
                </h3>
              </div>
              {openSections.experience ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.experience && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newEntry: ExperienceEntry = {
                        id: String(Date.now()),
                        title: '',
                        company: '',
                        location: '',
                        startDate: '',
                        endDate: '',
                        current: false,
                        bullets: [''],
                      };
                      setData((prev) => ({
                        ...prev,
                        sections: prev.sections.map((s) =>
                          s.id === 'experience'
                            ? { ...s, data: { entries: [...(s.data.entries || []), newEntry] } }
                            : s
                        ),
                      }));
                    }}
                    className="cursor-pointer text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" strokeWidth={2} />
                    <span>Add Position</span>
                  </Button>
                </div>

                {(data.sections.find((s) => s.id === 'experience')?.data.entries || []).map(
                  (exp: ExperienceEntry, eIdx: number) => (
                    <div
                      key={exp.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                        <span className="text-xs font-black uppercase text-blue-600">
                          Role #{eIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s) =>
                                s.id === 'experience'
                                  ? {
                                      ...s,
                                      data: {
                                        entries: s.data.entries.filter((e: ExperienceEntry) => e.id !== exp.id),
                                      },
                                    }
                                  : s
                              ),
                            }));
                          }}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          label="Job Title"
                          placeholder="e.g. IT Support Specialist"
                          value={exp.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s) =>
                                s.id === 'experience'
                                  ? {
                                      ...s,
                                      data: {
                                        entries: s.data.entries.map((item: ExperienceEntry) =>
                                          item.id === exp.id ? { ...item, title: val } : item
                                        ),
                                      },
                                    }
                                  : s
                              ),
                            }));
                          }}
                        />
                        <Input
                          label="Company Name"
                          placeholder="e.g. Tech Solutions Inc."
                          value={exp.company}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s) =>
                                s.id === 'experience'
                                  ? {
                                      ...s,
                                      data: {
                                        entries: s.data.entries.map((item: ExperienceEntry) =>
                                          item.id === exp.id ? { ...item, company: val } : item
                                        ),
                                      },
                                    }
                                  : s
                              ),
                            }));
                          }}
                        />
                        <Input
                          label="Location"
                          placeholder="e.g. New York, NY"
                          value={exp.location}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s) =>
                                s.id === 'experience'
                                  ? {
                                      ...s,
                                      data: {
                                        entries: s.data.entries.map((item: ExperienceEntry) =>
                                          item.id === exp.id ? { ...item, location: val } : item
                                        ),
                                      },
                                    }
                                  : s
                              ),
                            }));
                          }}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            label="Start Date"
                            placeholder="e.g. Jan 2022"
                            value={exp.startDate}
                            onChange={(e) => {
                              const val = e.target.value;
                              setData((prev) => ({
                                ...prev,
                                sections: prev.sections.map((s) =>
                                  s.id === 'experience'
                                    ? {
                                        ...s,
                                        data: {
                                          entries: s.data.entries.map((item: ExperienceEntry) =>
                                            item.id === exp.id ? { ...item, startDate: val } : item
                                          ),
                                        },
                                      }
                                    : s
                                ),
                              }));
                            }}
                          />
                          <Input
                            label="End Date"
                            placeholder="e.g. Present"
                            value={exp.endDate}
                            onChange={(e) => {
                              const val = e.target.value;
                              setData((prev) => ({
                                ...prev,
                                sections: prev.sections.map((s) =>
                                  s.id === 'experience'
                                    ? {
                                        ...s,
                                        data: {
                                          entries: s.data.entries.map((item: ExperienceEntry) =>
                                            item.id === exp.id ? { ...item, endDate: val } : item
                                          ),
                                        },
                                      }
                                    : s
                                ),
                              }));
                            }}
                          />
                        </div>
                      </div>

                      {/* Bullets List */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Bullets / Key Responsibilities
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setData((prev) => ({
                                ...prev,
                                sections: prev.sections.map((s) =>
                                  s.id === 'experience'
                                    ? {
                                        ...s,
                                        data: {
                                          entries: s.data.entries.map((item: ExperienceEntry) =>
                                            item.id === exp.id
                                              ? { ...item, bullets: [...item.bullets, ''] }
                                              : item
                                          ),
                                        },
                                      }
                                    : s
                                ),
                              }));
                            }}
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                          >
                            + Add Bullet
                          </button>
                        </div>

                        {exp.bullets.map((bText, bIdx) => (
                          <div key={bIdx} className="flex items-center space-x-2">
                            <input
                              type="text"
                              placeholder="e.g. Resolved 50+ technical tickets weekly."
                              value={bText}
                              onChange={(e) => {
                                const val = e.target.value;
                                setData((prev) => ({
                                  ...prev,
                                  sections: prev.sections.map((s) =>
                                    s.id === 'experience'
                                      ? {
                                          ...s,
                                          data: {
                                            entries: s.data.entries.map((item: ExperienceEntry) => {
                                              if (item.id !== exp.id) return item;
                                              const newB = [...item.bullets];
                                              newB[bIdx] = val;
                                              return { ...item, bullets: newB };
                                            }),
                                          },
                                        }
                                      : s
                                  ),
                                }));
                              }}
                              className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setData((prev) => ({
                                  ...prev,
                                  sections: prev.sections.map((s) =>
                                    s.id === 'experience'
                                      ? {
                                          ...s,
                                          data: {
                                            entries: s.data.entries.map((item: ExperienceEntry) => {
                                              if (item.id !== exp.id) return item;
                                              return {
                                                ...item,
                                                bullets: item.bullets.filter((_, i) => i !== bIdx),
                                              };
                                            }),
                                          },
                                        }
                                      : s
                                  ),
                                }));
                              }}
                              className="text-slate-400 hover:text-rose-600 cursor-pointer font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* 5. EDUCATION CARD */}
          <div className="rounded-3xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('education')}
              className="w-full p-4 sm:p-5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 cursor-pointer text-left"
            >
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-blue-600" strokeWidth={2} />
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Education
                </h3>
              </div>
              {openSections.education ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.education && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newEdu: EducationEntry = {
                        id: String(Date.now()),
                        degree: '',
                        institution: '',
                        location: '',
                        startDate: '',
                        endDate: '',
                        details: '',
                      };
                      setData((prev) => ({
                        ...prev,
                        sections: prev.sections.map((s) =>
                          s.id === 'education'
                            ? { ...s, data: { entries: [...(s.data.entries || []), newEdu] } }
                            : s
                        ),
                      }));
                    }}
                    className="cursor-pointer text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" strokeWidth={2} />
                    <span>Add Degree</span>
                  </Button>
                </div>

                {(data.sections.find((s) => s.id === 'education')?.data.entries || []).map(
                  (edu: EducationEntry, eIdx: number) => (
                    <div
                      key={edu.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                        <span className="text-xs font-black uppercase text-blue-600">
                          Education #{eIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s) =>
                                s.id === 'education'
                                  ? {
                                      ...s,
                                      data: {
                                        entries: s.data.entries.filter((e: EducationEntry) => e.id !== edu.id),
                                      },
                                    }
                                  : s
                              ),
                            }));
                          }}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          label="Degree / Major"
                          placeholder="e.g. B.S. in Computer Science"
                          value={edu.degree}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s) =>
                                s.id === 'education'
                                  ? {
                                      ...s,
                                      data: {
                                        entries: s.data.entries.map((item: EducationEntry) =>
                                          item.id === edu.id ? { ...item, degree: val } : item
                                        ),
                                      },
                                    }
                                  : s
                              ),
                            }));
                          }}
                        />
                        <Input
                          label="Institution / University"
                          placeholder="e.g. State University"
                          value={edu.institution}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s) =>
                                s.id === 'education'
                                  ? {
                                      ...s,
                                      data: {
                                        entries: s.data.entries.map((item: EducationEntry) =>
                                          item.id === edu.id ? { ...item, institution: val } : item
                                        ),
                                      },
                                    }
                                  : s
                              ),
                            }));
                          }}
                        />
                        <Input
                          label="Graduation Year / Dates"
                          placeholder="e.g. 2019 - 2023"
                          value={edu.endDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s) =>
                                s.id === 'education'
                                  ? {
                                      ...s,
                                      data: {
                                        entries: s.data.entries.map((item: EducationEntry) =>
                                          item.id === edu.id ? { ...item, endDate: val } : item
                                        ),
                                      },
                                    }
                                  : s
                              ),
                            }));
                          }}
                        />
                        <Input
                          label="GPA / Details"
                          placeholder="e.g. GPA: 3.8 / 4.0"
                          value={edu.details}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s) =>
                                s.id === 'education'
                                  ? {
                                      ...s,
                                      data: {
                                        entries: s.data.entries.map((item: EducationEntry) =>
                                          item.id === edu.id ? { ...item, details: val } : item
                                        ),
                                      },
                                    }
                                  : s
                              ),
                            }));
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* 6. PROJECTS CARD */}
          <div className="rounded-3xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('projects')}
              className="w-full p-4 sm:p-5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 cursor-pointer text-left"
            >
              <div className="flex items-center space-x-2">
                <FolderGit2 className="w-4 h-4 text-blue-600" strokeWidth={2} />
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Projects (Optional)
                </h3>
              </div>
              {openSections.projects ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.projects && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newProj: ProjectEntry = {
                        id: String(Date.now()),
                        title: '',
                        link: '',
                        technologies: '',
                        bullets: [''],
                      };
                      setData((prev) => ({
                        ...prev,
                        sections: prev.sections.map((s) =>
                          s.id === 'projects'
                            ? { ...s, data: { entries: [...(s.data.entries || []), newProj] } }
                            : s
                        ),
                      }));
                    }}
                    className="cursor-pointer text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" strokeWidth={2} />
                    <span>Add Project</span>
                  </Button>
                </div>

                {(data.sections.find((s) => s.id === 'projects')?.data.entries || []).map(
                  (proj: ProjectEntry, pIdx: number) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                        <span className="text-xs font-black uppercase text-blue-600">
                          Project #{pIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s) =>
                                s.id === 'projects'
                                  ? {
                                      ...s,
                                      data: {
                                        entries: s.data.entries.filter((p: ProjectEntry) => p.id !== proj.id),
                                      },
                                    }
                                  : s
                              ),
                            }));
                          }}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          label="Project Name"
                          placeholder="e.g. E-Commerce Web Platform"
                          value={proj.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s) =>
                                s.id === 'projects'
                                  ? {
                                      ...s,
                                      data: {
                                        entries: s.data.entries.map((item: ProjectEntry) =>
                                          item.id === proj.id ? { ...item, title: val } : item
                                        ),
                                      },
                                    }
                                  : s
                              ),
                            }));
                          }}
                        />
                        <Input
                          label="Project Link / URL"
                          placeholder="github.com/user/project"
                          value={proj.link}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s) =>
                                s.id === 'projects'
                                  ? {
                                      ...s,
                                      data: {
                                        entries: s.data.entries.map((item: ProjectEntry) =>
                                          item.id === proj.id ? { ...item, link: val } : item
                                        ),
                                      },
                                    }
                                  : s
                              ),
                            }));
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* 7. CERTIFICATIONS CARD */}
          <div className="rounded-3xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('certifications')}
              className="w-full p-4 sm:p-5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 cursor-pointer text-left"
            >
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-blue-600" strokeWidth={2} />
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Certifications (Optional)
                </h3>
              </div>
              {openSections.certifications ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.certifications && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newCert: CertificationEntry = {
                        id: String(Date.now()),
                        name: '',
                        issuer: '',
                        date: '',
                        link: '',
                      };
                      setData((prev) => ({
                        ...prev,
                        sections: prev.sections.map((s) =>
                          s.id === 'certifications'
                            ? { ...s, data: { entries: [...(s.data.entries || []), newCert] } }
                            : s
                        ),
                      }));
                    }}
                    className="cursor-pointer text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" strokeWidth={2} />
                    <span>Add Certification</span>
                  </Button>
                </div>

                {(data.sections.find((s) => s.id === 'certifications')?.data.entries || []).map(
                  (cert: CertificationEntry, cIdx: number) => (
                    <div
                      key={cert.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                        <span className="text-xs font-black uppercase text-blue-600">
                          Certification #{cIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s) =>
                                s.id === 'certifications'
                                  ? {
                                      ...s,
                                      data: {
                                        entries: s.data.entries.filter(
                                          (c: CertificationEntry) => c.id !== cert.id
                                        ),
                                      },
                                    }
                                  : s
                              ),
                            }));
                          }}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          label="Certification Title"
                          placeholder="e.g. AWS Certified Solutions Architect"
                          value={cert.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s) =>
                                s.id === 'certifications'
                                  ? {
                                      ...s,
                                      data: {
                                        entries: s.data.entries.map((item: CertificationEntry) =>
                                          item.id === cert.id ? { ...item, name: val } : item
                                        ),
                                      },
                                    }
                                  : s
                              ),
                            }));
                          }}
                        />
                        <Input
                          label="Issuing Organization"
                          placeholder="e.g. Amazon Web Services"
                          value={cert.issuer}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s) =>
                                s.id === 'certifications'
                                  ? {
                                      ...s,
                                      data: {
                                        entries: s.data.entries.map((item: CertificationEntry) =>
                                          item.id === cert.id ? { ...item, issuer: val } : item
                                        ),
                                      },
                                    }
                                  : s
                              ),
                            }));
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY LIVE ATS A4 RESUME PREVIEW (lg:col-span-6 sticky top-20) */}
        <div
          className={`lg:col-span-6 sticky top-20 ${
            mobileTab === 'edit' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-2xl space-y-4">
            
            {/* Preview Toolbar Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Live ATS Resume Preview
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={printResume}
                  className="cursor-pointer text-xs"
                >
                  <Printer className="w-3.5 h-3.5 mr-1" strokeWidth={1.75} />
                  <span>Print</span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => previewRef.current && downloadResumePdf(previewRef.current, data.personal.name)}
                  className="shadow-md shadow-blue-500/20 cursor-pointer text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1" strokeWidth={2} />
                  <span>Download PDF</span>
                </Button>
              </div>
            </div>

            {/* Real White Paper A4 Sheet Preview Container */}
            <div className="overflow-x-auto bg-slate-200/60 dark:bg-slate-950 p-2 sm:p-4 rounded-xl flex justify-center">
              <div
                ref={previewRef}
                id="resume-preview-container"
                className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 sm:p-10 space-y-5 font-sans leading-relaxed text-[10pt] shadow-2xl rounded-xs border border-slate-300"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                {/* 1. TOP RESUME HEADER */}
                <div className="text-center space-y-1 pb-3 border-b border-slate-900">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                    {data.personal.name || 'YOUR FULL NAME'}
                  </h1>

                  {data.personal.position && (
                    <p className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                      {data.personal.position}
                    </p>
                  )}

                  {/* Contact Information Row */}
                  <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[11px] text-slate-700 font-medium pt-1">
                    {data.personal.address && <span>{data.personal.address}</span>}
                    {data.personal.phone && <span>• {data.personal.phone}</span>}
                    {data.personal.email && (
                      <span>
                        •{' '}
                        <a href={`mailto:${data.personal.email}`} className="text-slate-900 underline font-semibold">
                          {data.personal.email}
                        </a>
                      </span>
                    )}
                    {data.personal.linkedin && (
                      <span>
                        •{' '}
                        <a
                          href={
                            data.personal.linkedin.startsWith('http')
                              ? data.personal.linkedin
                              : `https://${data.personal.linkedin}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-900 underline font-semibold"
                        >
                          {data.personal.linkedin}
                        </a>
                      </span>
                    )}
                    {data.personal.github && (
                      <span>
                        •{' '}
                        <a
                          href={
                            data.personal.github.startsWith('http')
                              ? data.personal.github
                              : `https://${data.personal.github}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-900 underline font-semibold"
                        >
                          {data.personal.github}
                        </a>
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. DYNAMICALLY ORDERED RESUME SECTIONS */}
                {visibleSectionsWithContent.map((section) => (
                  <div key={section.id} className="space-y-1.5">
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-800 pb-0.5">
                      {section.title}
                    </h2>

                    {/* Summary */}
                    {section.type === 'summary' && (
                      <p className="text-[10pt] text-slate-800 leading-relaxed font-normal">
                        {section.data.text}
                      </p>
                    )}

                    {/* Skills */}
                    {section.type === 'skills' && (
                      <p className="text-[10pt] text-slate-800 font-medium leading-relaxed">
                        {section.data.skills.join(' • ')}
                      </p>
                    )}

                    {/* Experience */}
                    {section.type === 'experience' && (
                      <div className="space-y-2.5">
                        {section.data.entries.map((exp: ExperienceEntry) => (
                          <div key={exp.id} className="space-y-0.5">
                            <div className="flex items-center justify-between text-[10pt] font-bold text-slate-900">
                              <span>
                                {exp.title} {exp.company && `| ${exp.company}`}
                              </span>
                              <span className="text-[11px] font-medium text-slate-700">
                                {exp.startDate} {exp.endDate && `- ${exp.endDate}`}
                              </span>
                            </div>
                            {exp.location && (
                              <p className="text-[11px] font-medium text-slate-600 italic">
                                {exp.location}
                              </p>
                            )}

                            {exp.bullets && exp.bullets.filter((b) => b.trim()).length > 0 && (
                              <ul className="list-disc list-inside text-[10pt] text-slate-800 space-y-0.5 pt-0.5">
                                {exp.bullets
                                  .filter((b) => b.trim())
                                  .map((bText, idx) => (
                                    <li key={idx} className="leading-tight">
                                      {bText}
                                    </li>
                                  ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Education */}
                    {section.type === 'education' && (
                      <div className="space-y-1.5">
                        {section.data.entries.map((edu: EducationEntry) => (
                          <div key={edu.id} className="flex items-start justify-between text-[10pt]">
                            <div>
                              <span className="font-bold text-slate-900">{edu.degree}</span>
                              {edu.institution && (
                                <span className="text-slate-800 font-medium"> — {edu.institution}</span>
                              )}
                              {edu.details && (
                                <p className="text-[11px] font-semibold text-slate-600">{edu.details}</p>
                              )}
                            </div>
                            {edu.endDate && (
                              <span className="text-[11px] font-medium text-slate-700 shrink-0">
                                {edu.endDate}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Projects */}
                    {section.type === 'projects' && (
                      <div className="space-y-1.5">
                        {section.data.entries.map((proj: ProjectEntry) => (
                          <div key={proj.id} className="text-[10pt] space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{proj.title}</span>
                              {proj.link && (
                                <a href={proj.link} target="_blank" rel="noreferrer" className="text-slate-900 underline text-[11px]">
                                  {proj.link}
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Certifications */}
                    {section.type === 'certifications' && (
                      <div className="space-y-1 text-[10pt] font-medium">
                        {section.data.entries.map((cert: CertificationEntry) => (
                          <div key={cert.id} className="flex items-center justify-between">
                            <span>
                              <span className="font-bold text-slate-900">{cert.name}</span>
                              {cert.issuer && ` — ${cert.issuer}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full p-6 bg-white dark:bg-[#121829] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
            <h4 className="font-heading font-extrabold text-lg text-slate-900 dark:text-slate-100">
              Reset Resume?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Resetting will clear all entered personal details and custom entries, and restore default sections.
            </p>
            <div className="flex justify-center space-x-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleReset}>
                Yes, Reset All Data
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
