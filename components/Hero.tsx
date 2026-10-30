"use client";

import { useEffect, useRef, useState } from "react";
import { HERO, LINKS } from "@/lib/content";
import { Cta } from "./Cta";
import { Picture } from "./Picture";
import { SplitHeading } from "./SplitHeading";

type NetInfo = { connection?: { saveData?: boolean } };

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useVideo, setUseVideo] = useState(false);

  // The poster is the LCP image; the loop only starts after load, and never for Save-Data or reduced motion.
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || (navigator as NetInfo).connection?.saveData) return;
    const start = () => setUseVideo(true);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, [useVideo]);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-media" data-parallax="hero">
        <Picture name="hero-key" alt="" sizes="100vw" priority />
        {useVideo && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            onPlaying={(e) => { e.currentTarget.dataset.playing = "true"; }}
          >
            <source src="/assets/hero-loop.webm" type="video/webm" />
            <source src="/assets/hero-loop.mp4" type="video/mp4" />
          </video>
        )}
      </div>
      <div className="hero-scrim" />

      <div className="container-jm" data-parallax="hero-copy">
        <div className="max-w-[46rem]">
          <p className="badge hero-in mb-6" style={{ "--d": 0 } as React.CSSProperties}>
            <span className="badge-dot" aria-hidden="true" />
            {HERO.badge}
          </p>
          <div id="hero-title"><SplitHeading before={HERO.before} accent={HERO.accent} /></div>
          <p className="lead hero-in mt-6" style={{ "--d": 120 } as React.CSSProperties}>{HERO.lead}</p>
          <div className="hero-in mt-8 flex flex-col gap-3 sm:flex-row" style={{ "--d": 240 } as React.CSSProperties}>
            <Cta href={LINKS.signUp} arrow>{HERO.primary}</Cta>
            <Cta href={LINKS.demo} variant="ghost">{HERO.secondary}</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
