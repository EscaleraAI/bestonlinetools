'use client';

import { useState, useRef, useCallback } from 'react';
import ToolIcon from '@/components/ui/ToolIcon';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './ImageBase64Tool.module.css';

type Mode = 'encode' | 'decode';

export default function ImageBase64Tool() {
  const { t } = useLocale();
  const [mode, setMode] = useState<Mode>('encode');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [base64, setBase64] = useState('');
  const [copied, setCopied] = useState(false);
  const [decodeInput, setDecodeInput] = useState('');
  const [decodedPreview, setDecodedPreview] = useState<string | null>(null);
  const [decodeError, setDecodeError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (files: FileList | File[]) => {
    const imgFile = Array.from(files).find(f => f.type.startsWith('image/'));
    if (!imgFile) return;
    const url = URL.createObjectURL(imgFile);
    setPreview(url); setFile(imgFile);
    const reader = new FileReader();
    reader.onload = () => { setBase64(reader.result as string); };
    reader.readAsDataURL(imgFile);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(base64);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }, [base64]);

  const handleCopyRaw = useCallback(() => {
    const raw = base64.replace(/^data:[^;]+;base64,/, '');
    navigator.clipboard.writeText(raw);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }, [base64]);

  const handleDecode = useCallback(() => {
    setDecodeError('');
    try {
      let src = decodeInput.trim();
      if (!src.startsWith('data:')) src = `data:image/png;base64,${src}`;
      const raw = src.replace(/^data:[^;]+;base64,/, '');
      atob(raw);
      setDecodedPreview(src);
    } catch {
      setDecodeError(t('imageBase64.decodeError'));
      setDecodedPreview(null);
    }
  }, [decodeInput, t]);

  const handleDownloadDecoded = useCallback(() => {
    if (!decodedPreview) return;
    const a = document.createElement('a');
    a.href = decodedPreview; a.download = 'decoded_image.png'; a.click();
  }, [decodedPreview]);

  const handleResetEncode = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null); setPreview(null); setBase64('');
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.modeToggle}>
        <button className={`${styles.modeButton} ${mode === 'encode' ? styles.modeActive : ''}`} onClick={() => setMode('encode')}>
          {t('imageBase64.encodeMode')}
        </button>
        <button className={`${styles.modeButton} ${mode === 'decode' ? styles.modeActive : ''}`} onClick={() => setMode('decode')}>
          {t('imageBase64.decodeMode')}
        </button>
      </div>

      {mode === 'encode' ? (
        <>
          {!file ? (
            <div className={styles.dropzone}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFileSelect(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}>
              <span className={styles.dropzoneIcon}><ToolIcon name="code" size={32} /></span>
              <p className={styles.dropzoneTitle}>{t('imageBase64.dropTitle')}</p>
              <p className={styles.dropzoneSubtitle}>{t('imageBase64.dropSubtitle')}</p>
              <input ref={fileInputRef} type="file" accept="image/*"
                onChange={(e) => { if (e.target.files) handleFileSelect(e.target.files); }}
                className={styles.hiddenInput} />
            </div>
          ) : (
            <>
              <div className={styles.previewRow}>
                <img src={preview!} alt="Input" className={styles.thumbnail} />
                <div className={styles.fileDetails}>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileMeta}>{formatSize(file.size)} · Base64: {formatSize(base64.length)}</span>
                </div>
                <button className={styles.resetButton} onClick={handleResetEncode}>{t('imageBase64.change')}</button>
              </div>
              <div className={styles.outputSection}>
                <div className={styles.outputHeader}>
                  <span className={styles.label}>{t('imageBase64.dataUri')}</span>
                  <div className={styles.copyButtons}>
                    <button className={styles.copyBtn} onClick={handleCopyRaw}>{t('imageBase64.copyRaw')}</button>
                    <button className={styles.copyBtn} onClick={handleCopy}>
                      {copied ? t('imageBase64.copied') : t('imageBase64.copyDataUri')}
                    </button>
                  </div>
                </div>
                <textarea className={styles.outputArea} value={base64} readOnly rows={6} />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className={styles.inputSection}>
            <label className={styles.label}>{t('imageBase64.pasteLabel')}</label>
            <textarea className={styles.inputArea} value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              placeholder="data:image/png;base64,iVBORw0KGgo..." rows={6} />
            <button className="btn btn-primary" onClick={handleDecode} disabled={!decodeInput.trim()}>
              {t('imageBase64.decodeButton')}
            </button>
          </div>
          {decodeError && <p className={styles.errorText}>{decodeError}</p>}
          {decodedPreview && (
            <div className={styles.decodedResult}>
              <img src={decodedPreview} alt="Decoded" className={styles.decodedImage} />
              <button className="btn btn-primary" onClick={handleDownloadDecoded}>
                {t('imageBase64.downloadImage')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
