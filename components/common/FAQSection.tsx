'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQItem } from '../../lib/types';

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
}

export function FAQSection({
  faqs,
  title = 'Frequently Asked Questions',
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
          <HelpCircle className="w-5 h-5" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex items-center justify-between w-full p-4 sm:p-5 text-left font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 mt-1 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
