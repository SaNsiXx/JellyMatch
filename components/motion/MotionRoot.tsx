"use client";

import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { useGsap, prefersReducedMotion, hasFinePointer } from "@/lib/motion";

type LenisWindow = Window & { __lenis?: Lenis };

/**
 * Site-wide motion, mounted once in the layout: Lenis smooth scroll driven by the GSAP ticker and the card
 * spotlight (--sx/--sy). Scroll entrances ([data-reveal]) and counters ([data-count]) are re-armed on every
 * route change so client-side navigation between subpages animates too. Skipped under reduced motion.
 */
export function MotionRoot() {
  const pathname = usePathname();

  useGsap(({ gsap, ScrollTrigger }) => {
    if (prefersReducedMotion()) {
      document.documentElement.classList.add("no-gsap");
      return;
    }

    // Lenis is fetched after hydration — smooth scroll is an enhancement, not part of the first payload.
    let lenis: Lenis | null = null;
    let disposed = false;
    const tick = (time: number) => lenis?.raf(time * 1000);
    import("lenis").then(({ default: L }) => {
      if (disposed) return;
      lenis = new L({ lerp: 0.1, anchors: { offset: -80 }, autoRaf: false });
      (window as LenisWindow).__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    });

    // Card spotlight (one delegated listener)
    let raf = 0;
    let last: PointerEvent | null = null;
    const onMove = (e: PointerEvent) => {
      last = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const card = last?.target instanceof Element ? last.target.closest<HTMLElement>(".card") : null;
        if (!card || !last) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--sx", `${last.clientX - r.left}px`);
        card.style.setProperty("--sy", `${last.clientY - r.top}px`);
      });
    };
    if (hasFinePointer()) document.addEventListener("pointermove", onMove, { passive: true });

    // Images/fonts change layout after load → refresh trigger positions once.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      disposed = true;
      gsap.ticker.remove(tick);
      lenis?.destroy();
      delete (window as LenisWindow).__lenis;
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("load", refresh);
      cancelAnimationFrame(raf);
    };
  }, []);

  useGsap(
    ({ gsap, ScrollTrigger }) => {
      if (prefersReducedMotion()) return;
      // a new page starts at the top unless it targets an anchor
      if (!window.location.hash) (window as LenisWindow).__lenis?.scrollTo(0, { immediate: true });

      const desktop = window.matchMedia("(min-width: 768px)").matches;
      const ctx = gsap.context(() => {
        // Section entrances: fade + rise + blur (blur on desktop only — cheaper on phones).
        gsap.set("[data-reveal]", { y: 40, filter: desktop ? "blur(8px)" : "none" });
        ScrollTrigger.batch("[data-reveal]", {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.08,
              clearProps: "filter",
            }),
        });

        // Counters
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          const suffix = el.dataset.suffix ?? "";
          const state = { v: end === 0 ? 100 : 0 };
          const render = () => (el.textContent = `${Math.round(state.v)}${suffix}`);
          render();
          gsap.to(state, {
            v: end,
            duration: end === 0 ? 1.6 : 2,
            ease: "power3.out",
            onUpdate: render,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });
      });
      ScrollTrigger.refresh();
      return () => ctx.revert();
    },
    [pathname],
  );

  return null;
}
