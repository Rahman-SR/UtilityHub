'use client';

import React from 'react';
import { Settings, Layout, FileText, Maximize } from 'lucide-react';

export interface PdfLayoutOptionsProps {
  pageSize: 'a4' | 'letter' | 'fit';
  setPageSize: (size: 'a4' | 'letter' | 'fit') => void;
  orientation: 'portrait' | 'landscape';
  setOrientation: (ori: 'portrait' | 'landscape') => void;
  marginMm: number;
  setMarginMm: (mm: number) => void;
  disabled?: boolean;
}

export function PdfLayoutOptionsPanel({
  pageSize,
  setPageSize,
  orientation,
  setOrientation,
  marginMm,
  setMarginMm,
  disabled = false,
}: PdfLayoutOptionsProps) {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-[#121829]/60 border border-slate-200/90 dark:border-slate-800 space-y-6">
      <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center">
        <Settings className="w-4 h-4 mr-1.5 text-blue-600 dark:text-indigo-400" strokeWidth={1.75} />
        PDF Layout Options
      </h4>

      {/* Orientation Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
          Page Orientation
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setOrientation('portrait')}
            className={`p-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
              orientation === 'portrait'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-blue-300'
            }`}
          >
            <div className="w-4 h-6 border-2 border-current rounded-xs mb-1" />
            <span>Portrait</span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => setOrientation('landscape')}
            className={`p-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
              orientation === 'landscape'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-blue-300'
            }`}
          >
            <div className="w-6 h-4 border-2 border-current rounded-xs mb-1" />
            <span>Landscape</span>
          </button>
        </div>
      </div>

      {/* Page Size Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
          Page Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'a4', label: 'A4 Standard' },
            { id: 'letter', label: 'US Letter' },
            { id: 'fit', label: 'Fit Image' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              onClick={() => setPageSize(item.id as any)}
              className={`p-2.5 rounded-xl border text-[11px] font-extrabold text-center transition-all cursor-pointer ${
                pageSize === item.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-blue-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Margin Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
          Page Margins
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 0, label: 'No Margin' },
            { value: 5, label: 'Small (5mm)' },
            { value: 10, label: 'Standard (10mm)' },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              disabled={disabled}
              onClick={() => setMarginMm(item.value)}
              className={`p-2.5 rounded-xl border text-[11px] font-extrabold text-center transition-all cursor-pointer ${
                marginMm === item.value
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-blue-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
