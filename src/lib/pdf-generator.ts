import { jsPDF } from 'jspdf';
import { loadImage } from './image-processing';

export interface PdfOptions {
  pageSize?: 'a4' | 'letter' | 'fit';
  orientation?: 'portrait' | 'landscape';
  marginMm?: number;
}

export async function imagesToPdf(files: File[], options: PdfOptions = {}): Promise<Blob> {
  if (!files || files.length === 0) {
    throw new Error('No images provided for PDF conversion.');
  }

  const { pageSize = 'a4', orientation = 'portrait', marginMm = 10 } = options;

  let doc: jsPDF | null = null;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { img, objectUrl } = await loadImage(file);

    // Create canvas to convert image to clean data URL
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      URL.revokeObjectURL(objectUrl);
      throw new Error('Canvas context failed.');
    }
    ctx.drawImage(img, 0, 0);
    const imgDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    URL.revokeObjectURL(objectUrl);

    if (i === 0) {
      if (pageSize === 'fit') {
        doc = new jsPDF({
          orientation: img.naturalWidth > img.naturalHeight ? 'landscape' : 'portrait',
          unit: 'px',
          format: [img.naturalWidth, img.naturalHeight],
        });
        doc.addImage(imgDataUrl, 'JPEG', 0, 0, img.naturalWidth, img.naturalHeight);
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

        const imgRatio = img.naturalWidth / img.naturalHeight;
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
        doc.addPage([img.naturalWidth, img.naturalHeight], img.naturalWidth > img.naturalHeight ? 'landscape' : 'portrait');
        doc.addImage(imgDataUrl, 'JPEG', 0, 0, img.naturalWidth, img.naturalHeight);
      } else {
        doc.addPage(pageSize, orientation);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const printableWidth = pageWidth - marginMm * 2;
        const printableHeight = pageHeight - marginMm * 2;

        const imgRatio = img.naturalWidth / img.naturalHeight;
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
