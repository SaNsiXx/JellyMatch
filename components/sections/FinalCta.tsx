"use client";

import { useRef } from "react";
import { useGsap, prefersReducedMotion } from "@/lib/motion";
import { useContent } from "@/lib/content";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { MascotSparks } from "@/components/motion/MascotSparks";

export function FinalCta() {
  const { finalCta, links, ui } = useContent();
  const root = useRef<HTMLElement>(null);
  const mascot = useRef<HTMLDivElement>(null);
  const jump = useRef<HTMLDivElement>(null);
  const burst = useRef<() => void>(undefined);

  useGsap(({ gsap, ScrollTrigger }) => {
    if (prefersReducedMotion()) return;
    // idle hover: a few slow, unsynced waves (bob, sway, breath) instead of one yoyo — reads as alive, not tweened
    let active = false;
    const float = (t: number) => {
      if (!active) return;
      // force3D keeps the bird on its own GPU layer: a 2D transform set every frame repainted the section
      gsap.set(mascot.current, {
        force3D: true,
        y: Math.sin(t * 1.1) * 10 + Math.sin(t * 0.53 + 1) * 6,
        rotate: Math.sin(t * 0.7 + 1) * 1.6 + Math.sin(t * 0.31) * 0.8,
        scale: 1 + Math.sin(t * 1.7) * 0.012,
      });
    };
    gsap.ticker.add(float);
    // the confetti bursts out → the jelly bird squashes, springs up and wobbles back
    burst.current = () =>
      gsap
        .timeline()
        .to(jump.current, { scaleX: 1.08, scaleY: 0.9, duration: 0.14, ease: "power2.out" })
        .to(jump.current, { scaleX: 0.95, scaleY: 1.07, y: -26, duration: 0.32, ease: "power2.out" })
        .to(jump.current, { scaleX: 1, scaleY: 1, y: 0, duration: 1.2, ease: "elastic.out(1, 0.35)" });
    const ctx = gsap.context(() => {
      // idle float + scroll parallax on separate wrappers so they never fight
      ScrollTrigger.create({ trigger: root.current, start: "top bottom", end: "bottom top", onToggle: (st) => (active = st.isActive) });
      gsap.fromTo(
        "[data-mascot-par]",
        { yPercent: 18, scale: 0.9 },
        { yPercent: -6, scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true } },
      );
      gsap.fromTo(
        "[data-final-bg]",
        { scale: 1.2, opacity: 0.4 },
        { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true } },
      );
    }, root);
    return () => {
      gsap.ticker.remove(float);
      burst.current = undefined;
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} data-jelly="hidden" aria-labelledby="final-title" className="relative isolate overflow-hidden py-28 lg:py-40">
      <div data-final-bg="" aria-hidden="true" className="absolute inset-0 -z-10 opacity-60">
        <Picture name="bg-aura-1" alt="" sizes="100vw" imgClassName="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-ink),rgb(11_11_15/0.55)_40%,rgb(11_11_15/0.7)_70%,var(--color-ink))]" />
      </div>
      <div className="container-jm grid items-center gap-6 lg:grid-cols-12">
        <div className="text-center lg:col-span-7 lg:text-left">
          <SplitHeading
            id="final-title"
            text={finalCta.title}
            className="font-display text-[clamp(3.25rem,10vw,9rem)] font-semibold"
          />
          <p data-reveal="" className="lead mx-auto mt-8 max-w-lg lg:mx-0">{finalCta.body}</p>
          <div data-reveal="" className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <ButtonLink href={links.signUp} arrow>{finalCta.primary}</ButtonLink>
            <ButtonLink href={links.demo} variant="ghost">{finalCta.secondary}</ButtonLink>
          </div>
        </div>
        <div data-mascot-par="" className="relative mx-auto mix-blend-lighten w-full max-w-[22rem] lg:col-span-5 lg:max-w-none">
          <div ref={mascot}>
            <div ref={jump} className="origin-bottom">
              <Picture
                name="mascot-celebrate-bird"
                alt={ui.mascotCelebrateAlt}
                sizes="(min-width: 1024px) 40vw, 22rem"
                imgClassName="h-auto w-full [mask-image:radial-gradient(closest-side,#000_72%,transparent)]"
              />
            </div>
          </div>
          {/* the confetti flies on its own (not with the bird's float) */}
          <MascotSparks
            onBurst={() => burst.current?.()}
            className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen [mask-image:radial-gradient(closest-side,#000_80%,transparent)]"
          />
        </div>
      </div>
    </section>
  );
}
