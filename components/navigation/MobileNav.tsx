'use client';

import React from 'react';
import Link from 'next/link';
import { X, Search, GraduationCap, IndianRupee, ArrowLeftRight, Code2, FileText, Calendar, Calculator, Activity, Grid } from 'lucide-react';
import { CATEGORIES } from '../../lib/tools/categories';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export function MobileNav({ isOpen, onClose, onOpenSearch }: MobileNavProps) {
  if (!isOpen) return null;

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'student':
        return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case 'finance':
        return <IndianRupee className="w-4 h-4 text-emerald-500" />;
      case 'converters':
        return <ArrowLeftRight className="w-4 h-4 text-violet-500" />;
      case 'developer':
        return <Code2 className="w-4 h-4 text-cyan-500" />;
      case 'text':
        return <FileText className="w-4 h-4 text-amber-500" />;
      case 'date-time':
        return <Calendar className="w-4 h-4 text-rose-500" />;
      case 'calculators':
        return <Calculator className="w-4 h-4 text-sky-500" />;
      case 'health':
        return <Activity className="w-4 h-4 text-lime-500" />;
      default:
        return <Calculator className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <Link href="/" onClick={onClose} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg">
                C
              </div>
              <span className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
                Calc<span className="text-blue-600 dark:text-blue-400">Nest</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-500 text-sm font-medium hover:border-blue-500 cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search 100+ tools...</span>
            </button>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Categories
              </span>
              <Link
                href="/tools"
                onClick={onClose}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1"
              >
                <Grid className="w-3.5 h-3.5" />
                All 100+ Tools
              </Link>
            </div>

            <nav className="space-y-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                    {getCategoryIcon(cat.id)}
                  </div>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-2">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium">
            <Link href="/about" onClick={onClose} className="hover:underline">About</Link>
            <span>•</span>
            <Link href="/privacy" onClick={onClose} className="hover:underline">Privacy</Link>
            <span>•</span>
            <Link href="/terms" onClick={onClose} className="hover:underline">Terms</Link>
            <span>•</span>
            <Link href="/contact" onClick={onClose} className="hover:underline">Contact</Link>
          </div>
          <p className="text-[11px] text-slate-400">© 2026 CalcNest. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
