/**
 * Memory guard utilities for WASM-heavy tools.
 * Prevents OOM crashes on low-memory mobile devices.
 */

/** Detect if device has limited memory (< 4GB) */
export function isLowMemoryDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  // navigator.deviceMemory is available in Chrome/Edge (in GB)
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (mem !== undefined) return mem < 4;
  // Fallback: check if mobile user agent
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

/** Get estimated available memory in MB (best-effort) */
export function getDeviceMemoryMB(): number {
  if (typeof navigator === 'undefined') return 8192;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return mem ? mem * 1024 : 8192; // default to 8GB if unknown
}

/** Calculate safe file size limit based on device memory */
export function getSafeFileSizeMB(baseLimitMB: number): number {
  if (isLowMemoryDevice()) {
    return Math.min(baseLimitMB, 50); // Cap at 50MB on mobile
  }
  return baseLimitMB;
}

/** Warning message for low-memory devices */
export function getMemoryWarning(): string | null {
  if (!isLowMemoryDevice()) return null;
  return 'Your device has limited memory. Large files may cause the browser to crash. Consider using smaller files or a desktop browser.';
}
