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
    <aside className="weather-card" aria-label="Current weather for Lehigh Valley, Pennsylvania">
      <a
        className="weatherwidget-io"
        href="https://forecast7.com/en/40d61n75d49/allentown/?unit=us"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Current weather for Lehigh Valley, Pennsylvania — opens Forecast7"
        data-label_1="LEHIGH VALLEY"
        data-label_2="PA"
        data-font="Helvetica"
        data-mode="Current"
        data-basecolor="#080f16"
        data-textcolor="#d9e5eb"
        data-suncolor="#e5ac62"
        data-mooncolor="#c8d7de"
        data-cloudcolor="#aebfc8"
        data-raincolor="#5cc8f3"
        data-snowcolor="#d9e5eb"
      >
        Lehigh Valley weather
      </a>
    </aside>
  );
}
