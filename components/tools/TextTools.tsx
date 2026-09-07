'use client';

import React, { useState } from 'react';
import {
  countText,
  convertCase,
  removeDuplicateLines,
  removeExtraSpaces,
  sortLines,
  reverseText,
  generateLoremIpsum,
  slugify,
  findAndReplace,
  getWordFrequency,
} from '../../lib/calculators/text';
import { CopyButton } from '../common/CopyButton';
import { ResultCard } from '../common/ResultCard';

export function WordCounterWidget() {
  const [text, setText] = useState(
    'CalcNest is a production-quality website providing free calculators and useful online tools. Every tool is built with speed, precision, and privacy in mind.'
  );

  const stats = countText(text);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Type or Paste Text Below:
        </span>
        <div className="flex items-center gap-2">
          <CopyButton textToCopy={text} label="Copy Text" />
          <button
            type="button"
            onClick={() => setText('')}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Start typing or paste your article, essay, or code here..."
        className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-slate-900 dark:text-white text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-blue-500"
      />

      <ResultCard
        title="Live Text Statistics"
        primaryLabel="Total Word Count"
        primaryValue={stats.words}
        primaryUnit={stats.words === 1 ? 'word' : 'words'}
        badge={{ text: `Reading Time: ~${stats.readingTimeMinutes} min`, variant: 'info' }}
        breakdown={[
          { label: 'Characters (with spaces)', value: stats.characters },
          { label: 'Characters (no spaces)', value: stats.charactersNoSpaces },
          { label: 'Sentences', value: stats.sentences },
          { label: 'Paragraphs', value: stats.paragraphs },
          { label: 'Lines', value: stats.lines },
          { label: 'Speaking Time', value: `~${stats.speakingTimeMinutes} min` },
        ]}
      />
    </div>
  );
}

export function CaseConverterWidget() {
  const [text, setText] = useState('free online calculators and tools');

  const cases = [
    { id: 'uppercase', label: 'UPPERCASE' },
    { id: 'lowercase', label: 'lowercase' },
    { id: 'titlecase', label: 'Title Case' },
    { id: 'sentencecase', label: 'Sentence case' },
    { id: 'camelcase', label: 'camelCase' },
    { id: 'pascalcase', label: 'PascalCase' },
    { id: 'snakecase', label: 'snake_case' },
    { id: 'kebabcase', label: 'kebab-case' },
  ] as const;

  const handleConvert = (mode: (typeof cases)[number]['id']) => {
    setText(convertCase(text, mode));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {cases.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => handleConvert(c.id)}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            {c.label}
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-slate-900 dark:text-white text-sm sm:text-base"
      />

      <div className="flex justify-end">
        <CopyButton textToCopy={text} label="Copy Converted Text" />
      </div>
    </div>
  );
}

export function DuplicateLinesWidget() {
  const [text, setText] = useState('apple\nbanana\norange\napple\nbanana\ngrapes');
  const [caseSensitive, setCaseSensitive] = useState(true);

  const clean = removeDuplicateLines(text, caseSensitive, true);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded accent-blue-600"
          />
          <span>Case Sensitive</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Original List (with duplicates)
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 font-mono text-xs sm:text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Clean Deduplicated List
            </label>
            <CopyButton textToCopy={clean} />
          </div>
          <textarea
            readOnly
            value={clean}
            rows={8}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-3.5 font-mono text-xs sm:text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}

export function TextSorterWidget() {
  const [text, setText] = useState('Zebra\nApple\nMango\nBanana\nOrange');
  const [mode, setMode] = useState<'az' | 'za' | 'length' | 'natural'>('az');

  const sorted = sortLines(text, mode);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode('az')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
            mode === 'az' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          A → Z (Alphabetical)
        </button>
        <button
          type="button"
          onClick={() => setMode('za')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
            mode === 'za' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Z → A (Reverse)
        </button>
        <button
          type="button"
          onClick={() => setMode('length')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
            mode === 'length' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          By Line Length
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 font-mono text-xs sm:text-sm text-slate-900 dark:text-white"
        />
        <div className="space-y-2">
          <div className="flex justify-end">
            <CopyButton textToCopy={sorted} />
          </div>
          <textarea
            readOnly
            value={sorted}
            rows={7}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-3.5 font-mono text-xs sm:text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}

export function LoremIpsumWidget() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [lorem, setLorem] = useState('');

  const handleGenerate = () => {
    setLorem(generateLoremIpsum(count, type));
  };

  React.useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, type]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Count:</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-20 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-sm text-slate-900 dark:text-white"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'paragraphs' | 'sentences' | 'words')}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold cursor-pointer"
          >
            Regenerate
          </button>
          <CopyButton textToCopy={lorem} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-5 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
        {lorem}
      </div>
    </div>
  );
}

export function SlugGeneratorWidget() {
  const [title, setTitle] = useState('How to Calculate CGPA and Attendance in College (2026 Guide)');
  const slug = slugify(title);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Enter Article Title or Text
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white text-sm"
        />
      </div>

      <ResultCard
        title="SEO URL Slug"
        primaryLabel="Generated URL Slug"
        primaryValue={slug}
        breakdown={[
          { label: 'Character Count', value: slug.length },
          { label: 'Cleaned Words', value: slug.split('-').length },
        ]}
      />
    </div>
  );
}

export function FindAndReplaceWidget() {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog. The fox is fast.');
  const [find, setFind] = useState('fox');
  const [replace, setReplace] = useState('cat');
  const [caseSens, setCaseSens] = useState(false);

  const res = findAndReplace(text, find, replace, caseSens);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Find
          </label>
          <input
            type="text"
            value={find}
            onChange={(e) => setFind(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Replace With
          </label>
          <input
            type="text"
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Input Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Replaced Output ({res.count} replacements)
            </label>
            <CopyButton textToCopy={res.result} />
          </div>
          <textarea
            readOnly
            value={res.result}
            rows={6}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-3.5 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}

export function WordFrequencyWidget() {
  const [text, setText] = useState(
    'Next.js is a React framework for building full-stack web applications. React components are used to build user interfaces, and Next.js provides additional structure, features, and optimizations.'
  );

  const freq = getWordFrequency(text);

  return (
    <div className="space-y-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 text-sm text-slate-900 dark:text-white"
      />

      {freq.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Keyword Density &amp; Word Rankings
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-semibold">Word</th>
                  <th className="px-4 py-2 font-semibold">Count</th>
                  <th className="px-4 py-2 font-semibold">Density %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {freq.map((item) => (
                  <tr key={item.word}>
                    <td className="px-4 py-2 font-mono font-semibold text-slate-900 dark:text-slate-100">{item.word}</td>
                    <td className="px-4 py-2 text-blue-600 dark:text-blue-400 font-bold">{item.count}</td>
                    <td className="px-4 py-2 text-slate-500">{item.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
