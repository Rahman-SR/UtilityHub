'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { DropZone } from '../ui/DropZone';
import { Button } from '../ui/Button';
import { convertPngToJpg } from '@/lib/image-processing';
import { validateImageFile } from '@/lib/validation';
import { downloadBlob, getOutputFilename } from '@/lib/download';
import { formatFileSize } from '@/lib/utils';
import { FileText, Download, RotateCcw, CheckCircle2, AlertCircle, Loader2, Sliders, Palette } from 'lucide-react';

export function PngToJpgWorkspace({ tool }: { tool: ToolMetadata }) {
  const [status, setStatus] = useState<'initial' | 'file_selected' | 'processing' | 'success' | 'error'>('initial');
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(0.9);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];

    const validation = validateImageFile(selectedFile, {
      maxFileSizeMB: tool.maxFileSizeMB,
      allowedTypes: ['image/png'],
    });

    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please select a valid PNG image.');
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
      const result = await convertPngToJpg(file, quality, bgColor);
      setConvertedBlob(result.blob);
      setDimensions(result.dimensions);

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(result.blob);
      setPreviewUrl(url);

      setStatus('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'PNG to JPG conversion failed.');
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!convertedBlob || !file) return;
    const filename = getOutputFilename(file.name, 'converted', 'jpg');
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
          acceptedTypes={['image/png']}
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
                <p className="text-xs text-slate-500">Size: {formatFileSize(file.size)} | Format: PNG</p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleReset} disabled={status === 'processing'}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Change File
            </Button>
          </div>

          {/* Controls: Background Fill & Quality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center">
                <Palette className="w-4 h-4 mr-2 text-blue-600" />
                Background Color (For Transparent PNGs)
              </label>

              <div className="flex items-center space-x-3">
                {[
                  { name: 'White', hex: '#FFFFFF' },
                  { name: 'Black', hex: '#000000' },
                  { name: 'Gray', hex: '#F1F5F9' },
                ].map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setBgColor(c.hex)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center space-x-2 transition-all ${
                      bgColor === c.hex
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center">
                  <Sliders className="w-4 h-4 mr-2 text-blue-600" />
                  JPEG Quality Level
                </label>
                <span className="text-xs font-extrabold text-blue-600">{Math.round(quality * 100)}%</span>
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
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleReset} disabled={status === 'processing'}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConvert} disabled={status === 'processing'}>
              {status === 'processing' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Converting to JPG...
                </>
              ) : (
                'Convert to JPG'
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
              Converted to JPG!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Dimensions: {dimensions.width} x {dimensions.height} px ({formatFileSize(convertedBlob.size)})
            </p>
          </div>

          {previewUrl && (
            <div className="flex justify-center p-4 bg-slate-100 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
              <img src={previewUrl} alt="Converted JPG preview" className="max-h-64 object-contain rounded-lg shadow-md" />
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" size="lg" onClick={handleDownload} className="w-full sm:w-auto">
              <Download className="w-5 h-5 mr-2" />
              Download JPG Image
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
            {errorMessage || 'Unable to convert PNG to JPG.'}
          </p>
          <Button variant="danger" size="md" onClick={handleReset}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
