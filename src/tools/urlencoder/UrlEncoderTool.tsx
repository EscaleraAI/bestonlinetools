'use client';

import { useState, useCallback } from 'react';
import styles from './UrlEncoderTool.module.css';

export default function UrlEncoderTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const handleProcess = useCallback(() => {
    try {
      setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input));
    } catch {
      setOutput('Error: Invalid input for decoding');
    }
  }, [input, mode]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  return (
    <div className={styles.container}>
      <div className={styles.modeToggle}>
        <button className={`${styles.modeBtn} ${mode === 'encode' ? styles.modeActive : ''}`}
          onClick={() => setMode('encode')}>Encode</button>
        <button className={`${styles.modeBtn} ${mode === 'decode' ? styles.modeActive : ''}`}
          onClick={() => setMode('decode')}>Decode</button>
      </div>
      <div className={styles.layout}>
        <div className={styles.col}>
          <span className={styles.colTitle}>Input</span>
          <textarea className={styles.area} value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'hello world & foo=bar' : 'hello%20world%20%26%20foo%3Dbar'}
            rows={8} />
        </div>
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <span className={styles.colTitle}>Output</span>
            {output && <button className={styles.copyBtn} onClick={handleCopy}>{copied ? '✓' : 'Copy'}</button>}
          </div>
          <textarea className={styles.area} value={output} readOnly rows={8} />
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleProcess}>
        {mode === 'encode' ? 'Encode →' : 'Decode →'}
      </button>
    </div>
  );
}
