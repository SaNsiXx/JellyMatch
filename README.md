# Jelly Match — landing page (PL)

Marketing landing for **Jelly Match** (rebrand of Staffinit — an AI ATS that starts free).
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis · Framer Motion.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint && npm run typecheck
```

## Where things live

| Path | What |
|---|---|
| `DESIGN.md` | reference analysis (jellylabs.tech + brand board), tokens, type, motion patterns, asset style block |
| `assets.md` | every Higgsfield asset: model, prompt, purpose, alt, output files |
| `lib/content.ts` | all copy and outbound links (TODO: real URLs for Oferty pracy / Regulamin / Prywatność) |
| `lib/pricing.ts` | plans; **yearly prices are `null` (TODO)** — the yearly toggle shows monthly amounts until filled in |
| `components/sections/*` | Hero, Marquee, Benefits, AiSelection (pinned scroll story), Pricing, Principles, FinalCta |
| `components/motion/*` | MotionRoot (Lenis + reveals + counters), Cursor, SplitHeading, MotionProvider (lazy framer features) |
| `scripts/optimize-assets.mjs` | `raw-assets/` → `public/assets` (AVIF/WebP sets, MP4+WebM, posters) + `lib/assets.json` |
| `scripts/build-og.mjs` | `public/og.jpg` from the Higgsfield OG render (needs the Outfit font installed for librsvg) |

## Motion & performance notes

- GSAP/ScrollTrigger and Lenis load after hydration (`lib/motion.ts → loadGsap`), framer-motion features via `LazyMotion`.
- The SSR preloader covers the first screen, so the hero text paints immediately (LCP) and animates in after it.
- Hero video loads only on ≥768 px, without Save-Data and without reduced motion; phones get the AVIF poster.
- `prefers-reduced-motion`: no preloader, no smooth scroll, no pin (stacked steps), static marquee, no cursor/tilt/magnet.

Set `NEXT_PUBLIC_SITE_URL` in production so canonical/OG URLs are absolute.
