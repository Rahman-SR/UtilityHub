'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { Calendar, Cake, PartyPopper } from 'lucide-react';
import { calculateAge } from '@/lib/calculators/age';
import { formatNumber } from '@/lib/calculators/formatters';
import { CalculatorShell } from '../calculators/CalculatorShell';
import { CalculatorInput } from '../calculators/CalculatorInput';
import { ResultPanel } from '../calculators/ResultPanel';
import { ResultMetric } from '../calculators/ResultMetric';
import { ValidationMessage } from '../calculators/ValidationMessage';

export function AgeCalculatorWorkspace({ tool }: { tool: ToolMetadata }) {
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');
  const [asOfDate, setAsOfDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const ageResult = calculateAge({ birthDate, asOfDate });

  const handleReset = () => {
    setBirthDate('2000-01-01');
    setAsOfDate(new Date().toISOString().split('T')[0]);
  };

  const copyText = ageResult.isValid
    ? `Age Summary:\nExact Age: ${ageResult.years} Years, ${ageResult.months} Months, ${ageResult.days} Days\nTotal Days: ${formatNumber(ageResult.totalDays)} days\nNext Birthday: ${ageResult.nextBirthdayDays} days away (${ageResult.nextBirthdayWeekday})`
    : '';

  return (
    <CalculatorShell
      title={tool.name}
      subtitle="Calendar-Aware Exact Age & Birthday Countdown"
      icon={Cake}
      iconColor="bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400"
      onReset={handleReset}
      copySummaryText={copyText}
      inputs={
        <>
          {/* Birth Date Picker */}
          <CalculatorInput label="Date of Birth" helperText="Select your birth date">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full py-3 px-3.5 text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-500 cursor-pointer"
            />
          </CalculatorInput>

          {/* As of Date Picker */}
          <CalculatorInput label="Calculate Age As Of" helperText="Default is today's date">
            <input
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="w-full py-3 px-3.5 text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-500 cursor-pointer"
            />
          </CalculatorInput>

          <ValidationMessage message={ageResult.error} />
        </>
      }
      results={
        <ResultPanel note="Calendar-aware date algorithm accounts for leap years, variable month lengths (28-31 days), and exact day differences.">
          <ResultMetric
            title="Exact Age"
            value={`${ageResult.years} Years`}
            subtitle={`${ageResult.months} Months, ${ageResult.days} Days`}
            variant="primary"
          />

          {/* Next Birthday Banner */}
          {ageResult.isValid && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 flex items-center space-x-3 text-xs font-bold text-amber-900 dark:text-amber-200">
              {ageResult.nextBirthdayDays === 0 ? (
                <PartyPopper className="w-6 h-6 text-amber-500 shrink-0" strokeWidth={1.75} />
              ) : (
                <Cake className="w-6 h-6 text-amber-500 shrink-0" strokeWidth={1.75} />
              )}
              <div>
                <span className="block font-black uppercase text-[11px] tracking-wider text-amber-600 dark:text-amber-400">
                  Next Birthday Countdown
                </span>
                <p className="text-sm font-black">
                  {ageResult.nextBirthdayDays === 0
                    ? 'Happy Birthday! Today is your birthday!'
                    : `${ageResult.nextBirthdayDays} day${ageResult.nextBirthdayDays > 1 ? 's' : ''} away on a ${ageResult.nextBirthdayWeekday}`}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2.5">
            <ResultMetric
              title="Total Months"
              value={formatNumber(ageResult.totalMonths)}
              variant="neutral"
            />
            <ResultMetric
              title="Total Weeks"
              value={formatNumber(ageResult.totalWeeks)}
              variant="neutral"
            />
            <ResultMetric
              title="Total Days"
              value={formatNumber(ageResult.totalDays)}
              variant="success"
            />
          </div>
        </ResultPanel>
      }
    />
  );
}
