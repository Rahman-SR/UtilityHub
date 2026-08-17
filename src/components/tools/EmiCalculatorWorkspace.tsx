'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { BadgePercent } from 'lucide-react';
import { calculateEMI, TenureType } from '@/lib/calculators/emi';
import { formatINR } from '@/lib/calculators/formatters';
import { CalculatorShell } from '../calculators/CalculatorShell';
import { CalculatorInput } from '../calculators/CalculatorInput';
import { NumberInput } from '../calculators/NumberInput';
import { ResultPanel } from '../calculators/ResultPanel';
import { ResultMetric } from '../calculators/ResultMetric';
import { ValidationMessage } from '../calculators/ValidationMessage';
import { VisualBar } from '../calculators/VisualBar';

export function EmiCalculatorWorkspace({ tool }: { tool: ToolMetadata }) {
  const [principal, setPrincipal] = useState<number>(500000);
  const [annualRate, setAnnualRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(5);
  const [tenureType, setTenureType] = useState<TenureType>('years');

  const emiResult = calculateEMI({ principal, annualRate, tenure, tenureType });

  const handleReset = () => {
    setPrincipal(500000);
    setAnnualRate(8.5);
    setTenure(5);
    setTenureType('years');
  };

  const copyText = emiResult.isValid
    ? `EMI Loan Summary:\nLoan Amount: ${formatINR(principal)}\nMonthly EMI: ${formatINR(emiResult.monthlyEmi)}\nTotal Interest: ${formatINR(emiResult.totalInterest)}\nTotal Payment: ${formatINR(emiResult.totalPayment)}`
    : '';

  return (
    <CalculatorShell
      title={tool.name}
      subtitle="Reducing Balance Loan EMI Calculator (₹ INR)"
      icon={BadgePercent}
      iconColor="bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
      onReset={handleReset}
      copySummaryText={copyText}
      inputs={
        <>
          {/* Principal Input */}
          <CalculatorInput label="Loan Amount (₹ INR)" helperText="Principal loan amount requested">
            <NumberInput
              value={principal}
              onChange={setPrincipal}
              prefix="₹"
              placeholder="e.g. 500000"
              min={0}
            />
          </CalculatorInput>

          {/* Interest Rate */}
          <CalculatorInput label="Annual Interest Rate (% p.a.)" helperText="Annual interest percentage (0% for no-cost EMI)">
            <NumberInput
              value={annualRate}
              onChange={setAnnualRate}
              suffix="%"
              placeholder="e.g. 8.5"
              step="0.1"
              min={0}
              max={100}
            />
          </CalculatorInput>

          {/* Tenure Input & Type */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Loan Tenure
              </label>
              <div className="flex space-x-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setTenureType('years')}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    tenureType === 'years'
                      ? 'bg-blue-600 dark:bg-indigo-600 text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Yr
                </button>
                <button
                  type="button"
                  onClick={() => setTenureType('months')}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    tenureType === 'months'
                      ? 'bg-blue-600 dark:bg-indigo-600 text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Mo
                </button>
              </div>
            </div>
            <NumberInput
              value={tenure}
              onChange={setTenure}
              suffix={tenureType === 'years' ? 'Years' : 'Months'}
              placeholder="e.g. 5"
              min={1}
            />
            <p className="text-xs text-slate-500 font-medium">
              Equivalent to {emiResult.totalMonths} monthly installments
            </p>
          </div>

          <ValidationMessage message={emiResult.error} />
        </>
      }
      results={
        <ResultPanel note="Standard Reducing Balance Formula: EMI = [P x R x (1+R)^N] / [(1+R)^N-1]. Zero-interest loans divide principal equally.">
          <ResultMetric
            title="Monthly EMI Payment"
            value={formatINR(emiResult.monthlyEmi)}
            subtitle="Equated Monthly Installment"
            variant="primary"
          />

          <div className="grid grid-cols-2 gap-3">
            <ResultMetric
              title="Total Interest"
              value={formatINR(emiResult.totalInterest)}
              subtitle="Interest Component"
              variant="neutral"
            />
            <ResultMetric
              title="Total Amount Payable"
              value={formatINR(emiResult.totalPayment)}
              subtitle="Principal + Interest"
              variant="success"
            />
          </div>

          {/* Visual Ratio Breakdown */}
          {emiResult.isValid && (
            <VisualBar
              segment1Label="Principal"
              segment1Value={formatINR(principal)}
              segment1Percent={emiResult.principalPercentage}
              segment1Color="bg-blue-600 dark:bg-indigo-600"
              segment2Label="Interest"
              segment2Value={formatINR(emiResult.totalInterest)}
              segment2Percent={emiResult.interestPercentage}
              segment2Color="bg-amber-500"
            />
          )}
        </ResultPanel>
      }
    />
  );
}
