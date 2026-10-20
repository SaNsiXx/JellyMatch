"use client";

import { useEffect, type DependencyList } from "react";

type GsapModule = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

let loading: Promise<GsapModule> | null = null;

/** GSAP + ScrollTrigger are fetched after hydration so they stay out of the critical path (LCP). */
export function loadGsap(): Promise<GsapModule> {
  loading ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, s]) => {
    g.gsap.registerPlugin(s.ScrollTrigger);
    return { gsap: g.gsap, ScrollTrigger: s.ScrollTrigger };
  });
  return loading;
}

/** useEffect that runs once GSAP is available; the callback may return a cleanup. */
export function useGsap(fn: (m: GsapModule) => void | (() => void), deps: DependencyList = []) {
  useEffect(() => {
    let dead = false;
    let cleanup: void | (() => void);
    loadGsap().then((m) => {
      if (!dead) cleanup = fn(m);
    });
    return () => {
      dead = true;
      if (typeof cleanup === "function") cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- callers pass their own deps
  }, deps);
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Fires once the preloader has finished (or immediately when it was skipped). */
export function onAppReady(cb: () => void) {
  const w = window as Window & { __jmReady?: boolean };
  if (w.__jmReady) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener("jm:ready", handler, { once: true });
  return () => window.removeEventListener("jm:ready", handler);
}

export function markAppReady() {
  const w = window as Window & { __jmReady?: boolean };
  if (w.__jmReady) return;
  w.__jmReady = true;
  window.dispatchEvent(new Event("jm:ready"));
}

/** Current Lenis scroll velocity (px/frame), 0 when smooth scroll is off. */
export const scrollVelocity = () => (window as Window & { __lenis?: { velocity: number } }).__lenis?.velocity ?? 0;
