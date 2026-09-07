'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { ToolMetadata } from '../../lib/types';
import { IconRenderer } from './IconRenderer';
import { isFavorite, toggleFavorite } from '../../lib/utils/storage';

interface ToolCardProps {
  tool: ToolMetadata;
  showCategory?: boolean;
}

export function ToolCard({ tool, showCategory = true }: ToolCardProps) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(tool.id));
  }, [tool.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleFavorite(tool.id);
    setFavorite(updated);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'pdf':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900';
      case 'image':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900';
      case 'document':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900';
      case 'ocr':
        return 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 border-violet-200 dark:border-violet-900';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800';
    }
  };

  return (
    <Link
      href={`/${tool.categorySlug}/${tool.slug}`}
      className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 hover:-translate-y-1"
    >
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 group-hover:scale-105 transition-transform">
            <IconRenderer name={tool.icon} className="w-6 h-6" />
          </div>

          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              favorite
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400'
            }`}
          >
            <Star className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div>
          {showCategory && (
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border mb-2 ${getCategoryColor(
                tool.category
              )}`}
            >
              {tool.category}
            </span>
          )}

          <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {tool.name}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mt-1">
            {tool.shortDescription}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">100% In-Browser</span>
        <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
          <span>Open Tool</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
