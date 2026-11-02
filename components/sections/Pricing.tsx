"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, m, useReducedMotion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { getPlans, planHref, priceFor, YEARLY_SAVING, type Billing, type Plan } from "@/lib/pricing";
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
              className={`relative min-h-11 rounded-full px-6 font-display text-ui font-semibold transition-colors duration-200 ${active ? "text-ink" : "text-muted hover:text-fg"}`}
            >
              {active && <m.span layoutId="billing-knob" className="absolute inset-0 rounded-full bg-lime" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
              <span className="relative">{label}</span>
              {value === "yearly" && YEARLY_SAVING > 0 && (
                <span className={`relative ml-2 rounded-full px-2 py-0.5 text-xs transition-colors duration-200 ${active ? "bg-ink/15 text-ink" : "bg-violet/20 text-violet-hi"}`}>
                  −{YEARLY_SAVING}%
                </span>
              )}
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

/** Phones: features beyond this many fold behind "Show all" (the cards otherwise run ~6 screens). */
const FEATURES_SHOWN = 5;

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const { ui } = useContent();
  const tilt = useTilt();
  const [open, setOpen] = useState(false);
  const listId = useId();
  const more = plan.features.length - FEATURES_SHOWN;
  const price = priceFor(plan, billing);
  const amount = price === null ? "" : new Intl.NumberFormat(ui.numberLocale).format(price);
  return (
    <div
      {...tilt}
      className={`tilt relative flex h-full flex-col rounded-[var(--radius-card)] border p-7 ${
        plan.popular
          ? "border-lime/50 bg-ink-2 bg-[image:linear-gradient(180deg,rgb(198_255_0/0.09),rgb(139_92_246/0.06)_60%,transparent)] shadow-[0_40px_120px_-50px_rgb(198_255_0/0.5)]"
          : "border-line bg-ink-2"
      }`}
    >
      <span className="tilt-glow" aria-hidden="true" />
      <span className="tilt-border" aria-hidden="true" />
      {/* illustration in the top-right corner, under the copy (the text blocks below are positioned, so they paint on top);
          lighten drops the render's own dark backdrop into the card, the mask only softens what is left at the edge */}
      <Picture name={plan.image} alt={plan.alt} sizes="176px" className="pointer-events-none absolute top-0 right-0 block size-36 mix-blend-lighten sm:size-44" imgClassName="size-36 object-cover sm:size-44 [mask-image:radial-gradient(closest-side,#000_58%,transparent)]" />
      <div className="relative">
        <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">{plan.name}</h3>
        {plan.popular && (
          <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-lime px-3 py-1 font-mono text-xs font-semibold tracking-[0.14em] text-ink uppercase">
            <Sparkles aria-hidden="true" className="size-3" /> {ui.popular}
          </span>
        )}
      </div>

      <p data-reveal="" className="relative mt-6 flex items-baseline gap-2 font-display font-semibold tracking-[-0.05em]">
        <span className="text-[clamp(2.75rem,4vw,3.5rem)] leading-none">
          <span className="sr-only">{`${amount} ${ui.perMonthSr}`}</span>
          <RollingPrice value={amount} />
        </span>
        <span className="text-lg tracking-[-0.02em] text-muted">{ui.currency}{price ? ui.perMonth : ""}</span>
      </p>
      <p data-reveal="" className="relative mt-4 min-h-[3em] text-ui text-muted">{plan.description}</p>

      <div data-reveal="" className="relative mt-6">
        <ButtonLink href={planHref(plan, billing)} variant={plan.popular ? "primary" : "ghost"} className="w-full" magnetic={false}>
          {plan.cta}
        </ButtonLink>
      </div>

      <div className="relative mt-8 border-t border-line pt-6">
        {plan.inherits && <p className="mb-4 font-display text-ui font-medium text-fg">{plan.inherits}</p>}
        <ul id={listId} className="grid gap-3 text-ui text-fg/80">
          {plan.features.map((f, i) => (
            <li key={f} className={`flex gap-3 ${!open && i >= FEATURES_SHOWN ? "max-lg:hidden" : ""}`}>
              <Check aria-hidden="true" className="mt-[0.2em] size-4 shrink-0 text-lime" strokeWidth={2.5} />
              {f}
            </li>
          ))}
        </ul>
        {more > 0 && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={listId}
            onClick={() => setOpen((o) => !o)}
            className="mt-4 inline-flex min-h-11 items-center font-display text-ui font-semibold text-lime transition-colors duration-200 hover:text-fg lg:hidden"
          >
            {open ? ui.featuresLess : `${ui.featuresMore} (+${more})`}
          </button>
        )}
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
        <Picture name={plan.image} alt={plan.alt} sizes="128px" className="block size-28 shrink-0 mix-blend-lighten sm:size-32" imgClassName="size-28 object-cover sm:size-32 [mask-image:radial-gradient(closest-side,#000_58%,transparent)]" />
        <div>
          <h3 className="font-display text-3xl font-semibold tracking-[-0.03em]">{plan.name}</h3>
          <p className="mt-1 font-display text-xl text-lime">{ui.custom}</p>
          <p className="mt-2 text-muted">{plan.description}</p>
        </div>
      </div>
      <div className="relative lg:col-span-4">
        <p className="mb-3 font-display text-ui font-medium">{plan.inherits}</p>
        <ul className="grid gap-3 text-ui text-fg/80">
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

/** `as="h1"` on the dedicated /pricing page, where this section is the page itself. */
export function Pricing({ as = "h2" }: { as?: "h1" | "h2" }) {
  const c = useContent();
  const { links, pricingIntro } = c;
  const plans = getPlans(c);
  const [billing, setBilling] = useState<Billing>("monthly");
  const tiers = plans.filter((p) => p.id !== "enterprise");
  const enterprise = plans.find((p) => p.id === "enterprise")!;

  return (
    <section id="cennik" data-jelly="ring" aria-labelledby="pricing-title" className="section-y relative">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60rem] overflow-hidden">
        <div className="absolute top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-violet/15 blur-[120px]" />
      </div>
      <div className="container-jm">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p data-reveal="" className="eyebrow">{pricingIntro.eyebrow}</p>
            <SplitHeading as={as} id="pricing-title" text={pricingIntro.title} className="h2 mt-5" />
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
