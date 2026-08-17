'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { calculateCGPA, CgpaMode, SubjectGrade } from '@/lib/calculators/cgpa';
import { formatPercent } from '@/lib/calculators/formatters';
import { CalculatorShell } from '../calculators/CalculatorShell';
import { NumberInput } from '../calculators/NumberInput';
import { ResultPanel } from '../calculators/ResultPanel';
import { ResultMetric } from '../calculators/ResultMetric';
import { ValidationMessage } from '../calculators/ValidationMessage';
import { Button } from '../ui/Button';

export function CgpaCalculatorWorkspace({ tool }: { tool: ToolMetadata }) {
  const [mode, setMode] = useState<CgpaMode>('simple');
  const [subjects, setSubjects] = useState<SubjectGrade[]>([
    { id: '1', name: 'Subject 1', gradePoint: 9, credits: 4 },
    { id: '2', name: 'Subject 2', gradePoint: 8, credits: 3 },
    { id: '3', name: 'Subject 3', gradePoint: 10, credits: 4 },
  ]);

  const cgpaResult = calculateCGPA({ mode, subjects });

  const handleAddSubject = () => {
    const newId = String(Date.now());
    setSubjects([
      ...subjects,
      { id: newId, name: `Subject ${subjects.length + 1}`, gradePoint: 8, credits: 3 },
    ]);
  };

  const handleRemoveSubject = (id: string) => {
    if (subjects.length <= 1) return;
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const handleUpdateSubject = (id: string, field: 'gradePoint' | 'credits' | 'name', value: any) => {
    setSubjects(
      subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleReset = () => {
    setMode('simple');
    setSubjects([
      { id: '1', name: 'Subject 1', gradePoint: 9, credits: 4 },
      { id: '2', name: 'Subject 2', gradePoint: 8, credits: 3 },
      { id: '3', name: 'Subject 3', gradePoint: 10, credits: 4 },
    ]);
  };

  const copyText = cgpaResult.isValid
    ? `CGPA Summary:\nCGPA: ${cgpaResult.cgpa} / 10\nEquivalent Percentage: ${formatPercent(cgpaResult.equivalentPercentage)}\nTotal Subjects: ${cgpaResult.subjectCount}`
    : '';

  return (
    <CalculatorShell
      title={tool.name}
      subtitle="Cumulative Grade Point Average & Percentage Converter"
      icon={GraduationCap}
      iconColor="bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
      onReset={handleReset}
      copySummaryText={copyText}
      inputs={
        <>
          {/* Mode Switcher */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              CGPA Calculation Mode
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
              <button
                type="button"
                onClick={() => setMode('simple')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  mode === 'simple'
                    ? 'bg-blue-600 dark:bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Simple Average
              </button>
              <button
                type="button"
                onClick={() => setMode('weighted')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  mode === 'weighted'
                    ? 'bg-blue-600 dark:bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Credit-Weighted
              </button>
            </div>
          </div>

          {/* Dynamic Subject List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Subjects ({subjects.length})
              </label>
              <Button variant="ghost" size="sm" onClick={handleAddSubject} className="cursor-pointer text-xs font-bold">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Subject
              </Button>
            </div>

            <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
              {subjects.map((sub, index) => (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        Grade Point (0-10)
                      </span>
                      <NumberInput
                        value={sub.gradePoint}
                        onChange={(val) => handleUpdateSubject(sub.id, 'gradePoint', val)}
                        min={0}
                        max={10}
                        step="0.1"
                        placeholder="Grade 0-10"
                      />
                    </div>

                    {mode === 'weighted' && (
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Credits
                        </span>
                        <NumberInput
                          value={sub.credits || 1}
                          onChange={(val) => handleUpdateSubject(sub.id, 'credits', val)}
                          min={1}
                          max={20}
                          placeholder="Credits"
                        />
                      </div>
                    )}
                  </div>

                  {subjects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(sub.id)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-colors cursor-pointer"
                      aria-label="Remove subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <ValidationMessage message={cgpaResult.error} />
        </>
      }
      results={
        <ResultPanel note="Note: CGPA calculation methods and percentage conversion formulas (e.g. CGPA x 9.5) may vary by institution. Please verify with your university board guidelines.">
          <ResultMetric
            title="Calculated CGPA"
            value={`${cgpaResult.cgpa} / 10`}
            subtitle={`Based on ${cgpaResult.subjectCount} subject${cgpaResult.subjectCount > 1 ? 's' : ''}`}
            variant="primary"
          />

          <div className="grid grid-cols-2 gap-3">
            <ResultMetric
              title="Equivalent Percentage"
              value={formatPercent(cgpaResult.equivalentPercentage)}
              subtitle="CBSE Formula (CGPA × 9.5)"
              variant="success"
            />
            <ResultMetric
              title={mode === 'weighted' ? 'Total Credits' : 'Total Grade Points'}
              value={String(mode === 'weighted' ? cgpaResult.totalCredits : cgpaResult.totalGradePoints)}
              variant="neutral"
            />
          </div>
        </ResultPanel>
      }
    />
  );
}
