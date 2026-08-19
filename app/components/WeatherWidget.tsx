"use client";

import { useEffect } from "react";

const SCRIPT_ID = "weatherwidget-io-js";
const SCRIPT_SRC = "https://weatherwidget.io/js/widget.min.js";

declare global {
  interface Window {
    __weatherwidget_init?: () => void;
  }
}

export function WeatherWidget() {
  useEffect(() => {
    const initialize = () => window.__weatherwidget_init?.();
    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.__weatherwidget_init) initialize();
      else existingScript.addEventListener("load", initialize, { once: true });

      return () => existingScript.removeEventListener("load", initialize);
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", initialize, { once: true });
    document.head.appendChild(script);

    return () => script.removeEventListener("load", initialize);
  }, []);

  return (
    <aside className="weather-card" aria-labelledby="weather-card-title">
      <div className="weather-card__heading">
        <span id="weather-card-title">Lehigh Valley conditions</span>
        <small>Third-party forecast</small>
      </div>
      <a
        className="weatherwidget-io"
        href="https://forecast7.com/en/40d61n75d49/allentown/?unit=us"
        data-label_1="LEHIGH VALLEY"
        data-label_2="CURRENT CONDITIONS"
        data-font="Arial"
        data-icons="Climacons Animated"
        data-mode="Current"
        data-days="3"
        data-theme="original"
        data-basecolor="#0d2033"
        data-accent="#5cc8f3"
        data-textcolor="#ffffff"
        data-highcolor="#ff6652"
        data-lowcolor="#a9e5fb"
        data-suncolor="#f3ba54"
        data-mooncolor="#dcebf2"
        data-cloudcolor="#dcebf2"
        data-cloudfill="#122a40"
        data-raincolor="#5cc8f3"
        data-snowcolor="#ffffff"
      >
        Lehigh Valley current conditions
      </a>
      <p>Provided for general awareness. AS&amp;IS does not provide public weather forecasting.</p>
    </aside>
  );
}
