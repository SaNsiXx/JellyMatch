"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import data from "@/lib/mascot-sparks.json";

/**
 * The celebrating mascot's jelly confetti, live (cut out of the render by scripts/split-mascot.mjs).
 * Each time the section scrolls into view the pieces burst out of the bird, overshoot like jelly and settle a little
 * further out, then keep drifting and turning slowly. One canvas, one sprite image; the loop runs only while visible.
 * Reduced motion: the pieces are drawn once where the render had them.
 */
const { size: SIZE, sparks: SPARKS } = data;
const C = SIZE / 2;

export function MascotSparks({ onBurst, className = "" }: { onBurst?: () => void; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const burstCb = useRef(onBurst);
  useEffect(() => {
    burstCb.current = onBurst;
  });

  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext("2d")!;
    const reduced = prefersReducedMotion();
    // fetched only when the section comes near (it sits at the very bottom of the page)
    const img = new Image();
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        img.src = "/assets/mascot-celebrate-sparks.webp";
        near.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    near.observe(el);
    // per piece: direction out of the bird, distance, phase, spin
    const parts = SPARKS.map((s, i) => {
      const dx = s.cx - C;
      const dy = s.cy - C;
      const dist = Math.max(1, Math.hypot(dx, dy));
      return { ...s, ux: dx / dist, uy: dy / dist, dist, ph: i * 2.399, spin: (i % 2 ? 1 : -1) * (1 + (i % 5) * 0.3) };
    });
    let raf = 0;
    let visible = false;
    let armed = true;
    let born = -1; // time of the last burst (s); -1 = not yet
    let k = 1;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(el.clientWidth * dpr);
      el.height = Math.round(el.clientHeight * dpr);
      k = el.width / SIZE;
      if (reduced) draw(1e3, 0);
    };

    function draw(e: number, t: number) {
      ctx.clearRect(0, 0, el.width, el.height);
      if (e < 0 || !img.naturalWidth) return; // not burst yet, or the sprite isn't loaded
      ctx.globalCompositeOperation = "lighter";
      // radial spring: from 25% of the way out → overshoot → settle 8% further out than the render
      const f = reduced ? 1 : 1.08 - 0.83 * Math.exp(-e * 4) * Math.cos(e * 5);
      const grow = reduced ? 1 : Math.min(1, e * 2.5);
      for (const p of parts) {
        const out = f + (reduced ? 0 : Math.sin(t * 0.2 + p.ph) * 0.02);
        const x = C + p.ux * p.dist * out + (reduced ? 0 : Math.sin(t * 0.35 + p.ph) * 6 + Math.sin(t * 0.13 + p.ph * 2) * 4);
        const y = C + p.uy * p.dist * out + (reduced ? 0 : Math.cos(t * 0.28 + p.ph) * 6);
        const rot = reduced ? 0 : p.spin * Math.exp(-e * 2.5) + Math.sin(t * 0.4 + p.ph) * 0.25;
        const s = 0.3 + 0.7 * grow;
        ctx.globalAlpha = Math.min(1, grow * 1.2);
        ctx.setTransform(k * s, 0, 0, k * s, x * k, y * k);
        ctx.rotate(rot);
        ctx.drawImage(img, p.x, p.y, p.w, p.h, p.x - p.cx, p.y - p.cy, p.w, p.h);
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
    }

    const loop = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const t = now / 1000;
      draw(born < 0 ? -1 : t - born, t);
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        visible = entry.isIntersecting;
        if (!visible) {
          armed = true; // left the screen: burst again on the way back
          return;
        }
        if (reduced) return;
        if (armed && entry.intersectionRatio >= 0.35) {
          armed = false;
          born = performance.now() / 1000;
          burstCb.current?.();
        }
        if (!raf) raf = requestAnimationFrame(loop);
      },
      { threshold: [0, 0.35] },
    );
    io.observe(el);
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    img.onload = resize;
    const onVis = () => !document.hidden && visible && !raf && !reduced && (raf = requestAnimationFrame(loop));
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      near.disconnect();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={canvas} aria-hidden="true" className={className} />;
}
