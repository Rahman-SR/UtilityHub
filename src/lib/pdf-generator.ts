import { loadImage } from './image-processing';

export interface PdfOptions {
  pageSize?: 'a4' | 'letter' | 'fit';
  orientation?: 'portrait' | 'landscape';
  marginMm?: number;
}

export interface ImageInputItem {
  file: File;
  rotation?: number; // 0, 90, 180, 270
}

export async function imagesToPdf(
  inputItems: (File | ImageInputItem)[],
  options: PdfOptions = {}
): Promise<Blob> {
  if (!inputItems || inputItems.length === 0) {
    throw new Error('No images provided for PDF conversion.');
  }

  const normalizedItems: ImageInputItem[] = inputItems.map((item) =>
    item instanceof File ? { file: item, rotation: 0 } : item
  );

  const { jsPDF } = await import('jspdf');
  const { pageSize = 'a4', orientation = 'portrait', marginMm = 10 } = options;

  let doc: any = null;

  for (let i = 0; i < normalizedItems.length; i++) {
    const { file, rotation = 0 } = normalizedItems[i];
    const { img, objectUrl } = await loadImage(file);

    const normRotation = ((rotation % 360) + 360) % 360;
    const is90or270 = normRotation === 90 || normRotation === 270;

    const targetWidth = is90or270 ? img.naturalHeight : img.naturalWidth;
    const targetHeight = is90or270 ? img.naturalWidth : img.naturalHeight;

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      URL.revokeObjectURL(objectUrl);
      throw new Error('Canvas context failed.');
    }

    if (normRotation === 90) {
      ctx.translate(canvas.width, 0);
      ctx.rotate((90 * Math.PI) / 180);
    } else if (normRotation === 180) {
      ctx.translate(canvas.width, canvas.height);
      ctx.rotate((180 * Math.PI) / 180);
    } else if (normRotation === 270) {
      ctx.translate(0, canvas.height);
      ctx.rotate((270 * Math.PI) / 180);
    }

    ctx.drawImage(img, 0, 0);
    const imgDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    URL.revokeObjectURL(objectUrl);

    if (i === 0) {
      if (pageSize === 'fit') {
        doc = new jsPDF({
          orientation: targetWidth > targetHeight ? 'landscape' : 'portrait',
          unit: 'px',
          format: [targetWidth, targetHeight],
        });
        doc.addImage(imgDataUrl, 'JPEG', 0, 0, targetWidth, targetHeight);
      } else {
        doc = new jsPDF({
          orientation,
          unit: 'mm',
          format: pageSize,
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const printableWidth = pageWidth - marginMm * 2;
        const printableHeight = pageHeight - marginMm * 2;

        const imgRatio = targetWidth / targetHeight;
        const pageRatio = printableWidth / printableHeight;

        let renderWidth = printableWidth;
        let renderHeight = printableHeight;

        if (imgRatio > pageRatio) {
          renderHeight = printableWidth / imgRatio;
        } else {
          renderWidth = printableHeight * imgRatio;
        }

        const x = marginMm + (printableWidth - renderWidth) / 2;
        const y = marginMm + (printableHeight - renderHeight) / 2;

        doc.addImage(imgDataUrl, 'JPEG', x, y, renderWidth, renderHeight);
      }
    } else if (doc) {
      if (pageSize === 'fit') {
        doc.addPage([targetWidth, targetHeight], targetWidth > targetHeight ? 'landscape' : 'portrait');
        doc.addImage(imgDataUrl, 'JPEG', 0, 0, targetWidth, targetHeight);
      } else {
        doc.addPage(pageSize, orientation);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const printableWidth = pageWidth - marginMm * 2;
        const printableHeight = pageHeight - marginMm * 2;

        const imgRatio = targetWidth / targetHeight;
        const pageRatio = printableWidth / printableHeight;

        let renderWidth = printableWidth;
        let renderHeight = printableHeight;

        if (imgRatio > pageRatio) {
          renderHeight = printableWidth / imgRatio;
        } else {
          renderWidth = printableHeight * imgRatio;
        }

        const x = marginMm + (printableWidth - renderWidth) / 2;
        const y = marginMm + (printableHeight - renderHeight) / 2;

        doc.addImage(imgDataUrl, 'JPEG', x, y, renderWidth, renderHeight);
      }
    }
  }

  if (!doc) {
    throw new Error('PDF document creation failed.');
  }

  return doc.output('blob');
}
