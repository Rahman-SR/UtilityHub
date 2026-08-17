'use client';

import React, { useState, useEffect } from 'react';
import { formatFileSize } from '@/lib/utils';
import { Button } from '../ui/Button';
import { FileImage, RefreshCw, RotateCcw, RotateCw } from 'lucide-react';

export interface SingleFilePreviewCardProps {
  file: File;
  onReplaceFile: () => void;
  className?: string;
  onRotationChange?: (rotation: number) => void;
}

export function SingleFilePreviewCard({
  file,
  onReplaceFile,
  className = '',
  onRotationChange,
}: SingleFilePreviewCardProps) {
  const [objectUrl] = useState<string>(() => (file ? URL.createObjectURL(file) : ''));
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [rotation, setRotation] = useState<number>(0);

  useEffect(() => {
    if (!objectUrl) return;

    const img = new Image();
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = objectUrl;

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const handleRotate = (direction: 'cw' | 'ccw') => {
    const newRotation =
      direction === 'cw'
        ? (rotation + 90) % 360
        : (rotation - 90 + 360) % 360;
    setRotation(newRotation);
    if (onRotationChange) onRotationChange(newRotation);
  };

  return (
    <div
      className={`rounded-2xl bg-white dark:bg-[#121829] border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs space-y-4 ${className}`}
    >
      {/* Thumbnail Container */}
      <div className="relative w-full h-48 sm:h-56 bg-slate-100/70 dark:bg-slate-900/80 rounded-xl flex items-center justify-center p-3 overflow-hidden">
        {objectUrl ? (
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={objectUrl}
              alt={file.name}
              style={{ transform: `rotate(${rotation}deg)` }}
              className="max-h-full max-w-full object-contain drop-shadow-xs transition-transform duration-200"
            />
          </div>
        ) : (
          <FileImage className="w-10 h-10 text-slate-400" strokeWidth={1.75} />
        )}

        {rotation > 0 && (
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-black tracking-tight shadow-md">
            {rotation}°
          </span>
        )}
      </div>

      {/* Details & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/80">
        <div className="min-w-0 flex-1">
          <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate" title={file.name}>
            {file.name}
          </h4>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            {dimensions ? `${dimensions.width} × ${dimensions.height} px` : 'Loading dimensions...'} • {formatFileSize(file.size)}
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => handleRotate('ccw')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Rotate Left 90°"
            aria-label="Rotate image left 90 degrees"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => handleRotate('cw')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Rotate Right 90°"
            aria-label="Rotate image right 90 degrees"
          >
            <RotateCw className="w-4 h-4" strokeWidth={1.75} />
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={onReplaceFile}
            className="cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.75} />
            <span>Change Image</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
