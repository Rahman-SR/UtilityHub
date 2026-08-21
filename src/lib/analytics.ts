/**
 * Centralized Google Analytics 4 (GA4) Utility
 * 
 * Measurement ID: Managed via process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
 * Privacy Guarantee: 100% anonymous metadata only. No PII, uploaded files, or personal data.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetIdOrEventName: string | Date,
      params?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Check if analytics should dispatch events.
 * Only dispatches in production or when running on the production domain.
 */
export function isAnalyticsActive(): boolean {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) {
    return false;
  }
  
  // Guard against polluting production property with localhost traffic unless explicitly in production build
  const isLocal =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.endsWith('.local');

  if (process.env.NODE_ENV !== 'production' && isLocal) {
    return false;
  }

  return true;
}

/**
 * Track route pageview
 */
export function trackPageView(url: string): void {
  if (!isAnalyticsActive() || typeof window.gtag !== 'function') return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/**
 * Generic event tracker with snake_case validation and sanitized parameters
 */
export function trackEvent(
  eventName: string,
  eventParams: Record<string, string | number | boolean | undefined> = {}
): void {
  if (!isAnalyticsActive() || typeof window.gtag !== 'function') return;

  // Enforce lowercase snake_case event names
  const cleanEventName = eventName.toLowerCase().replace(/[^a-z0-9_]/g, '_');

  // Strip empty/undefined fields
  const cleanParams: Record<string, string | number | boolean> = {};
  for (const [key, val] of Object.entries(eventParams)) {
    if (val !== undefined && val !== null) {
      cleanParams[key.toLowerCase().replace(/[^a-z0-9_]/g, '_')] = val;
    }
  }

  window.gtag('event', cleanEventName, cleanParams);
}

/**
 * Event: Tool Opened (Fired once when a tool workspace mounts)
 */
export function trackToolOpen(toolName: string, toolCategory: string): void {
  trackEvent('tool_open', {
    tool_name: toolName,
    tool_category: toolCategory,
  });
}

/**
 * Event: Tool Operation Complete (Fired on successful compression, conversion, calculation, or merge)
 */
export function trackToolComplete(toolName: string, toolCategory: string): void {
  trackEvent('tool_complete', {
    tool_name: toolName,
    tool_category: toolCategory,
  });
}

/**
 * Event: File Downloaded
 */
export function trackFileDownload(toolName: string, fileType: string): void {
  trackEvent('file_download', {
    tool_name: toolName,
    file_type: fileType,
  });
}

/**
 * Event: Resume Export
 */
export function trackResumeExport(templateType: string = 'ats', exportType: string = 'pdf'): void {
  trackEvent('resume_export', {
    template_type: templateType,
    export_type: exportType,
  });
}

/**
 * Event: Tool Error (Controlled error categories only)
 */
export function trackToolError(
  toolName: string,
  errorType: 'processing_failed' | 'invalid_file' | 'unsupported_format' | 'export_failed' | 'network_error'
): void {
  trackEvent('tool_error', {
    tool_name: toolName,
    error_type: errorType,
  });
}
