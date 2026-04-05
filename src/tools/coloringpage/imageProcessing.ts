/**
 * Client-side image-to-coloring-page processing.
 *
 * Pipeline: Grayscale → Gaussian Blur → Sobel Edge Detection → Threshold → Invert
 * Runs entirely on Canvas pixel data — no external dependencies.
 */

export interface ColoringPageOptions {
  /** Edge detection sensitivity (1–100). Higher = more edges. Default 50. */
  sensitivity: number;
  /** Line thickness multiplier (1–5). Default 2. */
  lineThickness: number;
  /** Blur radius. Higher = cleaner lines. Default 1. */
  blurRadius: number;
  /** Whether to invert output (black lines on white). Default true. */
  invert: boolean;
}

const DEFAULT_OPTIONS: ColoringPageOptions = {
  sensitivity: 50,
  lineThickness: 2,
  blurRadius: 1,
  invert: true,
};

/**
 * Convert an image file to a coloring page using edge detection.
 */
export function processToColoringPage(
  sourceCanvas: HTMLCanvasElement,
  outputCanvas: HTMLCanvasElement,
  options: Partial<ColoringPageOptions> = {},
): void {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  outputCanvas.width = width;
  outputCanvas.height = height;

  const srcCtx = sourceCanvas.getContext('2d', { willReadFrequently: true })!;
  const srcData = srcCtx.getImageData(0, 0, width, height);

  // Step 1: Grayscale
  const gray = toGrayscale(srcData);

  // Step 2: Gaussian blur
  const blurred =
    opts.blurRadius > 0 ? gaussianBlur(gray, width, height, opts.blurRadius) : gray;

  // Step 3: Sobel edge detection
  const edges = sobelEdgeDetection(blurred, width, height);

  // Step 4: Threshold — map sensitivity (1–100) to threshold (220–30)
  const threshold = Math.round(220 - (opts.sensitivity / 100) * 190);
  const thresholded = applyThreshold(edges, threshold);

  // Step 5: Optional line thickening via dilation
  const thickened =
    opts.lineThickness > 1
      ? dilate(thresholded, width, height, opts.lineThickness - 1)
      : thresholded;

  // Step 6: Build output ImageData
  const outCtx = outputCanvas.getContext('2d')!;
  const outData = outCtx.createImageData(width, height);
  const pixels = outData.data;

  for (let i = 0; i < thickened.length; i++) {
    const edgeVal = thickened[i];
    // Edge pixels → black lines, non-edge → white background
    const color = opts.invert ? (edgeVal > 0 ? 0 : 255) : edgeVal;
    const idx = i * 4;
    pixels[idx] = color;
    pixels[idx + 1] = color;
    pixels[idx + 2] = color;
    pixels[idx + 3] = 255;
  }

  outCtx.putImageData(outData, 0, 0);
}

/** Convert RGBA ImageData to grayscale float array. */
function toGrayscale(imageData: ImageData): Float32Array {
  const data = imageData.data;
  const len = data.length / 4;
  const gray = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const idx = i * 4;
    // ITU-R BT.601 luma
    gray[i] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
  }
  return gray;
}

/** 2D Gaussian blur (separable, two-pass). */
function gaussianBlur(
  input: Float32Array,
  width: number,
  height: number,
  radius: number,
): Float32Array {
  const kernel = createGaussianKernel(radius);
  const half = Math.floor(kernel.length / 2);
  const temp = new Float32Array(input.length);
  const output = new Float32Array(input.length);

  // Horizontal pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let wSum = 0;
      for (let k = -half; k <= half; k++) {
        const sx = Math.min(Math.max(x + k, 0), width - 1);
        const w = kernel[k + half];
        sum += input[y * width + sx] * w;
        wSum += w;
      }
      temp[y * width + x] = sum / wSum;
    }
  }

  // Vertical pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let wSum = 0;
      for (let k = -half; k <= half; k++) {
        const sy = Math.min(Math.max(y + k, 0), height - 1);
        const w = kernel[k + half];
        sum += temp[sy * width + x] * w;
        wSum += w;
      }
      output[y * width + x] = sum / wSum;
    }
  }

  return output;
}

function createGaussianKernel(radius: number): Float32Array {
  const size = radius * 2 + 1;
  const kernel = new Float32Array(size);
  const sigma = radius / 2;
  const coeff = 1 / (Math.sqrt(2 * Math.PI) * sigma);
  const exp = -1 / (2 * sigma * sigma);

  for (let i = 0; i < size; i++) {
    const x = i - radius;
    kernel[i] = coeff * Math.exp(x * x * exp);
  }

  return kernel;
}

/** Sobel edge detection. Returns gradient magnitude (0–255). */
function sobelEdgeDetection(
  input: Float32Array,
  width: number,
  height: number,
): Float32Array {
  const output = new Float32Array(input.length);

  // Sobel kernels
  const gxKernel = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const gyKernel = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  let maxMag = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0;
      let gy = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixel = input[(y + ky) * width + (x + kx)];
          const ki = (ky + 1) * 3 + (kx + 1);
          gx += pixel * gxKernel[ki];
          gy += pixel * gyKernel[ki];
        }
      }

      const mag = Math.sqrt(gx * gx + gy * gy);
      output[y * width + x] = mag;
      if (mag > maxMag) maxMag = mag;
    }
  }

  // Normalize to 0–255
  if (maxMag > 0) {
    const scale = 255 / maxMag;
    for (let i = 0; i < output.length; i++) {
      output[i] = Math.min(255, output[i] * scale);
    }
  }

  return output;
}

/** Binary threshold: values >= threshold → 255, else 0. */
function applyThreshold(input: Float32Array, threshold: number): Uint8Array {
  const output = new Uint8Array(input.length);
  for (let i = 0; i < input.length; i++) {
    output[i] = input[i] >= threshold ? 255 : 0;
  }
  return output;
}

/** Dilate binary image to thicken lines. */
function dilate(
  input: Uint8Array,
  width: number,
  height: number,
  iterations: number,
): Uint8Array {
  let current = input;

  for (let iter = 0; iter < iterations; iter++) {
    const next = new Uint8Array(current.length);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        // If any neighbor is edge (255), this pixel becomes edge
        if (
          current[idx] === 255 ||
          current[idx - 1] === 255 ||
          current[idx + 1] === 255 ||
          current[(y - 1) * width + x] === 255 ||
          current[(y + 1) * width + x] === 255
        ) {
          next[idx] = 255;
        }
      }
    }

    current = next;
  }

  return current;
}
