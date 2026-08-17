'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ResultCard } from './ResultCard';
import { RotateCcw, Receipt, Percent } from 'lucide-react';

export function GstCalculatorWorkspace({ tool }: { tool: ToolMetadata }) {
  const [amount, setAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  const gstRateNum = Number(gstRate) || 0;
  const initialAmount = Number(amount) || 0;

  let gstAmount = 0;
  let netAmount = 0;
  let totalAmount = 0;

  if (mode === 'exclusive') {
    // Add GST (Exclusive)
    netAmount = initialAmount;
    gstAmount = (initialAmount * gstRateNum) / 100;
    totalAmount = initialAmount + gstAmount;
  } else {
    // Remove GST (Inclusive)
    totalAmount = initialAmount;
    gstAmount = initialAmount - initialAmount * (100 / (100 + gstRateNum));
    netAmount = initialAmount - gstAmount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  const handleReset = () => {
    setAmount(10000);
    setGstRate(18);
    setMode('exclusive');
  };

  const formatINR = (val: number) => {
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-slate-100">
              Indian GST Calculator (₹ INR)
            </h3>
            <p className="text-xs text-slate-500 font-medium">Standard CGST + SGST tax breakdown in Indian Rupees</p>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={handleReset} className="cursor-pointer">
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* GST Mode Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              GST Calculation Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setMode('exclusive')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  mode === 'exclusive'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                GST Exclusive (Add GST)
              </button>
              <button
                type="button"
                onClick={() => setMode('inclusive')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  mode === 'inclusive'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                GST Inclusive (Remove GST)
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <Input
            label="Amount (₹ INR)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="e.g. 10000"
            helperText="Enter transaction amount in Indian Rupees (₹)"
          />

          {/* GST Tax Slabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              GST Tax Rate Slabs
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 12, 18, 28].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setGstRate(rate)}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                    gstRate === rate
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Custom GST Rate (%)"
            type="number"
            value={gstRate}
            onChange={(e) => setGstRate(Number(e.target.value))}
            placeholder="e.g. 18"
          />
        </div>

        {/* Results Panel */}
        <div className="space-y-4 flex flex-col justify-center">
          <ResultCard
            title="Total Gross Amount"
            value={formatINR(totalAmount)}
            subtitle={`Final Payable Amount (with ${gstRateNum}% GST)`}
            variant="primary"
          />

          <div className="grid grid-cols-2 gap-3">
            <ResultCard
              title="Net Base Amount"
              value={formatINR(netAmount)}
              variant="neutral"
            />
            <ResultCard
              title="Total GST Tax"
              value={formatINR(gstAmount)}
              variant="success"
            />
          </div>

          {/* CGST / SGST Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">CGST (Central Tax - {gstRateNum / 2}%):</span>
              <span className="font-extrabold text-slate-900 dark:text-slate-100">{formatINR(cgst)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-2">
              <span className="text-slate-500">SGST (State Tax - {gstRateNum / 2}%):</span>
              <span className="font-extrabold text-slate-900 dark:text-slate-100">{formatINR(sgst)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
