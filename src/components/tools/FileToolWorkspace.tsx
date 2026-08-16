'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { DropZone } from '../ui/DropZone';
import { Button } from '../ui/Button';
import { FileText, Download, RotateCcw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

export function FileToolWorkspace({ tool }: { tool: ToolMetadata }) {
  const [status, setStatus] = useState<'initial' | 'file_selected' | 'processing' | 'success' | 'error'>('initial');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    setSelectedFiles(files);
    setStatus('file_selected');
  };

  const handleProcess = () => {
    setStatus('processing');
    // Prototype processing simulation for Phase 2.1 UI demonstration
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setStatus('initial');
    setErrorMessage('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      {/* Initial Upload State */}
      {status === 'initial' && (
        <DropZone
          acceptedTypes={tool.acceptedFileTypes}
          maxFileSizeMB={tool.maxFileSizeMB}
          onFilesSelected={handleFilesSelected}
          multiple={tool.id === 'merge-pdf' || tool.id === 'image-to-pdf'}
        />
      )}

      {/* File Selected State */}
      {status === 'file_selected' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {selectedFiles.length === 1 ? selectedFiles[0].name : `${selectedFiles.length} Files Selected`}
                </h4>
                <p className="text-xs text-slate-500">
                  {selectedFiles.length === 1
                    ? formatFileSize(selectedFiles[0].size)
                    : `${selectedFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024} MB total`}
                </p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Change File
            </Button>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleReset}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleProcess}>
              Process File
            </Button>
          </div>
        </div>
      )}

      {/* Processing State */}
      {status === 'processing' && (
        <div className="py-16 text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-heading">
            Processing your file locally...
          </h3>
          <p className="text-xs text-slate-500">Your files remain 100% private in browser memory.</p>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="text-xl font-extrabold text-emerald-900 dark:text-emerald-100 font-heading">
              Processing Complete!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Your file is ready for download. No copies were saved on any server.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <Download className="w-5 h-5 mr-2" />
              Download Result
            </Button>
            <Button variant="outline" size="lg" onClick={handleReset} className="w-full sm:w-auto">
              <RotateCcw className="w-4 h-4 mr-2" />
              Process Another File
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto" />
          <h3 className="text-lg font-bold text-red-900 dark:text-red-100 font-heading">
            Processing Error
          </h3>
          <p className="text-xs text-red-700 dark:text-red-300">
            {errorMessage || 'Unable to process file. Please check format and try again.'}
          </p>
          <Button variant="danger" size="md" onClick={handleReset}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
