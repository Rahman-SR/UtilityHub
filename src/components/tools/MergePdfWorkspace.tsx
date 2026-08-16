'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { DropZone } from '../ui/DropZone';
import { Button } from '../ui/Button';
import { validatePdfFile, getPdfMetadata, mergePdfs } from '@/lib/pdf-engine';
import { downloadBlob } from '@/lib/download';
import { formatFileSize } from '@/lib/utils';
import { FilePlus, Download, RotateCcw, CheckCircle2, AlertCircle, Loader2, Trash2, ArrowUp, ArrowDown, FileText } from 'lucide-react';

interface PdfFileItem {
  file: File;
  pageCount: number;
}

export function MergePdfWorkspace({ tool }: { tool: ToolMetadata }) {
  const [status, setStatus] = useState<'initial' | 'files_selected' | 'processing' | 'success' | 'error'>('initial');
  const [pdfItems, setPdfItems] = useState<PdfFileItem[]>([]);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFilesSelected = async (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    const itemsToAdd: PdfFileItem[] = [];
    for (const f of newFiles) {
      const v = validatePdfFile(f, 100);
      if (!v.isValid) {
        setErrorMessage(v.error || 'Invalid file selected.');
        setStatus('error');
        return;
      }

      try {
        const meta = await getPdfMetadata(f);
        itemsToAdd.push({ file: f, pageCount: meta.pageCount });
      } catch (err: any) {
        setErrorMessage(err.message || `Could not read "${f.name}".`);
        setStatus('error');
        return;
      }
    }

    setPdfItems((prev) => [...prev, ...itemsToAdd]);
    setStatus('files_selected');
  };

  const handleRemoveFile = (index: number) => {
    const updated = pdfItems.filter((_, i) => i !== index);
    setPdfItems(updated);
    if (updated.length === 0) {
      setStatus('initial');
    }
  };

  const handleMoveFile = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === pdfItems.length - 1)) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...pdfItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setPdfItems(updated);
  };

  const handleMerge = async () => {
    if (pdfItems.length < 2) {
      setErrorMessage('Please select at least two PDF files to merge.');
      setStatus('error');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    try {
      const filesArray = pdfItems.map((item) => item.file);
      const blob = await mergePdfs(filesArray);
      setMergedBlob(blob);
      setStatus('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to merge PDF files.');
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!mergedBlob) return;
    downloadBlob(mergedBlob, 'merged.pdf');
  };

  const handleReset = () => {
    setPdfItems([]);
    setMergedBlob(null);
    setErrorMessage('');
    setStatus('initial');
  };

  const totalPageCount = pdfItems.reduce((acc, item) => acc + item.pageCount, 0);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      {/* Upload Zone */}
      {status === 'initial' && (
        <DropZone
          acceptedTypes={['application/pdf']}
          maxFileSizeMB={100}
          onFilesSelected={handleFilesSelected}
          multiple
        />
      )}

      {/* Files Selected / Reorder List */}
      {(status === 'files_selected' || status === 'processing') && pdfItems.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center">
                <FilePlus className="w-5 h-5 mr-2 text-blue-600" />
                Selected PDFs ({pdfItems.length})
              </h3>
              <p className="text-xs text-slate-500">
                Total Pages: {totalPageCount} | Reorder files in the sequence you want merged
              </p>
            </div>

            <Button variant="ghost" size="sm" onClick={handleReset} disabled={status === 'processing'}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          </div>

          {pdfItems.length < 2 && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs font-semibold text-amber-800 dark:text-amber-300">
              Please select at least 1 more PDF file. Minimum 2 PDFs required for merging.
            </div>
          )}

          {/* Reorderable List */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {pdfItems.map((item, idx) => (
              <div
                key={`${item.file.name}-${idx}`}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3 truncate">
                  <span className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate">{item.file.name}</h4>
                    <span className="text-slate-500">
                      {item.pageCount} page{item.pageCount > 1 ? 's' : ''} • {formatFileSize(item.file.size)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveFile(idx, 'up')}
                    disabled={idx === 0 || status === 'processing'}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
                    aria-label="Move file up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveFile(idx, 'down')}
                    disabled={idx === pdfItems.length - 1 || status === 'processing'}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
                    aria-label="Move file down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    disabled={status === 'processing'}
                    className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                    aria-label="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <DropZone
              acceptedTypes={['application/pdf']}
              maxFileSizeMB={100}
              onFilesSelected={handleFilesSelected}
              multiple
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleReset} disabled={status === 'processing'}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleMerge}
              disabled={pdfItems.length < 2 || status === 'processing'}
            >
              {status === 'processing' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Merging PDFs...
                </>
              ) : (
                `Merge ${pdfItems.length} PDFs`
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && mergedBlob && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="text-xl font-extrabold text-emerald-900 dark:text-emerald-100 font-heading">
              PDFs Merged Successfully!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Merged {pdfItems.length} documents ({totalPageCount} total pages) • Output size: {formatFileSize(mergedBlob.size)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" size="lg" onClick={handleDownload} className="w-full sm:w-auto">
              <Download className="w-5 h-5 mr-2" />
              Download Merged PDF (merged.pdf)
            </Button>
            <Button variant="outline" size="lg" onClick={handleReset} className="w-full sm:w-auto">
              <RotateCcw className="w-4 h-4 mr-2" />
              Merge More PDFs
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto" />
          <h3 className="text-lg font-bold text-red-900 dark:text-red-100 font-heading">PDF Merge Error</h3>
          <p className="text-xs text-red-700 dark:text-red-300">
            {errorMessage || 'Unable to merge PDF files. Please check selection.'}
          </p>
          <Button variant="danger" size="md" onClick={handleReset}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
