import React from 'react';
import { ToolMetadata } from '../../lib/types';
import { getRelatedTools, getToolsByCategory } from '../../lib/tools/registry';
import { ToolCard } from './ToolCard';

interface RelatedToolsProps {
  currentTool: ToolMetadata;
}

export function RelatedTools({ currentTool }: RelatedToolsProps) {
  let related = getRelatedTools(currentTool);
  if (related.length === 0) {
    related = getToolsByCategory(currentTool.category).filter((t) => t.id !== currentTool.id);
  }

  const items = related.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          Related Document Tools
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((tool) => (
          <ToolCard key={tool.id} tool={tool} showCategory={true} />
        ))}
      </div>
    </section>
  );
}
