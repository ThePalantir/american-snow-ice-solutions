// Activation requires an existing property and approval of the published notice.
export const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? "";
export const analyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true"
  && process.env.NEXT_PUBLIC_PRIVACY_NOTICE_APPROVED === "true"
  && /^G-[A-Z0-9]+$/.test(measurementId);
export const consentKey = "asis-analytics-consent-v1";
export const consentEvent = "asis-analytics-consent-change";
let deniedForVisit = false;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export function consentSnapshot(): string | null {
  if (deniedForVisit) return "denied";
  try { return localStorage.getItem(consentKey); } catch { return null; }
}

export function saveConsent(value: "granted" | "denied") {
  let persisted = false;
  try { localStorage.setItem(consentKey, value); persisted = true; } catch { /* Fail closed. */ }
  deniedForVisit = !persisted;
  if (value === "denied") stopAnalytics(persisted);
  else if (persisted && window[`ga-disable-${measurementId}`]) window.location.reload();
  window.dispatchEvent(new Event(consentEvent));
}

export function stopAnalytics(reload = true) {
  if (!analyticsEnabled || !document.getElementById("asis-ga4")) return;
  // Disable collection immediately, including while a reload is pending.
  window[`ga-disable-${measurementId}`] = true;
  if (reload) window.location.reload();
}

export function startAnalytics() {
  if (!analyticsEnabled || consentSnapshot() !== "granted") return;
  if (document.getElementById("asis-ga4")) return;
  window.dataLayer = window.dataLayer ?? [];
  // Google consumes Arguments objects; plain arrays use a different dataLayer API.
  // eslint-disable-next-line prefer-rest-params -- Required by Google's command queue.
  window.gtag = function () { window.dataLayer?.push(arguments); };
  window.gtag("consent", "default", {
    analytics_storage: "granted", ad_storage: "denied",
    ad_user_data: "denied", ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: false, allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: pageLocation(),
    page_referrer: "", page_title: "ASIS website",
  });
  const script = document.createElement("script");
  script.id = "asis-ga4";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}

function pageLocation() {
  const pathname = window.location.pathname;
  const known = /^\/(?:services(?:\/(?:commercial-plowing|deicing-salting|sidewalks-walkways|weather-reporting|risk-management))?|about|contact|quote|service-areas|winter-risk-plan|technology-reporting|snow-ice-science|salt-brine|schedule|partner-network|privacy)?$/.test(pathname);
  return `${window.location.origin}${known ? pathname : "/other"}`;
}

// Fixed event names and parameters only. Never pass form payloads or link URLs.
export function trackEvent(event: "page_view" | "generate_lead" | "phone_click" | "email_click" | "partner_inquiry") {
  if (!analyticsEnabled || consentSnapshot() !== "granted" || !window.gtag) return;
  try { window.gtag("event", event, {
    send_to: measurementId,
    page_location: pageLocation(),
    page_referrer: "", page_title: "ASIS website",
    ...(event === "generate_lead" ? { form_id: "risk_consultation" } : {}),
  }); } catch { /* Optional analytics must never interrupt a successful form. */ }
}
