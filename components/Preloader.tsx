"use client";

import { useEffect, useRef } from "react";
import { LogoMark } from "./Logo";

/** The logo halves merge into a drop, then a curtain lifts. Sets html[data-ready], which starts the hero entrance. */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ready = () => document.documentElement.setAttribute("data-ready", "");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ready();
      return;
    }
    const lift = window.setTimeout(() => {
      if (ref.current) ref.current.dataset.out = "true";
      ready();
    }, 1100);
    return () => window.clearTimeout(lift);
  }, []);

  return (
    <div ref={ref} className="preloader" aria-hidden="true">
      <LogoMark size={132} animated />
    </div>
  );
}
