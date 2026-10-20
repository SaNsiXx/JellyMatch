import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { toLocale } from "@/i18n/locale";
import { content } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { LegalDocument } from "@/components/LegalDocument";

export async function generateMetadata({ params }: PageProps<"/[locale]/terms">): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const { title, metaDescription } = content[locale].pages.legal.terms;
  return pageMetadata(locale, "/terms", `${title} — Jelly Match`, metaDescription);
}

export default async function Page({ params }: PageProps<"/[locale]/terms">) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  return <LegalDocument doc="terms" locale={locale} />;
}
