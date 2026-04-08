'use client';

import { useState, useRef, useCallback } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import ToolIcon from '@/components/ui/ToolIcon';
import styles from './SpeechToTextTool.module.css';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_EXTENSIONS = '.mp3,.wav,.ogg,.flac,.aac,.m4a,.weba,.webm,.mp4';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function SpeechToTextTool() {
  const { t } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    status,
    statusText,
    progress,
    resultText,
    resultChunks,
    error,
    transcribe,
    reset: resetHook,
  } = useSpeechToText();

  const handleFile = useCallback(
    (f: File) => {
      if (f.size > MAX_FILE_SIZE) {
        return;
      }
      setFile(f);
      setCopied(false);
      transcribe(f);
    },
    [transcribe],
  );

  const handleCopy = useCallback(async () => {
    if (!resultText) return;
    await navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [resultText]);

  const handleDownloadTxt = useCallback(() => {
    if (!resultText || !file) return;
    const blob = new Blob([resultText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^.]+$/, '')}_transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [resultText, file]);

  const handleDownloadSrt = useCallback(() => {
    if (!resultChunks.length || !file) return;
    const srt = resultChunks
      .map((chunk, i) => {
        const start = chunk.timestamp[0];
        const end = chunk.timestamp[1] ?? start + 5;
        return `${i + 1}\n${formatSrtTime(start)} --> ${formatSrtTime(end)}\n${chunk.text.trim()}\n`;
      })
      .join('\n');
    const blob = new Blob([srt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^.]+$/, '')}_subtitles.srt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [resultChunks, file]);

  const handleReset = useCallback(() => {
    setFile(null);
    setCopied(false);
    resetHook();
  }, [resetHook]);

  // --- RENDER ---

  // Done — show transcript
  if (status === 'done') {
    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.transcriptBox}>
            <span className={styles.transcriptLabel}>{t('speechToText.transcript')}</span>
            <p className={`${styles.transcriptText} ${!resultText ? styles.transcriptEmpty : ''}`}>
              {resultText || t('speechToText.noSpeech')}
            </p>
          </div>

          {resultChunks.length > 0 && (
            <div className={styles.timestampSection}>
              <div className={styles.timestampHeader}>{t('speechToText.timestamps')}</div>
              {resultChunks.map((chunk, i) => (
                <div key={i} className={styles.timestampRow}>
                  <span className={styles.timestampTime}>
                    {formatTimestamp(chunk.timestamp[0])}
                  </span>
                  <span className={styles.timestampText}>{chunk.text.trim()}</span>
                </div>
              ))}
            </div>
          )}

          <div className={styles.resultActions}>
            <button
              className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
              onClick={handleCopy}
            >
              {copied ? t('speechToText.copied') : t('speechToText.copyText')}
            </button>
            <button className={styles.downloadButton} onClick={handleDownloadTxt}>
              {t('speechToText.downloadTxt')}
            </button>
            {resultChunks.length > 0 && (
              <button className={styles.downloadButton} onClick={handleDownloadSrt}>
                {t('speechToText.downloadSrt')}
              </button>
            )}
          </div>

          <button className={styles.resetButton} onClick={handleReset}>
            {t('speechToText.transcribeAnother')}
          </button>
        </div>
      </div>
    );
  }

  // Loading / Transcribing
  if (status === 'loading' || status === 'transcribing') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSection}>
          <div className={styles.progressWrapper}>
            {progress > 0 && progress < 100 && (
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
            )}
            <p className={styles.statusText}>{statusText}</p>
            <p className={styles.privacyNote}>
              <ToolIcon name="shield" size={14} /> {t('speechToText.privacyNote')}
            </p>
          </div>
        </div>
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
            {t('speechToText.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  // Idle — drop zone
  return (
    <div className={styles.container}>
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
          if (f) handleFile(f);
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className={styles.dropzoneContent}>
          <span className={styles.dropzoneIcon}><ToolIcon name="mic" size={32} /></span>
          <p className={styles.dropzoneTitle}>{t('speechToText.dropTitle')}</p>
          <p className={styles.dropzoneSubtitle}>{t('speechToText.dropSubtitle')}</p>
          <button className={styles.uploadButton}>{t('speechToText.chooseFile')}</button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = '';
          }}
          className={styles.hiddenInput}
        />
      </div>

      {file && (
        <div className={styles.fileInfo}>
          <span className={styles.fileIcon}>🎧</span>
          <div className={styles.fileDetails}>
            <p className={styles.fileName}>{file.name}</p>
            <p className={styles.fileMeta}>{formatSize(file.size)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/** Format seconds to SRT timestamp: HH:MM:SS,mmm */
function formatSrtTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
}
