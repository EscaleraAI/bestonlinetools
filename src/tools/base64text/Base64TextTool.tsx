'use client';

import { useState, useCallback } from 'react';
import styles from './Base64TextTool.module.css';

export default function Base64TextTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleProcess = useCallback(() => {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError(mode === 'decode' ? 'Invalid Base64 string' : 'Encoding failed');
      setOutput('');
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
          onClick={() => { setMode('encode'); setOutput(''); setError(''); }}>Encode</button>
        <button className={`${styles.modeBtn} ${mode === 'decode' ? styles.modeActive : ''}`}
          onClick={() => { setMode('decode'); setOutput(''); setError(''); }}>Decode</button>
      </div>
      <div className={styles.layout}>
        <div className={styles.col}>
          <span className={styles.colTitle}>{mode === 'encode' ? 'Plain Text' : 'Base64 String'}</span>
          <textarea className={styles.area} value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Hello, World!' : 'SGVsbG8sIFdvcmxkIQ=='}
            rows={8} />
        </div>
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <span className={styles.colTitle}>{mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}</span>
            {output && <button className={styles.copyBtn} onClick={handleCopy}>{copied ? '✓' : 'Copy'}</button>}
          </div>
          <textarea className={`${styles.area} ${error ? styles.errorArea : ''}`}
            value={error || output} readOnly rows={8} />
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleProcess}>
        {mode === 'encode' ? 'Encode →' : 'Decode →'}
      </button>
    </div>
  );
}
