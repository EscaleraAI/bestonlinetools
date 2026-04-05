'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useFileStore, toHandoffFile, toFile } from '@/lib/useFileStore';
import ToolSuccess from '@/components/ToolSuccess';
import ToolIcon from '@/components/ui/ToolIcon';
import styles from './ImageCompressorTool.module.css';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

type OutputFormat = 'jpeg' | 'webp' | 'png';

interface CompressedImage {
  id: string;
  originalFile: File;
  originalSize: number;
  compressedBlob: Blob | null;
  compressedSize: number;
  thumbUrl: string;
  status: 'pending' | 'compressing' | 'done' | 'error';
  error?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getReductionPercent(original: number, compressed: number): number {
  if (original === 0) return 0;
  return Math.round(((original - compressed) / original) * 100);
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

export default function ImageCompressorTool() {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState(80);
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
      (f) => ACCEPTED_TYPES.includes(f.type) && f.size <= MAX_FILE_SIZE,
    );
    if (validFiles.length === 0) return;

    const entries: CompressedImage[] = validFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      originalFile: file,
      originalSize: file.size,
      compressedBlob: null,
      compressedSize: 0,
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

  const compressImage = useCallback(
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

          // Clear and draw
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);

          const mimeType = getMimeType(fmt);
          // Quality parameter: 0-1 for JPEG/WebP, ignored for PNG
          const qualityParam = fmt === 'png' ? undefined : q / 100;

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Compression failed'));
                return;
              }
              resolve(blob);
            },
            mimeType,
            qualityParam,
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
      });
    },
    [],
  );

  const handleCompress = useCallback(async () => {
    const pending = images.filter((i) => i.status === 'pending' || i.status === 'error');
    if (pending.length === 0) return;

    setStatus('processing');
    setProgress(0);

    let completed = 0;
    const total = pending.length;

    for (const img of pending) {
      // Mark as compressing
      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, status: 'compressing' as const } : i)),
      );

      try {
        const blob = await compressImage(img.originalFile, outputFormat, quality);

        setImages((prev) =>
          prev.map((i) =>
            i.id === img.id
              ? {
                  ...i,
                  compressedBlob: blob,
                  compressedSize: blob.size,
                  status: 'done' as const,
                }
              : i,
          ),
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Compression failed';
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
  }, [images, quality, outputFormat, compressImage]);

  const handleDownloadAll = useCallback(() => {
    const done = images.filter((i) => i.status === 'done' && i.compressedBlob);
    for (const img of done) {
      if (!img.compressedBlob) continue;
      const ext = getExtension(outputFormat);
      const baseName = img.originalFile.name.replace(/\.[^.]+$/, '');
      const url = URL.createObjectURL(img.compressedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}_compressed${ext}`;
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

  // Compute aggregates
  const doneImages = images.filter((i) => i.status === 'done' && i.compressedBlob);
  const totalOriginal = doneImages.reduce((s, i) => s + i.originalSize, 0);
  const totalCompressed = doneImages.reduce((s, i) => s + i.compressedSize, 0);
  const totalReduction = getReductionPercent(totalOriginal, totalCompressed);

  // --- RENDER ---

  // Done state — all images processed
  if (status === 'done' && doneImages.length > 0) {
    const outputFiles = doneImages
      .filter((i): i is CompressedImage & { compressedBlob: Blob } => i.compressedBlob !== null)
      .map((i) => {
        const ext = getExtension(outputFormat);
        const baseName = i.originalFile.name.replace(/\.[^.]+$/, '');
        return new File([i.compressedBlob], `${baseName}_compressed${ext}`, {
          type: getMimeType(outputFormat),
        });
      });

    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.resultSummary}>
            <div className={styles.resultIcon}>✓</div>
            <h3>
              {doneImages.length} {doneImages.length === 1 ? 'image' : 'images'} compressed
            </h3>
            <div className={styles.resultStats}>
              <div className={styles.resultStat}>
                <span className={styles.resultStatValue}>{formatSize(totalOriginal)}</span>
                <span className={styles.resultStatLabel}>Original</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultStatValue}>{formatSize(totalCompressed)}</span>
                <span className={styles.resultStatLabel}>Compressed</span>
              </div>
              <div className={styles.resultStat}>
                <span className={`${styles.resultStatValue} ${styles.resultStatAccent}`}>
                  {totalReduction}%
                </span>
                <span className={styles.resultStatLabel}>Saved</span>
              </div>
            </div>
          </div>

          <ToolSuccess
            outputFiles={outputFiles}
            sourceTool="image_compressor"
            onDownload={handleDownloadAll}
            crossLinks={[
              { icon: '✨', label: 'Convert to SVG', href: '/image/png-to-svg' },
              { icon: '🖼️', label: 'Remove background', href: '/image/remove-background' },
            ]}
          />

          <button className={styles.resetButton} onClick={handleReset}>
            Compress more images
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
              Compressing {images.filter((i) => i.status === 'compressing').length > 0
                ? images.find((i) => i.status === 'compressing')?.originalFile.name
                : '...'
              }
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
          <span className={styles.dropzoneIcon}><ToolIcon name="image-down" size={32} /></span>
          <p className={styles.dropzoneTitle}>
            {images.length === 0 ? 'Drop images to compress' : 'Add more images'}
          </p>
          <p className={styles.dropzoneSubtitle}>PNG, JPG, WebP • Max 50MB each</p>
          <button className={styles.uploadButton}>Choose Files</button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          multiple
          onChange={(e) => {
            if (e.target.files) addFiles(Array.from(e.target.files));
            e.target.value = '';
          }}
          className={styles.hiddenInput}
        />
      </div>

      {/* Controls — shown when files are present */}
      {images.length > 0 && (
        <>
          <div className={styles.controlsPanel}>
            <div className={styles.controlGroup}>
              {/* Quality Slider */}
              <div className={styles.controlRow}>
                <span className={styles.controlLabel}>Quality</span>
                <span className={styles.qualityValue}>{quality}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className={styles.qualitySlider}
              />

              {/* Output Format */}
              <div className={styles.controlRow}>
                <span className={styles.controlLabel}>Output Format</span>
                <div className={styles.formatRow}>
                  {(['jpeg', 'webp', 'png'] as OutputFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      className={`${styles.formatButton} ${outputFormat === fmt ? styles.formatButtonActive : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOutputFormat(fmt);
                      }}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* File List */}
          <div className={styles.fileList}>
            {images.map((img) => {
              const reduction =
                img.status === 'done'
                  ? getReductionPercent(img.originalSize, img.compressedSize)
                  : null;

              return (
                <div key={img.id} className={styles.fileItem}>
                  <img
                    src={img.thumbUrl}
                    alt={img.originalFile.name}
                    className={styles.fileThumb}
                  />
                  <div className={styles.fileInfo}>
                    <span className={styles.fileName}>{img.originalFile.name}</span>
                    <span className={styles.fileMeta}>
                      {formatSize(img.originalSize)}
                      {img.status === 'done' && ` → ${formatSize(img.compressedSize)}`}
                    </span>
                  </div>
                  {reduction !== null && (
                    <span
                      className={`${styles.sizeReduction} ${
                        reduction > 50
                          ? styles.sizeGreat
                          : reduction > 0
                            ? styles.sizeGood
                            : styles.sizeNone
                      }`}
                    >
                      {reduction > 0 ? `−${reduction}%` : 'Same'}
                    </span>
                  )}
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
              );
            })}
          </div>

          {/* Action Bar */}
          <div className={styles.actionBar}>
            <span className={styles.actionSummary}>
              {images.length} {images.length === 1 ? 'image' : 'images'} ·{' '}
              {formatSize(images.reduce((s, i) => s + i.originalSize, 0))}
            </span>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleCompress}
              disabled={images.length === 0}
            >
              Compress {images.length} {images.length === 1 ? 'Image' : 'Images'} →
            </button>
          </div>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
