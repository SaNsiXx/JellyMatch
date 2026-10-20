# Jelly Match — DESIGN.md

Landing page (PL) for **Jelly Match** (rebrand of Staffinit — AI ATS that starts free).
Visual language = **jellylabs.tech** (dark "neon lab", translucent jelly 3D, rich motion) × **Jelly Match brand concept**
(lime + violet, overlapping jelly "M" mark). Same mood and craft level, not a copy: no Jelly Labs logos, copy, art or
rainbow-spectrum signature.

## 0. How the reference was analysed

`www.jellylabs.tech` is blocked by this environment's network policy, but the session repo `sansixx/jellylab` is the
site's source. It was run locally (`next dev`, `/pl`) and inspected in headless Chromium at 1440×900 (scroll
screenshots, computed styles, loaded fonts) plus a read of its CSS/animation code (`app/globals.css`,
`components/hero/*`, `components/ui/MicroInteractions.tsx`, `Reveal.tsx`, `SiteHeader.tsx`).

### Reference findings (jellylabs.tech)

| Area | Observation |
|---|---|
| Ground | Near-black `#07080D`, surfaces `#10131C` / `#171B27`, hairlines `rgba(255,255,255,.12)`, text `#F7F8FC`, muted `#A9AFBF` |
| Accent | Full neon spectrum (cyan→blue→violet→lime→emerald→amber→orange→red), used as flowing gradient on the 2nd half of every headline, conic rotating button borders, header underline |
| Type | Display **Space Grotesk** 600, tracking −0.035em, line-height 1.02, H1 `clamp(4.5rem,8vw,7rem)`, H2 `clamp(2.25rem,5.2vw,4.25rem)`; body **Inter** 18px/1.6; eyebrows mono 12px, tracking .28em, uppercase; buttons Space Grotesk 13px 600 uppercase tracking .16em |
| Grid | 1280px container, 12-col, 24px gutters; sections `clamp(7rem,12vw,11rem)` vertical; headline left (8 cols) + lead right (4 cols) pattern |
| Shapes | Pill buttons (999px), cards 24px radius with 1px hairline, lab corner brackets (top-left / bottom-right) that turn lime + glow on hover |
| Nav | Fixed, transparent → blurred `bg/72` + neon hairline after 12px scroll; links muted→white; pill locale switch; neon pill CTA |
| Hero | 100svh, left-aligned 2-line H1 (line 2 gradient), WebGL translucent jelly blobs on the right (simplex-noise displaced spheres, fresnel + iridescence, pointer attraction, drift out on scroll), circuit "tech lines" drawing in with travelling pulse dots, crosshair markers, readability scrim |
| Backdrop | Fixed layer of 3 huge blurred colour auras drifting 46–58 s, occasional light "signal" streaks crossing the screen |
| Motion | Reveal: opacity 0 + translateY 24px → 0, 720ms `cubic-bezier(.22,1,.36,1)`, stagger 70–90ms; marquee 48s linear; magnetic buttons (±6px); card spotlight following cursor; wordmark squish on hover; FAQ plus→x rotate; all off under `prefers-reduced-motion` |

## 1. Tokens (Jelly Match)

```css
--ink:        #0B0B0F;   /* page ground (brand #101014 lifted darker for depth) */
--ink-2:      #101014;   /* brand ink — cards, app-icon tile */
--ink-3:      #17171D;   /* raised surface */
--line:       rgba(245,245,247,.10);
--fg:         #F5F5F7;   /* brand light */
--muted:      #A1A1AA;   /* ≥ 7:1 on --ink */
--lime:       #C6FF00;   /* brand primary — CTAs, key numbers */
--lime-ink:   #0B0B0F;   /* text on lime (17:1) */
--violet:     #8B5CF6;   /* brand secondary — glows, links, AI */
--violet-hi:  #A78BFA;   /* violet text on dark (≥ 4.5:1) */
--blend:      #D9E8A0;   /* the translucent overlap drop in the logo */
--grad-match: linear-gradient(100deg,#C6FF00 0%,#D9E8A0 45%,#8B5CF6 100%);
--radius-pill: 999px; --radius-card: 28px; --radius-tile: 20px;
--ease-jelly: cubic-bezier(.22,1,.36,1);   /* settle */
--ease-wobble: cubic-bezier(.34,1.56,.64,1); /* overshoot for jelly squish */
--dur-micro: 160ms; --dur-std: 420ms; --dur-section: 800ms;
```

Rule: lime and violet are the only accents. Lime = action/value (primary CTA, prices, counters). Violet = AI/intelligence
(selection narrative, glows). Their overlap (lime→violet gradient) is reserved for one headline fragment per section —
our equivalent of Jelly Labs' spectrum text.

## 2. Typography

- Display: **Outfit** 600/700 (rounded geometric, closest to the "Jelly Match" wordmark; Jelly Labs uses Space
  Grotesk — we keep the same tight, large, confident setting but our own face). Tracking −0.04em, lh 0.98.
