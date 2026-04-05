'use client';

import { useState, useRef, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolSuccess from '@/components/ToolSuccess';
import ToolIcon from '@/components/ui/ToolIcon';
import styles from './SignPdfTool.module.css';

export default function SignPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [signaturePng, setSignaturePng] = useState<string | null>(null);
  const [signPage, setSignPage] = useState(1);
  const [signX, setSignX] = useState(50); // percentage
  const [signY, setSignY] = useState(85); // percentage from top
  const [signScale, setSignScale] = useState(30); // percentage of page width
  const [isDrawing, setIsDrawing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'done' | 'error'>('idle');
  const [statusText, setStatusText] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const handleFileSelect = useCallback(async (files: FileList | File[]) => {
    const pdfFile = Array.from(files).find(f => f.type === 'application/pdf');
    if (!pdfFile) return;
    setStatus('loading');
    try {
      const buffer = await pdfFile.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
      setFile(pdfFile);
      setStatus('idle');
    } catch {
      setStatus('error');
      setStatusText('Failed to read PDF.');
    }
  }, []);

  // Canvas drawing for signature
  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    lastPosRef.current = getCanvasPos(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !lastPosRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const pos = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPosRef.current = pos;
  };

  const endDraw = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
    if (canvasRef.current) {
      setSignaturePng(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignaturePng(null);
  };

  const handleApply = useCallback(async () => {
    if (!file || !signaturePng) return;
    setStatus('processing');
    setStatusText('Adding signature...');
    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Convert signature canvas to PNG bytes
      const sigResponse = await fetch(signaturePng);
      const sigBytes = new Uint8Array(await sigResponse.arrayBuffer());
      const sigImage = await pdfDoc.embedPng(sigBytes);

      const targetPage = pdfDoc.getPage(signPage - 1);
      const { width, height } = targetPage.getSize();

      const sigWidth = width * (signScale / 100);
      const sigHeight = sigWidth * (sigImage.height / sigImage.width);
      const x = width * (signX / 100) - sigWidth / 2;
      const y = height * (1 - signY / 100) - sigHeight / 2;

      targetPage.drawImage(sigImage, {
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: sigWidth,
        height: sigHeight,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes) as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const outputFile = new File([blob], `signed_${file.name}`, { type: 'application/pdf' });

      setResultUrl(url);
      setResultFile(outputFile);
      setStatus('done');
    } catch (err: unknown) {
      setStatus('error');
      setStatusText(err instanceof Error ? err.message : 'Failed to sign PDF');
    }
  }, [file, signaturePng, signPage, signX, signY, signScale]);

  const handleDownload = useCallback(() => {
    if (!resultUrl || !resultFile) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = resultFile.name;
    a.click();
  }, [resultUrl, resultFile]);

  const handleReset = useCallback(() => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null); setPageCount(0);
    setSignaturePng(null);
    setResultUrl(null); setResultFile(null);
    setStatus('idle'); setStatusText('');
    clearSignature();
  }, [resultUrl]);

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
            <h3>PDF signed successfully</h3>
            <p>{formatSize(resultFile.size)}</p>
          </div>
          <ToolSuccess outputFiles={[resultFile]} sourceTool="sign_pdf" onDownload={handleDownload} crossLinks={[]} />
          <button className={styles.resetButton} onClick={handleReset}>Sign another PDF</button>
        </div>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSection}><p className={styles.statusText}>{statusText}</p></div>
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
          <span className={styles.dropzoneIcon}><ToolIcon name="pen-tool" size={32} /></span>
          <p className={styles.dropzoneTitle}>Drop a PDF to sign</p>
          <p className={styles.dropzoneSubtitle}>PDF files only</p>
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

      {/* Signature pad */}
      <div className={styles.signatureSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.settingsTitle}>Draw Your Signature</h3>
          <button className={styles.clearBtn} onClick={clearSignature}>Clear</button>
        </div>
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className={styles.signatureCanvas}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </div>

      {/* Placement settings */}
      <div className={styles.settingsPanel}>
        <h3 className={styles.settingsTitle}>Placement</h3>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>Page</label>
            <input type="number" className={styles.input} value={signPage} min={1} max={pageCount}
              onChange={(e) => setSignPage(Math.min(Number(e.target.value) || 1, pageCount))} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Size ({signScale}% of page)</label>
            <input type="range" className={styles.range} min={10} max={80} value={signScale}
              onChange={(e) => setSignScale(Number(e.target.value))} />
          </div>
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>Horizontal ({signX}%)</label>
            <input type="range" className={styles.range} min={10} max={90} value={signX}
              onChange={(e) => setSignX(Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Vertical ({signY}%)</label>
            <input type="range" className={styles.range} min={10} max={95} value={signY}
              onChange={(e) => setSignY(Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div className={styles.actionBar}>
        <button className={styles.resetButton} onClick={handleReset}>Change file</button>
        <button className="btn btn-primary btn-lg" onClick={handleApply} disabled={!signaturePng}>
          Sign PDF →
        </button>
      </div>
    </div>
  );
}
