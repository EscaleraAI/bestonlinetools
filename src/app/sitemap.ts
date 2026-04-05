import { MetadataRoute } from 'next';
import { i18n } from '@/lib/i18n';
import { getAllPages } from '@/lib/pageResolver';

const SITE_URL = 'https://bestonline.tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const allPages = getAllPages();

  const entries: MetadataRoute.Sitemap = [
    // Homepage
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Static pages
    {
      url: `${SITE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  for (const page of allPages) {
    // Only include English pages until i18n is fully implemented
    if (page.locale !== i18n.defaultLocale) continue;

    const priority = page.pageType === 'HUB' ? 0.9
                   : page.pageType === 'SPOKE' ? 0.7
                   : page.pageType === 'ALTERNATIVE' ? 0.8
                   : 0.6;

    entries.push({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority,
    });
  }

  return entries;
}
