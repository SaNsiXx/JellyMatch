"use client";

import { useRef, type ElementType } from "react";
import { useGsap, prefersReducedMotion, onAppReady } from "@/lib/motion";

type Props = {
  /** Text; a "|" marks where the gradient part starts. Ignored when `lines` is given. */
  text?: string;
  /** Explicit lines (hero). The last line gets the gradient. */
  lines?: string[];
  as?: ElementType;
  className?: string;
  id?: string;
  /** "scroll" (default) reveals on enter; "ready" waits for the preloader. */
  trigger?: "scroll" | "ready";
  delay?: number;
};

const plain = (s: string) => s.replace(/\s*\|\s*/g, " ").trim();

function Word({ word, gradient }: { word: string; gradient: boolean }) {
  return gradient ? <span className="grad-text">{word}</span> : <>{word}</>;
}

function Words({ text, gradient }: { text: string; gradient: boolean }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <Word word={w} gradient={gradient} />
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

/** Headline that rises in as one block with a gentle fade (no per-letter cascade). Screen readers get the plain text via aria-label. */
export function SplitHeading({ text = "", lines, as: Tag = "h2", className = "", id, trigger = "scroll", delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGsap(({ gsap }) => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    // the visual copy (the aria-hidden span) slides up a little while it fades in — whole lines, no cascade
    const body = el.firstElementChild as HTMLElement;
    const from = { opacity: 0, y: "0.35em" };
    const to = { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay, clearProps: "transform" };
    if (trigger === "ready") {
      // no preloader this time (already shown in this session): the title is on screen — leave it be, no flash
      if ((window as Window & { __jmReady?: boolean }).__jmReady) return;
      gsap.set(body, from);
      return onAppReady(() => gsap.to(body, to));
    }
    const tween = gsap.fromTo(body, from, { ...to, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [trigger, delay]);

  const label = lines ? lines.join(" ") : plain(text);
  const [head, tail] = text.includes("|") ? text.split(/\s*\|\s*/) : [text, ""];

  return (
    <Tag ref={ref} id={id} className={className} aria-label={label} data-split={trigger}>
      <span aria-hidden="true">
        {lines ? (
          lines.map((line, i) => (
            <span key={i} className="block">
              <Words text={line} gradient={i === lines.length - 1} />
            </span>
          ))
        ) : (
          <>
            <Words text={head ?? ""} gradient={false} />
            {tail ? (
              <>
                {" "}
                <Words text={tail} gradient />
              </>
            ) : null}
          </>
        )}
      </span>
    </Tag>
  );
}
