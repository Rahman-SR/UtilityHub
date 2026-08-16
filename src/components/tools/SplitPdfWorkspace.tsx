'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { DropZone } from '../ui/DropZone';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { validatePdfFile, getPdfMetadata, splitPdf, parsePageRange } from '@/lib/pdf-engine';
import { downloadBlob, getOutputFilename } from '@/lib/download';
import { formatFileSize } from '@/lib/utils';
import { Scissors, Download, RotateCcw, CheckCircle2, AlertCircle, Loader2, FileText, Info } from 'lucide-react';

export function SplitPdfWorkspace({ tool }: { tool: ToolMetadata }) {
  const [status, setStatus] = useState<'initial' | 'file_selected' | 'processing' | 'success' | 'error'>('initial');
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageRangeStr, setPageRangeStr] = useState<string>('');
  const [parsedCount, setParsedCount] = useState<number>(0);
  const [rangeError, setRangeError] = useState<string>('');
  const [splitBlob, setSplitBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];

    const v = validatePdfFile(selectedFile, 100);
    if (!v.isValid) {
      setErrorMessage(v.error || 'Invalid file format.');
      setStatus('error');
      return;
    }

    try {
      const meta = await getPdfMetadata(selectedFile);
      setFile(selectedFile);
      setPageCount(meta.pageCount);
      // Pre-fill default range (e.g. 1-totalPages or 1)
      const defaultRange = meta.pageCount > 1 ? `1-${meta.pageCount}` : '1';
      setPageRangeStr(defaultRange);
      handleRangeChange(defaultRange, meta.pageCount);
      setStatus('file_selected');
    } catch (err: any) {
      setErrorMessage(err.message || `Could not read "${selectedFile.name}".`);
      setStatus('error');
    }
  };

  const handleRangeChange = (val: string, total: number) => {
    setPageRangeStr(val);
    if (!val.trim()) {
      setRangeError('Please enter a page range.');
      setParsedCount(0);
      return;
    }

    try {
      const indices = parsePageRange(val, total);
      setParsedCount(indices.length);
      setRangeError('');
    } catch (err: any) {
      setRangeError(err.message || 'Invalid page range syntax.');
      setParsedCount(0);
    }
  };

  const handleSplit = async () => {
    if (!file) return;

    if (rangeError || parsedCount === 0) {
      setErrorMessage(rangeError || 'Please fix page range errors before splitting.');
      setStatus('error');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    try {
      const result = await splitPdf(file, pageRangeStr);
      setSplitBlob(result.blob);
      setStatus('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'PDF page extraction failed.');
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!splitBlob || !file) return;
    const filename = getOutputFilename(file.name, 'split', 'pdf');
    downloadBlob(splitBlob, filename);
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setPageRangeStr('');
    setParsedCount(0);
    setRangeError('');
    setSplitBlob(null);
    setErrorMessage('');
    setStatus('initial');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      {/* Upload Zone */}
      {status === 'initial' && (
        <DropZone
          acceptedTypes={['application/pdf']}
          maxFileSizeMB={100}
          onFilesSelected={handleFileSelected}
        />
      )}

      {/* Selected / Processing */}
      {(status === 'file_selected' || status === 'processing') && file && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{file.name}</h4>
                <p className="text-xs text-slate-500">
                  Total Pages: {pageCount} • Size: {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleReset} disabled={status === 'processing'}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Change PDF
            </Button>
          </div>

          {/* Page Selection Controls */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center">
              <Scissors className="w-4 h-4 mr-2 text-blue-600" />
              Select Pages to Extract
            </h4>

            <Input
              label="Page Range Syntax"
              placeholder="e.g. 1-3, 5, 8-10"
              value={pageRangeStr}
              onChange={(e) => handleRangeChange(e.target.value, pageCount)}
              error={rangeError ? rangeError : undefined}
              helperText={`Document has ${pageCount} total pages. Use commas and hyphens (e.g. 1-3, 5).`}
              disabled={status === 'processing'}
            />

            {!rangeError && parsedCount > 0 && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 text-xs font-semibold text-blue-800 dark:text-blue-200 flex items-center space-x-2">
                <Info className="w-4 h-4 shrink-0 text-blue-600" />
                <span>Will extract {parsedCount} page{parsedCount > 1 ? 's' : ''} into a new PDF document.</span>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleReset} disabled={status === 'processing'}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSplit}
              disabled={!!rangeError || parsedCount === 0 || status === 'processing'}
            >
              {status === 'processing' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting Pages...
                </>
              ) : (
                `Extract ${parsedCount} Page${parsedCount > 1 ? 's' : ''} & Split PDF`
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && splitBlob && file && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="text-xl font-extrabold text-emerald-900 dark:text-emerald-100 font-heading">
              PDF Pages Extracted Successfully!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Extracted {parsedCount} pages from &quot;{file.name}&quot; • Output size: {formatFileSize(splitBlob.size)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" size="lg" onClick={handleDownload} className="w-full sm:w-auto">
              <Download className="w-5 h-5 mr-2" />
              Download Extracted PDF ({getOutputFilename(file.name, 'split', 'pdf')})
            </Button>
            <Button variant="outline" size="lg" onClick={handleReset} className="w-full sm:w-auto">
              <RotateCcw className="w-4 h-4 mr-2" />
              Split Another PDF
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto" />
          <h3 className="text-lg font-bold text-red-900 dark:text-red-100 font-heading">PDF Split Error</h3>
          <p className="text-xs text-red-700 dark:text-red-300">
            {errorMessage || 'Unable to split PDF file.'}
          </p>
          <Button variant="danger" size="md" onClick={handleReset}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
