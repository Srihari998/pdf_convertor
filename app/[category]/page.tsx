import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES } from '../../lib/tools/categories';
import { getToolsByCategory } from '../../lib/tools/registry';
import { ToolCard } from '../../components/common/ToolCard';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { AdSlot } from '../../components/common/AdSlot';
import { FAQSection } from '../../components/common/FAQSection';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category || c.id === category);
  if (!cat) return { title: 'Category Not Found' };

  return {
    title: `${cat.name} — Free Online Document Utilities`,
    description: cat.longDescription,
    openGraph: {
      title: `${cat.name} | DocumentNest`,
      description: cat.longDescription,
      url: `https://documentnest.vercel.app/${cat.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category || c.id === category);
  if (!cat) notFound();

  const tools = getToolsByCategory(cat.id);

  const categoryFaqs = [
    {
      question: `Are all ${cat.name} processed locally on my computer?`,
      answer: `Yes! Every tool in the ${cat.name} suite runs entirely in your browser using client-side WebAssembly. No files are uploaded to any server.`,
    },
    {
      question: `Is there any limit on how many files I can process?`,
      answer: `There are no arbitrary daily quotas. You can use any of our ${tools.length} ${cat.name} completely free of charge.`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ name: cat.name, href: `/${cat.slug}` }]} />

      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Document Category Hub
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
          {cat.name}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {cat.longDescription}
        </p>
      </div>

      {/* Tools Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Available Tools ({tools.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} showCategory={false} />
          ))}
        </div>
      </section>

      {/* Ad Placement */}
      <AdSlot position="middle" />

      {/* FAQs */}
      <section className="max-w-4xl pt-4">
        <FAQSection faqs={categoryFaqs} />
      </section>
    </div>
  );
}
