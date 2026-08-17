'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { TrendingUp } from 'lucide-react';
import { calculateSIP } from '@/lib/calculators/sip';
import { formatINR } from '@/lib/calculators/formatters';
import { CalculatorShell } from '../calculators/CalculatorShell';
import { CalculatorInput } from '../calculators/CalculatorInput';
import { NumberInput } from '../calculators/NumberInput';
import { ResultPanel } from '../calculators/ResultPanel';
import { ResultMetric } from '../calculators/ResultMetric';
import { ValidationMessage } from '../calculators/ValidationMessage';
import { VisualBar } from '../calculators/VisualBar';

export function SipCalculatorWorkspace({ tool }: { tool: ToolMetadata }) {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(12);
  const [investmentYears, setInvestmentYears] = useState<number>(10);

  const sipResult = calculateSIP({ monthlyInvestment, expectedReturnRate, investmentYears });

  const handleReset = () => {
    setMonthlyInvestment(5000);
    setExpectedReturnRate(12);
    setInvestmentYears(10);
  };

  const copyText = sipResult.isValid
    ? `SIP Projection Summary:\nMonthly Investment: ${formatINR(monthlyInvestment)}\nInvested Amount: ${formatINR(sipResult.investedAmount)}\nEstimated Returns: ${formatINR(sipResult.estimatedReturns)}\nFuture Maturity Value: ${formatINR(sipResult.futureValue)}`
    : '';

  return (
    <CalculatorShell
      title={tool.name}
      subtitle="Systematic Investment Plan Wealth Growth (₹ INR)"
      icon={TrendingUp}
      iconColor="bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400"
      onReset={handleReset}
      copySummaryText={copyText}
      inputs={
        <>
          {/* Monthly Investment */}
          <CalculatorInput label="Monthly SIP Amount (₹ INR)" helperText="Amount invested every month">
            <NumberInput
              value={monthlyInvestment}
              onChange={setMonthlyInvestment}
              prefix="₹"
              placeholder="e.g. 5000"
              min={100}
            />
          </CalculatorInput>

          {/* Expected Return */}
          <CalculatorInput label="Expected Annual Return Rate (% p.a.)" helperText="Historical equity mutual fund benchmark rate (~12-15%)">
            <NumberInput
              value={expectedReturnRate}
              onChange={setExpectedReturnRate}
              suffix="%"
              placeholder="e.g. 12"
              step="0.5"
              min={0}
              max={100}
            />
          </CalculatorInput>

          {/* Duration */}
          <CalculatorInput label="Investment Duration (Years)" helperText={`Total ${investmentYears * 12} monthly compounding periods`}>
            <NumberInput
              value={investmentYears}
              onChange={setInvestmentYears}
              suffix="Years"
              placeholder="e.g. 10"
              min={1}
              max={50}
            />
          </CalculatorInput>

          <ValidationMessage message={sipResult.error} />
        </>
      }
      results={
        <ResultPanel note="Disclaimer: SIP projections are mathematical estimates based on monthly compounding. Mutual fund investments are subject to market risks and returns are not guaranteed.">
          <ResultMetric
            title="Estimated Future Maturity Value"
            value={formatINR(sipResult.futureValue)}
            subtitle="Total Wealth Value after compounding"
            variant="primary"
          />

          <div className="grid grid-cols-2 gap-3">
            <ResultMetric
              title="Total Invested Amount"
              value={formatINR(sipResult.investedAmount)}
              subtitle="Your Capital"
              variant="neutral"
            />
            <ResultMetric
              title="Estimated Returns"
              value={formatINR(sipResult.estimatedReturns)}
              subtitle="Wealth Gain"
              variant="success"
            />
          </div>

          {/* Visual Ratio Breakdown */}
          {sipResult.isValid && (
            <VisualBar
              segment1Label="Invested"
              segment1Value={formatINR(sipResult.investedAmount)}
              segment1Percent={sipResult.investedPercentage}
              segment1Color="bg-blue-600 dark:bg-indigo-600"
              segment2Label="Returns"
              segment2Value={formatINR(sipResult.estimatedReturns)}
              segment2Percent={sipResult.returnsPercentage}
              segment2Color="bg-emerald-500"
            />
          )}
        </ResultPanel>
      }
    />
  );
}
