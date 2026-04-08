import Link from 'next/link';
import { headers } from 'next/headers';
import { getActiveTools } from '@/lib/tools/registry';
import ToolIcon from '@/components/ui/ToolIcon';
import { i18n, type Locale } from '@/lib/i18n';
import styles from './not-found.module.css';

const copy: Record<string, { heading: string; description: string; back: string }> = {
  en: {
    heading: 'Page Not Found',
    description: "The page you're looking for doesn't exist or has been moved. Try one of our free tools below:",
    back: 'Back to Homepage',
  },
  de: {
    heading: 'Seite nicht gefunden',
    description: 'Die gesuchte Seite existiert nicht oder wurde verschoben. Probieren Sie eines unserer kostenlosen Tools:',
    back: 'Zurück zur Startseite',
  },
};

export default async function NotFound() {
  const tools = getActiveTools().slice(0, 6);

  // Detect locale from the URL path via the referer or x-pathname header
  const hdrs = await headers();
  const pathname = hdrs.get('x-pathname') || hdrs.get('referer') || '';
  let locale: Locale = i18n.defaultLocale;
  for (const l of i18n.locales) {
    if (l !== 'en' && (pathname.includes(`/${l}/`) || pathname.endsWith(`/${l}`))) {
      locale = l;
      break;
    }
  }

  const t = copy[locale] || copy.en;
  const homeHref = locale === 'en' ? '/' : `/${locale}`;

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.heading}>{t.heading}</h1>
        <p className={styles.description}>{t.description}</p>

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

        <Link href={homeHref} className={styles.homeLink}>
          <ToolIcon name="arrow-left" size={16} />
          {t.back}
        </Link>
      </div>
    </main>
  );
}
