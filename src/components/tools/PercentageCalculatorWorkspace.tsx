'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { Percent } from 'lucide-react';
import { calculatePercentage, PercentageMode } from '@/lib/calculators/percentage';
import { formatNumber, formatPercent } from '@/lib/calculators/formatters';
import { CalculatorShell } from '../calculators/CalculatorShell';
import { CalculatorInput } from '../calculators/CalculatorInput';
import { NumberInput } from '../calculators/NumberInput';
import { ResultPanel } from '../calculators/ResultPanel';
import { ResultMetric } from '../calculators/ResultMetric';
import { ValidationMessage } from '../calculators/ValidationMessage';

export function PercentageCalculatorWorkspace({ tool }: { tool: ToolMetadata }) {
  const [mode, setMode] = useState<PercentageMode>('percentage_of');
  const [value1, setValue1] = useState<number>(20);
  const [value2, setValue2] = useState<number>(500);

  const percentageResult = calculatePercentage({ mode, value1, value2 });

  const handleReset = () => {
    setMode('percentage_of');
    setValue1(20);
    setValue2(500);
  };

  const copyText = percentageResult.isValid ? percentageResult.displayText : '';

  return (
    <CalculatorShell
      title={tool.name}
      subtitle="Percentage Operations & Growth Calculator"
      icon={Percent}
      iconColor="bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400"
      onReset={handleReset}
      copySummaryText={copyText}
      inputs={
        <>
          {/* Mode Selector */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Select Percentage Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setMode('percentage_of');
                  setValue1(20);
                  setValue2(500);
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  mode === 'percentage_of'
                    ? 'bg-blue-600 dark:bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                What is X% of Y?
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('is_what_percent');
                  setValue1(50);
                  setValue2(200);
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  mode === 'is_what_percent'
                    ? 'bg-blue-600 dark:bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                X is what % of Y?
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('percentage_change');
                  setValue1(100);
                  setValue2(150);
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  mode === 'percentage_change'
                    ? 'bg-blue-600 dark:bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                % Increase / Decrease
              </button>
            </div>
          </div>

          {/* Dynamic Inputs based on mode */}
          {mode === 'percentage_of' && (
            <>
              <CalculatorInput label="Percentage (X%)" helperText="Target percentage">
                <NumberInput value={value1} onChange={setValue1} suffix="%" placeholder="e.g. 20" />
              </CalculatorInput>
              <CalculatorInput label="Base Value (Y)" helperText="Total base number">
                <NumberInput value={value2} onChange={setValue2} placeholder="e.g. 500" />
              </CalculatorInput>
            </>
          )}

          {mode === 'is_what_percent' && (
            <>
              <CalculatorInput label="Part Value (X)" helperText="Numerator amount">
                <NumberInput value={value1} onChange={setValue1} placeholder="e.g. 50" />
              </CalculatorInput>
              <CalculatorInput label="Total Base (Y)" helperText="Denominator total">
                <NumberInput value={value2} onChange={setValue2} placeholder="e.g. 200" />
              </CalculatorInput>
            </>
          )}

          {mode === 'percentage_change' && (
            <>
              <CalculatorInput label="Initial Old Value" helperText="Starting number">
                <NumberInput value={value1} onChange={setValue1} placeholder="e.g. 100" />
              </CalculatorInput>
              <CalculatorInput label="Final New Value" helperText="Ending number">
                <NumberInput value={value2} onChange={setValue2} placeholder="e.g. 150" />
              </CalculatorInput>
            </>
          )}

          <ValidationMessage message={percentageResult.error} />
        </>
      }
      results={
        <ResultPanel note="Instant client-side percentage computation. Cleanly handles decimals and division by zero.">
          {mode === 'percentage_of' && (
            <ResultMetric
              title="Calculated Amount"
              value={formatNumber(percentageResult.resultValue)}
              subtitle={`${value1}% of ${value2}`}
              variant="primary"
            />
          )}

          {mode === 'is_what_percent' && (
            <ResultMetric
              title="Calculated Percentage"
              value={formatPercent(percentageResult.resultValue)}
              subtitle={`${value1} out of ${value2}`}
              variant="primary"
            />
          )}

          {mode === 'percentage_change' && (
            <ResultMetric
              title="Percentage Change"
              value={formatPercent(Math.abs(percentageResult.resultValue))}
              subtitle={percentageResult.displayText}
              variant={
                percentageResult.changeType === 'increase'
                  ? 'success'
                  : percentageResult.changeType === 'decrease'
                  ? 'accent'
                  : 'neutral'
              }
            />
          )}
        </ResultPanel>
      }
    />
  );
}
