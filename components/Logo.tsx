export function LogoMark({ className = "", size = 36, animated = false }: { className?: string; size?: number; animated?: boolean }) {
  return (
    <svg className={`logo-mark ${className}`} width={size} height={(size * 80) / 120} viewBox="0 0 120 80" fill="none" overflow="visible" aria-hidden="true">
      <defs>
        <linearGradient id="jm-drop" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#D9E8A0" />
          <stop offset="1" stopColor="#B7A6E8" />
        </linearGradient>
      </defs>
      <path className={animated ? "pre-left" : undefined} d="M20 60 42 22 60 52" stroke="#C6FF00" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
      <path className={animated ? "pre-right" : undefined} d="M100 60 78 22 60 52" stroke="#8B5CF6" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
      <path className={animated ? "pre-drop" : undefined} d="M60 28c8 9 16 19 16 30a16 16 0 0 1-32 0c0-11 8-21 16-30Z" fill="url(#jm-drop)" />
    </svg>
  );
}

export function Logo() {
  return (
    <>
      <LogoMark />
      <span className="font-display text-[1.3rem] font-semibold tracking-[-0.02em]">Jelly Match</span>
    </>
  );
}
