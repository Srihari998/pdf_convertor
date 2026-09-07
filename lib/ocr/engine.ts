import { createWorker } from 'tesseract.js';
import { ProcessedResult, ProcessedOutputFile } from '../types';

export async function recognizeImageText(
  imageFile: File | Blob,
  onProgress?: (percent: number, status: string) => void
): Promise<{ text: string; confidence: number; result: ProcessedResult }> {
  const startTime = Date.now();
  onProgress?.(10, 'Initializing WebAssembly OCR engine...');

  const worker = await createWorker('eng', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        const p = Math.round(15 + m.progress * 75);
        onProgress?.(p, `Recognizing text... ${Math.round(m.progress * 100)}%`);
      }
    },
  });

  onProgress?.(30, 'Analyzing image pixels with neural model...');
  const ret = await worker.recognize(imageFile);
  const recognizedText = ret.data.text;
  const confidence = ret.data.confidence;

  await worker.terminate();

  const filename = (imageFile as File).name || 'scanned_image.png';
  const baseName = filename.replace(/\.[^/.]+$/, '');
  const blob = new Blob([recognizedText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  onProgress?.(100, 'Recognition complete!');
  return {
    text: recognizedText,
    confidence,
    result: {
      success: true,
      outputs: [
        {
          blob,
          filename: `${baseName}_extracted.txt`,
          mimeType: 'text/plain',
          size: blob.size,
          url,
        },
      ],
      stats: {
        originalSize: (imageFile as File).size || blob.size,
        processedSize: blob.size,
        processingTimeMs: Date.now() - startTime,
      },
    },
  };
}

/**
 * Extract text from PDF documents (hybrid text layer + WebAssembly OCR fallback for scanned pages)
 */
export async function extractTextFromPdf(
  file: File,
  onProgress?: (percent: number, status: string) => void
): Promise<{ text: string; confidence?: number; result: ProcessedResult }> {
  const startTime = Date.now();
  onProgress?.(10, 'Loading PDF parser...');

  // @ts-ignore
  const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const pageTexts: string[] = [];
  let tesseractWorker: any = null;

  for (let i = 1; i <= numPages; i++) {
    const pageProgress = Math.round(15 + ((i - 0.5) / numPages) * 75);
    onProgress?.(pageProgress, `Processing page ${i} of ${numPages}...`);

    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const extractedStr = textContent.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .filter((s: string) => s.trim().length > 0)
      .join(' ');

    if (extractedStr.length > 20) {
      // Native text layer exists and is rich
      pageTexts.push(`--- Page ${i} ---\n${extractedStr}`);
    } else {
      // Scanned page: Render to canvas and run OCR
      onProgress?.(pageProgress, `Running OCR on scanned page ${i} of ${numPages}...`);
      
      if (!tesseractWorker) {
        tesseractWorker = await createWorker('eng', 1);
      }

      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx as any, viewport }).promise;

        const ocrResult = await tesseractWorker.recognize(canvas);
        pageTexts.push(`--- Page ${i} (OCR) ---\n${ocrResult.data.text || '(No text detected)'}`);
      } else {
        pageTexts.push(`--- Page ${i} ---\n(Empty page)`);
      }
    }
  }

  if (tesseractWorker) {
    await tesseractWorker.terminate();
  }

  const fullText = pageTexts.join('\n\n');
  const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const url = URL.createObjectURL(blob);

  onProgress?.(100, 'Text extraction complete!');
  return {
    text: fullText,
    result: {
      success: true,
      outputs: [
        {
          blob,
          filename: `${baseName}_extracted.txt`,
          mimeType: 'text/plain',
          size: blob.size,
          url,
        },
      ],
      stats: {
        originalSize: file.size,
        processedSize: blob.size,
        pageCount: numPages,
        processingTimeMs: Date.now() - startTime,
      },
    },
  };
}
