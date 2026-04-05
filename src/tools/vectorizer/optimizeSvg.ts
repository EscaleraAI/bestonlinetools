'use client';

import { optimize, type Config } from 'svgo/browser';

const SVGO_CONFIG: Config = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
    },
  ],
};

export interface OptimizeResult {
  svg: string;
  originalSize: number;
  optimizedSize: number;
  savings: number; // percentage
}

export function optimizeSvg(svgString: string): OptimizeResult {
  const originalSize = new Blob([svgString]).size;

  const result = optimize(svgString, SVGO_CONFIG);
  const optimizedSvg = result.data;
  const optimizedSize = new Blob([optimizedSvg]).size;

  const savings = originalSize > 0
    ? Math.round(((originalSize - optimizedSize) / originalSize) * 100)
    : 0;

  return {
    svg: optimizedSvg,
    originalSize,
    optimizedSize,
    savings,
  };
}
