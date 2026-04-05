'use client';

import { useState, useRef, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite';
import ToolSuccess from '@/components/ToolSuccess';
import ToolIcon from '@/components/ui/ToolIcon';
import styles from './PdfPasswordTool.module.css';

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PdfPasswordTool() {
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
      setStatusText('File too large (max 200MB)');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setStatusText('Reading PDF...');

    try {
      const buffer = await newFile.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setFile(newFile);
      setPageCount(doc.getPageCount());
      setStatus('idle');
      setStatusText('');
    } catch {
      setStatusText('Failed to read PDF — file may be corrupted');
      setStatus('error');
    }
  }, []);

  const handleProtect = useCallback(async () => {
    if (!file || !password) return;
    if (password !== confirmPassword) {
      setStatusText('Passwords do not match');
      setStatus('error');
      return;
    }
    if (password.length < 4) {
      setStatusText('Password must be at least 4 characters');
      setStatus('error');
      return;
    }

    setStatus('processing');
    setStatusText('Encrypting PDF...');

    try {
      const buffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(buffer);

      // Encrypt using pdf-encrypt-lite (works client-side)
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
      const message = err instanceof Error ? err.message : 'Encryption failed';
      setStatusText(message);
      setStatus('error');
    }
  }, [file, password, confirmPassword]);

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

  // Done state
  if (status === 'done' && resultFile) {
    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.resultIcon}><ToolIcon name="shield" size={28} /></div>
          <h3 className={styles.resultTitle}>PDF Protected Successfully</h3>
          <p className={styles.resultMeta}>
            {resultFile.name} · {formatSize(resultFile.size)}
          </p>

          <ToolSuccess
            outputFiles={[resultFile]}
            sourceTool="pdf_password"
            onDownload={handleDownload}
            crossLinks={[
              { icon: '📎', label: 'Merge PDFs', href: '/pdf/merge-pdf' },
              { icon: '✂️', label: 'Split PDF', href: '/pdf/split-pdf' },
            ]}
          />

          <button className={styles.resetButton} onClick={handleReset}>
            Protect another PDF
          </button>
        </div>
      </div>
    );
  }

  // Processing state
  if (status === 'processing') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSection}>
          <div className={styles.spinner} />
          <p className={styles.statusText}>{statusText}</p>
          <p className={styles.privacyNote}>
            <ToolIcon name="shield" size={14} /> All encryption happens locally — your PDF never leaves your device
          </p>
        </div>
      </div>
    );
  }

  // Idle — dropzone + password form
  return (
    <div className={styles.container}>
      {/* Privacy badge */}
      <div className={styles.privacyBadge}>
        <ToolIcon name="shield" size={14} /> Private — encryption happens in your browser
      </div>

      {!file ? (
        /* Dropzone */
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
            <p className={styles.dropzoneTitle}>Drop PDF to password-protect</p>
            <p className={styles.dropzoneSubtitle}>PDF • Max 200MB</p>
            <button className={styles.uploadButton}>Choose File</button>
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
        /* Password form */
        <>
          <div className={styles.fileCard}>
            <span className={styles.fileIcon}>📄</span>
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileMeta}>
                {formatSize(file.size)} · {pageCount} {pageCount === 1 ? 'page' : 'pages'}
              </span>
            </div>
            <button className={styles.removeButton} onClick={handleReset}>×</button>
          </div>

          <div className={styles.passwordForm}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (min 4 characters)"
                className={styles.passwordInput}
                autoFocus
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
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
              <ToolIcon name="lock" size={14} /> Protect PDF →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
