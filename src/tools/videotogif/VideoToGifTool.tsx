'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { useLocale } from '@/lib/i18n/LocaleContext';
import ToolSuccess from '@/components/ToolSuccess';
import ToolIcon from '@/components/ui/ToolIcon';
import { getSafeFileSizeMB, getMemoryWarning } from '@/lib/memoryGuard';
import styles from './VideoToGifTool.module.css';

const MAX_FILE_SIZE = getSafeFileSizeMB(200) * 1024 * 1024;

export default function VideoToGifTool() {
  const { t } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [fps, setFps] = useState(15);
  const [width, setWidth] = useState(480);
  const [status, setStatus] = useState<'idle' | 'loading' | 'converting' | 'done' | 'error'>('idle');
  const [statusText, setStatusText] = useState('');
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const memWarning = getMemoryWarning();

  const ffmpegRef = useRef<FFmpeg | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [videoUrl, resultUrl]);

  const loadFFmpeg = useCallback(async () => {
    if (ffmpegRef.current) return ffmpegRef.current;
    setStatus('loading');
    setStatusText(t('videoToGif.loadingEngine'));
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
  }, [t]);

  const handleFileSelect = useCallback((files: FileList | File[]) => {
    const vidFile = Array.from(files).find(f => f.type.startsWith('video/'));
    if (!vidFile) return;
    if (vidFile.size > MAX_FILE_SIZE) {
      setStatus('error');
      setStatusText(t('videoToGif.fileTooLarge'));
      return;
    }

    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    const url = URL.createObjectURL(vidFile);
    setFile(vidFile);
    setVideoUrl(url);
    setResultUrl(null);
    setResultFile(null);
    setStatus('idle');
    setStatusText('');

    const video = document.createElement('video');
    video.onloadedmetadata = () => {
      const dur = Math.floor(video.duration);
      setDuration(dur);
      setStartTime(0);
      setEndTime(Math.min(dur, 10));
    };
    video.src = url;
  }, [videoUrl, resultUrl, t]);

  const handleConvert = useCallback(async () => {
    if (!file) return;
    try {
      const ffmpeg = await loadFFmpeg();
      setStatus('converting');
      setStatusText(t('videoToGif.converting'));
      setProgress(0);

      const inputName = 'input' + (file.name.match(/\.[^.]+$/)?.[0] || '.mp4');
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      await ffmpeg.exec([
        '-ss', String(startTime),
        '-t', String(endTime - startTime),
        '-i', inputName,
        '-vf', `fps=${fps},scale=${width}:-1:flags=lanczos,palettegen`,
        '-y', 'palette.png',
      ]);

      await ffmpeg.exec([
        '-ss', String(startTime),
        '-t', String(endTime - startTime),
        '-i', inputName,
        '-i', 'palette.png',
        '-lavfi', `fps=${fps},scale=${width}:-1:flags=lanczos[x];[x][1:v]paletteuse`,
        '-y', 'output.gif',
      ]);

      const data = await ffmpeg.readFile('output.gif');
      const blob = new Blob([data as BlobPart], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      const outName = file.name.replace(/\.[^.]+$/, '') + '.gif';
      const outFile = new File([blob], outName, { type: 'image/gif' });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile('palette.png');
      await ffmpeg.deleteFile('output.gif');

      setResultUrl(url);
      setResultFile(outFile);
      setStatus('done');
    } catch (err: unknown) {
      setStatus('error');
      setStatusText(err instanceof Error ? err.message : 'Conversion failed');
    }
  }, [file, startTime, endTime, fps, width, loadFFmpeg, t]);

  const handleDownload = useCallback(() => {
    if (!resultUrl || !resultFile) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = resultFile.name;
    a.click();
  }, [resultUrl, resultFile]);

  const handleReset = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setVideoUrl(null);
    setResultUrl(null);
    setResultFile(null);
    setStatus('idle');
    setStatusText('');
    setProgress(0);
  }, [videoUrl, resultUrl]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  // --- RENDER ---

  if (status === 'done' && resultFile && resultUrl) {
    return (
      <div className={styles.container}>
        <div className={styles.resultSection}>
          <div className={styles.resultSummary}>
            <div className={styles.resultIcon}>✓</div>
            <h3>{t('videoToGif.success', { size: formatSize(resultFile.size) })}</h3>
          </div>
          <div className={styles.gifPreview}>
            <img src={resultUrl} alt="Output GIF" className={styles.gifImage} />
          </div>
          <ToolSuccess
            outputFiles={[resultFile]}
            sourceTool="video_to_gif"
            onDownload={handleDownload}
            crossLinks={[]}
          />
          <button className={styles.resetButton} onClick={handleReset}>{t('videoToGif.convertAnother')}</button>
        </div>
      </div>
    );
  }

  if (status === 'loading' || status === 'converting') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSection}>
          <p className={styles.statusText}>{statusText}</p>
          {progress > 0 && (
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          )}
          <span className={styles.progressLabel}>{progress}%</span>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.errorSection}>
          <p className={styles.errorText}>Error: {statusText}</p>
          <button className={styles.resetButton} onClick={handleReset}>{t('videoToGif.tryAgain')}</button>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className={styles.container}>
        <div
          className={styles.dropzone}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFileSelect(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
        >
          <span className={styles.dropzoneIcon}><ToolIcon name="film" size={32} /></span>
          <p className={styles.dropzoneTitle}>{t('videoToGif.dropTitle')}</p>
          <p className={styles.dropzoneSubtitle}>{t('videoToGif.dropSubtitle')}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => { if (e.target.files) handleFileSelect(e.target.files); }}
            className={styles.hiddenInput}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.videoPreview}>
        <video ref={videoRef} src={videoUrl!} controls className={styles.video} />
      </div>

      <div className={styles.settingsPanel}>
        <h3 className={styles.settingsTitle}>{t('videoToGif.settingsTitle')}</h3>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>{t('videoToGif.startTime')}</label>
            <input type="number" className={styles.input} value={startTime} min={0} max={duration}
              onChange={(e) => setStartTime(Math.min(Number(e.target.value), endTime - 1))} />
            <span className={styles.rangeValue}>{formatTime(startTime)}</span>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('videoToGif.endTime')}</label>
            <input type="number" className={styles.input} value={endTime} min={startTime + 1} max={duration}
              onChange={(e) => setEndTime(Math.max(Number(e.target.value), startTime + 1))} />
            <span className={styles.rangeValue}>{formatTime(endTime)} ({t('videoToGif.duration', { value: String(endTime - startTime) })})</span>
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>{t('videoToGif.fps')}</label>
            <select className={styles.select} value={fps} onChange={(e) => setFps(Number(e.target.value))}>
              <option value={10}>{t('videoToGif.fps10')}</option>
              <option value={15}>{t('videoToGif.fps15')}</option>
              <option value={20}>{t('videoToGif.fps20')}</option>
              <option value={25}>{t('videoToGif.fps25')}</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('videoToGif.widthPx')}</label>
            <select className={styles.select} value={width} onChange={(e) => setWidth(Number(e.target.value))}>
              <option value={320}>{t('videoToGif.width320')}</option>
              <option value={480}>{t('videoToGif.width480')}</option>
              <option value={640}>{t('videoToGif.width640')}</option>
              <option value={800}>{t('videoToGif.width800')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.actionBar}>
        <button className={styles.resetButton} onClick={handleReset}>{t('videoToGif.changeVideo')}</button>
        <button className="btn btn-primary btn-lg" onClick={handleConvert}>
          {t('videoToGif.convertButton')}
        </button>
      </div>
    </div>
  );
}
