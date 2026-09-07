import React from 'react';
import Link from 'next/link';
import { Calculator, Heart } from 'lucide-react';
import { CATEGORIES } from '../../lib/tools/categories';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: Brand & Mission */}
          <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-xs">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
                Calc<span className="text-blue-600 dark:text-blue-400">Nest</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              CalcNest is a fast, privacy-first utility hub featuring 100+ free calculators, converters, student tools, finance calculators, and developer utilities that run 100% locally in your browser.
            </p>
            <div className="pt-2 text-xs text-slate-400 dark:text-slate-500">
              ₹0 Initial Budget • Zero Paid Server Requirements • Built for Everyone
            </div>
          </div>

          {/* Column 2: Popular Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/${cat.slug}`}
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Popular Tools */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Popular Tools
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/student/attendance-calculator"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Attendance Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/student/classes-can-i-miss"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Classes Can I Miss
                </Link>
              </li>
              <li>
                <Link
                  href="/student/cgpa-calculator"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  CGPA Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/finance/emi-calculator"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  EMI Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/finance/sip-calculator"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  SIP Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/calculators/percentage-calculator"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Percentage Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Company & Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  About CalcNest
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-blue-600 dark:text-blue-400"
                >
                  All Tools Directory
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
          <p>
            <strong>Disclaimer:</strong> Calculations provided across financial, student, health, and engineering tools on CalcNest are estimates intended for educational and informational purposes only. Results may differ from actual banking, payroll, academic, or clinical outcomes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4">
            <p>© {new Date().getFullYear()} CalcNest. Free calculators and useful online tools.</p>
            <p className="flex items-center gap-1 text-[11px] text-slate-400">
              Crafted with speed &amp; precision
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
