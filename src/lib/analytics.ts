/**
 * Analytics helper for BestOnline.Tools
 * Uses Google Analytics 4 (GA4) for page views and custom events.
 *
 * Usage:
 *   trackEvent('tool_used', { tool_id: 'pdf_merge' });
 *   trackEvent('file_downloaded', { tool_id: 'image_compressor' });
 */

// Extend Window for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * GA4 Measurement ID — replace with your actual ID.
 * Set via environment variable or hardcode after creating the GA4 property.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

/** Track a custom event */
export function trackEvent(name: string, params?: Record<string, string | number>) {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', name, params);
  }
}

/** Track tool page open */
export function trackToolOpen(toolId: string, pageType: string) {
  trackEvent('tool_open', { tool_id: toolId, page_type: pageType });
}

/** Track tool usage (user clicked Convert/Process) */
export function trackToolUsed(toolId: string, params?: Record<string, string>) {
  trackEvent('tool_used', { tool_id: toolId, ...params });
}

/** Track file download */
export function trackDownload(toolId: string) {
  trackEvent('file_downloaded', { tool_id: toolId });
}

/** Track tool errors */
export function trackError(toolId: string, errorType: string) {
  trackEvent('tool_error', { tool_id: toolId, error_type: errorType });
}

/** Track share clicks */
export function trackShare(toolId: string, method: string) {
  trackEvent('share_click', { tool_id: toolId, share_method: method });
}

/** Track affiliate link clicks */
export function trackAffiliateClick(competitor: string, toolId: string) {
  trackEvent('affiliate_click', { competitor, tool_id: toolId });
}

/** Track Pro plan interest */
export function trackProInterest(sourceTool: string) {
  trackEvent('pro_interest', { source_tool: sourceTool });
}
