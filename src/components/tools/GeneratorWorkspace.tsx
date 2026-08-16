'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { QrCode, Download, RotateCcw, Copy, Check } from 'lucide-react';

export function GeneratorWorkspace({ tool }: { tool: ToolMetadata }) {
  const [text, setText] = useState<string>('https://dailyutilityhub.com');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleReset = () => {
    setText('https://dailyutilityhub.com');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100">
              {tool.name} Workspace
            </h3>
            <p className="text-xs text-slate-500">Generate static QR codes instantly</p>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Input */}
        <div className="space-y-4">
          <Input
            label="Website URL or Text Content"
            placeholder="e.g. https://mywebsite.com or text message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            helperText="Static QR codes never expire and contain raw encoded data."
          />

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 mr-1 text-emerald-500" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? 'Copied!' : 'Copy Input'}
            </Button>
          </div>
        </div>

        {/* Right: Live Preview Box */}
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="w-48 h-48 bg-white p-4 rounded-2xl shadow-md border flex items-center justify-center relative group">
            {/* SVG Representation of QR Code for Phase 2.1 prototype */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
              <rect x="5" y="5" width="30" height="30" rx="4" fill="currentColor" />
              <rect x="10" y="10" width="20" height="20" rx="2" fill="white" />
              <rect x="15" y="15" width="10" height="10" fill="currentColor" />

              <rect x="65" y="5" width="30" height="30" rx="4" fill="currentColor" />
              <rect x="70" y="10" width="20" height="20" rx="2" fill="white" />
              <rect x="75" y="15" width="10" height="10" fill="currentColor" />

              <rect x="5" y="65" width="30" height="30" rx="4" fill="currentColor" />
              <rect x="10" y="70" width="20" height="20" rx="2" fill="white" />
              <rect x="15" y="75" width="10" height="10" fill="currentColor" />

              <rect x="45" y="45" width="10" height="10" fill="currentColor" />
              <rect x="65" y="65" width="15" height="15" fill="currentColor" />
              <rect x="45" y="75" width="15" height="10" fill="currentColor" />
              <rect x="75" y="45" width="10" height="15" fill="currentColor" />
            </svg>
          </div>

          <p className="text-xs font-medium text-slate-500">Live Browser Preview</p>

          <Button variant="primary" size="md" className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Download PNG QR Code
          </Button>
        </div>
      </div>
    </div>
  );
}
