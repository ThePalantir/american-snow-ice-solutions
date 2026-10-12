"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { analyticsEnabled, consentEvent, consentSnapshot, saveConsent, startAnalytics, trackEvent } from "../analytics";

function subscribe(callback: () => void) {
  window.addEventListener(consentEvent, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(consentEvent, callback);
    window.removeEventListener("storage", callback);
  };
}

export function Analytics() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribe, consentSnapshot, () => null);

  useEffect(() => {
    if (!analyticsEnabled || consent !== "granted") return;
    startAnalytics();
    trackEvent("page_view");
    function onClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest("a") : null;
      const href = target?.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) trackEvent("phone_click");
      else if (href.startsWith("mailto:")) {
        trackEvent(pathname === "/partner-network" ? "partner_inquiry" : "email_click");
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [consent, pathname]);

  if (!analyticsEnabled) return null;
  if (consent !== null) {
    return <button className="analytics-settings" type="button" onClick={() => {
      // A full reload ensures the previously loaded Google tag stops running.
      saveConsent(consent === "granted" ? "denied" : "granted");
      window.location.reload();
    }}>{consent === "granted" ? "Turn off analytics" : "Allow analytics"}</button>;
  }
  return (
    <aside className="analytics-consent" aria-label="Optional analytics">
      <p>Allow Google Analytics to measure visits and consultation requests? The form works with either choice. <a href="/privacy">Privacy notice</a></p>
      <div>
        <button type="button" onClick={() => saveConsent("granted")}>Allow analytics</button>
        <button type="button" onClick={() => saveConsent("denied")}>Decline analytics</button>
      </div>
    </aside>
  );
}
