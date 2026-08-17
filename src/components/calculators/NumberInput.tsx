import React from 'react';

export interface NumberInputProps {
  id?: string;
  value: number | string;
  onChange: (val: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number | string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function NumberInput({
  id,
  value,
  onChange,
  placeholder,
  min,
  max,
  step = 'any',
  prefix,
  suffix,
  className = '',
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    if (valStr === '') {
      onChange(0);
      return;
    }
    const num = Number(valStr);
    onChange(isNaN(num) ? 0 : num);
  };

  return (
    <div className={`relative flex items-center rounded-2xl bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 shadow-xs focus-within:border-blue-500 dark:focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-blue-500/10 dark:focus-within:ring-indigo-500/20 transition-all ${className}`}>
      {prefix && (
        <span className="pl-4 text-sm font-black text-slate-400 dark:text-slate-500 select-none">
          {prefix}
        </span>
      )}
      <input
        id={id}
        type="number"
        inputMode="decimal"
        value={value === 0 ? '' : value}
        onChange={handleChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="w-full py-3 px-3.5 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 bg-transparent focus:outline-none placeholder-slate-400"
      />
      {suffix && (
        <span className="pr-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase select-none">
          {suffix}
        </span>
      )}
    </div>
  );
}
