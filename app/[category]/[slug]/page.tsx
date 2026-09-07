import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLS_REGISTRY, getToolBySlug } from '../../../lib/tools/registry';
import { ToolView } from '../../../components/tools/ToolView';
import {
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '../../../lib/seo/schema';

interface ToolPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  return TOOLS_REGISTRY.map((tool) => ({
    category: tool.categorySlug,
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: 'Tool Not Found' };

  const title = `${tool.name} — Free Online Document Tool`;
  const description = tool.shortDescription;

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: {
      canonical: `https://documentnest.vercel.app/${tool.categorySlug}/${tool.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://documentnest.vercel.app/${tool.categorySlug}/${tool.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const webAppSchema = generateWebApplicationSchema(tool);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: tool.category.toUpperCase() + ' Tools', item: `https://documentnest.vercel.app/${tool.categorySlug}` },
    { name: tool.name, item: `https://documentnest.vercel.app/${tool.categorySlug}/${tool.slug}` },
  ]);
  const faqSchema = generateFAQSchema(tool.faqs);

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <ToolView tool={tool} />
    </>
  );
}
