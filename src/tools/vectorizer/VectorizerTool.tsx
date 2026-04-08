'use client';

import { useState, useCallback, useRef, DragEvent, ChangeEvent } from 'react';
import {
  useVectorizer,
  defaultOptions,
  VectorizerOptions,
  PresetName,
  presets,
} from './useVectorizer';
import styles from './VectorizerTool.module.css';
import ComparisonSlider from '@/components/ui/ComparisonSlider';
import ToolIcon from '@/components/ui/ToolIcon';
import { useLocale } from '@/lib/i18n/LocaleContext';
import {
  ExportFormat,
  exportFormats,
  exportAsPdf,
  exportAsEps,
  exportAsDxf,
} from './exportFormats';

export default function VectorizerTool() {
  const { t } = useLocale();
  const { vectorize, reset, isProcessing, result, error, progress, progressValue } =
    useVectorizer();

  const [options, setOptions] = useState<VectorizerOptions>(defaultOptions);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState<PresetName>('icon');
  const [viewMode, setViewMode] = useState<'sideBySide' | 'slider'>('slider');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('svg');
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (f: File) => {
      if (!f.type.startsWith('image/')) return;
      setFile(f);
      setPreview(URL.createObjectURL(f));
      reset();
    },
    [reset]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => { setIsDragging(false); }, []);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleConvert = useCallback(() => {
    if (file) vectorize(file, options);
  }, [file, options, vectorize]);

  const handleDownload = useCallback(async () => {
    if (!result) return;
    const baseName = file?.name?.replace(/\.[^.]+$/, '') || 'vectorized';
    if (exportFormat === 'svg') {
      const blob = new Blob([result.svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${baseName}.svg`; a.click();
      URL.revokeObjectURL(url);
      return;
    }
    setIsExporting(true);
    try {
      switch (exportFormat) {
        case 'pdf': await exportAsPdf(result.svg, baseName); break;
        case 'eps': exportAsEps(result.svg, baseName); break;
        case 'dxf': exportAsDxf(result.svg, baseName); break;
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  }, [result, file, exportFormat]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.svg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const handleReset = useCallback(() => {
    setFile(null); setPreview(null); reset();
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [reset]);

  const updateOption = <K extends keyof VectorizerOptions>(key: K, value: VectorizerOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
    setActivePreset('custom');
  };

  const applyPreset = (name: Exclude<PresetName, 'custom'>) => {
    setActivePreset(name);
    setOptions((prev) => ({ ...prev, ...presets[name].options }));
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={styles.tool}>
      {!file && (
        <div
          className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          id="vectorizer-dropzone"
        >
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/bmp"
            onChange={handleInputChange} className={styles.fileInput} id="vectorizer-file-input" />
          <div className={styles.dropzoneIcon}><ToolIcon name="upload" size={32} /></div>
          <h3 className={styles.dropzoneTitle}>{t('vectorizer.dropTitle')}</h3>
          <p className={styles.dropzoneSubtitle}>{t('vectorizer.dropSubtitle')}</p>
        </div>
      )}

      {file && (
        <div className={styles.workspace}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarSection}>
              <h4 className={styles.sidebarTitle}>{t('vectorizer.preset')}</h4>
              <div className={styles.presetGrid}>
                {(Object.keys(presets) as Array<Exclude<PresetName, 'custom'>>).map((key) => (
                  <button key={key}
                    className={`${styles.presetBtn} ${activePreset === key ? styles.active : ''}`}
                    onClick={() => applyPreset(key)} title={presets[key].description}
                  >{presets[key].label}</button>
                ))}
              </div>
              {activePreset === 'custom' && (
                <p className={styles.presetHint}>{t('vectorizer.customSettings')}</p>
              )}
            </div>

            <div className={styles.sidebarSection}>
              <h4 className={styles.sidebarTitle}>{t('vectorizer.colorMode')}</h4>
              <div className={styles.modeToggle}>
                <button className={`${styles.modeBtn} ${options.colorMode === 'binary' ? styles.active : ''}`}
                  onClick={() => updateOption('colorMode', 'binary')}>{t('vectorizer.bw')}</button>
                <button className={`${styles.modeBtn} ${options.colorMode === 'color' ? styles.active : ''}`}
                  onClick={() => updateOption('colorMode', 'color')}>{t('vectorizer.color')}</button>
              </div>
              {options.colorMode === 'color' && (
                <p className={styles.presetHint}>{t('vectorizer.colorServerNote')}</p>
              )}
            </div>

            <div className={styles.sidebarSection}>
              <h4 className={styles.sidebarTitle}>{t('vectorizer.traceMode')}</h4>
              <div className={styles.modeToggle}>
                <button className={`${styles.modeBtn} ${options.mode === 'spline' ? styles.active : ''}`}
                  onClick={() => updateOption('mode', 'spline')}>{t('vectorizer.spline')}</button>
                <button className={`${styles.modeBtn} ${options.mode === 'polygon' ? styles.active : ''}`}
                  onClick={() => updateOption('mode', 'polygon')}>{t('vectorizer.polygon')}</button>
              </div>
            </div>

            <div className={styles.sidebarSection}>
              <h4 className={styles.sidebarTitle}>{t('vectorizer.qualitySettings')}</h4>

              <label className={styles.sliderLabel}><span>{t('vectorizer.filterSpeckle')}</span><span className={styles.sliderValue}>{options.filterSpeckle}</span></label>
              <input type="range" min="0" max="128" value={options.filterSpeckle} onChange={(e) => updateOption('filterSpeckle', Number(e.target.value))} className={styles.slider} />

              <label className={styles.sliderLabel}><span>{t('vectorizer.cornerThreshold')}</span><span className={styles.sliderValue}>{options.cornerThreshold}</span></label>
              <input type="range" min="0" max="180" value={options.cornerThreshold} onChange={(e) => updateOption('cornerThreshold', Number(e.target.value))} className={styles.slider} />

              <label className={styles.sliderLabel}><span>{t('vectorizer.spliceThreshold')}</span><span className={styles.sliderValue}>{options.spliceThreshold}</span></label>
              <input type="range" min="0" max="180" value={options.spliceThreshold} onChange={(e) => updateOption('spliceThreshold', Number(e.target.value))} className={styles.slider} />

              <label className={styles.sliderLabel}><span>{t('vectorizer.lengthThreshold')}</span><span className={styles.sliderValue}>{options.lengthThreshold.toFixed(1)}</span></label>
              <input type="range" min="0" max="20" step="0.5" value={options.lengthThreshold} onChange={(e) => updateOption('lengthThreshold', Number(e.target.value))} className={styles.slider} />

              <label className={styles.sliderLabel}><span>{t('vectorizer.pathPrecision')}</span><span className={styles.sliderValue}>{options.pathPrecision}</span></label>
              <input type="range" min="1" max="8" value={options.pathPrecision} onChange={(e) => updateOption('pathPrecision', Number(e.target.value))} className={styles.slider} />

              <label className={styles.sliderLabel}><span>{t('vectorizer.maxIterations')}</span><span className={styles.sliderValue}>{options.maxIterations}</span></label>
              <input type="range" min="1" max="20" value={options.maxIterations} onChange={(e) => updateOption('maxIterations', Number(e.target.value))} className={styles.slider} />

              {options.colorMode === 'color' && (
                <>
                  <label className={styles.sliderLabel}><span>{t('vectorizer.colorPrecision')}</span><span className={styles.sliderValue}>{options.colorPrecision}</span></label>
                  <input type="range" min="1" max="8" value={options.colorPrecision} onChange={(e) => updateOption('colorPrecision', Number(e.target.value))} className={styles.slider} />

                  <label className={styles.sliderLabel}><span>{t('vectorizer.layerDifference')}</span><span className={styles.sliderValue}>{options.layerDifference}</span></label>
                  <input type="range" min="1" max="32" value={options.layerDifference} onChange={(e) => updateOption('layerDifference', Number(e.target.value))} className={styles.slider} />
                </>
              )}
            </div>

            <div className={styles.sidebarSection}>
              <h4 className={styles.sidebarTitle}>{t('vectorizer.options')}</h4>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={options.invert} onChange={(e) => updateOption('invert', e.target.checked)} className={styles.checkbox} />
                <span>{t('vectorizer.invertColors')}</span>
              </label>
            </div>

            <div className={styles.sidebarActions}>
              <button className="btn btn-primary" onClick={handleConvert} disabled={isProcessing}
                id="vectorizer-convert-btn" style={{ width: '100%' }}>
                {isProcessing ? t('vectorizer.converting') : t('vectorizer.convertButton')}
              </button>
              <button className="btn btn-secondary" onClick={handleReset}
                style={{ width: '100%' }} id="vectorizer-reset-btn">
                {t('vectorizer.newImage')}
              </button>
            </div>
          </aside>

          <div className={styles.previewArea}>
            {isProcessing && (
              <div className={styles.progressOverlay}>
                <div className={styles.progressBarWrap}>
                  <div className={styles.progressBar} style={{ width: `${progressValue}%` }} />
                </div>
                <p>{progress}</p>
              </div>
            )}

            {error && (
              <div className={styles.errorBanner}><p>{error}</p></div>
            )}

            {result && preview && (
              <div className={styles.viewToggle}>
                <button className={`${styles.viewBtn} ${viewMode === 'slider' ? styles.active : ''}`}
                  onClick={() => setViewMode('slider')}>{t('vectorizer.slider')}</button>
                <button className={`${styles.viewBtn} ${viewMode === 'sideBySide' ? styles.active : ''}`}
                  onClick={() => setViewMode('sideBySide')}>{t('vectorizer.sideBySide')}</button>
              </div>
            )}

            {result && preview && viewMode === 'slider' && (
              <ComparisonSlider originalSrc={preview} svgHtml={result.svg} />
            )}

            {(!result || viewMode === 'sideBySide') && (
            <div className={styles.comparison}>
              <div className={styles.previewPanel}>
                <div className={styles.panelHeader}>
                  <span className={styles.panelLabel}>{t('vectorizer.originalLabel')}</span>
                  {file && <span className={styles.panelMeta}>{formatBytes(file.size)}</span>}
                </div>
                <div className={styles.previewContent}>
                  {preview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Original image" className={styles.previewImage} />
                  )}
                </div>
              </div>

              <div className={styles.previewPanel}>
                <div className={styles.panelHeader}>
                  <span className={styles.panelLabel}>{t('vectorizer.svgOutput')}</span>
                  {result && <span className={styles.panelMeta}>{formatBytes(result.svgSize)} • {result.time}ms</span>}
                </div>
                <div className={styles.previewContent}>
                  {result ? (
                    <div className={styles.svgPreview} dangerouslySetInnerHTML={{ __html: result.svg }} />
                  ) : (
                    <div className={styles.placeholder}>
                      <p>{isProcessing ? t('vectorizer.converting') : t('vectorizer.clickToStart')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            )}

            {result && (
              <div className={styles.resultActions}>
                <div className={styles.exportGroup}>
                  <select className={styles.formatSelect} value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as ExportFormat)}>
                    {exportFormats.map((f) => (
                      <option key={f.value} value={f.value}>{f.label} — {f.description}</option>
                    ))}
                  </select>
                  <button className="btn btn-primary" onClick={handleDownload} disabled={isExporting}
                    id="vectorizer-download-btn">
                    {isExporting ? t('vectorizer.exporting') : t('vectorizer.downloadFormat', { format: exportFormat.toUpperCase() })}
                  </button>
                </div>
                <button className="btn btn-secondary" onClick={handleCopy} id="vectorizer-copy-btn">
                  {copied ? t('vectorizer.copied') : t('vectorizer.copySvg')}
                </button>
                <div className={styles.resultStats}>
                  <span>{t('vectorizer.originalSize')}: <strong>{formatBytes(result.originalSize)}</strong></span>
                  <span>
                    {t('vectorizer.svgSize')}: <strong>{formatBytes(result.svgSize)}</strong>
                    {result.optimizeSavings > 0 && (
                      <span className={styles.savingsBadge}>SVGO −{result.optimizeSavings}%</span>
                    )}
                  </span>
                  <span>{t('vectorizer.time')}: <strong>{result.time}ms</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
