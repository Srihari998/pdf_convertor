import React from 'react';
import Link from 'next/link';
import { FileText, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../lib/tools/categories';
import { getPopularTools } from '../../lib/tools/registry';

export function Footer() {
  const popularTools = getPopularTools().slice(0, 6);

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
                Document<span className="text-blue-600 dark:text-blue-400">Nest</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Free, private, and fast online tools for PDF, document, and image processing. Built with 100% client-side WebAssembly execution so your confidential files never leave your device.
            </p>

            <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold max-w-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero server document storage. Total file privacy.</span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Tool Categories
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/${cat.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/tools" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-blue-600 dark:text-blue-400 transition-colors">
                  All 22 Tools →
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Popular Tools
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {popularTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={`/${tool.categorySlug}/${tool.slug}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Company &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  About DocumentNest
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} DocumentNest. All document operations process locally.</p>
          <div className="flex items-center gap-1">
            <span>Engineered for speed, privacy, and simplicity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
