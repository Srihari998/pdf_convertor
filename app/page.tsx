'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Zap,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  IndianRupee,
  ArrowLeftRight,
  Code2,
  FileText,
  Calendar,
  Calculator,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { TOOLS_REGISTRY, getPopularTools } from '../lib/tools/registry';
import { CATEGORIES } from '../lib/tools/categories';
import { ToolCard } from '../components/common/ToolCard';
import { AdBanner } from '../components/ads/AdBanner';
import { FAQSection } from '../components/common/FAQSection';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const popularTools = getPopularTools().slice(0, 8);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Find matching tool
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
      question: 'Is CalcNest really free to use?',
      answer: 'Yes, 100% free! There are no subscription fees, paywalls, or hidden charges for any of our 100+ calculators and utilities.',
    },
    {
      question: 'Do I need to create an account or sign in?',
      answer: 'No registration or login is required. You can start using any tool immediately without providing an email address or password.',
    },
    {
      question: 'Is my data secure and private?',
      answer: 'Yes! All calculations, string transformations, and QR code generations run completely locally in your browser via client-side JavaScript. Your confidential numbers, financial data, and code never leave your device.',
    },
    {
      question: 'How accurate are the academic and financial calculations?',
      answer: 'All formulas use industry-standard mathematics (e.g. reducing-balance EMI loan formulas, compound interest equations, and weighted credit GPA formulas). Financial and medical tools include clear disclaimers for informational context.',
    },
  ];

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'student':
        return <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case 'finance':
        return <IndianRupee className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'converters':
        return <ArrowLeftRight className="w-6 h-6 text-violet-600 dark:text-violet-400" />;
      case 'developer':
        return <Code2 className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />;
      case 'text':
        return <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'date-time':
        return <Calendar className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
      case 'calculators':
        return <Calculator className="w-6 h-6 text-sky-600 dark:text-sky-400" />;
      case 'health':
        return <Activity className="w-6 h-6 text-lime-600 dark:text-lime-400" />;
      default:
        return <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-8 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-slate-900/50 dark:via-slate-950 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100+ Free Online Calculators &amp; Useful Utilities</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white max-w-3xl mx-auto leading-tight">
            Calculate, Convert &amp; Solve Problems{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Instantly.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Free, fast, and privacy-first online tools. Academic CGPA &amp; attendance calculators, loan EMIs, SIP mutual fund returns, unit conversions, and developer tools.
          </p>

          {/* Large Hero Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center shadow-lg rounded-2xl border-2 border-blue-600/30 focus-within:border-blue-600 bg-white dark:bg-slate-900 p-2 transition-all">
              <Search className="w-6 h-6 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to calculate? (e.g. EMI, CGPA, Attendance, Percentage, Age...)"
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
              {['EMI', 'CGPA', 'Classes Can I Miss', 'Percentage', 'SIP', 'Age', 'JSON Formatter'].map((term) => (
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
                Calculators and utilities used by thousands daily
              </p>
            </div>
          </div>

          <Link
            href="/tools"
            className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View all 100+ tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} showCategory={true} />
          ))}
        </div>
      </section>

      {/* Ad Placement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner />
      </div>

      {/* Browse All Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Explore All Utility Categories
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            From academic grading and financial compounding to web developer tools and unit conversions.
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
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 w-fit mb-4 group-hover:scale-110 transition-transform">
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
                  <span className="text-slate-400 dark:text-slate-500">{count}+ Working Tools</span>
                  <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Choose CalcNest Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
              Why Use CalcNest?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Built for speed, accuracy, and zero hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 w-fit">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                100% Free Forever
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                No paid tiers, no subscriptions, and no gated features. Every calculation tool is open and free to all users.
              </p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Zero Data Tracking
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                All deterministic calculations execute 100% in your local browser memory. Your financial numbers and passwords never touch a server.
              </p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
              <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 w-fit">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Registration Needed
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Save time with zero account friction. Open CalcNest, compute your result in seconds, and copy your answer with one click.
              </p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 w-fit">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Mobile-First Design
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Engineered with touch-friendly inputs, zero layout shifts, dark mode support, and rapid responsiveness across smartphones and laptops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Homepage FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FAQSection faqs={homeFaqs} />
      </section>
    </div>
  );
}
