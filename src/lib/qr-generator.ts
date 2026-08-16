import QRCode from 'qrcode';

export interface QrOptions {
  width?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

export async function generateQrDataUrl(text: string, options: QrOptions = {}): Promise<string> {
  if (!text || text.trim().length === 0) {
    throw new Error('Please enter text or a URL to generate a QR code.');
  }

  const { width = 300, errorCorrectionLevel = 'M', margin = 2, color = { dark: '#000000', light: '#FFFFFF' } } = options;

  return QRCode.toDataURL(text.trim(), {
    width,
    errorCorrectionLevel,
    margin,
    color,
  });
}

export async function generateQrBlob(text: string, options: QrOptions = {}): Promise<Blob> {
  const dataUrl = await generateQrDataUrl(text, options);
  const response = await fetch(dataUrl);
  return response.blob();
}
