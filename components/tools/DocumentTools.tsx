'use client';

import React, { useState } from 'react';
import { textToPdf, markdownToPdf, htmlToPdf } from '../../lib/document/engine';
import { ProcessedResult, ProcessingProgress } from '../../lib/types';
import { FileProgress } from '../common/FileProgress';
import { ResultDownloadCard } from '../common/ResultDownloadCard';
import { AlertCircle, Play, Sliders, Eye, Edit3 } from 'lucide-react';
import { marked } from 'marked';

interface DocumentToolProps {
  toolId: string;
}

export function DocumentToolWidget({ toolId }: DocumentToolProps) {
  const [content, setContent] = useState<string>(() => {
    if (toolId === 'markdown-to-pdf') {
      return '# Document Title\n\nThis is a sample **Markdown** document generated with DocumentNest.\n\n## Features:\n- 100% Client-side processing\n- Zero server uploads\n- Fast rendering\n\n```js\nconsole.log("Hello DocumentNest!");\n```';
    }
    if (toolId === 'html-to-pdf') {
      return '<h1>Document Header</h1>\n<p>This is a paragraph of <strong>HTML text</strong> rendered directly into a PDF.</p>';
    }
    return 'Document Title\n\nType or paste your text notes here. The DocumentNest engine will format and paginate this text into a clean PDF.';
  });

  const [filename, setFilename] = useState('document');
  const [fontSize, setFontSize] = useState<number>(11);
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [margin, setMargin] = useState<number>(40);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!content.trim()) return;
    setError(null);
    setProgress({ percentage: 20, statusText: 'Formatting document...' });

    try {
      let res: ProcessedResult;
      const cleanName = `${filename.trim() || 'document'}.pdf`;
      const options = { fontSize, fontFamily, margin };

      if (toolId === 'markdown-to-pdf') {
        res = await markdownToPdf(content, cleanName, options, (p, s) =>
          setProgress({ percentage: p, statusText: s })
        );
      } else if (toolId === 'html-to-pdf') {
        res = await htmlToPdf(content, cleanName, options, (p, s) =>
          setProgress({ percentage: p, statusText: s })
        );
      } else {
        res = await textToPdf(content, cleanName, options, (p, s) =>
          setProgress({ percentage: p, statusText: s })
        );
      }

      setResult(res);
      setProgress(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to render document into PDF.');
      setProgress(null);
    }
  };

  const handleReset = () => {
    setResult(null);
    setProgress(null);
    setError(null);
  };

  if (result) {
    return <ResultDownloadCard result={result} onReset={handleReset} />;
  }

  const renderPreview = () => {
    if (toolId === 'markdown-to-pdf') {
      const htmlContent = marked.parse(content) as string;
      return (
        <div
          className="prose dark:prose-invert max-w-none p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-h-[250px]"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    }
    if (toolId === 'html-to-pdf') {
      return (
        <div
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-h-[250px]"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 whitespace-pre-wrap font-sans text-sm min-h-[250px]">
        {content}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Editor & Preview Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filename:</span>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="document"
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold"
            />
            <span className="text-xs text-slate-400">.pdf</span>
          </div>
        </div>

        {activeTab === 'edit' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            placeholder="Paste or write your content here..."
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 font-mono text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        ) : (
          renderPreview()
        )}
      </div>

      {/* Typography & Page Settings */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>Page &amp; Typography Styling</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Font Family
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value as any)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-sm"
            >
              <option value="sans">Helvetica / Sans-Serif</option>
              <option value="serif">Times / Serif (Classic)</option>
              <option value="mono">Courier / Monospace</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Font Size ({fontSize} pt)
            </label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-sm"
            >
              <option value={9}>9 pt (Compact)</option>
              <option value={11}>11 pt (Standard Body)</option>
              <option value={13}>13 pt (Large)</option>
              <option value={16}>16 pt (Heading / Title)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Page Margins
            </label>
            <select
              value={margin}
              onChange={(e) => setMargin(parseInt(e.target.value, 10))}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-sm"
            >
              <option value={20}>Narrow (20 pt)</option>
              <option value={40}>Normal (40 pt)</option>
              <option value={60}>Wide (60 pt)</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs sm:text-sm font-semibold text-red-700 dark:text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {progress && <FileProgress progress={progress} />}

      {!progress && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleProcess}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Generate PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}
