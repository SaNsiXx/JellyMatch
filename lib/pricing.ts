import type { Content } from "./content";

export type Billing = "monthly" | "yearly";
export type PlanId = keyof Content["plans"];

type PlanBase = {
  id: PlanId;
  /** Net PLN per month. null = custom pricing. */
  monthly: number | null;
  /** Monthly equivalent when billed annually (net PLN), as on staffinit.com/pricing. */
  yearly: number | null;
  href: keyof Content["links"];
  popular?: boolean;
  image: string;
};

const base: PlanBase[] = [
  { id: "free", monthly: 0, yearly: 0, href: "signUp", image: "plan-free" },
  { id: "starter", monthly: 199, yearly: 166, href: "signUp", image: "plan-starter" },
  { id: "growth", monthly: 499, yearly: 416, href: "signUp", popular: true, image: "plan-growth" },
  { id: "scale", monthly: 999, yearly: 833, href: "signUp", image: "plan-scale" },
  { id: "enterprise", monthly: null, yearly: null, href: "sales", image: "plan-enterprise" },
];

export type Plan = Omit<PlanBase, "href"> & Content["plans"][PlanId] & { href: string; inherits?: string };

/** Plans with their copy and links in the active locale. */
export function getPlans(c: Content): Plan[] {
  return base.map((p) => ({ ...p, ...c.plans[p.id], href: c.links[p.href] }));
}

/** Sign-up link that preselects the plan (and billing period for paid plans) in the hiring app. */
export function planHref(plan: Plan, billing: Billing) {
  if (!plan.href.includes("/auth/sign-up")) return plan.href;
  const q = plan.monthly ? `plan=${plan.id}&billing=${billing === "yearly" ? "annual" : "monthly"}` : `plan=${plan.id}`;
  return `${plan.href}?${q}`;
}

export function priceFor(plan: Plan, billing: Billing): number | null {
  if (plan.monthly === null) return null;
  if (billing === "yearly") return plan.yearly ?? plan.monthly;
  return plan.monthly;
}
