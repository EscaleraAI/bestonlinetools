import type { Metadata } from 'next';
import Link from 'next/link';
import { getActiveTools } from '@/lib/tools/registry';
import styles from './pricing.module.css';

export const metadata: Metadata = {
  title: 'Pricing | BestOnline.Tools',
  description:
    'BestOnline.Tools is 100% free. All tools run locally in your browser — no uploads, no limits, no account required.',
};

export default function PricingPage() {
  const tools = getActiveTools();

  return (
    <main className={styles.container}>
      <span className={styles.label}>Pricing</span>
      <h1 className={styles.title}>
        Free. Unlimited.<br />No Catch.
      </h1>
      <p className={styles.subtitle}>
        Every tool runs locally on your device using WebAssembly and WebGPU.
        That means it costs us nothing to run — so we pass that on to you.
      </p>

      {/* Free Plan */}
      <div className={styles.planCard}>
        <div className={styles.planHeader}>
          <span className={styles.planBadge}>Current Plan</span>
          <h2 className={styles.planName}>Free</h2>
          <div className={styles.planPrice}>
            <span className={styles.priceValue}>$0</span>
            <span className={styles.pricePeriod}>/ forever</span>
          </div>
        </div>
        <ul className={styles.featureList}>
          <li className={styles.feature}>
            <span className={styles.featureCheck}>✓</span>
            All {tools.length} tools — unlimited use
          </li>
          <li className={styles.feature}>
            <span className={styles.featureCheck}>✓</span>
            No file size limits
          </li>
          <li className={styles.feature}>
            <span className={styles.featureCheck}>✓</span>
            No account required
          </li>
          <li className={styles.feature}>
            <span className={styles.featureCheck}>✓</span>
            100% private — files never uploaded
          </li>
          <li className={styles.feature}>
            <span className={styles.featureCheck}>✓</span>
            No watermarks
          </li>
          <li className={styles.feature}>
            <span className={styles.featureCheck}>✓</span>
            No ads
          </li>
        </ul>
        <Link href={tools[0]?.href ?? '/'} className={styles.planCta}>
          Start Using Tools →
        </Link>
      </div>

      {/* Pro teaser */}
      <div className={styles.proTeaser}>
        <h3 className={styles.proTitle}>Pro Plan</h3>
        <p className={styles.proDesc}>
          Cloud AI features — premium vectorization, AI-powered image upscaling,
          batch processing, and more — are coming soon.
        </p>
        <span className={styles.proBadge}>Coming 2026</span>
      </div>

      {/* Tool list */}
      <section className={styles.toolsSection}>
        <h2 className={styles.toolsTitle}>What&apos;s Included</h2>
        <div className={styles.toolsGrid}>
          {tools.map((tool) => (
            <Link key={tool.slug} href={tool.href} className={styles.toolItem}>
              <span className={styles.toolIcon}>{tool.icon}</span>
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
