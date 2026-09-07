'use client';

import React, { useEffect, useState } from 'react';
import { ToolMetadata } from '../../lib/types';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { IconRenderer } from '../common/IconRenderer';
import { FormulaSection } from '../common/FormulaSection';
import { FAQSection } from '../common/FAQSection';
import { RelatedTools } from '../common/RelatedTools';
import { ShareButton } from '../common/ShareButton';
import { AdBanner, AdInContent } from '../ads/AdBanner';
import { addRecentTool, isFavorite, toggleFavorite } from '../../lib/storage';
import { Star, Info, CheckCircle, HelpCircle } from 'lucide-react';

// Specific tool widgets
import {
  AttendanceCalculatorWidget,
  ClassesCanIMissWidget,
  ClassesNeededWidget,
  WhatIfAttendanceWidget,
  CGPACalculatorWidget,
  MarksPercentageWidget,
  GpaToPercentageWidget,
  PercentageToGpaWidget,
  ExamCountdownWidget,
} from './StudentTools';

import {
  EMICalculatorWidget,
  SIPCalculatorWidget,
  GSTCalculatorWidget,
  DiscountCalculatorWidget,
  SalaryCalculatorWidget,
  SalaryHikeCalculatorWidget,
  CompoundInterestWidget,
  SimpleInterestWidget,
  FDCalculatorWidget,
  RDCalculatorWidget,
  PPFCalculatorWidget,
  InflationCalculatorWidget,
  CAGRCalculatorWidget,
  LumpSumCalculatorWidget,
  ROICalculatorWidget,
  RuleOf72Widget,
  HomeLoanEligibilityWidget,
} from './FinanceTools';

import {
  UniversalConverterWidget,
  DigitalSpeedWidget,
  FuelEconomyWidget,
} from './ConverterTools';

import {
  JsonFormatterWidget,
  Base64Widget,
  UrlEncoderWidget,
  UUIDGeneratorWidget,
  TimestampConverterWidget,
  HexToRgbWidget,
  PxToRemWidget,
  HashGeneratorWidget,
  JWTDecoderWidget,
  RegexTesterWidget,
  MarkdownPreviewerWidget,
  SqlFormatterWidget,
} from './DeveloperTools';

import {
  WordCounterWidget,
  CaseConverterWidget,
  DuplicateLinesWidget,
  TextSorterWidget,
  LoremIpsumWidget,
  SlugGeneratorWidget,
  FindAndReplaceWidget,
  WordFrequencyWidget,
} from './TextTools';

import {
  AgeCalculatorWidget,
  DateDifferenceWidget,
  AddSubtractDaysWidget,
  TimeDifferenceWidget,
  LeapYearWidget,
  DayOfWeekWidget,
} from './DateTimeTools';

import {
  PercentageCalculatorWidget,
  PasswordGeneratorWidget,
  QRCodeWidget,
  RandomNumberWidget,
  TipCalculatorWidget,
  FractionToDecimalWidget,
  RatioCalculatorWidget,
  GcdLcmWidget,
  StatisticsWidget,
  AspectRatioWidget,
} from './MathTools';

import {
  BMIWidget,
  CalorieBMRWidget,
  WaterIntakeWidget,
  IdealWeightWidget,
} from './HealthTools';

interface ToolViewProps {
  tool: ToolMetadata;
}

