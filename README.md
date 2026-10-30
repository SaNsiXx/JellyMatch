# Jelly Match — landing page (PL)

Strona marketingowa ATS-u z AI, który zaczyna się za darmo.
Next.js (App Router), TypeScript, Tailwind CSS, GSAP + ScrollTrigger, Lenis, Framer Motion.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck
npm run qa         # wymaga działającego serwera i lokalnego Chrome: node scripts/qa.mjs <url> <folder na zrzuty>
```

## Gdzie co jest

| Ścieżka | Zawartość |
|---|---|
| `lib/content.ts` | Wszystkie teksty, plany, ceny i linki |
| `components/` | Sekcje strony |
| `components/MotionRoot.tsx` | Lenis, ScrollTrigger (pin selekcji AI), reveal, liczniki, magnes, glow |
| `DESIGN.md` | Analiza referencji, tokeny, wzorce animacji, style block |
| `assets.md` | Każdy asset: plik, model, prompt, przeznaczenie, alt |
| `scripts/generate-assets.mjs` | Generowanie przez Higgsfield CLI do `raw-assets/` (PNG/MP4 poza gitem, rekordy JSON w gicie) |
| `scripts/optimize-assets.mjs` | `npm run assets`: AVIF, WebP, MP4, WebM, OG, `lib/assets.json` |

## Przed publikacją

W `lib/content.ts` są oznaczone TODO:

- `LINKS.jobs`, `LINKS.terms`, `LINKS.privacy`: brief nie podaje adresów, chwilowo prowadzą na `staffinit.com/pl`.
- `LINKS.sales`: brak kontaktu do sprzedaży, chwilowo rejestracja.
- `yearly` w planach Starter, Growth, Scale: bez kwot. Przełącznik „Rocznie” pokazuje wtedy ceny miesięczne i komunikat „Ceny roczne wkrótce”.

Ustaw też `NEXT_PUBLIC_SITE_URL`, żeby canonical i adresy OG były absolutne. Linki CTA prowadzą na `staffinit.com`, zgodnie z briefem.
