'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import ToolIcon from '@/components/ui/ToolIcon';
import styles from './QrCodeTool.module.css';

type QRCodeType = 'url' | 'text' | 'wifi';

interface WifiConfig {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
}

export default function QrCodeTool() {
  const { t } = useLocale();
  const [qrType, setQrType] = useState<QRCodeType>('url');
  const [inputText, setInputText] = useState('https://');
  const [wifiConfig, setWifiConfig] = useState<WifiConfig>({ ssid: '', password: '', encryption: 'WPA' });
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getData = (): string => {
    if (qrType === 'wifi') {
      return `WIFI:T:${wifiConfig.encryption};S:${wifiConfig.ssid};P:${wifiConfig.password};;`;
    }
    return inputText;
  };

  const generateQR = useCallback(async () => {
    const data = getData();
    if (!data || data === 'https://') {
      setError(t('qrCode.enterContent'));
      return;
    }
    setError('');

    try {
      const QRCode = (await import('qrcode')).default;
      const canvas = canvasRef.current;
      if (!canvas) return;

      await QRCode.toCanvas(canvas, data, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: 'M',
      });

      setQrDataUrl(canvas.toDataURL('image/png'));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR code');
    }
  }, [inputText, wifiConfig, qrType, size, fgColor, bgColor, t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = getData();
      if (data && data !== 'https://') {
        generateQR();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [inputText, wifiConfig, qrType, size, fgColor, bgColor, generateQR]);

  const handleDownloadPNG = useCallback(() => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'qrcode.png';
    a.click();
  }, [qrDataUrl]);

  const handleDownloadSVG = useCallback(async () => {
    const data = getData();
    if (!data) return;
    try {
      const QRCode = (await import('qrcode')).default;
      const svgString = await QRCode.toString(data, {
        type: 'svg',
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: 'M',
      });
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.svg';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError(t('qrCode.svgError'));
    }
  }, [inputText, wifiConfig, qrType, size, fgColor, bgColor, t]);

  const typeLabels: Record<QRCodeType, string> = {
    url: t('qrCode.typeUrl'),
    text: t('qrCode.typeText'),
    wifi: t('qrCode.typeWifi'),
  };

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Input panel */}
        <div className={styles.inputPanel}>
          <div className={styles.typeToggle}>
            {(['url', 'text', 'wifi'] as QRCodeType[]).map(tp => (
              <button
                key={tp}
                className={`${styles.typeButton} ${qrType === tp ? styles.typeActive : ''}`}
                onClick={() => { setQrType(tp); setQrDataUrl(null); }}
              >
                {typeLabels[tp]}
              </button>
            ))}
          </div>

          {qrType === 'url' && (
            <div className={styles.field}>
              <label className={styles.label}>{t('qrCode.urlLabel')}</label>
              <input
                type="url"
                className={styles.input}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          )}

          {qrType === 'text' && (
            <div className={styles.field}>
              <label className={styles.label}>{t('qrCode.textLabel')}</label>
              <textarea
                className={styles.textarea}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('qrCode.textPlaceholder')}
                rows={4}
              />
            </div>
          )}

          {qrType === 'wifi' && (
            <>
              <div className={styles.field}>
                <label className={styles.label}>{t('qrCode.ssid')}</label>
                <input className={styles.input} value={wifiConfig.ssid}
                  onChange={(e) => setWifiConfig(prev => ({ ...prev, ssid: e.target.value }))}
                  placeholder="MyWiFiNetwork" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t('qrCode.password')}</label>
                <input className={styles.input} type="password" value={wifiConfig.password}
                  onChange={(e) => setWifiConfig(prev => ({ ...prev, password: e.target.value }))}
                  placeholder={t('qrCode.passwordPlaceholder')} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t('qrCode.encryption')}</label>
                <select className={styles.select} value={wifiConfig.encryption}
                  onChange={(e) => setWifiConfig(prev => ({ ...prev, encryption: e.target.value as 'WPA' | 'WEP' | 'nopass' }))}>
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">{t('qrCode.encryptionNone')}</option>
                </select>
              </div>
            </>
          )}

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>{t('qrCode.size')}</label>
              <select className={styles.select} value={size} onChange={(e) => setSize(Number(e.target.value))}>
                <option value={200}>200px</option>
                <option value={300}>300px</option>
                <option value={400}>400px</option>
                <option value={600}>600px</option>
                <option value={800}>800px</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t('qrCode.colors')}</label>
              <div className={styles.colorPickers}>
                <div className={styles.colorGroup}>
                  <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className={styles.colorInput} />
                  <span className={styles.colorLabel}>{t('qrCode.colorCode')}</span>
                </div>
                <div className={styles.colorGroup}>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className={styles.colorInput} />
                  <span className={styles.colorLabel}>{t('qrCode.colorBg')}</span>
                </div>
              </div>
            </div>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}
        </div>

        {/* Preview panel */}
        <div className={styles.previewPanel}>
          <canvas ref={canvasRef} className={styles.qrCanvas} />
          {qrDataUrl && (
            <div className={styles.downloadButtons}>
              <button className="btn btn-primary" onClick={handleDownloadPNG}>
                {t('qrCode.downloadPng')}
              </button>
              <button className={styles.svgButton} onClick={handleDownloadSVG}>
                {t('qrCode.downloadSvg')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
