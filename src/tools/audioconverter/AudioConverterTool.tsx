'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import ToolSuccess from '@/components/ToolSuccess';
import ToolIcon from '@/components/ui/ToolIcon';
import { getSafeFileSizeMB } from '@/lib/memoryGuard';
import styles from './AudioConverterTool.module.css';

const MAX_FILE_SIZE = getSafeFileSizeMB(100) * 1024 * 1024;
const ACCEPTED_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/flac',
  'audio/aac',
  'audio/mp4',
  'audio/webm',
  'audio/x-m4a',
];
const ACCEPTED_EXTENSIONS = '.mp3,.wav,.ogg,.flac,.aac,.m4a,.weba,.webm,.mp4';

type OutputFormat = 'mp3' | 'wav' | 'ogg' | 'flac' | 'aac';

interface FormatConfig {
  extension: string;
  mimeType: string;
  label: string;
  codecArgs: string[];
}

const FORMAT_MAP: Record<OutputFormat, FormatConfig> = {
  mp3: {
    extension: '.mp3',
    mimeType: 'audio/mpeg',
    label: 'MP3',
    codecArgs: ['-codec:a', 'libmp3lame'],
  },
  wav: {
    extension: '.wav',
    mimeType: 'audio/wav',
    label: 'WAV',
    codecArgs: ['-codec:a', 'pcm_s16le'],
  },
  ogg: {
    extension: '.ogg',
    mimeType: 'audio/ogg',
    label: 'OGG',
    codecArgs: ['-codec:a', 'libvorbis'],
  },
  flac: {
    extension: '.flac',
    mimeType: 'audio/flac',
    label: 'FLAC',
    codecArgs: ['-codec:a', 'flac'],
  },
  aac: {
    extension: '.aac',
    mimeType: 'audio/aac',
    label: 'AAC',
    codecArgs: ['-codec:a', 'aac'],
  },
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getReductionPercent(original: number, compressed: number): number {
  if (original === 0) return 0;
  return Math.round(((original - compressed) / original) * 100);
}

export default function AudioConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('mp3');
  const [bitrate, setBitrate] = useState(128);
  const [trimStart, setTrimStart] = useState('');
  const [trimEnd, setTrimEnd] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'converting' | 'done' | 'error'>('idle');
  const [statusText, setStatusText] = useState('');
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ffmpegRef = useRef<FFmpeg | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Cleanup URLs
  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [fileUrl, resultUrl]);

  const loadFFmpeg = useCallback(async () => {
    if (ffmpegRef.current) return ffmpegRef.current;

    setStatus('loading');
    setStatusText('Loading audio engine...');
    setProgress(0);

    const ffmpeg = new FFmpeg();
    ffmpeg.on('progress', ({ progress: p }) => {
      setProgress(Math.min(Math.round(p * 100), 100));
    });

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    ffmpegRef.current = ffmpeg;
    return ffmpeg;
  }, []);

  const handleFile = useCallback(
    (f: File) => {
      // Check extension as well since MIME types for audio can be unreliable
      const ext = f.name.split('.').pop()?.toLowerCase() || '';
      const validExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'weba', 'webm', 'mp4'];
      if (!ACCEPTED_TYPES.includes(f.type) && !validExtensions.includes(ext)) {
        setError('Unsupported audio format. Try MP3, WAV, OGG, FLAC, or AAC.');
        setStatus('error');
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        setError('File too large. Maximum size is 100MB.');
        setStatus('error');
        return;
      }

      if (fileUrl) URL.revokeObjectURL(fileUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);

      const url = URL.createObjectURL(f);
      setFile(f);
      setFileUrl(url);
      setResultUrl(null);
      setResultFile(null);
      setStatus('idle');
      setError(null);
      setTrimStart('');
      setTrimEnd('');

      // Get duration from audio element
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };
      audio.src = url;
    },
    [fileUrl, resultUrl],
  );

  const handleConvert = useCallback(async () => {
    if (!file) return;

    try {
      const ffmpeg = await loadFFmpeg();

      setStatus('converting');
      setStatusText('Converting audio...');
      setProgress(0);

      // Get input extension
      const inputExt = file.name.split('.').pop()?.toLowerCase() || 'mp3';
      const inputName = `input.${inputExt}`;
      const fmtConfig = FORMAT_MAP[outputFormat];
      const outputName = `output${fmtConfig.extension}`;

      // Write input to MEMFS
      const fileData = await fetchFile(file);
      await ffmpeg.writeFile(inputName, fileData);

      // Build FFmpeg args
      const args: string[] = ['-i', inputName];

      // Add trim if specified
      const startSec = trimStart ? parseFloat(trimStart) : 0;
      const endSec = trimEnd ? parseFloat(trimEnd) : 0;
      if (startSec > 0) {
        args.push('-ss', startSec.toString());
      }
      if (endSec > 0 && endSec > startSec) {
        args.push('-to', endSec.toString());
      }

      // Add codec
      args.push(...fmtConfig.codecArgs);

      // Add bitrate for lossy formats
      if (outputFormat !== 'wav' && outputFormat !== 'flac') {
        args.push('-b:a', `${bitrate}k`);
      }

      // Overwrite output
      args.push('-y', outputName);

      setStatusText(`Converting to ${fmtConfig.label}...`);
      await ffmpeg.exec(args);

      // Read output
      const data = await ffmpeg.readFile(outputName);
      // FileData may be string or Uint8Array; ensure we get a buffer for Blob
      const uint8 = typeof data === 'string'
        ? new TextEncoder().encode(data)
        : data;
      // .slice() produces a plain ArrayBuffer (not SharedArrayBuffer)
      const buffer = uint8.buffer.slice(uint8.byteOffset, uint8.byteOffset + uint8.byteLength) as ArrayBuffer;
      const blob = new Blob([buffer], { type: fmtConfig.mimeType });
      const url = URL.createObjectURL(blob);

      const baseName = file.name.replace(/\.[^.]+$/, '');
      const outFile = new File([blob], `${baseName}${fmtConfig.extension}`, {
        type: fmtConfig.mimeType,
      });

      setResultUrl(url);
      setResultFile(outFile);
      setStatus('done');
      setStatusText('Done!');

      // Cleanup MEMFS
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Conversion failed';
      setError(message);
      setStatus('error');
    }
  }, [file, outputFormat, bitrate, trimStart, trimEnd, loadFFmpeg]);

  const handleDownload = useCallback(() => {
    if (!resultUrl || !resultFile) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = resultFile.name;
    a.click();
  }, [resultUrl, resultFile]);

  const handleReset = useCallback(() => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setFileUrl(null);
    setDuration(0);
    setResultUrl(null);
    setResultFile(null);
    setStatus('idle');
    setStatusText('');
    setProgress(0);
    setError(null);
    setTrimStart('');
    setTrimEnd('');
  }, [fileUrl, resultUrl]);

  // --- RENDER ---

  // Done — show result
  if (status === 'done' && resultFile && resultUrl) {
    const reduction = file ? getReductionPercent(file.size, resultFile.size) : 0;

    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.resultSummary}>
            <div className={styles.resultIcon}>✓</div>
            <h3>Audio converted to {FORMAT_MAP[outputFormat].label}</h3>
            <div className={styles.resultStats}>
              <div className={styles.resultStat}>
                <span className={styles.resultStatValue}>
                  {file ? formatSize(file.size) : '—'}
                </span>
                <span className={styles.resultStatLabel}>Original</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultStatValue}>{formatSize(resultFile.size)}</span>
                <span className={styles.resultStatLabel}>Converted</span>
              </div>
              {reduction > 0 && (
                <div className={styles.resultStat}>
                  <span className={`${styles.resultStatValue} ${styles.resultStatAccent}`}>
                    {reduction}%
                  </span>
                  <span className={styles.resultStatLabel}>Smaller</span>
                </div>
              )}
            </div>
          </div>

          {/* Playback preview */}
          <audio controls src={resultUrl} className={styles.audioPlayer} />

          <ToolSuccess
            outputFiles={[resultFile]}
            sourceTool="audio_converter"
            onDownload={handleDownload}
            crossLinks={[
              { icon: '🗜️', label: 'Compress image', href: '/image/compress-image' },
              { icon: '📎', label: 'Merge PDFs', href: '/pdf/merge' },
            ]}
          />

          <button className={styles.resetButton} onClick={handleReset}>
            Convert another file
          </button>
        </div>
      </div>
    );
  }

  // Loading FFmpeg or converting
  if (status === 'loading' || status === 'converting') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSection}>
          <div className={styles.progressWrapper}>
            {status === 'converting' && (
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
            )}
            <p className={styles.statusText}>{statusText}</p>
            {status === 'loading' && (
              <p className={styles.privacyNote}>
                <ToolIcon name="shield" size={14} /> Audio engine loads once (~30MB) — all processing stays local
              </p>
            )}
            {status === 'converting' && (
              <p className={styles.privacyNote}>
                <ToolIcon name="shield" size={14} /> Converting locally — your files never leave your device
              </p>
            )}
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
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Idle — drop zone + controls
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
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className={styles.dropzoneContent}>
          <span className={styles.dropzoneIcon}><ToolIcon name="music" size={32} /></span>
          <p className={styles.dropzoneTitle}>
            {file ? 'Replace audio file' : 'Drop audio to convert'}
          </p>
          <p className={styles.dropzoneSubtitle}>MP3, WAV, OGG, FLAC, AAC • Max 100MB</p>
          <button className={styles.uploadButton}>Choose File</button>
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

      {/* File info & controls */}
      {file && (
        <>
          <div className={styles.fileInfo}>
            <span className={styles.fileIcon}>🎧</span>
            <div className={styles.fileDetails}>
              <p className={styles.fileName}>{file.name}</p>
              <p className={styles.fileMeta}>
                {formatSize(file.size)}
                {duration > 0 ? ` · ${formatDuration(duration)}` : ''}
              </p>
            </div>
          </div>

          {/* Playback */}
          {fileUrl && (
            <audio ref={audioRef} controls src={fileUrl} className={styles.audioPlayer} />
          )}

          <div className={styles.controlsPanel}>
            {/* Output Format */}
            <div className={styles.controlGroup}>
              <div className={styles.controlRow}>
                <span className={styles.controlLabel}>Output Format</span>
              </div>
              <div className={styles.formatRow}>
                {(Object.keys(FORMAT_MAP) as OutputFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    className={`${styles.formatButton} ${outputFormat === fmt ? styles.formatButtonActive : ''}`}
                    onClick={() => setOutputFormat(fmt)}
                  >
                    {FORMAT_MAP[fmt].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bitrate — only for lossy formats */}
            {outputFormat !== 'wav' && outputFormat !== 'flac' && (
              <div className={styles.controlGroup}>
                <div className={styles.controlRow}>
                  <span className={styles.controlLabel}>Bitrate</span>
                  <span className={styles.controlValue}>{bitrate} kbps</span>
                </div>
                <input
                  type="range"
                  min={64}
                  max={320}
                  step={32}
                  value={bitrate}
                  onChange={(e) => setBitrate(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>
            )}

            {/* Trim (optional) */}
            <div className={styles.controlGroup}>
              <div className={styles.controlRow}>
                <span className={styles.controlLabel}>Trim (optional)</span>
              </div>
              <div className={styles.trimSection}>
                <input
                  type="text"
                  placeholder="0:00"
                  value={trimStart}
                  onChange={(e) => setTrimStart(e.target.value)}
                  className={styles.trimInput}
                />
                <span className={styles.trimSeparator}>to</span>
                <input
                  type="text"
                  placeholder={duration > 0 ? formatDuration(duration) : 'end'}
                  value={trimEnd}
                  onChange={(e) => setTrimEnd(e.target.value)}
                  className={styles.trimInput}
                />
                <span className={styles.trimSeparator}>seconds</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className={styles.actionBar}>
            <span className={styles.actionInfo}>
              {file.name.split('.').pop()?.toUpperCase()} → {FORMAT_MAP[outputFormat].label}
            </span>
            <button className="btn btn-primary btn-lg" onClick={handleConvert}>
              Convert to {FORMAT_MAP[outputFormat].label} →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
