'use client';

import { useState, useRef, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolSuccess from '@/components/ToolSuccess';
import ToolIcon from '@/components/ui/ToolIcon';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './ImagesToPdfTool.module.css';

interface ImageEntry {
  id: string;
  file: File;
  name: string;
  size: number;
  preview: string;
  width: number;
  height: number;
}

type PageSize = 'fit' | 'a4' | 'letter';

const PAGE_SIZES: Record<string, { label: string; width: number; height: number }> = {
  a4: { label: 'A4 (210 × 297 mm)', width: 595.28, height: 841.89 },
  letter: { label: 'Letter (8.5 × 11 in)', width: 612, height: 792 },
};

export default function ImagesToPdfTool() {
  const { t, localizedHref } = useLocale();
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('fit');
  const [status, setStatus] = useState<'idle' | 'loading' | 'converting' | 'done' | 'error'>('idle');
  const [statusText, setStatusText] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragItemRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImageDimensions = (file: File): Promise<{ width: number; height: number; preview: string }> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight, preview: url });
      img.onerror = () => resolve({ width: 0, height: 0, preview: url });
      img.src = url;
    });
  };

  const addFiles = useCallback(async (newFiles: FileList | File[]) => {
    const imageFiles = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;
    setStatus('loading');
    setStatusText(t('imagesToPdf.loading', { count: String(imageFiles.length) }));
    const entries: ImageEntry[] = [];
    for (const file of imageFiles) {
      const { width, height, preview } = await loadImageDimensions(file);
      entries.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file, name: file.name, size: file.size, preview, width, height,
      });
    }
    setImages(prev => [...prev, ...entries]);
    setStatus('idle'); setStatusText('');
  }, [t]);

  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const removed = prev.find(i => i.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter(i => i.id !== id);
    });
  }, []);

  const handleDragStart = (index: number) => { dragItemRef.current = index; };
  const handleDragOver = (e: React.DragEvent, index: number) => { e.preventDefault(); setDragOverIndex(index); };
  const handleDrop = (index: number) => {
    if (dragItemRef.current === null) return;
    const updated = [...images];
    const [dragged] = updated.splice(dragItemRef.current, 1);
    updated.splice(index, 0, dragged);
    setImages(updated);
    dragItemRef.current = null; setDragOverIndex(null);
  };
  const handleDragEnd = () => { dragItemRef.current = null; setDragOverIndex(null); };

  const handleConvert = useCallback(async () => {
    if (images.length === 0) return;
    setStatus('converting');
    setStatusText(t('imagesToPdf.converting', { count: String(images.length) }));
    try {
      const pdfDoc = await PDFDocument.create();
      for (let i = 0; i < images.length; i++) {
        setStatusText(t('imagesToPdf.processing', { current: String(i + 1), total: String(images.length) }));
        const entry = images[i];
        const buffer = await entry.file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let embedded;
        if (entry.file.type === 'image/png') {
          embedded = await pdfDoc.embedPng(bytes);
        } else if (entry.file.type === 'image/jpeg' || entry.file.type === 'image/jpg') {
          embedded = await pdfDoc.embedJpg(bytes);
        } else {
          const canvas = document.createElement('canvas');
          canvas.width = entry.width; canvas.height = entry.height;
          const ctx = canvas.getContext('2d')!;
          const img = new window.Image();
          await new Promise<void>((resolve) => { img.onload = () => { ctx.drawImage(img, 0, 0); resolve(); }; img.src = entry.preview; });
          const pngBlob = await new Promise<Blob>((resolve) => { canvas.toBlob(blob => resolve(blob!), 'image/png'); });
          const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
          embedded = await pdfDoc.embedPng(pngBytes);
        }
        let pageWidth: number; let pageHeight: number;
        if (pageSize === 'fit') { pageWidth = embedded.width; pageHeight = embedded.height; }
        else { const preset = PAGE_SIZES[pageSize]; pageWidth = preset.width; pageHeight = preset.height; }
        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        if (pageSize === 'fit') {
          page.drawImage(embedded, { x: 0, y: 0, width: pageWidth, height: pageHeight });
        } else {
          const margin = 36;
          const maxW = pageWidth - margin * 2; const maxH = pageHeight - margin * 2;
          const scale = Math.min(maxW / embedded.width, maxH / embedded.height, 1);
          const drawW = embedded.width * scale; const drawH = embedded.height * scale;
          const x = (pageWidth - drawW) / 2; const y = (pageHeight - drawH) / 2;
          page.drawImage(embedded, { x, y, width: drawW, height: drawH });
        }
      }
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes) as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const outputFile = new File([blob], 'images.pdf', { type: 'application/pdf' });
      setResultUrl(url); setResultFile(outputFile); setStatus('done');
    } catch (err: unknown) {
      setStatus('error');
      setStatusText(err instanceof Error ? err.message : t('imagesToPdf.conversionError'));
    }
  }, [images, pageSize, t]);

  const handleDownload = useCallback(() => {
    if (!resultUrl || !resultFile) return;
    const a = document.createElement('a'); a.href = resultUrl; a.download = resultFile.name; a.click();
  }, [resultUrl, resultFile]);

  const handleReset = useCallback(() => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]); setResultUrl(null); setResultFile(null);
    setStatus('idle'); setStatusText('');
  }, [resultUrl, images]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (status === 'done' && resultFile) {
    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.resultSummary}>
            <div className={styles.resultIcon}>✓</div>
            <h3>{t('imagesToPdf.success', { count: String(images.length), size: formatSize(resultFile.size) })}</h3>
          </div>
          <ToolSuccess outputFiles={[resultFile]} sourceTool="images_to_pdf" onDownload={handleDownload}
            crossLinks={[
              { icon: '🔒', label: t('imagesToPdf.passwordLink'), href: localizedHref('/pdf/password-protect') },
              { icon: '✂️', label: t('imagesToPdf.splitLink'), href: localizedHref('/pdf/split') },
            ]} />
          <button className={styles.resetButton} onClick={handleReset}>{t('imagesToPdf.convertMore')}</button>
        </div>
      </div>
    );
  }

  if (status === 'converting') {
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

  if (status === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.errorSection}>
          <p className={styles.errorText}>{statusText}</p>
          <button className={styles.resetButton} onClick={handleReset}>{t('imagesToPdf.tryAgain')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.dropzone}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}>
        <span className={styles.dropzoneIcon}><ToolIcon name="image-plus" size={32} /></span>
        <p className={styles.dropzoneTitle}>
          {images.length === 0 ? t('imagesToPdf.dropTitle') : t('imagesToPdf.dropTitleMore')}
        </p>
        <p className={styles.dropzoneSubtitle}>{t('imagesToPdf.dropSubtitle')}</p>
        <input ref={fileInputRef} type="file" accept="image/*" multiple
          onChange={(e) => { if (e.target.files) addFiles(e.target.files); }}
          className={styles.hiddenInput} />
      </div>

      {images.length > 0 && (
        <>
          <div className={styles.imageGrid}>
            {images.map((entry, index) => (
              <div key={entry.id}
                className={`${styles.imageItem} ${dragOverIndex === index ? styles.imageItemDragOver : ''}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}>
                <span className={styles.imageIndex}>{index + 1}</span>
                <img src={entry.preview} alt={entry.name} className={styles.thumbnail} />
                <div className={styles.imageInfo}>
                  <span className={styles.imageName}>{entry.name}</span>
                  <span className={styles.imageMeta}>{entry.width}×{entry.height} · {formatSize(entry.size)}</span>
                </div>
                <button className={styles.removeButton} onClick={(e) => { e.stopPropagation(); removeImage(entry.id); }}>×</button>
              </div>
            ))}
          </div>

          <div className={styles.convertBar}>
            <div className={styles.settings}>
              <label className={styles.settingLabel}>{t('imagesToPdf.pageSize')}</label>
              <select className={styles.select} value={pageSize} onChange={(e) => setPageSize(e.target.value as PageSize)}>
                <option value="fit">{t('imagesToPdf.fitToImage')}</option>
                <option value="a4">A4 (210 × 297 mm)</option>
                <option value="letter">Letter (8.5 × 11 in)</option>
              </select>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleConvert}>
              {images.length === 1
                ? t('imagesToPdf.convertButtonSingle')
                : t('imagesToPdf.convertButton', { count: String(images.length) })}
            </button>
          </div>
        </>
      )}

      {status === 'loading' && <p className={styles.statusText}>{statusText}</p>}
    </div>
  );
}
