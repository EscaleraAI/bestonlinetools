'use client';

import { useState, useCallback } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './Base64TextTool.module.css';

export default function Base64TextTool() {
  const { t } = useLocale();
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
      setError(mode === 'decode' ? t('base64Text.invalidBase64') : t('base64Text.encodingFailed'));
      setOutput('');
    }
  }, [input, mode, t]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  return (
    <div className={styles.container}>
      <div className={styles.modeToggle}>
        <button className={`${styles.modeBtn} ${mode === 'encode' ? styles.modeActive : ''}`}
          onClick={() => { setMode('encode'); setOutput(''); setError(''); }}>{t('base64Text.encode')}</button>
        <button className={`${styles.modeBtn} ${mode === 'decode' ? styles.modeActive : ''}`}
          onClick={() => { setMode('decode'); setOutput(''); setError(''); }}>{t('base64Text.decode')}</button>
      </div>
      <div className={styles.layout}>
        <div className={styles.col}>
          <span className={styles.colTitle}>{mode === 'encode' ? t('base64Text.plainText') : t('base64Text.base64String')}</span>
          <textarea className={styles.area} value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Hello, World!' : 'SGVsbG8sIFdvcmxkIQ=='}
            rows={8} />
        </div>
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <span className={styles.colTitle}>{mode === 'encode' ? t('base64Text.base64Output') : t('base64Text.decodedText')}</span>
            {output && <button className={styles.copyBtn} onClick={handleCopy}>{copied ? t('base64Text.copied') : t('base64Text.copy')}</button>}
          </div>
          <textarea className={`${styles.area} ${error ? styles.errorArea : ''}`}
            value={error || output} readOnly rows={8} />
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleProcess}>
        {mode === 'encode' ? t('base64Text.encodeButton') : t('base64Text.decodeButton')}
      </button>
    </div>
  );
}
