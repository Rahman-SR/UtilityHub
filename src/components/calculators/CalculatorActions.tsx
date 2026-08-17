import React, { useState } from 'react';
import { RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export interface CalculatorActionsProps {
  onReset: () => void;
  copySummaryText?: string;
  className?: string;
}

export function CalculatorActions({
  onReset,
  copySummaryText,
  className = '',
}: CalculatorActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!copySummaryText) return;
    navigator.clipboard.writeText(copySummaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {copySummaryText && (
        <Button variant="ghost" size="sm" onClick={handleCopy} className="cursor-pointer text-xs font-bold">
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1" />
              <span>Copy Result</span>
            </>
          )}
        </Button>
      )}

      <Button variant="ghost" size="sm" onClick={onReset} className="cursor-pointer text-xs font-bold">
        <RotateCcw className="w-3.5 h-3.5 mr-1" />
        <span>Reset</span>
      </Button>
    </div>
  );
}
