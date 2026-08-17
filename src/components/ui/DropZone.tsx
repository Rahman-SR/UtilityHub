'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, ShieldCheck, FileText } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface DropZoneProps {
  acceptedTypes?: string[];
  maxFileSizeMB?: number;
  onFilesSelected?: (files: File[]) => void;
  multiple?: boolean;
}

export function DropZone({
  acceptedTypes = ['*'],
  maxFileSizeMB = 50,
  onFilesSelected,
  multiple = false,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray: File[] = Array.from(e.dataTransfer.files);
      if (onFilesSelected) onFilesSelected(filesArray);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray: File[] = Array.from(e.target.files);
      if (onFilesSelected) onFilesSelected(filesArray);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        'relative group cursor-pointer border-2 border-dashed rounded-3xl p-6 sm:p-8 md:p-10 text-center transition-all duration-200',
        isDragging
          ? 'border-blue-500 bg-blue-100/70 dark:bg-blue-950/60 scale-[1.01] shadow-xl shadow-blue-500/15'
          : 'border-blue-200 dark:border-indigo-900/60 bg-blue-50/50 dark:bg-indigo-950/20 hover:border-blue-400 dark:hover:border-indigo-600 hover:bg-blue-50/80 dark:hover:bg-indigo-950/40 shadow-xs'
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(',')}
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-indigo-950 text-blue-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 group-hover:rotate-2 transition-all duration-200 shadow-xs border border-blue-200/50 dark:border-indigo-800/50">
          <UploadCloud className="w-7 h-7" strokeWidth={1.75} />
        </div>

        <div className="space-y-1 max-w-md">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 font-heading">
            Choose files or drag & drop here
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Supports {acceptedTypes.join(', ')} up to {maxFileSizeMB}MB
          </p>
        </div>

        <Button variant="primary" size="md" type="button" className="mt-1 pointer-events-none shadow-md shadow-blue-600/20 group-hover:scale-105 group-hover:bg-blue-500">
          <FileText className="w-4 h-4 mr-2" strokeWidth={1.75} />
          Select File{multiple ? 's' : ''}
        </Button>

        <div className="pt-2 flex items-center justify-center space-x-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />
          <span>100% Private — Files never leave your browser</span>
        </div>
      </div>
    </div>
  );
}
