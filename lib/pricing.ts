import type { Content } from "./content";

export type Billing = "monthly" | "yearly";
export type PlanId = keyof Content["plans"];

type PlanBase = {
  id: PlanId;
  /** Net PLN per month. null = custom pricing. */
  monthly: number | null;
  /**
   * Monthly equivalent when billed yearly (net PLN).
   * TODO: yearly prices were not provided — fill these in. While null, the yearly view shows the monthly price.
   */
  yearly: number | null;
  href: keyof Content["links"];
  popular?: boolean;
  image: string;
};

const base: PlanBase[] = [
  { id: "free", monthly: 0, yearly: 0, href: "signUp", image: "plan-free" },
  { id: "starter", monthly: 199, yearly: null, href: "signUp", image: "plan-starter" },
  { id: "growth", monthly: 499, yearly: null, href: "signUp", popular: true, image: "plan-growth" },
  { id: "scale", monthly: 999, yearly: null, href: "signUp", image: "plan-scale" },
  { id: "enterprise", monthly: null, yearly: null, href: "sales", image: "plan-enterprise" },
];

export type Plan = Omit<PlanBase, "href"> & Content["plans"][PlanId] & { href: string; inherits?: string };

/** Plans with their copy and links in the active locale. */
export function getPlans(c: Content): Plan[] {
  return base.map((p) => ({ ...p, ...c.plans[p.id], href: c.links[p.href] }));
}

export function priceFor(plan: Plan, billing: Billing): number | null {
  if (plan.monthly === null) return null;
  if (billing === "yearly") return plan.yearly ?? plan.monthly;
  return plan.monthly;
}
