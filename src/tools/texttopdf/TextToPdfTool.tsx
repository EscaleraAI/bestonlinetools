'use client';

import { useState, useCallback } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import ToolSuccess from '@/components/ToolSuccess';
import styles from './TextToPdfTool.module.css';

export default function TextToPdfTool() {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(12);
  const [fontFamily, setFontFamily] = useState<'Helvetica' | 'TimesRoman' | 'Courier'>('Helvetica');
  const [status, setStatus] = useState<'idle' | 'done'>('idle');
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const FONT_MAP = {
    Helvetica: StandardFonts.Helvetica,
    TimesRoman: StandardFonts.TimesRoman,
    Courier: StandardFonts.Courier,
  };

  const handleConvert = useCallback(async () => {
    if (!text.trim()) return;
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(FONT_MAP[fontFamily]);

    const margin = 50;
    const pageWidth = 595; // A4
    const pageHeight = 842;
    const lineHeight = fontSize * 1.4;
    const maxWidth = pageWidth - margin * 2;

    // Word-wrap text into lines
    const lines: string[] = [];
    for (const paragraph of text.split('\n')) {
      if (paragraph.trim() === '') { lines.push(''); continue; }
      const words = paragraph.split(/\s+/);
      let currentLine = '';
      for (const word of words) {
        const test = currentLine ? `${currentLine} ${word}` : word;
        if (font.widthOfTextAtSize(test, fontSize) <= maxWidth) {
          currentLine = test;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
    }

    // Paginate
    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    for (const line of lines) {
      if (y < margin + lineHeight) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      if (line) {
        page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
      }
      y -= lineHeight;
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes) as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const outFile = new File([blob], 'text-output.pdf', { type: 'application/pdf' });

    setResultUrl(url);
    setResultFile(outFile);
    setStatus('done');
  }, [text, fontSize, fontFamily]);

  const handleDownload = useCallback(() => {
    if (!resultUrl || !resultFile) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = resultFile.name;
    a.click();
  }, [resultUrl, resultFile]);

  const handleReset = useCallback(() => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setStatus('idle'); setResultFile(null); setResultUrl(null);
  }, [resultUrl]);

  if (status === 'done' && resultFile) {
    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.resultIcon}>✓</div>
          <h3>PDF created successfully</h3>
          <ToolSuccess outputFiles={[resultFile]} sourceTool="text_to_pdf" onDownload={handleDownload} crossLinks={[]} />
          <button className={styles.resetBtn} onClick={handleReset}>Convert more text</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <textarea
        className={styles.textArea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={12}
      />
      <div className={styles.controls}>
        <div className={styles.field}>
          <label className={styles.label}>Font</label>
          <select className={styles.select} value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value as 'Helvetica' | 'TimesRoman' | 'Courier')}>
            <option value="Helvetica">Helvetica</option>
            <option value="TimesRoman">Times Roman</option>
            <option value="Courier">Courier (Monospace)</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Size</label>
          <select className={styles.select} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}>
            <option value={10}>10pt</option>
            <option value={12}>12pt</option>
            <option value={14}>14pt</option>
            <option value={16}>16pt</option>
            <option value={18}>18pt</option>
          </select>
        </div>
        <button className="btn btn-primary btn-lg" onClick={handleConvert} disabled={!text.trim()}>
          Convert to PDF →
        </button>
      </div>
    </div>
  );
}
