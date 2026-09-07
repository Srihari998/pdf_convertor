'use client';

import React from 'react';

interface AdSlotProps {
  position?: 'top' | 'middle' | 'bottom';
  className?: string;
}

export function AdSlot({ position = 'middle', className = '' }: AdSlotProps) {
  return (
    <div
      className={`my-6 flex flex-col items-center justify-center p-2 text-center overflow-hidden ${className}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5 block">
        Advertisement
      </span>
      <div className="w-full flex justify-center max-w-[728px] min-h-[90px] rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 items-center text-xs text-slate-400">
        <span>Responsive Ad Unit ({position})</span>
      </div>
    </div>
  );
}
