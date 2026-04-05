'use client';

/**
 * Hook: useSpeechToText
 *
 * Manages the Web Worker lifecycle for Whisper-based speech-to-text.
 * Handles model loading progress, audio transcription, and cleanup.
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export type SttStatus = 'idle' | 'loading' | 'transcribing' | 'done' | 'error';

export interface TranscriptionChunk {
  text: string;
  timestamp: [number, number | null];
}

interface SttState {
  status: SttStatus;
  statusText: string;
  progress: number;          // 0-100 for model download
  resultText: string;
  resultChunks: TranscriptionChunk[];
  error: string | null;
}

export function useSpeechToText() {
  const workerRef = useRef<Worker | null>(null);
  const [state, setState] = useState<SttState>({
    status: 'idle',
    statusText: '',
    progress: 0,
    resultText: '',
    resultChunks: [],
    error: null,
  });

  // Initialize worker lazily
  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../workers/speechToText.worker.ts', import.meta.url),
        { type: 'module' },
      );

      workerRef.current.onmessage = (e: MessageEvent) => {
        const { type, status, progress, text, chunks, message } = e.data;

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
            setState({
              status: 'done',
              statusText: 'Done!',
              progress: 100,
              resultText: text || '',
              resultChunks: chunks || [],
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
   * Decode audio file to Float32Array PCM data (mono, 16kHz for Whisper).
   */
  const decodeAudioToFloat32 = useCallback(
    async (file: File): Promise<Float32Array> => {
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Mix down to mono
      const numChannels = audioBuffer.numberOfChannels;
      const length = audioBuffer.length;
      const output = new Float32Array(length);

      for (let ch = 0; ch < numChannels; ch++) {
        const channelData = audioBuffer.getChannelData(ch);
        for (let i = 0; i < length; i++) {
          output[i] += channelData[i] / numChannels;
        }
      }

      await audioContext.close();
      return output;
    },
    [],
  );

  /**
   * Transcribe an audio file.
   */
  const transcribe = useCallback(
    async (file: File) => {
      setState({
        status: 'loading',
        statusText: 'Decoding audio...',
        progress: 0,
        resultText: '',
        resultChunks: [],
        error: null,
      });

      try {
        // Decode audio to PCM Float32Array at 16kHz (Whisper's expected format)
        const pcmData = await decodeAudioToFloat32(file);

        setState((prev) => ({ ...prev, status: 'transcribing', statusText: 'Starting transcription...' }));

        // Send to worker (transfer the buffer for zero-copy)
        const buffer = pcmData.buffer;
        const worker = getWorker();
        worker.postMessage(
          { type: 'transcribe', audioData: buffer },
          { transfer: [buffer as ArrayBuffer] },
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Audio decoding failed';
        setState((prev) => ({
          ...prev,
          status: 'error',
          statusText: message,
          error: message,
        }));
      }
    },
    [getWorker, decodeAudioToFloat32],
  );

  /**
   * Reset state for a new transcription.
   */
  const reset = useCallback(() => {
    setState({
      status: 'idle',
      statusText: '',
      progress: 0,
      resultText: '',
      resultChunks: [],
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
    transcribe,
    reset,
  };
}
