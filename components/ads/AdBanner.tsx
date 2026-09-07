import React from 'react';

interface AdBannerProps {
  slotId?: string;
  className?: string;
}

export function AdBanner({ className = '' }: AdBannerProps) {
  return (
    <div
      className={`my-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 text-center min-h-[90px] ${className}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
        Advertisement
      </span>
      <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2">
        <span>Ad Space (Responsive Leaderboard 728x90)</span>
      </div>
    </div>
  );
}

export function AdRectangle({ className = '' }: { className?: string }) {
  return (
    <div
      className={`my-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 text-center min-h-[250px] ${className}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
        Advertisement
      </span>
      <div className="text-xs text-slate-400 dark:text-slate-500">
        <span>Ad Space (Medium Rectangle 300x250)</span>
      </div>
    </div>
  );
}

export function AdInContent({ className = '' }: { className?: string }) {
  return (
    <div
      className={`my-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30 p-3 text-center min-h-[60px] ${className}`}
    >
      <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Advertisement
      </span>
    </div>
  );
}
