'use client';

import ToolCard from '@/components/ui/ToolCard';
import ToolIcon from '@/components/ui/ToolIcon';
import { getAllTools } from '@/lib/tools/registry';
import { websiteJsonLd } from '@/lib/seo/jsonld';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from '@/app/page.module.css';
import type { TranslationKey } from '@/lib/i18n/translations/en';

const TOOL_GROUPS: {
  key: string;
  icon: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}[] = [
  { key: 'image', icon: 'image-down', titleKey: 'home.imageToolsTitle', descKey: 'home.imageToolsDesc' },
  { key: 'pdf', icon: 'file-text', titleKey: 'home.pdfToolsTitle', descKey: 'home.pdfToolsDesc' },
  { key: 'audio', icon: 'music', titleKey: 'home.audioToolsTitle', descKey: 'home.audioToolsDesc' },
  { key: 'data', icon: 'code', titleKey: 'home.dataToolsTitle', descKey: 'home.dataToolsDesc' },
];

const COMPARISON_ROWS: { label: TranslationKey; us: TranslationKey; them: TranslationKey }[] = [
  { label: 'home.comparisonPrivacy', us: 'home.comparisonPrivacyUs', them: 'home.comparisonPrivacyThem' },
  { label: 'home.comparisonSize', us: 'home.comparisonSizeUs', them: 'home.comparisonSizeThem' },
  { label: 'home.comparisonDaily', us: 'home.comparisonDailyUs', them: 'home.comparisonDailyThem' },
  { label: 'home.comparisonAccount', us: 'home.comparisonAccountUs', them: 'home.comparisonAccountThem' },
  { label: 'home.comparisonSpeed', us: 'home.comparisonSpeedUs', them: 'home.comparisonSpeedThem' },
  { label: 'home.comparisonOffline', us: 'home.comparisonOfflineUs', them: 'home.comparisonOfflineThem' },
  { label: 'home.comparisonCost', us: 'home.comparisonCostUs', them: 'home.comparisonCostThem' },
];

const WHY_CARDS: { icon: string; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: 'shield', titleKey: 'home.whyPrivacyTitle', descKey: 'home.whyPrivacyDesc' },
  { icon: 'zap', titleKey: 'home.whySpeedTitle', descKey: 'home.whySpeedDesc' },
  { icon: 'globe', titleKey: 'home.whyOfflineTitle', descKey: 'home.whyOfflineDesc' },
  { icon: 'sparkles', titleKey: 'home.whyAiTitle', descKey: 'home.whyAiDesc' },
];

const STEPS: { titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { titleKey: 'home.step1Title', descKey: 'home.step1Desc' },
  { titleKey: 'home.step2Title', descKey: 'home.step2Desc' },
  { titleKey: 'home.step3Title', descKey: 'home.step3Desc' },
];

const TECH_CARDS: { titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { titleKey: 'home.techWasmTitle', descKey: 'home.techWasmDesc' },
  { titleKey: 'home.techGpuTitle', descKey: 'home.techGpuDesc' },
  { titleKey: 'home.techCanvasTitle', descKey: 'home.techCanvasDesc' },
];

export default function HomeContent() {
  const tools = getAllTools();
  const { t, localizedHref } = useLocale();

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'BestOnline.Tools',
          url: 'https://bestonline.tools',
          logo: 'https://bestonline.tools/og-image.png',
          description: 'Free online conversion and productivity tools that run entirely in your browser. 100% private — files never leave your device.',
          sameAs: [],
        }) }}
      />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {t('home.heroTitle')}{' '}
            <span className={styles.heroAccent}>{t('home.heroAccent')}</span>
          </h1>
          <p className={styles.heroSubtitle}>
            {t('home.heroSubtitle')}
          </p>
          <div className={styles.heroActions}>
            <a href="#tools" className="btn btn-primary btn-lg">
              {t('home.browseTools')}
            </a>
            <a href="#why" className="btn btn-secondary btn-lg">
              {t('home.whyUs')}
            </a>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={styles.statPill}>
              <span className={styles.statValue}>{tools.filter(tl => !tl.comingSoon).length}+</span>
              <span className={styles.statLabel}>{t('home.freeTools')}</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statValue}>{t('home.zeroValue')}</span>
              <span className={styles.statLabel}>{t('home.uploads')}</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statValue}>{t('home.hundredPercent')}</span>
              <span className={styles.statLabel}>{t('home.clientSide')}</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statValue}>{t('home.free')}</span>
              <span className={styles.statLabel}>{t('home.noSignup')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid — Grouped by Category */}
      <section id="tools" className={`${styles.toolsSection} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>{t('home.toolsSectionTitle')}</h2>
            <p>{t('home.toolsSectionDesc')}</p>
          </div>

          {TOOL_GROUPS.map((group) => {
            const groupTools = tools.filter((tl) => tl.category === group.key);
            if (groupTools.length === 0) return null;
            return (
              <div key={group.key} className={styles.toolGroup}>
                <div className={styles.groupHeader}>
                  <h3 className={styles.groupTitle}>
                    <span className={styles.groupIcon}><ToolIcon name={group.icon} size={22} /></span>
                    {t(group.titleKey)}
                  </h3>
                  <p className={styles.groupDesc}>{t(group.descKey)}</p>
                </div>
                <div className={styles.toolsGrid}>
                  {groupTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why BestOnline.Tools */}
      <section id="why" className={`section ${styles.whySection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>{t('home.whySectionTitle')}</h2>
            <p>{t('home.whySectionDesc')}</p>
          </div>

          <div className={styles.whyGrid}>
            {WHY_CARDS.map((card) => (
              <div key={card.titleKey} className={styles.whyCard}>
                <div className={styles.whyIcon}>
                  <ToolIcon name={card.icon} size={24} />
                </div>
                <h3>{t(card.titleKey)}</h3>
                <p>{t(card.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className={`section ${styles.comparisonSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>{t('home.comparisonTitle')}</h2>
            <p>{t('home.comparisonDesc')}</p>
          </div>
          <div className={styles.comparisonTableWrap}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th>{t('home.comparisonFeature')}</th>
                  <th className={styles.highlighted}>{t('home.comparisonUs')}</th>
                  <th>{t('home.comparisonThem')}</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.label}>
                    <td>{t(row.label)}</td>
                    <td className={styles.highlighted}>{t(row.us)}</td>
                    <td>{t(row.them)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>{t('home.howItWorksTitle')}</h2>
            <p>{t('home.howItWorksDesc')}</p>
          </div>
          <div className={styles.stepsGrid}>
            {STEPS.map((step, i) => (
              <div key={step.titleKey} className={styles.step}>
                <div className={styles.stepNumber}>{String(i + 1).padStart(2, '0')}</div>
                <h3>{t(step.titleKey)}</h3>
                <p>{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology section */}
      <section className={`section ${styles.techSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>{t('home.techTitle')}</h2>
            <p>{t('home.techDesc')}</p>
          </div>
          <div className={styles.techGrid}>
            {TECH_CARDS.map((card) => (
              <div key={card.titleKey} className={styles.techCard}>
                <h3>{t(card.titleKey)}</h3>
                <p>{t(card.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy banner */}
      <section className="section">
        <div className="container">
          <div className={styles.privacyBanner}>
            <div className={styles.privacyGrid}>
              <div>
                <h2>{t('home.privacyBannerTitle')}</h2>
              </div>
              <div>
                <p>{t('home.privacyBannerDesc')}</p>
                <a href="#tools" className="btn btn-primary" style={{ marginTop: '2rem' }}>
                  {t('home.startConverting')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
