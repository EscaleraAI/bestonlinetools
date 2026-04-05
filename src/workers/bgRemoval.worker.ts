/**
 * Background Removal Web Worker
 *
 * Runs Transformers.js inference off the main thread.
 * Uses WebGPU when available, falls back to WASM.
 *
 * Protocol:
 *   Main → Worker: { type: 'process', imageData: ArrayBuffer, width, height }
 *   Worker → Main: { type: 'progress', status, progress? }
 *   Worker → Main: { type: 'result', maskData: ArrayBuffer, width, height }
 *   Worker → Main: { type: 'error', message: string }
 */

import {
  env,
  AutoModel,
  AutoProcessor,
  RawImage,
  type Processor,
  type PreTrainedModel,
} from '@huggingface/transformers';

// Model config
const MODEL_ID = 'briaai/RMBG-1.4';

// Singleton model + processor
let model: PreTrainedModel | null = null;
let processor: Processor | null = null;

/**
 * Detect best available backend.
 */
async function detectBackend(): Promise<'webgpu' | 'wasm'> {
  if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
    try {
      const adapter = await (navigator as any).gpu.requestAdapter();
      if (adapter) return 'webgpu';
    } catch {
      // WebGPU not available
    }
  }
  return 'wasm';
}

/**
 * Initialize model and processor (downloads on first call, cached after).
 */
async function ensureModel(): Promise<void> {
  if (model && processor) return;

  const backend = await detectBackend();
  postMessage({ type: 'progress', status: `Using ${backend.toUpperCase()} backend` });

  // Configure Transformers.js
  if (env.backends?.onnx?.wasm) {
    env.backends.onnx.wasm.proxy = false;
    if (backend === 'webgpu') {
      env.backends.onnx.wasm.numThreads = 1;
    }
  }

  postMessage({ type: 'progress', status: 'Downloading AI model...', progress: 0 });

  // Load model + processor in parallel
  const device = backend === 'webgpu' ? 'webgpu' : 'wasm';

  const [loadedModel, loadedProcessor] = await Promise.all([
    AutoModel.from_pretrained(MODEL_ID, {
      device,
      progress_callback: (progress: any) => {
        if (progress.status === 'progress' && progress.progress != null) {
          postMessage({
            type: 'progress',
            status: 'Downloading AI model...',
            progress: Math.round(progress.progress),
          });
        }
      },
    }),
    AutoProcessor.from_pretrained(MODEL_ID),
  ]);

  model = loadedModel;
  processor = loadedProcessor;

  // Pre-warm with a tiny image to compile shaders
  postMessage({ type: 'progress', status: 'Warming up...' });
  const dummy = new RawImage(new Uint8ClampedArray(4).fill(128), 1, 1, 4);
  const dummyInput = await processor(dummy);
  await model(dummyInput);

  postMessage({ type: 'progress', status: 'Ready', progress: 100 });
}

/**
 * Process an image: returns alpha mask.
 */
async function processImage(
  imageData: ArrayBuffer,
  width: number,
  height: number,
): Promise<void> {
  await ensureModel();
  if (!model || !processor) throw new Error('Model not loaded');

  postMessage({ type: 'progress', status: 'Processing image...' });

  // Create RawImage from RGBA data
  const uint8Data = new Uint8ClampedArray(imageData);
  const image = new RawImage(uint8Data, width, height, 4);

  // Run processor
  const inputs = await processor(image);

  // Run model inference
  const output = await model(inputs);

  // Extract mask - the model outputs a segmentation mask
  const maskTensor = output.output || output.logits || output[0];

  // Get mask data as Float32Array, resize to original dimensions
  const maskData = maskTensor.data as Float32Array;

  // The mask needs to be resized to match the original image size
  // Transformers.js returns a 1024x1024 mask; we need to resize it
  const maskWidth = maskTensor.dims[maskTensor.dims.length - 1];
  const maskHeight = maskTensor.dims[maskTensor.dims.length - 2];

  // Create the output RGBA buffer with the mask applied
  const outputBuffer = new ArrayBuffer(width * height * 4);
  const outputView = new Uint8ClampedArray(outputBuffer);

  // Bilinear interpolation for mask resizing
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcX = (x / width) * maskWidth;
      const srcY = (y / height) * maskHeight;

      // Simple bilinear interpolation
      const x0 = Math.floor(srcX);
      const y0 = Math.floor(srcY);
      const x1 = Math.min(x0 + 1, maskWidth - 1);
      const y1 = Math.min(y0 + 1, maskHeight - 1);
      const fx = srcX - x0;
      const fy = srcY - y0;

      const v00 = maskData[y0 * maskWidth + x0];
      const v10 = maskData[y0 * maskWidth + x1];
      const v01 = maskData[y1 * maskWidth + x0];
      const v11 = maskData[y1 * maskWidth + x1];

      const alpha = (v00 * (1 - fx) * (1 - fy) +
                     v10 * fx * (1 - fy) +
                     v01 * (1 - fx) * fy +
                     v11 * fx * fy);

      const idx = (y * width + x) * 4;
      const srcIdx = (y * width + x) * 4;
      outputView[idx] = uint8Data[srcIdx];       // R
      outputView[idx + 1] = uint8Data[srcIdx + 1]; // G
      outputView[idx + 2] = uint8Data[srcIdx + 2]; // B
      outputView[idx + 3] = Math.round(Math.max(0, Math.min(1, alpha)) * 255); // A from mask
    }
  }

  postMessage(
    { type: 'result', maskData: outputBuffer, width, height },
    { transfer: [outputBuffer] },
  );
}

// Message handler
self.onmessage = async (e: MessageEvent) => {
  const { type, imageData, width, height } = e.data;

  if (type === 'process') {
    try {
      await processImage(imageData, width, height);
    } catch (err: any) {
      postMessage({ type: 'error', message: err.message || 'Processing failed' });
    }
  }
};
