'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { DropZone } from '../ui/DropZone';
import { Button } from '../ui/Button';
import { imagesToPdf, PdfOptions } from '@/lib/pdf-generator';
import { validateImageFile } from '@/lib/validation';
import { downloadBlob } from '@/lib/download';
import { formatFileSize } from '@/lib/utils';
import { FileText, Download, RotateCcw, CheckCircle2, AlertCircle, Loader2, Trash2, ArrowUp, ArrowDown, FileImage, Settings } from 'lucide-react';

export function ImageToPdfWorkspace({ tool }: { tool: ToolMetadata }) {
  const [status, setStatus] = useState<'initial' | 'files_selected' | 'processing' | 'success' | 'error'>('initial');
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [marginMm, setMarginMm] = useState<number>(10);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFilesSelected = (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    const validFiles: File[] = [];
    for (const f of newFiles) {
      const v = validateImageFile(f, { maxFileSizeMB: tool.maxFileSizeMB });
      if (v.isValid) {
        validFiles.push(f);
      }
    }

    if (validFiles.length === 0) {
      setErrorMessage('No valid image files were selected.');
      setStatus('error');
      return;
    }

    setFiles((prev) => [...prev, ...validFiles]);
    setStatus('files_selected');
  };

  const handleRemoveFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    if (updated.length === 0) {
      setStatus('initial');
    }
  };

  const handleMoveFile = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === files.length - 1)) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFiles(updated);
  };

  const handleGeneratePdf = async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setErrorMessage('');

    try {
      const blob = await imagesToPdf(files, { pageSize, orientation, marginMm });
      setPdfBlob(blob);
      setStatus('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate PDF document.');
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    downloadBlob(pdfBlob, 'converted-images.pdf');
  };

  const handleReset = () => {
    setFiles([]);
    setPdfBlob(null);
    setErrorMessage('');
    setStatus('initial');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      {/* Upload Zone */}
      {status === 'initial' && (
        <DropZone
          acceptedTypes={tool.acceptedFileTypes || ['image/jpeg', 'image/png']}
          maxFileSizeMB={tool.maxFileSizeMB}
          onFilesSelected={handleFilesSelected}
          multiple
        />
      )}

      {/* Files Selected / Settings State */}
      {(status === 'files_selected' || status === 'processing') && files.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center">
              <FileImage className="w-5 h-5 mr-2 text-blue-600" />
              Selected Images ({files.length})
            </h3>
            <Button variant="ghost" size="sm" onClick={handleReset} disabled={status === 'processing'}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          </div>

          {/* Image List Items */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3 truncate">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">{file.name}</span>
                  <span className="text-slate-400 shrink-0">({formatFileSize(file.size)})</span>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveFile(idx, 'up')}
                    disabled={idx === 0 || status === 'processing'}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveFile(idx, 'down')}
                    disabled={idx === files.length - 1 || status === 'processing'}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    disabled={status === 'processing'}
                    className="p-1 rounded text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* PDF Page Settings */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
              <Settings className="w-4 h-4 mr-1.5 text-blue-600" />
              PDF Layout Options
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium"
                >
                  <option value="a4">A4 Standard</option>
                  <option value="letter">US Letter</option>
                  <option value="fit">Fit to Image Size</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Orientation</label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Margins</label>
                <select
                  value={marginMm}
                  onChange={(e) => setMarginMm(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium"
                >
                  <option value={0}>No Margin (0mm)</option>
                  <option value={10}>Standard (10mm)</option>
                  <option value={20}>Large (20mm)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleReset} disabled={status === 'processing'}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleGeneratePdf} disabled={status === 'processing'}>
              {status === 'processing' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                `Generate PDF (${files.length} Page${files.length > 1 ? 's' : ''})`
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && pdfBlob && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="text-xl font-extrabold text-emerald-900 dark:text-emerald-100 font-heading">
              PDF Generated Successfully!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Total Pages: {files.length} | Size: {formatFileSize(pdfBlob.size)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" size="lg" onClick={handleDownload} className="w-full sm:w-auto">
              <Download className="w-5 h-5 mr-2" />
              Download PDF Document
            </Button>
            <Button variant="outline" size="lg" onClick={handleReset} className="w-full sm:w-auto">
              <RotateCcw className="w-4 h-4 mr-2" />
              Create Another PDF
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto" />
          <h3 className="text-lg font-bold text-red-900 dark:text-red-100 font-heading">PDF Generation Error</h3>
          <p className="text-xs text-red-700 dark:text-red-300">
            {errorMessage || 'Unable to generate PDF document.'}
          </p>
          <Button variant="danger" size="md" onClick={handleReset}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
