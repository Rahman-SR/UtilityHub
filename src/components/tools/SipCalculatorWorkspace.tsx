'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ResultCard } from './ResultCard';
import { RotateCcw, TrendingUp, Info } from 'lucide-react';

export function SipCalculatorWorkspace({ tool }: { tool: ToolMetadata }) {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000); // ₹ 5,000 / month
  const [expectedRate, setExpectedRate] = useState<number>(12); // 12% p.a.
  const [timeYears, setTimeYears] = useState<number>(10);

  const months = timeYears * 12;
  const i = expectedRate / 12 / 100;

  // SIP Future Value formula: M = P × ({[1 + i]^n - 1} / i) × (1 + i)
  const futureValue =
    i > 0
      ? monthlyInvestment * (((Math.pow(1 + i, months) - 1) / i) * (1 + i))
      : monthlyInvestment * months;

  const totalInvested = monthlyInvestment * months;
  const estimatedReturns = futureValue - totalInvested;

  const handleReset = () => {
    setMonthlyInvestment(5000);
    setExpectedRate(12);
    setTimeYears(10);
  };

  const formatINR = (val: number) => {
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-slate-100">
              SIP Return Calculator (₹ INR)
            </h3>
            <p className="text-xs text-slate-500 font-medium">Systematic Investment Plan Wealth Growth in Indian Rupees (₹)</p>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={handleReset} className="cursor-pointer">
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-5">
          <Input
            label="Monthly SIP Investment (₹ INR)"
            type="number"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            helperText="e.g. ₹ 5,000 per month"
          />

          <Input
            label="Expected Return Rate (% p.a.)"
            type="number"
            step="0.5"
            value={expectedRate}
            onChange={(e) => setExpectedRate(Number(e.target.value))}
            helperText="e.g. 12% annual returns for equity mutual funds"
          />

          <Input
            label="Investment Tenure (Years)"
            type="number"
            value={timeYears}
            onChange={(e) => setTimeYears(Number(e.target.value))}
            helperText={`Equivalent to ${months} monthly SIP installments`}
          />
        </div>

        {/* Result Cards Panel */}
        <div className="space-y-4 flex flex-col justify-center">
          <ResultCard
            title="Total Expected Maturity Value"
            value={formatINR(futureValue)}
            subtitle="Future Wealth Value in ₹ INR"
            variant="primary"
          />

          <div className="grid grid-cols-2 gap-3">
            <ResultCard
              title="Total Amount Invested"
              value={formatINR(totalInvested)}
              variant="neutral"
            />
            <ResultCard
              title="Estimated Wealth Gain"
              value={formatINR(estimatedReturns)}
              variant="success"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start space-x-2 text-xs text-slate-500 font-medium">
            <Info className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
            <span>Formatted in Indian Rupees (en-IN). SIP compounding assumes regular monthly investments.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
