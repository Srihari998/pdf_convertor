import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { marked } from 'marked';
import { ProcessedResult } from '../types';

export interface DocumentPdfOptions {
  fontSize?: number;
  margin?: number;
  lineHeight?: number;
  fontFamily?: 'sans' | 'serif' | 'mono';
}

export async function textToPdf(
  text: string,
  filename: string = 'document.pdf',
  options: DocumentPdfOptions = {},
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  const startTime = Date.now();
  onProgress?.(20, 'Initializing PDF document...');
  const pdfDoc = await PDFDocument.create();

  let selectedFont = StandardFonts.Helvetica;
  if (options.fontFamily === 'serif') {
    selectedFont = StandardFonts.TimesRoman;
  } else if (options.fontFamily === 'mono') {
    selectedFont = StandardFonts.Courier;
  }

  const font = await pdfDoc.embedFont(selectedFont);
  const fontSize = options.fontSize || 11;
  const margin = options.margin || 40;
  const lineHeight = options.lineHeight || fontSize * 1.45;

  const pageWidth = 595.28; // A4 width
  const pageHeight = 841.89; // A4 height
  const printableWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2;

  onProgress?.(50, 'Formatting text lines and pagination...');
  const rawLines = text.split('\n');
  const wrappedLines: string[] = [];

  for (const rawLine of rawLines) {
    if (!rawLine.trim()) {
      wrappedLines.push('');
      continue;
    }

    const words = rawLine.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      let testWidth = 0;
      try {
        testWidth = font.widthOfTextAtSize(testLine, fontSize);
      } catch {
        // Fallback for uncommon unicode characters
        testWidth = testLine.length * (fontSize * 0.55);
      }

      if (testWidth <= printableWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) wrappedLines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) wrappedLines.push(currentLine);
  }

  const linesPerPage = Math.floor(printableHeight / lineHeight);
  const totalPages = Math.max(1, Math.ceil(wrappedLines.length / linesPerPage));

  for (let p = 0; p < totalPages; p++) {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const startIdx = p * linesPerPage;
    const pageLines = wrappedLines.slice(startIdx, startIdx + linesPerPage);

    let y = pageHeight - margin - fontSize;
    for (const line of pageLines) {
      if (line) {
        try {
          page.drawText(line, {
            x: margin,
            y,
            size: fontSize,
            font,
            color: rgb(0.12, 0.12, 0.12),
          });
        } catch {
          // If character unsupported in standard font, strip unsupported chars
          const sanitized = line.replace(/[^\x00-\x7F]/g, '');
          page.drawText(sanitized, {
            x: margin,
            y,
            size: fontSize,
            font,
            color: rgb(0.12, 0.12, 0.12),
          });
        }
      }
      y -= lineHeight;
    }
  }

  onProgress?.(85, 'Rendering PDF...');
  const bytes = await pdfDoc.save();
  const blob = new Blob([bytes as any], { type: 'application/pdf' });
  const baseName = filename.replace(/\.[^/.]+$/, '');

  onProgress?.(100, 'Complete!');
  return {
    success: true,
    outputs: [
      {
        blob,
        filename: `${baseName}.pdf`,
        mimeType: 'application/pdf',
        size: blob.size,
        url: URL.createObjectURL(blob),
      },
    ],
    stats: {
      originalSize: new Blob([text]).size,
      processedSize: blob.size,
      pageCount: totalPages,
      processingTimeMs: Date.now() - startTime,
    },
  };
}

export async function markdownToPdf(
  markdown: string,
  filename: string = 'markdown_notes.pdf',
  options: DocumentPdfOptions = {},
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  const plainText = markdown
    .replace(/^#+\s+(.*)$/gm, '\n$1\n' + '='.repeat(35))
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`{3}[\s\S]*?`{3}/g, (m) => m.replace(/`{3}/g, ''))
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1');

  return textToPdf(plainText, filename, { ...options, fontSize: options.fontSize || 11, margin: options.margin || 45 }, onProgress);
}

export async function htmlToPdf(
  html: string,
  filename: string = 'html_document.pdf',
  options: DocumentPdfOptions = {},
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const text = doc.body.innerText || doc.body.textContent || '';
  return textToPdf(text, filename, { ...options, fontSize: options.fontSize || 11, margin: options.margin || 40 }, onProgress);
}
