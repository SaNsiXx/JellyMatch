import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { content } from "@/lib/content";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Locale-aware path: EN has no prefix, PL lives under /pl (same as the next-intl routing). */
export const localePath = (locale: Locale, path: string) => (locale === "en" ? path || "/" : `/pl${path === "/" ? "" : path}`);

/** Title/description + canonical, hreflang alternates and OG for one page in one locale. */
export function pageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const { meta } = content[locale];
  return {
    title,
    description,
    alternates: {
      canonical: localePath(locale, path),
      languages: { en: localePath("en", path), pl: localePath("pl", path), "x-default": localePath("en", path) },
    },
    openGraph: {
      type: "website",
      locale: meta.ogLocale,
      siteName: "Jelly Match",
      title,
      description,
      url: localePath(locale, path),
      images: [{ url: meta.ogImage, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [meta.ogImage] },
  };
}
