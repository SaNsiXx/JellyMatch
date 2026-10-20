"use client";

import { useEffect, useRef, useState } from "react";
import { loadGsap, prefersReducedMotion, markAppReady } from "@/lib/motion";
import { LogoMark } from "./Logo";

const SEEN = "jm-preloaded";

/**
 * Logo arches draw in, the overlap drop fills, a counter runs to 100, then the curtain lifts into the hero.
 * Shown once per tab session; skipped under reduced motion and without JS (see <noscript> in layout).
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN) === "1";
      sessionStorage.setItem(SEEN, "1");
    } catch {}
    const el = root.current;
    if (!el || seen || prefersReducedMotion()) {
      setDone(true);
      markAppReady();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    let dead = false;
    let tl: { kill(): void } | null = null;
    const finish = () => {
      document.documentElement.style.overflow = "";
      markAppReady();
      setDone(true);
    };
    // never trap the page behind the curtain if the animation chunk fails to load
    const safety = window.setTimeout(finish, 6000);
    loadGsap().then(({ gsap }) => {
      if (dead) return;
      const n = { v: 0 };
      const arches = el.querySelectorAll("[data-draw]");
      const blend = el.querySelector("[data-blend]");
      tl = gsap
        .timeline({
          onComplete: () => {
            window.clearTimeout(safety);
            finish();
          },
        })
        .to(arches, { strokeDashoffset: 0, duration: 0.9, ease: "power3.inOut", stagger: 0.12 }, 0.1)
        .to(n, { v: 100, duration: 1.15, ease: "power2.inOut", onUpdate: () => count.current && (count.current.textContent = String(Math.round(n.v)).padStart(3, "0")) }, 0)
        .to(blend, { opacity: 1, duration: 0.4 }, 0.85)
        .fromTo(el.querySelector(".logo-mark"), { scale: 1 }, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.inOut", transformOrigin: "50% 90%" }, 1.15)
        .to(el.querySelectorAll("[data-pl-fade]"), { opacity: 0, y: -16, duration: 0.4, ease: "power2.in" }, 1.4)
        .add(() => markAppReady(), 1.55)
        .to(el, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, 1.5)
        .to(el.querySelector("[data-pl-edge]"), { scaleY: 1, duration: 0.9, ease: "expo.inOut" }, 1.5);
    });
    return () => {
      dead = true;
      window.clearTimeout(safety);
      tl?.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (done) return null;
  return (
    <div ref={root} className="preloader fixed inset-0 z-[80] flex items-center justify-center bg-ink" aria-hidden="true">
      <div className="flex flex-col items-center gap-6" data-pl-fade="">
        <LogoMark draw className="h-20 w-auto sm:h-24" />
        <span className="font-display text-xl font-bold tracking-[-0.045em]">Jelly Match</span>
      </div>
      <span ref={count} data-pl-fade="" className="tabular absolute right-6 bottom-6 font-mono text-xs tracking-[0.24em] text-muted sm:right-10 sm:bottom-10">
        000
      </span>
      {/* lime edge that trails the lifting curtain */}
      <span data-pl-edge="" className="absolute inset-x-0 top-full h-24 origin-top scale-y-0 bg-[linear-gradient(var(--color-lime),var(--color-violet))]" />
    </div>
  );
}
