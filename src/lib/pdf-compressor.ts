import { validatePdfFile } from './pdf-engine';

export type CompressionPreset = 'light' | 'balanced' | 'strong';

export interface CompressPdfOptions {
  preset?: CompressionPreset;
  maxFileSizeMB?: number;
}

export interface CompressPdfResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  reductionPercentage: number;
  wasOptimized: boolean;
  pageCount: number;
}

// Centralized Compression Preset Configuration
export const COMPRESSION_PRESETS: Record<
  CompressionPreset,
  {
    id: CompressionPreset;
    name: string;
    description: string;
    badge: string;
    quality: number; // JPEG Compression Quality (0.0 - 1.0)
    maxDimension: number; // Max image dimension (px)
  }
> = {
  light: {
    id: 'light',
    name: 'Light Compression',
    description: 'Better visual quality, moderate file reduction',
    badge: 'High Quality',
    quality: 0.8,
    maxDimension: 2048,
  },
  balanced: {
    id: 'balanced',
    name: 'Balanced Compression',
    description: 'Recommended default for documents & email',
    badge: 'Recommended',
    quality: 0.6,
    maxDimension: 1440,
  },
  strong: {
    id: 'strong',
    name: 'Strong Compression',
    description: 'Maximum file size reduction for large scans',
    badge: 'Smallest File',
    quality: 0.4,
    maxDimension: 1000,
  },
};

/**
 * Browser-native helper to re-encode and downsample raster image buffers
 */
async function compressRasterImageBuffer(
  bytes: Uint8Array,
  mimeType: string,
  quality: number,
  maxDimension: number
): Promise<{ newBytes: Uint8Array; width: number; height: number } | null> {
  return new Promise((resolve) => {
    try {
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        if (width <= 0 || height <= 0) {
          URL.revokeObjectURL(url);
          resolve(null);
          return;
        }

        // Downsample oversized embedded images
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

        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve(null);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        URL.revokeObjectURL(url);

        canvas.toBlob(
          async (compressedBlob) => {
            if (!compressedBlob) {
              resolve(null);
              return;
            }
            const buf = await compressedBlob.arrayBuffer();
            resolve({
              newBytes: new Uint8Array(buf),
              width,
              height,
            });
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };

      img.src = url;
    } catch {
      resolve(null);
    }
  });
}

/**
 * High-performance 100% Client-Side PDF Compressor Engine
 */
export async function compressPdfFile(
  file: File,
  options: CompressPdfOptions = {}
): Promise<CompressPdfResult> {
  const { preset = 'balanced', maxFileSizeMB = 100 } = options;

  const validation = validatePdfFile(file, maxFileSizeMB);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid PDF file.');
  }

  const presetConfig = COMPRESSION_PRESETS[preset] || COMPRESSION_PRESETS.balanced;
  const originalSize = file.size;

  const { PDFDocument, PDFName, PDFNumber, PDFRawStream } = await import('pdf-lib');
  const arrayBuffer = await file.arrayBuffer();

  let pdfDoc: any;
  try {
    pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch (err: any) {
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
