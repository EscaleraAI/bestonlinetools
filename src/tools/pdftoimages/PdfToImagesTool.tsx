'use client';

import { useState, useRef, useCallback } from 'react';
import ToolIcon from '@/components/ui/ToolIcon';
import ToolSuccess from '@/components/ToolSuccess';
import styles from './PdfToImagesTool.module.css';

type OutputFormat = 'png' | 'jpeg';

export default function PdfToImagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');
  const [scale, setScale] = useState(2); // render scale factor
  const [status, setStatus] = useState<'idle' | 'loading' | 'converting' | 'done' | 'error'>('idle');
  const [statusText, setStatusText] = useState('');
  const [progress, setProgress] = useState(0);
  const [resultImages, setResultImages] = useState<{ url: string; file: File; page: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (files: FileList | File[]) => {
    const pdfFile = Array.from(files).find(f => f.type === 'application/pdf');
    if (!pdfFile) return;
    setStatus('loading');
    setStatusText('Reading PDF...');
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const buffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      setPageCount(pdf.numPages);
      setFile(pdfFile);
      setStatus('idle');
    } catch {
      setStatus('error');
      setStatusText('Failed to read PDF file.');
    }
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file) return;
    setStatus('converting');
    setStatusText('Converting pages...');
    setProgress(0);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const images: { url: string; file: File; page: number }[] = [];
      const mimeType = outputFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
      const ext = outputFormat === 'jpeg' ? 'jpg' : 'png';

      for (let i = 1; i <= pdf.numPages; i++) {
        setStatusText(`Rendering page ${i} of ${pdf.numPages}...`);
        setProgress(Math.round((i / pdf.numPages) * 100));

        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;

        await page.render({ canvasContext: ctx, viewport, canvas } as Parameters<typeof page.render>[0]).promise;

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(b => resolve(b!), mimeType, 0.92);
        });

        const baseName = file.name.replace(/\.pdf$/i, '');
        const outFile = new File([blob], `${baseName}_page_${i}.${ext}`, { type: mimeType });
        const url = URL.createObjectURL(blob);
        images.push({ url, file: outFile, page: i });
      }

      setResultImages(images);
      setStatus('done');
    } catch (err: unknown) {
      setStatus('error');
      setStatusText(err instanceof Error ? err.message : 'Conversion failed');
    }
  }, [file, outputFormat, scale]);

  const handleDownloadAll = useCallback(() => {
    resultImages.forEach(img => {
      const a = document.createElement('a');
      a.href = img.url;
      a.download = img.file.name;
      a.click();
    });
  }, [resultImages]);

  const handleDownloadSingle = useCallback((img: { url: string; file: File }) => {
    const a = document.createElement('a');
    a.href = img.url;
    a.download = img.file.name;
    a.click();
  }, []);

  const handleReset = useCallback(() => {
    resultImages.forEach(img => URL.revokeObjectURL(img.url));
    setFile(null); setPageCount(0);
    setResultImages([]);
    setStatus('idle'); setStatusText('');
    setProgress(0);
  }, [resultImages]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (status === 'done' && resultImages.length > 0) {
    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.resultSummary}>
            <div className={styles.resultIcon}>✓</div>
            <h3>{resultImages.length} pages converted to {outputFormat.toUpperCase()}</h3>
          </div>

          <div className={styles.imageGrid}>
            {resultImages.map(img => (
              <div key={img.page} className={styles.imageCard}>
                <img src={img.url} alt={`Page ${img.page}`} className={styles.pageThumb} />
                <div className={styles.imageCardInfo}>
                  <span>Page {img.page}</span>
                  <span>{formatSize(img.file.size)}</span>
                </div>
                <button className={styles.dlBtn} onClick={() => handleDownloadSingle(img)}>↓</button>
              </div>
            ))}
          </div>

          <ToolSuccess
            outputFiles={resultImages.map(i => i.file)}
            sourceTool="pdf_to_images"
            onDownload={handleDownloadAll}
            crossLinks={[]}
          />
          <button className={styles.resetButton} onClick={handleReset}>Convert another PDF</button>
        </div>
      </div>
    );
  }

  if (status === 'converting' || status === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSection}>
          <p className={styles.statusText}>{statusText}</p>
          {progress > 0 && (
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.errorSection}>
          <p className={styles.errorText}>Error: {statusText}</p>
          <button className={styles.resetButton} onClick={handleReset}>Try again</button>
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
          <span className={styles.dropzoneIcon}><ToolIcon name="file-image" size={32} /></span>
          <p className={styles.dropzoneTitle}>Drop a PDF to convert to images</p>
          <p className={styles.dropzoneSubtitle}>Each page becomes a separate image</p>
          <input ref={fileInputRef} type="file" accept="application/pdf"
            onChange={(e) => { if (e.target.files) handleFileSelect(e.target.files); }}
            className={styles.hiddenInput} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.fileInfo}>
        <ToolIcon name="file-text" size={20} />
        <div>
          <span className={styles.fileName}>{file.name}</span>
          <span className={styles.fileMeta}>{pageCount} pages · {formatSize(file.size)}</span>
        </div>
      </div>

      <div className={styles.settingsPanel}>
        <h3 className={styles.settingsTitle}>Output Settings</h3>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>Format</label>
            <select className={styles.select} value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}>
              <option value="png">PNG (lossless)</option>
              <option value="jpeg">JPG (smaller)</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Quality</label>
            <select className={styles.select} value={scale}
              onChange={(e) => setScale(Number(e.target.value))}>
              <option value={1}>1× (72 DPI)</option>
              <option value={2}>2× (144 DPI) — Recommended</option>
              <option value={3}>3× (216 DPI) — High Quality</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.actionBar}>
        <button className={styles.resetButton} onClick={handleReset}>Change file</button>
        <button className="btn btn-primary btn-lg" onClick={handleConvert}>
          Convert {pageCount} Pages →
        </button>
      </div>
    </div>
  );
}
