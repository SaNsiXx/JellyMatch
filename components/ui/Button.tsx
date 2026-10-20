"use client";

import { useRef, type ReactNode } from "react";
import { m, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const PULL = 0.32; // share of the pointer offset the button follows
const MAX = 14; // px

/** Magnetic wrapper: the child drifts toward the pointer and springs back on leave. */
export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const clamp = (v: number) => Math.max(-MAX, Math.min(MAX, v));
    x.set(clamp((e.clientX - (r.left + r.width / 2)) * PULL));
    y.set(clamp((e.clientY - (r.top + r.height / 2)) * PULL));
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.span
      ref={ref}
      className={`inline-flex ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </m.span>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  arrow?: boolean;
  cursor?: string;
  className?: string;
  magnetic?: boolean;
};

export function ButtonLink({ href, children, variant = "primary", arrow = false, cursor, className = "", magnetic = true }: ButtonProps) {
  const external = href.startsWith("http");
  const link = (
    <a
      href={href}
      className={`btn ${variant === "primary" ? "btn-primary" : "btn-ghost"} ${className}`}
      data-cursor={cursor}
      {...(external ? { rel: "noopener" } : {})}
    >
      <span>{children}</span>
      {arrow && <ArrowUpRight aria-hidden="true" className="btn-arrow size-[1.1em]" strokeWidth={2.2} />}
    </a>
  );
  return magnetic ? <Magnetic className={className.includes("w-full") ? "w-full" : ""}>{link}</Magnetic> : link;
}
