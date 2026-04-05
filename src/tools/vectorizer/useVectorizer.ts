'use client';

import { useState, useCallback } from 'react';
import { optimizeSvg } from './optimizeSvg';

export interface VectorizerOptions {
  colorMode: 'binary' | 'color';
  mode: 'polygon' | 'spline' | 'none';
  filterSpeckle: number;
  cornerThreshold: number;
  lengthThreshold: number;
  maxIterations: number;
  spliceThreshold: number;
  pathPrecision: number;
  invert: boolean;
  scale: number;
  // Color-specific
  colorPrecision: number;
  layerDifference: number;
  hierarchical: 'stacked' | 'cutout';
}

export const defaultOptions: VectorizerOptions = {
  colorMode: 'binary',
  mode: 'spline',
  filterSpeckle: 4,
  cornerThreshold: 60,
  lengthThreshold: 4.0,
  maxIterations: 10,
  spliceThreshold: 45,
  pathPrecision: 3,
  invert: false,
  scale: 1,
  colorPrecision: 6,
  layerDifference: 6,
  hierarchical: 'stacked',
};

export type PresetName = 'logo' | 'icon' | 'illustration' | 'photo' | 'custom';

export const presets: Record<Exclude<PresetName, 'custom'>, { label: string; description: string; options: Partial<VectorizerOptions> }> = {
  logo: {
    label: '🏷️ Logo',
    description: 'Clean edges, high simplification',
    options: { mode: 'spline', filterSpeckle: 8, cornerThreshold: 90, spliceThreshold: 60, lengthThreshold: 4.0, maxIterations: 10, pathPrecision: 3 },
  },
  icon: {
    label: '🎯 Icon',
    description: 'Balanced detail for small graphics',
    options: { mode: 'spline', filterSpeckle: 4, cornerThreshold: 60, spliceThreshold: 45, lengthThreshold: 4.0, maxIterations: 10, pathPrecision: 4 },
  },
  illustration: {
    label: '🎨 Illustration',
    description: 'Preserve artistic detail',
    options: { mode: 'spline', filterSpeckle: 2, cornerThreshold: 45, spliceThreshold: 30, lengthThreshold: 3.0, maxIterations: 15, pathPrecision: 5 },
  },
  photo: {
    label: '📷 Photo',
    description: 'Maximum detail retention',
    options: { mode: 'polygon', filterSpeckle: 1, cornerThreshold: 30, spliceThreshold: 20, lengthThreshold: 2.0, maxIterations: 20, pathPrecision: 6 },
  },
};

export interface VectorizerResult {
  svg: string;
  time: number;
  originalSize: number;
  svgSize: number;
  svgSizeRaw: number;
  optimizeSavings: number;
}

export function useVectorizer() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<VectorizerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');
  const [progressValue, setProgressValue] = useState(0);

  const vectorize = useCallback(
    async (file: File, options: VectorizerOptions) => {
      setIsProcessing(true);
      setError(null);
      setResult(null);
      setProgress('Starting...');
      setProgressValue(0);

      try {
        let svg: string;
        const startTime = performance.now();

        if (options.colorMode === 'color') {
          // ---- Server-side color vectorization ----
          setProgress('Uploading for color vectorization...');
          setProgressValue(10);

          const formData = new FormData();
          formData.append('file', file);
          formData.append('colorMode', 'color');
          formData.append('mode', options.mode);
          formData.append('filterSpeckle', String(options.filterSpeckle));
          formData.append('cornerThreshold', String(options.cornerThreshold));
          formData.append('lengthThreshold', String(options.lengthThreshold));
          formData.append('maxIterations', String(options.maxIterations));
          formData.append('spliceThreshold', String(options.spliceThreshold));
          formData.append('pathPrecision', String(options.pathPrecision));
          formData.append('colorPrecision', String(options.colorPrecision));
          formData.append('layerDifference', String(options.layerDifference));
          formData.append('hierarchical', options.hierarchical);

          setProgress('Processing color image on server...');
          setProgressValue(30);

          const response = await fetch('/api/vectorize', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Server vectorization failed');
          }

          setProgressValue(90);
          const data = await response.json();
          svg = data.svg;

        } else {
          // ---- Client-side B&W vectorization (WASM) ----
          setProgress('Loading image...');
          setProgressValue(5);

          const imageUrl = URL.createObjectURL(file);
          const img = new Image();

          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = imageUrl;
          });

          setProgress('Processing image data...');
          setProgressValue(10);

          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas 2D context not available');

          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(imageUrl);

          setProgress('Loading vectorization engine (WASM)...');
          setProgressValue(20);

          const { BinaryImageConverter } = await import('vectortracer');

          setProgress('Converting to SVG...');
          setProgressValue(30);

          const converter = new BinaryImageConverter(
            imageData,
            {
              debug: undefined,
              mode: options.mode,
              filterSpeckle: options.filterSpeckle,
              cornerThreshold: options.cornerThreshold,
              lengthThreshold: options.lengthThreshold,
              maxIterations: options.maxIterations,
              spliceThreshold: options.spliceThreshold,
              pathPrecision: options.pathPrecision,
            },
            {
              invert: options.invert ? true : undefined,
              pathFill: undefined,
              backgroundColor: undefined,
              attributes: undefined,
              scale: options.scale,
            }
          );

          converter.init();

          svg = await new Promise<string>((resolve, reject) => {
            const tick = () => {
              try {
                const done = converter.tick();
                const p = converter.progress();
                setProgressValue(30 + Math.round(p * 65));

                if (done) {
                  const svgResult = converter.getResult();
                  converter.free();
                  resolve(svgResult);
                } else {
                  setTimeout(tick, 0);
                }
              } catch (err) {
                converter.free();
                reject(err);
              }
            };
            setTimeout(tick, 0);
          });
        }

        const endTime = performance.now();

        // Optimize SVG with SVGO
        setProgress('Optimizing SVG...');
        setProgressValue(97);
        const optimized = optimizeSvg(svg);

        setProgressValue(100);
        setResult({
          svg: optimized.svg,
          time: Math.round(endTime - startTime),
          originalSize: file.size,
          svgSize: optimized.optimizedSize,
          svgSizeRaw: optimized.originalSize,
          optimizeSavings: optimized.savings,
        });

        setProgress('');
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unexpected error during vectorization'
        );
        setProgress('');
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setProgress('');
    setProgressValue(0);
  }, []);

  return {
    vectorize,
    reset,
    isProcessing,
    result,
    error,
    progress,
    progressValue,
  };
}
