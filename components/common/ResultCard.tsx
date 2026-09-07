'use client';

import React from 'react';
import { CopyButton } from './CopyButton';

export interface ResultItem {
  label: string;
  value: string | number;
  highlight?: boolean;
  subtext?: string;
  color?: string;
}

interface ResultCardProps {
  title?: string;
  primaryValue: string | number;
  primaryLabel: string;
  primaryUnit?: string;
  badge?: { text: string; variant?: 'success' | 'warning' | 'danger' | 'info' };
  breakdown?: ResultItem[];
  copyValue?: string;
  className?: string;
}

export function ResultCard({
  title = 'Calculated Result',
  primaryValue,
  primaryLabel,
  primaryUnit,
  badge,
  breakdown,
  copyValue,
  className = '',
}: ResultCardProps) {
  const copyText =
    copyValue ||
    `${primaryLabel}: ${primaryValue}${primaryUnit ? ' ' + primaryUnit : ''}${
      breakdown ? '\n' + breakdown.map((b) => `${b.label}: ${b.value}`).join('\n') : ''
    }`;

  const getBadgeClass = (variant = 'info') => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'warning':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'danger':
        return 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div
      className={`rounded-2xl border border-blue-100 dark:border-blue-950 bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900/90 dark:to-slate-900 p-5 sm:p-6 shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {title}
          </h3>
          {badge && (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeClass(
                badge.variant
              )}`}
            >
              {badge.text}
            </span>
          )}
        </div>
        <CopyButton textToCopy={copyText} />
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{primaryLabel}</p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            {primaryValue}
          </span>
          {primaryUnit && (
            <span className="text-lg sm:text-xl font-semibold text-slate-600 dark:text-slate-400">
              {primaryUnit}
            </span>
          )}
        </div>
      </div>

      {breakdown && breakdown.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {breakdown.map((item, idx) => (
            <div key={idx} className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200/50 dark:border-slate-800">
              <span className="block text-xs text-slate-500 dark:text-slate-400 mb-0.5">{item.label}</span>
              <span className={`block font-bold text-sm sm:text-base ${item.color || 'text-slate-900 dark:text-slate-100'}`}>
                {item.value}
              </span>
              {item.subtext && (
                <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {item.subtext}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
