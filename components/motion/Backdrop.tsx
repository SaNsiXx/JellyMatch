"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { prefersReducedMotion, hasFinePointer } from "@/lib/motion";

/**
 * Site-wide animated background (fixed, behind everything):
 *  - three colour auras that drift on their own (CSS) and travel/swap as the page scrolls
 *  - a faint dot grid with a spotlight that follows the cursor
 *  - a few glossy jelly droplets (always perfectly round) near the edges, on several depths: parallax on scroll,
 *    and they shy away from the cursor. On the home page they fade in below the hero (it has its own jellies).
 * Transforms/opacity only, one rAF loop that sleeps while nothing moves. Reduced motion → still frame;
 * no GPU (html[data-no-gpu], set by the hero) → droplets and spotlight are hidden in CSS and the loop idles.
 */

type Drop = { x: number; y: number; size: number; depth: number; kind: "lime" | "violet" | "blend"; ph: number };

// x in % of the viewport width, y in % of a band 1.3 viewports tall (droplets wrap around it while scrolling);
// kept few and near the edges so they don't sit behind the copy
const DROPS: Drop[] = [
  { x: 6, y: 12, size: 54, depth: 0.9, kind: "violet", ph: 0.2 },
  { x: 88, y: 20, size: 34, depth: 0.7, kind: "lime", ph: 1.4 },
  { x: 14, y: 58, size: 22, depth: 0.45, kind: "blend", ph: 3.1 },
  { x: 93, y: 74, size: 46, depth: 0.8, kind: "violet", ph: 5.0 },
  { x: 4, y: 112, size: 30, depth: 0.55, kind: "lime", ph: 3.7 },
  { x: 82, y: 120, size: 20, depth: 0.4, kind: "blend", ph: 4.8 },
];
const BAND = 1.3;

export function Backdrop() {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const hero = useRef<HTMLElement | null>(null);

  useEffect(() => {
    hero.current = document.getElementById("top");
  }, [pathname]);

  useEffect(() => {
    const el = root.current!;
    const drops = Array.from(el.querySelectorAll<HTMLElement>("[data-drop]"));
    const violet = el.querySelector<HTMLElement>("[data-aura='violet']")!;
    const lime = el.querySelector<HTMLElement>("[data-aura='lime']")!;
    const blend = el.querySelector<HTMLElement>("[data-aura='blend']")!;
    const field = el.querySelector<HTMLElement>("[data-drops]")!;
    const reduced = prefersReducedMotion();
    const fine = hasFinePointer();

    const state = DROPS.map(() => ({ px: 0, py: 0, vx: 0, vy: 0 }));
    const pointer = { x: -1e4, y: -1e4, active: false };
    let raf = 0;
    let last = 0;
    let t = 0;
    // Mobile browsers change innerHeight whenever their toolbar shows or hides (at the bottom of the page, on the
    // first swipe back up) — laying the droplets out on it made them all jump. Use the tallest height seen at
    // this width instead; only a real resize (new width, e.g. rotation) resets it.
    let stableW = 0;
    let stableH = 0;

    const frame = (now: number) => {
      raf = 0;
      if (document.hidden) return;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      t += dt;
      const W = window.innerWidth;
      if (W !== stableW) {
        stableW = W;
        stableH = 0;
      }
      stableH = Math.max(stableH, window.innerHeight);
      const H = stableH;
      const sy = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - H);
      const p = sy / max;

      // auras travel through the page: violet sinks, lime rises, the pale blend swells in the middle
      violet.style.transform = `translate3d(${p * 18}vw, ${p * 70}vh, 0)`;
      lime.style.transform = `translate3d(${-p * 22}vw, ${-p * 55}vh, 0) scale(${1 + p * 0.3})`;
      blend.style.opacity = String(Math.sin(Math.PI * Math.min(1, p * 1.15)) * 0.9);

      // droplets fade in once the hero (with its own live jellies, pinned for a while on desktop) scrolls away
      const heroBottom = hero.current?.isConnected ? hero.current.getBoundingClientRect().bottom : -1;
      const gate = heroBottom < 0 ? 1 : Math.min(1, Math.max(0, (H * 0.85 - heroBottom) / (H * 0.5)));
      field.style.opacity = String(gate);

      if (!reduced && gate > 0 && !document.documentElement.hasAttribute("data-no-gpu")) {
        const band = H * BAND;
        DROPS.forEach((d, i) => {
          const s = state[i]!;
          const baseX = (d.x / 100) * W + Math.sin(t * 0.21 + d.ph) * 24 * d.depth;
          let baseY = (d.y / 100) * band - sy * d.depth * 0.45 + Math.cos(t * 0.17 + d.ph * 1.3) * 18 * d.depth;
          baseY = ((baseY % band) + band) % band - H * 0.15;
          // shy away from the cursor (springy, so they wobble back)
          let tx = 0;
          let ty = 0;
          if (pointer.active) {
            const dx = baseX - pointer.x;
            const dy = baseY - pointer.y;
            const dist = Math.hypot(dx, dy);
            const reach = 140 + d.size;
            if (dist < reach && dist > 0.1) {
              const push = (1 - dist / reach) ** 2 * 70 * d.depth;
              tx = (dx / dist) * push;
              ty = (dy / dist) * push;
            }
          }
          s.vx += ((tx - s.px) * 90 - s.vx * 11) * dt;
          s.vy += ((ty - s.py) * 90 - s.vy * 11) * dt;
          s.px += s.vx * dt;
          s.py += s.vy * dt;
          // breathing is a uniform scale, so they stay perfectly round
          const breathe = 1 + Math.sin(t * 1.9 + d.ph) * 0.04;
          drops[i]!.style.transform = `translate3d(${baseX + s.px - d.size / 2}px, ${baseY + s.py - d.size / 2}px, 0) scale(${breathe})`;
        });
      }
      if (!reduced) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    // spotlight on the dot grid + droplet repulsion
    let pr = 0;
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      if (pr) return;
      pr = requestAnimationFrame(() => {
        pr = 0;
        el.style.setProperty("--mx", `${pointer.x}px`);
        el.style.setProperty("--my", `${pointer.y}px`);
      });
    };
    const onLeave = () => (pointer.active = false);
    if (fine && !reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    const onVis = () => !document.hidden && kick();
    document.addEventListener("visibilitychange", onVis);
    // reduced motion: no loop — the auras just follow the scroll position, one frame per scroll event
    if (reduced) window.addEventListener("scroll", kick, { passive: true });
    kick();
    return () => {
      window.removeEventListener("scroll", kick);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(pr);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={root} className="backdrop" aria-hidden="true">
      <div data-aura="violet" className="aura-track">
        <div className="aura aura-violet" />
      </div>
      <div data-aura="lime" className="aura-track">
        <div className="aura aura-lime" />
      </div>
      <div data-aura="blend" className="aura-track opacity-0">
        <div className="aura aura-blend" />
      </div>
      <div className="bg-grid" />
      <div className="bg-grid bg-grid-spot" />
      <div data-drops="" className="bg-drops">
        {DROPS.map((d, i) => (
          <span
            key={i}
            data-drop=""
            className={`bg-drop bg-drop-${d.kind}`}
            style={{
              width: d.size,
              height: d.size,
              fontSize: d.size, // rim insets in em scale with the droplet
              // secondary to the main jelly: dim and slightly out of focus, so they never compete with the copy
              opacity: 0.16 + d.depth * 0.24,
              filter: `blur(${(1 - d.depth) * 3}px)`,
              transform: `translate3d(${d.x}vw, ${(d.y / BAND) * 0.9}vh, 0)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
