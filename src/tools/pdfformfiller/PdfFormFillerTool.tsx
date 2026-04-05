'use client';

import { useState, useRef, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolSuccess from '@/components/ToolSuccess';
import ToolIcon from '@/components/ui/ToolIcon';
import styles from './PdfFormFillerTool.module.css';

interface FormField {
  name: string;
  type: 'text' | 'checkbox' | 'dropdown' | 'radio' | 'other';
  value: string;
  options?: string[];
}

export default function PdfFormFillerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [fields, setFields] = useState<FormField[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'done' | 'error'>('idle');
  const [statusText, setStatusText] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (files: FileList | File[]) => {
    const pdfFile = Array.from(files).find(f => f.type === 'application/pdf');
    if (!pdfFile) return;
    setStatus('loading');
    setStatusText('Analyzing PDF form fields...');
    try {
      const buffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(pdfDoc.getPageCount());

      const form = pdfDoc.getForm();
      const pdfFields = form.getFields();

      const detected: FormField[] = pdfFields.map(f => {
        const name = f.getName();
        const typeName = f.constructor.name;

        if (typeName === 'PDFTextField') {
          const tf = form.getTextField(name);
          return { name, type: 'text' as const, value: tf.getText() || '' };
        }
        if (typeName === 'PDFCheckBox') {
          const cb = form.getCheckBox(name);
          return { name, type: 'checkbox' as const, value: cb.isChecked() ? 'true' : 'false' };
        }
        if (typeName === 'PDFDropdown') {
          const dd = form.getDropdown(name);
          const options = dd.getOptions();
          return { name, type: 'dropdown' as const, value: dd.getSelected()?.[0] || '', options };
        }
        if (typeName === 'PDFRadioGroup') {
          const rg = form.getRadioGroup(name);
          const options = rg.getOptions();
          return { name, type: 'radio' as const, value: rg.getSelected() || '', options };
        }
        return { name, type: 'other' as const, value: '' };
      }).filter(f => f.type !== 'other');

      if (detected.length === 0) {
        setStatus('error');
        setStatusText('No fillable form fields detected in this PDF. This tool works with PDFs that have interactive form fields.');
        return;
      }

      setFields(detected);
      setFile(pdfFile);
      setStatus('idle');
    } catch {
      setStatus('error');
      setStatusText('Failed to read PDF or detect form fields.');
    }
  }, []);

  const updateField = (index: number, value: string) => {
    setFields(prev => prev.map((f, i) => i === index ? { ...f, value } : f));
  };

  const handleFill = useCallback(async () => {
    if (!file) return;
    setStatus('processing');
    setStatusText('Filling form fields...');
    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const form = pdfDoc.getForm();

      for (const field of fields) {
        try {
          if (field.type === 'text') {
            form.getTextField(field.name).setText(field.value);
          } else if (field.type === 'checkbox') {
            const cb = form.getCheckBox(field.name);
            if (field.value === 'true') cb.check(); else cb.uncheck();
          } else if (field.type === 'dropdown') {
            form.getDropdown(field.name).select(field.value);
          } else if (field.type === 'radio') {
            form.getRadioGroup(field.name).select(field.value);
          }
        } catch {
          // Skip fields that can't be set
        }
      }

      form.flatten();
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes) as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const outputFile = new File([blob], `filled_${file.name}`, { type: 'application/pdf' });

      setResultUrl(url);
      setResultFile(outputFile);
      setStatus('done');
    } catch (err: unknown) {
      setStatus('error');
      setStatusText(err instanceof Error ? err.message : 'Failed to fill form');
    }
  }, [file, fields]);

  const handleDownload = useCallback(() => {
    if (!resultUrl || !resultFile) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = resultFile.name;
    a.click();
  }, [resultUrl, resultFile]);

  const handleReset = useCallback(() => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null); setPageCount(0); setFields([]);
    setResultUrl(null); setResultFile(null);
    setStatus('idle'); setStatusText('');
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
            <h3>{fields.length} fields filled</h3>
            <p>{formatSize(resultFile.size)}</p>
          </div>
          <ToolSuccess outputFiles={[resultFile]} sourceTool="pdf_form_filler" onDownload={handleDownload} crossLinks={[]} />
          <button className={styles.resetButton} onClick={handleReset}>Fill another PDF</button>
        </div>
      </div>
    );
  }

  if (status === 'processing' || status === 'loading') {
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
          <p className={styles.errorText}>{statusText}</p>
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
          <span className={styles.dropzoneIcon}><ToolIcon name="clipboard-list" size={32} /></span>
          <p className={styles.dropzoneTitle}>Drop a PDF form to fill</p>
          <p className={styles.dropzoneSubtitle}>Works with PDFs that have fillable form fields</p>
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
          <span className={styles.fileMeta}>{pageCount} pages · {fields.length} fields · {formatSize(file.size)}</span>
        </div>
      </div>

      <div className={styles.fieldsList}>
        <h3 className={styles.settingsTitle}>Form Fields ({fields.length})</h3>
        {fields.map((field, i) => (
          <div key={field.name} className={styles.formField}>
            <label className={styles.fieldLabel}>
              <span className={styles.fieldName}>{field.name}</span>
              <span className={styles.fieldType}>{field.type}</span>
            </label>
            {field.type === 'text' && (
              <input className={styles.input} value={field.value}
                onChange={(e) => updateField(i, e.target.value)}
                placeholder={`Enter ${field.name}`} />
            )}
            {field.type === 'checkbox' && (
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={field.value === 'true'}
                  onChange={(e) => updateField(i, e.target.checked ? 'true' : 'false')} />
                <span>Checked</span>
              </label>
            )}
            {(field.type === 'dropdown' || field.type === 'radio') && field.options && (
              <select className={styles.select} value={field.value}
                onChange={(e) => updateField(i, e.target.value)}>
                <option value="">— Select —</option>
                {field.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            )}
          </div>
        ))}
      </div>

      <div className={styles.actionBar}>
        <button className={styles.resetButton} onClick={handleReset}>Change file</button>
        <button className="btn btn-primary btn-lg" onClick={handleFill}>
          Fill & Download →
        </button>
      </div>
    </div>
  );
}
