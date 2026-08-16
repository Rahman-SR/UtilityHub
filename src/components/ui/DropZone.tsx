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
      const filesArray = Array.from(e.dataTransfer.files);
      if (onFilesSelected) onFilesSelected(filesArray);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
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
        'relative group cursor-pointer border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all duration-200',
        isDragging
          ? 'border-indigo-500 bg-indigo-100/70 dark:bg-indigo-950/60 scale-[1.01] shadow-xl shadow-indigo-500/15'
          : 'border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40 shadow-xs'
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

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-2 transition-all duration-200 shadow-sm border border-indigo-200/50 dark:border-indigo-800/50">
          <UploadCloud className="w-8 h-8" />
        </div>

        <div className="space-y-1.5 max-w-md">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-heading">
            Choose files or drag & drop here
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Supports {acceptedTypes.join(', ')} up to {maxFileSizeMB}MB
          </p>
        </div>

        <Button variant="primary" size="md" type="button" className="mt-2 pointer-events-none shadow-lg shadow-indigo-600/30 group-hover:scale-105 group-hover:bg-indigo-500 group-hover:shadow-xl group-hover:shadow-indigo-600/40">
          <FileText className="w-4 h-4 mr-2" />
          Select File{multiple ? 's' : ''}
        </Button>

        <div className="pt-3 flex items-center justify-center space-x-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Private — Files never leave your browser</span>
        </div>
      </div>
    </div>
  );
}
