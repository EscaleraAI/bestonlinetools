'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useFileStore, toFile } from '@/lib/useFileStore';
import { processToColoringPage } from './imageProcessing';
import ToolSuccess from '@/components/ToolSuccess';
import ToolIcon from '@/components/ui/ToolIcon';
import styles from './ColoringPageTool.module.css';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/bmp'];

export default function ColoringPageTool() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'preview' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Adjustable parameters
  const [sensitivity, setSensitivity] = useState(50);
  const [lineThickness, setLineThickness] = useState(2);
  const [blurRadius, setBlurRadius] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Hydrate handoff files on mount
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

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [originalUrl, resultUrl]);

  const loadImageToCanvas = useCallback(
    (file: File): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = sourceCanvasRef.current;
          if (!canvas) {
            reject(new Error('Canvas not available'));
            return;
          }
          // Cap at 2000px to keep processing fast
          const maxDim = 2000;
          let w = img.naturalWidth;
          let h = img.naturalHeight;
          if (w > maxDim || h > maxDim) {
            const scale = maxDim / Math.max(w, h);
            w = Math.round(w * scale);
            h = Math.round(h * scale);
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, w, h);
          URL.revokeObjectURL(img.src);
          resolve();
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
      });
    },
    [],
  );

  const runProcessing = useCallback(() => {
    const source = sourceCanvasRef.current;
    const output = previewCanvasRef.current || outputCanvasRef.current;
    if (!source || !output) return;

    processToColoringPage(source, output, {
      sensitivity,
      lineThickness,
      blurRadius,
      invert: true,
    });
  }, [sensitivity, lineThickness, blurRadius]);

  const handleFile = useCallback(
    async (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Please upload a PNG, JPG, WebP, or BMP image.');
        setStatus('error');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError('File too large. Maximum size is 25MB.');
        setStatus('error');
        return;
      }

      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);

      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setResultUrl(null);
      setResultFile(null);
      setStatus('processing');
      setError(null);

      try {
        await loadImageToCanvas(file);
        setStatus('preview');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Processing failed';
        setError(message);
        setStatus('error');
      }
    },
    [loadImageToCanvas, originalUrl, resultUrl],
  );

  // Re-process when parameters change in preview mode
  useEffect(() => {
    if (status === 'preview') {
      // Use requestAnimationFrame to avoid blocking UI during slider drags
      const id = requestAnimationFrame(() => {
        runProcessing();
      });
      return () => cancelAnimationFrame(id);
    }
  }, [status, runProcessing]);

  const handleGenerate = useCallback(() => {
    const output = previewCanvasRef.current;
    if (!output) return;

    output.toBlob((blob) => {
      if (!blob) {
        setError('Failed to generate coloring page');
        setStatus('error');
        return;
      }
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      const baseName = originalFile
        ? originalFile.name.replace(/\.[^.]+$/, '')
        : 'coloring_page';
      setResultFile(
        new File([blob], `${baseName}_coloring.png`, { type: 'image/png' }),
      );
      setStatus('done');
    }, 'image/png');
  }, [originalFile]);

  const handleDownload = useCallback(() => {
    if (!resultUrl || !resultFile) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = resultFile.name;
    a.click();
  }, [resultUrl, resultFile]);

  const handleReset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setOriginalFile(null);
    setOriginalUrl(null);
    setResultUrl(null);
    setResultFile(null);
    setSensitivity(50);
    setLineThickness(2);
    setBlurRadius(1);
    setStatus('idle');
    setError(null);
  }, [originalUrl, resultUrl]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  // --- RENDER ---

  // Done — show result with ToolSuccess
  if (status === 'done' && resultUrl && resultFile) {
    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.resultPreview}>
            <img
              src={resultUrl}
              alt="Coloring page result"
              className={styles.resultImage}
            />
          </div>

          <ToolSuccess
            outputFiles={[resultFile]}
            sourceTool="coloring_page"
            onDownload={handleDownload}
            crossLinks={[
              { icon: '✨', label: 'Convert to SVG', href: '/image/png-to-svg' },
              { icon: '🖼️', label: 'Remove background', href: '/image/remove-background' },
              { icon: '🗜️', label: 'Compress image', href: '/image/compress-image' },
            ]}
          />

          <button className={styles.resetButton} onClick={handleReset}>
            Create another coloring page
          </button>
        </div>
        {/* Hidden canvases */}
        <canvas ref={sourceCanvasRef} style={{ display: 'none' }} />
        <canvas ref={outputCanvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  // Preview — show original + processed side by side with controls
  if (status === 'preview' && originalUrl) {
    return (
      <div className={styles.container}>
        {/* Controls */}
        <div className={styles.controlsPanel}>
          <div className={styles.controlGroup}>
            <div className={styles.controlRow}>
              <span className={styles.controlLabel}>Edge Sensitivity</span>
              <span className={styles.controlValue}>{sensitivity}</span>
            </div>
            <input
              type="range"
              min={10}
              max={95}
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlRow}>
              <span className={styles.controlLabel}>Line Thickness</span>
              <span className={styles.controlValue}>{lineThickness}</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={lineThickness}
              onChange={(e) => setLineThickness(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlRow}>
              <span className={styles.controlLabel}>Smoothing</span>
              <span className={styles.controlValue}>{blurRadius}</span>
            </div>
            <input
              type="range"
              min={0}
              max={4}
              value={blurRadius}
              onChange={(e) => setBlurRadius(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
        </div>

        {/* Side-by-side preview */}
        <div className={styles.previewSection}>
          <div className={styles.previewGrid}>
            <div className={styles.previewCard}>
              <span className={styles.previewLabel}>Original</span>
              <img
                src={originalUrl}
                alt="Original image"
                className={styles.previewImage}
              />
            </div>
            <div className={styles.previewCard}>
              <span className={styles.previewLabel}>Coloring Page</span>
              <canvas ref={previewCanvasRef} className={styles.previewCanvas} />
            </div>
          </div>

          {/* Action Bar */}
          <div className={styles.actionBar}>
            <span className={styles.actionInfo}>
              Adjust sliders to fine-tune the result
            </span>
            <button className="btn btn-primary btn-lg" onClick={handleGenerate}>
              Download Coloring Page →
            </button>
          </div>

          <button className={styles.resetButton} onClick={handleReset}>
            Start over
          </button>
        </div>

        {/* Hidden canvases */}
        <canvas ref={sourceCanvasRef} style={{ display: 'none' }} />
        <canvas ref={outputCanvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  // Processing
  if (status === 'processing') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSection}>
          <div className={styles.progressWrapper}>
            <p className={styles.statusText}>Processing image...</p>
            <p className={styles.privacyNote}>
              <ToolIcon name="shield" size={14} /> All processing happens locally — files never leave your device
            </p>
          </div>
        </div>
        <canvas ref={sourceCanvasRef} style={{ display: 'none' }} />
        <canvas ref={outputCanvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  // Error
  if (status === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.errorSection}>
          <p className={styles.errorText}>❌ {error}</p>
          <button className={styles.resetButton} onClick={handleReset}>
            Try again
          </button>
        </div>
        <canvas ref={sourceCanvasRef} style={{ display: 'none' }} />
        <canvas ref={outputCanvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  // Idle — Drop zone
  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className={styles.dropzoneContent}>
          <span className={styles.dropzoneIcon}><ToolIcon name="paintbrush" size={32} /></span>
          <p className={styles.dropzoneTitle}>Drop photo to create coloring page</p>
          <p className={styles.dropzoneSubtitle}>PNG, JPG, WebP, BMP • Max 25MB</p>
          <button className={styles.uploadButton}>Choose File</button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className={styles.hiddenInput}
        />
      </div>
      <canvas ref={sourceCanvasRef} style={{ display: 'none' }} />
      <canvas ref={outputCanvasRef} style={{ display: 'none' }} />
    </div>
  );
}
