import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { toLocale } from "@/i18n/locale";
import { content } from "@/lib/content";
import "../globals.css";

const outfit = Outfit({ subsets: ["latin", "latin-ext"], weight: ["600", "700"], variable: "--font-outfit", display: "swap" });
const inter = Inter({ subsets: ["latin", "latin-ext"], weight: ["400"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], weight: ["400"], variable: "--font-jetbrains", display: "swap", preload: false });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const { meta } = content[locale];
  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    applicationName: "Jelly Match",
    alternates: { canonical: locale === "en" ? "/" : "/pl", languages: { en: "/", pl: "/pl", "x-default": "/" } },
    openGraph: {
      type: "website",
      locale: meta.ogLocale,
      siteName: "Jelly Match",
      title: meta.title,
      description: meta.description,
      images: [{ url: meta.ogImage, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: [meta.ogImage] },
  };
}

export const viewport: Viewport = { themeColor: "#0b0b0f", colorScheme: "dark" };

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  return (
    <html lang={locale} className={`${outfit.variable} ${inter.variable} ${mono.variable}`}>
      <head>
        <link rel="preload" as="image" type="image/avif" href="/assets/hero2-loop-poster-1920.avif" media="(min-width: 961px)" />
        <link rel="preload" as="image" type="image/avif" href="/assets/hero2-loop-poster-960.avif" media="(max-width: 960px)" />
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a href="#main" className="sr-only z-[90] rounded-full bg-lime px-5 py-3 font-display font-semibold text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
          {content[locale].ui.skip}
        </a>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
