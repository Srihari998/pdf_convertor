import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { ProcessedResult, ProcessedOutputFile } from '../types';

export async function getPdfPageCount(arrayBuffer: ArrayBuffer): Promise<number> {
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return pdfDoc.getPageCount();
}

/**
 * Merge multiple PDF files into one
 */
export async function mergePdfs(
  files: { name: string; buffer: ArrayBuffer }[],
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  const startTime = Date.now();
  let totalOriginalSize = 0;
  files.forEach((f) => (totalOriginalSize += f.buffer.byteLength));

  onProgress?.(10, 'Initializing merged document...');
  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.(
      Math.round(15 + ((i + 1) / files.length) * 70),
      `Copying pages from ${file.name} (${i + 1}/${files.length})...`
    );

    const doc = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  onProgress?.(90, 'Saving merged PDF...');
  const mergedBytes = await mergedPdf.save();
  const blob = new Blob([mergedBytes as any], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  onProgress?.(100, 'Complete!');
  return {
    success: true,
    outputs: [
      {
        blob,
        filename: 'merged_document.pdf',
        mimeType: 'application/pdf',
        size: blob.size,
        url,
      },
    ],
    stats: {
      originalSize: totalOriginalSize,
      processedSize: blob.size,
      pageCount: mergedPdf.getPageCount(),
      processingTimeMs: Date.now() - startTime,
    },
  };
}

/**
 * Split PDF into single pages or a custom range
 */
export async function splitPdf(
  buffer: ArrayBuffer,
  filename: string,
  mode: 'all_pages' | 'range',
  rangeStr?: string,
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  const startTime = Date.now();
  onProgress?.(10, 'Loading PDF document...');
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();
  const outputs: ProcessedOutputFile[] = [];
  const baseName = filename.replace(/\.[^/.]+$/, '');

  if (mode === 'all_pages') {
    for (let i = 0; i < totalPages; i++) {
      onProgress?.(
        Math.round(15 + ((i + 1) / totalPages) * 75),
        `Extracting page ${i + 1} of ${totalPages}...`
      );
      const newDoc = await PDFDocument.create();
      const [copiedPage] = await newDoc.copyPages(srcDoc, [i]);
      newDoc.addPage(copiedPage);
      const bytes = await newDoc.save();
      const blob = new Blob([bytes as any], { type: 'application/pdf' });
      outputs.push({
        blob,
        filename: `${baseName}_page_${i + 1}.pdf`,
        mimeType: 'application/pdf',
        size: blob.size,
        url: URL.createObjectURL(blob),
      });
    }
  } else {
    // Custom range like '1-3, 5, 8-10'
    const pageIndices = parsePageRanges(rangeStr || `1-${totalPages}`, totalPages);
    onProgress?.(40, `Extracting ${pageIndices.length} specified pages...`);
    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
    copiedPages.forEach((p) => newDoc.addPage(p));
    const bytes = await newDoc.save();
    const blob = new Blob([bytes as any], { type: 'application/pdf' });
    outputs.push({
      blob,
      filename: `${baseName}_split_range.pdf`,
      mimeType: 'application/pdf',
      size: blob.size,
      url: URL.createObjectURL(blob),
    });
  }

  onProgress?.(100, 'Complete!');
  return {
    success: true,
    outputs,
    stats: {
      originalSize: buffer.byteLength,
      processedSize: outputs.reduce((acc, o) => acc + o.size, 0),
      pageCount: outputs.length,
      processingTimeMs: Date.now() - startTime,
    },
  };
}

/**
 * Delete specified pages from PDF
 */
export async function deletePdfPages(
  buffer: ArrayBuffer,
  filename: string,
  pagesToDelete: number[],
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  const startTime = Date.now();
  onProgress?.(20, 'Loading PDF...');
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  const toDeleteSet = new Set(pagesToDelete.map((p) => p - 1)); // 0-indexed
  const keepIndices: number[] = [];
  for (let i = 0; i < totalPages; i++) {
    if (!toDeleteSet.has(i)) {
      keepIndices.push(i);
    }
  }

  if (keepIndices.length === 0) {
    throw new Error('Cannot delete all pages from the document.');
  }

  onProgress?.(50, 'Removing specified pages...');
  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, keepIndices);
  copiedPages.forEach((p) => newDoc.addPage(p));

  onProgress?.(85, 'Saving trimmed document...');
  const bytes = await newDoc.save();
  const blob = new Blob([bytes as any], { type: 'application/pdf' });
  const baseName = filename.replace(/\.[^/.]+$/, '');

  onProgress?.(100, 'Complete!');
  return {
    success: true,
    outputs: [
      {
        blob,
        filename: `${baseName}_deleted_pages.pdf`,
        mimeType: 'application/pdf',
        size: blob.size,
        url: URL.createObjectURL(blob),
      },
    ],
    stats: {
      originalSize: buffer.byteLength,
      processedSize: blob.size,
      pageCount: newDoc.getPageCount(),
      processingTimeMs: Date.now() - startTime,
    },
  };
}

