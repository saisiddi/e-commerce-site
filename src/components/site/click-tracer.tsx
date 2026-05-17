"use client";

import { useEffect } from "react";

export default function ClickTracer() {
  useEffect(() => {
    function handler(e: MouseEvent) {
      try {
        // eslint-disable-next-line no-console
        console.log("click-tracer: click ->", {
          target: (e.target as HTMLElement)?.outerHTML?.slice?.(0, 200),
          type: e.type,
          defaultPrevented: e.defaultPrevented,
          time: Date.now(),
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log("click-tracer: click error", err);
      }
    }

    window.addEventListener("click", handler, true);
    return () => window.removeEventListener("click", handler, true);
  }, []);

  return null;
}
