import { createWorker } from 'tesseract.js';
import { ProcessedResult } from '../types';

export async function recognizeImageText(
  imageFile: File,
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

  onProgress?.(30, 'Analyzing image pixels...');
  const ret = await worker.recognize(imageFile);
  const recognizedText = ret.data.text;
  const confidence = ret.data.confidence;

  await worker.terminate();

  const blob = new Blob([recognizedText], { type: 'text/plain;charset=utf-8' });
  const baseName = imageFile.name.replace(/\.[^/.]+$/, '');
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
        originalSize: imageFile.size,
        processedSize: blob.size,
        processingTimeMs: Date.now() - startTime,
      },
    },
  };
}

export async function extractTextFromPdf(
  file: File,
  onProgress?: (percent: number, status: string) => void
): Promise<{ text: string; result: ProcessedResult }> {
  // For standard PDFs in browser, convert first page / sample to text or use OCR
  return recognizeImageText(file, onProgress);
}
