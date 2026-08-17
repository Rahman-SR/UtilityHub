'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { DropZone } from '../ui/DropZone';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { resizeImage, getImageDimensions } from '@/lib/image-processing';
import { validateImageFile } from '@/lib/validation';
import { downloadBlob, getOutputFilename } from '@/lib/download';
import { formatFileSize } from '@/lib/utils';
import { SingleFilePreviewCard } from '../file-workspace/SingleFilePreviewCard';
import { Download, RotateCcw, CheckCircle2, AlertCircle, Loader2, Lock, Unlock, Maximize2, HardDrive } from 'lucide-react';

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
    } catch {
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

  // Instant Mathematical File Size Estimation
  const calculateEstimatedSize = (): string | null => {
    if (!file || !originalDimensions || targetWidth <= 0 || targetHeight <= 0) return null;
    const origArea = originalDimensions.width * originalDimensions.height;
    const targetArea = targetWidth * targetHeight;
    if (origArea <= 0 || targetArea <= 0) return null;

    const ratio = targetArea / origArea;
    const estBytes = Math.max(1024, Math.round(file.size * ratio));
    return `≈ ${formatFileSize(estBytes)}`;
  };

  const estimatedSize = calculateEstimatedSize();

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
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Image resizing failed.');
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
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
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
          <SingleFilePreviewCard file={file} onReplaceFile={handleReset} />

          {/* Dimension Controls & Live Estimation */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center">
              <Maximize2 className="w-4 h-4 mr-2 text-blue-600 dark:text-indigo-400" strokeWidth={1.75} />
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

            <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-indigo-400 cursor-pointer"
              >
                {maintainAspectRatio ? (
                  <Lock className="w-4 h-4 text-blue-600 dark:text-indigo-400" strokeWidth={1.75} />
                ) : (
                  <Unlock className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
                )}
                <span>Maintain Aspect Ratio ({aspectRatio.toFixed(2)}:1)</span>
              </button>

              {/* Estimated File Size Display */}
              <div className="flex items-center space-x-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-300">
                <HardDrive className="w-4 h-4 text-blue-600 dark:text-indigo-400" strokeWidth={1.75} />
                <span>Estimated Output Size:</span>
                <span className="text-blue-600 dark:text-indigo-400 font-black">
                  {estimatedSize || 'Enter valid dimensions to estimate output size.'}
                </span>
              </div>
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
      {status === 'success' && resizedBlob && finalDimensions && file && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" strokeWidth={1.75} />
            <h3 className="text-xl font-extrabold text-emerald-900 dark:text-emerald-100 font-heading">
              Resized Successfully!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
              New dimensions: {finalDimensions.width} × {finalDimensions.height} px
            </p>
          </div>

          {/* Size Metrics Comparison: Original vs Estimated vs Actual */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs font-semibold text-slate-500 block">Original Size</span>
              <span className="font-heading font-extrabold text-xl text-slate-900 dark:text-slate-100">
                {formatFileSize(file.size)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block">Estimated Size</span>
              <span className="font-heading font-extrabold text-xl text-indigo-900 dark:text-indigo-100">
                {estimatedSize || 'N/A'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">Actual Output Size</span>
              <span className="font-heading font-extrabold text-xl text-emerald-900 dark:text-emerald-100">
                {formatFileSize(resizedBlob.size)}
              </span>
            </div>
          </div>

          {previewUrl && (
            <div className="flex justify-center p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <img src={previewUrl} alt="Resized preview" className="max-h-64 object-contain rounded-xl shadow-md" />
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" size="lg" onClick={handleDownload} className="w-full sm:w-auto">
              <Download className="w-5 h-5 mr-2" strokeWidth={2} />
              Download Resized Image
            </Button>
            <Button variant="outline" size="lg" onClick={handleReset} className="w-full sm:w-auto">
              <RotateCcw className="w-4 h-4 mr-2" strokeWidth={1.75} />
              Resize Another Image
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto" strokeWidth={1.75} />
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
