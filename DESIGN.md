# Jelly Match — DESIGN.md

Landing page PL dla Jelly Match (rebranding Staffinit, ATS z AI, który zaczyna się za darmo).
Język wizualny: klimat i poziom jellylabs.tech + brand board Jelly Match (limonka, fiolet, nakładające się „M”).
Podobny, nie kopia: bez logotypów, tekstów, grafik i tęczowego spektrum Jelly Labs.

## 0. Skąd te wnioski

Strona otwarta 2026-10-30 we wbudowanej przeglądarce (1440×900 i 375×812): zrzuty ze scrollu, style obliczone, reguły CSS, keyframes.
Stany hover odczytane z reguł CSS, nie sprawdzane ręcznie kursorem. Siła magnesu i spotlight: z kodu źródłowego strony (`components/ui/MicroInteractions.tsx`).

## 1. Analiza referencji

| Obszar | Co jest na jellylabs.tech |
|---|---|
| Tło | `#07080D`, powierzchnie `#10131C`, linie `#FFFFFF1F`, tekst `#F7F8FC`, drugorzędny `#A9AFBF` |
| Akcent | Pełne spektrum neonowe (`#13C8FF → #306BFF → #6B38FF → #8DFF45 → #00D47E → #FFD25A → #FF9A31 → #FF4D5E`), płynący gradient na końcówce nagłówków |
| Display | Space Grotesk 600. H1 ok. 76 px przy 1440 (`clamp(4.5rem, 7.4vw, 6.5rem)`), tracking ok. -0,035em, interlinia ok. 1,02. H2 `clamp(2.25rem, 5.2vw, 4.25rem)`. H3 20–24 px |
| Tekst | Inter 400, 18 px / 1,6; lead 20 px |
| Eyebrow | Mono 12 px, wersaliki, tracking 0,28em, kreska z neonem przed tekstem |
| Siatka | Kontener `min(1280px, 100vw - 48px)`; sekcje `clamp(7rem, 12vw, 11rem)`, mobile 5rem; układ: nagłówek po lewej, lead po prawej |
| Kształty | Przyciski-pigułki (999 px, min. 48 px wys.), karty 24 px z linią 1 px i narożnymi klamrami „lab” |
| Przyciski | Tekst Space Grotesk 13 px / 600, wersaliki, tracking 0,16em. Primary: obracająca się konika neonowa z poświatą. Ghost: ciemny, neon po hover |
| Nawigacja | Fixed, przezroczysta; po scrollu rozmyte tło i neonowa linia. Przełącznik EN/PL w pigułce. Na mobile hamburger |
| Kolejność sekcji | Hero → marquee → problem + 3 karty → oferta + 3 karty + tagi → 4 kroki na osi → karta z grafiką → społeczność → wartości → o nas → rynki → FAQ → final CTA → stopka |
| Grafika | Półprzezroczyste, błyszczące galaretki z glow; render 3D produktowy w karcie (kropla w laboratorium); cienkie linie „obwodu” z kropkami |

### Wzorce animacji referencji

| Wzorzec | Parametry |
|---|---|
| Hero: galaretki | Wjazd z trzech stron 2,2–2,6 s, potem unoszenie 8–11 s (orbita, sprężyste odbicie, puls); canvas lub fallback SVG |
| Linie „obwodu” | Rysowanie `stroke-dashoffset` 2,4 s, opóźnienie 0,6 s |
| Tło sekcji | 3 ogromne aury, dryf 46–58 s; okresowe smugi światła co 15 s |
| Marquee | 48 s, liniowy, `translate3d(-50%)`, pauza na żądanie |
| Wejścia przy scrollu | Fade + `translateY(24px)`, IntersectionObserver, `cubic-bezier(.22,1,.36,1)`, stagger przez `delay` |
| Tekst gradientowy | Przepływ 12 s; logo 7 s; przy hover logo „squish” 0,7 s |
| Przycisk | Obrót koniki 4,5 s, magnes, hover `translateY(-1px)` |
| Karta | Spotlight za kursorem (`--sx/--sy`, 420 px), hover: glow i podświetlone klamry |
| Inne | `.live-dot` 1,6 s, „sweep” po sukcesie 1,4 s |
| Reduced motion | Wszystkie powyższe wyłączone |

