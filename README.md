# Jelly Match — landing page (EN / PL)

Marketing landing for **Jelly Match** (rebrand of Staffinit — an AI ATS that starts free).
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · next-intl · GSAP + ScrollTrigger · Lenis · Framer Motion.

English is the default at `/`, Polish lives at `/pl` (same mechanism as jellylabs.tech: next-intl,
`localePrefix: "as-needed"`, no Accept-Language redirect, EN | PL switch in the header and mobile menu).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint && npm run typecheck
```

## Pages (EN at `/…`, PL at `/pl/…`)

| Route | Source |
|---|---|
| `/` | landing (hero scroll scene, benefits, AI selection, pricing, principles, final CTA) |
| `/pricing` | pricing section as the page H1 + principles + CTA; annual prices as on staffinit.com |
| `/jobs`, `/jobs/[slug]` | live openings from `https://staffinit.com/api/public/jobs` (ISR, 1 h); applying links to the hiring app |
| `/terms`, `/privacy` | `content/legal/*.html` — Staffinit's documents (English only, as on staffinit.com), product renamed; **legal review before launch** (operator Bespoke Soft and service domains left as they are) |
| sign-in / sign-up | not mirrored — these are the hiring app itself; links go to `staffinit.com/auth/*` |

Local dev behind a proxy: Node's `fetch` ignores `HTTPS_PROXY` unless `NODE_USE_ENV_PROXY=1` is set.

## Where things live

| Path | What |
|---|---|
| `DESIGN.md` | reference analysis (jellylabs.tech + brand board), tokens, type, motion patterns, asset style block |
| `assets.md` | every Higgsfield asset: model, prompt, purpose, alt, output files |
| `lib/content/{en,pl}.ts` | all copy, UI strings, plan texts and outbound links per locale (`useContent()`); TODO: real URLs for Jobs / Terms / Privacy and English Staffinit links |
| `i18n/*`, `proxy.ts` | locale routing (next-intl) |
| `lib/pricing.ts` | plan prices/links (copy comes from the locale); **yearly prices are `null` (TODO)** — the yearly toggle shows monthly amounts until filled in |
| `components/sections/*` | Hero (live WebGL jellies — `components/hero/*` — reacting to cursor and scroll, pinned scroll scene, tagline), Marquee, Benefits, AiSelection (pinned scroll story), Pricing, Principles, FinalCta |
| `components/motion/*` | MotionRoot (Lenis + reveals + counters), SplitHeading, MotionProvider (lazy framer features) |
| `scripts/optimize-assets.mjs` | `raw-assets/` → `public/assets` (AVIF/WebP sets, MP4+WebM, posters) + `lib/assets.json` |
| `scripts/record-jellies.mjs` | records the hero jellies into seamless loops (`public/assets/hero-jellies-*`) for devices without a GPU |
| `scripts/build-og.mjs` | `public/og.jpg` (PL) and `public/og-en.jpg` (EN) from the Higgsfield OG render (needs the Outfit font installed for librsvg) |

## Motion & performance notes

- GSAP/ScrollTrigger and Lenis load after hydration (`lib/motion.ts → loadGsap`), framer-motion features via `LazyMotion`.
- The SSR preloader covers the first screen, so the hero text paints immediately (LCP) and animates in after it.
- Hero jellies are ray-marched in WebGL at reduced resolution (adaptive if the GPU struggles). Without a GPU (WebGL missing
  or CPU-emulated, e.g. Chrome with hardware acceleration off) or when even the lowest resolution is too slow, the hero shows
  a pre-recorded loop of the same engine instead (re-record after changing the jellies: `node scripts/record-jellies.mjs`).
- `prefers-reduced-motion`: no preloader, no smooth scroll, no pin (stacked steps), static marquee, no tilt/magnet.

Set `NEXT_PUBLIC_SITE_URL` in production so canonical/OG URLs are absolute.
