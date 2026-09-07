'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { ToolMetadata } from '../../lib/types';
import { IconRenderer } from './IconRenderer';
import { isFavorite, toggleFavorite } from '../../lib/storage';

interface ToolCardProps {
  tool: ToolMetadata;
  showCategory?: boolean;
}

export function ToolCard({ tool, showCategory = true }: ToolCardProps) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(tool.id));
    const handleStorageChange = () => setFavorite(isFavorite(tool.id));
    window.addEventListener('calcnest_storage_change', handleStorageChange);
    return () => window.removeEventListener('calcnest_storage_change', handleStorageChange);
  }, [tool.id]);

  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleFavorite(tool.id);
    setFavorite(updated);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'student':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-900';
      case 'finance':
        return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900';
      case 'converters':
        return 'text-violet-600 bg-violet-50 dark:bg-violet-950/60 dark:text-violet-400 border-violet-200 dark:border-violet-900';
      case 'developer':
        return 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900';
      case 'text':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900';
      case 'date-time':
        return 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-900';
      case 'health':
        return 'text-lime-600 bg-lime-50 dark:bg-lime-950/60 dark:text-lime-400 border-lime-200 dark:border-lime-900';
      default:
        return 'text-sky-600 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-400 border-sky-200 dark:border-sky-900';
    }
  };

  return (
    <Link
      href={`/${tool.categorySlug}/${tool.slug}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`p-2.5 rounded-xl border ${getCategoryColor(tool.category)} transition-transform group-hover:scale-105`}>
            <IconRenderer name={tool.icon} className="w-5 h-5" />
          </div>

          <button
            type="button"
            onClick={handleStarClick}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              favorite
                ? 'text-amber-500 hover:text-amber-600'
                : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
            }`}
          >
            <Star className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-1.5">
          {tool.name}
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        {showCategory ? (
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {tool.category}
          </span>
        ) : (
          <span />
        )}
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          Open Tool →
        </span>
      </div>
    </Link>
  );
}
