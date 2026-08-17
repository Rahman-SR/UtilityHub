'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { DropZone } from '../ui/DropZone';
import { Button } from '../ui/Button';
import { imagesToPdf } from '@/lib/pdf-generator';
import { validateImageFile } from '@/lib/validation';
import { downloadBlob } from '@/lib/download';
import { formatFileSize } from '@/lib/utils';
import { useSortableFiles } from '@/hooks/useSortableFiles';
import { FileWorkspaceGrid } from '../file-workspace/FileWorkspaceGrid';
import { PdfLayoutOptionsPanel } from '../file-workspace/PdfLayoutOptionsPanel';
import { Download, RotateCcw, CheckCircle2, AlertCircle, Loader2, FileImage } from 'lucide-react';

export function ImageToPdfWorkspace({ tool }: { tool: ToolMetadata }) {
  const [status, setStatus] = useState<'initial' | 'files_selected' | 'processing' | 'success' | 'error'>('initial');
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [marginMm, setMarginMm] = useState<number>(10);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    items,
    addFiles,
    removeItem,
    rotateItem,
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

    addFiles(validFiles);
    setStatus('files_selected');
  };

  const handleGeneratePdf = async () => {
    if (items.length === 0) return;
    setStatus('processing');
    setErrorMessage('');

    try {
      // Pass items array (holding { file, rotation }) to imagesToPdf
      const inputItems = items.map((item) => ({
        file: item.file,
        rotation: item.rotation || 0,
      }));

      const blob = await imagesToPdf(inputItems, { pageSize, orientation, marginMm });
      setPdfBlob(blob);
      setStatus('success');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to generate PDF document.');
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    downloadBlob(pdfBlob, 'converted-images.pdf');
  };

  const handleReset = () => {
    clearAll();
    setPdfBlob(null);
    setErrorMessage('');
    setStatus('initial');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 sm:p-8 bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      {/* Upload Zone */}
      {status === 'initial' && (
        <DropZone
          acceptedTypes={tool.acceptedFileTypes || ['image/jpeg', 'image/png']}
          maxFileSizeMB={tool.maxFileSizeMB}
          onFilesSelected={handleFilesSelected}
          multiple
        />
      )}

      {/* Files Selected / Workspace State (Responsive 2-Column Grid on Desktop) */}
      {(status === 'files_selected' || status === 'processing') && items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Preview Workspace (70% Width) */}
          <div className="lg:col-span-7 space-y-4">
            <FileWorkspaceGrid
              items={items}
              title="Page Order & Rotation Workspace"
              fileTypeLabel="Images"
              acceptTypes={tool.acceptedFileTypes || ['image/jpeg', 'image/png']}
              onAddFiles={addFiles}
              onRemoveItem={(idx) => {
                removeItem(idx);
                if (items.length <= 1) setStatus('initial');
              }}
              onRotateItem={rotateItem}
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
          </div>

          {/* Right Column: PDF Options & Action Panel (30% Width) */}
          <div className="lg:col-span-5 space-y-6">
            <PdfLayoutOptionsPanel
              pageSize={pageSize}
              setPageSize={setPageSize}
              orientation={orientation}
              setOrientation={setOrientation}
              marginMm={marginMm}
              setMarginMm={setMarginMm}
              disabled={status === 'processing'}
            />

            <div className="flex flex-col space-y-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleGeneratePdf}
                disabled={status === 'processing'}
                className="w-full justify-center shadow-lg shadow-blue-500/20"
              >
                {status === 'processing' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <FileImage className="w-5 h-5 mr-2" strokeWidth={1.75} />
                    Generate PDF ({items.length} Page{items.length > 1 ? 's' : ''})
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={status === 'processing'}
                className="w-full text-slate-500 hover:text-slate-700"
              >
                Cancel & Clear Workspace
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && pdfBlob && (
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 dark:text-emerald-400 mx-auto" strokeWidth={1.75} />
            <h3 className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 font-heading">
              PDF Generated Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 font-semibold">
              Total Pages: {items.length} | Size: {formatFileSize(pdfBlob.size)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" size="lg" onClick={handleDownload} className="w-full sm:w-auto">
              <Download className="w-5 h-5 mr-2" strokeWidth={2} />
              Download PDF Document
            </Button>
            <Button variant="outline" size="lg" onClick={handleReset} className="w-full sm:w-auto">
              <RotateCcw className="w-4 h-4 mr-2" strokeWidth={1.75} />
              Create Another PDF
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="p-8 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto" strokeWidth={1.75} />
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