- Body: **Inter** (variable) 16/18px, lh 1.6.
- Mono eyebrow / data: **JetBrains Mono** 12px, tracking .24em, uppercase.
- Scale: H1 `clamp(3rem, 9vw, 8.5rem)` · H2 `clamp(2.4rem, 5.6vw, 5rem)` · H3 `clamp(1.25rem,1.8vw,1.6rem)` ·
  price `clamp(3rem,5vw,4.5rem)` tabular nums · lead 20px.
- All via `next/font` with `display: swap`, latin-ext subset (Polish diacritics).

## 3. Layout & rhythm

- Container `min(1320px, 100vw - 32px)` (16px gutter on mobile), 12 columns.
- Section padding `clamp(6rem, 12vw, 11rem)`; inner rhythm 8px base (8/16/24/40/64/96).
- Breakpoints tested: 375 / 768 / 1280 / 1920.

## 4. Section order

1. Preloader (logo M legs drop in, overlap fills, counter 0→100, curtain wipe)
2. Nav (logo · Cennik · Oferty pracy · PL · Zaloguj się · **Załóż konto**)
3. Hero — video loop bg, split-letter H1, lead, 2 CTAs, badge „Pierwsza selekcja AI za darmo”, scroll cue
4. Marquee — „Bez karty kredytowej • Bez opłat za użytkownika • Selekcja AI • …”
5. Korzyści — 3 cards with Higgsfield art + animated counters (1 / 250 / 0 zł)
6. Selekcja AI — pinned scroll story (CV stack → scoring → shortlist), 3–4 steps scrubbed
7. Cennik — intro, Monthly/Yearly toggle, 4 tilt cards + Enterprise strip, notes
8. Trzy zasady — numbered list with large outline numerals
9. Final CTA — huge headline, mascot, buttons
10. Footer

## 5. Animation patterns (to implement)

| # | Pattern | Tech | Notes |
|---|---|---|---|
| 1 | Preloader → hero hand-off | GSAP timeline | ≤ 1.6 s, skipped on repeat visit (sessionStorage) and reduced motion |
| 2 | Headline reveal by char/line (masked, y 110% → 0, slight rotate) | GSAP + custom splitter | aria-label on parent, chars aria-hidden |
| 3 | Hero parallax (video scale 1.1→1.25, copy y, blur on exit) | ScrollTrigger scrub | |
| 4 | Smooth scroll | Lenis synced to GSAP ticker | disabled under reduced motion |
| 5 | Custom cursor: dot + lagging ring; grows + label („Załóż”, „Zobacz”) on CTA/cards, inverts on lime | rAF, transform only | fine pointers only |
| 6 | Magnetic buttons (±10px, elastic return) + lime fill wipe on hover | Framer Motion springs | |
| 7 | Section reveals: opacity + y 40px + blur 8px → 0, stagger 80ms | ScrollTrigger batch | blur only on desktop |
| 8 | Pinned "jak działa selekcja AI" — progress rail, step text crossfade, image sequence/states scrubbed | ScrollTrigger pin+scrub | mobile: unpinned stacked steps |
| 9 | Counters 0→N with tabular nums | GSAP on enter | |
| 10 | Infinite marquee, two rows opposite directions, speed reacts to scroll velocity | CSS transform + Lenis velocity | pauses on hover |
| 11 | Pricing cards: 3D tilt (±8°), cursor-following radial glow, border light | pointer → CSS vars | |
| 12 | Monthly/Yearly pill toggle (shared layout knob) + price digit roll | Framer Motion `layoutId` + AnimatePresence | |
| 13 | Header: hide on scroll down / show on up, blur glass after 12px | | |
| 14 | Jelly squish on logo hover (scale 1.06/.92 wobble) | CSS keyframes | |
| 15 | Drifting lime/violet aura backdrop + grain texture overlay | CSS, transform only | |
| 16 | Link underlines draw left→right; arrows nudge | CSS | |

Performance: animate only `transform`/`opacity` (blur limited to short entrances), `will-change` set just-in-time,
video `preload="none"` + poster + IntersectionObserver play/pause, mobile gets poster-only hero below 768px or on
`saveData`. Target Lighthouse Performance ≥ 90.

Reduced motion: no preloader, no Lenis, no pin (static steps), counters render final values, marquee static,
tilt/magnet/cursor off, video replaced by poster.

## 6. Art direction for generated assets ("style block")

> Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow,
> two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into a pale lime-lavender where they overlap,
> deep near-black background #0B0B0F, dramatic rim light and soft studio key light, subtle reflective floor,
> fine film grain, shallow depth of field, minimal composition, generous negative space, no text, no logos, no watermark.

Reference mood: the "two jellies meeting" render in the brand concept board (violet jelly flowing into lime jelly).
