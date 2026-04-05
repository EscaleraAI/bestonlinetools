'use client';

import { useState, useCallback } from 'react';
import styles from './CaseConverterTool.module.css';

type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'alternating' | 'inverse';

const CASES: { value: CaseType; label: string }[] = [
  { value: 'upper', label: 'UPPER CASE' },
  { value: 'lower', label: 'lower case' },
  { value: 'title', label: 'Title Case' },
  { value: 'sentence', label: 'Sentence case' },
  { value: 'alternating', label: 'aLtErNaTiNg' },
  { value: 'inverse', label: 'iNVERSE' },
];

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
  const [text, setText] = useState('');
  const [copied, setCopied] = useState('');

  const handleConvert = useCallback((type: CaseType) => {
    setText(prev => convert(prev, type));
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied('Copied!');
    setTimeout(() => setCopied(''), 1500);
  }, [text]);

  return (
    <div className={styles.container}>
      <textarea
        className={styles.textArea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={10}
      />
      <div className={styles.buttonGrid}>
        {CASES.map(c => (
          <button key={c.value} className={styles.caseBtn} onClick={() => handleConvert(c.value)}>
            {c.label}
          </button>
        ))}
      </div>
      <div className={styles.actionBar}>
        <span className={styles.charCount}>{text.length} characters</span>
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={() => setText('')}>Clear</button>
          <button className={styles.actionBtn} onClick={handleCopy}>{copied || 'Copy'}</button>
        </div>
      </div>
    </div>
  );
}
