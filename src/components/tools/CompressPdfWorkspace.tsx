'use client';

import React, { useState } from 'react';
import { ToolMetadata } from '@/types/tool';
import { DropZone } from '../ui/DropZone';
import { Button } from '../ui/Button';
import { SingleFilePreviewCard } from '../file-workspace/SingleFilePreviewCard';
import {
  compressPdfFile,
  COMPRESSION_PRESETS,
  CompressionPreset,
  CompressPdfResult,
} from '@/lib/pdf-compressor';
import { getPdfMetadata } from '@/lib/pdf-engine';
import { downloadBlob, getOutputFilename } from '@/lib/download';
import { formatFileSize } from '@/lib/utils';
import {
  FileArchive,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
  Zap,
  Info,
  ShieldCheck,
} from 'lucide-react';

export function CompressPdfWorkspace({ tool }: { tool: ToolMetadata }) {
  const [status, setStatus] = useState<'initial' | 'file_selected' | 'processing' | 'success' | 'error'>('initial');
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [preset, setPreset] = useState<CompressionPreset>('balanced');
  const [result, setResult] = useState<CompressPdfResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];

    try {
      const meta = await getPdfMetadata(selectedFile);
      setFile(selectedFile);
      setPageCount(meta.pageCount);
      setStatus('file_selected');
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || `Could not read "${selectedFile.name}".`);
      setStatus('error');
    }
  };

  const handleCompress = async (overridePreset?: CompressionPreset) => {
    if (!file) return;

    const targetPreset = overridePreset || preset;
    setStatus('processing');
    setErrorMessage('');

    try {
      const res = await compressPdfFile(file, { preset: targetPreset, maxFileSizeMB: tool.maxFileSizeMB });
      setResult(res);
      setStatus('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'PDF compression failed. File may be encrypted or corrupted.');
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const filename = getOutputFilename(file.name, `compressed-${preset}`, 'pdf');
    downloadBlob(result.blob, filename);
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setPreset('balanced');
    setResult(null);
    setErrorMessage('');
    setStatus('initial');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 sm:p-8 bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      {/* Upload Zone */}
      {status === 'initial' && (
        <DropZone
          acceptedTypes={tool.acceptedFileTypes || ['application/pdf']}
          maxFileSizeMB={tool.maxFileSizeMB}
          onFilesSelected={handleFileSelected}
        />
      )}

      {/* Selected / Processing State */}
      {(status === 'file_selected' || status === 'processing') && file && (
        <div className="space-y-6">
          <SingleFilePreviewCard file={file} onReplaceFile={handleReset} />

          {/* Compression Presets Selection Grid */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center">
                <FileArchive className="w-4 h-4 mr-2 text-rose-600 dark:text-rose-400" strokeWidth={1.75} />
                Select Compression Level ({pageCount} Page{pageCount > 1 ? 's' : ''})
              </h4>

              <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3 h-3 mr-1" strokeWidth={2} />
                100% Local Browser Engine
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(Object.keys(COMPRESSION_PRESETS) as CompressionPreset[]).map((key) => {
                const item = COMPRESSION_PRESETS[key];
                const isSelected = preset === key;
                return (
                  <div
                    key={key}
                    onClick={() => !status.includes('processing') && setPreset(key)}
                    className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer select-none space-y-2 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 dark:border-indigo-500 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-blue-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-blue-600 text-white dark:bg-indigo-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 dark:bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </div>
                      )}
                    </div>

                    <h5 className="font-heading font-extrabold text-base text-slate-900 dark:text-slate-100">
                      {item.name}
                    </h5>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleReset} disabled={status === 'processing'}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleCompress()}
              disabled={status === 'processing'}
              className="shadow-lg shadow-blue-500/20"
            >
              {status === 'processing' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Optimizing PDF...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2 fill-current" strokeWidth={1.75} />
                  Compress PDF Now
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && result && file && (
        <div className="space-y-6">
          {result.wasOptimized ? (
            <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 dark:text-emerald-400 mx-auto" strokeWidth={1.75} />
              <h3 className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 font-heading">
                PDF Compressed Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 font-semibold">
                Reduced file size by {result.reductionPercentage}% ({formatFileSize(result.savedBytes)} saved)
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-3">
              <Info className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto" strokeWidth={1.75} />
              <h3 className="text-xl font-extrabold text-amber-900 dark:text-amber-100 font-heading">
                Already Well Optimized
              </h3>
              <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 font-medium max-w-xl mx-auto">
                This PDF is already well optimized. We couldn&apos;t significantly reduce its size with the selected ({preset}) compression level without degrading searchable text.
              </p>
            </div>
          )}

          {/* Before / After Metrics Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs font-semibold text-slate-500 block">Original Size</span>
              <span className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 dark:text-slate-100">
                {formatFileSize(result.originalSize)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block">Compressed Size</span>
              <span className="font-heading font-extrabold text-lg sm:text-xl text-blue-900 dark:text-blue-100">
                {formatFileSize(result.compressedSize)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">Space Saved</span>
              <span className="font-heading font-extrabold text-lg sm:text-xl text-emerald-900 dark:text-emerald-100">
                {formatFileSize(result.savedBytes)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block">Reduction %</span>
              <span className="font-heading font-extrabold text-lg sm:text-xl text-indigo-900 dark:text-indigo-100">
                {result.reductionPercentage}%
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" size="lg" onClick={handleDownload} className="w-full sm:w-auto">
              <Download className="w-5 h-5 mr-2" strokeWidth={2} />
              Download {result.wasOptimized ? 'Compressed' : 'Original'} PDF ({getOutputFilename(file.name, `compressed-${preset}`, 'pdf')})
            </Button>

            {!result.wasOptimized && preset !== 'strong' && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setPreset('strong');
                  handleCompress('strong');
                }}
                className="w-full sm:w-auto text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-50"
              >
                <Zap className="w-4 h-4 mr-2" strokeWidth={1.75} />
                Try Strong Compression
              </Button>
            )}

            <Button variant="outline" size="lg" onClick={handleReset} className="w-full sm:w-auto">
              <RotateCcw className="w-4 h-4 mr-2" strokeWidth={1.75} />
              Compress Another PDF
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="p-8 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto" strokeWidth={1.75} />
          <h3 className="text-lg font-bold text-red-900 dark:text-red-100 font-heading">PDF Compression Error</h3>
          <p className="text-xs text-red-700 dark:text-red-300">
            {errorMessage || 'Unable to compress PDF document.'}
          </p>
          <Button variant="danger" size="md" onClick={handleReset}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
