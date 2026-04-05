/**
 * Speech-to-Text Web Worker (Whisper via Transformers.js)
 *
 * Runs Whisper inference off the main thread.
 * Uses WebGPU when available, falls back to WASM.
 *
 * Protocol:
 *   Main → Worker: { type: 'transcribe', audioData: ArrayBuffer }
 *   Worker → Main: { type: 'progress', status: string, progress?: number }
 *   Worker → Main: { type: 'result', text: string, chunks?: TranscriptionChunk[] }
 *   Worker → Main: { type: 'error', message: string }
 */

import {
  env,
  pipeline,
  type AutomaticSpeechRecognitionPipeline,
} from '@huggingface/transformers';

// Use the tiny.en model for fast browser transcription (~40MB)
const MODEL_ID = 'onnx-community/whisper-tiny.en';

// Singleton pipeline
let transcriber: AutomaticSpeechRecognitionPipeline | null = null;

/**
 * Detect best available backend.
 */
async function detectBackend(): Promise<'webgpu' | 'wasm'> {
  if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
    try {
      const adapter = await (navigator as unknown as { gpu: { requestAdapter: () => Promise<unknown> } }).gpu.requestAdapter();
      if (adapter) return 'webgpu';
    } catch {
      // WebGPU not available
    }
  }
  return 'wasm';
}

/**
 * Initialize pipeline (downloads model on first call, cached after).
 */
async function ensurePipeline(): Promise<void> {
  if (transcriber) return;

  const backend = await detectBackend();
  postMessage({ type: 'progress', status: `Using ${backend.toUpperCase()} backend` });

  // Configure Transformers.js
  if (env.backends?.onnx?.wasm) {
    env.backends.onnx.wasm.proxy = false;
    if (backend === 'webgpu') {
      env.backends.onnx.wasm.numThreads = 1;
    }
  }

  postMessage({ type: 'progress', status: 'Downloading Whisper model...', progress: 0 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transcriber = await (pipeline as any)(
    'automatic-speech-recognition',
    MODEL_ID,
    {
      device: backend,
      progress_callback: (progress: { status: string; progress?: number }) => {
        if (progress.status === 'progress' && progress.progress != null) {
          postMessage({
            type: 'progress',
            status: 'Downloading Whisper model...',
            progress: Math.round(progress.progress),
          });
        }
      },
    },
  ) as AutomaticSpeechRecognitionPipeline;

  postMessage({ type: 'progress', status: 'Model ready', progress: 100 });
}

/**
 * Transcribe audio from ArrayBuffer (expects PCM audio data).
 */
async function transcribeAudio(audioData: ArrayBuffer): Promise<void> {
  await ensurePipeline();
  if (!transcriber) throw new Error('Pipeline not loaded');

  postMessage({ type: 'progress', status: 'Transcribing...' });

  // Convert ArrayBuffer to Float32Array if needed
  // The pipeline can accept raw audio data or URLs
  const float32 = new Float32Array(audioData);

  const result = await transcriber(float32, {
    return_timestamps: true,
    chunk_length_s: 30,
    stride_length_s: 5,
  });

  // Result shape: { text: string, chunks?: Array<{ text, timestamp }> }
  const output = Array.isArray(result) ? result[0] : result;

  postMessage({
    type: 'result',
    text: output.text || '',
    chunks: output.chunks || [],
  });
}

// Message handler
self.onmessage = async (e: MessageEvent) => {
  const { type, audioData } = e.data;

  if (type === 'transcribe') {
    try {
      await transcribeAudio(audioData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Transcription failed';
      postMessage({ type: 'error', message });
    }
  }
};
