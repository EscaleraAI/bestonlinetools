'use client';

import { useState, useRef, useCallback } from 'react';
import ToolSuccess from '@/components/ToolSuccess';
import ToolIcon from '@/components/ui/ToolIcon';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './ImageResizeTool.module.css';

type ResizeMode = 'dimensions' | 'percentage' | 'preset';

interface Preset {
  label: string;
  width: number;
  height: number;
}

const PRESETS: Preset[] = [
  { label: 'Instagram Post (1080×1080)', width: 1080, height: 1080 },
  { label: 'Instagram Story (1080×1920)', width: 1080, height: 1920 },
  { label: 'Facebook Cover (851×315)', width: 851, height: 315 },
  { label: 'Twitter Header (1500×500)', width: 1500, height: 500 },
  { label: 'YouTube Thumbnail (1280×720)', width: 1280, height: 720 },
  { label: 'LinkedIn Banner (1584×396)', width: 1584, height: 396 },
  { label: 'HD (1920×1080)', width: 1920, height: 1080 },
  { label: '4K (3840×2160)', width: 3840, height: 2160 },
  { label: 'Passport Photo (600×600)', width: 600, height: 600 },
];

export default function ImageResizeTool() {
  const { t } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [origWidth, setOrigWidth] = useState(0);
  const [origHeight, setOrigHeight] = useState(0);
  const [mode, setMode] = useState<ResizeMode>('dimensions');
  const [targetWidth, setTargetWidth] = useState(0);
  const [targetHeight, setTargetHeight] = useState(0);
  const [percentage, setPercentage] = useState(50);
  const [presetIndex, setPresetIndex] = useState(0);
  const [keepAspect, setKeepAspect] = useState(true);
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState(0.92);
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [resultDimensions, setResultDimensions] = useState<{ w: number; h: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (files: FileList | File[]) => {
    const imgFile = Array.from(files).find(f => f.type.startsWith('image/'));
    if (!imgFile) return;
    const url = URL.createObjectURL(imgFile);
    const img = new Image();
    img.onload = () => {
      setOrigWidth(img.naturalWidth);
      setOrigHeight(img.naturalHeight);
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
      setFile(imgFile);
      setPreview(url);
    };
    img.src = url;
  }, []);

  const handleWidthChange = (w: number) => {
    setTargetWidth(w);
    if (keepAspect && origWidth > 0) setTargetHeight(Math.round((w / origWidth) * origHeight));
  };

  const handleHeightChange = (h: number) => {
    setTargetHeight(h);
    if (keepAspect && origHeight > 0) setTargetWidth(Math.round((h / origHeight) * origWidth));
  };

  const getOutputDimensions = (): { w: number; h: number } => {
    switch (mode) {
      case 'percentage':
        return { w: Math.round(origWidth * percentage / 100), h: Math.round(origHeight * percentage / 100) };
      case 'preset':
        return { w: PRESETS[presetIndex].width, h: PRESETS[presetIndex].height };
      default:
        return { w: targetWidth, h: targetHeight };
    }
  };

  const handleResize = useCallback(async () => {
    if (!file || !preview) return;
    const { w, h } = getOutputDimensions();
    if (w <= 0 || h <= 0) return;
    try {
      const img = new window.Image();
      await new Promise<void>((resolve) => { img.onload = () => resolve(); img.src = preview; });
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);
      const mimeType = `image/${outputFormat}`;
      const blob = await new Promise<Blob>((resolve) => { canvas.toBlob(b => resolve(b!), mimeType, quality); });
      const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
      const name = file.name.replace(/\.[^.]+$/, '') + `_${w}x${h}.${ext}`;
      const outFile = new File([blob], name, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setResultUrl(url); setResultFile(outFile); setResultDimensions({ w, h }); setStatus('done');
    } catch { setStatus('error'); }
  }, [file, preview, mode, targetWidth, targetHeight, percentage, presetIndex, outputFormat, quality, origWidth, origHeight]);

  const handleDownload = useCallback(() => {
    if (!resultUrl || !resultFile) return;
    const a = document.createElement('a');
    a.href = resultUrl; a.download = resultFile.name; a.click();
  }, [resultUrl, resultFile]);

  const handleReset = useCallback(() => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    if (preview) URL.revokeObjectURL(preview);
    setFile(null); setPreview(null); setResultUrl(null); setResultFile(null); setResultDimensions(null); setStatus('idle');
  }, [resultUrl, preview]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (status === 'done' && resultFile && resultDimensions) {
    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.resultSummary}>
            <div className={styles.resultIcon}>✓</div>
            <h3>{t('imageResize.resizedTo', { w: String(resultDimensions.w), h: String(resultDimensions.h) })}</h3>
            <p>{formatSize(resultFile.size)}</p>
          </div>
          {resultUrl && (
            <div className={styles.previewBox}>
              <img src={resultUrl} alt="Resized" className={styles.resultPreview} />
            </div>
          )}
          <ToolSuccess outputFiles={[resultFile]} sourceTool="image_resize" onDownload={handleDownload} crossLinks={[]} />
          <button className={styles.resetButton} onClick={handleReset}>{t('imageResize.resizeAnother')}</button>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.errorSection}>
          <p className={styles.errorText}>{t('imageResize.resizeError')}</p>
          <button className={styles.resetButton} onClick={handleReset}>{t('imageResize.tryAgain')}</button>
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
          <span className={styles.dropzoneIcon}><ToolIcon name="maximize" size={32} /></span>
          <p className={styles.dropzoneTitle}>{t('imageResize.dropTitle')}</p>
          <p className={styles.dropzoneSubtitle}>{t('imageResize.dropSubtitle')}</p>
          <input ref={fileInputRef} type="file" accept="image/*"
            onChange={(e) => { if (e.target.files) handleFileSelect(e.target.files); }}
            className={styles.hiddenInput} />
        </div>
      </div>
    );
  }

  const dims = getOutputDimensions();

  return (
    <div className={styles.container}>
      <div className={styles.previewBox}>
        <img src={preview!} alt="Original" className={styles.originalPreview} />
        <div className={styles.previewInfo}>
          {t('imageResize.original')}: {origWidth} × {origHeight} · {formatSize(file.size)}
        </div>
      </div>

      <div className={styles.settingsPanel}>
        <div className={styles.modeToggle}>
          {(['dimensions', 'percentage', 'preset'] as ResizeMode[]).map(m => (
            <button key={m}
              className={`${styles.modeButton} ${mode === m ? styles.modeActive : ''}`}
              onClick={() => setMode(m)}>
              {m === 'dimensions' ? t('imageResize.dimensions') : m === 'percentage' ? t('imageResize.percentage') : t('imageResize.presets')}
            </button>
          ))}
        </div>

        {mode === 'dimensions' && (
          <div className={styles.dimFields}>
            <div className={styles.field}>
              <label className={styles.label}>{t('imageResize.widthPx')}</label>
              <input type="number" className={styles.input} value={targetWidth} min={1} onChange={(e) => handleWidthChange(Number(e.target.value) || 1)} />
            </div>
            <div className={styles.lockIcon} onClick={() => setKeepAspect(!keepAspect)}>
              {keepAspect ? '🔗' : '🔓'}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t('imageResize.heightPx')}</label>
              <input type="number" className={styles.input} value={targetHeight} min={1} onChange={(e) => handleHeightChange(Number(e.target.value) || 1)} />
            </div>
          </div>
        )}

        {mode === 'percentage' && (
          <div className={styles.field}>
            <label className={styles.label}>{t('imageResize.scale', { value: String(percentage) })}</label>
            <input type="range" className={styles.range} min={1} max={400} value={percentage} onChange={(e) => setPercentage(Number(e.target.value))} />
            <span className={styles.rangeValue}>{t('imageResize.output', { w: String(dims.w), h: String(dims.h) })}</span>
          </div>
        )}

        {mode === 'preset' && (
          <div className={styles.presetGrid}>
            {PRESETS.map((p, i) => (
              <button key={i} className={`${styles.presetItem} ${presetIndex === i ? styles.presetActive : ''}`} onClick={() => setPresetIndex(i)}>
                <span className={styles.presetLabel}>{p.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>{t('imageResize.format')}</label>
            <select className={styles.select} value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as 'png' | 'jpeg' | 'webp')}>
              <option value="png">PNG</option>
              <option value="jpeg">JPG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
          {outputFormat !== 'png' && (
            <div className={styles.field}>
              <label className={styles.label}>{t('imageResize.qualityLabel', { value: String(Math.round(quality * 100)) })}</label>
              <input type="range" className={styles.range} min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
            </div>
          )}
        </div>
      </div>

      <div className={styles.actionBar}>
        <button className={styles.resetButton} onClick={handleReset}>{t('imageResize.changeImage')}</button>
        <button className="btn btn-primary btn-lg" onClick={handleResize}>
          {t('imageResize.resizeButton', { w: String(dims.w), h: String(dims.h) })}
        </button>
      </div>
    </div>
  );
}
