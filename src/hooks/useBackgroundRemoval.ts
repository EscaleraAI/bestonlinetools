'use client';

/**
 * Hook: useBackgroundRemoval
 *
 * Manages the Web Worker lifecycle for background removal.
 * Handles model loading progress, image processing, and cleanup.
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export type BgRemovalStatus = 'idle' | 'loading' | 'processing' | 'done' | 'error';

interface BgRemovalState {
  status: BgRemovalStatus;
  statusText: string;
  progress: number;          // 0-100 for model download
  resultImageData: ImageData | null;
  error: string | null;
}

export function useBackgroundRemoval() {
  const workerRef = useRef<Worker | null>(null);
  const [state, setState] = useState<BgRemovalState>({
    status: 'idle',
    statusText: '',
    progress: 0,
    resultImageData: null,
    error: null,
  });

  // Initialize worker lazily
  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../workers/bgRemoval.worker.ts', import.meta.url),
        { type: 'module' },
      );

      workerRef.current.onmessage = (e: MessageEvent) => {
        const { type, status, progress, maskData, width, height, message } = e.data;

        switch (type) {
          case 'progress':
            setState((prev) => ({
              ...prev,
              status: prev.status === 'idle' ? 'loading' : prev.status,
              statusText: status || '',
              progress: progress ?? prev.progress,
            }));
            break;

          case 'result':
            const imageData = new ImageData(
              new Uint8ClampedArray(maskData),
              width,
              height,
            );
            setState({
              status: 'done',
              statusText: 'Done!',
              progress: 100,
              resultImageData: imageData,
              error: null,
            });
            break;

          case 'error':
            setState((prev) => ({
              ...prev,
              status: 'error',
              statusText: message || 'An error occurred',
              error: message || 'An error occurred',
            }));
            break;
        }
      };

      workerRef.current.onerror = (e) => {
        setState((prev) => ({
          ...prev,
          status: 'error',
          statusText: 'Worker crashed',
          error: e.message || 'Worker crashed',
        }));
      };
    }
    return workerRef.current;
  }, []);

  /**
   * Process an image file for background removal.
   */
  const processImage = useCallback(
    async (file: File) => {
      setState({
        status: 'loading',
        statusText: 'Preparing...',
        progress: 0,
        resultImageData: null,
        error: null,
      });

      // Decode image to pixel data
      const bitmap = await createImageBitmap(file);
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(bitmap, 0, 0);
      const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
      bitmap.close();

      setState((prev) => ({ ...prev, status: 'processing', statusText: 'Processing...' }));

      // Send to worker (transfer the buffer for zero-copy)
      const buffer = imageData.data.buffer;
      const worker = getWorker();
      worker.postMessage(
        {
          type: 'process',
          imageData: buffer,
          width: imageData.width,
          height: imageData.height,
        },
        { transfer: [buffer] },
      );
    },
    [getWorker],
  );

  /**
   * Reset state for a new image.
   */
  const reset = useCallback(() => {
    setState({
      status: 'idle',
      statusText: '',
      progress: 0,
      resultImageData: null,
      error: null,
    });
  }, []);

  // Cleanup worker on unmount
  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  return {
    ...state,
    processImage,
    reset,
  };
}
