'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';
import { ToolMetadata } from '../../lib/types';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { IconRenderer } from '../common/IconRenderer';
import { PrivacyBadge } from '../common/PrivacyBadge';
import { FAQSection } from '../common/FAQSection';
import { RelatedTools } from '../common/RelatedTools';
import { AdSlot } from '../common/AdSlot';
import { addRecentTool, isFavorite, toggleFavorite } from '../../lib/utils/storage';

import { PdfToolWidget } from './PdfTools';
import { ImageToolWidget } from './ImageTools';
import { DocumentToolWidget } from './DocumentTools';
import { OcrToolWidget } from './OcrTools';

interface ToolViewProps {
  tool: ToolMetadata;
}

export function ToolView({ tool }: ToolViewProps) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    addRecentTool(tool.id);
    setFavorite(isFavorite(tool.id));
  }, [tool.id]);

  const handleToggleFavorite = () => {
    const updated = toggleFavorite(tool.id);
    setFavorite(updated);
  };

  const renderWidget = () => {
    if (tool.category === 'pdf') {
      return <PdfToolWidget toolId={tool.id} />;
    }
    if (tool.category === 'image') {
      return <ImageToolWidget toolId={tool.id} />;
    }
    if (tool.category === 'document') {
      return <DocumentToolWidget toolId={tool.id} />;
    }
    if (tool.category === 'ocr') {
      return <OcrToolWidget toolId={tool.id} />;
    }
    return <PdfToolWidget toolId={tool.id} />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { name: tool.category.toUpperCase() + ' Tools', href: `/${tool.categorySlug}` },
          { name: tool.name, href: `/${tool.categorySlug}/${tool.slug}` },
        ]}
      />

      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 shadow-xs">
              <IconRenderer name={tool.icon} className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {tool.category} Utility
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
                {tool.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                favorite
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-700 dark:text-amber-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-500'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${favorite ? 'fill-current text-amber-500' : ''}`} />
              <span>{favorite ? 'Saved' : 'Favorite'}</span>
            </button>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {tool.longDescription}
        </p>

        <PrivacyBadge isClientSide={tool.isClientSideOnly} />
      </div>

      {/* Main Tool Widget Card */}
      <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-8 shadow-xs">
        {renderWidget()}
      </section>

      {/* Non-intrusive AdSlot */}
      <AdSlot position="middle" />

      {/* How To Use */}
      {tool.howToUse && tool.howToUse.length > 0 && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              How to Use {tool.name}
            </h2>
          </div>
          <ol className="space-y-2.5 list-decimal list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {tool.howToUse.map((step, idx) => (
              <li key={idx} className="pl-1">
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Key Features */}
      {tool.features && tool.features.length > 0 && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Key Features
            </h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {tool.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQs */}
      {tool.faqs && tool.faqs.length > 0 && <FAQSection faqs={tool.faqs} />}

      {/* Related Tools */}
      <RelatedTools currentTool={tool} />
    </div>
  );
}
