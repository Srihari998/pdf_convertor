import { CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'student',
    name: 'Student & Academic',
    shortName: 'Student',
    slug: 'student',
    description: 'Calculate CGPA, attendance thresholds, exam countdowns, marks, and GPA conversions.',
    longDescription:
      'Essential academic calculators engineered for college and high school students. Calculate weighted CGPA, SGPA, attendance percentage, find out exactly how many classes you can afford to miss, and simulate future semester goals.',
    icon: 'GraduationCap',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'finance',
    name: 'Finance & Money',
    shortName: 'Finance',
    slug: 'finance',
    description: 'Loan EMI, mutual fund SIP, GST, CTC salary breakdown, investments, and interest calculations.',
    longDescription:
      'Plan your loans, wealth, taxes, and investments with accuracy. Calculate home and car loan EMIs with amortization schedules, mutual fund SIP returns, GST additions & deductions, salary in-hand CTC estimates, and compound growth.',
    icon: 'IndianRupee',
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'converters',
    name: 'Unit Converters',
    shortName: 'Converters',
    slug: 'converters',
    description: 'Convert between length, weight, temperature, volume, data storage, speed, and time.',
    longDescription:
      'Universal unit converter covering length, weight, mass, temperature, area, volume, digital speed, storage bytes, and fuel economy with instantaneous dual-directional precision.',
    icon: 'ArrowLeftRight',
    color: 'from-violet-600 to-purple-600',
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    shortName: 'Developer',
    slug: 'developer',
    description: 'JSON formatters, Base64, UUIDs, Unix timestamps, Regex testing, and web utilities.',
    longDescription:
      'Free, client-side developer utilities that execute 100% locally in your browser. Pretty-print JSON, encode/decode Base64 & URLs, generate secure UUID v4 tokens, convert Unix timestamps, and parse JWTs with zero data leakage.',
    icon: 'Code2',
    color: 'from-cyan-600 to-blue-600',
  },
  {
    id: 'text',
    name: 'Text & Content Tools',
    shortName: 'Text Tools',
    slug: 'text',
    description: 'Word counters, character density, case converters, line cleaners, and diff checkers.',
    longDescription:
      'Boost writing and editing productivity. Count words, characters, sentences, estimate reading time, change case formats (camelCase, snake_case, UPPERCASE), remove duplicate lines, and generate clean slugs.',
    icon: 'FileText',
    color: 'from-amber-600 to-orange-600',
  },
  {
    id: 'date-time',
    name: 'Date & Time',
    shortName: 'Date & Time',
    slug: 'date-time',
    description: 'Age calculations, days between dates, business days, and time duration counters.',
    longDescription:
      'Calculate exact age down to days and hours, count business days between calendar dates, add or subtract days, check leap years, and determine historical days of the week.',
    icon: 'Calendar',
    color: 'from-rose-600 to-pink-600',
  },
  {
    id: 'calculators',
    name: 'Everyday & Math',
    shortName: 'Calculators',
    slug: 'calculators',
    description: 'Percentages, secure passwords, QR code generation, tip splits, and ratios.',
    longDescription:
      'Solve everyday math problems quickly. Calculate percentage changes, generate cryptographic passwords, generate downloadable QR codes, calculate restaurant tips, and solve mathematical ratios.',
    icon: 'Calculator',
    color: 'from-sky-600 to-indigo-600',
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    shortName: 'Health',
    slug: 'health',
    description: 'Body Mass Index (BMI), daily calorie expenditure (BMR/TDEE), and water intake.',
    longDescription:
      'Informational health and fitness calculators. Estimate your Body Mass Index (BMI) with WHO weight categories, calculate daily calorie needs (BMR & TDEE), and determine optimal daily water intake.',
    icon: 'Activity',
    color: 'from-lime-600 to-green-600',
  },
];
