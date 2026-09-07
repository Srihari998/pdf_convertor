'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  calculatePercentageOf,
  calculateIsWhatPercentOf,
  calculatePercentageChange,
  generatePassword,
  generateRandomNumber,
  calculateTip,
  fractionToDecimal,
  decimalToFraction,
  gcd,
  lcm,
  calculateStats,
  solveRatio,
  calculateAspectRatio,
} from '../../lib/calculators/math';
import { InputField } from '../common/InputField';
import { ResultCard } from '../common/ResultCard';
import { CopyButton } from '../common/CopyButton';
import { formatCurrencyINR } from '../../lib/formatters';
import { Download, RefreshCw, Dices } from 'lucide-react';

export function PercentageCalculatorWidget() {
  const [mode, setMode] = useState<'what_is' | 'is_what' | 'change'>('what_is');

  // Mode 1: What is X% of Y?
  const [p1, setP1] = useState('20');
  const [t1, setT1] = useState('500');

  // Mode 2: X is what % of Y?
  const [v2, setV2] = useState('40');
  const [t2, setT2] = useState('200');

  // Mode 3: % Increase/Decrease from A to B
  const [oldVal, setOldVal] = useState('100');
  const [newVal, setNewVal] = useState('125');

  const res1 = calculatePercentageOf(parseFloat(p1) || 0, parseFloat(t1) || 0);
  const res2 = calculateIsWhatPercentOf(parseFloat(v2) || 0, parseFloat(t2) || 0);
  const res3 = calculatePercentageChange(parseFloat(oldVal) || 0, parseFloat(newVal) || 0);

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800">
        <button
          type="button"
          onClick={() => setMode('what_is')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            mode === 'what_is' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          What is X% of Y?
        </button>
        <button
          type="button"
          onClick={() => setMode('is_what')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            mode === 'is_what' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          X is What % of Y?
        </button>
        <button
          type="button"
          onClick={() => setMode('change')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            mode === 'change' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          % Increase / Decrease
        </button>
      </div>

      {mode === 'what_is' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField id="pct-p1" label="What is (Percentage %)" type="number" unit="%" value={p1} onChange={setP1} placeholder="20" />
            <InputField id="pct-t1" label="Of Total Number" type="number" value={t1} onChange={setT1} placeholder="500" />
          </div>
          <ResultCard
            title="Result Calculation"
            primaryLabel={`${p1}% of ${t1}`}
            primaryValue={res1}
            breakdown={[
              { label: 'Calculation Formula', value: `(${p1} × ${t1}) / 100` },
              { label: 'Remainder', value: (parseFloat(t1) || 0) - res1 },
            ]}
          />
        </div>
      )}

      {mode === 'is_what' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField id="pct-v2" label="Number Value (X)" type="number" value={v2} onChange={setV2} placeholder="40" />
            <InputField id="pct-t2" label="Is What % of Total (Y)" type="number" value={t2} onChange={setT2} placeholder="200" />
          </div>
          <ResultCard
            title="Result Percentage"
            primaryLabel={`${v2} as a Percentage of ${t2}`}
            primaryValue={`${res2}%`}
            breakdown={[
              { label: 'Formula', value: `(${v2} / ${t2}) × 100` },
            ]}
          />
        </div>
      )}

      {mode === 'change' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField id="pct-old" label="Initial / Original Value" type="number" value={oldVal} onChange={setOldVal} placeholder="100" />
            <InputField id="pct-new" label="Final / New Value" type="number" value={newVal} onChange={setNewVal} placeholder="125" />
          </div>
          <ResultCard
            title="Percentage Change"
            primaryLabel={res3.type === 'increase' ? 'Percentage Increase' : 'Percentage Decrease'}
            primaryValue={`${res3.changePercent}%`}
            badge={{
              text: res3.type === 'increase' ? `+${res3.difference} Gain` : `${res3.difference} Drop`,
              variant: res3.type === 'increase' ? 'success' : 'danger',
            }}
            breakdown={[
              { label: 'Absolute Difference', value: res3.difference },
              { label: 'Formula', value: '((New - Old) / Old) × 100' },
            ]}
          />
        </div>
      )}
    </div>
  );
}

