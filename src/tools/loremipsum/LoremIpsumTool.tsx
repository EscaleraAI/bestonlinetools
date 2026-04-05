'use client';

import { useState, useCallback } from 'react';
import styles from './LoremIpsumTool.module.css';

const LOREM = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.',
  'Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.',
  'Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.',
  'Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc. Sed adipiscing ornare risus. Morbi est est, blandit sit amet, sagittis vel, euismod vel, velit.',
  'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci.',
  'Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna. Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus.',
];

type Mode = 'paragraphs' | 'sentences' | 'words';

export default function LoremIpsumTool() {
  const [mode, setMode] = useState<Mode>('paragraphs');
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let result = '';
    if (mode === 'paragraphs') {
      const paras = [];
      for (let i = 0; i < count; i++) {
        paras.push(LOREM[i % LOREM.length]);
      }
      result = paras.join('\n\n');
    } else if (mode === 'sentences') {
      const allSentences = LOREM.join(' ').split(/(?<=[.!?])\s+/);
      result = allSentences.slice(0, count).join(' ');
    } else {
      const allWords = LOREM.join(' ').split(/\s+/);
      result = allWords.slice(0, count).join(' ') + '.';
    }
    setOutput(result);
  }, [mode, count]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.field}>
          <label className={styles.label}>Type</label>
          <div className={styles.modeToggle}>
            {(['paragraphs', 'sentences', 'words'] as Mode[]).map(m => (
              <button key={m} className={`${styles.modeBtn} ${mode === m ? styles.modeActive : ''}`}
                onClick={() => setMode(m)}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Count</label>
          <input type="number" className={styles.input} value={count} min={1} max={100}
            onChange={(e) => setCount(Math.max(1, Number(e.target.value)))} />
        </div>
        <button className="btn btn-primary" onClick={generate}>Generate</button>
      </div>

      {output && (
        <>
          <textarea className={styles.output} value={output} readOnly rows={12} />
          <div className={styles.actionBar}>
            <span className={styles.meta}>{output.split(/\s+/).length} words · {output.length} chars</span>
            <button className={styles.copyBtn} onClick={handleCopy}>{copied ? '✓ Copied!' : 'Copy'}</button>
          </div>
        </>
      )}
    </div>
  );
}
