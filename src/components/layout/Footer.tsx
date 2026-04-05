import Link from 'next/link';
import Image from 'next/image';
import { getActiveTools } from '@/lib/tools/registry';
import ToolIcon from '@/components/ui/ToolIcon';
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

const CATEGORY_LABELS: Record<string, string> = {
  image: 'Image Tools',
  pdf: 'PDF Tools',
  audio: 'Audio Tools',
  data: 'Text & Dev Tools',
};

export default function Footer() {
  const grouped = groupToolsByCategory();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand column */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <Image src="/logo.png" alt="BestOnline.Tools" width={24} height={24} className={styles.logoImg} />
              <span className={styles.logoText}>BestOnline.Tools</span>
            </Link>
            <p className={styles.tagline}>
              Free online conversion tools that run in your browser.
              Fast, private, no upload required.
            </p>
          </div>

          {/* Tools grouped by category */}
          {Object.entries(grouped).map(([category, tools]) => (
            <div key={category} className={styles.column}>
              <h4 className={styles.columnTitle}>{CATEGORY_LABELS[category] || category}</h4>
              <ul className={styles.linkList}>
                {tools.map((tool) => (
                  <li key={tool.slug}>
                    <Link href={tool.href} className={styles.link}>
                      <ToolIcon name={tool.icon} size={14} /> {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Resources */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Resources</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/privacy" className={styles.link}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/pricing" className={styles.link}>
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} BestOnline.Tools. All rights reserved.
          </p>
          <p className={styles.privacy}>
            Your files are processed locally and never uploaded to any server.
          </p>
        </div>
      </div>
    </footer>
  );
}
