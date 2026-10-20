"use client";

import { useRef } from "react";
import { useGsap, prefersReducedMotion, hasFinePointer } from "@/lib/motion";

/**
 * Dot + lagging ring. Over links/buttons the ring grows; over [data-cursor="Label"] it fills and shows the label.
 * Fine pointers only; the native cursor is restored under reduced motion or on touch.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGsap(({ gsap }) => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    const d = dot.current!, r = ring.current!, i = inner.current!, l = label.current!;
    document.documentElement.classList.add("has-cursor");

    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3" });

    let mode = "";
    const setMode = (next: string, text = "") => {
      if (next === mode && l.textContent === text) return;
      mode = next;
      l.textContent = text;
      const labelled = next === "label";
      i.style.transform = labelled ? "scale(2.1)" : next === "hover" ? "scale(1.5)" : "scale(1)";
      i.style.backgroundColor = labelled ? "#f5f5f7" : next === "hover" ? "rgb(198 255 0 / 0.12)" : "transparent";
      r.style.borderColor = labelled ? "transparent" : next === "hover" ? "#c6ff00" : "rgb(245 245 247 / 0.45)";
      l.style.opacity = labelled ? "1" : "0";
      l.style.transform = labelled ? "scale(0.48)" : "scale(0.3)";
      d.style.opacity = labelled ? "0" : "1";
    };

    const onMove = (e: PointerEvent) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      gsap.to([r], { opacity: 1, duration: 0.3, overwrite: "auto" });
      if (mode !== "label") d.style.opacity = "1";
      const t = e.target instanceof Element ? e.target : null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      if (labelled) return setMode("label", labelled.dataset.cursor ?? "");
      if (t?.closest("a, button, [role='button'], input, label")) return setMode("hover");
      setMode("");
    };
    const onLeave = () => gsap.to([d, r], { opacity: 0, duration: 0.3 });
    const onDown = () => gsap.to(r, { scale: 0.8, duration: 0.2 });
    const onUp = () => gsap.to(r, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div aria-hidden="true" className="hidden [@media(hover:hover)_and_(pointer:fine)]:block motion-reduce:!hidden">
      <div ref={ring} className="cursor-ring opacity-0">
        <div ref={inner} className="cursor-ring-inner">
          <span ref={label} className="cursor-label" />
        </div>
      </div>
      <div ref={dot} className="cursor-dot opacity-0" />
    </div>
  );
}
