'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { DropZone } from '../ui/DropZone';
import { Button } from '../ui/Button';
import { convertJpgToPng } from '@/lib/image-processing';
import { validateImageFile } from '@/lib/validation';
import { downloadBlob, getOutputFilename } from '@/lib/download';
import { formatFileSize } from '@/lib/utils';
import { FileText, Download, RotateCcw, CheckCircle2, AlertCircle, Loader2, ArrowRightLeft } from 'lucide-react';

export function JpgToPngWorkspace({ tool }: { tool: ToolMetadata }) {
  const [status, setStatus] = useState<'initial' | 'file_selected' | 'processing' | 'success' | 'error'>('initial');
  const [file, setFile] = useState<File | null>(null);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];

    const validation = validateImageFile(selectedFile, {
      maxFileSizeMB: tool.maxFileSizeMB,
      allowedTypes: ['image/jpeg', 'image/jpg'],
    });

    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please select a valid JPG or JPEG image.');
      setStatus('error');
      return;
    }

    setFile(selectedFile);
    setStatus('file_selected');
  };

  const handleConvert = async () => {
    if (!file) return;
    setStatus('processing');
    setErrorMessage('');

    try {
      const result = await convertJpgToPng(file);
      setConvertedBlob(result.blob);
      setDimensions(result.dimensions);

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(result.blob);
      setPreviewUrl(url);

      setStatus('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'JPG to PNG conversion failed.');
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!convertedBlob || !file) return;
    const filename = getOutputFilename(file.name, 'converted', 'png');
    downloadBlob(convertedBlob, filename);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setConvertedBlob(null);
    setPreviewUrl(null);
    setErrorMessage('');
    setStatus('initial');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      {/* Initial Upload */}
      {status === 'initial' && (
        <DropZone
          acceptedTypes={['image/jpeg']}
          maxFileSizeMB={tool.maxFileSizeMB}
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
                <p className="text-xs text-slate-500">Size: {formatFileSize(file.size)} | Format: JPEG</p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleReset} disabled={status === 'processing'}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Change File
            </Button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 flex items-center justify-center space-x-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span>JPG / JPEG</span>
            <ArrowRightLeft className="w-5 h-5 text-blue-600" />
            <span className="text-blue-600 dark:text-blue-400 font-bold">Lossless PNG</span>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleReset} disabled={status === 'processing'}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConvert} disabled={status === 'processing'}>
              {status === 'processing' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Converting to PNG...
                </>
              ) : (
                'Convert to PNG'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && convertedBlob && dimensions && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="text-xl font-extrabold text-emerald-900 dark:text-emerald-100 font-heading">
              Converted to PNG!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Dimensions: {dimensions.width} x {dimensions.height} px ({formatFileSize(convertedBlob.size)})
            </p>
          </div>

          {previewUrl && (
            <div className="flex justify-center p-4 bg-slate-100 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
              <img src={previewUrl} alt="Converted PNG preview" className="max-h-64 object-contain rounded-lg shadow-md" />
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" size="lg" onClick={handleDownload} className="w-full sm:w-auto">
              <Download className="w-5 h-5 mr-2" />
              Download PNG Image
            </Button>
            <Button variant="outline" size="lg" onClick={handleReset} className="w-full sm:w-auto">
              <RotateCcw className="w-4 h-4 mr-2" />
              Convert Another Image
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto" />
          <h3 className="text-lg font-bold text-red-900 dark:text-red-100 font-heading">Conversion Error</h3>
          <p className="text-xs text-red-700 dark:text-red-300">
            {errorMessage || 'Unable to convert image to PNG.'}
          </p>
          <Button variant="danger" size="md" onClick={handleReset}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
