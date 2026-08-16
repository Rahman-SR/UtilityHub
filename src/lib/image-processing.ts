/**
 * Browser-Side HTML5 Canvas Image Processing Engine
 * 100% Client-Side. No server uploads.
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export function loadImage(file: File): Promise<{ img: HTMLImageElement; objectUrl: string }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => resolve({ img, objectUrl });
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image file. File may be corrupted or unreadable.'));
    };

    img.src = objectUrl;
  });
}

export async function getImageDimensions(file: File): Promise<ImageDimensions> {
  const { img, objectUrl } = await loadImage(file);
  const dimensions = { width: img.naturalWidth, height: img.naturalHeight };
  URL.revokeObjectURL(objectUrl);
  return dimensions;
}

export async function compressImage(
  file: File,
  quality: number = 0.8,
  targetMimeType?: string
): Promise<{ blob: Blob; dimensions: ImageDimensions }> {
  const { img, objectUrl } = await loadImage(file);

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    URL.revokeObjectURL(objectUrl);
    throw new Error('Canvas 2D context creation failed.');
  }

  // Preserve image quality smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const mimeType = targetMimeType || file.type || 'image/jpeg';

  // Fill white background if converting transparent image to JPEG
  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(objectUrl);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Image compression blob generation failed.'));
          return;
        }
        resolve({
          blob,
          dimensions: { width: canvas.width, height: canvas.height },
        });
      },
      mimeType,
      quality
    );
  });
}

export async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  maintainAspectRatio: boolean = true
): Promise<{ blob: Blob; finalWidth: number; finalHeight: number }> {
  const { img, objectUrl } = await loadImage(file);

  let width = targetWidth;
  let height = targetHeight;

  if (maintainAspectRatio) {
    const ratio = img.naturalWidth / img.naturalHeight;
    if (width / height > ratio) {
      width = Math.round(height * ratio);
    } else {
      height = Math.round(width / ratio);
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    URL.revokeObjectURL(objectUrl);
    throw new Error('Canvas 2D context creation failed.');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (file.type === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(img, 0, 0, width, height);
  URL.revokeObjectURL(objectUrl);

  const mimeType = file.type || 'image/jpeg';

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Image resize blob generation failed.'));
          return;
        }
        resolve({ blob, finalWidth: width, finalHeight: height });
      },
      mimeType,
      0.92
    );
  });
}

export async function convertJpgToPng(file: File): Promise<{ blob: Blob; dimensions: ImageDimensions }> {
  const { img, objectUrl } = await loadImage(file);

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    URL.revokeObjectURL(objectUrl);
    throw new Error('Canvas 2D context creation failed.');
  }

  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(objectUrl);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('PNG conversion failed.'));
        return;
      }
      resolve({ blob, dimensions: { width: canvas.width, height: canvas.height } });
    }, 'image/png');
  });
}

export async function convertPngToJpg(
  file: File,
  quality: number = 0.9,
  backgroundColor: string = '#FFFFFF'
): Promise<{ blob: Blob; dimensions: ImageDimensions }> {
  const { img, objectUrl } = await loadImage(file);

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    URL.revokeObjectURL(objectUrl);
    throw new Error('Canvas 2D context creation failed.');
  }

  // Pre-fill solid background color to replace PNG transparency safely
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(objectUrl);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('JPEG conversion failed.'));
          return;
        }
        resolve({ blob, dimensions: { width: canvas.width, height: canvas.height } });
      },
      'image/jpeg',
      quality
    );
  });
}
