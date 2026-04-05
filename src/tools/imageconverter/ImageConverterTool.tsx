'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useFileStore, toHandoffFile, toFile } from '@/lib/useFileStore';
import ToolSuccess from '@/components/ToolSuccess';
import ToolIcon from '@/components/ui/ToolIcon';
import styles from './ImageConverterTool.module.css';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/bmp',
  'image/gif',
  'image/avif',
  'image/heic',
  'image/heif',
  'image/tiff',
];
const ACCEPT_STRING = ACCEPTED_TYPES.join(',') + ',.heic,.heif,.tiff,.tif,.avif';

type OutputFormat = 'jpeg' | 'png' | 'webp';

interface ConvertedImage {
  id: string;
  originalFile: File;
  originalSize: number;
  convertedBlob: Blob | null;
  convertedSize: number;
  thumbUrl: string;
  status: 'pending' | 'converting' | 'done' | 'error';
  error?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getMimeType(format: OutputFormat): string {
  switch (format) {
    case 'jpeg': return 'image/jpeg';
    case 'webp': return 'image/webp';
    case 'png': return 'image/png';
  }
}

function getExtension(format: OutputFormat): string {
  switch (format) {
    case 'jpeg': return '.jpg';
    case 'webp': return '.webp';
    case 'png': return '.png';
  }
}

function getFormatLabel(format: OutputFormat): string {
  switch (format) {
    case 'jpeg': return 'JPG';
    case 'webp': return 'WebP';
    case 'png': return 'PNG';
  }
}

export default function ImageConverterTool() {
  const [images, setImages] = useState<ConvertedImage[]>([]);
  const [quality, setQuality] = useState(92);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('jpeg');
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Hydrate handoff files on mount
  const { files: handoffFiles, hydrated, clearFiles } = useFileStore();
  useEffect(() => {
    if (hydrated && handoffFiles.length > 0) {
      const validFiles: File[] = [];
      for (const hf of handoffFiles) {
        if (ACCEPTED_TYPES.includes(hf.type)) {
          validFiles.push(toFile(hf));
        }
      }
      if (validFiles.length > 0) {
        addFiles(validFiles);
        clearFiles();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const addFiles = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter(
      (f) => f.size <= MAX_FILE_SIZE,
    );
    if (validFiles.length === 0) return;

    const entries: ConvertedImage[] = validFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      originalFile: file,
      originalSize: file.size,
      convertedBlob: null,
      convertedSize: 0,
      thumbUrl: URL.createObjectURL(file),
      status: 'pending',
    }));

    setImages((prev) => [...prev, ...entries]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.thumbUrl);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const convertImage = useCallback(
    (file: File, fmt: OutputFormat, q: number): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) {
            reject(new Error('Canvas not available'));
            return;
          }
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          // White background for JPEG (no alpha)
          if (fmt === 'jpeg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(img, 0, 0);

          const mimeType = getMimeType(fmt);
          const qualityParam = fmt === 'png' ? undefined : q / 100;

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Conversion failed'));
                return;
              }
              resolve(blob);
            },
            mimeType,
            qualityParam,
          );
        };
        img.onerror = () => reject(new Error('Failed to load image — format may not be supported by this browser'));
        img.src = URL.createObjectURL(file);
      });
    },
    [],
  );

  const handleConvert = useCallback(async () => {
    const pending = images.filter((i) => i.status === 'pending' || i.status === 'error');
    if (pending.length === 0) return;

    setStatus('processing');
    setProgress(0);

    let completed = 0;
    const total = pending.length;

    for (const img of pending) {
      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, status: 'converting' as const } : i)),
      );

      try {
        const blob = await convertImage(img.originalFile, outputFormat, quality);

        setImages((prev) =>
          prev.map((i) =>
            i.id === img.id
              ? {
                  ...i,
                  convertedBlob: blob,
                  convertedSize: blob.size,
                  status: 'done' as const,
                }
              : i,
          ),
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Conversion failed';
        setImages((prev) =>
          prev.map((i) =>
            i.id === img.id ? { ...i, status: 'error' as const, error: message } : i,
          ),
        );
      }

      completed++;
      setProgress(Math.round((completed / total) * 100));
    }

    setStatus('done');
  }, [images, quality, outputFormat, convertImage]);

  const handleDownloadAll = useCallback(() => {
    const done = images.filter((i) => i.status === 'done' && i.convertedBlob);
    for (const img of done) {
      if (!img.convertedBlob) continue;
      const ext = getExtension(outputFormat);
      const baseName = img.originalFile.name.replace(/\.[^.]+$/, '');
      const url = URL.createObjectURL(img.convertedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [images, outputFormat]);

  const handleReset = useCallback(() => {
    for (const img of images) {
      URL.revokeObjectURL(img.thumbUrl);
    }
    setImages([]);
    setStatus('idle');
    setProgress(0);
  }, [images]);

  // Computed
  const doneImages = images.filter((i) => i.status === 'done' && i.convertedBlob);
  const isLossy = outputFormat !== 'png';

  // --- RENDER ---

  // Done state
  if (status === 'done' && doneImages.length > 0) {
    const outputFiles = doneImages
      .filter((i): i is ConvertedImage & { convertedBlob: Blob } => i.convertedBlob !== null)
      .map((i) => {
        const ext = getExtension(outputFormat);
        const baseName = i.originalFile.name.replace(/\.[^.]+$/, '');
        return new File([i.convertedBlob], `${baseName}${ext}`, {
          type: getMimeType(outputFormat),
        });
      });

    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.resultSummary}>
            <div className={styles.resultIcon}>✓</div>
            <h3>
              {doneImages.length} {doneImages.length === 1 ? 'image' : 'images'} converted to {getFormatLabel(outputFormat)}
            </h3>
          </div>

          <ToolSuccess
            outputFiles={outputFiles}
            sourceTool="image_converter"
            onDownload={handleDownloadAll}
            crossLinks={[
              { icon: '🗜️', label: 'Compress images', href: '/image/compress-image' },
              { icon: '✨', label: 'Convert to SVG', href: '/image/png-to-svg' },
              { icon: '🪄', label: 'Remove background', href: '/image/remove-background' },
            ]}
          />

          <button className={styles.resetButton} onClick={handleReset}>
            Convert more images
          </button>
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  // Processing state
  if (status === 'processing') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSection}>
          <div className={styles.progressWrapper}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <p className={styles.statusText}>
              Converting {images.find((i) => i.status === 'converting')?.originalFile.name ?? '...'}
            </p>
            <p className={styles.privacyNote}>
              <ToolIcon name="shield" size={14} /> All processing happens locally — files never leave your device
            </p>
          </div>
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  // Idle — Dropzone + file list + controls
  return (
    <div className={styles.container}>
      {/* Privacy badge */}
      <div className={styles.privacyBadge}>
        <ToolIcon name="shield" size={14} /> Private — processing happens in your browser
      </div>

      {/* Dropzone */}
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(Array.from(e.dataTransfer.files));
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className={styles.dropzoneContent}>
          <span className={styles.dropzoneIcon}><ToolIcon name="arrow-left-right" size={32} /></span>
          <p className={styles.dropzoneTitle}>
            {images.length === 0 ? 'Drop images to convert' : 'Add more images'}
          </p>
          <p className={styles.dropzoneSubtitle}>
            HEIC, WebP, PNG, JPG, BMP, GIF, AVIF, TIFF • Max 100MB
          </p>
          <button className={styles.uploadButton}>Choose Files</button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_STRING}
          multiple
          onChange={(e) => {
            if (e.target.files) addFiles(Array.from(e.target.files));
            e.target.value = '';
          }}
          className={styles.hiddenInput}
        />
      </div>

      {/* Controls — shown when files are added */}
      {images.length > 0 && (
        <>
          <div className={styles.controlsPanel}>
            <div className={styles.controlGroup}>
              {/* Output Format */}
              <div className={styles.controlRow}>
                <span className={styles.controlLabel}>Convert to</span>
                <div className={styles.formatRow}>
                  {(['jpeg', 'png', 'webp'] as OutputFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      className={`${styles.formatButton} ${outputFormat === fmt ? styles.formatButtonActive : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOutputFormat(fmt);
                      }}
                    >
                      {getFormatLabel(fmt)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Slider — only for lossy formats */}
              {isLossy && (
                <div className={styles.controlRow}>
                  <span className={styles.controlLabel}>Quality</span>
                  <span className={styles.qualityValue}>{quality}%</span>
                </div>
              )}
              {isLossy && (
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className={styles.qualitySlider}
                />
              )}
            </div>
          </div>

          {/* File List */}
          <div className={styles.fileList}>
            {images.map((img) => (
              <div key={img.id} className={styles.fileItem}>
                <img
                  src={img.thumbUrl}
                  alt={img.originalFile.name}
                  className={styles.fileThumb}
                />
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{img.originalFile.name}</span>
                  <span className={styles.fileMeta}>
                    {formatSize(img.originalSize)} → {getFormatLabel(outputFormat)}
                  </span>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className={styles.actionBar}>
            <span className={styles.actionSummary}>
              {images.length} {images.length === 1 ? 'image' : 'images'} ·{' '}
              {formatSize(images.reduce((s, i) => s + i.originalSize, 0))}
            </span>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleConvert}
              disabled={images.length === 0}
            >
              Convert to {getFormatLabel(outputFormat)} →
            </button>
          </div>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
