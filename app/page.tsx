import { AiSelection } from "@/components/AiSelection";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Benefits } from "@/components/Benefits";
import { Cursor } from "@/components/Cursor";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { MotionRoot } from "@/components/MotionRoot";
import { Preloader } from "@/components/Preloader";
import { Pricing } from "@/components/Pricing";
import { Principles } from "@/components/Principles";

export default function Home() {
  return (
    <>
      <a href="#tresc" className="skip-link">Przejdź do treści</a>
      <AmbientBackground />
      <Preloader />
      <Header />
      <main id="tresc">
        <Hero />
        <Marquee />
        <Benefits />
        <AiSelection />
        <Pricing />
        <Principles />
        <FinalCta />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <MotionRoot />
    </>
  );
}
