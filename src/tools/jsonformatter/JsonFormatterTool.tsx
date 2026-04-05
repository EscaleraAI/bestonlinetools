'use client';

import { useState, useCallback } from 'react';
import styles from './JsonFormatterTool.module.css';

export default function JsonFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setOutput('');
    }
  }, [input, indent]);

  const handleMinify = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setOutput('');
    }
  }, [input]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <span className={styles.colTitle}>Input JSON</span>
          </div>
          <textarea className={styles.codeArea} value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}' spellCheck={false} rows={18} />
        </div>
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <span className={styles.colTitle}>Output</span>
            {output && <button className={styles.copyBtn} onClick={handleCopy}>{copied ? '✓' : 'Copy'}</button>}
          </div>
          <textarea className={styles.codeArea} value={output || error}
            readOnly spellCheck={false} rows={18}
            style={error ? { color: 'var(--color-danger)' } : {}} />
        </div>
      </div>
      <div className={styles.toolbar}>
        <div className={styles.field}>
          <label className={styles.label}>Indent</label>
          <select className={styles.select} value={indent} onChange={(e) => setIndent(Number(e.target.value))}>
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={0}>Tab</option>
          </select>
        </div>
        <div className={styles.buttons}>
          <button className="btn btn-primary" onClick={handleFormat}>Format</button>
          <button className={styles.minBtn} onClick={handleMinify}>Minify</button>
        </div>
      </div>
    </div>
  );
}
