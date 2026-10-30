"use client";

import { useEffect } from "react";

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => matchMedia("(hover: hover) and (pointer: fine)").matches;

function setupReveals() {
  const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        (e.target as HTMLElement).dataset.shown = "";
        io.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

/** Counters keep their final value in the HTML and only animate when they come into view. */
function setupCounters() {
  const els = document.querySelectorAll<HTMLElement>("[data-count]");
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        const el = e.target as HTMLElement;
        const to = Number(el.dataset.count);
        if (!to) continue;
        const t0 = performance.now();
        const step = (t: number) => {
          const p = Math.min((t - t0) / 1400, 1);
          el.textContent = String(Math.round(to * (1 - (1 - p) ** 4)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    },
    { threshold: 0.6 },
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

/** Delegated pointer effects: card glow and magnetic buttons. */
function setupPointer() {
  let magnet: HTMLElement | null = null;
  const release = () => {
    if (magnet) magnet.style.transform = "";
    magnet = null;
  };
  const move = (e: PointerEvent) => {
    const t = e.target as Element | null;
    const card = t?.closest<HTMLElement>("[data-glow]");
    if (card) {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    }
    const m = t?.closest<HTMLElement>("[data-magnetic]") ?? null;
    if (m !== magnet) release();
    if (m) {
      magnet = m;
      const r = m.getBoundingClientRect();
      const dx = ((e.clientX - (r.left + r.width / 2)) / r.width) * 16;
      const dy = ((e.clientY - (r.top + r.height / 2)) / r.height) * 12;
      m.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    }
  };
  document.addEventListener("pointermove", move, { passive: true });
  return () => document.removeEventListener("pointermove", move);
}

async function setupScroll(isCancelled: () => boolean) {
  const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("lenis"),
  ]);
  if (isCancelled()) return () => {};
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -80 } });
  lenis.on("scroll", ScrollTrigger.update);
  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  const ctx = gsap.context(() => {
    gsap.to('[data-parallax="hero"]', { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to('[data-parallax="hero-copy"]', { y: -70, opacity: 0.1, ease: "none", scrollTrigger: { trigger: ".hero", start: "40% top", end: "bottom top", scrub: true } });
    gsap.utils.toArray<HTMLElement>('[data-parallax="aura"]').forEach((el) => {
      gsap.fromTo(el, { yPercent: -10 }, { yPercent: 10, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });

    const section = document.querySelector<HTMLElement>("[data-ai]");
    if (!section) return;
    section.dataset.pinned = "true";
    const stage = section.querySelector<HTMLElement>(".ai-stage")!;
    const copies = gsap.utils.toArray<HTMLElement>("[data-ai-copy]", section);
    const visuals = gsap.utils.toArray<HTMLElement>("[data-ai-visual]", section);
    gsap.set(copies.slice(1), { autoAlpha: 0, y: 28 });
    gsap.set(visuals.slice(1), { autoAlpha: 0, scale: 1.04 });

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: { trigger: section, pin: stage, start: "top top", end: "+=240%", scrub: 0.6, anticipatePin: 1 },
    });
    tl.to("[data-ai-rail]", { scaleX: 1, duration: 3, ease: "none" }, 0);
    for (let i = 1; i < copies.length; i++) {
      const at = i * 1 - 0.1;
      tl.to(copies[i - 1]!, { autoAlpha: 0, y: -28, duration: 0.3 }, at)
        .to(visuals[i - 1]!, { autoAlpha: 0, duration: 0.35 }, at)
        .to(copies[i]!, { autoAlpha: 1, y: 0, duration: 0.3 }, at + 0.2)
        .to(visuals[i]!, { autoAlpha: 1, scale: 1, duration: 0.35 }, at + 0.1);
    }
    const scan = section.querySelector("[data-ai-scan]");
    if (scan) {
      tl.set(scan, { opacity: 1 }, 1.1).fromTo(scan, { yPercent: 0, top: "6%" }, { top: "94%", duration: 0.8, ease: "none" }, 1.1).set(scan, { opacity: 0 }, 1.9);
    }
  });

  return () => {
    ctx.revert();
    gsap.ticker.remove(raf);
    lenis.destroy();
  };
}

/** Client wiring for everything that moves. Nothing here is required to read or use the page. */
export function MotionRoot() {
  useEffect(() => {
    if (reduced()) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => { el.dataset.shown = ""; });
      return;
    }
    const cleanups = [setupReveals(), setupCounters()];
    if (finePointer()) cleanups.push(setupPointer());

    let cancelled = false;
    let scrollCleanup: (() => void) | undefined;
    const start = () => {
      setupScroll(() => cancelled).then((fn) => {
        if (cancelled) fn();
        else scrollCleanup = fn;
      });
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
      cleanups.forEach((fn) => fn());
      scrollCleanup?.();
    };
  }, []);

  return null;
}
