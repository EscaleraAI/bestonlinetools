'use client';

import { useState, useCallback } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './DiffCheckerTool.module.css';

interface DiffLine { type: 'same' | 'add' | 'remove'; text: string; }

function computeDiff(a: string, b: string): DiffLine[] {
  const linesA = a.split('\n');
  const linesB = b.split('\n');
  const result: DiffLine[] = [];
  let iA = 0, iB = 0;
  while (iA < linesA.length || iB < linesB.length) {
    if (iA < linesA.length && iB < linesB.length && linesA[iA] === linesB[iB]) {
      result.push({ type: 'same', text: linesA[iA] });
      iA++; iB++;
    } else if (iB < linesB.length && (iA >= linesA.length || !linesA.slice(iA).includes(linesB[iB]))) {
      result.push({ type: 'add', text: linesB[iB] });
      iB++;
    } else if (iA < linesA.length) {
      result.push({ type: 'remove', text: linesA[iA] });
      iA++;
    }
  }
  return result;
}

export default function DiffCheckerTool() {
  const { t } = useLocale();
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [diff, setDiff] = useState<DiffLine[] | null>(null);

  const handleCompare = useCallback(() => {
    setDiff(computeDiff(textA, textB));
  }, [textA, textB]);

  const stats = diff ? {
    added: diff.filter(l => l.type === 'add').length,
    removed: diff.filter(l => l.type === 'remove').length,
    same: diff.filter(l => l.type === 'same').length,
  } : null;

  return (
    <div className={styles.container}>
      <div className={styles.inputLayout}>
        <div className={styles.col}>
          <span className={styles.colTitle}>{t('diffChecker.original')}</span>
          <textarea className={styles.area} value={textA}
            onChange={e => setTextA(e.target.value)}
            placeholder={t('diffChecker.originalPlaceholder')} rows={12} />
        </div>
        <div className={styles.col}>
          <span className={styles.colTitle}>{t('diffChecker.changed')}</span>
          <textarea className={styles.area} value={textB}
            onChange={e => setTextB(e.target.value)}
            placeholder={t('diffChecker.changedPlaceholder')} rows={12} />
        </div>
      </div>

      <div className={styles.actionBar}>
        <button className="btn btn-primary btn-lg" onClick={handleCompare}>{t('diffChecker.compare')}</button>
      </div>

      {diff && stats && (
        <div className={styles.resultSection}>
          <div className={styles.statsBar}>
            <span className={styles.statAdd}>{t('diffChecker.added', { count: String(stats.added) })}</span>
            <span className={styles.statRemove}>{t('diffChecker.removed', { count: String(stats.removed) })}</span>
            <span className={styles.statSame}>{t('diffChecker.unchanged', { count: String(stats.same) })}</span>
          </div>
          <div className={styles.diffOutput}>
            {diff.map((line, i) => (
              <div key={i} className={`${styles.diffLine} ${styles[line.type]}`}>
                <span className={styles.diffPrefix}>
                  {line.type === 'add' ? '+' : line.type === 'remove' ? '−' : ' '}
                </span>
                <span>{line.text || '\u00A0'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
