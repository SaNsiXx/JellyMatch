"use client";

import { useRef } from "react";
import { useGsap, prefersReducedMotion, scrollVelocity } from "@/lib/motion";
import { useContent } from "@/lib/content";
import { LogoMark } from "@/components/Logo";

function Row({ items, outline = false }: { items: string[]; outline?: boolean }) {
  // Content rendered twice → shifting by one copy's width loops seamlessly.
  const copy = (k: string) => (
    <ul key={k} className="flex shrink-0 items-center" aria-hidden={k === "b" ? true : undefined}>
      {items.map((t) => (
        <li key={t} className="flex items-center">
          <span
            className={`px-4 font-display text-[clamp(1.125rem,2vw,1.75rem)] font-semibold tracking-[-0.03em] whitespace-nowrap md:px-6 ${
              outline ? "text-muted" : "text-fg"
            }`}
          >
            {t}
          </span>
          <LogoMark className="h-[clamp(0.85rem,1.2vw,1.1rem)] w-auto shrink-0" />
        </li>
      ))}
    </ul>
  );
  return <div className="marquee-row">{[copy("a"), copy("b")]}</div>;
}

/** Two counter-running rows; speed follows scroll velocity. Pauses on hover; static under reduced motion. */
export function Marquee() {
  const { marquee, ui } = useContent();
  const root = useRef<HTMLDivElement>(null);
  const half = Math.ceil(marquee.length / 2);

  useGsap(({ gsap }) => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const rows = Array.from(el.querySelectorAll<HTMLElement>(".marquee-row"));
    const pos = rows.map(() => 0);
    let hover = 0;
    let boost = 0;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
    io.observe(el);
    const enter = () => (hover = 1);
    const leave = () => (hover = 0);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);

    const tick = (_t: number, dt: number) => {
      if (!visible) return;
      const v = scrollVelocity();
      boost += (Math.min(Math.abs(v) * 0.6, 14) - boost) * 0.08;
      const speed = (1 + boost) * (hover ? 0.25 : 1) * (dt / 16.67) * 0.9;
      rows.forEach((row, i) => {
        const w = row.scrollWidth / 2;
        const dir = i % 2 === 0 ? -1 : 1;
        pos[i] = ((pos[i]! + dir * speed) % w + w) % w;
        row.style.transform = `translate3d(${-pos[i]!}px,0,0)`;
      });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <section aria-label={ui.marqueeLabel} className="relative overflow-hidden border-y border-line py-5 md:py-6">
      <p className="sr-only">{marquee.join(" • ")}</p>
      <div ref={root} aria-hidden="true" className="flex flex-col gap-2 md:gap-3">
        <Row items={marquee.slice(0, half)} />
        <Row items={marquee.slice(half)} outline />
      </div>
    </section>
  );
}
