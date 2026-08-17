import React from 'react';
import { NumberInput } from './NumberInput';

export interface PercentageInputProps {
  value: number;
  onChange: (val: number) => void;
  slabs?: number[];
  label?: string;
  helperText?: string;
}

export function PercentageInput({
  value,
  onChange,
  slabs = [5, 12, 18, 28],
  helperText,
}: PercentageInputProps) {
  return (
    <div className="space-y-2">
      {slabs && slabs.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {slabs.map((slab) => (
            <button
              key={slab}
              type="button"
              onClick={() => onChange(slab)}
              className={`py-2 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                value === slab
                  ? 'bg-blue-600 dark:bg-indigo-600 text-white border-blue-600 dark:border-indigo-600 shadow-md'
                  : 'bg-white dark:bg-[#121829] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400'
              }`}
            >
              {slab}%
            </button>
          ))}
        </div>
      )}

      <NumberInput
        value={value}
        onChange={onChange}
        suffix="%"
        placeholder="Enter custom rate..."
        step="0.1"
        min={0}
        max={100}
      />
      {helperText && <p className="text-xs text-slate-500 font-medium">{helperText}</p>}
    </div>
  );
}
