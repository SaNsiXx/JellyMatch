"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { MARQUEE } from "@/lib/content";

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {MARQUEE.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap font-display text-lg font-medium md:text-xl">
          <span className="px-6 md:px-9">{t}</span>
          <span className="size-2 rounded-full bg-lime" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
}

export function Marquee() {
  const [paused, setPaused] = useState(false);
  return (
    <section className="marquee py-5" data-paused={paused} aria-label="Najważniejsze cechy">
      <div className="marquee-track">
        <Row />
        <Row hidden />
        <Row hidden />
        <Row hidden />
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Wznów przewijanie" : "Wstrzymaj przewijanie"}
        className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink transition-colors hover:border-lime"
      >
        {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
      </button>
    </section>
  );
}
