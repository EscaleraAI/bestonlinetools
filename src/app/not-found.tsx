import Link from 'next/link';
import { getActiveTools } from '@/lib/tools/registry';
import ToolIcon from '@/components/ui/ToolIcon';
import styles from './not-found.module.css';

export default function NotFound() {
  const tools = getActiveTools().slice(0, 6);

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.heading}>Page Not Found</h1>
        <p className={styles.description}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Try one of our free tools below:
        </p>

        <div className={styles.toolGrid}>
          {tools.map((tool) => (
            <Link key={tool.slug} href={tool.href} className={styles.toolCard}>
              <span className={styles.toolIcon}>
                <ToolIcon name={tool.icon} size={22} />
              </span>
              <span className={styles.toolName}>{tool.name}</span>
              <span className={styles.toolTagline}>{tool.tagline}</span>
            </Link>
          ))}
        </div>

        <Link href="/" className={styles.homeLink}>
          <ToolIcon name="arrow-left" size={16} />
          Back to Homepage
        </Link>
      </div>
    </main>
  );
}
