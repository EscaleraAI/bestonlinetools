'use client';

import Link from 'next/link';
import ToolIcon from './ToolIcon';
import styles from './ToolCard.module.css';
import type { ToolDefinition } from '@/lib/tools/registry';
import { useLocale } from '@/lib/i18n/LocaleContext';

interface ToolCardProps {
  tool: ToolDefinition;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const { t, localizedHref } = useLocale();

  // Use translated name/tagline if available, fallback to registry English
  const nameKey = `registry.${tool.slug}.name` as Parameters<typeof t>[0];
  const taglineKey = `registry.${tool.slug}.tagline` as Parameters<typeof t>[0];
  const displayName = t(nameKey) !== nameKey ? t(nameKey) : tool.name;
  const displayTagline = t(taglineKey) !== taglineKey ? t(taglineKey) : tool.tagline;

  const content = (
    <div className={`${styles.card} ${tool.comingSoon ? styles.comingSoon : ''}`}>
      <div className={styles.iconWrap}>
        <ToolIcon name={tool.icon} size={24} />
      </div>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{displayName}</h3>
          {tool.comingSoon && <span className={styles.badge}>{t('tool.comingSoon')}</span>}
        </div>
        <p className={styles.tagline}>{displayTagline}</p>
        <div className={styles.meta}>
          <span className={styles.category}>{tool.category}</span>
          {tool.isClientSide && (
            <span className={styles.clientSide}>
              <ToolIcon name="shield" size={12} /> {t('tool.runsLocally')}
            </span>
          )}
        </div>
      </div>
      {!tool.comingSoon && (
        <div className={styles.arrow}>→</div>
      )}
    </div>
  );

  if (tool.comingSoon) {
    return content;
  }

  return (
    <Link href={localizedHref(tool.href)} className={styles.link}>
      {content}
    </Link>
  );
}
