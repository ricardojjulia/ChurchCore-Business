"use client";

import React, { useEffect, useRef } from "react";

export interface CockpitRuntimeViewportProps {
  html: string;
}

declare global {
  interface Window {
    __CHURCHCORE_DASHBOARD_BOOTED?: boolean;
    bootChurchCoreDashboard?: () => void;
  }
}

function loadScriptSequential(src: string): Promise<void> {
  return new Promise((resolve) => {
    const existing = document.querySelector(`script[data-cockpit-src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.setAttribute("data-cockpit-src", src);
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.body.appendChild(script);
  });
}

export const CockpitRuntimeViewport = React.memo(
  function CockpitRuntimeViewportInner({ html }: CockpitRuntimeViewportProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      let cancelled = false;

      async function bootScripts() {
        await loadScriptSequential("/fleet-data.js?v=20261028b");
        await loadScriptSequential("/presos-data.js?v=20261028b");
        await loadScriptSequential("/scripts-data.js?v=20261028b");
        await loadScriptSequential("/feedback-data.js?v=20261028b");
        await loadScriptSequential("/app.js?v=20261028b");

        if (!cancelled && typeof window.bootChurchCoreDashboard === "function") {
          window.bootChurchCoreDashboard();
        }
      }

      bootScripts();

      return () => {
        cancelled = true;
      };
    }, []);

    return (
      <div
        ref={containerRef}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
);

