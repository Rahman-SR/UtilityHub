/**
 * Shared File & Image Validation Utilities
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateImageFile(
  file: File,
  options: {
    maxFileSizeMB?: number;
    allowedTypes?: string[];
  } = {}
): ValidationResult {
  const { maxFileSizeMB = 50, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options;

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
      error: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum limit of ${maxFileSizeMB}MB.`,
    };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    // If mime type check fails, check extension fallback
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = allowedTypes.map((t) => t.replace('image/', '.'));
    if (!allowedExtensions.includes(ext)) {
      return {
        isValid: false,
        error: `Unsupported file type "${file.type || ext}". Please select ${allowedTypes.join(', ')}.`,
      };
    }
  }

  return { isValid: true };
}

export function verifyImageLoadable(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(true);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };

    img.src = url;
  });
}