**Czego referencja nie ma:** własnego kursora, GSAP/pin/scrub, Lenis (jest tylko natywne `scroll-behavior: smooth`), preloadera, reveal liter. Te elementy z briefu projektujemy sami, w tym samym charakterze.

## 2. Tokeny Jelly Match

```css
--ink: #0B0B0F;        /* tło strony */
--ink-2: #101014;      /* karty; brand */
--ink-3: #17171D;      /* powierzchnia wyżej */
--line: rgb(245 245 247 / .12);
--fg: #F5F5F7;         /* brand */
--muted: #A1A1AA;      /* ok. 7,8:1 na --ink */
--lime: #C6FF00;       /* brand: CTA, ceny, liczniki */
--on-lime: #0B0B0F;
--violet: #8B5CF6;     /* brand: AI, poświaty; nie do małego tekstu */
--violet-hi: #A78BFA;  /* fiolet tekstowy */
--blend: #D9E8A0;      /* kropla w logo */
--grad-match: linear-gradient(100deg, #C6FF00, #D9E8A0 45%, #8B5CF6);

--radius-pill: 999px; --radius-card: 24px; --radius-tile: 16px;
--container: min(1280px, 100vw - 48px);
--section-y: clamp(5rem, 12vw, 11rem);

--ease-settle: cubic-bezier(.22,1,.36,1);
--ease-wobble: cubic-bezier(.34,1.56,.64,1);
--dur-micro: 160ms; --dur-std: 420ms; --dur-section: 800ms;
```

Zasada koloru: limonka to działanie i wartość, fiolet to AI, gradient tylko w końcówce nagłówka i w `M`. Jeden primary na ekran.

## 3. Typografia

Logo z board'u ma zaokrąglony, geometryczny krój, więc zamiast Space Grotesk: **Outfit** 600 (display) + **Inter** 400 (tekst) + **JetBrains Mono** (eyebrow), przez `next/font`, z `latin-ext`. Skala jak w referencji. Ceny i liczniki: `tabular-nums`.

## 4. Elementy

- Primary: limonkowa pigułka z ciemnym tekstem, galaretowaty „squish” przy kliknięciu. Secondary: ghost z fioletową poświatą.
- Karty: 24 px, linia 1 px, spotlight za kursorem. Klamry „lab” zastąpione kroplą z logo w narożniku.
- Motyw „linii obwodu” przechodzi w krople płynące od kandydatów do krótkiej listy: to element rozpoznawczy.

## 5. Animacje do zbudowania

| Element | Sposób |
|---|---|
| Preloader | Dwie połówki `M` zlewają się w kroplę, kurtyna odsłania hero; tekst hero w DOM od początku (LCP) |
| Hero | Reveal H1 liniami/literami, parallax, lazy wideo |
| Kursor | Kropla z `mix-blend`, powiększa się nad CTA i kartami; tylko `pointer: fine` |
| Magnes | Max ±6–8 px, tylko `pointer: fine` |
| Wejścia | Fade + translate + blur, stagger 70–90 ms |
| Selekcja AI | GSAP pin + scrub: stos → skan → krótka lista |
| Liczniki | 0 zł, 250 kandydatów, 1 stanowisko: od razu z końcową wartością w HTML |
| Marquee | CSS, `translate3d`, pauza na hover i focus |
| Cennik | Tilt 3D, glow za kursorem, przełącznik z animacją cen |
| Reduced motion | Bez preloadera, Lenis, pin, tilt, magnesu; marquee statyczny, kroki AI jeden pod drugim |
| Mobile | Bez kursora, tilt i magnesu; krótszy pin; poster zamiast wideo przy `Save-Data` |

Tylko `transform`/`opacity` (blur wyłącznie przy krótkich wejściach). GSAP i Lenis ładowane po hydracji.

## 6. Style block do promptów

> Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## 7. Zmiany po przeglądzie

Hero: galaretki WebGL (components/jellyShader.ts). Tło strony: pole WebGL z płynnym światłem i liniami (components/AmbientBackground.tsx), jasność ograniczona do 0.22 w shaderze ze względu na kontrast tekstu. Na mobile, przy reduced motion i bez GPU: obraz hero-jellies i rozmyte plamy CSS. Logo: gradient płynący literami i reveal jak w H1.
