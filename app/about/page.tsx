import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Zap, Heart, Sparkles, ArrowRight, Lock, Laptop } from 'lucide-react';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About DocumentNest — Privacy-First Document & PDF Utilities',
  description:
    'Learn about DocumentNest, our 100% browser-based processing architecture, zero server uploads, and commitment to free public tools.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <Breadcrumbs items={[{ name: 'About', href: '/about' }]} />

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Vision &amp; Privacy Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
          About DocumentNest
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          DocumentNest is a modern, privacy-first web application designed to perform PDF merging, splitting, compression, editing, image conversion, and optical character recognition (OCR) without uploading user files to any server.
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          The Problem with Traditional Document Converters
        </h2>
        <p>
          Most online PDF converters force you to upload sensitive contracts, bank statements, medical records, and personal IDs to their cloud servers. This presents severe privacy hazards, slow upload queues, file size paywalls, and data breach vulnerabilities.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          The DocumentNest Solution: 100% In-Browser Execution
        </h2>
        <p>
          DocumentNest harnesses cutting-edge WebAssembly (Wasm) and HTML5 Canvas APIs to execute document manipulations directly in your browser&apos;s local memory:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8 not-prose">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <Lock className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-slate-900 dark:text-white">100% Private</h3>
            <p className="text-xs text-slate-500">Your documents never travel across the internet.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <Zap className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-slate-900 dark:text-white">Zero Wait Time</h3>
            <p className="text-xs text-slate-500">Operations process at the native speed of your device CPU.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <Heart className="w-6 h-6 text-rose-600" />
            <h3 className="font-bold text-slate-900 dark:text-white">100% Free</h3>
            <p className="text-xs text-slate-500">No subscriptions, no watermarks, and no signups.</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Our Zero-Cost, Sustainable Stack
        </h2>
        <p>
          Built with Next.js, TypeScript, and Tailwind CSS, DocumentNest is hosted on Vercel at ₹0 server infrastructure cost, ensuring the service can remain permanently free and accessible to students, professionals, and developers worldwide.
        </p>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors"
        >
          <span>Explore All 22 Tools</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/contact" className="text-sm font-semibold text-slate-500 hover:underline">
          Get in Touch →
        </Link>
      </div>
    </div>
  );
}
