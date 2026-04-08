'use client';

import { useState, useRef, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolSuccess from '@/components/ToolSuccess';
import ToolIcon from '@/components/ui/ToolIcon';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './PdfMergeTool.module.css';

interface PdfFileEntry {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number | null;
}

export default function PdfMergeTool() {
  const { t, localizedHref } = useLocale();
  const [files, setFiles] = useState<PdfFileEntry[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'merging' | 'done' | 'error'>('idle');
  const [statusText, setStatusText] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragItemRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add files and read page counts
  const addFiles = useCallback(async (newFiles: FileList | File[]) => {
    const pdfFiles = Array.from(newFiles).filter(f => f.type === 'application/pdf');
    if (pdfFiles.length === 0) return;

    setStatus('loading');
    setStatusText(t('pdfMerge.reading'));

    const entries: PdfFileEntry[] = [];
    for (const file of pdfFiles) {
      try {
        const buffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        entries.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          name: file.name,
          size: file.size,
          pageCount: doc.getPageCount(),
        });
      } catch {
        entries.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          name: file.name,
          size: file.size,
          pageCount: null,
        });
      }
    }

    setFiles(prev => [...prev, ...entries]);
    setStatus('idle');
    setStatusText('');
  }, [t]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  // Drag-and-drop reorder
  const handleDragStart = (index: number) => {
    dragItemRef.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (dragItemRef.current === null) return;
    const updated = [...files];
    const [dragged] = updated.splice(dragItemRef.current, 1);
    updated.splice(index, 0, dragged);
    setFiles(updated);
    dragItemRef.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragItemRef.current = null;
    setDragOverIndex(null);
  };

  // Merge
  const handleMerge = useCallback(async () => {
    if (files.length < 2) return;

    setStatus('merging');
    setStatusText(t('pdfMerge.mergingFiles', { count: String(files.length) }));

    try {
      const mergedDoc = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        setStatusText(t('pdfMerge.mergingProgress', { current: String(i + 1), total: String(files.length) }));
        const buffer = await files[i].file.arrayBuffer();
        const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const pages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
        pages.forEach(page => mergedDoc.addPage(page));
      }

      const mergedBytes = await mergedDoc.save();
      const blob = new Blob([new Uint8Array(mergedBytes) as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const outputFile = new File([blob], 'merged.pdf', { type: 'application/pdf' });

      setResultUrl(url);
      setResultFile(outputFile);
      setStatus('done');
      setStatusText(t('tool.done'));
    } catch (err: any) {
      setStatus('error');
      setStatusText(err.message || t('tool.error'));
    }
  }, [files, t]);

  const handleDownload = useCallback(() => {
    if (!resultUrl || !resultFile) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = resultFile.name;
    a.click();
  }, [resultUrl, resultFile]);

  const handleReset = useCallback(() => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFiles([]);
    setResultUrl(null);
    setResultFile(null);
    setStatus('idle');
    setStatusText('');
  }, [resultUrl]);

  const totalPages = files.reduce((sum, f) => sum + (f.pageCount || 0), 0);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // --- RENDER ---

  // Success state
  if (status === 'done' && resultFile) {
    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.resultSummary}>
            <div className={styles.resultIcon}>✓</div>
            <h3>{t('pdfMerge.resultSummary', { fileCount: String(files.length), pageCount: String(totalPages) })}</h3>
            <p>{formatSize(resultFile.size)}</p>
          </div>
          <ToolSuccess
            outputFiles={[resultFile]}
            sourceTool="pdf_merge"
            onDownload={handleDownload}
            crossLinks={[
              { icon: '✂️', label: t('pdfMerge.splitLink'), href: localizedHref('/pdf/split') },
            ]}
          />
          <button className={styles.resetButton} onClick={handleReset}>
            {t('pdfMerge.mergeMore')}
          </button>
        </div>
      </div>
    );
  }

  // Merging state
  if (status === 'merging') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSection}>
          <div className={styles.progressWrapper}>
            <p className={styles.statusText}>{statusText}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.errorSection}>
          <p className={styles.errorText}>{statusText}</p>
          <button className={styles.resetButton} onClick={handleReset}>
            {t('pdfMerge.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  // Idle / File list
  return (
    <div className={styles.container}>
      {/* Dropzone */}
      <div
        className={styles.dropzone}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
      >
        <span className={styles.dropzoneIcon}><ToolIcon name="file-plus" size={32} /></span>
        <p className={styles.dropzoneTitle}>
          {files.length === 0 ? t('pdfMerge.dropTitle') : t('pdfMerge.dropTitleMore')}
        </p>
        <p className={styles.dropzoneSubtitle}>{t('pdfMerge.dropSubtitle')}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={(e) => { if (e.target.files) addFiles(e.target.files); }}
          className={styles.hiddenInput}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <>
          <div className={styles.fileList}>
            {files.map((entry, index) => (
              <div
                key={entry.id}
                className={`${styles.fileItem} ${dragOverIndex === index ? styles.fileItemDragOver : ''}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
              >
                <span className={styles.fileIndex}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.dragHandle}>⠿</span>
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{entry.name}</span>
                  <span className={styles.fileMeta}>
                    {entry.pageCount !== null
                      ? t('pdfMerge.pages', { count: String(entry.pageCount) })
                      : t('pdfMerge.pageUnknown')
                    } · {formatSize(entry.size)}
                  </span>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={(e) => { e.stopPropagation(); removeFile(entry.id); }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className={styles.mergeBar}>
            <span className={styles.totalPages}>
              {t('pdfMerge.fileSummary', { fileCount: String(files.length), pageCount: String(totalPages) })}
            </span>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleMerge}
              disabled={files.length < 2}
            >
              {t('pdfMerge.mergeButton', { count: String(files.length) })}
            </button>
          </div>
        </>
      )}

      {status === 'loading' && (
        <p className={styles.statusText}>{statusText}</p>
      )}
    </div>
  );
}
