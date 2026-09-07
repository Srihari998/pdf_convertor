'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, FileText, ArrowRight } from 'lucide-react';
import { TOOLS_REGISTRY } from '../../lib/tools/registry';
import { ToolMetadata } from '../../lib/types';
import { IconRenderer } from '../common/IconRenderer';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results: ToolMetadata[] = query.trim()
    ? TOOLS_REGISTRY.filter((tool) => {
        const q = query.toLowerCase().trim();
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.shortDescription.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q) ||
          tool.keywords.some((k) => k.toLowerCase().includes(q))
        );
      }).slice(0, 8)
    : TOOLS_REGISTRY.slice(0, 6);

  const handleSelect = (tool: ToolMetadata) => {
    router.push(`/${tool.categorySlug}/${tool.slug}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search PDF, image, OCR, or document tools... (e.g. merge, compress, ocr)"
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {query.trim() ? `Search Results (${results.length})` : 'Popular Document Tools'}
          </div>

          {results.length > 0 ? (
            results.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => handleSelect(tool)}
                className="flex items-center justify-between w-full p-3 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                    <IconRenderer name={tool.icon} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                        {tool.name}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {tool.shortDescription}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 transition-transform group-hover:translate-x-1" />
              </button>
            ))
          ) : (
            <div className="py-10 text-center text-xs text-slate-500">
              No matching tools found for &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
