// Single-file build of the Jelly Match home page: the real components, rendered client-side.
import "./assets";
import { createRoot } from "react-dom/client";
import { useEffect, useSyncExternalStore } from "react";
import { getLocale, hasSwitched, subscribe } from "./locale";
import { content } from "@/lib/content";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Backdrop } from "@/components/motion/Backdrop";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Benefits } from "@/components/sections/Benefits";
import { AiSelection } from "@/components/sections/AiSelection";
import { Pricing } from "@/components/sections/Pricing";
import { Principles } from "@/components/sections/Principles";
import { FinalCta } from "@/components/sections/FinalCta";

function Page() {
  const locale = useSyncExternalStore(subscribe, getLocale, getLocale);
  // the preloader plays once; a language switch just re-renders the page
  const preload = !useSyncExternalStore(subscribe, hasSwitched, hasSwitched);
  const c = content[locale];
  useEffect(() => {
    document.title = c.meta.title;
  }, [c]);
  return (
    <MotionProvider key={locale}>
      <a href="#main" className="sr-only z-[90] rounded-full bg-lime px-5 py-3 font-display font-semibold text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        {c.ui.skip}
      </a>
      <Backdrop />
      <div className="grain" aria-hidden="true" />
      <Header />
      {preload && <Preloader />}
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
      <MotionRoot />
    </MotionProvider>
  );
}

createRoot(document.getElementById("app")!).render(<Page />);
