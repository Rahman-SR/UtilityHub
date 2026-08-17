'use client';

import React from 'react';
import { SortableFileItem } from '@/hooks/useSortableFiles';
import { formatFileSize } from '@/lib/utils';
import { GripVertical, Trash2, ChevronLeft, ChevronRight, FileText, FileImage, RotateCcw, RotateCw } from 'lucide-react';

export interface SortableFileCardProps {
  item: SortableFileItem;
  index: number;
  totalCount: number;
  isDragging?: boolean;
  isDragOver?: boolean;
  onRemove: (index: number) => void;
  onRotate?: (index: number, direction: 'cw' | 'ccw') => void;
  onMoveLeft: (index: number) => void;
  onMoveRight: (index: number) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  disabled?: boolean;
}

export function SortableFileCard({
  item,
  index,
  totalCount,
  isDragging = false,
  isDragOver = false,
  onRemove,
  onRotate,
  onMoveLeft,
  onMoveRight,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  disabled = false,
}: SortableFileCardProps) {
  const isPdf = item.file.type === 'application/pdf' || item.file.name.toLowerCase().endsWith('.pdf');
  const rotation = item.rotation || 0;

  const handleRotateClick = (direction: 'cw' | 'ccw') => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onRotate) {
      onRotate(index, direction);
    }
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onRemove(index);
  };

  const handleMoveLeftClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onMoveLeft(index);
  };

  const handleMoveRightClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onMoveRight(index);
  };

  return (
    <div
      draggable={!disabled}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#121829] border transition-all duration-200 select-none overflow-hidden ${
        isDragging
          ? 'opacity-40 border-blue-500 scale-95 shadow-lg'
          : isDragOver
          ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50 dark:bg-blue-950/40'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-indigo-600 shadow-xs hover:shadow-md'
      }`}
    >
      {/* Top Header Toolbar Bar */}
      <div className="p-2 sm:p-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/60 z-10">
        {/* Order Badge + Drag Grip */}
        <div className="flex items-center space-x-1.5">
          <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded">
            <GripVertical className="w-4 h-4" strokeWidth={1.75} />
          </div>
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-2xs">
            {index + 1}
          </span>
          {rotation > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-black tracking-tight">
              {rotation}°
            </span>
          )}
        </div>

        {/* Action Buttons: Rotation & Remove */}
        <div className="flex items-center space-x-1">
          {onRotate && item.objectUrl && (
            <>
              <button
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={handleRotateClick('ccw')}
                disabled={disabled}
                className="p-1 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors disabled:opacity-40 cursor-pointer"
                title="Rotate Left 90°"
                aria-label={`Rotate image left 90 degrees for ${item.file.name}`}
              >
                <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>

              <button
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={handleRotateClick('cw')}
                disabled={disabled}
                className="p-1 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors disabled:opacity-40 cursor-pointer"
                title="Rotate Right 90°"
                aria-label={`Rotate image right 90 degrees for ${item.file.name}`}
              >
                <RotateCw className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </>
          )}

          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleRemoveClick}
            disabled={disabled}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors disabled:opacity-40 cursor-pointer"
            title="Remove file"
            aria-label={`Remove file ${item.file.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Thumbnail Preview Area with CSS Rotation */}
      <div className="relative w-full aspect-square bg-slate-100/70 dark:bg-slate-900/80 flex items-center justify-center p-3 overflow-hidden">
        {item.objectUrl ? (
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={item.objectUrl}
              alt={item.file.name}
              style={{
                transform: `rotate(${rotation}deg)`,
                maxHeight: '100%',
                maxWidth: '100%',
              }}
              className="object-contain drop-shadow-xs transition-transform duration-200"
            />
          </div>
        ) : isPdf ? (
          <div className="flex flex-col items-center justify-center text-rose-500 dark:text-rose-400 p-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 flex items-center justify-center mb-1.5">
              <FileText className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 dark:text-rose-300">
              PDF Document
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
            <FileImage className="w-8 h-8 mb-1" strokeWidth={1.75} />
            <span className="text-[10px] font-semibold">No Preview</span>
          </div>
        )}

        {/* Keyboard Reorder Controls Overlay */}
        {!disabled && totalCount > 1 && (
          <div className="absolute inset-x-2 bottom-2 flex items-center justify-between opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity bg-slate-900/80 backdrop-blur-xs p-1 rounded-xl text-white z-20">
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleMoveLeftClick}
              disabled={index === 0}
              className="p-1 rounded-lg hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              title="Move Previous"
              aria-label={`Move file ${item.file.name} previous`}
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
            <span className="text-[10px] font-extrabold tracking-wider uppercase px-1">Move</span>
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleMoveRightClick}
              disabled={index === totalCount - 1}
              className="p-1 rounded-lg hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              title="Move Next"
              aria-label={`Move file ${item.file.name} next`}
            >
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        )}
      </div>

      {/* File Details Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#121829] z-10">
        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate leading-tight" title={item.file.name}>
          {item.file.name}
        </h4>
        <p className="text-[11px] font-medium text-slate-400 mt-0.5">
          {formatFileSize(item.file.size)}
        </p>
      </div>
    </div>
  );
}
