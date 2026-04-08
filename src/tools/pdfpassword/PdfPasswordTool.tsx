'use client';

import { useState, useRef, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite';
import ToolSuccess from '@/components/ToolSuccess';
import ToolIcon from '@/components/ui/ToolIcon';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './PdfPasswordTool.module.css';

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PdfPasswordTool() {
  const { t, localizedHref } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'done' | 'error'>('idle');
  const [statusText, setStatusText] = useState('');
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (newFile: File) => {
    if (newFile.type !== 'application/pdf') return;
    if (newFile.size > MAX_FILE_SIZE) {
      setStatusText(t('pdfPassword.fileTooLarge'));
      setStatus('error');
      return;
    }

    setStatus('loading');
    setStatusText(t('pdfPassword.reading'));

    try {
      const buffer = await newFile.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setFile(newFile);
      setPageCount(doc.getPageCount());
      setStatus('idle');
      setStatusText('');
    } catch {
      setStatusText(t('pdfPassword.readError'));
      setStatus('error');
    }
  }, [t]);

  const handleProtect = useCallback(async () => {
    if (!file || !password) return;
    if (password !== confirmPassword) {
      setStatusText(t('pdfPassword.mismatch'));
      setStatus('error');
      return;
    }
    if (password.length < 4) {
      setStatusText(t('pdfPassword.tooShort'));
      setStatus('error');
      return;
    }

    setStatus('processing');
    setStatusText(t('pdfPassword.encrypting'));

    try {
      const buffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(buffer);

      const encryptedBytes = await encryptPDF(pdfBytes, password);

      const baseName = file.name.replace(/\.pdf$/i, '');
      const outputFile = new File(
        [new Uint8Array(encryptedBytes) as unknown as BlobPart],
        `${baseName}_protected.pdf`,
        { type: 'application/pdf' },
      );

      setResultFile(outputFile);
      setStatus('done');
      setStatusText('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('pdfPassword.encryptError');
      setStatusText(message);
      setStatus('error');
    }
  }, [file, password, confirmPassword, t]);

  const handleDownload = useCallback(() => {
    if (!resultFile) return;
    const url = URL.createObjectURL(resultFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = resultFile.name;
    a.click();
    URL.revokeObjectURL(url);
  }, [resultFile]);

  const handleReset = useCallback(() => {
    setFile(null);
    setPageCount(null);
    setPassword('');
    setConfirmPassword('');
    setResultFile(null);
    setStatus('idle');
    setStatusText('');
  }, []);

  // --- RENDER ---

  if (status === 'done' && resultFile) {
    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.resultIcon}><ToolIcon name="shield" size={28} /></div>
          <h3 className={styles.resultTitle}>{t('pdfPassword.success')}</h3>
          <p className={styles.resultMeta}>
            {resultFile.name} · {formatSize(resultFile.size)}
          </p>

          <ToolSuccess
            outputFiles={[resultFile]}
            sourceTool="pdf_password"
            onDownload={handleDownload}
            crossLinks={[
              { icon: '📎', label: t('pdfPassword.mergeLink'), href: localizedHref('/pdf/merge-pdf') },
              { icon: '✂️', label: t('pdfPassword.splitLink'), href: localizedHref('/pdf/split-pdf') },
            ]}
          />

          <button className={styles.resetButton} onClick={handleReset}>
            {t('pdfPassword.protectAnother')}
          </button>
        </div>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSection}>
          <div className={styles.spinner} />
          <p className={styles.statusText}>{statusText}</p>
          <p className={styles.privacyNote}>
            <ToolIcon name="shield" size={14} /> {t('pdfPassword.privacyNote')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.privacyBadge}>
        <ToolIcon name="shield" size={14} /> {t('pdfPassword.privacyBadge')}
      </div>

      {!file ? (
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
            const f = e.dataTransfer.files[0];
            if (f) loadFile(f);
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className={styles.dropzoneContent}>
            <span className={styles.dropzoneIcon}><ToolIcon name="lock" size={32} /></span>
            <p className={styles.dropzoneTitle}>{t('pdfPassword.dropTitle')}</p>
            <p className={styles.dropzoneSubtitle}>{t('pdfPassword.dropSubtitle')}</p>
            <button className={styles.uploadButton}>{t('pdfPassword.chooseFile')}</button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) loadFile(f);
              e.target.value = '';
            }}
            className={styles.hiddenInput}
          />
        </div>
      ) : (
        <>
          <div className={styles.fileCard}>
            <span className={styles.fileIcon}>📄</span>
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileMeta}>
                {formatSize(file.size)} · {pageCount === 1
                  ? t('pdfPassword.page', { count: String(pageCount) })
                  : t('pdfPassword.pages', { count: String(pageCount) })}
              </span>
            </div>
            <button className={styles.removeButton} onClick={handleReset}>×</button>
          </div>

          <div className={styles.passwordForm}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>{t('pdfPassword.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('pdfPassword.passwordPlaceholder')}
                className={styles.passwordInput}
                autoFocus
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>{t('pdfPassword.confirmPassword')}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('pdfPassword.confirmPlaceholder')}
                className={styles.passwordInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleProtect();
                }}
              />
            </div>

            {status === 'error' && statusText && (
              <p className={styles.errorText}>{statusText}</p>
            )}

            <button
              className="btn btn-primary btn-lg"
              onClick={handleProtect}
              disabled={!password || !confirmPassword || status === 'loading'}
              style={{ width: '100%' }}
            >
              <ToolIcon name="lock" size={14} /> {t('pdfPassword.protectButton')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
