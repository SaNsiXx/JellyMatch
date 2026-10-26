"use client";

import { useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { useGsap, prefersReducedMotion, onAppReady, hasFinePointer, scrollVelocity } from "@/lib/motion";
import { useContent } from "@/lib/content";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ButtonLink } from "@/components/ui/Button";
import type { JellyField } from "@/components/hero/jellyField";

/**
 * Hero with live WebGL jellies (components/hero/jellyField.ts).
 * Desktop (≥1024px, motion welcome) pins for a short scroll story: the copy drifts apart and blurs out while the
 * jelly cluster gathers into one big jelly that squeezes out lime drops (the shortlist) and the tagline assembles.
 * Phones get the jellies without the pin; reduced motion → one settled frame.
 * No GPU (WebGL missing or CPU-emulated) or too slow → a seamless video recorded from the same engine
 * (scripts/record-jellies.mjs) that follows the scroll story with transforms instead.
 */

type CaptureWindow = Window & { __jmCapture?: { period: number; scale?: number }; __jmField?: JellyField };
export function Hero() {
  const { hero, links, ui } = useContent();
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useGsap(({ gsap }) => {
    const el = root.current!;
    const reduced = prefersReducedMotion();
    let field: JellyField | null = null;
    let dead = false;
    let offReady = () => {};

    // the engine is a separate chunk, fetched once GSAP is in (after hydration — never competes with LCP)
    import("@/components/hero/jellyField")
      .then(({ JellyField }) => {
        if (dead || !canvas.current) return;
        const capture = (window as CaptureWindow).__jmCapture;
        field = new JellyField(canvas.current, {
          reduced,
          coarse: !hasFinePointer(),
          capture,
          onSlow: () => {
            console.warn("[Jelly Match] hero jellies too slow on this device — recorded version shown");
            if (!dead) setFallback(true);
          },
        });
        if (capture) (window as CaptureWindow).__jmField = field;
        else if (reduced) field.start();
        else offReady = onAppReady(() => field?.start());
      })
      .catch((err: unknown) => {
        // visible in the browser console — tells us why a visitor sees the recorded version
        console.info("[Jelly Match] hero jellies: recorded version shown —", err instanceof Error ? err.message : err);
        if (!dead) setFallback(true);
      });

    const tick = () => field?.setVelocity(scrollVelocity());
    gsap.ticker.add(tick);

    if (reduced) {
      return () => {
        dead = true;
        offReady();
        gsap.ticker.remove(tick);
        field?.destroy();
      };
    }

    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      gsap.set(q("[data-hero-in]"), { opacity: 0, y: 28 });
      gsap.set(q("[data-outro-char]"), { yPercent: 120, opacity: 0 });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const lines = q("#hero-title > span > span");
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "+=140%",
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              onUpdate: (st) => field?.setProgress(st.progress),
            },
          })
          // recorded fallback: drifts up, swells and dims so the tagline reads (the live jellies merge instead)
          .to(q("[data-jelly-video]"), { scale: 1.08, yPercent: -6, opacity: 0.45, duration: 0.8, ease: "power1.inOut" }, 0)
          // copy leaves: lines drift apart at different speeds and blur
          .to(q("[data-out='top']"), { y: -60, opacity: 0, duration: 0.22 }, 0)
          .to(lines, { y: (i: number) => -70 - i * 55, x: (i: number) => (i % 2 ? 40 : -20), opacity: 0, filter: "blur(12px)", duration: 0.42, stagger: 0.04 }, 0)
          .to(q("[data-out='bottom']"), { y: -40, opacity: 0, duration: 0.28, stagger: 0.03 }, 0.02)
          // tagline assembles while the big jelly squeezes out the shortlist
          .to(q("[data-outro-char]"), { yPercent: 0, opacity: 1, duration: 0.3, stagger: 0.008, ease: "power3.out" }, 0.58)
          .fromTo(q("[data-progress]"), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
      });
      mm.add("(max-width: 1023px)", () => {
        const st = { trigger: el, start: "top top", end: "bottom top", scrub: true };
        gsap.to(copy.current, { y: -80, opacity: 0.15, ease: "none", scrollTrigger: { ...st, onUpdate: (s: { progress: number }) => field?.setProgress(s.progress * 0.45) } });
      });
    }, el);

    const offIntro = onAppReady(() => {
      gsap.to(q("[data-hero-in]"), { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.09, delay: 0.55 });
    });

    return () => {
      dead = true;
      offReady();
      offIntro();
      gsap.ticker.remove(tick);
      ctx.revert();
      field?.destroy();
    };
  }, []);

  return (
    <section ref={root} id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pt-28 pb-12 md:justify-center md:pb-24 lg:h-[100svh]">
      {/* live jellies */}
      <canvas ref={canvas} aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 h-full w-full ${fallback ? "hidden" : ""}`} />
      {/* recorded jellies (always mounted so the scroll timeline can target the wrapper; video only on fallback) */}
      <div
        data-jelly-video=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,#000_10%,#000_72%,transparent)]"
      >
        {fallback && <JellyVideo />}
      </div>
      {/* phones: keep the copy readable where it overlaps the jellies */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-[62%] bg-[linear-gradient(to_top,var(--color-ink)_45%,transparent)] md:hidden" />

      <div ref={copy} className="container-jm relative z-20">
        <div data-out="top">
          <p data-hero-in="" className="eyebrow flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-10 bg-[image:var(--grad-match)]" />
            {hero.eyebrow}
          </p>
        </div>
        <SplitHeading
          as="h1"
          id="hero-title"
          lines={hero.titleLines}
          trigger="ready"
          delay={0.1}
          className="mt-6 font-display text-[clamp(2.6rem,11vw,4rem)] font-semibold md:text-[clamp(3.5rem,5.4vw,6rem)]"
        />
        <div data-out="bottom">
          <p data-hero-in="" className="lead mt-7 max-w-[30rem] text-fg/80 lg:max-w-[34rem]">{hero.body}</p>
        </div>
        <div data-out="bottom">
          <div data-hero-in="" className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={links.signUp} arrow>{hero.primary}</ButtonLink>
            <ButtonLink href={links.demo} variant="ghost">{hero.secondary}</ButtonLink>
          </div>
        </div>
      </div>

      {/* tagline assembled at the end of the pinned scroll (decorative — the same words are in the marquee) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[14%] z-20 hidden lg:block lg:motion-reduce:hidden">
        <p className="container-jm font-display text-[clamp(2.5rem,4.6vw,5rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
          {ui.heroOutro.map((line, li) => (
            <span key={line} className="block">
              {line.split(" ").map((w, wi) => (
                <span key={wi} className="inline-block overflow-hidden pb-[0.1em] align-top">
                  {li === 1 ? (
                    <span data-outro-char="" className="grad-text inline-block">{w}&nbsp;</span>
                  ) : (
                    Array.from(`${w} `).map((c, ci) => (
                      <span key={ci} data-outro-char="" className="inline-block">{c}</span>
                    ))
                  )}
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>

      {/* scroll progress + cue */}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 z-20 hidden h-px bg-line lg:block">
        <span data-progress="" className="block h-full origin-left scale-x-0 bg-[image:var(--grad-match)]" />
      </span>
      <div data-out="bottom" className="absolute right-4 bottom-10 z-20 hidden md:right-8 md:block">
        <a
          href="#korzysci"
          data-hero-in=""
          className="group flex items-center gap-3 font-mono text-[11px] tracking-[0.24em] text-muted uppercase transition-colors hover:text-fg"
        >
          {ui.scroll}
          <span className="flex size-10 items-center justify-center rounded-full border border-line transition-colors group-hover:border-lime">
            <ArrowDown aria-hidden="true" className="size-4 motion-safe:animate-bounce" />
          </span>
        </a>
      </div>
    </section>
  );
}

/** Recorded jellies (WebM with alpha; MP4 on the page colour for Safari). Landscape or portrait cut. */
function JellyVideo() {
  const reduced = prefersReducedMotion();
  // picked once on mount (it's only rendered after the client decided on the fallback) so just one file downloads
  const v = window.matchMedia("(min-aspect-ratio: 1/1)").matches ? "wide" : "tall";
  return (
    <video
      className={`h-full w-full object-cover ${v === "wide" ? "object-right" : "object-top"}`}
      poster={`/assets/hero-jellies-${v}.webp`}
      autoPlay={!reduced}
      loop
      muted
      playsInline
      preload={reduced ? "none" : "auto"}
    >
      <source src={`/assets/hero-jellies-${v}.webm`} type="video/webm" />
      <source src={`/assets/hero-jellies-${v}.mp4`} type="video/mp4" />
    </video>
  );
}
