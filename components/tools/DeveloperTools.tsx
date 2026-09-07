'use client';

import React, { useState, useEffect } from 'react';
import {
  formatJSON,
  minifyJSON,
  encodeBase64,
  decodeBase64,
  encodeURL,
  decodeURL,
  generateMultipleUUIDs,
  timestampToDate,
  dateToTimestamp,
  hexToRgb,
  rgbToHex,
  pxToRem,
  remToPx,
  generateHash,
  decodeJWT,
  escapeHtml,
  unescapeHtml,
  testRegex,
  formatSql,
} from '../../lib/calculators/developer';
import { CopyButton } from '../common/CopyButton';
import { ResultCard } from '../common/ResultCard';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export function JsonFormatterWidget() {
  const [input, setInput] = useState('{"name":"CalcNest","category":"utility","tools":100,"active":true}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ keys: number; depth: number; sizeBytes: number } | null>(null);

  useEffect(() => {
    handleFormat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormat = () => {
    const res = formatJSON(input, 2);
    if (res.isValid) {
      setOutput(res.formatted);
      setError(null);
      setStats(res.stats || null);
    } else {
      setError(res.error || 'Invalid JSON');
    }
  };

  const handleMinify = () => {
    const res = minifyJSON(input);
    if (res.isValid) {
      setOutput(res.formatted);
      setError(null);
      setStats(res.stats || null);
    } else {
      setError(res.error || 'Invalid JSON');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFormat}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Format (Beautify)
          </button>
          <button
            type="button"
            onClick={handleMinify}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Minify (Compress)
          </button>
          <button
            type="button"
            onClick={() => {
              setInput('');
              setOutput('');
              setError(null);
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            Clear
          </button>
        </div>

        {output && <CopyButton textToCopy={output} label="Copy JSON" />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Raw Input JSON
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={12}
            placeholder="Paste your JSON here..."
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Formatted Output
            </label>
            {stats && (
              <span className="text-[11px] text-slate-400">
                {stats.keys} keys • {stats.depth} levels • {stats.sizeBytes} B
              </span>
            )}
          </div>
          <textarea
            readOnly
            value={error ? `Error: ${error}` : output}
            rows={12}
            className={`w-full rounded-2xl border p-4 font-mono text-xs sm:text-sm focus:outline-hidden ${
              error
                ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800'
                : 'bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700'
            }`}
          />
        </div>
      </div>
    </div>
  );
}

export function Base64Widget() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [text, setText] = useState('Welcome to CalcNest free utility tools!');

  const output = mode === 'encode' ? encodeBase64(text) : decodeBase64(text);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 max-w-xs">
        <button
          type="button"
          onClick={() => setMode('encode')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            mode === 'encode' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
          }`}
        >
          Encode
        </button>
        <button
          type="button"
          onClick={() => setMode('decode')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            mode === 'decode' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
          }`}
        >
          Decode
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Input Text / String
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 font-mono text-xs sm:text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              {mode === 'encode' ? 'Base64 Encoded Result' : 'Decoded Plain Text'}
            </label>
            <CopyButton textToCopy={output} />
          </div>
          <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-4 font-mono text-xs sm:text-sm text-blue-700 dark:text-blue-300 break-all whitespace-pre-wrap">
            {output}
          </div>
        </div>
      </div>
    </div>
  );
}

export function UrlEncoderWidget() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [url, setUrl] = useState('https://calcnest.com/search?q=percentage calculator & emi');

  const output = mode === 'encode' ? encodeURL(url) : decodeURL(url);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 max-w-xs">
        <button
          type="button"
          onClick={() => setMode('encode')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            mode === 'encode' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
          }`}
        >
          Encode URL
        </button>
        <button
          type="button"
          onClick={() => setMode('decode')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            mode === 'decode' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
          }`}
        >
          Decode URL
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Input URL / Query String
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 font-mono text-xs sm:text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Result URL
            </label>
            <CopyButton textToCopy={output} />
          </div>
          <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-4 font-mono text-xs sm:text-sm text-blue-700 dark:text-blue-300 break-all">
            {output}
          </div>
        </div>
      </div>
    </div>
  );
}

