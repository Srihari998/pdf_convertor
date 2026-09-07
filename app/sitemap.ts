import { MetadataRoute } from 'next';
import { TOOLS_REGISTRY } from '../lib/tools/registry';
import { CATEGORIES } from '../lib/tools/categories';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://documentnest.vercel.app';

  const staticPages = [
    '',
    '/tools',
    '/about',
    '/privacy',
    '/terms',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const categoryPages = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const toolPages = TOOLS_REGISTRY.map((tool) => ({
    url: `${baseUrl}/${tool.categorySlug}/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: tool.popular ? 0.9 : 0.8,
  }));

  return [...staticPages, ...categoryPages, ...toolPages];
}
