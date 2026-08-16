'use client';

import React from 'react';
import { ToolMetadata } from '@/types/tool';
import { ImageToPdfWorkspace } from './ImageToPdfWorkspace';

export function JpgToPdfWorkspace({ tool }: { tool: ToolMetadata }) {
  // Reuse Phase 2.2 Image to PDF engine specifically scoped to JPG files
  const jpgTool: ToolMetadata = {
    ...tool,
    acceptedFileTypes: ['image/jpeg', 'image/jpg'],
  };

  return <ImageToPdfWorkspace tool={jpgTool} />;
}
