'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ResultCard } from './ResultCard';
import { RotateCcw, BadgePercent, Info } from 'lucide-react';

export function EmiCalculatorWorkspace({ tool }: { tool: ToolMetadata }) {
  const [principal, setPrincipal] = useState<number>(500000); // ₹ 5 Lakhs default
  const [rate, setRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(5);

  const tenureMonths = tenureYears * 12;
  const monthlyRate = rate / 12 / 100;

  const emi =
    monthlyRate > 0
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1)
      : principal / tenureMonths;

  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;

  const handleReset = () => {
    setPrincipal(500000);
    setRate(8.5);
    setTenureYears(5);
  };

  const formatINR = (val: number) => {
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <BadgePercent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-slate-100">
              Loan EMI Calculator (₹ INR)
            </h3>
            <p className="text-xs text-slate-500 font-medium">Equated Monthly Installment in Indian Rupees (₹)</p>
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
            label="Loan Principal Amount (₹ INR)"
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            helperText="e.g. ₹ 5,00,000 (5 Lakhs)"
          />

          <Input
            label="Annual Interest Rate (% p.a.)"
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            helperText="Annual interest rate percentage"
          />

          <Input
            label="Loan Tenure (Years)"
            type="number"
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            helperText={`Equivalent to ${tenureMonths} monthly EMI installments`}
          />
        </div>

        {/* Result Cards Panel */}
        <div className="space-y-4 flex flex-col justify-center">
          <ResultCard
            title="Monthly EMI Payment"
            value={formatINR(emi)}
            subtitle="Equated Monthly Installment (₹/month)"
            variant="primary"
          />

          <div className="grid grid-cols-2 gap-3">
            <ResultCard
              title="Total Interest"
              value={formatINR(totalInterest)}
              variant="neutral"
            />
            <ResultCard
              title="Total Amount Payable"
              value={formatINR(totalPayment)}
              variant="success"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start space-x-2 text-xs text-slate-500 font-medium">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <span>Calculated in Indian Rupee format (en-IN). Formula: EMI = [P x R x (1+R)^N] / [(1+R)^N-1].</span>
          </div>
        </div>
      </div>
    </div>
  );
}
