import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin", "latin-ext"], weight: ["500", "600"], variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin", "latin-ext"], weight: ["400"], variable: "--font-jetbrains", preload: false });

const title = "Jelly Match — oprogramowanie do rekrutacji, które zaczyna się za darmo";
const description =
  "ATS z selekcją AI. Prowadź pierwszą rekrutację za darmo: 1 aktywne stanowisko i 250 kandydatów, bez karty i bez opłat za użytkownika.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "Jelly Match",
    title,
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Jelly Match — limonkowa i fioletowa galaretka łączące się w jedną kroplę" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
};

export const viewport: Viewport = { themeColor: "#0B0B0F" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl" className={`${outfit.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
