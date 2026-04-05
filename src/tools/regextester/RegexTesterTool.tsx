'use client';

import { useState, useCallback, useMemo } from 'react';
import styles from './RegexTesterTool.module.css';

export default function RegexTesterTool() {
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
          if (!m[0]) break; // prevent infinite loop on zero-length match
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

  const highlightedText = useMemo(() => {
    if (!pattern || !testString || error) return testString;
    try {
      const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      return testString.replace(re, match => `{{MATCH_START}}${match}{{MATCH_END}}`);
    } catch {
      return testString;
    }
  }, [pattern, flags, testString, error]);

  return (
    <div className={styles.container}>
      <div className={styles.patternRow}>
        <span className={styles.slash}>/</span>
        <input className={styles.patternInput} value={pattern}
          onChange={e => setPattern(e.target.value)} placeholder="your regex here" />
        <span className={styles.slash}>/</span>
        <input className={styles.flagsInput} value={flags}
          onChange={e => setFlags(e.target.value)} placeholder="gi" maxLength={6} />
      </div>
      {error && <p className={styles.error}>{error}</p>}

      <textarea className={styles.testArea} value={testString}
        onChange={e => setTestString(e.target.value)}
        placeholder="Enter test string..." rows={6} />

      {matches.length > 0 && (
        <div className={styles.matchSection}>
          <span className={styles.matchCount}>{matches.length} match{matches.length !== 1 ? 'es' : ''}</span>
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
