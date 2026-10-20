import { Preloader } from "@/components/Preloader";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Cursor } from "@/components/motion/Cursor";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Benefits } from "@/components/sections/Benefits";
import { AiSelection } from "@/components/sections/AiSelection";
import { Pricing } from "@/components/sections/Pricing";
import { Principles } from "@/components/sections/Principles";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <MotionProvider>
      <Preloader />
      <div className="backdrop" aria-hidden="true">
        <div className="aura aura-violet" />
        <div className="aura aura-lime" />
      </div>
      <div className="grain" aria-hidden="true" />
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <Benefits />
        <AiSelection />
        <Pricing />
        <Principles />
        <FinalCta />
      </main>
      <Footer />
      <Cursor />
      <MotionRoot />
    </MotionProvider>
  );
}
