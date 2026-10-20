import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin", "latin-ext"], weight: ["600", "700"], variable: "--font-outfit", display: "swap" });
const inter = Inter({ subsets: ["latin", "latin-ext"], weight: ["400"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], weight: ["400"], variable: "--font-jetbrains", display: "swap", preload: false });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const title = "Jelly Match — oprogramowanie do rekrutacji, które zaczyna się za darmo";
const description =
  "System rekrutacyjny (ATS) z selekcją AI. 1 aktywne stanowisko i pierwsza selekcja AI za darmo, bez karty kredytowej i bez opłat za użytkownika.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Jelly Match",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "Jelly Match",
    title,
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Jelly Match — oprogramowanie do rekrutacji, które zaczyna się za darmo" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
};

export const viewport: Viewport = { themeColor: "#0b0b0f", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${outfit.variable} ${inter.variable} ${mono.variable}`}>
      <head>
        <link rel="preload" as="image" type="image/avif" href="/assets/hero2-loop-poster-1920.avif" media="(min-width: 961px)" />
        <link rel="preload" as="image" type="image/avif" href="/assets/hero2-loop-poster-960.avif" media="(max-width: 960px)" />
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a href="#main" className="sr-only z-[90] rounded-full bg-lime px-5 py-3 font-display font-semibold text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
          Przejdź do treści
        </a>
        {children}
      </body>
    </html>
  );
}
