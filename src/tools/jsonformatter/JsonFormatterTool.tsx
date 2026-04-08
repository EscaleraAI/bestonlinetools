'use client';

import { useState, useCallback } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './JsonFormatterTool.module.css';

export default function JsonFormatterTool() {
  const { t } = useLocale();
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
            <span className={styles.colTitle}>{t('jsonFormatter.inputJson')}</span>
          </div>
          <textarea className={styles.codeArea} value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}' spellCheck={false} rows={18} />
        </div>
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <span className={styles.colTitle}>{t('jsonFormatter.output')}</span>
            {output && <button className={styles.copyBtn} onClick={handleCopy}>{copied ? t('jsonFormatter.copied') : t('jsonFormatter.copy')}</button>}
          </div>
          <textarea className={styles.codeArea} value={output || error}
            readOnly spellCheck={false} rows={18}
            style={error ? { color: 'var(--color-danger)' } : {}} />
        </div>
      </div>
      <div className={styles.toolbar}>
        <div className={styles.field}>
          <label className={styles.label}>{t('jsonFormatter.indent')}</label>
          <select className={styles.select} value={indent} onChange={(e) => setIndent(Number(e.target.value))}>
            <option value={2}>{t('jsonFormatter.twoSpaces')}</option>
            <option value={4}>{t('jsonFormatter.fourSpaces')}</option>
            <option value={0}>{t('jsonFormatter.tab')}</option>
          </select>
        </div>
        <div className={styles.buttons}>
          <button className="btn btn-primary" onClick={handleFormat}>{t('jsonFormatter.format')}</button>
          <button className={styles.minBtn} onClick={handleMinify}>{t('jsonFormatter.minify')}</button>
        </div>
      </div>
    </div>
  );
}
