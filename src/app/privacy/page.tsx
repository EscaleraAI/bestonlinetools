'use client';

import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './privacy.module.css';

export default function PrivacyPage() {
  const { t } = useLocale();

  return (
    <main className={styles.container}>
      <span className={styles.label}>{t('privacy.label')}</span>
      <h1 className={styles.title}>{t('privacy.title')}</h1>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>{t('privacy.zeroUploadTitle')}</h2>
          <p>{t('privacy.zeroUploadP1')}</p>
          <p>{t('privacy.zeroUploadP2')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('privacy.whatThisMeansTitle')}</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🔒</span>
              <h3>{t('privacy.completePrivacy')}</h3>
              <p>{t('privacy.completePrivacyDesc')}</p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>📊</span>
              <h3>{t('privacy.noDataCollection')}</h3>
              <p>{t('privacy.noDataCollectionDesc')}</p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🌐</span>
              <h3>{t('privacy.offlineCapable')}</h3>
              <p>{t('privacy.offlineCapableDesc')}</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>{t('privacy.analyticsTitle')}</h2>
          <p>{t('privacy.analyticsP1')}</p>
          <p>{t('privacy.analyticsP2')}</p>
          <ul className={styles.techList}>
            <li>{t('privacy.analyticsBullet1')}</li>
            <li>{t('privacy.analyticsBullet2')}</li>
            <li>{t('privacy.analyticsBullet3')}</li>
            <li>{t('privacy.analyticsBullet4')}</li>
          </ul>
          <p>{t('privacy.analyticsP3')}</p>
          <ul className={styles.techList}>
            <li>{t('privacy.analyticsNoBullet1')}</li>
            <li>{t('privacy.analyticsNoBullet2')}</li>
            <li>{t('privacy.analyticsNoBullet3')}</li>
          </ul>
          <p>{t('privacy.analyticsP4')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('privacy.techTitle')}</h2>
          <ul className={styles.techList}>
            <li>
              <strong>{t('privacy.wasmTitle')}</strong> — {t('privacy.wasmDesc')}
            </li>
            <li>
              <strong>{t('privacy.webgpuTitle')}</strong> — {t('privacy.webgpuDesc')}
            </li>
            <li>
              <strong>{t('privacy.canvasTitle')}</strong> — {t('privacy.canvasDesc')}
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('privacy.contactTitle')}</h2>
          <p>
            {t('privacy.contactP1')}{' '}
            <a href="mailto:privacy@bestonline.tools">privacy@bestonline.tools</a>
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.lastUpdated}>
            {t('privacy.lastUpdated')}: April 5, 2026
          </p>
        </section>
      </div>
    </main>
  );
}
