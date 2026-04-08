'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useFileStore, toFile } from '@/lib/useFileStore';
import { processToColoringPage } from './imageProcessing';
import ToolSuccess from '@/components/ToolSuccess';
import ToolIcon from '@/components/ui/ToolIcon';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './ColoringPageTool.module.css';

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/bmp'];

export default function ColoringPageTool() {
  const { t, localizedHref } = useLocale();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'preview' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sensitivity, setSensitivity] = useState(50);
  const [lineThickness, setLineThickness] = useState(2);
  const [blurRadius, setBlurRadius] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const { files: handoffFiles, hydrated, clearFiles } = useFileStore();
  useEffect(() => {
    if (hydrated && handoffFiles.length > 0) {
      const hf = handoffFiles[0];
      if (ACCEPTED_TYPES.includes(hf.type)) { handleFile(toFile(hf)); clearFiles(); }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [originalUrl, resultUrl]);

  const loadImageToCanvas = useCallback((file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = sourceCanvasRef.current;
        if (!canvas) { reject(new Error('Canvas not available')); return; }
        const maxDim = 2000;
        let w = img.naturalWidth; let h = img.naturalHeight;
        if (w > maxDim || h > maxDim) {
          const scale = maxDim / Math.max(w, h);
          w = Math.round(w * scale); h = Math.round(h * scale);
        }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(img.src);
        resolve();
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const runProcessing = useCallback(() => {
    const source = sourceCanvasRef.current;
    const output = previewCanvasRef.current || outputCanvasRef.current;
    if (!source || !output) return;
    processToColoringPage(source, output, { sensitivity, lineThickness, blurRadius, invert: true });
  }, [sensitivity, lineThickness, blurRadius]);

  const handleFile = useCallback(async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(t('coloringPage.invalidType')); setStatus('error'); return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(t('coloringPage.fileTooLarge')); setStatus('error'); return;
    }
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setOriginalFile(file); setOriginalUrl(URL.createObjectURL(file));
    setResultUrl(null); setResultFile(null); setStatus('processing'); setError(null);
    try {
      await loadImageToCanvas(file);
      setStatus('preview');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('coloringPage.processingError'));
      setStatus('error');
    }
  }, [loadImageToCanvas, originalUrl, resultUrl, t]);

  useEffect(() => {
    if (status === 'preview') {
      const id = requestAnimationFrame(() => { runProcessing(); });
      return () => cancelAnimationFrame(id);
    }
  }, [status, runProcessing]);

  const handleGenerate = useCallback(() => {
    const output = previewCanvasRef.current;
    if (!output) return;
    output.toBlob((blob) => {
      if (!blob) { setError(t('coloringPage.generateError')); setStatus('error'); return; }
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      const baseName = originalFile ? originalFile.name.replace(/\.[^.]+$/, '') : 'coloring_page';
      setResultFile(new File([blob], `${baseName}_coloring.png`, { type: 'image/png' }));
      setStatus('done');
    }, 'image/png');
  }, [originalFile, t]);

  const handleDownload = useCallback(() => {
    if (!resultUrl || !resultFile) return;
    const a = document.createElement('a'); a.href = resultUrl; a.download = resultFile.name; a.click();
  }, [resultUrl, resultFile]);

  const handleReset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setOriginalFile(null); setOriginalUrl(null); setResultUrl(null); setResultFile(null);
    setSensitivity(50); setLineThickness(2); setBlurRadius(1);
    setStatus('idle'); setError(null);
  }, [originalUrl, resultUrl]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  if (status === 'done' && resultUrl && resultFile) {
    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.resultPreview}>
            <img src={resultUrl} alt="Coloring page result" className={styles.resultImage} />
          </div>
          <ToolSuccess outputFiles={[resultFile]} sourceTool="coloring_page" onDownload={handleDownload}
            crossLinks={[
              { icon: '✨', label: t('coloringPage.svgLink'), href: localizedHref('/image/png-to-svg') },
              { icon: '🖼️', label: t('coloringPage.bgLink'), href: localizedHref('/image/remove-background') },
              { icon: '🗜️', label: t('coloringPage.compressLink'), href: localizedHref('/image/compress-image') },
            ]} />
          <button className={styles.resetButton} onClick={handleReset}>{t('coloringPage.createAnother')}</button>
        </div>
        <canvas ref={sourceCanvasRef} style={{ display: 'none' }} />
        <canvas ref={outputCanvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  if (status === 'preview' && originalUrl) {
    return (
      <div className={styles.container}>
        <div className={styles.controlsPanel}>
          <div className={styles.controlGroup}>
            <div className={styles.controlRow}>
              <span className={styles.controlLabel}>{t('coloringPage.sensitivity')}</span>
              <span className={styles.controlValue}>{sensitivity}</span>
            </div>
            <input type="range" min={10} max={95} value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))} className={styles.slider} />
          </div>
          <div className={styles.controlGroup}>
            <div className={styles.controlRow}>
              <span className={styles.controlLabel}>{t('coloringPage.lineThickness')}</span>
              <span className={styles.controlValue}>{lineThickness}</span>
            </div>
            <input type="range" min={1} max={5} value={lineThickness}
              onChange={(e) => setLineThickness(Number(e.target.value))} className={styles.slider} />
          </div>
          <div className={styles.controlGroup}>
            <div className={styles.controlRow}>
              <span className={styles.controlLabel}>{t('coloringPage.smoothing')}</span>
              <span className={styles.controlValue}>{blurRadius}</span>
            </div>
            <input type="range" min={0} max={4} value={blurRadius}
              onChange={(e) => setBlurRadius(Number(e.target.value))} className={styles.slider} />
          </div>
        </div>
        <div className={styles.previewSection}>
          <div className={styles.previewGrid}>
            <div className={styles.previewCard}>
              <span className={styles.previewLabel}>{t('coloringPage.original')}</span>
              <img src={originalUrl} alt="Original image" className={styles.previewImage} />
            </div>
            <div className={styles.previewCard}>
              <span className={styles.previewLabel}>{t('coloringPage.preview')}</span>
              <canvas ref={previewCanvasRef} className={styles.previewCanvas} />
            </div>
          </div>
          <div className={styles.actionBar}>
            <span className={styles.actionInfo}>{t('coloringPage.adjustHint')}</span>
            <button className="btn btn-primary btn-lg" onClick={handleGenerate}>
              {t('coloringPage.downloadButton')}
            </button>
          </div>
          <button className={styles.resetButton} onClick={handleReset}>{t('coloringPage.startOver')}</button>
        </div>
        <canvas ref={sourceCanvasRef} style={{ display: 'none' }} />
        <canvas ref={outputCanvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSection}>
          <div className={styles.progressWrapper}>
            <p className={styles.statusText}>{t('coloringPage.processing')}</p>
            <p className={styles.privacyNote}>
              <ToolIcon name="shield" size={14} /> {t('coloringPage.privacyNote')}
            </p>
          </div>
        </div>
        <canvas ref={sourceCanvasRef} style={{ display: 'none' }} />
        <canvas ref={outputCanvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.errorSection}>
          <p className={styles.errorText}>❌ {error}</p>
          <button className={styles.resetButton} onClick={handleReset}>{t('coloringPage.tryAgain')}</button>
        </div>
        <canvas ref={sourceCanvasRef} style={{ display: 'none' }} />
        <canvas ref={outputCanvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}>
        <div className={styles.dropzoneContent}>
          <span className={styles.dropzoneIcon}><ToolIcon name="paintbrush" size={32} /></span>
          <p className={styles.dropzoneTitle}>{t('coloringPage.dropTitle')}</p>
          <p className={styles.dropzoneSubtitle}>{t('coloringPage.dropSubtitle')}</p>
          <button className={styles.uploadButton}>{t('coloringPage.chooseFile')}</button>
        </div>
        <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES.join(',')}
          onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }}
          className={styles.hiddenInput} />
      </div>
      <canvas ref={sourceCanvasRef} style={{ display: 'none' }} />
      <canvas ref={outputCanvasRef} style={{ display: 'none' }} />
    </div>
  );
}
