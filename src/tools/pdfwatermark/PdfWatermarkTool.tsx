'use client';

import { useState, useRef, useCallback } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import ToolSuccess from '@/components/ToolSuccess';
import ToolIcon from '@/components/ui/ToolIcon';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './PdfWatermarkTool.module.css';

type WatermarkPosition = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export default function PdfWatermarkTool() {
  const { t, localizedHref } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [text, setText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.3);
  const [rotation, setRotation] = useState(-45);
  const [position, setPosition] = useState<WatermarkPosition>('center');
  const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'done' | 'error'>('idle');
  const [statusText, setStatusText] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (files: FileList | File[]) => {
    const pdfFile = Array.from(files).find(f => f.type === 'application/pdf');
    if (!pdfFile) return;

    setStatus('loading');
    setStatusText(t('pdfWatermark.reading'));
    try {
      const buffer = await pdfFile.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
      setFile(pdfFile);
      setStatus('idle');
      setStatusText('');
    } catch {
      setStatus('error');
      setStatusText(t('pdfWatermark.readError'));
    }
  }, [t]);

  const handleApply = useCallback(async () => {
    if (!file || !text.trim()) return;

    setStatus('processing');
    setStatusText(t('pdfWatermark.adding'));

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = fontSize;

        let x: number;
        let y: number;

        switch (position) {
          case 'top-left':
            x = 40;
            y = height - 40 - textHeight;
            break;
          case 'top-right':
            x = width - textWidth - 40;
            y = height - 40 - textHeight;
            break;
          case 'bottom-left':
            x = 40;
            y = 40;
            break;
          case 'bottom-right':
            x = width - textWidth - 40;
            y = 40;
            break;
          case 'center':
          default:
            x = (width - textWidth) / 2;
            y = (height - textHeight) / 2;
            break;
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: degrees(rotation),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes) as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const outputFile = new File([blob], `watermarked_${file.name}`, { type: 'application/pdf' });

      setResultUrl(url);
      setResultFile(outputFile);
      setStatus('done');
      setStatusText(t('tool.done'));
    } catch (err: unknown) {
      setStatus('error');
      setStatusText(err instanceof Error ? err.message : t('pdfWatermark.addError'));
    }
  }, [file, text, fontSize, opacity, rotation, position, t]);

  const handleDownload = useCallback(() => {
    if (!resultUrl || !resultFile) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = resultFile.name;
    a.click();
  }, [resultUrl, resultFile]);

  const handleReset = useCallback(() => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setPageCount(0);
    setResultUrl(null);
    setResultFile(null);
    setStatus('idle');
    setStatusText('');
  }, [resultUrl]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // --- RENDER ---

  if (status === 'done' && resultFile) {
    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.resultSummary}>
            <div className={styles.resultIcon}>✓</div>
            <h3>{t('pdfWatermark.success', { count: String(pageCount) })}</h3>
            <p>{formatSize(resultFile.size)}</p>
          </div>
          <ToolSuccess
            outputFiles={[resultFile]}
            sourceTool="pdf_watermark"
            onDownload={handleDownload}
            crossLinks={[
              { icon: '🔒', label: t('pdfWatermark.passwordLink'), href: localizedHref('/pdf/password-protect') },
            ]}
          />
          <button className={styles.resetButton} onClick={handleReset}>
            {t('pdfWatermark.watermarkAnother')}
          </button>
        </div>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSection}>
          <p className={styles.statusText}>{statusText}</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.errorSection}>
          <p className={styles.errorText}>{statusText}</p>
          <button className={styles.resetButton} onClick={handleReset}>{t('pdfWatermark.tryAgain')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {!file ? (
        <div
          className={styles.dropzone}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFileSelect(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
        >
          <span className={styles.dropzoneIcon}><ToolIcon name="droplets" size={32} /></span>
          <p className={styles.dropzoneTitle}>{t('pdfWatermark.dropTitle')}</p>
          <p className={styles.dropzoneSubtitle}>{t('pdfWatermark.dropSubtitle')}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => { if (e.target.files) handleFileSelect(e.target.files); }}
            className={styles.hiddenInput}
          />
        </div>
      ) : (
        <>
          <div className={styles.fileInfo}>
            <ToolIcon name="file-text" size={20} />
            <div>
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileMeta}>{t('pdfWatermark.pages', { count: String(pageCount) })} · {formatSize(file.size)}</span>
            </div>
          </div>

          <div className={styles.settingsPanel}>
            <h3 className={styles.settingsTitle}>{t('pdfWatermark.settingsTitle')}</h3>

            <div className={styles.field}>
              <label className={styles.label}>{t('pdfWatermark.text')}</label>
              <input
                type="text"
                className={styles.input}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('pdfWatermark.textPlaceholder')}
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>{t('pdfWatermark.fontSize')}</label>
                <input
                  type="range"
                  min="12"
                  max="120"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className={styles.range}
                />
                <span className={styles.rangeValue}>{fontSize}pt</span>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>{t('pdfWatermark.opacity')}</label>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className={styles.range}
                />
                <span className={styles.rangeValue}>{Math.round(opacity * 100)}%</span>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>{t('pdfWatermark.rotation')}</label>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className={styles.range}
                />
                <span className={styles.rangeValue}>{rotation}°</span>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>{t('pdfWatermark.position')}</label>
                <select
                  className={styles.select}
                  value={position}
                  onChange={(e) => setPosition(e.target.value as WatermarkPosition)}
                >
                  <option value="center">{t('pdfWatermark.center')}</option>
                  <option value="top-left">{t('pdfWatermark.topLeft')}</option>
                  <option value="top-right">{t('pdfWatermark.topRight')}</option>
                  <option value="bottom-left">{t('pdfWatermark.bottomLeft')}</option>
                  <option value="bottom-right">{t('pdfWatermark.bottomRight')}</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.actionBar}>
            <button className={styles.resetButton} onClick={handleReset}>
              {t('pdfWatermark.changeFile')}
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleApply}
              disabled={!text.trim()}
            >
              {t('pdfWatermark.addButton')}
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
