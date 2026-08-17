import { ValidationResult } from './validation';
import { validatePdfFile } from './pdf-engine';

export type CompressionPreset = 'light' | 'balanced' | 'strong';

export interface CompressionOptions {
  preset?: CompressionPreset;
  maxFileSizeMB?: number;
}

export interface CompressionResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  reductionPercentage: number;
  wasOptimized: boolean;
  pageCount: number;
}

export interface PresetSettings {
  name: string;
  badge: string;
  quality: number;
  maxDimension: number;
  description: string;
}

export const COMPRESSION_PRESETS: Record<CompressionPreset, PresetSettings> = {
  light: {
    name: 'Light Compression',
    badge: 'High Quality',
    quality: 0.85,
    maxDimension: 1800,
    description: 'Light compression — Highest visual clarity with moderate size reduction.',
  },
  balanced: {
    name: 'Balanced Compression',
    badge: 'Recommended',
    quality: 0.72,
    maxDimension: 1400,
    description: 'Balanced (Recommended) — Optimal balance between clarity and file size.',
  },
  strong: {
    name: 'Strong Compression',
    badge: 'Smallest File',
    quality: 0.55,
    maxDimension: 1000,
    description: 'Strong compression — Maximum file size reduction for email and web uploads.',
  },
};

/**
 * Downsample raster image bytes using HTML5 Canvas
 */
async function compressRasterImageBuffer(
  imageBytes: Uint8Array,
  mimeType: string,
  quality: number,
  maxDimension: number
): Promise<{ newBytes: Uint8Array; width: number; height: number } | null> {
  if (typeof window === 'undefined') return null;

  try {
    const blob = new Blob([imageBytes as BlobPart], { type: mimeType });
    const objectUrl = URL.createObjectURL(blob);

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = (e) => reject(e);
      image.src = objectUrl;
    });

    URL.revokeObjectURL(objectUrl);

    let { naturalWidth: width, naturalHeight: height } = img;
    if (width === 0 || height === 0) return null;

    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const compressedBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', quality);
    });

    if (!compressedBlob) return null;

    const newArrayBuffer = await compressedBlob.arrayBuffer();
    return {
      newBytes: new Uint8Array(newArrayBuffer),
      width,
      height,
    };
  } catch {
    return null;
  }
}

/**
 * 100% Client-Side PDF Compressor Engine
 */
export async function compressPdf(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const { preset = 'balanced', maxFileSizeMB = 100 } = options;

  const validation: ValidationResult = validatePdfFile(file, maxFileSizeMB);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid PDF file.');
  }

  const presetConfig = COMPRESSION_PRESETS[preset] || COMPRESSION_PRESETS.balanced;
  const originalSize = file.size;

  const { PDFDocument, PDFName, PDFNumber, PDFRawStream } = await import('pdf-lib');
  const arrayBuffer = await file.arrayBuffer();

  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch {
    throw new Error(`Could not load "${file.name}". File may be password protected or corrupted.`);
  }

  const pageCount = pdfDoc.getPageCount();
  const indirectObjects = pdfDoc.context.enumerateIndirectObjects();

  // Iterate over PDF indirect object streams to downsample embedded image XObjects
  for (const [ref, obj] of indirectObjects) {
    if (obj instanceof PDFRawStream && obj.dict) {
      const subtype = obj.dict.get(PDFName.of('Subtype'));
      if (subtype === PDFName.of('Image')) {
        const filter = obj.dict.get(PDFName.of('Filter'));
        let mimeType = 'image/jpeg';
        if (filter === PDFName.of('FlateDecode')) {
          mimeType = 'image/png';
        }

        try {
          const rawBytes = obj.contents;
          if (rawBytes && rawBytes.length > 5000) {
            const compressed = await compressRasterImageBuffer(
              rawBytes,
              mimeType,
              presetConfig.quality,
              presetConfig.maxDimension
            );

            if (compressed && compressed.newBytes.length < rawBytes.length) {
              obj.dict.set(PDFName.of('Length'), PDFNumber.of(compressed.newBytes.length));
              obj.dict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
              obj.dict.set(PDFName.of('Width'), PDFNumber.of(compressed.width));
              obj.dict.set(PDFName.of('Height'), PDFNumber.of(compressed.height));
              obj.dict.delete(PDFName.of('DecodeParms'));

              const newStream = PDFRawStream.of(obj.dict, compressed.newBytes);
              pdfDoc.context.assign(ref, newStream);
            }
          }
        } catch {
          // Skip unparseable streams safely
        }
      }
    }
  }

  // Compress PDF object streams and structure
  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  const compressedSize = pdfBytes.byteLength;

  // Honest check: Only treat as optimized if file actually shrunk
  const isSmaller = compressedSize < originalSize * 0.98;
  const savedBytes = isSmaller ? originalSize - compressedSize : 0;
  const reductionPercentage = isSmaller ? Math.round((savedBytes / originalSize) * 100) : 0;

  const finalBlob = isSmaller
    ? new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
    : new Blob([arrayBuffer], { type: 'application/pdf' });

  return {
    blob: finalBlob,
    originalSize,
    compressedSize: isSmaller ? compressedSize : originalSize,
    savedBytes,
    reductionPercentage,
    wasOptimized: isSmaller,
    pageCount,
  };
}

export const compressPdfFile = compressPdf;
export type CompressPdfResult = CompressionResult;
