"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, m, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useContent } from "@/lib/content";
import { formatDate, formatSalary } from "@/lib/format";
import type { Job, JobType } from "@/lib/jobs";

const TYPES: JobType[] = ["full_time", "part_time", "contract", "internship"];
const ease = [0.22, 1, 0.36, 1] as const;

/** Searchable, filterable list of openings (data comes from the server page). */
export function JobBoard({ jobs }: { jobs: Omit<Job, "html">[] }) {
  const c = useContent();
  const t = c.pages.jobs;
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<JobType | "all">("all");
  const q = useDeferredValue(query.trim().toLowerCase());

  const visible = useMemo(
    () =>
      jobs.filter(
        (j) =>
          (type === "all" || j.type === type) &&
          (!q || `${j.title} ${j.location ?? ""} ${j.company}`.toLowerCase().includes(q)),
      ),
    [jobs, q, type],
  );
  // only offer the job types that actually exist in the list
  const types = TYPES.filter((ty) => jobs.some((j) => j.type === ty));

  return (
    <div>
      <div data-reveal="" className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="group relative block w-full lg:max-w-md">
          <span className="sr-only">{t.searchLabel}</span>
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-muted transition-colors group-focus-within:text-lime" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="h-13 w-full rounded-full border border-line bg-ink-2 pr-5 pl-12 text-fg placeholder:text-muted/80 transition-colors outline-none hover:border-fg/25 focus-visible:border-lime focus-visible:outline-none"
          />
        </label>
        <LayoutGroup id="job-type">
          <div role="radiogroup" aria-label={t.typeLabel} className="flex flex-wrap gap-1.5 rounded-full border border-line bg-ink-2 p-1.5">
            {(["all", ...types] as const).map((value) => {
              const active = type === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setType(value)}
                  className={`relative min-h-10 rounded-full px-4 font-display text-[0.9rem] font-semibold transition-colors duration-300 ${active ? "text-ink" : "text-muted hover:text-fg"}`}
                >
                  {active && <m.span layoutId="job-type-knob" className="absolute inset-0 rounded-full bg-lime" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
                  <span className="relative">{value === "all" ? t.allTypes : t.types[value]}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>

      <p className="mt-8 font-mono text-xs tracking-[0.2em] text-muted uppercase" aria-live="polite">
        {t.count(visible.length)}
      </p>

      {jobs.length === 0 ? (
        <p className="card mt-6 p-8 text-muted">{t.unavailable}</p>
      ) : visible.length === 0 ? (
        <p className="card mt-6 p-8 text-muted">{t.noResults}</p>
      ) : (
        <ul className="mt-6 grid gap-4">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((j) => (
              <m.li
                key={j.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease }}
              >
                <Link
                  href={`/jobs/${j.slug}`}
                  className="card group grid gap-5 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10"
                >
                  <div>
                    <p className="font-mono text-xs tracking-[0.18em] text-lime uppercase">{j.company}</p>
                    <h2 className="mt-3 font-display text-[clamp(1.35rem,2.2vw,1.85rem)] leading-[1.1] font-semibold tracking-[-0.03em] transition-colors group-hover:text-lime">
                      {j.title}
                    </h2>
                    <ul className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                      {j.type && <li className="rounded-full border border-line px-3 py-1 text-fg/85">{t.types[j.type]}</li>}
                      {j.remote && <li className="rounded-full border border-violet/40 bg-violet/10 px-3 py-1 text-violet-hi">{t.remote[j.remote]}</li>}
                      {j.location && (
                        <li className="inline-flex items-center gap-1.5 px-1 text-muted">
                          <MapPin aria-hidden="true" className="size-3.5" />
                          {j.location}
                        </li>
                      )}
                    </ul>
                    <p className="mt-4 line-clamp-2 max-w-3xl text-[0.95rem] text-muted">{j.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between gap-6 border-t border-line pt-5 lg:flex-col lg:items-end lg:border-0 lg:pt-0">
                    <div className="lg:text-right">
                      {j.salary && <p className="font-display text-lg font-semibold text-fg">{formatSalary(j.salary, c)}</p>}
                      <p className="mt-1 text-sm text-muted">
                        {t.posted} {formatDate(j.posted, c)}
                      </p>
                    </div>
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-500 ease-[var(--ease-jelly)] group-hover:rotate-45 group-hover:border-lime group-hover:bg-lime group-hover:text-ink">
                      <ArrowUpRight aria-hidden="true" className="size-5" />
                      <span className="sr-only">{t.view}</span>
                    </span>
                  </div>
                </Link>
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
