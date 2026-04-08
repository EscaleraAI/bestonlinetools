'use client';

import { useState, useRef, useCallback } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import ToolIcon from '@/components/ui/ToolIcon';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './PdfRotateTool.module.css';

type Rotation = 0 | 90 | 180 | 270;

export default function PdfRotateTool() {
  const { t } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotation, setRotation] = useState<Rotation>(90);
  const [applyTo, setApplyTo] = useState<'all' | 'custom'>('all');
  const [customPages, setCustomPages] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (files: FileList | File[]) => {
    const f = Array.from(files).find(f => f.type === 'application/pdf');
    if (!f) return;
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPageCount(pdf.getPageCount());
      setFile(f);
    } catch {
      setStatus('error');
    }
  }, []);

  const handleRotate = useCallback(async () => {
    if (!file) return;
    setStatus('processing');
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = pdf.getPages();

      let targetPages: number[];
      if (applyTo === 'all') {
        targetPages = pages.map((_, i) => i);
      } else {
        targetPages = customPages
          .split(',')
          .map(s => parseInt(s.trim()) - 1)
          .filter(n => !isNaN(n) && n >= 0 && n < pages.length);
      }

      for (const idx of targetPages) {
        const page = pages[idx];
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotation));
      }

      const outBytes = await pdf.save();
      const blob = new Blob([new Uint8Array(outBytes) as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.pdf$/i, '');
      const outFile = new File([blob], `${baseName}_rotated.pdf`, { type: 'application/pdf' });

      setResultUrl(url);
      setResultFile(outFile);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }, [file, rotation, applyTo, customPages]);

  const handleDownload = useCallback(() => {
    if (!resultUrl || !resultFile) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = resultFile.name;
    a.click();
  }, [resultUrl, resultFile]);

  const handleReset = useCallback(() => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null); setPageCount(0); setResultUrl(null); setResultFile(null);
    setStatus('idle');
  }, [resultUrl]);

  if (status === 'done') {
    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.resultIcon}>✓</div>
          <h3>{t('pdfRotate.success')}</h3>
          <button className="btn btn-primary btn-lg" onClick={handleDownload}>{t('pdfRotate.downloadButton')}</button>
          <button className={styles.resetBtn} onClick={handleReset}>{t('pdfRotate.rotateAnother')}</button>
        </div>
      </div>
    );
  }

  if (status === 'processing') {
    return <div className={styles.container}><p className={styles.statusText}>{t('pdfRotate.rotating')}</p></div>;
  }

  if (!file) {
    return (
      <div className={styles.container}>
        <div className={styles.dropzone}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleFileSelect(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}>
          <span className={styles.dropzoneIcon}><ToolIcon name="rotate-cw" size={32} /></span>
          <p className={styles.dropzoneTitle}>{t('pdfRotate.dropTitle')}</p>
          <input ref={fileInputRef} type="file" accept="application/pdf"
            onChange={e => { if (e.target.files) handleFileSelect(e.target.files); }}
            className={styles.hiddenInput} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.fileInfo}>
        <ToolIcon name="file-text" size={20} />
        <span>{file.name} — {t('pdfRotate.pages', { count: String(pageCount) })}</span>
      </div>
      <div className={styles.settings}>
        <div className={styles.field}>
          <label className={styles.label}>{t('pdfRotate.rotation')}</label>
          <div className={styles.rotGrid}>
            {([90, 180, 270] as Rotation[]).map(r => (
              <button key={r} className={`${styles.rotBtn} ${rotation === r ? styles.rotActive : ''}`}
                onClick={() => setRotation(r)}>{r}°</button>
            ))}
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t('pdfRotate.applyTo')}</label>
          <div className={styles.rotGrid}>
            <button className={`${styles.rotBtn} ${applyTo === 'all' ? styles.rotActive : ''}`}
              onClick={() => setApplyTo('all')}>{t('pdfRotate.allPages')}</button>
            <button className={`${styles.rotBtn} ${applyTo === 'custom' ? styles.rotActive : ''}`}
              onClick={() => setApplyTo('custom')}>{t('pdfRotate.custom')}</button>
          </div>
          {applyTo === 'custom' && (
            <input className={styles.input} value={customPages}
              onChange={e => setCustomPages(e.target.value)}
              placeholder="e.g. 1, 3, 5" />
          )}
        </div>
      </div>
      <div className={styles.actionBar}>
        <button className={styles.resetBtn} onClick={handleReset}>{t('pdfRotate.changeFile')}</button>
        <button className="btn btn-primary btn-lg" onClick={handleRotate}>{t('pdfRotate.rotateButton')}</button>
      </div>
    </div>
  );
}
