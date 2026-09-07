export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function sanitizeFilename(filename: string, fallback: string = 'document'): string {
  const clean = filename.replace(/[^a-zA-Z0-9._-]/g, '_').trim();
  return clean || fallback;
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
}

export function removeFileExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}
