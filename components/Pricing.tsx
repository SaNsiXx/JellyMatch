"use client";

import { AnimatePresence, LazyMotion, domAnimation, m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Check } from "lucide-react";
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { LINKS, PLANS, PRICING, type Plan } from "@/lib/content";
import { Cta } from "./Cta";
import { Picture } from "./Picture";

type Billing = "monthly" | "yearly";

function Price({ plan, billing }: { plan: Plan; billing: Billing }) {
  if (plan.monthly === null) return <p className="price">Indywidualna</p>;
  // TODO: yearly amounts are not known yet; until filled in lib/content.ts the monthly price stays visible.
  const value = billing === "yearly" && plan.yearly !== null ? plan.yearly : plan.monthly;
  return (
    <p className="price flex items-baseline gap-1.5" aria-live="polite">
      <span className="relative inline-block overflow-clip">
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span
            key={value}
            className="inline-block"
            initial={{ y: "70%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-70%", opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {value}
          </m.span>
        </AnimatePresence>
      </span>
      <span className="text-xl">zł</span>
      {plan.monthly > 0 && <span className="font-sans text-sm font-normal tracking-normal text-muted">/mies.</span>}
    </p>
  );
}

function PlanCard({ plan, billing, wide = false }: { plan: Plan; billing: Billing; wide?: boolean }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });

  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    const strength = wide ? 2 : 5;
    ry.set(px * strength);
    rx.set(-py * strength);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <m.article
      ref={ref}
      data-glow
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      className={`card plan ${plan.popular ? "plan-popular" : ""} ${wide ? "lg:flex-row lg:items-start lg:gap-10" : ""}`}
    >
      <div className={wide ? "lg:w-1/3" : ""}>
        <div className="flex items-start justify-between gap-3">
          <Picture name={plan.image} alt={plan.alt} sizes="84px" className="plan-art" />
          {plan.popular && <span className="rounded-full bg-lime px-3 py-1 text-sm font-semibold text-ink">Popularny</span>}
        </div>
        <h3 className="h3 mt-5">{plan.name}</h3>
        <div className="mt-2"><Price plan={plan} billing={billing} /></div>
        <p className="mt-3 text-[0.9375rem] text-muted">{plan.tagline}</p>
        {wide && (
          <div className="mt-5">
            <Cta href={plan.href} variant="ghost" className="w-full sm:w-auto">{plan.cta}</Cta>
          </div>
        )}
      </div>
      <div className={`mt-6 flex flex-1 flex-col ${wide ? "lg:mt-0" : ""}`}>
        {plan.inherits && <p className="mb-3 text-sm font-medium">{plan.inherits}</p>}
        <ul className={`space-y-2.5 text-[0.9375rem] ${wide ? "sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0" : ""}`}>
          {plan.features.map((f) => (
            <li key={f} className="flex gap-2.5">
              <Check size={17} className="mt-1 shrink-0 text-lime" aria-hidden="true" />
              <span className="text-fg/85">{f}</span>
            </li>
          ))}
        </ul>
        {!wide && (
          <div className="mt-auto pt-7">
            <Cta href={plan.href} variant={plan.popular ? "primary" : "ghost"} size="sm" className="flex w-full">{plan.cta}</Cta>
          </div>
        )}
      </div>
    </m.article>
  );
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const yearlyMissing = PLANS.some((p) => p.monthly && p.yearly === null);
  const regular = PLANS.filter((p) => p.id !== "enterprise");
  const enterprise = PLANS.find((p) => p.id === "enterprise")!;

  return (
    <LazyMotion features={domAnimation}>
      <section id="cennik" className="section-y relative" aria-labelledby="cennik-title">
        <div className="container-jm">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <h2 id="cennik-title" className="display h2 lg:col-span-7" data-reveal="">
              {PRICING.title.before} <span className="accent">{PRICING.title.accent}</span>
            </h2>
            <div className="lg:col-span-5" data-reveal="" style={{ "--d": 100 } as React.CSSProperties}>
              <p className="text-muted">{PRICING.lead}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Cta href={LINKS.signUp} arrow>{PRICING.primary}</Cta>
                <Cta href={LINKS.demo} variant="ghost">{PRICING.secondary}</Cta>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-4" data-reveal="">
            <div className="toggle isolate" role="group" aria-label="Okres rozliczenia">
              {(["monthly", "yearly"] as const).map((b) => (
                <button key={b} type="button" aria-pressed={billing === b} onClick={() => setBilling(b)}>
                  {billing === b && <m.span layoutId="billing-pill" className="toggle-pill" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                  <span>{b === "monthly" ? "Miesięcznie" : "Rocznie"}</span>
                </button>
              ))}
            </div>
            {billing === "yearly" && yearlyMissing && (
              <p className="text-sm text-muted" role="status">Ceny roczne wkrótce. Teraz widzisz ceny miesięczne.</p>
            )}
          </div>

          <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {regular.map((p, i) => (
              <li key={p.id} data-reveal="" style={{ "--d": i * 80 } as React.CSSProperties}>
                <PlanCard plan={p} billing={billing} />
              </li>
            ))}
            <li className="md:col-span-2 xl:col-span-4" data-reveal="">
              <PlanCard plan={enterprise} billing={billing} wide />
            </li>
          </ul>

          <div className="mt-6 space-y-1 text-sm text-muted">
            {PRICING.notes.map((n) => <p key={n}>{n}</p>)}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
