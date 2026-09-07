'use client';

import React, { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { UNIT_CATEGORIES, convertUnits, convertDigitalSpeed, convertFuelEconomy } from '../../lib/calculators/converters';
import { ResultCard } from '../common/ResultCard';

interface ConverterWidgetProps {
  defaultCategoryId?: string;
}

export function UniversalConverterWidget({ defaultCategoryId = 'length' }: ConverterWidgetProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategoryId);

  const category = UNIT_CATEGORIES.find((c) => c.id === selectedCategory) || UNIT_CATEGORIES[0];
  const [fromUnit, setFromUnit] = useState<string>(category.units[0]?.id || '');
  const [toUnit, setToUnit] = useState<string>(category.units[1]?.id || category.units[0]?.id || '');
  const [value, setValue] = useState<string>('10');

  // Handle category change
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    const newCat = UNIT_CATEGORIES.find((c) => c.id === catId);
    if (newCat) {
      setFromUnit(newCat.units[0]?.id || '');
      setToUnit(newCat.units[1]?.id || newCat.units[0]?.id || '');
    }
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const valNum = parseFloat(value) || 0;
  const { result, formula } = convertUnits(selectedCategory, fromUnit, toUnit, valNum);

  const fromObj = category.units.find((u) => u.id === fromUnit);
  const toObj = category.units.find((u) => u.id === toUnit);

  return (
    <div className="space-y-6">
      {/* Category selector pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {UNIT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center">
        {/* From Side */}
        <div className="sm:col-span-5 space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            From
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0"
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200"
          >
            {category.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Swap button */}
        <div className="sm:col-span-2 flex justify-center py-2 sm:py-0">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap from and to units"
            className="p-3 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-slate-700 transition-transform active:rotate-180 cursor-pointer"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        {/* To Side */}
        <div className="sm:col-span-5 space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            To
          </label>
          <div className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-3 text-lg font-bold text-blue-600 dark:text-blue-400 truncate">
            {result}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200"
          >
            {category.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      <ResultCard
        title="Conversion Result"
        primaryLabel={`${valNum} ${fromObj?.name || ''} Equals`}
        primaryValue={result}
        primaryUnit={toObj?.symbol}
        breakdown={[
          { label: 'Conversion Formula', value: formula },
          { label: 'Unit Category', value: category.name },
        ]}
      />
    </div>
  );
}

export function DigitalSpeedWidget() {
  const [speed, setSpeed] = useState('100');
  const [fileSizeMB, setFileSizeMB] = useState('1000');

  const speedMbps = parseFloat(speed) || 0;
  const speedMBps = speedMbps / 8;
  const sizeMB = parseFloat(fileSizeMB) || 0;
  const downloadSeconds = speedMBps > 0 ? Math.round(sizeMB / speedMBps) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
            Internet Speed (Mbps)
          </label>
          <input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
            placeholder="100"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
            File Size (MB)
          </label>
          <input
            type="number"
            value={fileSizeMB}
            onChange={(e) => setFileSizeMB(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
            placeholder="1000"
          />
        </div>
      </div>

      <ResultCard
        title="Transfer Speed & Download Time"
        primaryLabel="Actual Download Speed"
        primaryValue={speedMBps.toFixed(2)}
        primaryUnit="MB/s"
        badge={{ text: `Est. Download Time: ${downloadSeconds}s`, variant: 'info' }}
        breakdown={[
          { label: '1000 MB File Time', value: `${downloadSeconds} seconds` },
          { label: 'Bit-to-Byte Conversion', value: '1 Byte = 8 Bits' },
        ]}
      />
    </div>
  );
}

export function FuelEconomyWidget() {
  const [value, setValue] = useState('15');
  const res = convertFuelEconomy(parseFloat(value) || 0, 'kml');

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
          Enter Mileage in Kilometers per Liter (km/L)
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
          placeholder="15"
        />
      </div>

      <ResultCard
        title="Fuel Economy Conversions"
        primaryLabel="US Miles Per Gallon"
        primaryValue={res.mpg_us}
        primaryUnit="MPG (US)"
        breakdown={[
          { label: 'UK MPG', value: `${res.mpg_uk} MPG` },
          { label: 'Liters / 100km', value: `${res.l100km} L/100km` },
        ]}
      />
    </div>
  );
}