export function UUIDGeneratorWidget() {
  const [count, setCount] = useState<number>(5);
  const [uuids, setUuids] = useState<string[]>([]);

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const handleGenerate = () => {
    setUuids(generateMultipleUUIDs(count));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Quantity:
          </label>
          {[1, 5, 10, 25].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setCount(num)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                count === num
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate New</span>
          </button>
          <CopyButton textToCopy={uuids.join('\n')} label="Copy All" />
        </div>
      </div>

      <div className="space-y-2">
        {uuids.map((id, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100"
          >
            <span className="truncate">{id}</span>
            <CopyButton textToCopy={id} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TimestampConverterWidget() {
  const [timestamp, setTimestamp] = useState<string>('1725200000');
  const [dateStr, setDateStr] = useState<string>('2026-09-01T12:00');

  const tsNum = parseInt(timestamp, 10) || 0;
  const dateRes = timestampToDate(tsNum);
  const tsRes = dateToTimestamp(dateStr);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          1. Epoch Timestamp to Human Date
        </h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder="1725200000"
            className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 font-mono text-sm text-slate-900 dark:text-white"
          />
          <button
            type="button"
            onClick={() => setTimestamp(Math.floor(Date.now() / 1000).toString())}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
          >
            Current Time
          </button>
        </div>

        {dateRes && !('error' in dateRes) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block text-[11px]">UTC Date Time:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">{dateRes.utc}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Local Date Time:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">{dateRes.local}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">ISO 8601 String:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">{dateRes.iso}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Relative:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{dateRes.relative}</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          2. Human Date to Epoch Timestamp
        </h3>
        <input
          type="datetime-local"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-white"
        />

        {tsRes && !('error' in tsRes) && (
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-between gap-4 font-mono">
            <div>
              <span className="text-xs text-blue-600 dark:text-blue-400 block">Unix Epoch Seconds:</span>
              <span className="text-xl font-black text-slate-950 dark:text-white">{tsRes.seconds}</span>
            </div>
            <CopyButton textToCopy={tsRes.seconds.toString()} />
          </div>
        )}
      </div>
    </div>
  );
}

export function HexToRgbWidget() {
  const [hex, setHex] = useState('#2563EB');

  const res = hexToRgb(hex);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            HEX Color Code
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={hex.startsWith('#') ? hex : `#${hex}`}
              onChange={(e) => setHex(e.target.value.toUpperCase())}
              className="w-12 h-12 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-1"
            />
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              placeholder="#2563EB"
              className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 font-mono font-bold text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {res && (
          <div
            className="h-24 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center font-mono font-bold text-white text-sm"
            style={{ backgroundColor: res.rgbString }}
          >
            {hex}
          </div>
        )}
      </div>

      {res && (
        <ResultCard
          title="Color Conversions"
          primaryLabel="RGB Format"
          primaryValue={res.rgbString}
          breakdown={[
            { label: 'HSL Value', value: res.hslString },
            { label: 'Red Channel', value: res.r },
            { label: 'Green Channel', value: res.g },
            { label: 'Blue Channel', value: res.b },
          ]}
        />
      )}
    </div>
  );
}

export function PxToRemWidget() {
  const [px, setPx] = useState('16');
  const [base, setBase] = useState('16');

  const pxNum = parseFloat(px) || 0;
  const baseNum = parseFloat(base) || 16;
  const res = pxToRem(pxNum, baseNum);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
            Pixels (PX)
          </label>
          <input
            type="number"
            value={px}
            onChange={(e) => setPx(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
            Base Font Size (px)
          </label>
          <input
            type="number"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <ResultCard
        title="Converted CSS Units"
        primaryLabel="REM Equivalent"
        primaryValue={`${res.rem}rem`}
        breakdown={[
          { label: 'EM Unit', value: `${res.em}em` },
          { label: 'Base Calculation', value: `${pxNum}px / ${baseNum}px` },
        ]}
      />
    </div>
  );
}

export function HashGeneratorWidget() {
  const [text, setText] = useState('CalcNest');
  const [algo, setAlgo] = useState<'SHA-256' | 'SHA-512' | 'SHA-1'>('SHA-256');
  const [hash, setHash] = useState('');

  useEffect(() => {
    generateHash(text, algo).then(setHash);
  }, [text, algo]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Select Hash Algorithm
        </label>
        <div className="flex gap-2">
          {(['SHA-256', 'SHA-512', 'SHA-1'] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAlgo(a)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                algo === a
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Text Input
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 font-mono text-sm text-slate-900 dark:text-white"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            {algo} Hash Digest
          </label>
          <CopyButton textToCopy={hash} />
        </div>
        <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-4 font-mono text-xs sm:text-sm text-blue-700 dark:text-blue-300 break-all">
          {hash}
        </div>
      </div>
    </div>
  );
}

export function JWTDecoderWidget() {
  const [jwt, setJwt] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MjAwMDAwMDB9.4S1T6-fake-signature'
  );

  const res = decodeJWT(jwt);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Encoded JWT Token
        </label>
        <textarea
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
          rows={4}
          placeholder="Paste JWT token..."
          className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 font-mono text-xs text-slate-900 dark:text-white"
        />
      </div>

      {res.isValid ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Header
            </label>
            <pre className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white overflow-x-auto">
              {res.header}
            </pre>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Payload Claims
            </label>
            <pre className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white overflow-x-auto">
              {res.payload}
            </pre>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
          {res.error}
        </div>
      )}
    </div>
  );
}

export function RegexTesterWidget() {
  const [pattern, setPattern] = useState('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Contact support at hello@calcnest.com or team@example.org.');

  const res = testRegex(pattern, flags, text);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Regular Expression Pattern
          </label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 font-mono text-xs sm:text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Flags (g, i, m)
          </label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 font-mono text-xs sm:text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          Test String
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 font-mono text-xs sm:text-sm text-slate-900 dark:text-white"
        />
      </div>

      <ResultCard
        title="Regex Test Output"
        primaryLabel="Total Matches Found"
        primaryValue={res.matchCount}
        badge={{ text: res.isValid ? 'Valid Regex' : 'Invalid Regex', variant: res.isValid ? 'success' : 'danger' }}
        breakdown={res.matches.slice(0, 4).map((m, i) => ({
          label: `Match #${i + 1}`,
          value: m.match,
        }))}
      />
    </div>
  );
}

export function MarkdownPreviewerWidget() {
  const [markdown, setMarkdown] = useState(
    '# Hello CalcNest\n\n- Free calculators\n- Fast tools\n- **100% Client side**\n\n```js\nconsole.log("Ready to launch!");\n```'
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Markdown Editor
          </label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={12}
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 font-mono text-xs sm:text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Rendered Text Preview
          </label>
          <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-4 text-xs sm:text-sm text-slate-900 dark:text-white min-h-[280px] whitespace-pre-wrap">
            {markdown}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SqlFormatterWidget() {
  const [sql, setSql] = useState('select id, name, email from users where active = 1 and status = "approved" order by created_at desc limit 10;');

  const formatted = formatSql(sql);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Raw SQL Query
        </label>
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 font-mono text-xs sm:text-sm text-slate-900 dark:text-white"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Formatted SQL
          </label>
          <CopyButton textToCopy={formatted} />
        </div>
        <pre className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs sm:text-sm text-blue-700 dark:text-blue-300 overflow-x-auto whitespace-pre">
          {formatted}
        </pre>
      </div>
    </div>
  );
}
