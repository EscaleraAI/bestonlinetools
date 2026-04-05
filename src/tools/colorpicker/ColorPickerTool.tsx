'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import styles from './ColorPickerTool.module.css';

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export default function ColorPickerTool() {
  const [hex, setHex] = useState('#3B82F6');
  const [copied, setCopied] = useState('');
  const pickerRef = useRef<HTMLInputElement>(null);

  const rgb = hexToRgb(hex) || [0, 0, 0];
  const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);

  const formats = [
    { label: 'HEX', value: hex },
    { label: 'RGB', value: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` },
    { label: 'HSL', value: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)` },
    { label: 'CSS', value: hex.toLowerCase() },
  ];

  const handleCopy = useCallback((val: string, label: string) => {
    navigator.clipboard.writeText(val);
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  }, []);

  const handleHexInput = useCallback((val: string) => {
    const clean = val.startsWith('#') ? val : '#' + val;
    if (/^#[0-9A-Fa-f]{0,6}$/.test(clean)) {
      setHex(clean.length === 7 ? clean.toUpperCase() : clean);
    }
  }, []);

  const handleRgbInput = useCallback((channel: 0 | 1 | 2, val: number) => {
    const newRgb = [...rgb] as [number, number, number];
    newRgb[channel] = Math.min(255, Math.max(0, val));
    setHex(rgbToHex(newRgb[0], newRgb[1], newRgb[2]));
  }, [rgb]);

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <div className={styles.pickerCol}>
          <div className={styles.swatchBox} style={{ backgroundColor: hex }}
            onClick={() => pickerRef.current?.click()}>
            <input ref={pickerRef} type="color" value={hex}
              onChange={(e) => setHex(e.target.value.toUpperCase())}
              className={styles.hiddenPicker} />
          </div>
          <div className={styles.hexField}>
            <label className={styles.label}>HEX</label>
            <input className={styles.input} value={hex}
              onChange={(e) => handleHexInput(e.target.value)} maxLength={7} />
          </div>
          <div className={styles.rgbFields}>
            {['R', 'G', 'B'].map((c, i) => (
              <div key={c} className={styles.rgbField}>
                <label className={styles.label}>{c}</label>
                <input type="number" className={styles.input} value={rgb[i]} min={0} max={255}
                  onChange={(e) => handleRgbInput(i as 0 | 1 | 2, Number(e.target.value))} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.formatsCol}>
          {formats.map(f => (
            <div key={f.label} className={styles.formatRow}>
              <span className={styles.formatLabel}>{f.label}</span>
              <code className={styles.formatValue}>{f.value}</code>
              <button className={styles.copyBtn}
                onClick={() => handleCopy(f.value, f.label)}>
                {copied === f.label ? '✓' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
