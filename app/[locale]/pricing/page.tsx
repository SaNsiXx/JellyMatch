import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { toLocale } from "@/i18n/locale";
import { content } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Pricing } from "@/components/sections/Pricing";
import { Principles } from "@/components/sections/Principles";
import { FinalCta } from "@/components/sections/FinalCta";

export async function generateMetadata({ params }: PageProps<"/[locale]/pricing">): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const { metaTitle, metaDescription } = content[locale].pages.pricing;
  return pageMetadata(locale, "/pricing", metaTitle, metaDescription);
}

export default async function PricingPage({ params }: PageProps<"/[locale]/pricing">) {
  setRequestLocale(toLocale((await params).locale));
  return (
    <main id="main" className="pt-16 lg:pt-20">
      <Pricing as="h1" />
      <Principles />
      <FinalCta />
    </main>
  );
}
