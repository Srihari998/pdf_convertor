import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface PrivacyBadgeProps {
  className?: string;
  isClientSide?: boolean;
}

export function PrivacyBadge({ className = '', isClientSide = true }: PrivacyBadgeProps) {
  if (!isClientSide) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-semibold ${className}`}
    >
      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
      <span>Your files stay on your device for 100% local processing</span>
    </div>
  );
}
