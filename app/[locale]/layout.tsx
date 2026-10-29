import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { toLocale } from "@/i18n/locale";
import { content } from "@/lib/content";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Backdrop } from "@/components/motion/Backdrop";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { MotionProvider } from "@/components/motion/MotionProvider";
import "../globals.css";

const outfit = Outfit({ subsets: ["latin", "latin-ext"], weight: ["600", "700"], variable: "--font-outfit", display: "swap" });
const inter = Inter({ subsets: ["latin", "latin-ext"], weight: ["400"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], weight: ["400"], variable: "--font-jetbrains", display: "swap", preload: false });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const { meta } = content[locale];
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: "Jelly Match",
    ...pageMetadata(locale, "/", meta.title, meta.description),
  };
}

export const viewport: Viewport = { themeColor: "#0b0b0f", colorScheme: "dark" };

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  return (
    <html lang={locale} className={`${outfit.variable} ${inter.variable} ${mono.variable}`}>
      <head>
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a href="#main" className="sr-only z-[90] rounded-full bg-lime px-5 py-3 font-display font-semibold text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
          {content[locale].ui.skip}
        </a>
        <NextIntlClientProvider>
          <MotionProvider>
            <Backdrop />
            <div className="grain" aria-hidden="true" />
            <Header />
            {children}
            <Footer />
            <MotionRoot />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
