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
