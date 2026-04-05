import ToolCard from '@/components/ui/ToolCard';
import ToolIcon from '@/components/ui/ToolIcon';
import { getAllTools } from '@/lib/tools/registry';
import { websiteJsonLd } from '@/lib/seo/jsonld';
import styles from './page.module.css';

export default function HomePage() {
  const tools = getAllTools();

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
            Convert. Transform.{' '}
            <span className={styles.heroAccent}>Privately.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Free conversion tools that run entirely in your browser.
            Files never leave your device.
          </p>
          <div className={styles.heroActions}>
            <a href="#tools" className="btn btn-primary btn-lg">
              Browse All Tools →
            </a>
            <a href="/pricing" className="btn btn-secondary btn-lg">
              Pricing
            </a>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={styles.statPill}>
              <span className={styles.statValue}>100%</span>
              <span className={styles.statLabel}>Client-Side</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statValue}>Zero</span>
              <span className={styles.statLabel}>Uploads</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statValue}>Free</span>
              <span className={styles.statLabel}>No Signup</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statValue}>Fast</span>
              <span className={styles.statLabel}>WebAssembly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid — Grouped by Category */}
      <section id="tools" className={`${styles.toolsSection} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Conversion Suite</h2>
            <p>
              Each tool runs locally in your browser using WebAssembly
              and WebGPU for maximum speed and privacy.
            </p>
          </div>

          {[
            {
              key: 'image',
              icon: 'image-down',
              title: 'Image Tools',
              desc: 'Convert, compress, vectorize, and edit images',
            },
            {
              key: 'pdf',
              icon: 'file-text',
              title: 'PDF Tools',
              desc: 'Merge, split, sign, rotate, and edit PDF documents',
            },
            {
              key: 'audio',
              icon: 'music',
              title: 'Audio & Media',
              desc: 'Convert audio formats and transcribe speech',
            },
            {
              key: 'data',
              icon: 'code',
              title: 'Text & Developer',
              desc: 'Format, encode, generate, and compare text and data',
            },
          ].map((group) => {
            const groupTools = tools.filter((t) => t.category === group.key);
            if (groupTools.length === 0) return null;
            return (
              <div key={group.key} className={styles.toolGroup}>
                <div className={styles.groupHeader}>
                  <h3 className={styles.groupTitle}>
                    <span className={styles.groupIcon}><ToolIcon name={group.icon} size={22} /></span>
                    {group.title}
                  </h3>
                  <p className={styles.groupDesc}>{group.desc}</p>
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

      {/* How it works */}
      <section className={`section ${styles.methodSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Three Steps.</h2>
          </div>
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>01</div>
              <h3>Upload</h3>
              <p>
                Drag and drop or click to select. Supports all common image formats.
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>02</div>
              <h3>Adjust</h3>
              <p>
                Fine-tune parameters with intuitive controls. Preview results in real time.
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>03</div>
              <h3>Download</h3>
              <p>
                Get your file instantly. Everything happens in your browser — nothing is uploaded.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy section */}
      <section className="section">
        <div className="container">
          <div className={styles.privacyBanner}>
            <div className={styles.privacyGrid}>
              <div>
                <h2>Your Files Never Leave Your Device.</h2>
              </div>
              <div>
                <p>
                  Unlike most online tools, BestOnline.Tools runs conversions directly
                  in your browser using WebAssembly and WebGPU. Your files are
                  never uploaded to any server — ensuring complete privacy and
                  near-instant processing.
                </p>
                <a href="#tools" className="btn btn-primary" style={{ marginTop: '2rem' }}>
                  Start Converting →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
