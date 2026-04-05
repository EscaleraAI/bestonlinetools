import ToolCard from '@/components/ui/ToolCard';
import ToolIcon from '@/components/ui/ToolIcon';
import { getAllTools } from '@/lib/tools/registry';
import { websiteJsonLd } from '@/lib/seo/jsonld';
import styles from '@/app/page.module.css';

export default function HomeContent() {
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
            Free online tools for images, PDFs, audio, and more — powered by
            WebAssembly and WebGPU. Your files never leave your device.
          </p>
          <div className={styles.heroActions}>
            <a href="#tools" className="btn btn-primary btn-lg">
              Browse All Tools →
            </a>
            <a href="#why" className="btn btn-secondary btn-lg">
              Why Us?
            </a>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={styles.statPill}>
              <span className={styles.statValue}>{tools.filter(t => !t.comingSoon).length}+</span>
              <span className={styles.statLabel}>Free Tools</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statValue}>Zero</span>
              <span className={styles.statLabel}>Uploads</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statValue}>100%</span>
              <span className={styles.statLabel}>Client-Side</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statValue}>Free</span>
              <span className={styles.statLabel}>No Signup</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid — Grouped by Category */}
      <section id="tools" className={`${styles.toolsSection} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Free Online Conversion Tools</h2>
            <p>
              A comprehensive suite of browser-based tools for file conversion,
              compression, editing, and generation. Each tool runs locally for
              maximum speed and privacy.
            </p>
          </div>

          {[
            {
              key: 'image',
              icon: 'image-down',
              title: 'Image Tools',
              desc: 'Convert between image formats (PNG, JPG, WebP, AVIF, HEIC, SVG), compress images without quality loss, remove backgrounds with AI, resize, and create coloring pages. Our PNG to SVG vectorizer produces clean, scalable vector graphics from any raster image.',
            },
            {
              key: 'pdf',
              icon: 'file-text',
              title: 'PDF Tools',
              desc: 'Merge multiple PDFs into one, split PDFs by page range, rotate pages, add watermarks and page numbers, password-protect documents, sign PDFs, fill forms, extract images from PDFs, and convert text or images to PDF format. All processed locally — your documents stay private.',
            },
            {
              key: 'audio',
              icon: 'music',
              title: 'Audio & Media Tools',
              desc: 'Convert between audio formats including MP3, WAV, OGG, FLAC, and AAC. Transcribe speech to text using OpenAI\u0027s Whisper AI model running locally in your browser — no cloud API, no usage limits, no cost. Convert video clips to GIF animations.',
            },
            {
              key: 'data',
              icon: 'code',
              title: 'Text & Developer Tools',
              desc: 'Format and validate JSON, encode and decode Base64 and URLs, generate secure passwords, create QR codes, compare text with a diff checker, test regex patterns, convert between CSV and JSON, render Markdown to HTML, count words, and change text case.',
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

      {/* Why BestOnline.Tools */}
      <section id="why" className={`section ${styles.whySection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Why Choose BestOnline.Tools?</h2>
            <p>
              Unlike traditional online tools that upload your files to remote servers,
              every tool on BestOnline.Tools runs entirely in your browser using
              cutting-edge web technologies.
            </p>
          </div>

          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>
                <ToolIcon name="shield" size={24} />
              </div>
              <h3>True Privacy, Not Just a Promise</h3>
              <p>
                Most &quot;free online tools&quot; upload your files to their servers for processing.
                That means your confidential documents, personal photos, and sensitive
                audio pass through third-party infrastructure. BestOnline.Tools is
                architecturally different: your files are processed by your own
                CPU and GPU using WebAssembly. We physically cannot see, access, or
                store your data — because it never leaves your device.
              </p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>
                <ToolIcon name="zap" size={24} />
              </div>
              <h3>Near-Native Speed</h3>
              <p>
                WebAssembly compiles to native machine code, delivering performance
                that rivals desktop applications. No waiting for uploads or downloads,
                no server queue. Your files are processed at the speed of your hardware.
                Large PDFs, high-resolution images, and lengthy audio files are handled
                without the file size limits that server-based tools impose.
              </p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>
                <ToolIcon name="globe" size={24} />
              </div>
              <h3>Works Offline &amp; Everywhere</h3>
              <p>
                Once a tool loads, it runs independently of your internet connection.
                Continue converting files on a plane, in a coffee shop with spotty WiFi,
                or behind a corporate firewall. BestOnline.Tools works on any modern
                browser — Chrome, Firefox, Safari, Edge — on desktop, tablet, or mobile.
                No software to install, no plugins, no extensions.
              </p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>
                <ToolIcon name="sparkles" size={24} />
              </div>
              <h3>AI-Powered, Locally</h3>
              <p>
                Our AI tools — like the Background Remover and Speech-to-Text
                transcriber — run machine learning models directly on your device using
                WebGPU acceleration. The AI models are downloaded once and cached in your
                browser. No API calls, no cloud processing, no per-use credits. The same
                professional-quality results as paid services, completely free and private.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className={`section ${styles.comparisonSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>How We Compare</h2>
            <p>
              See how BestOnline.Tools stacks up against traditional online conversion
              services like Convertio, iLovePDF, and CloudConvert.
            </p>
          </div>
          <div className={styles.comparisonTableWrap}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className={styles.highlighted}>BestOnline.Tools</th>
                  <th>Traditional Tools</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>File Privacy</td>
                  <td className={styles.highlighted}>Files never leave your device</td>
                  <td>Files uploaded to remote servers</td>
                </tr>
                <tr>
                  <td>File Size Limits</td>
                  <td className={styles.highlighted}>No limits (your hardware is the limit)</td>
                  <td>Typically 50–100 MB free tier</td>
                </tr>
                <tr>
                  <td>Daily Usage Limits</td>
                  <td className={styles.highlighted}>Unlimited conversions</td>
                  <td>2–10 free conversions per day</td>
                </tr>
                <tr>
                  <td>Account Required</td>
                  <td className={styles.highlighted}>No — just open and use</td>
                  <td>Often required for full features</td>
                </tr>
                <tr>
                  <td>Processing Speed</td>
                  <td className={styles.highlighted}>Instant (no upload/download)</td>
                  <td>Depends on file size + server load</td>
                </tr>
                <tr>
                  <td>Works Offline</td>
                  <td className={styles.highlighted}>Yes, after first load</td>
                  <td>No — requires internet</td>
                </tr>
                <tr>
                  <td>Cost</td>
                  <td className={styles.highlighted}>100% free, forever</td>
                  <td>Free tier + paid plans ($5–15/mo)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>How It Works</h2>
            <p>
              Using BestOnline.Tools is as simple as any other online converter —
              but with the critical difference that your files stay on your device
              throughout the entire process.
            </p>
          </div>
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>01</div>
              <h3>Choose &amp; Drop</h3>
              <p>
                Select a tool and drag your file into the drop zone. All common
                formats are supported — PNG, JPG, WebP, PDF, MP3, WAV, and more.
                No file size restrictions.
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>02</div>
              <h3>Process Locally</h3>
              <p>
                Your browser processes the file using WebAssembly or WebGPU.
                Adjust quality, format, and other parameters with real-time
                preview. Nothing is uploaded anywhere.
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>03</div>
              <h3>Download Instantly</h3>
              <p>
                Your converted file is ready immediately — no waiting for server
                processing. Download it directly to your device. The original
                file is never modified.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology section */}
      <section className={`section ${styles.techSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Built on Modern Web Technology</h2>
            <p>
              BestOnline.Tools leverages three browser technologies that make
              server-side processing obsolete for most file conversion tasks.
            </p>
          </div>
          <div className={styles.techGrid}>
            <div className={styles.techCard}>
              <h3>WebAssembly (WASM)</h3>
              <p>
                Compiled native code running at near-native speed in your browser.
                Powers our PDF engine (based on pdf-lib), image vectorizer (Potrace),
                audio converter (FFmpeg), and image compressor. The same technology
                used by Figma, Google Earth, and AutoCAD for the web.
              </p>
            </div>
            <div className={styles.techCard}>
              <h3>WebGPU</h3>
              <p>
                Direct access to your device&apos;s GPU for parallel computation. Powers
                our AI-based tools: the background remover uses a neural network to
                isolate subjects from photos, and the speech-to-text transcriber
                runs OpenAI&apos;s Whisper model entirely on your graphics card.
              </p>
            </div>
            <div className={styles.techCard}>
              <h3>Canvas &amp; Web APIs</h3>
              <p>
                Native browser image processing for tasks like format conversion,
                resizing, and compression. Combined with the File System Access API,
                this enables drag-and-drop workflows with zero server interaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy banner */}
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
                  near-instant processing. No account required, no file size limits,
                  no daily usage caps.
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
