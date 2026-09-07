import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { marked } from 'marked';
import { ProcessedResult } from '../types';

export async function textToPdf(
  text: string,
  filename: string = 'document.pdf',
  options: {
    fontSize?: number;
    margin?: number;
    lineHeight?: number;
  } = {},
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  const startTime = Date.now();
  onProgress?.(20, 'Initializing PDF document...');
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = options.fontSize || 11;
  const margin = options.margin || 40;
  const lineHeight = options.lineHeight || fontSize * 1.4;

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
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

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
        page.drawText(line, {
          x: margin,
          y,
          size: fontSize,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });
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
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  // Strip or parse basic markdown syntax for clean text PDF representation
  const plainText = markdown
    .replace(/^#+\s+(.*)$/gm, '\n$1\n' + '='.repeat(30))
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`{3}[\s\S]*?`{3}/g, (m) => m.replace(/`{3}/g, ''))
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1');

  return textToPdf(plainText, filename, { fontSize: 11, margin: 45 }, onProgress);
}

export async function htmlToPdf(
  html: string,
  filename: string = 'html_document.pdf',
  onProgress?: (percent: number, status: string) => void
): Promise<ProcessedResult> {
  // Clean basic HTML tags to readable text layout
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const text = doc.body.innerText || doc.body.textContent || '';
  return textToPdf(text, filename, { fontSize: 11, margin: 40 }, onProgress);
}
