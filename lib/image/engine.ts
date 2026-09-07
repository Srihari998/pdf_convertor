import { ProcessedResult } from '../types';

export async function compressImage(
  file: File,
  quality: number = 0.75, // 0.1 to 1.0
  maxWidth?: number,
  maxHeight?: number,
  targetMime: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  const startTime = Date.now();
  onProgress?.(20, 'Loading image into canvas...');

  const image = await loadImageFromFile(file);

  onProgress?.(50, 'Downscaling and calculating compression...');
  let { width, height } = image;

  if (maxWidth && width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }
  if (maxHeight && height > maxHeight) {
    width = Math.round((width * maxHeight) / height);
    height = maxHeight;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // Fill white background for JPEGs to prevent black backgrounds on transparent PNG sources
  if (targetMime === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(image, 0, 0, width, height);

  onProgress?.(80, 'Encoding compressed image...');
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to encode image'));
      },
      targetMime,
      quality
    );
  });

  const ext = targetMime === 'image/jpeg' ? 'jpg' : targetMime === 'image/png' ? 'png' : 'webp';
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const url = URL.createObjectURL(blob);
  const savedPercent = Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100));

  onProgress?.(100, 'Complete!');
  return {
    success: true,
    outputs: [
      {
        blob,
        filename: `${baseName}_compressed.${ext}`,
        mimeType: targetMime,
        size: blob.size,
        url,
      },
    ],
    stats: {
      originalSize: file.size,
      processedSize: blob.size,
      savedPercentage: savedPercent,
      processingTimeMs: Date.now() - startTime,
    },
  };
}

export async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  format: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/png',
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  const startTime = Date.now();
  onProgress?.(20, 'Loading image...');
  const image = await loadImageFromFile(file);

  onProgress?.(50, `Resizing canvas to ${targetWidth}x${targetHeight}...`);
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  onProgress?.(80, 'Exporting resized graphic...');
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to resize image'));
      },
      format,
      0.9
    );
  });

  const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const url = URL.createObjectURL(blob);

  onProgress?.(100, 'Complete!');
  return {
    success: true,
    outputs: [
      {
        blob,
        filename: `${baseName}_${targetWidth}x${targetHeight}.${ext}`,
        mimeType: format,
        size: blob.size,
        url,
      },
    ],
    stats: {
      originalSize: file.size,
      processedSize: blob.size,
      processingTimeMs: Date.now() - startTime,
    },
  };
}

export async function convertImageFormat(
  file: File,
  targetFormat: 'image/jpeg' | 'image/png' | 'image/webp',
  quality: number = 0.9,
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  const startTime = Date.now();
  onProgress?.(30, 'Reading original format...');
  const image = await loadImageFromFile(file);

  onProgress?.(60, `Converting to ${targetFormat.split('/')[1].toUpperCase()}...`);
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  if (targetFormat === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, image.width, image.height);
  }

  ctx.drawImage(image, 0, 0);

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to convert image format'));
      },
      targetFormat,
      quality
    );
  });

  const ext = targetFormat === 'image/jpeg' ? 'jpg' : targetFormat === 'image/png' ? 'png' : 'webp';
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const url = URL.createObjectURL(blob);

  onProgress?.(100, 'Complete!');
  return {
    success: true,
    outputs: [
      {
        blob,
        filename: `${baseName}_converted.${ext}`,
        mimeType: targetFormat,
        size: blob.size,
        url,
      },
    ],
    stats: {
      originalSize: file.size,
      processedSize: blob.size,
      processingTimeMs: Date.now() - startTime,
    },
  };
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image file'));
    };
    img.src = url;
  });
}
