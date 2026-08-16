'use client';

import React, { useState, useEffect } from 'react';
import { ToolMetadata } from '@/types/tool';
import { DropZone } from '../ui/DropZone';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { resizeImage, getImageDimensions } from '@/lib/image-processing';
import { validateImageFile } from '@/lib/validation';
import { downloadBlob, getOutputFilename } from '@/lib/download';
import { formatFileSize } from '@/lib/utils';
import { FileText, Download, RotateCcw, CheckCircle2, AlertCircle, Loader2, Lock, Unlock, Maximize2 } from 'lucide-react';

export function ImageResizerWorkspace({ tool }: { tool: ToolMetadata }) {
  const [status, setStatus] = useState<'initial' | 'file_selected' | 'processing' | 'success' | 'error'>('initial');
  const [file, setFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [finalDimensions, setFinalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileSelected = async (files: File[]) => {
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

    try {
      const dimensions = await getImageDimensions(selectedFile);
      setOriginalDimensions(dimensions);
      setTargetWidth(dimensions.width);
      setTargetHeight(dimensions.height);
      setAspectRatio(dimensions.width / dimensions.height);
      setFile(selectedFile);
      setStatus('file_selected');
    } catch (err: any) {
      setErrorMessage('Could not read image dimensions. File may be corrupted.');
      setStatus('error');
    }
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (maintainAspectRatio && aspectRatio > 0) {
      setTargetHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (maintainAspectRatio && aspectRatio > 0) {
      setTargetWidth(Math.round(val * aspectRatio));
    }
  };

  const handleResize = async () => {
    if (!file) return;

    if (targetWidth <= 0 || targetHeight <= 0) {
      setErrorMessage('Width and height must be positive numbers greater than 0.');
      setStatus('error');
      return;
    }

    if (targetWidth > 10000 || targetHeight > 10000) {
      setErrorMessage('Maximum supported dimension is 10,000px.');
      setStatus('error');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    try {
      const result = await resizeImage(file, targetWidth, targetHeight, maintainAspectRatio);
      setResizedBlob(result.blob);
      setFinalDimensions({ width: result.finalWidth, height: result.finalHeight });

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(result.blob);
      setPreviewUrl(url);

      setStatus('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Image resizing failed.');
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!resizedBlob || !file) return;
    const filename = getOutputFilename(file.name, `resized-${targetWidth}x${targetHeight}`, file.name.split('.').pop());
    downloadBlob(resizedBlob, filename);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setResizedBlob(null);
    setPreviewUrl(null);
    setErrorMessage('');
    setStatus('initial');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      {/* Initial State */}
      {status === 'initial' && (
        <DropZone
          acceptedTypes={tool.acceptedFileTypes}
          maxFileSizeMB={tool.maxFileSizeMB}
          onFilesSelected={handleFileSelected}
        />
      )}

      {/* Selected / Processing State */}
      {(status === 'file_selected' || status === 'processing') && file && originalDimensions && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{file.name}</h4>
                <p className="text-xs text-slate-500">
                  Original Dimensions: {originalDimensions.width} x {originalDimensions.height} px ({formatFileSize(file.size)})
                </p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleReset} disabled={status === 'processing'}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Change Image
            </Button>
          </div>

          {/* Dimension Controls */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center">
              <Maximize2 className="w-4 h-4 mr-2 text-blue-600" />
              Set Target Dimensions
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Width (px)"
                type="number"
                min="1"
                max="10000"
                value={targetWidth}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                disabled={status === 'processing'}
              />

              <Input
                label="Height (px)"
                type="number"
                min="1"
                max="10000"
                value={targetHeight}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                disabled={status === 'processing'}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {maintainAspectRatio ? (
                  <Lock className="w-4 h-4 text-blue-600" />
                ) : (
                  <Unlock className="w-4 h-4 text-slate-400" />
                )}
                <span>Maintain Aspect Ratio ({aspectRatio.toFixed(2)}:1)</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleReset} disabled={status === 'processing'}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleResize} disabled={status === 'processing'}>
              {status === 'processing' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resizing...
                </>
              ) : (
                'Resize Image'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && resizedBlob && finalDimensions && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="text-xl font-extrabold text-emerald-900 dark:text-emerald-100 font-heading">
              Resized Successfully!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              New dimensions: {finalDimensions.width} x {finalDimensions.height} px ({formatFileSize(resizedBlob.size)})
            </p>
          </div>

          {previewUrl && (
            <div className="flex justify-center p-4 bg-slate-100 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
              <img src={previewUrl} alt="Resized preview" className="max-h-64 object-contain rounded-lg shadow-md" />
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" size="lg" onClick={handleDownload} className="w-full sm:w-auto">
              <Download className="w-5 h-5 mr-2" />
              Download Resized Image
            </Button>
            <Button variant="outline" size="lg" onClick={handleReset} className="w-full sm:w-auto">
              <RotateCcw className="w-4 h-4 mr-2" />
              Resize Another Image
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto" />
          <h3 className="text-lg font-bold text-red-900 dark:text-red-100 font-heading">Resizing Error</h3>
          <p className="text-xs text-red-700 dark:text-red-300">
            {errorMessage || 'Unable to resize image. Please check your inputs.'}
          </p>
          <Button variant="danger" size="md" onClick={handleReset}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
