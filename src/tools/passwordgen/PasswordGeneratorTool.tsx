'use client';

import { useState, useCallback } from 'react';
import styles from './PasswordGeneratorTool.module.css';

interface Options {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

function generate(opts: Options): string {
  let chars = '';
  if (opts.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (opts.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (opts.numbers) chars += '0123456789';
  if (opts.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';
  const arr = new Uint32Array(opts.length);
  crypto.getRandomValues(arr);
  return Array.from(arr, v => chars[v % chars.length]).join('');
}

function getStrength(pw: string): { label: string; color: string; pct: number } {
  let score = 0;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { label: 'Weak', color: 'var(--color-danger)', pct: 25 };
  if (score <= 3) return { label: 'Fair', color: '#F59E0B', pct: 50 };
  if (score <= 4) return { label: 'Good', color: 'var(--color-primary)', pct: 75 };
  return { label: 'Strong', color: 'var(--color-secondary)', pct: 100 };
}

export default function PasswordGeneratorTool() {
  const [options, setOptions] = useState<Options>({
    length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true,
  });
  const [password, setPassword] = useState(() => generate({ length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true }));
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    setPassword(generate(options));
    setCopied(false);
  }, [options]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [password]);

  const strength = getStrength(password);

  const toggle = (key: keyof Omit<Options, 'length'>) =>
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className={styles.container}>
      <div className={styles.outputBox}>
        <code className={styles.password}>{password}</code>
        <div className={styles.outputActions}>
          <button className={styles.copyBtn} onClick={handleCopy}>
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
          <button className={styles.genBtn} onClick={handleGenerate}>↻ Generate</button>
        </div>
      </div>

      <div className={styles.strengthBar}>
        <div className={styles.strengthFill} style={{ width: `${strength.pct}%`, background: strength.color }} />
      </div>
      <span className={styles.strengthLabel} style={{ color: strength.color }}>{strength.label}</span>

      <div className={styles.settings}>
        <div className={styles.lengthRow}>
          <label className={styles.label}>Length: {options.length}</label>
          <input type="range" min={6} max={64} value={options.length}
            onChange={(e) => setOptions(prev => ({ ...prev, length: Number(e.target.value) }))}
            className={styles.slider} />
        </div>
        <div className={styles.checkboxes}>
          {([['uppercase', 'ABC'], ['lowercase', 'abc'], ['numbers', '123'], ['symbols', '!@#']] as const).map(([key, label]) => (
            <label key={key} className={styles.checkLabel}>
              <input type="checkbox" checked={options[key]} onChange={() => toggle(key)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
