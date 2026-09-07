'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { ProcessingProgress } from '../../lib/types';

interface FileProgressProps {
  progress: ProcessingProgress;
}

export function FileProgress({ progress }: FileProgressProps) {
  return (
    <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/40 p-6 space-y-4 text-center">
      <div className="flex items-center justify-center gap-2.5 text-blue-600 dark:text-blue-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          {progress.statusText || 'Processing your document...'}
        </span>
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${Math.min(100, Math.max(5, progress.percentage))}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 font-semibold">
          <span>Processing locally</span>
          <span>{progress.percentage}%</span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 dark:text-slate-500">
        Please keep this browser tab open. Processing depends on your device speed.
      </p>
    </div>
  );
}
