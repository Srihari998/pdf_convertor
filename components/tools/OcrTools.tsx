'use client';

import React, { useState } from 'react';
import { recognizeImageText } from '../../lib/ocr/engine';
import { UploadedFileItem, ProcessedResult, ProcessingProgress } from '../../lib/types';
import { UniversalUploader } from '../common/UniversalUploader';
import { FileProgress } from '../common/FileProgress';
import { ResultDownloadCard } from '../common/ResultDownloadCard';
import { Copy, Check, AlertCircle, Play, ScanText } from 'lucide-react';

interface OcrToolProps {
  toolId: string;
}

export function OcrToolWidget({ toolId }: OcrToolProps) {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (files.length === 0) return;
    setError(null);
    setProgress({ percentage: 5, statusText: 'Initializing Tesseract WebAssembly engine...' });

    try {
      const res = await recognizeImageText(files[0].file, (p, s) =>
        setProgress({ percentage: p, statusText: s })
      );

      setExtractedText(res.text);
      setConfidence(Math.round(res.confidence));
      setResult(res.result);
      setProgress(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Optical Character Recognition failed. Ensure the image contains clear text.');
      setProgress(null);
    }
  };

  const handleCopy = async () => {
    if (!extractedText) return;
    await navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setExtractedText('');
    setConfidence(null);
    setProgress(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {!result && (
        <UniversalUploader
          acceptedTypes={['.jpg', '.jpeg', '.png', '.webp', '.bmp']}
          maxFileSizeMB={20}
          maxFiles={1}
          files={files}
          onFilesChange={setFiles}
          label="Upload Scanned Photo or Document"
          sublabel="Tesseract WebAssembly will extract text locally in your browser"
        />
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs sm:text-sm font-semibold text-red-700 dark:text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {progress && <FileProgress progress={progress} />}

      {files.length > 0 && !progress && !result && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleProcess}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <ScanText className="w-5 h-5" />
            <span>Recognize &amp; Extract Text</span>
          </button>
        </div>
      )}

      {/* Extracted Text View */}
      {result && extractedText && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Extracted Text
              </span>
              {confidence !== null && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  {confidence}% Confidence
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold text-xs transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>

          <textarea
            readOnly
            value={extractedText}
            rows={10}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-4 font-mono text-xs sm:text-sm text-slate-900 dark:text-white"
          />

          <ResultDownloadCard result={result} onReset={handleReset} title="Text Extracted Successfully!" />
        </div>
      )}
    </div>
  );
}
