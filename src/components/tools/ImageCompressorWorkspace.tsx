'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { DropZone } from '../ui/DropZone';
import { Button } from '../ui/Button';
import { compressImage } from '@/lib/image-processing';
import { validateImageFile } from '@/lib/validation';
import { downloadBlob, getOutputFilename } from '@/lib/download';
import { formatFileSize } from '@/lib/utils';
import { SingleFilePreviewCard } from '../file-workspace/SingleFilePreviewCard';
import { Download, RotateCcw, CheckCircle2, AlertCircle, Loader2, Sparkles, Sliders } from 'lucide-react';

export function ImageCompressorWorkspace({ tool }: { tool: ToolMetadata }) {
  const [status, setStatus] = useState<'initial' | 'file_selected' | 'processing' | 'success' | 'error'>('initial');
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(0.75);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];

    const validation = validateImageFile(selectedFile, {
      maxFileSizeMB: tool.maxFileSizeMB,
      allowedTypes: tool.acceptedFileTypes,
    });

    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Invalid file format.');
      setStatus('error');
      return;
    }

    setFile(selectedFile);
    setStatus('file_selected');
  };

  const handleCompress = async () => {
    if (!file) return;
    setStatus('processing');
    setErrorMessage('');

    try {
      const result = await compressImage(file, quality);
      setCompressedBlob(result.blob);

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(result.blob);
      setPreviewUrl(url);

      setStatus('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Image compression failed. Please try another file.');
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !file) return;
    const filename = getOutputFilename(file.name, 'compressed', file.name.split('.').pop());
    downloadBlob(compressedBlob, filename);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setCompressedBlob(null);
    setPreviewUrl(null);
    setErrorMessage('');
    setStatus('initial');
  };

  const originalSize = file ? file.size : 0;
  const compressedSize = compressedBlob ? compressedBlob.size : 0;
  const savedPercent =
    originalSize > 0 && compressedSize > 0
      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      : 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      {/* Initial Upload State */}
      {status === 'initial' && (
        <DropZone
          acceptedTypes={tool.acceptedFileTypes}
          maxFileSizeMB={tool.maxFileSizeMB}
          onFilesSelected={handleFileSelected}
        />
      )}

      {/* File Selected State */}
      {(status === 'file_selected' || status === 'processing') && file && (
        <div className="space-y-6">
          <SingleFilePreviewCard file={file} onReplaceFile={handleReset} />

          {/* Controls: Quality Slider */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center">
                <Sliders className="w-4 h-4 mr-2 text-blue-600 dark:text-indigo-400" strokeWidth={1.75} />
                Target Quality Level
              </label>
              <span className="text-sm font-extrabold text-blue-600 dark:text-indigo-400">
                {Math.round(quality * 100)}%
              </span>
            </div>

            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              disabled={status === 'processing'}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
              <span>Maximum Compression (Smaller Size)</span>
              <span>Maximum Quality (Larger Size)</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleReset} disabled={status === 'processing'}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCompress} disabled={status === 'processing'}>
              {status === 'processing' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Compressing...
                </>
              ) : (
                'Compress Image'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Success Result State */}
      {status === 'success' && file && compressedBlob && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" strokeWidth={1.75} />
            <h3 className="text-xl font-extrabold text-emerald-900 dark:text-emerald-100 font-heading">
              Compression Successful!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
              Processed 100% locally in your browser memory.
            </p>
          </div>

          {/* Size Metrics Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs font-semibold text-slate-500 block">Original Size</span>
              <span className="font-heading font-extrabold text-xl text-slate-900 dark:text-slate-100">
                {formatFileSize(originalSize)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block">Compressed Size</span>
              <span className="font-heading font-extrabold text-xl text-blue-900 dark:text-blue-100">
                {formatFileSize(compressedSize)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 mr-1" strokeWidth={1.75} />
                Space Saved
              </span>
              <span className="font-heading font-extrabold text-xl text-emerald-700 dark:text-emerald-300">
                -{savedPercent}%
              </span>
            </div>
          </div>

          {/* Preview Image */}
          {previewUrl && (
            <div className="flex justify-center p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <img
                src={previewUrl}
                alt="Compressed preview"
                className="max-h-64 object-contain rounded-xl shadow-md"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" size="lg" onClick={handleDownload} className="w-full sm:w-auto">
              <Download className="w-5 h-5 mr-2" strokeWidth={2} />
              Download Compressed Image
            </Button>
            <Button variant="outline" size="lg" onClick={handleReset} className="w-full sm:w-auto">
              <RotateCcw className="w-4 h-4 mr-2" strokeWidth={1.75} />
              Compress Another Image
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto" strokeWidth={1.75} />
          <h3 className="text-lg font-bold text-red-900 dark:text-red-100 font-heading">
            Compression Failed
          </h3>
          <p className="text-xs text-red-700 dark:text-red-300">
            {errorMessage || 'Unable to compress image. Please try another file.'}
          </p>
          <Button variant="danger" size="md" onClick={handleReset}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
