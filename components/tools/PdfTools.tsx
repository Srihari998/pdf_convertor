'use client';

import React, { useState } from 'react';
import {
  mergePdfs,
  splitPdf,
  deletePdfPages,
  extractPdfPages,
  rotatePdf,
  reorderPdf,
  watermarkPdf,
  addPageNumbersToPdf,
  editPdfMetadata,
  compressPdf,
  imagesToPdf,
} from '../../lib/pdf/engine';
import { UploadedFileItem, ProcessedResult, ProcessingProgress } from '../../lib/types';
import { UniversalUploader } from '../common/UniversalUploader';
import { FileProgress } from '../common/FileProgress';
import { ResultDownloadCard } from '../common/ResultDownloadCard';
import { AlertCircle, Play, Sliders } from 'lucide-react';

interface PdfToolProps {
  toolId: string;
}

export function PdfToolWidget({ toolId }: PdfToolProps) {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tool specific options
  const [splitMode, setSplitMode] = useState<'all_pages' | 'range'>('all_pages');
  const [splitRange, setSplitRange] = useState('1-3');
  const [pagesToDeleteStr, setPagesToDeleteStr] = useState('2');
  const [pagesToExtractStr, setPagesToExtractStr] = useState('1, 3');
  const [rotationDegrees, setRotationDegrees] = useState<90 | 180 | 270>(90);
  const [reorderOrderStr, setReorderOrderStr] = useState('');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [watermarkAngle, setWatermarkAngle] = useState(45);
  const [pageNumberPos, setPageNumberPos] = useState<'bottom-center' | 'bottom-right' | 'top-right'>('bottom-center');
  const [pageNumberFormat, setPageNumberFormat] = useState<'page_x_of_y' | 'number_only'>('page_x_of_y');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaAuthor, setMetaAuthor] = useState('');
  const [metaSubject, setMetaSubject] = useState('');
  const [compressLevel, setCompressLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [imgPdfSize, setImgPdfSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [imgPdfOrient, setImgPdfOrient] = useState<'portrait' | 'landscape'>('portrait');

  const handleProcess = async () => {
    if (files.length === 0) return;
    setError(null);
    setProgress({ percentage: 5, statusText: 'Starting local processing...' });

    try {
      let res: ProcessedResult;

      switch (toolId) {
        case 'merge-pdf': {
          const buffers = await Promise.all(
            files.map(async (f) => ({
              name: f.name,
              buffer: await f.file.arrayBuffer(),
            }))
          );
          res = await mergePdfs(buffers, (p, s) => setProgress({ percentage: p, statusText: s }));
          break;
        }

        case 'split-pdf': {
          const buffer = await files[0].file.arrayBuffer();
          res = await splitPdf(
            buffer,
            files[0].name,
            splitMode,
            splitRange,
            (p, s) => setProgress({ percentage: p, statusText: s })
          );
          break;
        }

        case 'delete-pdf-pages': {
          const buffer = await files[0].file.arrayBuffer();
          const pages = pagesToDeleteStr
            .split(',')
            .map((p) => parseInt(p.trim(), 10))
            .filter((n) => !isNaN(n));
          res = await deletePdfPages(
            buffer,
            files[0].name,
            pages,
            (p, s) => setProgress({ percentage: p, statusText: s })
          );
          break;
        }

        case 'extract-pdf-pages': {
          const buffer = await files[0].file.arrayBuffer();
          const pages = pagesToExtractStr
            .split(',')
            .map((p) => parseInt(p.trim(), 10))
            .filter((n) => !isNaN(n));
          res = await extractPdfPages(
            buffer,
            files[0].name,
            pages,
            (p, s) => setProgress({ percentage: p, statusText: s })
          );
          break;
        }

        case 'rotate-pdf': {
          const buffer = await files[0].file.arrayBuffer();
          res = await rotatePdf(
            buffer,
            files[0].name,
            rotationDegrees,
            'all',
            (p, s) => setProgress({ percentage: p, statusText: s })
          );
          break;
        }

        case 'reorder-pdf': {
          const buffer = await files[0].file.arrayBuffer();
          const order = reorderOrderStr
            .split(',')
            .map((p) => parseInt(p.trim(), 10))
            .filter((n) => !isNaN(n));
          res = await reorderPdf(
            buffer,
            files[0].name,
            order.length > 0 ? order : [2, 1],
            (p, s) => setProgress({ percentage: p, statusText: s })
          );
          break;
        }

        case 'watermark-pdf': {
          const buffer = await files[0].file.arrayBuffer();
          res = await watermarkPdf(
            buffer,
            files[0].name,
            {
              text: watermarkText,
              opacity: watermarkOpacity,
              rotationAngle: watermarkAngle,
            },
            (p, s) => setProgress({ percentage: p, statusText: s })
          );
          break;
        }

        case 'page-numbers': {
          const buffer = await files[0].file.arrayBuffer();
          res = await addPageNumbersToPdf(
            buffer,
            files[0].name,
            {
              position: pageNumberPos,
              format: pageNumberFormat,
              startNumber: 1,
            },
            (p, s) => setProgress({ percentage: p, statusText: s })
          );
          break;
        }

        case 'metadata-editor': {
          const buffer = await files[0].file.arrayBuffer();
          res = await editPdfMetadata(
            buffer,
            files[0].name,
            {
              title: metaTitle,
              author: metaAuthor,
              subject: metaSubject,
            },
            (p, s) => setProgress({ percentage: p, statusText: s })
          );
          break;
        }

        case 'compress-pdf': {
          const buffer = await files[0].file.arrayBuffer();
          res = await compressPdf(
            buffer,
            files[0].name,
            compressLevel,
            (p, s) => setProgress({ percentage: p, statusText: s })
          );
          break;
        }

        case 'jpg-to-pdf': {
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
          throw new Error('Unsupported tool action');
      }

      setResult(res);
      setProgress(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during processing.');
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

  const isMultiFile = ['merge-pdf', 'jpg-to-pdf', 'image-to-pdf'].includes(toolId);
  const accepted = toolId === 'jpg-to-pdf' ? ['.jpg', '.jpeg', '.png', '.webp'] : ['.pdf', 'application/pdf'];

  return (
    <div className="space-y-6">
      {/* File Uploader */}
      <UniversalUploader
        acceptedTypes={accepted}
        maxFileSizeMB={50}
        maxFiles={isMultiFile ? 20 : 1}
        files={files}
        onFilesChange={setFiles}
      />

      {/* Specific Controls / Options */}
      {files.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Tool Settings</span>
          </div>

          {/* Split Mode */}
          {toolId === 'split-pdf' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSplitMode('all_pages')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    splitMode === 'all_pages' ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 dark:border-slate-700'
                  }`}
                >
                  Split All Pages (ZIP)
                </button>
                <button
                  type="button"
                  onClick={() => setSplitMode('range')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    splitMode === 'range' ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 dark:border-slate-700'
                  }`}
                >
                  Custom Page Range
                </button>
              </div>

              {splitMode === 'range' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Enter Page Ranges (e.g. 1-3, 5)
                  </label>
                  <input
                    type="text"
                    value={splitRange}
                    onChange={(e) => setSplitRange(e.target.value)}
                    className="w-full max-w-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm"
                  />
                </div>
              )}
            </div>
          )}

          {/* Delete Pages */}
          {toolId === 'delete-pdf-pages' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enter Pages to Delete (comma-separated, e.g. 2, 4)
              </label>
              <input
                type="text"
                value={pagesToDeleteStr}
                onChange={(e) => setPagesToDeleteStr(e.target.value)}
                placeholder="2, 4"
                className="w-full max-w-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm"
              />
            </div>
          )}

          {/* Extract Pages */}
          {toolId === 'extract-pdf-pages' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enter Pages to Extract (comma-separated, e.g. 1, 3, 5)
              </label>
              <input
                type="text"
                value={pagesToExtractStr}
                onChange={(e) => setPagesToExtractStr(e.target.value)}
                placeholder="1, 3, 5"
                className="w-full max-w-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm"
              />
            </div>
          )}

          {/* Rotate PDF */}
          {toolId === 'rotate-pdf' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Rotation Angle
              </label>
              <div className="flex gap-2">
                {[90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => setRotationDegrees(deg as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      rotationDegrees === deg
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {deg}° {deg === 90 ? 'Clockwise' : deg === 180 ? 'Flip' : 'Counter-Clockwise'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Watermark PDF */}
          {toolId === 'watermark-pdf' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Opacity ({Math.round(watermarkOpacity * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={watermarkOpacity}
                  onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 mt-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Rotation Angle
                </label>
                <select
                  value={watermarkAngle}
                  onChange={(e) => setWatermarkAngle(parseInt(e.target.value, 10))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm"
                >
                  <option value={45}>45° Diagonal</option>
                  <option value={0}>0° Horizontal</option>
                  <option value={-45}>-45° Reverse Diagonal</option>
                </select>
              </div>
            </div>
          )}

          {/* Page Numbers */}
          {toolId === 'page-numbers' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Position
                </label>
                <select
                  value={pageNumberPos}
                  onChange={(e) => setPageNumberPos(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm"
                >
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="top-right">Top Right</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Format
                </label>
                <select
                  value={pageNumberFormat}
                  onChange={(e) => setPageNumberFormat(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm"
                >
                  <option value="page_x_of_y">Page X of Y (e.g. Page 1 of 10)</option>
                  <option value="number_only">Number Only (e.g. 1)</option>
                </select>
              </div>
            </div>
          )}

          {/* Metadata Editor */}
          {toolId === 'metadata-editor' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Annual Report 2026"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={metaAuthor}
                  onChange={(e) => setMetaAuthor(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject / Keywords
                </label>
                <input
                  type="text"
                  placeholder="e.g. Finance, Summary"
                  value={metaSubject}
                  onChange={(e) => setMetaSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-sm"
                />
              </div>
            </div>
          )}

          {/* JPG to PDF Options */}
          {toolId === 'jpg-to-pdf' && (
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
                  <option value="a4">A4 (Standard Document)</option>
                  <option value="letter">US Letter</option>
                  <option value="fit">Fit to Image Size</option>
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

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs sm:text-sm font-semibold text-red-700 dark:text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Progress */}
      {progress && <FileProgress progress={progress} />}

      {/* Action Button */}
      {files.length > 0 && !progress && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleProcess}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Process Document</span>
          </button>
        </div>
      )}
    </div>
  );
}