/**
 * Extract specific pages into a new PDF
 */
export async function extractPdfPages(
  buffer: ArrayBuffer,
  filename: string,
  pagesToExtract: number[],
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  const startTime = Date.now();
  onProgress?.(20, 'Loading PDF...');
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  const validIndices = pagesToExtract
    .map((p) => p - 1)
    .filter((idx) => idx >= 0 && idx < totalPages);

  if (validIndices.length === 0) {
    throw new Error('No valid pages specified for extraction.');
  }

  onProgress?.(50, 'Extracting selected pages...');
  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, validIndices);
  copiedPages.forEach((p) => newDoc.addPage(p));

  onProgress?.(85, 'Saving extracted PDF...');
  const bytes = await newDoc.save();
  const blob = new Blob([bytes as any], { type: 'application/pdf' });
  const baseName = filename.replace(/\.[^/.]+$/, '');

  onProgress?.(100, 'Complete!');
  return {
    success: true,
    outputs: [
      {
        blob,
        filename: `${baseName}_extracted.pdf`,
        mimeType: 'application/pdf',
        size: blob.size,
        url: URL.createObjectURL(blob),
      },
    ],
    stats: {
      originalSize: buffer.byteLength,
      processedSize: blob.size,
      pageCount: newDoc.getPageCount(),
      processingTimeMs: Date.now() - startTime,
    },
  };
}

/**
 * Rotate PDF pages by 90, 180, or 270 degrees
 */
export async function rotatePdf(
  buffer: ArrayBuffer,
  filename: string,
  rotationDegrees: 90 | 180 | 270,
  targetPages: 'all' | number[] = 'all',
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  const startTime = Date.now();
  onProgress?.(20, 'Loading PDF...');
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();

  onProgress?.(50, 'Rotating pages...');
  for (let i = 0; i < totalPages; i++) {
    const pageNum = i + 1;
    if (targetPages === 'all' || targetPages.includes(pageNum)) {
      const page = pdfDoc.getPage(i);
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + rotationDegrees) % 360));
    }
  }

  onProgress?.(85, 'Saving rotated PDF...');
  const bytes = await pdfDoc.save();
  const blob = new Blob([bytes as any], { type: 'application/pdf' });
  const baseName = filename.replace(/\.[^/.]+$/, '');

  onProgress?.(100, 'Complete!');
  return {
    success: true,
    outputs: [
      {
        blob,
        filename: `${baseName}_rotated_${rotationDegrees}deg.pdf`,
        mimeType: 'application/pdf',
        size: blob.size,
        url: URL.createObjectURL(blob),
      },
    ],
    stats: {
      originalSize: buffer.byteLength,
      processedSize: blob.size,
      pageCount: totalPages,
      processingTimeMs: Date.now() - startTime,
    },
  };
}

/**
 * Reorder PDF pages into a new sequence
 */
