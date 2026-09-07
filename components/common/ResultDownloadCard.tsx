'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, Archive, RefreshCw, FileText, Sparkles } from 'lucide-react';
import { ProcessedResult } from '../../lib/types';
import { triggerDownload, createZipAndDownload } from '../../lib/utils/download';
import { formatBytes } from '../../lib/utils/formatters';

interface ResultDownloadCardProps {
  result: ProcessedResult;
  onReset: () => void;
  title?: string;
}

export function ResultDownloadCard({
  result,
  onReset,
  title = 'Your Document is Ready!',
}: ResultDownloadCardProps) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const handleDownloadAll = async () => {
    if (result.outputs.length === 1) {
      triggerDownload(result.outputs[0].blob, result.outputs[0].filename);
    } else {
      await createZipAndDownload(result.outputs, 'documentnest-bundle.zip');
    }
  };

  return (
    <div className="rounded-3xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-6 sm:p-8 space-y-6 text-center shadow-xs">
      <div className="flex flex-col items-center space-y-2">
        <div className="p-3.5 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md">
          Generated 100% locally in your browser with zero data upload.
        </p>
      </div>

      {/* Stats Breakdown */}
      {result.stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Original</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              {formatBytes(result.stats.originalSize)}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Processed</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {formatBytes(result.stats.processedSize)}
            </span>
          </div>
          {result.stats.savedPercentage !== undefined && (
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Reduced</span>
              <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                {result.stats.savedPercentage}%
              </span>
            </div>
          )}
          {result.stats.pageCount !== undefined && (
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pages</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                {result.stats.pageCount}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Output Files List */}
      <div className="space-y-2 max-w-lg mx-auto">
        {result.outputs.map((output, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left shadow-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {output.filename}
                </p>
                <span className="text-[11px] text-slate-400">
                  {formatBytes(output.size)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => triggerDownload(output.blob, output.filename)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        ))}
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {result.outputs.length > 1 ? (
          <button
            type="button"
            onClick={handleDownloadAll}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <Archive className="w-5 h-5" />
            <span>Download All ({result.outputs.length} files as ZIP)</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => triggerDownload(result.outputs[0].blob, result.outputs[0].filename)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </button>
        )}

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Process Another File</span>
        </button>
      </div>
    </div>
  );
}
