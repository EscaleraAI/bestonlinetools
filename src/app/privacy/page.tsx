import type { Metadata } from 'next';
import styles from './privacy.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy | BestOnline.Tools',
  description:
    'BestOnline.Tools privacy policy: all file processing happens locally in your browser. We use Google Analytics for aggregate usage statistics — no personal data is tied to your files.',
};

export default function PrivacyPage() {
  return (
    <main className={styles.container}>
      <span className={styles.label}>Privacy</span>
      <h1 className={styles.title}>Your Files Never Leave Your Device.</h1>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Zero-Upload Architecture</h2>
          <p>
            BestOnline.Tools is built on a fundamentally different architecture
            than most online conversion tools. Every tool on this platform runs
            <strong> entirely in your browser</strong> using WebAssembly (WASM)
            and WebGPU technology.
          </p>
          <p>
            When you drop a file into any of our tools, it is processed by your
            own device&apos;s CPU and GPU. At no point is your file uploaded to our
            servers or any third-party server. We physically cannot see, access,
            or store your files.
          </p>
        </section>

        <section className={styles.section}>
          <h2>What This Means For You</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🔒</span>
              <h3>Complete Privacy</h3>
              <p>
                Confidential documents, personal photos, sensitive audio — process
                anything without worry. Your data never leaves your device.
              </p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>⚡</span>
              <h3>No File Size Limits</h3>
              <p>
                Since we don&apos;t upload your files, there are no server-imposed file
                size restrictions. Process files as large as your device can handle.
              </p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🌐</span>
              <h3>Works Offline</h3>
              <p>
                Once the tool loads, it runs locally. You can even disconnect from
                the internet and continue processing files.
              </p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>📊</span>
              <h3>Minimal Analytics</h3>
              <p>
                We use Google Analytics to understand aggregate usage patterns.
                No personal data is tied to your files. You can opt out at any time.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>How It Works</h2>
          <p>
            Our tools use three key browser technologies to process files locally:
          </p>
          <ul className={styles.techList}>
            <li>
              <strong>WebAssembly (WASM)</strong> — Compiled native code running
              at near-native speed in your browser. Powers our PDF tools, audio
              converter, and vectorizer.
            </li>
            <li>
              <strong>WebGPU</strong> — Direct GPU access for AI models. Powers
              our background remover and speech-to-text transcription (Whisper AI).
            </li>
            <li>
              <strong>Canvas API</strong> — Native browser image processing.
              Powers our image compressor and coloring page generator.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>AI Models</h2>
          <p>
            Some tools (Background Remover, Speech to Text) use AI models that
            are downloaded once to your browser cache and then run entirely
            locally. These models are open-source and execute on your device —
            they do not send data to any external API.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Analytics &amp; Cookies</h2>
          <p>
            We use <strong>Google Analytics 4</strong> (GA4) to collect anonymous,
            aggregate usage statistics. This helps us understand which tools are
            most popular, how users navigate the site, and where we should focus
            improvements. GA4 collects:
          </p>
          <ul className={styles.techList}>
            <li>Page views and navigation patterns</li>
            <li>Tool usage events (which tool was opened, used, or downloaded from)</li>
            <li>General device and browser information (screen size, browser version)</li>
            <li>Approximate geographic region (country-level, derived from IP address)</li>
          </ul>
          <p>
            GA4 <strong>does not</strong> have access to your files, file contents,
            or any data you process through our tools. Your IP address is anonymized
            by Google before storage.
          </p>
          <p>
            We also use your browser&apos;s <strong>localStorage</strong> to remember
            your recently used tools for quick navigation. This data stays entirely
            on your device and is never sent to any server. You can clear it at any
            time via your browser settings.
          </p>
          <p>
            <strong>No other cookies or tracking technologies</strong> are used.
            We do not use advertising cookies, retargeting pixels, or any form of
            cross-site tracking.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul className={styles.techList}>
            <li>
              <strong>Opt out of analytics</strong> — Install the{' '}
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                Google Analytics Opt-out Browser Add-on
              </a>, or use your browser&apos;s Do Not Track setting.
            </li>
            <li>
              <strong>Clear local data</strong> — Clear your browser&apos;s localStorage
              to remove the recently used tools history.
            </li>
            <li>
              <strong>Request information</strong> — Contact us to ask what, if any,
              data we hold about you (the answer is: none beyond aggregated analytics).
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Contact</h2>
          <p>
            Questions about our privacy practices? Email us at{' '}
            <a href="mailto:privacy@bestonline.tools">privacy@bestonline.tools</a>.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.lastUpdated}>
            Last updated: April 5, 2026
          </p>
        </section>
      </div>
    </main>
  );
}
