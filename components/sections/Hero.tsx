"use client";

import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { useGsap, prefersReducedMotion, onAppReady, hasFinePointer } from "@/lib/motion";
import { useContent } from "@/lib/content";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";

/** Floating Higgsfield objects layered over the scene. `depth` scales both scroll and pointer parallax. */
const floats = [
  { name: "float-card", depth: 1, className: "top-[9%] left-[39%] w-[13vw] max-w-[230px] rotate-[-8deg]" },
  { name: "float-orbs", depth: 0.55, className: "bottom-[6%] left-[34%] w-[12vw] max-w-[210px]" },
  { name: "float-drop", depth: 1.4, className: "top-[16%] right-[4%] w-[8vw] max-w-[140px]" },
];

/**
 * Pinned scroll story (≥1024px, motion welcome):
 *  1. headline lines drift apart and blur out, copy fades;
 *  2. the full-bleed scene closes into a rounded card while the camera pushes into the jelly machine;
 *  3. floating objects fly past at different depths; the tagline assembles inside the card.
 * Smaller screens get a light parallax; reduced motion gets a static hero.
 */
export function Hero() {
  const { hero, links, ui } = useContent();
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
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
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      gsap.set(q("[data-hero-in]"), { opacity: 0, y: 28 });
      gsap.set(q("[data-float-in]"), { opacity: 0, y: 80, scale: 0.85 });
      gsap.set(media.current, { scale: 1.12 }); // stays visible: the poster is the LCP element (painted under the preloader)
      gsap.set(q("[data-outro-char]"), { yPercent: 120, opacity: 0 });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const lines = q("#hero-title > span > span");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=150%", pin: true, scrub: 1, anticipatePin: 1 },
        });
        // 1 — copy leaves: lines drift apart at different speeds and blur
        tl.to(q("[data-out='top']"), { y: -60, opacity: 0, duration: 0.25 }, 0)
          .to(lines, { y: (i: number) => -70 - i * 55, x: (i: number) => (i % 2 ? 40 : -20), opacity: 0, filter: "blur(12px)", duration: 0.45, stagger: 0.04 }, 0)
          .to(q("[data-out='bottom']"), { y: -40, opacity: 0, duration: 0.3, stagger: 0.03 }, 0.02)
          // 2 — scene closes into a card, camera pushes into the machine
          .fromTo(stage.current, { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: "inset(11% 7% 11% 7% round 44px)", duration: 0.6, ease: "power2.inOut" }, 0.08)
          .to(media.current, { scale: 1.14, xPercent: 6, yPercent: 2, duration: 0.75, ease: "power1.inOut" }, 0.08)
          .to(q("[data-scrim]"), { opacity: 0.35, duration: 0.5 }, 0.1)
          .fromTo(q("[data-frame]"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.4)
          // 3 — floating objects fly past the camera at their own depth
          .to(q("[data-float='float-card']"), { x: -260, y: -420, rotate: -28, scale: 1.5, filter: "blur(6px)", duration: 0.8 }, 0)
          .to(q("[data-float='float-drop']"), { x: 140, y: -520, scale: 1.9, filter: "blur(8px)", duration: 0.8 }, 0)
          .to(q("[data-float='float-orbs']"), { x: -320, y: 180, scale: 0.7, opacity: 0, duration: 0.7 }, 0)
          // tagline assembles inside the card
          .to(q("[data-outro-char]"), { yPercent: 0, opacity: 1, duration: 0.35, stagger: 0.008, ease: "power3.out" }, 0.55)
          .fromTo(q("[data-progress]"), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
      });
      mm.add("(max-width: 1023px)", () => {
        const st = { trigger: el, start: "top top", end: "bottom top", scrub: true };
        gsap.to(media.current, { yPercent: 14, scale: 1.2, ease: "none", scrollTrigger: st });
        gsap.to(copy.current, { y: -100, opacity: 0.1, ease: "none", scrollTrigger: st });
      });
    }, el);

    // Pointer parallax on the inner layers (desktop): the scene leans, floats follow by depth.
    let removeMove = () => {};
    if (hasFinePointer()) {
      const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]")).map((n) => ({
        x: gsap.quickTo(n, "x", { duration: 1.2, ease: "power3" }),
        y: gsap.quickTo(n, "y", { duration: 1.2, ease: "power3" }),
        d: Number(n.dataset.depth),
      }));
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        layers.forEach((l) => {
          l.x(nx * 40 * l.d);
          l.y(ny * 30 * l.d);
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      removeMove = () => window.removeEventListener("pointermove", onMove);
    }

    const off = onAppReady(() => {
      gsap.to(media.current, { scale: 1, duration: 2.4, ease: "expo.out" });
      gsap.to(q("[data-hero-in]"), { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.09, delay: 0.55 });
      gsap.to(q("[data-float-in]"), { opacity: 1, y: 0, scale: 1, duration: 1.8, ease: "expo.out", stagger: 0.12, delay: 0.35 });
      // idle bob so the floats never sit still
      q("[data-bob]").forEach((n: Element, i: number) =>
        gsap.to(n, { y: -14 - i * 4, rotate: i % 2 ? 4 : -4, duration: 3 + i * 0.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.3 }),
      );
    });
    return () => {
      off();
      removeMove();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pt-28 pb-12 md:justify-center md:pb-24 lg:h-[100svh]">
      {/* stage: full-bleed scene that closes into a card on scroll */}
      <div ref={stage} className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div data-depth="0.35" className="absolute -inset-6">
          <div ref={media} className="absolute inset-0 origin-[64%_45%] will-change-transform">
            <video
              ref={video}
              className="absolute inset-0 h-full w-full object-cover object-[72%_50%] md:object-[62%_50%]"
              muted
              loop
              playsInline
              preload="none"
            >
              <source data-src="/assets/hero2-loop.webm" type="video/webm" />
              <source data-src="/assets/hero2-loop.mp4" type="video/mp4" />
            </video>
            {/* poster as a real responsive image so it is the LCP candidate and phones get a small file */}
            <picture className="absolute inset-0 -z-10">
              <source type="image/avif" srcSet="/assets/hero2-loop-poster-960.avif 960w, /assets/hero2-loop-poster-1920.avif 1920w" sizes="100vw" />
              <source type="image/webp" srcSet="/assets/hero2-loop-poster-960.webp 960w, /assets/hero2-loop-poster-1920.webp 1920w" sizes="100vw" />
              <img src="/assets/hero2-loop-poster-1920.webp" alt="" width={1920} height={1080} fetchPriority="high" className="h-full w-full object-cover object-[72%_50%] md:object-[62%_50%]" />
            </picture>
          </div>
        </div>
        <div data-scrim="" className="hero-scrim pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,var(--color-ink),transparent)] lg:hidden" />
      </div>
      {/* card frame that fades in once the scene has become a card */}
      <div data-frame="" aria-hidden="true" className="pointer-events-none absolute inset-[11%_7%] -z-[5] hidden rounded-[44px] border border-lime/25 opacity-0 shadow-[0_0_120px_-30px_rgb(198_255_0/0.45),inset_0_0_80px_-40px_rgb(139_92_246/0.6)] lg:block" />

      {/* floating objects (desktop/tablet) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden md:block">
        {floats.map((f) => (
          <div key={f.name} data-float={f.name} className={`absolute mix-blend-lighten ${f.className}`}>
            <div data-depth={f.depth}>
              <div data-float-in="">
                <div data-bob="">
                  <Picture name={f.name} alt="" sizes="16vw" imgClassName="h-auto w-full [mask-image:radial-gradient(closest-side,#000_62%,transparent)]" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
          <p data-hero-in="" className="lead mt-7 max-w-[30rem] text-fg/80 lg:max-w-[38rem]">{hero.body}</p>
        </div>
        <div data-out="bottom">
          <div data-hero-in="" className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={links.signUp} arrow>{hero.primary}</ButtonLink>
            <ButtonLink href={links.demo} variant="ghost">{hero.secondary}</ButtonLink>
          </div>
        </div>
      </div>

      {/* tagline assembled at the end of the pinned scroll (decorative — the same words are in the marquee) */}
      <p aria-hidden="true" className="pointer-events-none absolute bottom-[17%] left-[12%] z-20 hidden text-left font-display text-[clamp(2.5rem,4.6vw,5rem)] leading-[1.02] font-semibold tracking-[-0.04em] lg:block lg:motion-reduce:hidden">
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
