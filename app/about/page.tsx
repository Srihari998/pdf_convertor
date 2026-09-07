import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Zap, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About CalcNest — Free Calculators & Online Tools',
  description:
    'Learn about CalcNest, our mission to provide 100% free, private, client-side calculation and conversion tools with zero user tracking.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <Breadcrumbs items={[{ name: 'About', href: '/about' }]} />

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
          About CalcNest
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          CalcNest was built with a simple goal: to provide fast, reliable, privacy-first calculators and digital tools that work instantly without bloated ads, paid paywalls, or forced registration.
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Why We Built CalcNest
        </h2>
        <p>
          Too many online calculators today are cluttered with deceptive popups, slow loading times, and aggressive tracking scripts. When students need to quickly calculate their semester attendance or borrowers need to calculate their monthly loan EMI, they should not have to fight through cookie banners and slow page loads.
        </p>
        <p>
          CalcNest solves this by executing 100% of mathematical and conversion formulas locally in the user&apos;s browser. We don&apos;t store your data, we don&apos;t send your numbers to remote servers, and we never charge for access.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8 not-prose">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <Zap className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-slate-900 dark:text-white">Zero Latency</h3>
            <p className="text-xs text-slate-500">Calculations update live in real-time as you type.</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-slate-900 dark:text-white">Privacy First</h3>
            <p className="text-xs text-slate-500">No account required. Zero server data collection.</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <Heart className="w-6 h-6 text-rose-600" />
            <h3 className="font-bold text-slate-900 dark:text-white">100% Free</h3>
            <p className="text-xs text-slate-500">Available to everyone, everywhere without limits.</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Our Architecture &amp; Commitment
        </h2>
        <p>
          CalcNest is built with Next.js, React, TypeScript, and Tailwind CSS. The entire suite is designed to be lightweight, accessible, and fast on mobile networks.
        </p>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors"
        >
          <span>Explore All 100+ Tools</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/contact" className="text-sm font-semibold text-slate-500 hover:underline">
          Get in Touch →
        </Link>
      </div>
    </div>
  );
}
