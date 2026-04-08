'use client';

import { useState, useCallback, useMemo } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './RegexTesterTool.module.css';

export default function RegexTesterTool() {
  const { t } = useLocale();
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [error, setError] = useState('');

  const matches = useMemo(() => {
    if (!pattern) return [];
    try {
      const re = new RegExp(pattern, flags);
      setError('');
      const results: { match: string; index: number; groups?: Record<string, string> }[] = [];
      let m;
      if (flags.includes('g')) {
        while ((m = re.exec(testString)) !== null) {
          results.push({ match: m[0], index: m.index, groups: m.groups });
          if (!m[0]) break;
        }
      } else {
        m = re.exec(testString);
        if (m) results.push({ match: m[0], index: m.index, groups: m.groups });
      }
      return results;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid regex');
      return [];
    }
  }, [pattern, flags, testString]);

  return (
    <div className={styles.container}>
      <div className={styles.patternRow}>
        <span className={styles.slash}>/</span>
        <input className={styles.patternInput} value={pattern}
          onChange={e => setPattern(e.target.value)} placeholder={t('regexTester.patternPlaceholder')} />
        <span className={styles.slash}>/</span>
        <input className={styles.flagsInput} value={flags}
          onChange={e => setFlags(e.target.value)} placeholder={t('regexTester.flagsPlaceholder')} maxLength={6} />
      </div>
      {error && <p className={styles.error}>{error}</p>}

      <textarea className={styles.testArea} value={testString}
        onChange={e => setTestString(e.target.value)}
        placeholder={t('regexTester.testPlaceholder')} rows={6} />

      {matches.length > 0 && (
        <div className={styles.matchSection}>
          <span className={styles.matchCount}>
            {matches.length === 1
              ? t('regexTester.matchCount', { count: '1' })
              : t('regexTester.matchCountPlural', { count: String(matches.length) })}
          </span>
          <div className={styles.matchList}>
            {matches.map((m, i) => (
              <div key={i} className={styles.matchItem}>
                <span className={styles.matchIndex}>#{i + 1} @{m.index}</span>
                <code className={styles.matchText}>{m.match}</code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
