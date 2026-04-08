'use client';

import { useState, useRef, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolSuccess from '@/components/ToolSuccess';
import ToolIcon from '@/components/ui/ToolIcon';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './PdfSplitTool.module.css';

type SplitMode = 'extract' | 'every-n' | 'equal-parts';

export default function PdfSplitTool() {
  const { t, localizedHref } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'splitting' | 'done' | 'error'>('idle');
  const [statusText, setStatusText] = useState('');
  const [splitMode, setSplitMode] = useState<SplitMode>('extract');
  const [extractInput, setExtractInput] = useState('');
  const [everyN, setEveryN] = useState(1);
  const [equalParts, setEqualParts] = useState(2);
  const [resultFiles, setResultFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load PDF and get page count
  const handleFile = useCallback(async (f: File) => {
    if (f.type !== 'application/pdf') return;
    setStatus('loading');
    setStatusText(t('pdfSplit.reading'));
    try {
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setFile(f);
      setPageCount(doc.getPageCount());
      setExtractInput(`1-${doc.getPageCount()}`);
      setStatus('idle');
    } catch (err: any) {
      setStatus('error');
      setStatusText(err.message || t('pdfSplit.readError'));
    }
  }, [t]);

  // Parse page ranges like "1, 3-5, 8"
  const parsePageRanges = (input: string, max: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(',').map(s => s.trim());
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(max, end); i++) {
            pages.add(i - 1); // 0-indexed
          }
        }
      } else {
        const n = Number(part);
        if (!isNaN(n) && n >= 1 && n <= max) {
          pages.add(n - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  // Split
  const handleSplit = useCallback(async () => {
    if (!file) return;
    setStatus('splitting');

    try {
      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const outputs: File[] = [];

      if (splitMode === 'extract') {
        setStatusText(t('pdfSplit.extracting'));
        const indices = parsePageRanges(extractInput, pageCount);
        if (indices.length === 0) throw new Error(t('pdfSplit.noValidPages'));

        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(srcDoc, indices);
        copiedPages.forEach(p => newDoc.addPage(p));
        const bytes = await newDoc.save();
        const blob = new Blob([new Uint8Array(bytes) as BlobPart], { type: 'application/pdf' });
        outputs.push(new File([blob], `extracted_pages.pdf`, { type: 'application/pdf' }));
      } else if (splitMode === 'every-n') {
        const n = Math.max(1, everyN);
        const totalChunks = Math.ceil(pageCount / n);
        for (let chunk = 0; chunk < totalChunks; chunk++) {
          setStatusText(t('pdfSplit.creatingPart', { current: String(chunk + 1), total: String(totalChunks) }));
          const start = chunk * n;
          const end = Math.min(start + n, pageCount);
          const indices = Array.from({ length: end - start }, (_, i) => start + i);

          const newDoc = await PDFDocument.create();
          const copiedPages = await newDoc.copyPages(srcDoc, indices);
          copiedPages.forEach(p => newDoc.addPage(p));
          const bytes = await newDoc.save();
          const blob = new Blob([new Uint8Array(bytes) as BlobPart], { type: 'application/pdf' });
          outputs.push(new File([blob], `part_${chunk + 1}.pdf`, { type: 'application/pdf' }));
        }
      } else if (splitMode === 'equal-parts') {
        const parts = Math.max(2, Math.min(equalParts, pageCount));
        const pagesPerPart = Math.ceil(pageCount / parts);
        for (let part = 0; part < parts; part++) {
          setStatusText(t('pdfSplit.creatingPart', { current: String(part + 1), total: String(parts) }));
          const start = part * pagesPerPart;
          const end = Math.min(start + pagesPerPart, pageCount);
          if (start >= pageCount) break;
          const indices = Array.from({ length: end - start }, (_, i) => start + i);

          const newDoc = await PDFDocument.create();
          const copiedPages = await newDoc.copyPages(srcDoc, indices);
          copiedPages.forEach(p => newDoc.addPage(p));
          const bytes = await newDoc.save();
          const blob = new Blob([new Uint8Array(bytes) as BlobPart], { type: 'application/pdf' });
          outputs.push(new File([blob], `part_${part + 1}.pdf`, { type: 'application/pdf' }));
        }
      }

      setResultFiles(outputs);
      setStatus('done');
      setStatusText(t('tool.done'));
    } catch (err: any) {
      setStatus('error');
      setStatusText(err.message || t('tool.error'));
    }
  }, [file, splitMode, extractInput, everyN, equalParts, pageCount, t]);

  const handleDownloadAll = useCallback(() => {
    resultFiles.forEach(f => {
      const url = URL.createObjectURL(f);
      const a = document.createElement('a');
      a.href = url;
      a.download = f.name;
      a.click();
      URL.revokeObjectURL(url);
    });
  }, [resultFiles]);

  const handleReset = useCallback(() => {
    setFile(null);
    setPageCount(0);
    setResultFiles([]);
    setStatus('idle');
    setStatusText('');
  }, []);

  // --- RENDER ---

  // Success
  if (status === 'done' && resultFiles.length > 0) {
    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.resultSummary}>
            <div className={styles.resultIcon}>✓</div>
            <h3>{t('pdfSplit.splitResult', { count: String(resultFiles.length) })}</h3>
          </div>
          <div className={styles.resultList}>
            {resultFiles.map((f, i) => (
              <div key={i} className={styles.resultItem}>
                <span className={styles.resultIndex}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.resultName}>{f.name}</span>
                <button
                  className={styles.downloadBtn}
                  onClick={() => {
                    const url = URL.createObjectURL(f);
                    const a = document.createElement('a');
                    a.href = url; a.download = f.name; a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  ↓
                </button>
              </div>
            ))}
          </div>
          <div className={styles.resultActions}>
            <button className="btn btn-primary" onClick={handleDownloadAll}>
              {t('pdfSplit.downloadAll', { count: String(resultFiles.length) })}
            </button>
            <ToolSuccess
              outputFiles={resultFiles}
              sourceTool="pdf_split"
              onDownload={handleDownloadAll}
              crossLinks={[
                { icon: '', label: t('pdfSplit.mergeLink'), href: localizedHref('/pdf/merge') },
              ]}
            />
          </div>
          <button className={styles.resetButton} onClick={handleReset}>
            {t('pdfSplit.splitAnother')}
          </button>
        </div>
      </div>
    );
  }

  // Splitting
  if (status === 'splitting') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSection}>
          <p className={styles.statusText}>{statusText}</p>
        </div>
      </div>
    );
  }

  // Error
  if (status === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.errorSection}>
          <p className={styles.errorText}>{statusText}</p>
          <button className={styles.resetButton} onClick={handleReset}>{t('pdfSplit.tryAgain')}</button>
        </div>
      </div>
    );
  }

  // Idle — no file loaded yet
  if (!file) {
    return (
      <div className={styles.container}>
        <div
          className={styles.dropzone}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <span className={styles.dropzoneIcon}><ToolIcon name="scissors" size={32} /></span>
          <p className={styles.dropzoneTitle}>{t('pdfSplit.dropTitle')}</p>
          <p className={styles.dropzoneSubtitle}>{t('pdfSplit.dropSubtitle')}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            className={styles.hiddenInput}
          />
        </div>
        {status === 'loading' && <p className={styles.statusText}>{statusText}</p>}
      </div>
    );
  }

  // File loaded — split config
  return (
    <div className={styles.container}>
      {/* File info */}
      <div className={styles.fileInfo}>
        <span className={styles.fileName}>{file.name}</span>
        <span className={styles.fileMeta}>{t('pdfSplit.pages', { count: String(pageCount) })}</span>
      </div>

      {/* Split mode selector */}
      <div className={styles.modeSelector}>
        <button
          className={`${styles.modeBtn} ${splitMode === 'extract' ? styles.modeBtnActive : ''}`}
          onClick={() => setSplitMode('extract')}
        >
          {t('pdfSplit.extractPages')}
        </button>
        <button
          className={`${styles.modeBtn} ${splitMode === 'every-n' ? styles.modeBtnActive : ''}`}
          onClick={() => setSplitMode('every-n')}
        >
          {t('pdfSplit.everyN')}
        </button>
        <button
          className={`${styles.modeBtn} ${splitMode === 'equal-parts' ? styles.modeBtnActive : ''}`}
          onClick={() => setSplitMode('equal-parts')}
        >
          {t('pdfSplit.equalParts')}
        </button>
      </div>

      {/* Config */}
      <div className={styles.configPanel}>
        {splitMode === 'extract' && (
          <div className={styles.configField}>
            <label className={styles.configLabel}>{t('pdfSplit.pagesToExtract')}</label>
            <input
              className={styles.configInput}
              type="text"
              value={extractInput}
              onChange={(e) => setExtractInput(e.target.value)}
              placeholder="e.g. 1, 3-5, 8"
            />
            <span className={styles.configHint}>
              {t('pdfSplit.extractHint', { max: String(pageCount) })}
            </span>
          </div>
        )}

        {splitMode === 'every-n' && (
          <div className={styles.configField}>
            <label className={styles.configLabel}>{t('pdfSplit.pagesPerFile')}</label>
            <input
              className={styles.configInput}
              type="number"
              min={1}
              max={pageCount}
              value={everyN}
              onChange={(e) => setEveryN(Number(e.target.value))}
            />
            <span className={styles.configHint}>
              {t('pdfSplit.willCreate', { count: String(Math.ceil(pageCount / Math.max(1, everyN))) })}
            </span>
          </div>
        )}

        {splitMode === 'equal-parts' && (
          <div className={styles.configField}>
            <label className={styles.configLabel}>{t('pdfSplit.numberOfParts')}</label>
            <input
              className={styles.configInput}
              type="number"
              min={2}
              max={pageCount}
              value={equalParts}
              onChange={(e) => setEqualParts(Number(e.target.value))}
            />
            <span className={styles.configHint}>
              {t('pdfSplit.pagesPerPart', { count: String(Math.ceil(pageCount / Math.max(2, equalParts))) })}
            </span>
          </div>
        )}
      </div>

      <button className="btn btn-primary btn-lg" onClick={handleSplit} style={{ width: '100%' }}>
        {t('pdfSplit.splitButton')}
      </button>
    </div>
  );
}
