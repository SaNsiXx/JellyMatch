"use client";

import { useRef } from "react";
import { useGsap, prefersReducedMotion } from "@/lib/motion";
import { useContent } from "@/lib/content";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Picture } from "@/components/ui/Picture";

/**
 * Desktop (≥1024px, motion welcome): the stage pins and scroll scrubs through the three steps —
 * images crossfade/zoom, copy swaps, the progress rail fills.
 * Phones and reduced motion: a plain stacked list (same content).
 */
export function AiSelection() {
  const { aiSelection } = useContent();
  const steps = aiSelection.steps;
  const stage = useRef<HTMLDivElement>(null);

  useGsap(({ gsap }) => {
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const el = stage.current!;
      const imgs = el.querySelectorAll<HTMLElement>("[data-step-img]");
      const texts = el.querySelectorAll<HTMLElement>("[data-step-text]");
      const dots = el.querySelectorAll<HTMLElement>("[data-step-dot]");
      gsap.set(imgs, { opacity: 0, scale: 1.08 });
      gsap.set(texts, { opacity: 0, y: 40 });
      gsap.set([imgs[0], texts[0]], { opacity: 1, scale: 1, y: 0 });
      gsap.set(dots[0]!, { backgroundColor: "#c6ff00", scale: 1.3 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.4}`,
          pin: true,
          scrub: 0.8,
          snap: { snapTo: [0, 0.5, 1], duration: { min: 0.2, max: 0.6 }, ease: "power2.inOut" },
          anticipatePin: 1,
        },
      });
      tl.to(el.querySelector("[data-rail]"), { scaleY: 1, ease: "none", duration: 2 }, 0);
      for (let i = 1; i < steps.length; i++) {
        const at = i - 0.6;
        tl.to(imgs[i - 1]!, { opacity: 0, scale: 0.96, duration: 0.5 }, at)
          .to(imgs[i]!, { opacity: 1, scale: 1, duration: 0.6 }, at + 0.1)
          .to(texts[i - 1]!, { opacity: 0, y: -40, duration: 0.4 }, at)
          .to(texts[i]!, { opacity: 1, y: 0, duration: 0.5 }, at + 0.2)
          .to(dots[i - 1]!, { backgroundColor: "rgb(245 245 247 / 0.25)", scale: 1, duration: 0.3 }, at)
          .to(dots[i]!, { backgroundColor: "#c6ff00", scale: 1.3, duration: 0.3 }, at + 0.2);
      }
      tl.to({}, { duration: 0.4 }); // hold on the last step
      // slow push-in on whichever image is visible
      gsap.to(el.querySelector("[data-imgs]"), {
        scale: 1.06,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: () => `+=${window.innerHeight * 2.4}`, scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section aria-labelledby="ai-title" className="relative">
      <div className="container-jm pt-[clamp(6rem,12vw,11rem)] pb-12 lg:pb-16">
        <p data-reveal="" className="eyebrow">{aiSelection.eyebrow}</p>
        <SplitHeading id="ai-title" text={aiSelection.title} className="h2 mt-5 max-w-4xl" />
      </div>

      {/* Pinned stage (desktop + motion) */}
      <div ref={stage} className="relative hidden h-[100svh] overflow-hidden lg:block lg:motion-reduce:hidden">
        <div className="container-jm grid h-full grid-cols-12 items-center gap-8">
          <div className="relative col-span-5 flex h-[60vh] items-center">
            <div className="absolute top-0 bottom-0 left-0 w-px bg-line" aria-hidden="true">
              <span data-rail="" className="absolute inset-0 origin-top scale-y-0 bg-[linear-gradient(var(--color-lime),var(--color-violet))]" />
            </div>
            <ol className="absolute top-0 bottom-0 -left-[5px] flex flex-col justify-between" aria-hidden="true">
              {steps.map((s) => (
                <li key={s.kicker} data-step-dot="" className="size-[11px] rounded-full bg-fg/25" />
              ))}
            </ol>
            <div className="relative w-full pl-12">
              {steps.map((s, i) => (
                <div key={s.kicker} data-step-text="" className={i === 0 ? "relative" : "absolute inset-x-0 top-0 pl-12"}>
                  <p className="font-mono text-xs tracking-[0.24em] text-lime uppercase">{s.kicker}</p>
                  <h3 className="mt-5 font-display text-[clamp(2rem,3.4vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.04em]">{s.title}</h3>
                  <p className="lead mt-5 max-w-md">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] border border-line">
              <div data-imgs="" className="absolute inset-0">
                {steps.map((s) => (
                  <div key={s.image} data-step-img="" className="absolute inset-0">
                    <Picture name={s.image} alt={s.alt} sizes="58vw" imgClassName="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_120px_rgb(11_11_15/0.7)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Stacked list (phones, tablets, reduced motion) */}
      <ol className="container-jm grid gap-16 pb-[clamp(6rem,12vw,11rem)] lg:hidden lg:motion-reduce:grid lg:motion-reduce:grid-cols-3 lg:motion-reduce:gap-8">
        {steps.map((s) => (
          <li key={s.kicker} data-reveal="">
            <div className="overflow-hidden rounded-[var(--radius-card)] border border-line">
              <Picture name={s.image} alt={s.alt} sizes="(min-width: 1024px) 33vw, 100vw" imgClassName="aspect-[16/10] h-full w-full object-cover" />
            </div>
            <p className="mt-8 font-mono text-xs tracking-[0.24em] text-lime uppercase">{s.kicker}</p>
            <h3 className="h3 mt-3">{s.title}</h3>
            <p className="mt-3 text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
      <div className="hidden h-[clamp(4rem,8vw,7rem)] lg:block lg:motion-reduce:hidden" aria-hidden="true" />
    </section>
  );
}
