'use client';

import React, { useState } from 'react';
import { textToPdf, markdownToPdf, htmlToPdf } from '../../lib/document/engine';
import { ProcessedResult, ProcessingProgress } from '../../lib/types';
import { FileProgress } from '../common/FileProgress';
import { ResultDownloadCard } from '../common/ResultDownloadCard';
import { AlertCircle, Play, FileText, Sparkles } from 'lucide-react';

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

      if (toolId === 'markdown-to-pdf') {
        res = await markdownToPdf(content, cleanName, (p, s) => setProgress({ percentage: p, statusText: s }));
      } else if (toolId === 'html-to-pdf') {
        res = await htmlToPdf(content, cleanName, (p, s) => setProgress({ percentage: p, statusText: s }));
      } else {
        res = await textToPdf(content, cleanName, { fontSize: 11, margin: 40 }, (p, s) => setProgress({ percentage: p, statusText: s }));
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

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {toolId === 'markdown-to-pdf' ? 'Markdown Editor' : toolId === 'html-to-pdf' ? 'HTML Code Input' : 'Text Input'}
          </label>
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

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          placeholder="Paste or write your content here..."
          className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 font-mono text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
        />
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
