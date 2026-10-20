"use client";

import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { useGsap, prefersReducedMotion, onAppReady } from "@/lib/motion";
import { hero, links } from "@/lib/content";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ButtonLink } from "@/components/ui/Button";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  // Video only on larger screens with motion welcome and no data saver; phones keep the poster (LCP + data).
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (prefersReducedMotion() || conn?.saveData || !window.matchMedia("(min-width: 768px)").matches) return;
    const load = () => {
      v.querySelectorAll<HTMLSourceElement>("source[data-src]").forEach((s) => (s.src = s.dataset.src!));
      v.load();
      v.play().catch(() => {});
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const kick = () => (idle ? idle(load) : setTimeout(load, 200));
    if (document.readyState === "complete") kick();
    else window.addEventListener("load", kick, { once: true });
    const io = new IntersectionObserver(([e]) => (e?.isIntersecting ? v.play().catch(() => {}) : v.pause()));
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useGsap(({ gsap }) => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-hero-in]", { opacity: 0, y: 28 });
      gsap.set(media.current, { scale: 1.12 }); // stays visible: the poster is the LCP element (painted under the preloader)
      // Parallax out: media zooms and drifts, copy lifts and fades.
      gsap.to(media.current, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(copy.current, {
        y: -120,
        opacity: 0.1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    const off = onAppReady(() => {
      gsap.to(media.current, { scale: 1, duration: 2.2, ease: "expo.out" });
      gsap.to(root.current!.querySelectorAll("[data-hero-in]"), { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.09, delay: 0.55 });
    });
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pt-28 pb-12 md:justify-center md:pb-24">
      <div ref={media} className="absolute inset-0 -z-10 will-change-transform" aria-hidden="true">
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover object-[70%_50%] md:object-[60%_50%]"
          muted
          loop
          playsInline
          preload="none"
        >
          <source data-src="/assets/hero-loop.webm" type="video/webm" />
          <source data-src="/assets/hero-loop.mp4" type="video/mp4" />
        </video>
        {/* poster as a real responsive image so it is the LCP candidate and phones get a small file */}
        <picture className="absolute inset-0 -z-10">
          <source type="image/avif" srcSet="/assets/hero-loop-poster-960.avif 960w, /assets/hero-loop-poster-1920.avif 1920w" sizes="100vw" />
          <source type="image/webp" srcSet="/assets/hero-loop-poster-960.webp 960w, /assets/hero-loop-poster-1920.webp 1920w" sizes="100vw" />
          <img src="/assets/hero-loop-poster-1920.webp" alt="" width={1920} height={1080} fetchPriority="high" className="h-full w-full object-cover object-[70%_50%] md:object-[60%_50%]" />
        </picture>
      </div>
      {/* readability scrims */}
      <div aria-hidden="true" className="hero-scrim pointer-events-none absolute inset-0 -z-[5]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-40 bg-[linear-gradient(to_top,var(--color-ink),transparent)]" />

      <div ref={copy} className="container-jm relative">
        <p data-hero-in="" className="eyebrow flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-10 bg-[image:var(--grad-match)]" />
          {hero.eyebrow}
        </p>
        <SplitHeading
          as="h1"
          id="hero-title"
          lines={hero.titleLines}
          trigger="ready"
          delay={0.1}
          className="mt-6 font-display text-[clamp(2.6rem,11vw,4rem)] font-semibold md:text-[clamp(3.5rem,5.4vw,6rem)]"
        />
        <p data-hero-in="" className="lead mt-7 max-w-[30rem] text-fg/80 lg:max-w-[38rem]">{hero.body}</p>
        <div data-hero-in="" className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <ButtonLink href={links.signUp} arrow cursor="Start">{hero.primary}</ButtonLink>
          <ButtonLink href={links.demo} variant="ghost" cursor="Demo">{hero.secondary}</ButtonLink>
        </div>
      </div>

      <a
        href="#korzysci"
        data-hero-in=""
        className="group absolute right-4 bottom-10 hidden items-center gap-3 font-mono text-[11px] tracking-[0.24em] text-muted uppercase transition-colors hover:text-fg md:right-8 md:flex"
      >
        Przewiń
        <span className="flex size-10 items-center justify-center rounded-full border border-line transition-colors group-hover:border-lime">
          <ArrowDown aria-hidden="true" className="size-4 motion-safe:animate-bounce" />
        </span>
      </a>
    </section>
  );
}
