import { ToolMetadata, FAQItem } from '../types';

export function generateWebApplicationSchema(tool: ToolMetadata, baseUrl: string = 'https://documentnest.vercel.app') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${tool.name} — DocumentNest`,
    url: `${baseUrl}/${tool.categorySlug}/${tool.slug}`,
    description: tool.shortDescription,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript and HTML5 Canvas support',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: tool.features.join(', '),
  };
}

export function generateFAQSchema(faqs: FAQItem[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; item: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://documentnest.vercel.app',
      },
      ...items.map((it, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: it.name,
        item: it.item,
      })),
    ],
  };
}
