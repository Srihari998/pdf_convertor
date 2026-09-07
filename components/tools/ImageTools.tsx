'use client';

import React, { useState } from 'react';
import {
  compressImage,
  resizeImage,
  convertImageFormat,
} from '../../lib/image/engine';
import { imagesToPdf } from '../../lib/pdf/engine';
import { UploadedFileItem, ProcessedResult, ProcessingProgress } from '../../lib/types';
import { UniversalUploader } from '../common/UniversalUploader';
import { FileProgress } from '../common/FileProgress';
import { ResultDownloadCard } from '../common/ResultDownloadCard';
import { AlertCircle, Play, Sliders } from 'lucide-react';

interface ImageToolProps {
  toolId: string;
}

export function ImageToolWidget({ toolId }: ImageToolProps) {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Options
  const [quality, setQuality] = useState<number>(75);
  const [targetWidth, setTargetWidth] = useState<string>('1200');
  const [targetHeight, setTargetHeight] = useState<string>('800');
  const [convertTargetMime, setConvertTargetMime] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');
  const [imgPdfSize, setImgPdfSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [imgPdfOrient, setImgPdfOrient] = useState<'portrait' | 'landscape'>('portrait');

  const handleProcess = async () => {
    if (files.length === 0) return;
    setError(null);
    setProgress({ percentage: 10, statusText: 'Processing images locally...' });

    try {
      let res: ProcessedResult;

      switch (toolId) {
        case 'compress-image': {
          res = await compressImage(
            files[0].file,
            quality / 100,
            undefined,
            undefined,
            files[0].type as any,
            (p, s) => setProgress({ percentage: p, statusText: s })
          );
          break;
        }

        case 'resize-image': {
          const w = parseInt(targetWidth, 10) || 800;
          const h = parseInt(targetHeight, 10) || 600;
          res = await resizeImage(
            files[0].file,
            w,
            h,
            files[0].type as any,
            (p, s) => setProgress({ percentage: p, statusText: s })
          );
          break;
        }

        case 'convert-image': {
          res = await convertImageFormat(
            files[0].file,
            convertTargetMime,
            quality / 100,
            (p, s) => setProgress({ percentage: p, statusText: s })
          );
          break;
        }

        case 'image-to-pdf': {
          const images = await Promise.all(
            files.map(async (f) => ({
              name: f.name,
              buffer: await f.file.arrayBuffer(),
              mimeType: f.type,
            }))
          );
          res = await imagesToPdf(
            images,
            {
              pageSize: imgPdfSize,
              orientation: imgPdfOrient,
              margin: 20,
            },
            (p, s) => setProgress({ percentage: p, statusText: s })
          );
          break;
        }

        default:
          throw new Error('Unsupported image tool');
      }

      setResult(res);
      setProgress(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Image processing failed.');
      setProgress(null);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setProgress(null);
    setError(null);
  };

  if (result) {
    return <ResultDownloadCard result={result} onReset={handleReset} />;
  }

  const isMulti = toolId === 'image-to-pdf';

  return (
    <div className="space-y-6">
      <UniversalUploader
        acceptedTypes={['.jpg', '.jpeg', '.png', '.webp']}
        maxFileSizeMB={30}
        maxFiles={isMulti ? 30 : 1}
        files={files}
        onFilesChange={setFiles}
      />

      {files.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Image Settings</span>
          </div>

          {/* Compress Quality */}
          {toolId === 'compress-image' && (
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Compression Quality</span>
                <span className="font-bold text-blue-600">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Smaller File</span>
                <span>Balanced</span>
                <span>Higher Quality</span>
              </div>
            </div>
          )}

          {/* Resize Controls */}
          {toolId === 'resize-image' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Width (px)
                </label>
                <input
                  type="number"
                  value={targetWidth}
                  onChange={(e) => setTargetWidth(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Height (px)
                </label>
                <input
                  type="number"
                  value={targetHeight}
                  onChange={(e) => setTargetHeight(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm"
                />
              </div>
            </div>
          )}

          {/* Convert Format */}
          {toolId === 'convert-image' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Convert Image To Format
              </label>
              <div className="flex gap-2">
                {[
                  { mime: 'image/webp', label: 'WebP (Ultra-Compact)' },
                  { mime: 'image/jpeg', label: 'JPG / JPEG (Universal)' },
                  { mime: 'image/png', label: 'PNG (Lossless / Transparent)' },
                ].map((item) => (
                  <button
                    key={item.mime}
                    type="button"
                    onClick={() => setConvertTargetMime(item.mime as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                      convertTargetMime === item.mime
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image to PDF layout */}
          {toolId === 'image-to-pdf' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Page Sizing
                </label>
                <select
                  value={imgPdfSize}
                  onChange={(e) => setImgPdfSize(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm"
                >
                  <option value="a4">A4 Standard</option>
                  <option value="letter">US Letter</option>
                  <option value="fit">Fit to Image</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Orientation
                </label>
                <select
                  value={imgPdfOrient}
                  onChange={(e) => setImgPdfOrient(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs sm:text-sm font-semibold text-red-700 dark:text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {progress && <FileProgress progress={progress} />}

      {files.length > 0 && !progress && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleProcess}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Process Image</span>
          </button>
        </div>
      )}
    </div>
  );
}
