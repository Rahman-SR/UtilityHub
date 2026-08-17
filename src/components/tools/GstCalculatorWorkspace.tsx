'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { Receipt } from 'lucide-react';
import { calculateGST, GstMode } from '@/lib/calculators/gst';
import { formatINR } from '@/lib/calculators/formatters';
import { CalculatorShell } from '../calculators/CalculatorShell';
import { CalculatorInput } from '../calculators/CalculatorInput';
import { NumberInput } from '../calculators/NumberInput';
import { PercentageInput } from '../calculators/PercentageInput';
import { ResultPanel } from '../calculators/ResultPanel';
import { ResultMetric } from '../calculators/ResultMetric';
import { ValidationMessage } from '../calculators/ValidationMessage';

export function GstCalculatorWorkspace({ tool }: { tool: ToolMetadata }) {
  const [amount, setAmount] = useState<number>(10000);
  const [rate, setRate] = useState<number>(18);
  const [mode, setMode] = useState<GstMode>('exclusive');

  const gstResult = calculateGST({ amount, rate, mode });

  const handleReset = () => {
    setAmount(10000);
    setRate(18);
    setMode('exclusive');
  };

  const copyText = gstResult.isValid
    ? `GST Calculation (${mode === 'exclusive' ? 'Add GST' : 'Remove GST'}):\nBase Amount: ${formatINR(gstResult.netAmount)}\nGST (${rate}%): ${formatINR(gstResult.gstAmount)}\nTotal: ${formatINR(gstResult.totalAmount)}`
    : '';

  return (
    <CalculatorShell
      title={tool.name}
      subtitle="Indian GST Tax Calculation (₹ INR)"
      icon={Receipt}
      iconColor="bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
      onReset={handleReset}
      copySummaryText={copyText}
      inputs={
        <>
          {/* Mode Switcher */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Calculation Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
              <button
                type="button"
                onClick={() => setMode('exclusive')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  mode === 'exclusive'
                    ? 'bg-blue-600 dark:bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Add GST (Exclusive)
              </button>
              <button
                type="button"
                onClick={() => setMode('inclusive')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  mode === 'inclusive'
                    ? 'bg-blue-600 dark:bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Remove GST (Inclusive)
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <CalculatorInput label="Amount (₹ INR)" helperText="Enter transaction amount in Indian Rupees">
            <NumberInput
              value={amount}
              onChange={setAmount}
              prefix="₹"
              placeholder="e.g. 10000"
              min={0}
            />
          </CalculatorInput>

          {/* GST Slabs & Custom Rate */}
          <CalculatorInput label="GST Rate (%)" helperText="Select standard Indian GST rate slab or enter custom rate">
            <PercentageInput value={rate} onChange={setRate} slabs={[5, 12, 18, 28]} />
          </CalculatorInput>

          <ValidationMessage message={gstResult.error} />
        </>
      }
      results={
        <ResultPanel note="Note: Please verify the applicable GST rate slab for your specific goods or services with tax guidelines.">
          <ResultMetric
            title="Total Gross Amount"
            value={formatINR(gstResult.totalAmount)}
            subtitle={`Final Payable Amount (${mode === 'exclusive' ? 'Add' : 'Includes'} ${rate}% GST)`}
            variant="primary"
          />

          <div className="grid grid-cols-2 gap-3">
            <ResultMetric
              title="Net Base Amount"
              value={formatINR(gstResult.netAmount)}
              subtitle="Excluding Tax"
              variant="neutral"
            />
            <ResultMetric
              title="Total GST Tax"
              value={formatINR(gstResult.gstAmount)}
              subtitle={`CGST (${rate / 2}%) + SGST (${rate / 2}%)`}
              variant="success"
            />
          </div>

          {/* CGST / SGST Explicit Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">CGST (Central Tax - {(rate / 2).toFixed(1)}%):</span>
              <span className="font-extrabold text-slate-900 dark:text-slate-100">{formatINR(gstResult.cgst)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-2">
              <span className="text-slate-500">SGST (State Tax - {(rate / 2).toFixed(1)}%):</span>
              <span className="font-extrabold text-slate-900 dark:text-slate-100">{formatINR(gstResult.sgst)}</span>
            </div>
          </div>
        </ResultPanel>
      }
    />
  );
}
