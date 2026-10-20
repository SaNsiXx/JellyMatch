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
  // Gradient words animate as one piece (background-clip:text does not survive per-char transforms).
  if (gradient)
    return (
      <span className="split-line inline-block align-top">
        <span className="split-char grad-text">{word}</span>
      </span>
    );
  return (
    <span className="split-line inline-block align-top">
      {Array.from(word).map((c, i) => (
        <span key={i} className="split-char">
          {c}
        </span>
      ))}
    </span>
  );
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

/** Masked char-by-char headline reveal. Screen readers get the plain text via aria-label. */
export function SplitHeading({ text = "", lines, as: Tag = "h2", className = "", id, trigger = "scroll", delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGsap(({ gsap }) => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const chars = el.querySelectorAll<HTMLElement>(".split-char");
    const play = () =>
      gsap.fromTo(
        chars,
        { y: 0, yPercent: 110, rotate: 6 },
        { yPercent: 0, rotate: 0, duration: 1.15, ease: "expo.out", stagger: 0.022, delay },
      );
    if (trigger === "ready") {
      gsap.set(chars, { y: 0, yPercent: 110, rotate: 6 });
      return onAppReady(() => play());
    }
    const tween = gsap.fromTo(
      chars,
      { y: 0, yPercent: 110, rotate: 6 },
      {
        yPercent: 0,
        rotate: 0,
        duration: 1.15,
        ease: "expo.out",
        stagger: 0.018,
        delay,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      },
    );
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
