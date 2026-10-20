import "server-only";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/**
 * Public openings of the hiring app — the same list staffinit.com/jobs renders.
 * Applications stay in the app (it owns the form), so each job links out to `applyUrl`.
 */
const API = "https://staffinit.com/api/public/jobs";
const APP = "https://staffinit.com";
export const JOBS_REVALIDATE = 3600;

export type JobType = "full_time" | "part_time" | "contract" | "internship";

type ApiJob = {
  title: string;
  slug: string;
  description: string;
  location: string | null;
  type: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  salaryUnit: string | null;
  remoteStatus: string | null;
  createdAt: string;
  organizationName: string | null;
};

export type Job = {
  slug: string;
  title: string;
  company: string;
  location: string | null;
  type: JobType | null;
  remote: "remote" | "hybrid" | "onsite" | null;
  salary: { min: number | null; max: number | null; currency: string; unit: "HOUR" | "MONTH" | "YEAR" } | null;
  posted: string;
  applyUrl: string;
  /** Sanitised HTML rendered from the job's markdown. */
  html: string;
  excerpt: string;
};

const TYPES: JobType[] = ["full_time", "part_time", "contract", "internship"];
const REMOTE = ["remote", "hybrid", "onsite"] as const;
const UNITS = ["HOUR", "MONTH", "YEAR"] as const;

function toHtml(markdown: string) {
  return sanitizeHtml(marked.parse(markdown, { async: false, gfm: true, breaks: true }), {
    allowedTags: ["h2", "h3", "h4", "p", "ul", "ol", "li", "strong", "b", "em", "i", "a", "br", "blockquote", "code"],
    allowedAttributes: { a: ["href", "rel", "target"] },
    allowedSchemes: ["https", "mailto"],
    transformTags: {
      // the job title is the page's H1, so content headings start one level below it
      h1: "h2",
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener nofollow", target: "_blank" }),
    },
  });
}

/** Plain-text excerpts are rendered as text by React, so undo the HTML escaping sanitize-html applied. */
const decodeEntities = (s: string) =>
  s.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, e: string) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", nbsp: " " })[e] ?? _);

function toJob(j: ApiJob): Job {
  const html = toHtml(j.description ?? "");
  const text = decodeEntities(sanitizeHtml(html.replace(/<\/(h\d|p|li)>/g, " "), { allowedTags: [], allowedAttributes: {} }))
    .replace(/\s+/g, " ")
    .trim();
  const unit = UNITS.find((u) => u === j.salaryUnit) ?? "YEAR";
  return {
    slug: j.slug,
    title: j.title,
    company: j.organizationName ?? "",
    location: j.location,
    type: TYPES.find((t) => t === j.type) ?? null,
    remote: REMOTE.find((r) => r === j.remoteStatus) ?? null,
    salary: j.salaryMin || j.salaryMax ? { min: j.salaryMin, max: j.salaryMax, currency: j.salaryCurrency ?? "", unit } : null,
    posted: j.createdAt,
    applyUrl: `${APP}/jobs/${encodeURIComponent(j.slug)}/apply`,
    html,
    excerpt: text.length > 200 ? `${text.slice(0, 197).replace(/\s+\S*$/, "")}…` : text,
  };
}

/** All public openings (follows pagination). Empty when the API is unreachable — pages show a friendly state. */
export async function getJobs(): Promise<Job[]> {
  const out: Job[] = [];
  try {
    for (let page = 1; page <= 10; page++) {
      const res = await fetch(`${API}?page=${page}&limit=40`, { next: { revalidate: JOBS_REVALIDATE } });
      if (!res.ok) break;
      const body = (await res.json()) as { data: ApiJob[]; total: number };
      out.push(...body.data.map(toJob));
      if (out.length >= body.total || body.data.length === 0) break;
    }
  } catch {
    // network/API failure → whatever was collected so far
  }
  return out;
}

/** List-card view of a job: everything except the full description. */
export function toSummary(job: Job): Omit<Job, "html"> {
  const { html, ...summary } = job;
  void html;
  return summary;
}

export async function getJob(slug: string) {
  return (await getJobs()).find((j) => j.slug === slug) ?? null;
}
