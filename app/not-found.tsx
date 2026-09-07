import Link from 'next/link';
import { Calculator, ArrowRight, Home, Search } from 'lucide-react';
import { getPopularTools } from '../lib/tools/registry';
import { ToolCard } from '../components/common/ToolCard';

export default function NotFound() {
  const popularTools = getPopularTools().slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-10">
      <div className="space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 flex items-center justify-center mx-auto text-2xl font-black">
          404
        </div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">
          Calculator Not Found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          The tool or page you are looking for might have been moved or renamed. Try searching below or explore popular calculators.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-200"
          >
            <Search className="w-4 h-4" />
            <span>Browse All Tools</span>
          </Link>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-left space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Popular Tools You Might Need
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} showCategory={true} />
          ))}
        </div>
      </div>
    </div>
  );
}
