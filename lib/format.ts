import type { Content } from "@/lib/content";

type Salary = { min: number | null; max: number | null; currency: string; unit: "HOUR" | "MONTH" | "YEAR" };

/** "20–40 USD per hour" in the active locale; empty string when there is no range. */
export function formatSalary(s: Salary | null, c: Content) {
  if (!s) return "";
  const n = (v: number) => new Intl.NumberFormat(c.ui.numberLocale, { maximumFractionDigits: 0 }).format(v);
  const range = s.min && s.max && s.min !== s.max ? `${n(s.min)}–${n(s.max)}` : n((s.max ?? s.min)!);
  return `${range} ${s.currency} ${c.pages.jobs.units[s.unit]}`.replace(/\s+/g, " ").trim();
}

/** Date in the active locale; UTC so server and client render the same string. */
export function formatDate(iso: string, c: Content, long = false) {
  return new Intl.DateTimeFormat(c.ui.numberLocale, { day: "numeric", month: long ? "long" : "short", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}
