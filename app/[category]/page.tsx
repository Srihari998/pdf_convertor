import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES } from '../../lib/tools/categories';
import { getToolsByCategory } from '../../lib/tools/registry';
import { ToolCard } from '../../components/common/ToolCard';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { AdBanner } from '../../components/ads/AdBanner';
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
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return { title: 'Category Not Found' };

  return {
    title: `${cat.name} Tools & Free Calculators`,
    description: cat.longDescription,
    openGraph: {
      title: `${cat.name} Calculators & Tools | CalcNest`,
      description: cat.longDescription,
      url: `https://calcnest.com/${cat.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  const tools = getToolsByCategory(cat.id);

  const categoryFaqs = [
    {
      question: `What types of ${cat.name} tools are available?`,
      answer: `CalcNest provides over ${tools.length} dedicated calculators and utilities in the ${cat.name} category to compute results with instant accuracy.`,
    },
    {
      question: 'Are all these calculators free to use?',
      answer: 'Yes, every tool on CalcNest is completely free with no registration or payment required.',
    },
    {
      question: 'Is my input data saved on a server?',
      answer: 'No. All calculations run strictly in your browser client-side for maximum privacy and zero data leakage.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ name: cat.name, href: `/${cat.slug}` }]} />

      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Utility Category Hub
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
      <AdBanner />

      {/* FAQs */}
      <section className="max-w-4xl pt-4">
        <FAQSection faqs={categoryFaqs} />
      </section>
    </div>
  );
}