export async function reorderPdf(
  buffer: ArrayBuffer,
  filename: string,
  newOrder: number[], // 1-indexed page numbers in new sequence
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  const startTime = Date.now();
  onProgress?.(20, 'Loading PDF...');
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  const zeroIndexed = newOrder
    .map((p) => p - 1)
    .filter((idx) => idx >= 0 && idx < totalPages);

  if (zeroIndexed.length === 0) {
    throw new Error('Invalid page reorder sequence.');
  }

  onProgress?.(50, 'Rearranging page sequences...');
  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, zeroIndexed);
  copiedPages.forEach((p) => newDoc.addPage(p));

  onProgress?.(85, 'Exporting reordered PDF...');
  const bytes = await newDoc.save();
  const blob = new Blob([bytes as any], { type: 'application/pdf' });
  const baseName = filename.replace(/\.[^/.]+$/, '');

  onProgress?.(100, 'Complete!');
  return {
    success: true,
    outputs: [
      {
        blob,
        filename: `${baseName}_reordered.pdf`,
        mimeType: 'application/pdf',
        size: blob.size,
        url: URL.createObjectURL(blob),
      },
    ],
    stats: {
      originalSize: buffer.byteLength,
      processedSize: blob.size,
      pageCount: newDoc.getPageCount(),
      processingTimeMs: Date.now() - startTime,
    },
  };
}

/**
 * Convert multiple images into a single PDF
 */
