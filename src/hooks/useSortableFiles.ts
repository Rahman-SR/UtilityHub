'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface SortableFileItem {
  id: string;
  file: File;
  objectUrl?: string;
  pageCount?: number;
  rotation?: number; // 0, 90, 180, 270
}

function createItemFromFile(file: File): SortableFileItem {
  const id = `${file.name}-${file.size}-${Math.random().toString(36).substring(2, 9)}`;
  const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(file.name);
  const objectUrl = isImage ? URL.createObjectURL(file) : undefined;
  return { id, file, objectUrl, rotation: 0 };
}

function revokeObjectUrl(item: SortableFileItem) {
  if (item.objectUrl && item.objectUrl.startsWith('blob:')) {
    URL.revokeObjectURL(item.objectUrl);
  }
}

export function useSortableFiles(initialFiles: File[] = []) {
  const [items, setItems] = useState<SortableFileItem[]>(() => initialFiles.map(createItemFromFile));
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const itemsRef = useRef<SortableFileItem[]>(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const addFiles = useCallback((newFiles: File[]) => {
    if (!newFiles || newFiles.length === 0) return;
    const newItems = newFiles.map(createItemFromFile);
    setItems((prev) => [...prev, ...newItems]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => {
      const target = prev[index];
      if (target) revokeObjectUrl(target);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const rotateItem = useCallback((index: number, direction: 'cw' | 'ccw') => {
    setItems((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const updated = [...prev];
      const currentRotation = updated[index].rotation || 0;
      const newRotation =
        direction === 'cw'
          ? (currentRotation + 90) % 360
          : (currentRotation - 90 + 360) % 360;
      updated[index] = { ...updated[index], rotation: newRotation };
      return updated;
    });
  }, []);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || toIndex < 0) return;
    setItems((prev) => {
      if (fromIndex >= prev.length || toIndex >= prev.length || fromIndex === toIndex) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }, []);

  const moveLeft = useCallback((index: number) => {
    if (index > 0) moveItem(index, index - 1);
  }, [moveItem]);

  const moveRight = useCallback((index: number) => {
    setItems((prev) => {
      if (index < prev.length - 1) {
        const updated = [...prev];
        const [moved] = updated.splice(index, 1);
        updated.splice(index + 1, 0, moved);
        return updated;
      }
      return prev;
    });
  }, []);

  const clearAll = useCallback(() => {
    itemsRef.current.forEach(revokeObjectUrl);
    setItems([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      itemsRef.current.forEach(revokeObjectUrl);
    };
  }, []);

  // Drag Event Handlers
  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (toIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const fromIndexStr = e.dataTransfer.getData('text/plain');
    const fromIndex = fromIndexStr !== '' ? parseInt(fromIndexStr, 10) : draggedIndex;

    if (fromIndex !== null && !isNaN(fromIndex) && fromIndex !== toIndex) {
      moveItem(fromIndex, toIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const reorderedFiles = items.map((item) => item.file);

  return {
    items,
    reorderedFiles,
    addFiles,
    removeItem,
    rotateItem,
    moveItem,
    moveLeft,
    moveRight,
    clearAll,
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  };
}
