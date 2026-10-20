"use client";

import { useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, m, useReducedMotion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { getPlans, priceFor, type Billing, type Plan } from "@/lib/pricing";
import { useContent } from "@/lib/content";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";

const ease = [0.22, 1, 0.36, 1] as const;

/** Each digit rolls in on its own when the amount changes. */
function RollingPrice({ value }: { value: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="tabular inline-flex overflow-hidden" aria-hidden="true">
      {Array.from(value).map((ch, i) => (
        <AnimatePresence key={i} mode="popLayout" initial={false}>
          <m.span
            key={`${ch}-${i}`}
            className="inline-block"
            initial={reduce ? false : { y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: "-100%", opacity: 0 }}
            transition={{ duration: 0.55, ease, delay: i * 0.04 }}
          >
            {ch === " " ? " " : ch}
          </m.span>
        </AnimatePresence>
      ))}
    </span>
  );
}

function BillingToggle({ billing, onChange }: { billing: Billing; onChange: (b: Billing) => void }) {
  const { pricingIntro, ui } = useContent();
  const opts: [Billing, string][] = [
    ["monthly", pricingIntro.monthly],
    ["yearly", pricingIntro.yearly],
  ];
  return (
    <LayoutGroup id="billing">
      <div role="radiogroup" aria-label={ui.billingLabel} className="inline-flex rounded-full border border-line bg-ink-2 p-1.5">
        {opts.map(([value, label]) => {
          const active = billing === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(value)}
              className={`relative min-h-11 rounded-full px-6 font-display text-[0.95rem] font-semibold transition-colors duration-300 ${active ? "text-ink" : "text-muted hover:text-fg"}`}
            >
              {active && <m.span layoutId="billing-knob" className="absolute inset-0 rounded-full bg-lime" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
              <span className="relative">{label}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.dataset.active = "";
    el.style.setProperty("--ry", `${(px - 0.5) * 10}deg`);
    el.style.setProperty("--rx", `${(0.5 - py) * 8}deg`);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
    el.style.setProperty("--lift", "-6px");
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    delete el.dataset.active;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--lift", "0px");
  };
  return { ref, onPointerMove: onMove, onPointerLeave: onLeave };
}

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const { ui } = useContent();
  const tilt = useTilt();
  const price = priceFor(plan, billing);
  const amount = price === null ? "" : new Intl.NumberFormat(ui.numberLocale).format(price);
  return (
    <div
      {...tilt}
      className={`tilt relative flex h-full flex-col rounded-[var(--radius-card)] border p-7 ${
        plan.popular
          ? "border-lime/50 bg-[linear-gradient(180deg,rgb(198_255_0/0.09),rgb(139_92_246/0.06)_60%,transparent),var(--color-ink-2)] shadow-[0_40px_120px_-50px_rgb(198_255_0/0.5)]"
          : "border-line bg-ink-2"
      }`}
    >
      <span className="tilt-glow" aria-hidden="true" />
      <span className="tilt-border" aria-hidden="true" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">{plan.name}</h3>
          {plan.popular && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1 font-mono text-[11px] font-semibold tracking-[0.14em] text-ink uppercase">
              <Sparkles aria-hidden="true" className="size-3" /> {ui.popular}
            </span>
          )}
        </div>
        <Picture name={plan.image} alt={plan.alt} sizes="96px" className="-mt-3 -mr-3 block size-24 shrink-0" imgClassName="size-24 rounded-2xl object-cover [mask-image:radial-gradient(circle,#000_55%,transparent_72%)]" />
      </div>

      <p className="relative mt-6 flex items-baseline gap-2 font-display font-semibold tracking-[-0.05em]">
        <span className="text-[clamp(2.75rem,4vw,3.5rem)] leading-none">
          <span className="sr-only">{`${amount} ${ui.perMonthSr}`}</span>
          <RollingPrice value={amount} />
        </span>
        <span className="text-lg tracking-[-0.02em] text-muted">{ui.currency}{price ? ui.perMonth : ""}</span>
      </p>
      <p className="relative mt-4 min-h-[3em] text-[0.95rem] text-muted">{plan.description}</p>

      <div className="relative mt-6">
        <ButtonLink href={plan.href} variant={plan.popular ? "primary" : "ghost"} className="w-full" magnetic={false}>
          {plan.cta}
        </ButtonLink>
      </div>

      <div className="relative mt-8 border-t border-line pt-6">
        {plan.inherits && <p className="mb-4 font-display text-[0.95rem] font-medium text-fg">{plan.inherits}</p>}
        <ul className="grid gap-3 text-[0.925rem] text-fg/80">
          {plan.features.map((f) => (
            <li key={f} className="flex gap-3">
              <Check aria-hidden="true" className="mt-[0.2em] size-4 shrink-0 text-lime" strokeWidth={2.5} />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function EnterpriseCard({ plan }: { plan: Plan }) {
  const { ui } = useContent();
  const tilt = useTilt();
  return (
    <div {...tilt} className="tilt relative grid gap-8 overflow-hidden rounded-[var(--radius-card)] border border-line bg-ink-2 p-7 sm:p-10 lg:grid-cols-12 lg:items-center">
      <span className="tilt-glow" aria-hidden="true" />
      <span className="tilt-border" aria-hidden="true" />
      <div className="relative flex items-center gap-6 lg:col-span-5">
        <Picture name={plan.image} alt={plan.alt} sizes="128px" className="block size-28 shrink-0 sm:size-32" imgClassName="size-28 rounded-2xl object-cover sm:size-32 [mask-image:radial-gradient(circle,#000_55%,transparent_72%)]" />
        <div>
          <h3 className="font-display text-3xl font-semibold tracking-[-0.03em]">{plan.name}</h3>
          <p className="mt-1 font-display text-xl text-lime">{ui.custom}</p>
          <p className="mt-2 text-muted">{plan.description}</p>
        </div>
      </div>
      <div className="relative lg:col-span-4">
        <p className="mb-3 font-display text-[0.95rem] font-medium">{plan.inherits}</p>
        <ul className="grid gap-2.5 text-[0.925rem] text-fg/80">
          {plan.features.map((f) => (
            <li key={f} className="flex gap-3">
              <Check aria-hidden="true" className="mt-[0.2em] size-4 shrink-0 text-lime" strokeWidth={2.5} />
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative lg:col-span-3 lg:justify-self-end">
        <ButtonLink href={plan.href} variant="ghost" arrow>
          {plan.cta}
        </ButtonLink>
      </div>
    </div>
  );
}

export function Pricing() {
  const c = useContent();
  const { links, pricingIntro } = c;
  const plans = getPlans(c);
  const [billing, setBilling] = useState<Billing>("monthly");
  const tiers = plans.filter((p) => p.id !== "enterprise");
  const enterprise = plans.find((p) => p.id === "enterprise")!;

  return (
    <section id="cennik" aria-labelledby="pricing-title" className="section-y relative">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60rem] overflow-hidden">
        <div className="absolute top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-violet/15 blur-[120px]" />
      </div>
      <div className="container-jm">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p data-reveal="" className="eyebrow">{pricingIntro.eyebrow}</p>
            <SplitHeading id="pricing-title" text={pricingIntro.title} className="h2 mt-5" />
          </div>
          <div data-reveal="" className="lg:col-span-5">
            <p className="lead">{pricingIntro.body}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={links.signUp} arrow>{pricingIntro.primary}</ButtonLink>
              <ButtonLink href={links.demo} variant="ghost">{pricingIntro.secondary}</ButtonLink>
            </div>
          </div>
        </div>

        <div data-reveal="" className="mt-16 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between lg:mt-24">
          <BillingToggle billing={billing} onChange={setBilling} />
          <p className="text-sm text-muted">{pricingIntro.notes[0]}</p>
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((p) => (
            <li key={p.id} data-reveal="" className={p.popular ? "xl:-mt-4 xl:mb-4" : ""}>
              <PlanCard plan={p} billing={billing} />
            </li>
          ))}
        </ul>
        <div data-reveal="" className="mt-5">
          <EnterpriseCard plan={enterprise} />
        </div>
        <p data-reveal="" className="mt-6 text-sm text-muted">{pricingIntro.notes[1]}</p>
      </div>
    </section>
  );
}