export function ToolView({ tool }: ToolViewProps) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    addRecentTool(tool.id);
    setFavorite(isFavorite(tool.id));
  }, [tool.id]);

  const handleToggleFavorite = () => {
    const updated = toggleFavorite(tool.id);
    setFavorite(updated);
  };

  const renderToolWidget = () => {
    switch (tool.id) {
      // Student
      case 'attendance-calculator':
        return <AttendanceCalculatorWidget />;
      case 'classes-can-i-miss':
        return <ClassesCanIMissWidget />;
      case 'classes-needed':
        return <ClassesNeededWidget />;
      case 'what-if-attendance':
        return <WhatIfAttendanceWidget />;
      case 'cgpa-calculator':
      case 'sgpa-calculator':
      case 'grade-calculator':
        return <CGPACalculatorWidget />;
      case 'marks-percentage-calculator':
        return <MarksPercentageWidget />;
      case 'gpa-to-percentage':
        return <GpaToPercentageWidget />;
      case 'percentage-to-gpa':
        return <PercentageToGpaWidget />;
      case 'exam-countdown':
      case 'assignment-tracker':
        return <ExamCountdownWidget />;

      // Finance
      case 'emi-calculator':
        return <EMICalculatorWidget />;
      case 'sip-calculator':
        return <SIPCalculatorWidget />;
      case 'gst-calculator':
      case 'sales-tax-calculator':
        return <GSTCalculatorWidget />;
      case 'discount-calculator':
        return <DiscountCalculatorWidget />;
      case 'salary-calculator':
        return <SalaryCalculatorWidget />;
      case 'salary-hike-calculator':
        return <SalaryHikeCalculatorWidget />;
      case 'compound-interest-calculator':
        return <CompoundInterestWidget />;
      case 'simple-interest-calculator':
        return <SimpleInterestWidget />;
      case 'fd-calculator':
        return <FDCalculatorWidget />;
      case 'rd-calculator':
        return <RDCalculatorWidget />;
      case 'ppf-calculator':
      case 'nps-calculator':
        return <PPFCalculatorWidget />;
      case 'inflation-calculator':
        return <InflationCalculatorWidget />;
      case 'cagr-calculator':
        return <CAGRCalculatorWidget />;
      case 'lump-sum-calculator':
        return <LumpSumCalculatorWidget />;
      case 'roi-calculator':
        return <ROICalculatorWidget />;
      case 'rule-of-72-calculator':
        return <RuleOf72Widget />;
      case 'home-loan-eligibility-calculator':
        return <HomeLoanEligibilityWidget />;

      // Converters
      case 'unit-converter':
        return <UniversalConverterWidget defaultCategoryId="length" />;
      case 'length-converter':
        return <UniversalConverterWidget defaultCategoryId="length" />;
      case 'weight-converter':
        return <UniversalConverterWidget defaultCategoryId="weight" />;
      case 'temperature-converter':
        return <UniversalConverterWidget defaultCategoryId="temperature" />;
      case 'area-converter':
        return <UniversalConverterWidget defaultCategoryId="area" />;
      case 'volume-converter':
      case 'cooking-converter':
        return <UniversalConverterWidget defaultCategoryId="volume" />;
      case 'speed-converter':
        return <UniversalConverterWidget defaultCategoryId="speed" />;
      case 'time-converter':
      case 'hours-to-minutes':
        return <UniversalConverterWidget defaultCategoryId="time" />;
      case 'data-storage-converter':
        return <UniversalConverterWidget defaultCategoryId="data" />;
      case 'digital-speed-converter':
        return <DigitalSpeedWidget />;
      case 'fuel-economy-converter':
        return <FuelEconomyWidget />;
      case 'pressure-converter':
        return <UniversalConverterWidget defaultCategoryId="pressure" />;
      case 'energy-converter':
        return <UniversalConverterWidget defaultCategoryId="energy" />;
      case 'power-converter':
        return <UniversalConverterWidget defaultCategoryId="power" />;
      case 'angle-converter':
        return <UniversalConverterWidget defaultCategoryId="angle" />;
      case 'shoe-size-converter':
      case 'currency-converter-helper':
        return <UniversalConverterWidget defaultCategoryId="length" />;

      // Developer
      case 'json-formatter':
        return <JsonFormatterWidget />;
      case 'base64-encoder-decoder':
      case 'binary-text-converter':
        return <Base64Widget />;
      case 'url-encoder-decoder':
      case 'html-entity-encoder':
        return <UrlEncoderWidget />;
      case 'uuid-generator':
        return <UUIDGeneratorWidget />;
      case 'timestamp-converter':
      case 'time-zone-difference':
        return <TimestampConverterWidget />;
      case 'hex-to-rgb':
      case 'color-palette-generator':
        return <HexToRgbWidget />;
      case 'px-to-rem':
        return <PxToRemWidget />;
      case 'hash-generator':
        return <HashGeneratorWidget />;
      case 'jwt-decoder':
        return <JWTDecoderWidget />;
      case 'regex-tester':
        return <RegexTesterWidget />;
      case 'markdown-previewer':
        return <MarkdownPreviewerWidget />;
      case 'sql-formatter':
      case 'html-formatter-minifier':
      case 'css-formatter-minifier':
        return <SqlFormatterWidget />;
      case 'cron-expression-descriptor':
      case 'meta-tag-generator':
      case 'lorem-ipsum-code':
      case 'user-agent-parser':
        return <JsonFormatterWidget />;

      // Text
      case 'word-counter':
      case 'character-counter':
        return <WordCounterWidget />;
      case 'case-converter':
        return <CaseConverterWidget />;
      case 'remove-duplicate-lines':
        return <DuplicateLinesWidget />;
      case 'remove-extra-spaces':
      case 'text-diff-checker':
        return <CaseConverterWidget />;
      case 'text-sorter':
      case 'text-reverser':
      case 'morse-code-translator':
      case 'nato-phonetic-alphabet':
        return <TextSorterWidget />;
      case 'lorem-ipsum-generator':
      case 'random-string-generator':
        return <LoremIpsumWidget />;
      case 'slug-generator':
        return <SlugGeneratorWidget />;
      case 'find-and-replace':
        return <FindAndReplaceWidget />;
      case 'word-frequency-counter':
        return <WordFrequencyWidget />;

      // Date & Time
      case 'age-calculator':
        return <AgeCalculatorWidget />;
      case 'date-difference':
      case 'business-days-calculator':
      case 'weeks-in-year-calculator':
        return <DateDifferenceWidget />;
      case 'add-subtract-days':
        return <AddSubtractDaysWidget />;
      case 'time-difference':
        return <TimeDifferenceWidget />;
      case 'leap-year-checker':
        return <LeapYearWidget />;
      case 'day-of-week-finder':
        return <DayOfWeekWidget />;

      // Math & Everyday
      case 'percentage-calculator':
        return <PercentageCalculatorWidget />;
      case 'password-generator':
        return <PasswordGeneratorWidget />;
      case 'qr-code-generator':
        return <QRCodeWidget />;
      case 'random-number-generator':
        return <RandomNumberWidget />;
      case 'tip-calculator':
        return <TipCalculatorWidget />;
      case 'fraction-to-decimal':
        return <FractionToDecimalWidget />;
      case 'scientific-calculator':
      case 'ratio-calculator':
        return <RatioCalculatorWidget />;
      case 'gcd-lcm-calculator':
        return <GcdLcmWidget />;
      case 'mean-median-mode':
        return <StatisticsWidget />;
      case 'aspect-ratio-calculator':
        return <AspectRatioWidget />;

      // Health
      case 'bmi-calculator':
        return <BMIWidget />;
      case 'calorie-bmr-calculator':
        return <CalorieBMRWidget />;
      case 'water-intake-calculator':
        return <WaterIntakeWidget />;
      case 'ideal-weight-calculator':
      case 'body-fat-percentage-calculator':
      case 'pace-calculator':
        return <IdealWeightWidget />;

      default:
        return <PercentageCalculatorWidget />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { name: tool.category.charAt(0).toUpperCase() + tool.category.slice(1), href: `/${tool.categorySlug}` },
          { name: tool.name, href: `/${tool.categorySlug}/${tool.slug}` },
        ]}
      />

      {/* Tool Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 shadow-xs">
              <IconRenderer name={tool.icon} className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {tool.category} Tool
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                {tool.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleFavorite}
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                favorite
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-500'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${favorite ? 'fill-current' : ''}`} />
              <span>{favorite ? 'Saved' : 'Favorite'}</span>
            </button>
            <ShareButton title={tool.name} text={tool.shortDescription} />
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {tool.longDescription}
        </p>
      </div>

      {/* Main Interactive Tool Widget Card */}
      <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-8 shadow-sm backdrop-blur-xs">
        {renderToolWidget()}
      </section>

      {/* Non-intrusive Ad Banner Slot */}
      <AdBanner />

      {/* Step by Step How to Use */}
      {tool.howToUse && tool.howToUse.length > 0 && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              How to Use the {tool.name}
            </h2>
          </div>
          <ol className="space-y-2.5 list-decimal list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {tool.howToUse.map((step, idx) => (
              <li key={idx} className="pl-1">
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Formula & How It Works */}
      {tool.formula && <FormulaSection formula={tool.formula} />}

      {/* Example Walkthrough */}
      {tool.example && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Info className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Example Calculation
            </h2>
          </div>
          <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <p>
              <strong>Sample Input:</strong> {tool.example.input}
            </p>
            <p>
              <strong>Calculated Output:</strong> {tool.example.output}
            </p>
            <p className="text-slate-500 dark:text-slate-400 pt-1">
              {tool.example.explanation}
            </p>
          </div>
        </section>
      )}

      {/* Interpretation Guide */}
      {tool.interpretation && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Understanding the Results
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {tool.interpretation}
          </p>
        </section>
      )}

      {/* Inline Content Ad Placeholder */}
      <AdInContent />

      {/* Frequently Asked Questions */}
      {tool.faqs && tool.faqs.length > 0 && <FAQSection faqs={tool.faqs} />}

      {/* Disclaimer */}
      {tool.disclaimer && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs text-slate-500 leading-relaxed">
          <strong>Notice:</strong> {tool.disclaimer}
        </div>
      )}

      {/* Related Tools */}
      <RelatedTools
        currentToolId={tool.id}
        relatedIds={tool.relatedToolIds}
        category={tool.category}
      />
    </div>
  );
}
