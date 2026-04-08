'use client';

import { useState, useCallback } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './CaseConverterTool.module.css';

type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'alternating' | 'inverse';

function convert(text: string, type: CaseType): string {
  switch (type) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'title': return text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    case 'sentence': return text.toLowerCase().replace(/(^\s*|[.!?]\s+)(\w)/g, (_, p, c) => p + c.toUpperCase());
    case 'alternating': return text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
    case 'inverse': return text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
    default: return text;
  }
}

export default function CaseConverterTool() {
  const { t } = useLocale();
  const [text, setText] = useState('');
  const [copied, setCopied] = useState('');

  const CASES: { value: CaseType; key: string }[] = [
    { value: 'upper', key: 'caseConverter.upper' },
    { value: 'lower', key: 'caseConverter.lower' },
    { value: 'title', key: 'caseConverter.title' },
    { value: 'sentence', key: 'caseConverter.sentence' },
    { value: 'alternating', key: 'caseConverter.alternating' },
    { value: 'inverse', key: 'caseConverter.inverse' },
  ];

  const handleConvert = useCallback((type: CaseType) => {
    setText(prev => convert(prev, type));
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(t('caseConverter.copied'));
    setTimeout(() => setCopied(''), 1500);
  }, [text, t]);

  return (
    <div className={styles.container}>
      <textarea
        className={styles.textArea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('caseConverter.placeholder')}
        rows={10}
      />
      <div className={styles.buttonGrid}>
        {CASES.map(c => (
          <button key={c.value} className={styles.caseBtn} onClick={() => handleConvert(c.value)}>
            {t(c.key as Parameters<typeof t>[0])}
          </button>
        ))}
      </div>
      <div className={styles.actionBar}>
        <span className={styles.charCount}>{t('caseConverter.characters', { count: String(text.length) })}</span>
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={() => setText('')}>{t('caseConverter.clear')}</button>
          <button className={styles.actionBtn} onClick={handleCopy}>{copied || t('caseConverter.copy')}</button>
        </div>
      </div>
    </div>
  );
}
