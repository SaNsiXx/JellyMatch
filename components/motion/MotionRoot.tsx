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
      // Entrances and counters start from IntersectionObservers rather than ScrollTriggers: the browser computes
      // them off the scroll path, where ~80 triggers were otherwise re-checked on every scroll event.
      const revealIO = new IntersectionObserver(
        (entries) => {
          const batch = entries.filter((e) => e.isIntersecting).map((e) => e.target);
          if (!batch.length) return;
          batch.forEach((t) => revealIO.unobserve(t));
          // blocks entering together cascade in DOM order (card → image → text)
          batch.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
          gsap.to(batch, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "expo.out", stagger: 0.06, clearProps: "filter" });
        },
        { rootMargin: "0px 0px -6% 0px" }, // as soon as a block peeks in
      );
      const countIO = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            countIO.unobserve(e.target);
            const el = e.target as HTMLElement;
            const end = Number(el.dataset.count);
            const suffix = el.dataset.suffix ?? "";
            const state = { v: end === 0 ? 100 : 0 };
            gsap.to(state, {
              v: end,
              duration: end === 0 ? 1.6 : 2,
              ease: "power3.out",
              onUpdate: () => (el.textContent = `${Math.round(state.v)}${suffix}`),
            });
          }),
        { rootMargin: "0px 0px -10% 0px" },
      );
      const ctx = gsap.context(() => {
        // Section entrances: fade + rise + blur (blur on desktop only — cheaper on phones).
        gsap.set("[data-reveal]", { y: 28, filter: desktop ? "blur(8px)" : "none" });
        document.querySelectorAll("[data-reveal]").forEach((el) => revealIO.observe(el));

        // Counters
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          el.textContent = `${end === 0 ? 100 : 0}${el.dataset.suffix ?? ""}`;
          countIO.observe(el);
        });
      });
      ScrollTrigger.refresh();

      // Touch screens have no hover: [data-scroll-active] items light up (data-active) while they cross a band in
      // the middle of the screen, so they get the same state a mouse gives them on desktop. (An observer, not a
      // ScrollTrigger: it reads the live layout, so late images or folding lists can't leave stale positions.)
      const touch = !window.matchMedia("(hover: hover)").matches;
      const band = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.target.toggleAttribute("data-active", e.isIntersecting)),
        { rootMargin: "-42% 0px -42% 0px" },
      );
      if (touch) document.querySelectorAll("[data-scroll-active]").forEach((el) => band.observe(el));

      // gradient words: the brand gradient fades in once they're on screen (CSS transition on --grad-veil)
      const grad = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add("is-in");
            grad.unobserve(e.target);
          }),
        { rootMargin: "0px 0px -15% 0px" },
      );
      document.querySelectorAll(".grad-text").forEach((el) => grad.observe(el));
      return () => {
        revealIO.disconnect();
        countIO.disconnect();
        grad.disconnect();
        band.disconnect();
        ctx.revert();
      };
    },
    [pathname],
  );

  return null;
}
