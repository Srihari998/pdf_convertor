'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Layers,
  Image as ImageIcon,
  BookOpen,
  ScanText,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { TOOLS_REGISTRY, getPopularTools } from '../lib/tools/registry';
import { CATEGORIES } from '../lib/tools/categories';
import { ToolCard } from '../components/common/ToolCard';
import { FAQSection } from '../components/common/FAQSection';
import { AdSlot } from '../components/common/AdSlot';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const popularTools = getPopularTools().slice(0, 8);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match = TOOLS_REGISTRY.find(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q) ||
          t.keywords.some((k) => k.toLowerCase().includes(q))
      );
      if (match) {
        router.push(`/${match.categorySlug}/${match.slug}`);
      } else {
        router.push(`/tools?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const homeFaqs = [
    {
      question: 'Are my confidential files uploaded to any external server?',
      answer: 'No. DocumentNest is built with a strict privacy-first architecture. All PDF, image, and document operations run 100% locally inside your web browser via WebAssembly and HTML5 Canvas. Your files never leave your computer or smartphone.',
    },
    {
      question: 'Is DocumentNest really free with no hidden charges?',
      answer: 'Yes! There are no paid subscriptions, file watermarks, daily quotas, or forced account registrations. Every tool is 100% free to use.',
    },
    {
      question: 'How does browser-based PDF processing work?',
      answer: 'We leverage modern WebAssembly libraries (including pdf-lib, Tesseract.js, and browser Canvas APIs) to parse, modify, and re-encode document binaries in your device memory at native hardware speeds.',
    },
    {
      question: 'Can I use DocumentNest on mobile phones and tablets?',
      answer: 'Yes! All tools are fully responsive and engineered for touchscreens across iOS Safari, Android Chrome, and desktop browsers.',
    },
  ];

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'pdf':
        return <Layers className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
      case 'image':
        return <ImageIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case 'document':
        return <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'ocr':
        return <ScanText className="w-6 h-6 text-violet-600 dark:text-violet-400" />;
      default:
        return <Layers className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-12 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-slate-900/50 dark:via-slate-950 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free • Client-Side WebAssembly Processing • Zero Server Upload</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white max-w-4xl mx-auto leading-tight">
            Free Online PDF &amp;{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Document Tools
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Edit, convert, merge, split, compress, and manage your documents directly in your browser. Fast, private, and always free.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/pdf"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <span>Explore PDF Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base transition-colors"
            >
              <span>Browse All 22 Tools</span>
            </Link>
          </div>

          {/* Large Hero Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-4">
            <div className="relative flex items-center shadow-lg rounded-2xl border-2 border-blue-600/30 focus-within:border-blue-600 bg-white dark:bg-slate-900 p-2 transition-all">
              <Search className="w-6 h-6 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PDF and document tools... (e.g. merge, split, compress, ocr, jpg)"
                className="w-full px-3 py-2 text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden bg-transparent"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                Search
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400 mt-3">
              <span>Popular searches:</span>
              {['Merge PDF', 'Split PDF', 'Compress PDF', 'JPG to PDF', 'Image to Text', 'Watermark'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setSearchQuery(term);
                    const match = TOOLS_REGISTRY.find(
                      (t) =>
                        t.name.toLowerCase().includes(term.toLowerCase()) ||
                        t.keywords.some((k) => k.toLowerCase().includes(term.toLowerCase()))
                    );
                    if (match) router.push(`/${match.categorySlug}/${match.slug}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                Most Popular Tools
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Top utilities for rapid document, image, and PDF management
              </p>
            </div>
          </div>

          <Link
            href="/tools"
            className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View all 22 tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} showCategory={true} />
          ))}
        </div>
      </section>

      {/* Ad Placeholder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot position="top" />
      </div>

      {/* Explore Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Explore All Tool Categories
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            From multi-file PDF merges and rotations to client-side OCR and Markdown document compilation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((category) => {
            const count = TOOLS_REGISTRY.filter(
              (t) => t.category === category.id || t.categorySlug === category.slug
            ).length;

            return (
              <Link
                key={category.id}
                href={`/${category.slug}`}
                className="group relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 w-fit mb-4 group-hover:scale-110 transition-transform">
                    {getCategoryIcon(category.id)}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                    {category.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {category.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400 dark:text-slate-500">{count} Working Tools</span>
                  <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Private by Design Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <Lock className="w-3.5 h-3.5" />
              <span>Private by Design</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
              Why Document Privacy Matters
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Unlike other document converters that upload your contracts, tax returns, and medical records to remote servers, DocumentNest processes your files right inside your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-3">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Zero Cloud Uploads
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Your documents, PDFs, and photos are decoded and compiled in client-side WebAssembly memory. They are never transmitted over the internet to any server.
              </p>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-3">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 w-fit">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Instant Processing Speed
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Without network upload and download bottlenecks, your merges, splits, and compressions complete at the raw processing speed of your device CPU.
              </p>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-3">
              <div className="p-3 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 w-fit">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                100% Free Forever
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                No subscription paywalls, no email registrations, and no artificial daily document quotas. Ready whenever you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Homepage FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FAQSection faqs={homeFaqs} />
      </section>
    </div>
  );
}
