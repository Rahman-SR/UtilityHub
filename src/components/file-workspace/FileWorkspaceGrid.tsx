'use client';

import React, { useRef } from 'react';
import { SortableFileItem } from '@/hooks/useSortableFiles';
import { SortableFileCard } from './SortableFileCard';
import { Button } from '../ui/Button';
import { Plus, RotateCcw, Images, Files } from 'lucide-react';

export interface FileWorkspaceGridProps {
  items: SortableFileItem[];
  title?: string;
  acceptTypes?: string[];
  onAddFiles: (files: File[]) => void;
  onRemoveItem: (index: number) => void;
  onRotateItem?: (index: number, direction: 'cw' | 'ccw') => void;
  onMoveLeft: (index: number) => void;
  onMoveRight: (index: number) => void;
  onClearAll: () => void;
  draggedIndex: number | null;
  dragOverIndex: number | null;
  onDragStart: (index: number) => (e: React.DragEvent) => void;
  onDragOver: (index: number) => (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (index: number) => (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  disabled?: boolean;
  fileTypeLabel?: string;
}

export function FileWorkspaceGrid({
  items,
  title = 'Selected Files',
  acceptTypes = ['image/jpeg', 'image/png', 'image/webp'],
  onAddFiles,
  onRemoveItem,
  onRotateItem,
  onMoveLeft,
  onMoveRight,
  onClearAll,
  draggedIndex,
  dragOverIndex,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  disabled = false,
  fileTypeLabel = 'Images',
}: FileWorkspaceGridProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(Array.from(e.target.files));
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Workspace Header Toolbar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          {fileTypeLabel === 'PDFs' ? (
            <Files className="w-5 h-5 text-rose-600 dark:text-rose-400" strokeWidth={1.75} />
          ) : (
            <Images className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
          )}
          <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100">
            {title} ({items.length})
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" strokeWidth={2} />
            <span>Add {fileTypeLabel}</span>
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            disabled={disabled || items.length === 0}
            className="text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" strokeWidth={1.75} />
            <span>Clear All</span>
          </Button>
        </div>
      </div>

      {/* Grid of Visual Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-1">
        {items.map((item, idx) => (
          <SortableFileCard
            key={item.id}
            item={item}
            index={idx}
            totalCount={items.length}
            isDragging={draggedIndex === idx}
            isDragOver={dragOverIndex === idx}
            onRemove={onRemoveItem}
            onRotate={onRotateItem}
            onMoveLeft={onMoveLeft}
            onMoveRight={onMoveRight}
            onDragStart={onDragStart(idx)}
            onDragOver={onDragOver(idx)}
            onDragLeave={onDragLeave}
            onDrop={onDrop(idx)}
            onDragEnd={onDragEnd}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
