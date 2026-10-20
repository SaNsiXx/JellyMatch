import { setRequestLocale } from "next-intl/server";
import { toLocale } from "@/i18n/locale";
import { Preloader } from "@/components/Preloader";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Benefits } from "@/components/sections/Benefits";
import { AiSelection } from "@/components/sections/AiSelection";
import { Pricing } from "@/components/sections/Pricing";
import { Principles } from "@/components/sections/Principles";
import { FinalCta } from "@/components/sections/FinalCta";

export default async function Home({ params }: PageProps<"/[locale]">) {
  setRequestLocale(toLocale((await params).locale));
  return (
    <>
      {/* React hoists these into <head>: the hero poster is the LCP image of the home page only */}
      <link rel="preload" as="image" type="image/avif" href="/assets/hero2-loop-poster-1920.avif" media="(min-width: 961px)" />
      <link rel="preload" as="image" type="image/avif" href="/assets/hero2-loop-poster-960.avif" media="(max-width: 960px)" />
      <Preloader />
      <main id="main">
        <Hero />
        <Marquee />
        <Benefits />
        <AiSelection />
        <Pricing />
        <Principles />
        <FinalCta />
      </main>
    </>
  );
}
