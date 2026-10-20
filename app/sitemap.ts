import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getJobs } from "@/lib/jobs";
import { localePath, SITE_URL } from "@/lib/seo";

export const revalidate = 3600; // = JOBS_REVALIDATE (segment config must be a literal)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getJobs();
  const paths = ["/", "/pricing", "/jobs", "/terms", "/privacy", ...jobs.map((j) => `/jobs/${j.slug}`)];
  return paths.map((p) => ({
    url: `${SITE_URL}${localePath("en", p)}`,
    alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}${localePath(l, p)}`])) },
  }));
}
