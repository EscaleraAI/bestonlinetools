import type { Metadata } from 'next';
import styles from './privacy.module.css';

export const metadata: Metadata = {
  title: 'Privacy | BestOnline.Tools',
  description:
    'How BestOnline.Tools protects your privacy: all file processing happens locally in your browser using WebAssembly and WebGPU. No uploads, no tracking, no data collection.',
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
              <span className={styles.cardIcon}>🚫</span>
              <h3>No Tracking</h3>
              <p>
                We do not use cookies, analytics trackers, or fingerprinting.
                We do not collect personal data or build user profiles.
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
          <h2>Contact</h2>
          <p>
            Questions about our privacy practices? Email us at{' '}
            <a href="mailto:privacy@bestonline.tools">privacy@bestonline.tools</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
