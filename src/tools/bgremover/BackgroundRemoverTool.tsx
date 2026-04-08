'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useBackgroundRemoval } from '@/hooks/useBackgroundRemoval';
import { useFileStore, toHandoffFile, toFile } from '@/lib/useFileStore';
import ToolSuccess from '@/components/ToolSuccess';
import ToolIcon from '@/components/ui/ToolIcon';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './BackgroundRemoverTool.module.css';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/bmp'];

export default function BackgroundRemoverTool() {
  const { t, localizedHref } = useLocale();
  const { status, statusText, progress, resultImageData, error, processImage, reset } =
    useBackgroundRemoval();

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { files: handoffFiles, hydrated, clearFiles } = useFileStore();
  useEffect(() => {
    if (hydrated && handoffFiles.length > 0) {
      const hf = handoffFiles[0];
      if (ACCEPTED_TYPES.includes(hf.type)) {
        const file = toFile(hf);
        handleFile(file);
        clearFiles();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    if (!resultImageData || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = resultImageData.width;
    canvas.height = resultImageData.height;
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(resultImageData, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      const name = originalFile
        ? originalFile.name.replace(/\.[^.]+$/, '') + '_no_bg.png'
        : 'no_bg.png';
      setResultFile(new File([blob], name, { type: 'image/png' }));
    }, 'image/png');
  }, [resultImageData, originalFile]);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [originalUrl, resultUrl]);

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        alert(t('bgRemover.invalidType'));
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(t('bgRemover.fileTooLarge'));
        return;
      }
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setResultUrl(null);
      setResultFile(null);
      processImage(file);
    },
    [processImage, originalUrl, t],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDownload = useCallback(() => {
    if (!resultUrl || !resultFile) return;
    const a = document.createElement('a');
    a.href = resultUrl; a.download = resultFile.name; a.click();
  }, [resultUrl, resultFile]);

  const handleReset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setOriginalFile(null); setOriginalUrl(null);
    setResultUrl(null); setResultFile(null);
    reset();
  }, [originalUrl, resultUrl, reset]);

  if (status === 'done' && resultUrl && resultFile) {
    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.comparisonContainer}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setSliderPos(((e.clientX - rect.left) / rect.width) * 100);
            }}>
            {originalUrl && <img src={originalUrl} alt="Original" className={styles.comparisonImage} />}
            <div className={styles.comparisonOverlay} style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}>
              <div className={styles.checkerboard}>
                <img src={resultUrl} alt="Background removed" className={styles.comparisonImage} />
              </div>
            </div>
            <div className={styles.sliderLine} style={{ left: `${sliderPos}%` }}>
              <div className={styles.sliderHandle}>⟷</div>
            </div>
            <div className={styles.sliderLabels}>
              <span>{t('bgRemover.original')}</span>
              <span>{t('bgRemover.removed')}</span>
            </div>
          </div>
          <ToolSuccess
            outputFiles={[resultFile]}
            sourceTool="remove_bg"
            onDownload={handleDownload}
            crossLinks={[
              { icon: '✏️', label: t('bgRemover.svgLink'), href: localizedHref('/image/png-to-svg') },
              { icon: '📐', label: t('bgRemover.resizeLink'), href: localizedHref('/image/resize') },
            ]}
          />
          <button className={styles.resetButton} onClick={handleReset}>{t('bgRemover.removeAnother')}</button>
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  if (status === 'loading' || status === 'processing') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSection}>
          {originalUrl && (
            <div className={styles.processingPreview}>
              <img src={originalUrl} alt="Processing..." className={styles.processingImage} />
              <div className={styles.processingOverlay} />
            </div>
          )}
          <div className={styles.progressWrapper}>
            {status === 'loading' && (
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
            )}
            <p className={styles.statusText}>{statusText}</p>
            {status === 'loading' && progress < 100 && (
              <p className={styles.privacyNote}>
                <ToolIcon name="shield" size={14} /> {t('bgRemover.privacyNote')}
              </p>
            )}
          </div>
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.errorSection}>
          <p className={styles.errorText}>❌ {error}</p>
          <button className={styles.resetButton} onClick={handleReset}>{t('bgRemover.tryAgain')}</button>
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className={styles.dropzoneContent}>
          <span className={styles.dropzoneIcon}><ToolIcon name="image-plus" size={32} /></span>
          <p className={styles.dropzoneTitle}>{t('bgRemover.dropTitle')}</p>
          <p className={styles.dropzoneSubtitle}>{t('bgRemover.dropSubtitle')}</p>
          <button className={styles.uploadButton}>{t('bgRemover.chooseFile')}</button>
        </div>
        <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES.join(',')}
          onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }}
          className={styles.hiddenInput} />
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
