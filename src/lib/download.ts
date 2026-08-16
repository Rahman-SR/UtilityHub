/**
 * Reusable Client-Side Download Engine & Memory Cleanup
 */

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Schedule object URL revocation to prevent memory leaks
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getOutputFilename(
  originalFilename: string,
  suffix: string,
  targetExtension?: string
): string {
  const lastDot = originalFilename.lastIndexOf('.');
  const base = lastDot !== -1 ? originalFilename.substring(0, lastDot) : originalFilename;
  const originalExt = lastDot !== -1 ? originalFilename.substring(lastDot + 1) : 'png';
  const ext = targetExtension ? targetExtension.replace('.', '') : originalExt;

  return `${base}-${suffix}.${ext}`;
}
