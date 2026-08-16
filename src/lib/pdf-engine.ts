import { PDFDocument } from 'pdf-lib';
import { ValidationResult } from './validation';

export function validatePdfFile(
  file: File,
  maxFileSizeMB: number = 100
): ValidationResult {
  if (!file) {
    return { isValid: false, error: 'No file provided.' };
  }

  if (file.size === 0) {
    return { isValid: false, error: 'File is empty (0 bytes).' };
  }

  const maxSizeBytes = maxFileSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum browser limit of ${maxFileSizeMB}MB. Processing occurs locally in browser memory.`,
    };
  }

  const isPdfType = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdfType) {
    return {
      isValid: false,
      error: `Invalid file format "${file.type || file.name}". Please select a valid PDF file.`,
    };
  }

  return { isValid: true };
}

export async function getPdfMetadata(file: File): Promise<{ pageCount: number; fileSize: number }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    return {
      pageCount: pdfDoc.getPageCount(),
      fileSize: file.size,
    };
  } catch (err: any) {
    throw new Error(`Could not read PDF metadata for "${file.name}". File may be password protected or corrupted.`);
  }
}

/**
 * Parse range string like "1-3, 5, 8-10" into 0-indexed page indices.
 */
export function parsePageRange(rangeStr: string, totalPages: number): number[] {
  if (!rangeStr || rangeStr.trim().length === 0) {
    throw new Error('Please enter a page range (e.g. 1-3, 5, 8-10).');
  }

  const cleanStr = rangeStr.trim();
  // Validate characters: allowed digits, hyphens, commas, spaces
  if (!/^[0-9\s,-]+$/.test(cleanStr)) {
    throw new Error('Invalid characters in page range. Use numbers, hyphens (-), and commas (,).');
  }

  const indicesSet = new Set<number>();
  const parts = cleanStr.split(',').map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const rangeParts = part.split('-').map((p) => p.trim());
      if (rangeParts.length !== 2 || !rangeParts[0] || !rangeParts[1]) {
        throw new Error(`Invalid range format "${part}". Expected format like "1-5".`);
      }

      const start = parseInt(rangeParts[0], 10);
      const end = parseInt(rangeParts[1], 10);

      if (isNaN(start) || isNaN(end)) {
        throw new Error(`Invalid numbers in range "${part}".`);
      }

      if (start > end) {
        throw new Error(`Invalid range "${part}". Start page (${start}) cannot be greater than end page (${end}).`);
      }

      if (start < 1 || end > totalPages) {
        throw new Error(`Page range "${part}" is out of bounds. Document contains ${totalPages} page(s).`);
      }

      for (let i = start; i <= end; i++) {
        indicesSet.add(i - 1); // 0-indexed
      }
    } else {
      const page = parseInt(part, 10);
      if (isNaN(page)) {
        throw new Error(`Invalid page number "${part}".`);
      }

      if (page < 1 || page > totalPages) {
        throw new Error(`Page number ${page} is out of bounds. Document contains ${totalPages} page(s).`);
      }

      indicesSet.add(page - 1); // 0-indexed
    }
  }

  const sortedIndices = Array.from(indicesSet).sort((a, b) => a - b);
  if (sortedIndices.length === 0) {
    throw new Error('No valid pages selected.');
  }

  return sortedIndices;
}

export async function mergePdfs(files: File[]): Promise<Blob> {
  if (!files || files.length < 2) {
    throw new Error('Please select at least two PDF files to merge.');
  }

  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    } catch (err: any) {
      throw new Error(`Failed to process "${file.name}". File may be password protected or unreadable.`);
    }
  }

  const pdfBytes = await mergedPdf.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export async function splitPdf(file: File, pageRangeStr: string): Promise<{ blob: Blob; extractedPageCount: number }> {
  if (!file) {
    throw new Error('No PDF file provided.');
  }

  const arrayBuffer = await file.arrayBuffer();
  let srcDoc: PDFDocument;
  try {
    srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch (err: any) {
    throw new Error(`Could not load PDF "${file.name}". File may be encrypted or corrupted.`);
  }

  const totalPages = srcDoc.getPageCount();
  const pageIndices = parsePageRange(pageRangeStr, totalPages);

  const splitDoc = await PDFDocument.create();
  const copiedPages = await splitDoc.copyPages(srcDoc, pageIndices);
  copiedPages.forEach((page) => splitDoc.addPage(page));

  const pdfBytes = await splitDoc.save();
  return {
    blob: new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' }),
    extractedPageCount: pageIndices.length,
  };
}
