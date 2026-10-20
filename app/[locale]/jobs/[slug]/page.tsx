import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowUpRight, Briefcase, Building2, MapPin, Wallet } from "lucide-react";
import { routing } from "@/i18n/routing";
import { toLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { content } from "@/lib/content";
import { formatDate, formatSalary } from "@/lib/format";
import { getJob, getJobs } from "@/lib/jobs";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";

export const revalidate = 3600; // = JOBS_REVALIDATE (segment config must be a literal)

export async function generateStaticParams() {
  const jobs = await getJobs();
  return routing.locales.flatMap((locale) => jobs.map((j) => ({ locale, slug: j.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/jobs/[slug]">): Promise<Metadata> {
  const { locale: l, slug } = await params;
  const locale = toLocale(l);
  const job = await getJob(slug);
  if (!job) return {};
  return pageMetadata(locale, `/jobs/${slug}`, `${job.title} — ${job.company || "Jelly Match"}`, job.excerpt);
}

export default async function JobPage({ params }: PageProps<"/[locale]/jobs/[slug]">) {
  const { locale: l, slug } = await params;
  const locale = toLocale(l);
  setRequestLocale(locale);
  const job = await getJob(slug);
  if (!job) notFound();
  const c = content[locale];
  const t = c.pages.jobs;
  const salary = formatSalary(job.salary, c);

  const details = [
    job.company && { icon: Building2, label: t.company, value: job.company },
    job.location && { icon: MapPin, label: t.location, value: job.location },
    job.type && { icon: Briefcase, label: t.typeLabel, value: [t.types[job.type], job.remote && t.remote[job.remote]].filter(Boolean).join(" · ") },
    salary && { icon: Wallet, label: t.salary, value: salary },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[];

  // schema.org JobPosting (Google for Jobs)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.html,
    datePosted: job.posted,
    employmentType: job.type?.toUpperCase(),
    hiringOrganization: { "@type": "Organization", name: job.company || "Jelly Match" },
    ...(job.remote === "remote" ? { jobLocationType: "TELECOMMUTE" } : {}),
    ...(job.location ? { jobLocation: { "@type": "Place", address: job.location } } : {}),
    ...(job.salary
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: job.salary.currency,
            value: { "@type": "QuantitativeValue", minValue: job.salary.min, maxValue: job.salary.max, unitText: job.salary.unit },
          },
        }
      : {}),
    directApply: false,
  };

  return (
    <main id="main" className="relative pt-32 pb-[clamp(5rem,10vw,9rem)] lg:pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] overflow-hidden">
        <div className="absolute -top-48 left-1/3 h-[30rem] w-[60rem] rounded-full bg-violet/15 blur-[120px]" />
      </div>
      <article className="container-jm">
        <Link href="/jobs" className="group inline-flex min-h-11 items-center gap-2 text-muted transition-colors hover:text-fg">
          <ArrowLeft aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
          {t.back}
        </Link>

        <header className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div data-reveal="" className="lg:col-span-8">
            <p className="font-mono text-xs tracking-[0.2em] text-lime uppercase">{job.company}</p>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold">{job.title}</h1>
            <p className="mt-5 text-muted">
              {t.posted} {formatDate(job.posted, c, true)}
            </p>
          </div>
          <div data-reveal="" className="flex flex-col items-start gap-2 lg:col-span-4 lg:items-end">
            <ButtonLink href={job.applyUrl} arrow>{t.apply}</ButtonLink>
            <p className="text-sm text-muted">{t.applyNote}</p>
          </div>
        </header>

        <div className="mt-14 grid gap-10 border-t border-line pt-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:order-2 lg:col-span-4">
            <div data-reveal="" className="card p-7 lg:sticky lg:top-28">
              <h2 className="eyebrow">{t.details}</h2>
              <dl className="mt-6 grid gap-5">
                {details.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line text-lime">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <div>
                      <dt className="text-sm text-muted">{label}</dt>
                      <dd className="mt-0.5 font-medium text-fg">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <div className="mt-8 border-t border-line pt-6">
                <ButtonLink href={job.applyUrl} arrow className="w-full" magnetic={false}>{t.applyCta}</ButtonLink>
              </div>
            </div>
          </aside>

          <div className="lg:order-1 lg:col-span-8">
            {/* most descriptions open with their own heading — then this one is for screen readers only */}
            <h2 data-reveal="" className={job.html.startsWith("<h") ? "sr-only" : "h3"}>{t.about}</h2>
            {/* sanitised in lib/jobs.ts (allow-listed tags, https/mailto links only) */}
            <div data-reveal="" className="prose-jm mt-6" dangerouslySetInnerHTML={{ __html: job.html }} />

            <div data-reveal="" className="card mt-14 flex flex-col items-start gap-6 overflow-hidden p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
              <div>
                <p className="font-display text-2xl font-semibold tracking-[-0.03em]">{t.readyTitle}</p>
                <p className="mt-2 text-muted">{t.readyBody}</p>
              </div>
              <a href={job.applyUrl} className="btn btn-primary shrink-0">
                <span>{t.applyCta}</span>
                <ArrowUpRight aria-hidden="true" className="btn-arrow size-[1.1em]" strokeWidth={2.2} />
              </a>
            </div>
          </div>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </main>
  );
}
