'use client';

import React, { useState, useMemo } from 'react';
import { Search, Star, Grid, Filter } from 'lucide-react';
import { TOOLS_REGISTRY } from '../../lib/tools/registry';
import { CATEGORIES } from '../../lib/tools/categories';
import { ToolCard } from '../../components/common/ToolCard';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { AdSlot } from '../../components/common/AdSlot';
import { getFavorites } from '../../lib/utils/storage';

export default function ToolsDirectoryPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const filteredTools = useMemo(() => {
    const q = search.toLowerCase().trim();
    const favIds = showOnlyFavorites ? getFavorites() : [];

    return TOOLS_REGISTRY.filter((tool) => {
      if (showOnlyFavorites && !favIds.includes(tool.id)) {
        return false;
      }

      if (selectedCategory !== 'all') {
        if (tool.category !== selectedCategory && tool.categorySlug !== selectedCategory) {
          return false;
        }
      }

      if (!q) return true;

      const matchName = tool.name.toLowerCase().includes(q);
      const matchDesc = tool.shortDescription.toLowerCase().includes(q);
      const matchKeywords = tool.keywords.some((k) => k.toLowerCase().includes(q));
      return matchName || matchDesc || matchKeywords;
    });
  }, [search, selectedCategory, showOnlyFavorites]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ name: 'Tools Directory', href: '/tools' }]} />

      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800">
          <Grid className="w-3.5 h-3.5" />
          <span>Full Tool Index</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
          All 22 Online Document Tools
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Search, filter, and access any utility across PDF, Image, Document, and OCR categories. 100% free with instant in-browser WebAssembly processing.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools by name or purpose... (e.g. merge, compress, ocr, split, image)"
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Category Pills & Favorites toggle */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none max-w-full">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setShowOnlyFavorites(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all' && !showOnlyFavorites
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All Tools ({TOOLS_REGISTRY.length})
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setShowOnlyFavorites(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id && !showOnlyFavorites
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              showOnlyFavorites
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-700 dark:text-amber-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-current text-amber-500' : ''}`} />
            <span>My Favorites</span>
          </button>
        </div>
      </div>

      {/* Tools Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Showing {filteredTools.length} tools</span>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} showCategory={true} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-2">
            <Search className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No matching tools found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try refining your search terms or explore all categories above.
            </p>
          </div>
        )}
      </section>

      {/* Ad Placement */}
      <AdSlot position="bottom" />
    </div>
  );
}
