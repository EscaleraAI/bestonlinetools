'use client';

import { useState, useCallback } from 'react';
import styles from './HashGeneratorTool.module.css';

type Algorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

async function computeHash(text: string, algo: Algorithm): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algo, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGeneratorTool() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<Algorithm, string>>({
    'SHA-1': '', 'SHA-256': '', 'SHA-384': '', 'SHA-512': '',
  });
  const [copied, setCopied] = useState('');

  const handleGenerate = useCallback(async () => {
    const algos: Algorithm[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    const hashes: Record<string, string> = {};
    for (const algo of algos) {
      hashes[algo] = await computeHash(input, algo);
    }
    setResults(hashes as Record<Algorithm, string>);
  }, [input]);

  const handleCopy = useCallback((algo: string) => {
    navigator.clipboard.writeText(results[algo as Algorithm]);
    setCopied(algo);
    setTimeout(() => setCopied(''), 1500);
  }, [results]);

  return (
    <div className={styles.container}>
      <textarea className={styles.input} value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type or paste text to hash..." rows={4} />
      <button className="btn btn-primary" onClick={handleGenerate}>Generate Hashes</button>

      {results['SHA-256'] && (
        <div className={styles.results}>
          {(['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as Algorithm[]).map(algo => (
            <div key={algo} className={styles.hashRow}>
              <span className={styles.algoLabel}>{algo}</span>
              <code className={styles.hashValue}>{results[algo]}</code>
              <button className={styles.copyBtn} onClick={() => handleCopy(algo)}>
                {copied === algo ? '✓' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
