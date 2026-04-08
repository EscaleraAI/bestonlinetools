'use client';

import Link from 'next/link';
import { getActiveTools } from '@/lib/tools/registry';
import ToolIcon from '@/components/ui/ToolIcon';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './pricing.module.css';

export default function PricingPage() {
  const tools = getActiveTools();
  const { t, localizedHref } = useLocale();

  return (
    <main className={styles.container}>
      <span className={styles.label}>{t('pricing.label')}</span>
      <h1 className={styles.title}>
        {t('pricing.title')}<br />{t('pricing.titleLine2')}
      </h1>
      <p className={styles.subtitle}>
        {t('pricing.subtitle')}
      </p>

      {/* Free Plan */}
      <div className={styles.planCard}>
        <div className={styles.planHeader}>
          <span className={styles.planBadge}>{t('pricing.currentPlan')}</span>
          <h2 className={styles.planName}>{t('pricing.planName')}</h2>
          <div className={styles.planPrice}>
            <span className={styles.priceValue}>{t('pricing.priceValue')}</span>
            <span className={styles.pricePeriod}>{t('pricing.pricePeriod')}</span>
          </div>
        </div>
        <ul className={styles.featureList}>
          <li className={styles.feature}>
            <span className={styles.featureCheck}>✓</span>
            {t('pricing.feature1', { count: String(tools.length) })}
          </li>
          <li className={styles.feature}>
            <span className={styles.featureCheck}>✓</span>
            {t('pricing.feature2')}
          </li>
          <li className={styles.feature}>
            <span className={styles.featureCheck}>✓</span>
            {t('pricing.feature3')}
          </li>
          <li className={styles.feature}>
            <span className={styles.featureCheck}>✓</span>
            {t('pricing.feature4')}
          </li>
          <li className={styles.feature}>
            <span className={styles.featureCheck}>✓</span>
            {t('pricing.feature5')}
          </li>
          <li className={styles.feature}>
            <span className={styles.featureCheck}>✓</span>
            {t('pricing.feature6')}
          </li>
        </ul>
        <Link href={localizedHref(tools[0]?.href ?? '/')} className={styles.planCta}>
          {t('pricing.cta')}
        </Link>
      </div>

      {/* Pro teaser */}
      <div className={styles.proTeaser}>
        <h3 className={styles.proTitle}>{t('pricing.proTitle')}</h3>
        <p className={styles.proDesc}>
          {t('pricing.proDesc')}
        </p>
        <span className={styles.proBadge}>{t('pricing.proBadge')}</span>
      </div>

      {/* Tool list */}
      <section className={styles.toolsSection}>
        <h2 className={styles.toolsTitle}>{t('pricing.whatsIncluded')}</h2>
        <div className={styles.toolsGrid}>
          {tools.map((tool) => (
            <Link key={tool.slug} href={localizedHref(tool.href)} className={styles.toolItem}>
              <span className={styles.toolIcon}><ToolIcon name={tool.icon} size={20} /></span>
              <div>
                <strong>{tool.name}</strong>
                <span className={styles.toolTagline}>{tool.tagline}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
