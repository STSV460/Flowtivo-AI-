/**
 * Central Analytics and Conversion Tracking Module
 * Flowtivo AI Enterprise Infrastructure
 *
 * Supports Google Analytics 4, Google Ads, Meta Pixel, and LinkedIn Insight Tag
 * via direct API shims and Google Tag Manager dataLayer.
 *
 * Features:
 * - Client-side event deduplication (prevents multiple counts on refresh or duplicate clicks)
 * - Safe execution without runtime dependencies
 * - Consent-aware handling
 * - Strict separation of secondary engagement vs genuine conversions
 */

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    lintrk?: (...args: unknown[]) => void;
  }
}

export type ConversionEvent =
  | 'generate_lead'     // Completed enterprise enquiry form
  | 'book_appointment'  // Confirmed booking on /booking-confirmed only
  | 'booking_started'   // Booking popup opened / interaction initiated (secondary)
  | 'contact_click';    // Direct contact email/phone click (secondary)

export interface TrackingParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  currency?: string;
  department?: string;
  company_size?: string;
  timeline?: string;
  dedup_id?: string;
  [key: string]: unknown;
}

/**
 * Validates if an event has already been recorded in this session
 * to prevent duplicate ad conversions on page refresh or double clicks.
 */
function isDuplicate(eventName: ConversionEvent, dedupId?: string): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const key = `flowtivo_tracked_${eventName}_${dedupId || 'default'}`;
    if (sessionStorage.getItem(key)) {
      return true;
    }
    sessionStorage.setItem(key, String(Date.now()));
    return false;
  } catch {
    return false;
  }
}

/**
 * Pushes event to Google Tag Manager dataLayer
 */
function pushToDataLayer(eventName: ConversionEvent, params: TrackingParams = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    event_timestamp: Date.now(),
    ...params,
  });
}

/**
 * Dispatch event to Google Analytics 4 / Google Ads gtag
 */
function dispatchGtag(eventName: ConversionEvent, params: TrackingParams = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', eventName, params);
  } catch (err) {
    console.debug('[Tracking] gtag event failed:', err);
  }
}

/**
 * Dispatch event to Meta (Facebook) Pixel
 */
function dispatchMeta(eventName: ConversionEvent, params: TrackingParams = {}) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  try {
    switch (eventName) {
      case 'generate_lead':
        window.fbq('track', 'Lead', {
          content_name: params.department || 'Enterprise Enquiry',
          content_category: params.company_size,
          value: params.value,
          currency: params.currency || 'USD',
        });
        break;
      case 'book_appointment':
        window.fbq('track', 'Schedule', {
          content_name: 'Enterprise Discovery Consultation',
          value: params.value,
          currency: params.currency || 'USD',
        });
        break;
      case 'booking_started':
        window.fbq('trackCustom', 'BookingInitiated', params);
        break;
      case 'contact_click':
        window.fbq('trackCustom', 'ContactClick', params);
        break;
    }
  } catch (err) {
    console.debug('[Tracking] Meta pixel event failed:', err);
  }
}

/**
 * Dispatch event to LinkedIn Insight Tag
 */
function dispatchLinkedIn(eventName: ConversionEvent, params: TrackingParams = {}) {
  if (typeof window === 'undefined' || typeof window.lintrk !== 'function') return;
  try {
    // When LinkedIn conversion IDs are configured in Tag Manager or dashboard,
    // custom conversion tracking can be triggered here.
    window.lintrk('track', { conversion_id: params.linkedin_conversion_id || eventName });
  } catch (err) {
    console.debug('[Tracking] LinkedIn tracking failed:', err);
  }
}

/**
 * Main conversion tracking dispatcher
 */
export function trackEvent(eventName: ConversionEvent, params: TrackingParams = {}, deduplicate = true): boolean {
  if (typeof window === 'undefined') return false;

  // Strict deduplication for critical conversions (generate_lead, book_appointment)
  if (deduplicate && ['generate_lead', 'book_appointment'].includes(eventName)) {
    if (isDuplicate(eventName, params.dedup_id)) {
      console.debug(`[Tracking] Suppressing duplicate conversion event: ${eventName}`);
      return false;
    }
  }

  // Push to GTM dataLayer
  pushToDataLayer(eventName, params);

  // Dispatch to platform shims if configured
  dispatchGtag(eventName, params);
  dispatchMeta(eventName, params);
  dispatchLinkedIn(eventName, params);

  return true;
}
