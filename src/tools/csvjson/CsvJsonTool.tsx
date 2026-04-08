'use client';

import { useState, useCallback } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './CsvJsonTool.module.css';

function csvToJson(csv: string): string {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const result = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    return obj;
  });
  return JSON.stringify(result, null, 2);
}

function jsonToCsv(json: string): string {
  const data = JSON.parse(json);
  if (!Array.isArray(data) || data.length === 0) throw new Error('JSON must be an array of objects');
  const headers = Object.keys(data[0]);
  const rows = data.map((row: Record<string, unknown>) =>
    headers.map(h => {
      const val = String(row[h] ?? '');
      return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

export default function CsvJsonTool() {
  const { t } = useLocale();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'csv2json' | 'json2csv'>('csv2json');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = useCallback(() => {
    setError('');
    try {
      setOutput(mode === 'csv2json' ? csvToJson(input) : jsonToCsv(input));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
      setOutput('');
    }
  }, [input, mode]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  return (
    <div className={styles.container}>
      <div className={styles.modeToggle}>
        <button className={`${styles.modeBtn} ${mode === 'csv2json' ? styles.modeActive : ''}`}
          onClick={() => { setMode('csv2json'); setOutput(''); setError(''); }}>{t('csvJson.csvToJson')}</button>
        <button className={`${styles.modeBtn} ${mode === 'json2csv' ? styles.modeActive : ''}`}
          onClick={() => { setMode('json2csv'); setOutput(''); setError(''); }}>{t('csvJson.jsonToCsv')}</button>
      </div>
      <div className={styles.layout}>
        <div className={styles.col}>
          <span className={styles.colTitle}>{mode === 'csv2json' ? t('csvJson.csvInput') : t('csvJson.jsonInput')}</span>
          <textarea className={styles.area} value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode === 'csv2json' ? 'name,email,age\nJohn,john@example.com,30' : '[{"name":"John","email":"john@example.com"}]'}
            rows={12} />
        </div>
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <span className={styles.colTitle}>{mode === 'csv2json' ? t('csvJson.jsonOutput') : t('csvJson.csvOutput')}</span>
            {output && <button className={styles.copyBtn} onClick={handleCopy}>{copied ? t('csvJson.copied') : t('csvJson.copy')}</button>}
          </div>
          <textarea className={`${styles.area} ${error ? styles.errorArea : ''}`}
            value={error || output} readOnly rows={12} />
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleConvert}>{t('csvJson.convertButton')}</button>
    </div>
  );
}
