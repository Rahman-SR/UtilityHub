'use client';

import React, { useState, useEffect } from 'react';
import { ToolMetadata } from '@/types/tool';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { generateQrDataUrl } from '@/lib/qr-generator';
import { downloadDataUrl } from '@/lib/download';
import { QrCode, Download, RotateCcw, Copy, Check, AlertCircle, Settings } from 'lucide-react';
import { trackToolComplete, trackFileDownload } from '@/lib/analytics';

export function QrGeneratorWorkspace({ tool }: { tool: ToolMetadata }) {
  const [text, setText] = useState<string>('https://yoursthing.online');
  const [qrSize, setQrSize] = useState<number>(300);
  const [ecLevel, setEcLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let isCancelled = false;

    if (!text || text.trim().length === 0) {
      return;
    }

    generateQrDataUrl(text, { width: qrSize, errorCorrectionLevel: ecLevel })
      .then((url) => {
        if (!isCancelled) {
          setQrDataUrl(url);
          setError('');
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'QR Code generation failed.');
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [text, qrSize, ecLevel]);

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    trackToolComplete('QR Code Generator', 'quick');
    trackFileDownload('QR Code Generator', 'image/png');
    downloadDataUrl(qrDataUrl, 'qr-code.png');
  };

  const handleReset = () => {
    setText('https://yoursthing.online');
    setQrSize(300);
    setEcLevel('M');
    setError('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100">
              {tool.name} Workspace
            </h3>
            <p className="text-xs text-slate-500">Generate static vector QR codes directly in your browser</p>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Inputs */}
        <div className="space-y-5">
          <Input
            label="Website URL or Text Content"
            placeholder="e.g. https://mywebsite.com or text message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            error={error ? error : undefined}
            helperText="Static QR codes encode raw data directly and never expire."
          />

          {/* Settings Grid */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
              <Settings className="w-4 h-4 mr-1.5 text-blue-600" />
              QR Options
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Image Size</label>
                <select
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium"
                >
                  <option value={200}>200 x 200 px</option>
                  <option value={300}>300 x 300 px</option>
                  <option value={500}>500 x 500 px</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Error Correction</label>
                <select
                  value={ecLevel}
                  onChange={(e) => setEcLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCopyText} disabled={!text}>
              {copied ? <Check className="w-4 h-4 mr-1 text-emerald-500" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? 'Copied!' : 'Copy Input Text'}
            </Button>
          </div>
        </div>

        {/* Right Preview */}
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center min-h-[220px] min-w-[220px]">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="Generated QR Code" className="w-48 h-48 object-contain" />
            ) : (
              <div className="text-center p-4 text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-1 text-amber-500" />
                <span className="text-xs">Enter text above to preview QR</span>
              </div>
            )}
          </div>

          <p className="text-xs font-medium text-slate-500">Live Browser Render ({qrSize}x{qrSize} px)</p>

          <Button variant="primary" size="lg" onClick={handleDownload} disabled={!qrDataUrl} className="w-full sm:w-auto">
            <Download className="w-5 h-5 mr-2" />
            Download PNG QR Code
          </Button>
        </div>
      </div>
    </div>
  );
}
