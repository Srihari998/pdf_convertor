import React from 'react';
import { TOOLS_REGISTRY } from '../../lib/tools/registry';
import { ToolCard } from './ToolCard';
import { Sparkles } from 'lucide-react';

interface RelatedToolsProps {
  currentToolId: string;
  relatedIds?: string[];
  category?: string;
  maxItems?: number;
  className?: string;
}

export function RelatedTools({
  currentToolId,
  relatedIds = [],
  category,
  maxItems = 4,
  className = '',
}: RelatedToolsProps) {
  let related = TOOLS_REGISTRY.filter(
    (t) => t.id !== currentToolId && relatedIds.includes(t.id)
  );

  if (related.length < maxItems && category) {
    const fallbackCategoryTools = TOOLS_REGISTRY.filter(
      (t) => t.id !== currentToolId && t.category === category && !related.some((r) => r.id === t.id)
    );
    related = [...related, ...fallbackCategoryTools];
  }

  const finalTools = related.slice(0, maxItems);

  if (finalTools.length === 0) return null;

  return (
    <section className={`mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 ${className}`}>
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          Related Useful Calculators & Tools
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {finalTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} showCategory={true} />
        ))}
      </div>
    </section>
  );
}
