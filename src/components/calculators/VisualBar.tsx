import React from 'react';

export interface VisualBarProps {
  segment1Label: string;
  segment1Value: string;
  segment1Percent: number;
  segment1Color?: string; // CSS bg class
  segment2Label: string;
  segment2Value: string;
  segment2Percent: number;
  segment2Color?: string; // CSS bg class
}

export function VisualBar({
  segment1Label,
  segment1Value,
  segment1Percent,
  segment1Color = 'bg-blue-600 dark:bg-indigo-600',
  segment2Label,
  segment2Value,
  segment2Percent,
  segment2Color = 'bg-emerald-500',
}: VisualBarProps) {
  const p1 = Math.max(0, Math.min(100, segment1Percent));
  const p2 = Math.max(0, Math.min(100, segment2Percent));

  return (
    <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
      {/* Percentage Bar */}
      <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
        <div
          style={{ width: `${p1}%` }}
          className={`h-full ${segment1Color} transition-all duration-300`}
        />
        <div
          style={{ width: `${p2}%` }}
          className={`h-full ${segment2Color} transition-all duration-300`}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 pt-1">
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${segment1Color} inline-block`} />
          <span>
            {segment1Label}: <span className="font-extrabold">{segment1Value}</span> ({p1.toFixed(1)}%)
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${segment2Color} inline-block`} />
          <span>
            {segment2Label}: <span className="font-extrabold">{segment2Value}</span> ({p2.toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
