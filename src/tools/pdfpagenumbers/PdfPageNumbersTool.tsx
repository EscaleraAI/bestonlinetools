'use client';

import { useState, useRef, useCallback } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import ToolSuccess from '@/components/ToolSuccess';
import ToolIcon from '@/components/ui/ToolIcon';
import styles from './PdfPageNumbersTool.module.css';

type NumberPosition = 'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center' | 'top-left' | 'top-right';
type NumberFormat = 'plain' | 'page-of' | 'dash' | 'roman';

export default function PdfPageNumbersTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [position, setPosition] = useState<NumberPosition>('bottom-center');
  const [format, setFormat] = useState<NumberFormat>('plain');
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(11);
  const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'done' | 'error'>('idle');
  const [statusText, setStatusText] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const toRoman = (n: number): string => {
    const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
    const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
    let result = '';
    for (let i = 0; i < vals.length; i++) {
      while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
    }
    return result.toLowerCase();
  };

  const formatPageNumber = (pageIdx: number, total: number): string => {
    const n = pageIdx + startNumber;
    switch (format) {
      case 'page-of': return `Page ${n} of ${total + startNumber - 1}`;
      case 'dash': return `— ${n} —`;
      case 'roman': return toRoman(n);
      case 'plain':
      default: return `${n}`;
    }
  };

  const handleApply = useCallback(async () => {
    if (!file) return;
    setStatus('processing');
    setStatusText('Adding page numbers...');
    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const total = pages.length;

      for (let i = 0; i < total; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const text = formatPageNumber(i, total);
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const margin = 36;

        let x: number;
        let y: number;

        const isTop = position.startsWith('top');
        y = isTop ? height - margin : margin;

        if (position.endsWith('left')) {
          x = margin;
        } else if (position.endsWith('right')) {
          x = width - textWidth - margin;
        } else {
          x = (width - textWidth) / 2;
        }

        page.drawText(text, {
          x, y,
          size: fontSize,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes) as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const outputFile = new File([blob], `numbered_${file.name}`, { type: 'application/pdf' });

      setResultUrl(url);
      setResultFile(outputFile);
      setStatus('done');
    } catch (err: unknown) {
      setStatus('error');
      setStatusText(err instanceof Error ? err.message : 'Failed to add page numbers');
    }
  }, [file, position, format, startNumber, fontSize]);

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

  if (status === 'done' && resultFile) {
    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.resultSummary}>
            <div className={styles.resultIcon}>✓</div>
            <h3>Page numbers added to {pageCount} pages</h3>
            <p>{formatSize(resultFile.size)}</p>
          </div>
          <ToolSuccess
            outputFiles={[resultFile]}
            sourceTool="pdf_page_numbers"
            onDownload={handleDownload}
            crossLinks={[]}
          />
          <button className={styles.resetButton} onClick={handleReset}>Number another PDF</button>
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
          <p className={styles.errorText}>Error: {statusText}</p>
          <button className={styles.resetButton} onClick={handleReset}>Try again</button>
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
          <span className={styles.dropzoneIcon}><ToolIcon name="hash" size={32} /></span>
          <p className={styles.dropzoneTitle}>Drop a PDF to add page numbers</p>
          <p className={styles.dropzoneSubtitle}>PDF files only</p>
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
              <span className={styles.fileMeta}>{pageCount} pages · {formatSize(file.size)}</span>
            </div>
          </div>

          <div className={styles.settingsPanel}>
            <h3 className={styles.settingsTitle}>Page Number Settings</h3>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Position</label>
                <select className={styles.select} value={position} onChange={(e) => setPosition(e.target.value as NumberPosition)}>
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Format</label>
                <select className={styles.select} value={format} onChange={(e) => setFormat(e.target.value as NumberFormat)}>
                  <option value="plain">1, 2, 3...</option>
                  <option value="page-of">Page 1 of 10</option>
                  <option value="dash">— 1 —</option>
                  <option value="roman">i, ii, iii...</option>
                </select>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Start Number</label>
                <input
                  type="number"
                  className={styles.input}
                  value={startNumber}
                  min={1}
                  onChange={(e) => setStartNumber(Number(e.target.value) || 1)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Font Size</label>
                <input
                  type="number"
                  className={styles.input}
                  value={fontSize}
                  min={6}
                  max={36}
                  onChange={(e) => setFontSize(Number(e.target.value) || 11)}
                />
              </div>
            </div>

            <div className={styles.preview}>
              Preview: {formatPageNumber(0, pageCount)} ... {formatPageNumber(pageCount - 1, pageCount)}
            </div>
          </div>

          <div className={styles.actionBar}>
            <button className={styles.resetButton} onClick={handleReset}>Change file</button>
            <button className="btn btn-primary btn-lg" onClick={handleApply}>
              Add Page Numbers →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
