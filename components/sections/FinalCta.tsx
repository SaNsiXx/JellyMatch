"use client";

import { useRef } from "react";
import { useGsap, prefersReducedMotion } from "@/lib/motion";
import { finalCta, links } from "@/lib/content";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";

export function FinalCta() {
  const root = useRef<HTMLElement>(null);
  const mascot = useRef<HTMLDivElement>(null);

  useGsap(({ gsap }) => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // idle float + scroll parallax on separate wrappers so they never fight
      gsap.to(mascot.current, { y: -18, rotate: 2, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
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
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="final-title" className="relative isolate overflow-hidden py-28 lg:py-40">
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
            <ButtonLink href={links.signUp} arrow cursor="Start">{finalCta.primary}</ButtonLink>
            <ButtonLink href={links.demo} variant="ghost" cursor="Demo">{finalCta.secondary}</ButtonLink>
          </div>
        </div>
        <div data-mascot-par="" className="relative mx-auto mix-blend-lighten w-full max-w-[22rem] lg:col-span-5 lg:max-w-none">
          <div ref={mascot}>
            <Picture
              name="mascot-celebrate"
              alt="Maskotka Jelly Match — orzeł z limonkowo-fioletowej galaretki — świętuje z uniesionymi skrzydłami"
              sizes="(min-width: 1024px) 40vw, 22rem"
              imgClassName="h-auto w-full [mask-image:radial-gradient(closest-side,#000_72%,transparent)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
