'use client';

import React from 'react';
import Link from 'next/link';
import { X, Layers, Image as ImageIcon, BookOpen, ScanText, Grid, Shield, Info, Mail } from 'lucide-react';
import { CATEGORIES } from '../../lib/tools/categories';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'pdf':
        return <Layers className="w-5 h-5 text-rose-500" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-blue-500" />;
      case 'document':
        return <BookOpen className="w-5 h-5 text-amber-500" />;
      case 'ocr':
        return <ScanText className="w-5 h-5 text-violet-500" />;
      default:
        return <Grid className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-200">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
                DN
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                DocumentNest
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Categories
            </span>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.name}</span>
              </Link>
            ))}

            <Link
              href="/tools"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors"
            >
              <Grid className="w-5 h-5" />
              <span>All 22 Tools Directory</span>
            </Link>
          </div>
        </div>

        {/* Footer links */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-500">
          <div className="flex flex-wrap gap-4">
            <Link href="/about" onClick={onClose} className="hover:text-blue-600">
              About
            </Link>
            <Link href="/privacy" onClick={onClose} className="hover:text-blue-600">
              Privacy Policy
            </Link>
            <Link href="/terms" onClick={onClose} className="hover:text-blue-600">
              Terms
            </Link>
            <Link href="/contact" onClick={onClose} className="hover:text-blue-600">
              Contact
            </Link>
          </div>
          <p className="text-[11px] text-slate-400">
            © 2026 DocumentNest. 100% In-Browser.
          </p>
        </div>
      </div>
    </div>
  );
}
