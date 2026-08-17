'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { CalendarCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { calculateAttendance } from '@/lib/calculators/attendance';
import { formatPercent } from '@/lib/calculators/formatters';
import { CalculatorShell } from '../calculators/CalculatorShell';
import { CalculatorInput } from '../calculators/CalculatorInput';
import { NumberInput } from '../calculators/NumberInput';
import { ResultPanel } from '../calculators/ResultPanel';
import { ResultMetric } from '../calculators/ResultMetric';
import { ValidationMessage } from '../calculators/ValidationMessage';

export function AttendanceCalculatorWorkspace({ tool }: { tool: ToolMetadata }) {
  const [held, setHeld] = useState<number>(40);
  const [attended, setAttended] = useState<number>(28);
  const [targetPercentage, setTargetPercentage] = useState<number>(75);

  const attResult = calculateAttendance({ held, attended, targetPercentage });

  const handleReset = () => {
    setHeld(40);
    setAttended(28);
    setTargetPercentage(75);
  };

  const copyText = attResult.isValid
    ? `Attendance Summary:\nCurrent Attendance: ${formatPercent(attResult.currentPercentage)}\nTarget: ${attResult.targetPercentage}%\nRecommendation: ${attResult.recommendationMessage}`
    : '';

  return (
    <CalculatorShell
      title={tool.name}
      subtitle="Class Attendance Percentage & Bunk Planner"
      icon={CalendarCheck}
      iconColor="bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
      onReset={handleReset}
      copySummaryText={copyText}
      inputs={
        <>
          {/* Total Classes Conducted */}
          <CalculatorInput label="Total Classes Conducted / Held" helperText="Total number of lectures held so far">
            <NumberInput value={held} onChange={setHeld} placeholder="e.g. 40" min={1} />
          </CalculatorInput>

          {/* Attended Classes */}
          <CalculatorInput label="Classes Attended" helperText="Number of lectures you actually attended">
            <NumberInput value={attended} onChange={setAttended} placeholder="e.g. 28" min={0} />
          </CalculatorInput>

          {/* Target Percentage */}
          <CalculatorInput label="Target Attendance Goal (%)" helperText="Required minimum attendance percentage (e.g. 75%)">
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2">
                {[65, 75, 80, 85].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setTargetPercentage(pct)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      targetPercentage === pct
                        ? 'bg-blue-600 dark:bg-indigo-600 text-white border-blue-600 dark:border-indigo-600 shadow-md'
                        : 'bg-white dark:bg-[#121829] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <NumberInput
                value={targetPercentage}
                onChange={setTargetPercentage}
                suffix="%"
                placeholder="e.g. 75"
                min={1}
                max={100}
              />
            </div>
          </CalculatorInput>

          <ValidationMessage message={attResult.error} />
        </>
      }
      results={
        <ResultPanel note="Real-time attendance planning engine. Calculations assume future classes are attended or skipped consecutively.">
          <ResultMetric
            title="Current Attendance Percentage"
            value={formatPercent(attResult.currentPercentage)}
            subtitle={`${attended} attended out of ${held} held`}
            variant={attResult.currentPercentage >= attResult.targetPercentage ? 'primary' : 'accent'}
          />

          {/* Action Recommendation Banner */}
          {attResult.isValid && (
            <div
              className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs font-bold ${
                attResult.status === 'above_target'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}
            >
              {attResult.status === 'above_target' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="block font-black uppercase text-[11px] tracking-wider">
                  {attResult.status === 'above_target' ? 'Target Achieved!' : 'Attendance Shortfall Alert'}
                </span>
                <p className="leading-relaxed font-semibold">{attResult.recommendationMessage}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <ResultMetric
              title="Target Goal"
              value={`${attResult.targetPercentage}%`}
              variant="neutral"
            />
            <ResultMetric
              title={attResult.status === 'above_target' ? 'Safe Bunks Allowed' : 'Required Classes'}
              value={
                attResult.status === 'above_target'
                  ? `${attResult.classesCanBunk} class${attResult.classesCanBunk !== 1 ? 'es' : ''}`
                  : `${attResult.classesToAttend} class${attResult.classesToAttend !== 1 ? 'es' : ''}`
              }
              variant={attResult.status === 'above_target' ? 'success' : 'neutral'}
            />
          </div>
        </ResultPanel>
      }
    />
  );
}
