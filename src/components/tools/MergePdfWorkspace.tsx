'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { DropZone } from '../ui/DropZone';
import { Button } from '../ui/Button';
import { validatePdfFile, mergePdfs } from '@/lib/pdf-engine';
import { downloadBlob } from '@/lib/download';
import { formatFileSize } from '@/lib/utils';
import { useSortableFiles } from '@/hooks/useSortableFiles';
import { FileWorkspaceGrid } from '../file-workspace/FileWorkspaceGrid';
import { Files, Download, RotateCcw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function MergePdfWorkspace({ tool }: { tool: ToolMetadata }) {
  const [status, setStatus] = useState<'initial' | 'files_selected' | 'processing' | 'success' | 'error'>('initial');
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    items,
    reorderedFiles,
    addFiles,
    removeItem,
    moveLeft,
    moveRight,
    clearAll,
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  } = useSortableFiles([]);

  const handleFilesSelected = (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    const validFiles: File[] = [];
    for (const f of newFiles) {
      const v = validatePdfFile(f, 100);
      if (!v.isValid) {
        setErrorMessage(v.error || `Invalid file "${f.name}".`);
        setStatus('error');
        return;
      }
      validFiles.push(f);
    }

    addFiles(validFiles);
    setStatus('files_selected');
  };

  const handleMerge = async () => {
    if (reorderedFiles.length < 2) {
      setErrorMessage('Please select at least two PDF files to merge.');
      setStatus('error');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    try {
      const blob = await mergePdfs(reorderedFiles);
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
    clearAll();
    setMergedBlob(null);
    setErrorMessage('');
    setStatus('initial');
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 sm:p-8 bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      {/* Upload Zone */}
      {status === 'initial' && (
        <DropZone
          acceptedTypes={['application/pdf']}
          maxFileSizeMB={100}
          onFilesSelected={handleFilesSelected}
          multiple
        />
      )}

      {/* Files Selected / Reorder Workspace */}
      {(status === 'files_selected' || status === 'processing') && items.length > 0 && (
        <div className="space-y-6">
          {items.length < 2 && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs font-bold text-amber-800 dark:text-amber-300">
              Please select at least 1 more PDF file. Minimum 2 PDFs required for merging.
            </div>
          )}

          <FileWorkspaceGrid
            items={items}
            title="PDF Merge Order Workspace"
            fileTypeLabel="PDFs"
            acceptTypes={['application/pdf']}
            onAddFiles={addFiles}
            onRemoveItem={(idx) => {
              removeItem(idx);
              if (items.length <= 1) setStatus('initial');
            }}
            onMoveLeft={moveLeft}
            onMoveRight={moveRight}
            onClearAll={handleReset}
            draggedIndex={draggedIndex}
            dragOverIndex={dragOverIndex}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            disabled={status === 'processing'}
          />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={handleReset} disabled={status === 'processing'}>
              Cancel
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={handleMerge}
              disabled={items.length < 2 || status === 'processing'}
              className="w-full sm:w-auto shadow-lg shadow-blue-500/20"
            >
              {status === 'processing' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Merging PDFs...
                </>
              ) : (
                <>
                  <Files className="w-5 h-5 mr-2" strokeWidth={1.75} />
                  Merge {items.length} PDF Documents
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && mergedBlob && (
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 dark:text-emerald-400 mx-auto" strokeWidth={1.75} />
            <h3 className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 font-heading">
              PDFs Merged Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 font-semibold">
              Merged {items.length} documents • Output file size: {formatFileSize(mergedBlob.size)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" size="lg" onClick={handleDownload} className="w-full sm:w-auto">
              <Download className="w-5 h-5 mr-2" strokeWidth={2} />
              Download Merged PDF (merged.pdf)
            </Button>
            <Button variant="outline" size="lg" onClick={handleReset} className="w-full sm:w-auto">
              <RotateCcw className="w-4 h-4 mr-2" strokeWidth={1.75} />
              Merge More PDFs
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="p-8 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto" strokeWidth={1.75} />
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
