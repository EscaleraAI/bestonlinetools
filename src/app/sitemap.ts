import { MetadataRoute } from 'next';
import { i18n, type Locale } from '@/lib/i18n';
import { getAllPages, getSiblingPages } from '@/lib/pageResolver';

const SITE_URL = 'https://bestonline.tools';

/** Active locales that have been fully localized and should appear in sitemap */
const ACTIVE_LOCALES: Locale[] = ['en', 'de'];

export default function sitemap(): MetadataRoute.Sitemap {
  const allPages = getAllPages();

  const entries: MetadataRoute.Sitemap = [
    // Homepage with hreflang
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          ACTIVE_LOCALES.map((loc) => [
            loc,
            loc === i18n.defaultLocale ? SITE_URL : `${SITE_URL}/${loc}/`,
          ])
        ),
      },
    },
    // Static pages with hreflang
    {
      url: `${SITE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
      alternates: {
        languages: { en: `${SITE_URL}/pricing`, de: `${SITE_URL}/de/pricing` },
      },
    },
    {
      url: `${SITE_URL}/de/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.38,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
      alternates: {
        languages: { en: `${SITE_URL}/privacy`, de: `${SITE_URL}/de/privacy` },
      },
    },
    {
      url: `${SITE_URL}/de/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.28,
    },
  ];

  // Track which canonical slugs we've already processed (to avoid duplicates)
  const processedCanonicals = new Set<string>();

  for (const page of allPages) {
    // Only process each canonical tool once
    if (processedCanonicals.has(page.canonicalSlug)) continue;

    // Only include pages for active locales
    if (!ACTIVE_LOCALES.includes(page.locale as Locale)) continue;

    processedCanonicals.add(page.canonicalSlug);

    const priority = page.pageType === 'HUB' ? 0.9
                   : page.pageType === 'SPOKE' ? 0.7
                   : page.pageType === 'ALTERNATIVE' ? 0.8
                   : 0.6;

    // Build hreflang alternates for this page
    const siblings = getSiblingPages(page.canonicalSlug);
    const activeSiblings = siblings.filter((s) =>
      ACTIVE_LOCALES.includes(s.locale as Locale)
    );

    const languages: Record<string, string> = {};
    for (const sib of activeSiblings) {
      const prefix = sib.locale === i18n.defaultLocale ? '' : `/${sib.locale}`;
      languages[sib.locale] = `${SITE_URL}${prefix}/${sib.slug}`;
    }

    // English canonical
    entries.push({
      url: `${SITE_URL}/${page.canonicalSlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority,
      ...(Object.keys(languages).length > 1 ? {
        alternates: { languages },
      } : {}),
    });

    // Add non-default locale entries
    for (const sib of activeSiblings) {
      if (sib.locale === i18n.defaultLocale) continue;
      entries.push({
        url: `${SITE_URL}/${sib.locale}/${sib.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: priority * 0.95, // Slightly lower for non-default locale
      });
    }
  }

  return entries;
}
