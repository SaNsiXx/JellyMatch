import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { toLocale } from "@/i18n/locale";
import { content } from "@/lib/content";
import { getJobs, toSummary } from "@/lib/jobs";
import { pageMetadata } from "@/lib/seo";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { JobBoard } from "@/components/jobs/JobBoard";
import { ButtonLink } from "@/components/ui/Button";

export const revalidate = 3600; // = JOBS_REVALIDATE (segment config must be a literal)

export async function generateMetadata({ params }: PageProps<"/[locale]/jobs">): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const { metaTitle, metaDescription } = content[locale].pages.jobs;
  return pageMetadata(locale, "/jobs", metaTitle, metaDescription);
}

export default async function JobsPage({ params }: PageProps<"/[locale]/jobs">) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  const c = content[locale];
  const t = c.pages.jobs;
  const jobs = await getJobs();

  return (
    <main id="main" className="relative pt-32 pb-[clamp(5rem,10vw,9rem)] lg:pt-44">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[34rem] w-[70rem] -translate-x-1/2 rounded-full bg-violet/15 blur-[120px]" />
      </div>
      <div className="container-jm">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p data-reveal="" className="eyebrow">{t.eyebrow}</p>
            <SplitHeading as="h1" text={t.title} className="mt-5 font-display text-[clamp(3rem,8vw,7rem)] font-semibold" />
          </div>
          <p data-reveal="" className="lead lg:col-span-4">{t.body}</p>
        </div>

        <div className="mt-14 lg:mt-20">
          {/* the list only needs summaries — full descriptions stay on the detail pages */}
          <JobBoard jobs={jobs.map(toSummary)} />
        </div>

        <div data-reveal="" className="card mt-16 flex flex-col items-start gap-6 p-8 sm:p-10 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl">{t.hiringCta}</p>
          <ButtonLink href={c.links.signUp} arrow>{t.hiringButton}</ButtonLink>
        </div>
      </div>
    </main>
  );
}
