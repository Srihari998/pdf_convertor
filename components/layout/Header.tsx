'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  FileText,
  Search,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  Layers,
  Image as ImageIcon,
  BookOpen,
  ScanText,
  Grid,
} from 'lucide-react';
import { CATEGORIES } from '../../lib/tools/categories';
import { SearchModal } from '../navigation/SearchModal';
import { MobileNav } from '../navigation/MobileNav';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-950 dark:text-white block leading-none">
                  Document<span className="text-blue-600 dark:text-blue-400">Nest</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mt-0.5">
                  Free PDF &amp; Document Tools
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5">
              <Link
                href="/pdf"
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                PDF Tools
              </Link>
              <Link
                href="/image"
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Image Tools
              </Link>
              <Link
                href="/document"
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Document Tools
              </Link>
              <Link
                href="/ocr"
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                OCR Tools
              </Link>
              <Link
                href="/tools"
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors"
              >
                All 22 Tools
              </Link>
            </nav>
          </div>

          {/* Right Actions (Search, Theme Toggle, Mobile Menu) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer text-xs sm:text-sm"
              aria-label="Open search"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search tools...</span>
              <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              <Sun className="w-4 h-4 hidden dark:block" />
              <Moon className="w-4 h-4 block dark:hidden" />
            </button>

            {/* Mobile Drawer Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 lg:hidden cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Drawer Navigation */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
