import React from 'react';
import { FunctionSquare } from 'lucide-react';

interface FormulaSectionProps {
  formula: {
    expression: string;
    description: string;
    variables?: { name: string; description: string }[];
  };
  className?: string;
}

export function FormulaSection({ formula, className = '' }: FormulaSectionProps) {
  if (!formula) return null;

  return (
    <section className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs ${className}`}>
      <div className="flex items-center gap-2.5 mb-3.5">
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
          <FunctionSquare className="w-5 h-5" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          Formula & How It Works
        </h2>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/60 mb-4 overflow-x-auto">
        <code className="text-sm sm:text-base font-mono font-bold text-blue-700 dark:text-blue-300 block whitespace-pre">
          {formula.expression}
        </code>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
        {formula.description}
      </p>

      {formula.variables && formula.variables.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Variables Explained:
          </h3>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {formula.variables.map((v, i) => (
              <li key={i} className="flex items-baseline gap-2">
                <span className="font-semibold text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">
                  {v.name}
                </span>
                <span>— {v.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
