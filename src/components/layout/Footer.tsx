'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getActiveTools } from '@/lib/tools/registry';
import ToolIcon from '@/components/ui/ToolIcon';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './Footer.module.css';

/** Group tools by category */
function groupToolsByCategory() {
  const tools = getActiveTools();
  const groups: Record<string, typeof tools> = {};
  for (const tool of tools) {
    if (!groups[tool.category]) groups[tool.category] = [];
    groups[tool.category].push(tool);
  }
  return groups;
}

const CATEGORY_KEYS: Record<string, 'nav.imageTools' | 'nav.pdfTools' | 'nav.audioTools' | 'nav.textDevTools'> = {
  image: 'nav.imageTools',
  pdf: 'nav.pdfTools',
  audio: 'nav.audioTools',
  data: 'nav.textDevTools',
};

export default function Footer() {
  const grouped = groupToolsByCategory();
  const { t, localizedHref } = useLocale();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand column */}
          <div className={styles.brand}>
            <Link href={localizedHref('/')} className={styles.logo}>
              <Image src="/logo.png" alt="BestOnline.Tools" width={24} height={24} className={styles.logoImg} />
              <span className={styles.logoText}>BestOnline.Tools</span>
            </Link>
            <p className={styles.tagline}>
              {t('footer.tagline')}
            </p>
          </div>

          {/* Tools grouped by category */}
          {Object.entries(grouped).map(([category, tools]) => (
            <div key={category} className={styles.column}>
              <h4 className={styles.columnTitle}>{t(CATEGORY_KEYS[category] || 'nav.imageTools')}</h4>
              <ul className={styles.linkList}>
                {tools.map((tool) => {
                  const nameKey = `registry.${tool.slug}.name` as Parameters<typeof t>[0];
                  const translatedName = t(nameKey);
                  const displayName = translatedName !== nameKey ? translatedName : tool.name;
                  return (
                    <li key={tool.slug}>
                      <Link href={localizedHref(tool.href)} className={styles.link}>
                        <ToolIcon name={tool.icon} size={14} /> {displayName}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Resources */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>{t('footer.resources')}</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href={localizedHref('/privacy')} className={styles.link}>
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href={localizedHref('/pricing')} className={styles.link}>
                  {t('footer.pricing')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            {t('footer.copyright', { year: new Date().getFullYear().toString() })}
          </p>
          <p className={styles.privacy}>
            {t('footer.localProcessing')}
          </p>
        </div>
      </div>
    </footer>
  );
}
