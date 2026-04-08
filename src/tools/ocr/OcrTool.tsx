'use client';

import { useState, useRef, useCallback } from 'react';
import ToolIcon from '@/components/ui/ToolIcon';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './OcrTool.module.css';

type OcrLanguage = 'eng' | 'deu' | 'fra' | 'spa' | 'ita' | 'por' | 'nld' | 'jpn' | 'chi_sim' | 'kor';

const LANGUAGE_OPTIONS: { value: OcrLanguage; label: string }[] = [
  { value: 'eng', label: 'English' },
  { value: 'deu', label: 'German' },
  { value: 'fra', label: 'French' },
  { value: 'spa', label: 'Spanish' },
  { value: 'ita', label: 'Italian' },
  { value: 'por', label: 'Portuguese' },
  { value: 'nld', label: 'Dutch' },
  { value: 'jpn', label: 'Japanese' },
  { value: 'chi_sim', label: 'Chinese (Simplified)' },
  { value: 'kor', label: 'Korean' },
];

export default function OcrTool() {
  const { t } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [language, setLanguage] = useState<OcrLanguage>('eng');
  const [status, setStatus] = useState<'idle' | 'loading' | 'recognizing' | 'done' | 'error'>('idle');
  const [statusText, setStatusText] = useState('');
  const [progress, setProgress] = useState(0);
  const [resultText, setResultText] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((files: FileList | File[]) => {
    const imgFile = Array.from(files).find(f => f.type.startsWith('image/'));
    if (!imgFile) return;
    if (preview) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(imgFile);
    setFile(imgFile); setPreview(url); setResultText(''); setStatus('idle');
  }, [preview]);

  const handleRecognize = useCallback(async () => {
    if (!file) return;
    setStatus('loading');
    setStatusText(t('ocr.loadingEngine'));
    setProgress(0);
    try {
      const Tesseract = await import('tesseract.js');
      setStatus('recognizing');
      setStatusText(t('ocr.recognizing'));
      const result = await Tesseract.recognize(file, language, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100));
        },
      });
      setResultText(result.data.text);
      setConfidence(Math.round(result.data.confidence));
      setStatus('done');
    } catch (err: unknown) {
      setStatus('error');
      setStatusText(err instanceof Error ? err.message : t('ocr.ocrFailed'));
    }
  }, [file, language, t]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(resultText);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }, [resultText]);

  const handleDownloadTxt = useCallback(() => {
    const blob = new Blob([resultText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (file?.name.replace(/\.[^.]+$/, '') || 'ocr_result') + '.txt';
    a.click(); URL.revokeObjectURL(url);
  }, [resultText, file]);

  const handleReset = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null); setPreview(null);
    setResultText(''); setConfidence(0);
    setStatus('idle'); setStatusText(''); setProgress(0);
  }, [preview]);

  if (status === 'loading' || status === 'recognizing') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSection}>
          <p className={styles.statusText}>{statusText}</p>
          {progress > 0 && (
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          )}
          <span className={styles.progressLabel}>{progress}%</span>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.errorSection}>
          <p className={styles.errorText}>{statusText}</p>
          <button className={styles.resetButton} onClick={handleReset}>{t('ocr.tryAgain')}</button>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className={styles.container}>
        <div className={styles.dropzone}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFileSelect(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}>
          <span className={styles.dropzoneIcon}><ToolIcon name="scan-text" size={32} /></span>
          <p className={styles.dropzoneTitle}>{t('ocr.dropTitle')}</p>
          <p className={styles.dropzoneSubtitle}>{t('ocr.dropSubtitle')}</p>
          <input ref={fileInputRef} type="file" accept="image/*"
            onChange={(e) => { if (e.target.files) handleFileSelect(e.target.files); }}
            className={styles.hiddenInput} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <div className={styles.previewCol}>
          <div className={styles.previewBox}>
            <img src={preview!} alt="Input" className={styles.previewImage} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('ocr.language')}</label>
            <select className={styles.select} value={language}
              onChange={(e) => setLanguage(e.target.value as OcrLanguage)}>
              {LANGUAGE_OPTIONS.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.actionRow}>
            <button className={styles.resetButton} onClick={handleReset}>{t('ocr.change')}</button>
            <button className="btn btn-primary" onClick={handleRecognize}>
              {t('ocr.extractButton')}
            </button>
          </div>
        </div>

        <div className={styles.resultCol}>
          {status === 'done' ? (
            <>
              <div className={styles.resultHeader}>
                <span className={styles.confidenceBadge}>{t('ocr.confidence', { value: String(confidence) })}</span>
                <div className={styles.resultActions}>
                  <button className={styles.copyBtn} onClick={handleCopy}>
                    {copied ? t('ocr.copied') : t('ocr.copy')}
                  </button>
                  <button className={styles.copyBtn} onClick={handleDownloadTxt}>.txt</button>
                </div>
              </div>
              <textarea className={styles.resultArea} value={resultText}
                onChange={(e) => setResultText(e.target.value)} rows={16} />
            </>
          ) : (
            <div className={styles.emptyResult}>
              <ToolIcon name="scan-text" size={40} />
              <p>{t('ocr.emptyResult')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
