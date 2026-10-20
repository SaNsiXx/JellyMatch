import { useId } from "react";

const LIME = "M16 66 L40 22 L64 66";
const VIOLET = "M56 66 L80 22 L104 66";

/** Jelly Match mark: two jelly arches (lime + violet) whose overlap forms a translucent drop. */
export function LogoMark({ className = "", draw = false }: { className?: string; draw?: boolean }) {
  const id = useId().replace(/:/g, "");
  const stroke = { fill: "none", strokeWidth: 26, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 6 120 76" className={className} aria-hidden="true">
      <defs>
        <mask id={`m-${id}`} maskUnits="userSpaceOnUse">
          <path d={VIOLET} stroke="#fff" {...stroke} />
        </mask>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9e8a0" />
          <stop offset="1" stopColor="#b9b2e6" />
        </linearGradient>
      </defs>
      <g className="logo-mark">
        <path d={LIME} stroke="#c6ff00" {...stroke} pathLength={1} data-draw={draw ? "" : undefined} />
        <path d={VIOLET} stroke="#8b5cf6" {...stroke} pathLength={1} data-draw={draw ? "" : undefined} />
        <path d={LIME} stroke={`url(#g-${id})`} mask={`url(#m-${id})`} {...stroke} data-blend={draw ? "" : undefined} />
      </g>
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-[1.35em] w-auto" />
      <span className="font-display text-[1.25em] font-bold tracking-[-0.045em] text-fg">Jelly Match</span>
    </span>
  );
}