export async function imagesToPdf(
  images: { name: string; buffer: ArrayBuffer; mimeType: string }[],
  options: {
    pageSize: 'a4' | 'letter' | 'fit';
    orientation: 'portrait' | 'landscape';
    margin: number; // in points
  } = { pageSize: 'a4', orientation: 'portrait', margin: 20 },
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  const startTime = Date.now();
  onProgress?.(10, 'Initializing PDF document...');
  const pdfDoc = await PDFDocument.create();

  // Page dimension presets in points (72 points = 1 inch)
  const A4 = { width: 595.28, height: 841.89 };
  const LETTER = { width: 612.0, height: 792.0 };

  for (let i = 0; i < images.length; i++) {
    const imgItem = images[i];
    onProgress?.(
      Math.round(15 + ((i + 1) / images.length) * 70),
      `Embedding image ${i + 1} of ${images.length}...`
    );

    let embeddedImage;
    if (imgItem.mimeType.includes('png')) {
      embeddedImage = await pdfDoc.embedPng(imgItem.buffer);
    } else {
      // JPEG / WebP / default
      embeddedImage = await pdfDoc.embedJpg(imgItem.buffer);
    }

    const imgDims = embeddedImage.scale(1);

    let pageWidth = A4.width;
    let pageHeight = A4.height;

    if (options.pageSize === 'letter') {
      pageWidth = LETTER.width;
      pageHeight = LETTER.height;
    } else if (options.pageSize === 'fit') {
      pageWidth = imgDims.width + options.margin * 2;
      pageHeight = imgDims.height + options.margin * 2;
    }

    if (options.orientation === 'landscape' && options.pageSize !== 'fit') {
      const temp = pageWidth;
      pageWidth = pageHeight;
      pageHeight = temp;
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const availWidth = pageWidth - options.margin * 2;
    const availHeight = pageHeight - options.margin * 2;

    // Calculate scale preserving aspect ratio
    const scale = Math.min(availWidth / imgDims.width, availHeight / imgDims.height, 1);
    const renderWidth = imgDims.width * scale;
    const renderHeight = imgDims.height * scale;

    const x = (pageWidth - renderWidth) / 2;
    const y = (pageHeight - renderHeight) / 2;

    page.drawImage(embeddedImage, {
      x,
      y,
      width: renderWidth,
      height: renderHeight,
    });
  }

  onProgress?.(90, 'Generating output PDF...');
  const bytes = await pdfDoc.save();
  const blob = new Blob([bytes as any], { type: 'application/pdf' });

  onProgress?.(100, 'Complete!');
  return {
    success: true,
    outputs: [
      {
        blob,
        filename: 'images_combined.pdf',
        mimeType: 'application/pdf',
        size: blob.size,
        url: URL.createObjectURL(blob),
      },
    ],
    stats: {
      originalSize: images.reduce((acc, img) => acc + img.buffer.byteLength, 0),
      processedSize: blob.size,
      pageCount: pdfDoc.getPageCount(),
      processingTimeMs: Date.now() - startTime,
    },
  };
}

/**
 * Add Text Watermark to PDF
 */
export async function watermarkPdf(
  buffer: ArrayBuffer,
  filename: string,
  options: {
    text: string;
    fontSize?: number;
    opacity?: number;
    rotationAngle?: number;
    color?: { r: number; g: number; b: number };
  },
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  const startTime = Date.now();
  onProgress?.(20, 'Loading PDF...');
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const totalPages = pdfDoc.getPageCount();

  const fontSize = options.fontSize || 48;
  const opacity = options.opacity !== undefined ? options.opacity : 0.3;
  const rotation = options.rotationAngle !== undefined ? options.rotationAngle : 45;
  const col = options.color || { r: 0.5, g: 0.5, b: 0.5 };

  onProgress?.(50, 'Stamping watermark across pages...');
  for (let i = 0; i < totalPages; i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(options.text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    page.drawText(options.text, {
      x: width / 2 - (textWidth / 2) * Math.cos((rotation * Math.PI) / 180),
      y: height / 2 - (textHeight / 2) * Math.sin((rotation * Math.PI) / 180),
      size: fontSize,
      font,
      color: rgb(col.r, col.g, col.b),
      opacity,
      rotate: degrees(rotation),
    });
  }

  onProgress?.(85, 'Saving watermarked PDF...');
  const bytes = await pdfDoc.save();
  const blob = new Blob([bytes as any], { type: 'application/pdf' });
  const baseName = filename.replace(/\.[^/.]+$/, '');

  onProgress?.(100, 'Complete!');
  return {
    success: true,
    outputs: [
      {
        blob,
        filename: `${baseName}_watermarked.pdf`,
        mimeType: 'application/pdf',
        size: blob.size,
        url: URL.createObjectURL(blob),
      },
    ],
    stats: {
      originalSize: buffer.byteLength,
      processedSize: blob.size,
      pageCount: totalPages,
      processingTimeMs: Date.now() - startTime,
    },
  };
}

/**
 * Add Page Numbers to PDF
 */
export async function addPageNumbersToPdf(
  buffer: ArrayBuffer,
  filename: string,
  options: {
    position: 'bottom-center' | 'bottom-right' | 'top-right' | 'top-center';
    format: 'number_only' | 'page_x_of_y';
    startNumber: number;
    fontSize?: number;
  },
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  const startTime = Date.now();
  onProgress?.(20, 'Loading PDF...');
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const totalPages = pdfDoc.getPageCount();
  const fontSize = options.fontSize || 10;

  onProgress?.(50, 'Numbering pages...');
  for (let i = 0; i < totalPages; i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();
    const currentNum = options.startNumber + i;

    const text =
      options.format === 'page_x_of_y'
        ? `Page ${currentNum} of ${options.startNumber + totalPages - 1}`
        : `${currentNum}`;

    const textWidth = font.widthOfTextAtSize(text, fontSize);

    let x = width / 2 - textWidth / 2;
    let y = 25; // bottom default

    if (options.position === 'bottom-right') {
      x = width - textWidth - 30;
      y = 25;
    } else if (options.position === 'top-right') {
      x = width - textWidth - 30;
      y = height - 30;
    } else if (options.position === 'top-center') {
      x = width / 2 - textWidth / 2;
      y = height - 30;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  }

  onProgress?.(85, 'Saving paginated document...');
  const bytes = await pdfDoc.save();
  const blob = new Blob([bytes as any], { type: 'application/pdf' });
  const baseName = filename.replace(/\.[^/.]+$/, '');

  onProgress?.(100, 'Complete!');
  return {
    success: true,
    outputs: [
      {
        blob,
        filename: `${baseName}_numbered.pdf`,
        mimeType: 'application/pdf',
        size: blob.size,
        url: URL.createObjectURL(blob),
      },
    ],
    stats: {
      originalSize: buffer.byteLength,
      processedSize: blob.size,
      pageCount: totalPages,
      processingTimeMs: Date.now() - startTime,
    },
  };
}

/**
 * Edit PDF Metadata
 */
export async function editPdfMetadata(
  buffer: ArrayBuffer,
  filename: string,
  metadata: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
  },
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  const startTime = Date.now();
  onProgress?.(30, 'Loading PDF metadata...');
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

  if (metadata.title !== undefined) pdfDoc.setTitle(metadata.title);
  if (metadata.author !== undefined) pdfDoc.setAuthor(metadata.author);
  if (metadata.subject !== undefined) pdfDoc.setSubject(metadata.subject);
  if (metadata.keywords !== undefined) {
    pdfDoc.setKeywords(metadata.keywords.split(',').map((k) => k.trim()));
  }
  if (metadata.creator !== undefined) pdfDoc.setCreator(metadata.creator);
  if (metadata.producer !== undefined) pdfDoc.setProducer(metadata.producer);

  onProgress?.(70, 'Updating document properties...');
  const bytes = await pdfDoc.save();
  const blob = new Blob([bytes as any], { type: 'application/pdf' });
  const baseName = filename.replace(/\.[^/.]+$/, '');

  onProgress?.(100, 'Complete!');
  return {
    success: true,
    outputs: [
      {
        blob,
        filename: `${baseName}_updated_meta.pdf`,
        mimeType: 'application/pdf',
        size: blob.size,
        url: URL.createObjectURL(blob),
      },
    ],
    stats: {
      originalSize: buffer.byteLength,
      processedSize: blob.size,
      pageCount: pdfDoc.getPageCount(),
      processingTimeMs: Date.now() - startTime,
    },
  };
}

/**
 * PDF Compression / Stream Optimization
 */
export async function compressPdf(
  buffer: ArrayBuffer,
  filename: string,
  level: 'low' | 'medium' | 'high' = 'medium',
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  const startTime = Date.now();
  onProgress?.(30, 'Analyzing PDF streams...');
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

  onProgress?.(60, 'Re-encoding and optimizing objects...');
  // pdf-lib optimizes objects and removes unused streams during save
  const bytes = await pdfDoc.save({
    useObjectStreams: true,
  });

  const blob = new Blob([bytes as any], { type: 'application/pdf' });
  const baseName = filename.replace(/\.[^/.]+$/, '');
  const saved = Math.max(0, buffer.byteLength - blob.size);
  const savedPercent = Math.round((saved / buffer.byteLength) * 100);

  onProgress?.(100, 'Complete!');
  return {
    success: true,
    outputs: [
      {
        blob,
        filename: `${baseName}_compressed.pdf`,
        mimeType: 'application/pdf',
        size: blob.size,
        url: URL.createObjectURL(blob),
      },
    ],
    stats: {
      originalSize: buffer.byteLength,
      processedSize: blob.size,
      savedPercentage: savedPercent,
      pageCount: pdfDoc.getPageCount(),
      processingTimeMs: Date.now() - startTime,
    },
  };
}

/**
 * Helper to parse comma-separated page ranges like '1-3, 5, 8-10'
 */
function parsePageRanges(rangeStr: string, maxPages: number): number[] {
  const indices = new Set<number>();
  const parts = rangeStr.split(',');

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
          indices.add(i - 1);
        }
      }
    } else {
      const p = parseInt(trimmed, 10);
      if (!isNaN(p) && p >= 1 && p <= maxPages) {
        indices.add(p - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}
