'use client';

import { useState, useMemo } from 'react';
import styles from './WordCounterTool.module.css';

export default function WordCounterTool() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length || (words > 0 ? 1 : 0) : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    const speakingTime = Math.max(1, Math.ceil(words / 130));
    return { chars, charsNoSpaces, words, sentences, paragraphs, readingTime, speakingTime };
  }, [text]);

  return (
    <div className={styles.container}>
      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.words}</span>
          <span className={styles.statLabel}>Words</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.chars}</span>
          <span className={styles.statLabel}>Characters</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.charsNoSpaces}</span>
          <span className={styles.statLabel}>No Spaces</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.sentences}</span>
          <span className={styles.statLabel}>Sentences</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.paragraphs}</span>
          <span className={styles.statLabel}>Paragraphs</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.readingTime}m</span>
          <span className={styles.statLabel}>Read Time</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.speakingTime}m</span>
          <span className={styles.statLabel}>Speak Time</span>
        </div>
      </div>

      <textarea
        className={styles.textArea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text here..."
        rows={16}
      />

      {text && (
        <div className={styles.actionBar}>
          <button className={styles.clearBtn} onClick={() => setText('')}>Clear</button>
          <button className={styles.copyBtn} onClick={() => navigator.clipboard.writeText(text)}>Copy Text</button>
        </div>
      )}
    </div>
  );
}
