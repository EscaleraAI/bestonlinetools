import Link from 'next/link';
import ToolIcon from './ToolIcon';
import styles from './ToolCard.module.css';
import type { ToolDefinition } from '@/lib/tools/registry';

interface ToolCardProps {
  tool: ToolDefinition;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const content = (
    <div className={`${styles.card} ${tool.comingSoon ? styles.comingSoon : ''}`}>
      <div className={styles.iconWrap}>
        <ToolIcon name={tool.icon} size={24} />
      </div>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{tool.name}</h3>
          {tool.comingSoon && <span className={styles.badge}>Coming Soon</span>}
        </div>
        <p className={styles.tagline}>{tool.tagline}</p>
        <div className={styles.meta}>
          <span className={styles.category}>{tool.category}</span>
          {tool.isClientSide && (
            <span className={styles.clientSide}>
              <ToolIcon name="shield" size={12} /> Runs locally
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
    <Link href={tool.href} className={styles.link}>
      {content}
    </Link>
  );
}