export function PasswordGeneratorWidget() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);

  const [res, setRes] = useState(() =>
    generatePassword({
      length: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
    })
  );

  const handleGenerate = () => {
    setRes(
      generatePassword({
        length,
        includeUppercase: uppercase,
        includeLowercase: lowercase,
        includeNumbers: numbers,
        includeSymbols: symbols,
      })
    );
  };

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, uppercase, lowercase, numbers, symbols]);

  return (
    <div className="space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/40 flex items-center justify-between gap-4">
        <span className="font-mono text-base sm:text-2xl font-black text-slate-950 dark:text-white break-all tracking-wider">
          {res.password}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleGenerate}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
            aria-label="Generate new password"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <CopyButton textToCopy={res.password} label="Copy" />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Password Length: <span className="text-blue-600 dark:text-blue-400 font-bold">{length} characters</span>
            </label>
            <span className="text-xs font-semibold text-slate-500">
              Strength: <span className="text-emerald-600 font-bold uppercase">{res.strength.replace('_', ' ')}</span>
            </span>
          </div>
          <input
            type="range"
            min={6}
            max={64}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value, 10))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Uppercase (A-Z)', val: uppercase, set: setUppercase },
            { label: 'Lowercase (a-z)', val: lowercase, set: setLowercase },
            { label: 'Numbers (0-9)', val: numbers, set: setNumbers },
            { label: 'Symbols (!@#$)', val: symbols, set: setSymbols },
          ].map((item, i) => (
            <label
              key={i}
              className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={item.val}
                onChange={(e) => item.set(e.target.checked)}
                className="rounded accent-blue-600"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export function QRCodeWidget() {
  const [text, setText] = useState('https://calcnest.com');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && text) {
      QRCode.toCanvas(
        canvasRef.current,
        text,
        {
          width: 256,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        () => {}
      );
    }
  }, [text]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calcnest-qrcode.png';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Enter URL, Contact Info, or Text
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 text-sm text-slate-900 dark:text-white"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 justify-center">
        <div className="p-3 bg-white rounded-2xl shadow-md">
          <canvas ref={canvasRef} className="rounded-xl max-w-[200px] h-auto" />
        </div>

        <div className="space-y-3 text-center sm:text-left">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
              QR Code Generated
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              Rendered 100% locally in your browser. Works offline and never expires.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG Image</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function RandomNumberWidget() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState(1);
  const [numbers, setNumbers] = useState<number[]>([42]);

  const handleGenerate = () => {
    const minVal = parseInt(min, 10) || 1;
    const maxVal = parseInt(max, 10) || 100;
    setNumbers(generateRandomNumber(minVal, maxVal, count));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField id="rng-min" label="Minimum Bound" type="number" value={min} onChange={setMin} />
        <InputField id="rng-max" label="Maximum Bound" type="number" value={max} onChange={setMax} />
        <InputField id="rng-cnt" label="Count (1 - 50)" type="number" value={count.toString()} onChange={(v) => setCount(Math.min(50, Math.max(1, parseInt(v, 10) || 1)))} />
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-base font-bold transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Dices className="w-5 h-5" />
          <span>Generate Random Number</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-3 justify-center pt-2">
        {numbers.map((n, i) => (
          <div
            key={i}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg"
          >
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TipCalculatorWidget() {
  const [bill, setBill] = useState('1500');
  const [tipPct, setTipPct] = useState('10');
  const [people, setPeople] = useState('3');

  const res = calculateTip(parseFloat(bill) || 0, parseFloat(tipPct) || 0, parseInt(people, 10) || 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField id="tip-bill" label="Total Bill Amount" type="number" prefix="₹" value={bill} onChange={setBill} />
        <InputField id="tip-pct" label="Tip Percentage (%)" type="number" unit="%" value={tipPct} onChange={setTipPct} />
        <InputField id="tip-people" label="Number of People" type="number" min={1} value={people} onChange={setPeople} />
      </div>

      <ResultCard
        title="Bill & Tip Split"
        primaryLabel="Total Per Person"
        primaryValue={formatCurrencyINR(res.perPersonTotal)}
        breakdown={[
          { label: 'Tip Amount Total', value: formatCurrencyINR(res.tipAmount) },
          { label: 'Total Bill with Tip', value: formatCurrencyINR(res.totalBill) },
          { label: 'Tip Per Person', value: formatCurrencyINR(res.perPersonTip) },
        ]}
      />
    </div>
  );
}

export function FractionToDecimalWidget() {
  const [num, setNum] = useState('3');
  const [den, setDen] = useState('8');

  const res = fractionToDecimal(parseFloat(num) || 0, parseFloat(den) || 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField id="frac-num" label="Numerator (Top)" type="number" value={num} onChange={setNum} />
        <InputField id="frac-den" label="Denominator (Bottom)" type="number" value={den} onChange={setDen} />
      </div>

      <ResultCard
        title="Fraction to Decimal"
        primaryLabel="Decimal Equivalent"
        primaryValue={res.decimal}
        breakdown={[
          { label: 'Simplified Fraction', value: res.simplified },
          { label: 'Percentage', value: `${(res.decimal * 100).toFixed(2)}%` },
        ]}
      />
    </div>
  );
}

export function RatioCalculatorWidget() {
  const [a, setA] = useState('2');
  const [b, setB] = useState('3');
  const [c, setC] = useState('4');

  const solvedX = solveRatio(parseFloat(a) || 1, parseFloat(b) || 1, parseFloat(c) || 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <InputField id="ratio-a" label="A" type="number" value={a} onChange={setA} />
        <InputField id="ratio-b" label="B" type="number" value={b} onChange={setB} />
        <InputField id="ratio-c" label="C" type="number" value={c} onChange={setC} />
      </div>

      <ResultCard
        title="Ratio Solver (A : B = C : X)"
        primaryLabel="Value of X"
        primaryValue={solvedX}
        breakdown={[
          { label: 'Proportion', value: `${a} : ${b} = ${c} : ${solvedX}` },
          { label: 'Formula', value: 'X = (B × C) / A' },
        ]}
      />
    </div>
  );
}

export function GcdLcmWidget() {
  const [n1, setN1] = useState('12');
  const [n2, setN2] = useState('18');

  const v1 = parseInt(n1, 10) || 0;
  const v2 = parseInt(n2, 10) || 0;
  const gcdVal = gcd(v1, v2);
  const lcmVal = lcm(v1, v2);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField id="gcd-1" label="First Number" type="number" value={n1} onChange={setN1} />
        <InputField id="gcd-2" label="Second Number" type="number" value={n2} onChange={setN2} />
      </div>

      <ResultCard
        title="Divisor & Multiple"
        primaryLabel="Greatest Common Divisor (GCD / HCF)"
        primaryValue={gcdVal}
        breakdown={[
          { label: 'Least Common Multiple (LCM)', value: lcmVal, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Product of Numbers', value: v1 * v2 },
        ]}
      />
    </div>
  );
}

export function StatisticsWidget() {
  const [raw, setRaw] = useState('12, 15, 20, 20, 25, 30, 45, 50');

  const numbers = raw
    .split(/[,\s]+/)
    .map(Number)
    .filter((n) => !isNaN(n));

  const stats = calculateStats(numbers);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Enter Numbers (Comma or Space Separated)
        </label>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 font-mono text-sm text-slate-900 dark:text-white"
        />
      </div>

      {stats && (
        <ResultCard
          title="Descriptive Statistics"
          primaryLabel="Arithmetic Mean (Average)"
          primaryValue={stats.mean}
          breakdown={[
            { label: 'Median', value: stats.median },
            { label: 'Standard Deviation', value: stats.stdDev },
            { label: 'Variance', value: stats.variance },
            { label: 'Min / Max', value: `${stats.min} / ${stats.max}` },
            { label: 'Range', value: stats.range },
            { label: 'Total Sum', value: stats.sum },
          ]}
        />
      )}
    </div>
  );
}

export function AspectRatioWidget() {
  const [w1, setW1] = useState('1920');
  const [h1, setH1] = useState('1080');
  const [newWidth, setNewWidth] = useState('1280');

  const res = calculateAspectRatio(parseFloat(w1) || 1, parseFloat(h1) || 1, { width: parseFloat(newWidth) || 0 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField id="ar-w1" label="Original Width (px)" type="number" value={w1} onChange={setW1} />
        <InputField id="ar-h1" label="Original Height (px)" type="number" value={h1} onChange={setH1} />
      </div>

      <div>
        <InputField id="ar-neww" label="New Desired Width (px)" type="number" value={newWidth} onChange={setNewWidth} />
      </div>

      <ResultCard
        title="Proportional Resizing"
        primaryLabel="Calculated Height"
        primaryValue={`${res.height}px`}
        breakdown={[
          { label: 'Aspect Ratio', value: res.ratioString },
          { label: 'New Dimensions', value: `${newWidth} × ${res.height}` },
        ]}
      />
    </div>
  );
}
