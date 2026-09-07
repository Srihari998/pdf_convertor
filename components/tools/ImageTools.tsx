'use client';

import React, { useState, useEffect } from 'react';
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
import { AlertCircle, Play, Sliders, Lock, Unlock } from 'lucide-react';

interface ImageToolProps {
  toolId: string;
}

const PRESETS = [
  { label: 'Instagram Post (1:1)', width: 1080, height: 1080 },
  { label: 'Instagram Story (9:16)', width: 1080, height: 1920 },
  { label: 'YouTube Thumbnail (16:9)', width: 1280, height: 720 },
  { label: 'Twitter/X Header (3:1)', width: 1500, height: 500 },
  { label: 'Full HD (1080p)', width: 1920, height: 1080 },
];

export function ImageToolWidget({ toolId }: ImageToolProps) {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Options
  const [quality, setQuality] = useState<number>(75);
  const [targetWidth, setTargetWidth] = useState<string>('1200');
  const [targetHeight, setTargetHeight] = useState<string>('800');
  const [aspectRatioLock, setAspectRatioLock] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1.5);
  const [convertTargetMime, setConvertTargetMime] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');
  const [imgPdfSize, setImgPdfSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [imgPdfOrient, setImgPdfOrient] = useState<'portrait' | 'landscape'>('portrait');

  // Detect image dimensions on file upload
  useEffect(() => {
    if (files.length > 0 && toolId === 'resize-image') {
      const img = new Image();
      const url = URL.createObjectURL(files[0].file);
      img.onload = () => {
        setTargetWidth(img.naturalWidth.toString());
        setTargetHeight(img.naturalHeight.toString());
        if (img.naturalHeight > 0) {
          setAspectRatio(img.naturalWidth / img.naturalHeight);
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  }, [files, toolId]);

  const handleWidthChange = (val: string) => {
    setTargetWidth(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && aspectRatioLock && aspectRatio > 0) {
      setTargetHeight(Math.round(num / aspectRatio).toString());
    }
  };

  const handleHeightChange = (val: string) => {
    setTargetHeight(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && aspectRatioLock && aspectRatio > 0) {
      setTargetWidth(Math.round(num * aspectRatio).toString());
    }
  };

  const applyPreset = (w: number, h: number) => {
    setTargetWidth(w.toString());
    setTargetHeight(h.toString());
    setAspectRatio(w / h);
  };

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
            <div className="space-y-4">
              {/* Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Social Media &amp; Standard Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => applyPreset(p.width, p.height)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Width (px)
                  </label>
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Target Height (px)
                    </label>
                    <button
                      type="button"
                      onClick={() => setAspectRatioLock(!aspectRatioLock)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400"
                    >
                      {aspectRatioLock ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      <span>{aspectRatioLock ? 'Locked Ratio' : 'Unlocked'}</span>
                    </button>
                  </div>
                  <input
                    type="number"
                    value={targetHeight}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Convert Format */}
          {toolId === 'convert-image' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Convert Image To Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { mime: 'image/webp', label: 'WebP', desc: 'Ultra-compact modern web format' },
                  { mime: 'image/jpeg', label: 'JPG / JPEG', desc: 'Universally compatible format' },
                  { mime: 'image/png', label: 'PNG', desc: 'Lossless with transparency support' },
                ].map((item) => (
                  <button
                    key={item.mime}
                    type="button"
                    onClick={() => setConvertTargetMime(item.mime as any)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      convertTargetMime === item.mime
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">{item.desc}</span>
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
