import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { i18n, localizedHrefFromPath, type Locale } from '@/lib/i18n';
import { resolveFromPath, getSiblingPages, getRelatedPages } from '@/lib/pageResolver';
import { getToolComponent } from '@/lib/toolRegistry';
import { getToolBySlug, getActiveTools } from '@/lib/tools/registry';
import { getToolContent } from '@/lib/tools/toolContent';
import { SITE_URL } from '@/lib/seo/metadata';
import { getTranslator } from '@/lib/i18n/server';
import type { TranslationKey } from '@/lib/i18n/translations/en';
import HomeContent from '@/components/HomeContent';
import ToolPageContent from './ToolPageContent';
import styles from './ToolPageLayout.module.css';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

function parseSlug(segments: string[]): { locale: Locale; slugParts: string[] } {
  if (segments.length === 0) {
    return { locale: i18n.defaultLocale, slugParts: [] };
  }
  const first = segments[0];
  if (
    first !== i18n.defaultLocale &&
    (i18n.locales as readonly string[]).includes(first)
  ) {
    return { locale: first as Locale, slugParts: segments.slice(1) };
  }
  return { locale: i18n.defaultLocale, slugParts: segments };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { locale, slugParts } = parseSlug(slug);

  // /de homepage — use default site metadata
  if (slugParts.length === 0) {
    return {
      title: 'BestOnline.Tools — Kostenlose Online-Konvertierungstools',
      description: 'Kostenlose Online-Dateikonvertierungstools. Konvertieren Sie Bilder, PDFs und Audio — alles direkt in Ihrem Browser. Schnell, privat, kein Upload erforderlich.',
      openGraph: { locale: 'de_DE' },
    };
  }

  const page = resolveFromPath(locale, slugParts);
  if (!page) return {};

  const siblings = getSiblingPages(page.canonicalSlug);
  const languages: Record<string, string> = {};
  for (const sib of siblings) {
    const prefix = sib.locale === i18n.defaultLocale ? '' : `/${sib.locale}`;
    languages[sib.locale] = `https://bestonline.tools${prefix}/${sib.slug}`;
  }
  languages['x-default'] = languages[i18n.defaultLocale] || `https://bestonline.tools/${page.canonicalSlug}`;

  const ogLocale = locale === 'de' ? 'de_DE' : 'en_US';

  return {
    title: page.metaTitle,
    description: page.metaDesc,
    openGraph: {
      title: page.metaTitle,
      description: page.metaDesc,
      locale: ogLocale,
    },
    alternates: {
      canonical: `https://bestonline.tools/${page.canonicalSlug}`,
      languages,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const { locale, slugParts } = parseSlug(slug);

  // /de with no slug → render homepage
  if (slugParts.length === 0) {
    return <HomeContent />;
  }

  const page = resolveFromPath(locale, slugParts);
  if (!page) notFound();

  const tool = getToolComponent(page.toolId);
  if (!tool) notFound();

  const ToolComponent = tool.component;

  // Get related pages for cross-linking
  const relatedPages = getRelatedPages(page.toolId, page.locale);

  // Get other tools for "Related Tools" section (exclude current)
  const allTools = getActiveTools();
  const toolIdToSlugMap: Record<string, string> = {
    svg_vectorizer: 'vectorizer',
    remove_bg: 'remove-background',
    pdf_merge: 'pdf-merge',
    pdf_split: 'pdf-split',
    image_compressor: 'image-compressor',
    coloring_page: 'coloring-page',
    audio_converter: 'audio-converter',
    speech_to_text: 'speech-to-text',
    image_converter: 'image-converter',
    pdf_password: 'pdf-password',
    images_to_pdf: 'images-to-pdf',
    pdf_watermark: 'pdf-watermark',
    pdf_page_numbers: 'pdf-page-numbers',
    image_resize: 'image-resize',
    image_base64: 'image-base64',
    video_to_gif: 'video-to-gif',
    qr_code: 'qr-code',
    sign_pdf: 'sign-pdf',
    pdf_form_filler: 'pdf-form-filler',
    pdf_to_images: 'pdf-to-images',
    ocr: 'ocr',
    word_counter: 'word-counter',
    case_converter: 'case-converter',
    lorem_ipsum: 'lorem-ipsum',
    text_to_pdf: 'text-to-pdf',
    json_formatter: 'json-formatter',
    color_picker: 'color-picker',
    url_encoder: 'url-encoder',
    base64_text: 'base64-text',
    password_generator: 'password-generator',
    pdf_rotate: 'pdf-rotate',
    diff_checker: 'diff-checker',
    hash_generator: 'hash-generator',
    regex_tester: 'regex-tester',
    csv_json: 'csv-json',
    markdown_html: 'markdown-html',
  };
  const currentToolSlug = toolIdToSlugMap[page.toolId];
  // Category-aware: show same-category tools first, then fill from others
  const sameCategory = allTools.filter(t => t.slug !== currentToolSlug && t.category === tool.category);
  const otherCategory = allTools.filter(t => t.slug !== currentToolSlug && t.category !== tool.category);
  const otherTools = [...sameCategory.slice(0, 4), ...otherCategory.slice(0, 6 - Math.min(sameCategory.length, 4))];

  // Translation helper
  const t = getTranslator(locale);
  const lHref = (enPath: string) => localizedHrefFromPath(enPath, locale);

  // Breadcrumb data
  const categoryKeys: Record<string, 'nav.imageTools' | 'nav.pdfTools' | 'nav.audioTools' | 'nav.textDevTools'> = {
    image: 'nav.imageTools', pdf: 'nav.pdfTools', audio: 'nav.audioTools', data: 'nav.textDevTools',
  };
  const categoryLabel = t(categoryKeys[tool.category] || 'nav.imageTools');

  // JSON-LD schemas
  const faqSchema = page.faqJson.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqJson.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  } : null;

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: page.h1,
    url: `${SITE_URL}/${page.canonicalSlug}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: locale === 'de' ? 'EUR' : 'USD' },
    browserRequirements: 'Requires a modern web browser',
  };

  // HowTo schema from tool content
  const toolContent = getToolContent(page.toolId, locale);
  const howToSchema = toolContent ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: locale === 'de' ? `So verwenden Sie ${page.h1.split('—')[0].trim()}` : `How to use ${page.h1.split('—')[0].trim()}`,
    description: page.metaDesc,
    step: toolContent.howItWorks.map((step: string, i: number) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: locale === 'de' ? `Schritt ${i + 1}` : `Step ${i + 1}`,
      text: step,
    })),
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: locale === 'de' ? 'Startseite' : 'Home', item: locale === 'de' ? 'https://bestonline.tools/de' : 'https://bestonline.tools' },
      { '@type': 'ListItem', position: 2, name: categoryLabel, item: locale === 'de' ? 'https://bestonline.tools/de#tools' : 'https://bestonline.tools/#tools' },
      { '@type': 'ListItem', position: 3, name: page.h1 },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className={styles.toolPage}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href={lHref('/')}>{t('toolPage.home')}</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <Link href={lHref('/#tools')}>{t('toolPage.tools', { category: categoryLabel })}</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{page.h1.split('—')[0].trim()}</span>
        </nav>

        {/* Page Header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{page.h1}</h1>
          <p className={styles.pageSubtitle}>{page.metaDesc}</p>
        </div>

        {/* Unique intro for SPOKE pages */}
        {page.introText && (
          <p className={styles.introText}>{page.introText}</p>
        )}

        {/* Tool */}
        <div className={styles.toolContainer}>
          <ToolComponent />
        </div>

        {/* Privacy Trust Badge */}
        <div className={styles.trustBadge}>
          <span className={styles.trustIcon}>🔒</span>
          <span>{t('toolPage.trustBadge')}</span>
        </div>

        {/* Description */}
        <section className={styles.descriptionSection}>
          <div className={styles.descriptionGrid}>
            <div className={styles.descriptionContent}>
              <h2>{t('toolPage.howItWorks')}</h2>
              {(() => {
                const content = getToolContent(page.toolId, locale);
                if (content) {
                  return content.howItWorks.map((p, i) => (
                    <p key={i}>{p}</p>
                  ));
                }
                return (
                  <>
                    <p>{t('toolPage.defaultHowItWorks1')}</p>
                    <p>{t('toolPage.defaultHowItWorks2')}</p>
                  </>
                );
              })()}
            </div>
            <div className={styles.descriptionContent}>
              <h2>{t('toolPage.features')}</h2>
              <ul className={styles.featureList}>
                {(() => {
                  const content = getToolContent(page.toolId, locale);
                  const features = content?.features ?? [
                    t('toolPage.defaultFeature1'),
                    t('toolPage.defaultFeature2'),
                    t('toolPage.defaultFeature3'),
                    t('toolPage.defaultFeature4'),
                    t('toolPage.defaultFeature5'),
                  ];
                  return features.map((f, i) => (
                    <li key={i} className={styles.featureItem}>
                      <span className={styles.featureCheck}>✓</span>
                      {f}
                    </li>
                  ));
                })()}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ — merge page-level and tool-level FAQs */}
        {(() => {
          const contentFaqs = getToolContent(page.toolId, locale)?.faqs ?? [];
          const pageFaqs = page.faqJson ?? [];
          // Deduplicate by question text (page-level takes priority)
          const seenQs = new Set(pageFaqs.map(f => f.q));
          const mergedFaqs = [...pageFaqs, ...contentFaqs.filter(f => !seenQs.has(f.q))];
          if (mergedFaqs.length === 0) return null;
          return (
            <section className={styles.faqSection}>
              <div className={styles.faqHeader}>
                <h2>{t('toolPage.faq')}</h2>
              </div>
              <ToolPageContent faqs={mergedFaqs} />
            </section>
          );
        })()}

        {/* Related Tools */}
        <section className={styles.relatedSection}>
          <div className={styles.relatedHeader}>
            <h2>{t('toolPage.moreTools')}</h2>
            <p>{t('toolPage.moreToolsDesc')}</p>
          </div>
          <div className={styles.relatedGrid}>
            {otherTools.map((tl) => (
              <Link key={tl.slug} href={lHref(tl.href)} className={styles.relatedCard}>
                <span className={styles.relatedIcon}>
                  <ToolPageContent iconName={tl.icon} />
                </span>
                <div className={styles.relatedInfo}>
                  <span className={styles.relatedName}>{t(`registry.${tl.slug}.name` as TranslationKey)}</span>
                  <span className={styles.relatedTagline}>{t(`registry.${tl.slug}.tagline` as TranslationKey)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Cross-links to spoke pages */}
        {relatedPages.length > 0 && (
          <section className={styles.crossLinksSection}>
            <div className={styles.crossLinksHeader}>
              <h3>{t('toolPage.relatedConversions')}</h3>
            </div>
            <div className={styles.crossLinksGrid}>
              {relatedPages.map((rp) => (
                <Link key={rp.slug} href={lHref(`/${rp.slug}`)} className={styles.crossLink}>
                  {rp.h1.split('—')[0].trim()}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
