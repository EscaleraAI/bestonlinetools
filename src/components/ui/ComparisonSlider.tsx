'use client';

import { useState, useCallback, useRef, MouseEvent, TouchEvent } from 'react';
import styles from './ComparisonSlider.module.css';

interface ComparisonSliderProps {
  originalSrc: string;
  svgHtml: string;
  originalLabel?: string;
  resultLabel?: string;
}

export default function ComparisonSlider({
  originalSrc,
  svgHtml,
  originalLabel = 'Original',
  resultLabel = 'SVG Output',
}: ComparisonSliderProps) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  }, [isDragging, updatePosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    setIsDragging(true);
    updatePosition(e.touches[0].clientX);
  }, [updatePosition]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    updatePosition(e.touches[0].clientX);
  }, [isDragging, updatePosition]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* SVG layer (full width, behind) */}
      <div className={styles.layer}>
        <div
          className={styles.svgContent}
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
      </div>

      {/* Original image layer (clipped to left of slider) */}
      <div
        className={styles.layer}
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={originalSrc} alt="Original" className={styles.image} />
      </div>

      {/* Slider handle */}
      <div className={styles.sliderLine} style={{ left: `${position}%` }}>
        <div className={styles.handle}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4L3 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 4L17 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className={`${styles.label} ${styles.labelLeft}`}>{originalLabel}</span>
      <span className={`${styles.label} ${styles.labelRight}`}>{resultLabel}</span>
    </div>
  );
}
