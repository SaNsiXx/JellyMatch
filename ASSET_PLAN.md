# Jelly Match — plan assetów (do akceptacji)

**Saldo Higgsfield:** 969,76 kredytu, plan Plus. **Nic jeszcze nie wygenerowano.**

## Dwie rzeczy do decyzji

1. **Obecny connector Higgsfield nie generuje.** Ma tylko saldo, katalog modeli, historię i import. Sam podaje, że „cannot generate media”. Lokalnie nie znalazłem też Higgsfield CLI.
2. **Te assety już istnieją.** Repo `SaNsiXx/JellyMatch` (gałąź `claude/nice-newton-0i38b9`) ma z 20 i 26 października gotowy zestaw z Higgsfield i manifest `assets.md`. Koszt tamtej pracy: 240 kredytów.

## Modele

| Typ | Model | Dlaczego |
|---|---|---|
| Obrazy | Nano Banana Pro (`nano_banana_pro`), 2k/4k | Obrazy referencyjne dają spójną maskotkę i serie |
| Wideo | Seedance 2.0 (`seedance_2_0`), std, 1080p, 8 s, bez audio | Ta sama klatka startowa i końcowa daje pętlę |
| Wideo, zapas | Cinema Studio Video 3.0 | Gdyby pętla Seedance nie była czysta |

Connector nie podaje cen. Szacunek pochodzi z `assets.md`: Seedance 1080p 8 s = 96 kr, Nano Banana Pro = 2–4 kr za obraz.

## Assety

Każdy prompt kończy się style blockiem z `DESIGN.md §6` (poniżej `+STYLE`).

| # | Plik | Parametry | Prompt | Kr |
|---|---|---|---|---|
| 1 | `hero-key` (klatka, poster) | NB Pro 16:9 4k | Wide abstract recruitment funnel: dozens of small glossy lime and violet jelly droplets streaming from the left, flowing into a wide translucent jelly funnel in the right third, emerging below as a short neat row of glowing droplets, left half calm for headline +STYLE | 2–4 |
| 2 | `hero-loop.mp4/.webm` | Seedance 16:9 1080p 8 s, start = koniec = #1 | Seamless loop: droplets drift slowly left to right and pour into the funnel, gently wobbling and glinting, funnel softly pulses with inner light, locked camera +STYLE | 96 |
| 3 | `mascot-hero` | NB Pro 1:1 2k | Stylised friendly modern eagle mascot sculpted entirely from translucent jelly, lime body fading to violet wingtips, rounded simple forms, confident stance, wings half open, three-quarter view, full body +STYLE | 2–4 |
| 4 | `mascot-point` | NB Pro 1:1, ref #3 | The same jelly eagle pointing to the right with one wing like a presenter, friendly expression +STYLE | 2–4 |
| 5 | `mascot-celebrate` | NB Pro 1:1, ref #3 | The same jelly eagle celebrating, both wings raised, small lime and violet jelly droplets bursting around +STYLE | 2–4 |
| 6 | `benefit-free-role` | NB Pro 4:3 | A single glossy lime jelly cube with a soft keyhole-shaped light inside, alone on a small pedestal +STYLE | 2–4 |
| 7 | `benefit-250` | NB Pro 4:3 | A neat grid of many small lime and violet jelly spheres filling a translucent tray, abundant but orderly +STYLE | 2–4 |
| 8 | `benefit-team` | NB Pro 4:3 | A cluster of soft jelly figures of different sizes huddled inside one large shared translucent violet bubble +STYLE | 2–4 |
| 9 | `ai-stack` | NB Pro 16:9 | A tall messy stack of frosted translucent document cards, slightly misaligned, centred +STYLE | 2–4 |
| 10 | `ai-scan` | NB Pro 16:9, ref #9 | The same stack passing through a thin horizontal plane of violet light, a few lime cards sliding out to the side +STYLE | 2–4 |
| 11 | `ai-shortlist` | NB Pro 16:9, ref #9 | Only three glowing lime cards remain, neatly fanned, the rest dissolved into faint violet droplets +STYLE | 2–4 |
| 12 | `plan-free` | NB Pro 1:1 | One small lime jelly droplet, centred +STYLE | 2–4 |
| 13 | `plan-starter` | NB Pro 1:1, ref #12 | Three lime jelly droplets of rising size in a soft row +STYLE | 2–4 |
| 14 | `plan-growth` | NB Pro 1:1, ref #12 | A cluster of lime and violet droplets merging into one larger glowing jelly form +STYLE | 2–4 |
| 15 | `plan-scale` | NB Pro 1:1, ref #12 | A tall stacked tower of lime and violet jelly rounded blocks +STYLE | 2–4 |
| 16 | `plan-enterprise` | NB Pro 1:1, ref #12 | A faceted violet jelly crystal holding a glowing lime core +STYLE | 2–4 |
| 17 | `bg-aura-1` | NB Pro 21:9 | Out-of-focus macro of a jelly surface, lime light blooms on black, abstract and soft +STYLE | 2–4 |
| 18 | `bg-aura-2` | NB Pro 21:9 | Out-of-focus macro of a jelly surface, violet light blooms on black, abstract and soft +STYLE | 2–4 |
| 19 | `grain` | NB Pro 1:1 1k | Seamless fine monochrome film grain, mid-grey, uniform, tileable, no objects (bez +STYLE) | 2–4 |
| 20 | `og` | NB Pro 21:9, kadr 1200×630 | Violet jelly form on the left and lime jelly form on the right meeting in the centre with a glowing translucent drop where they touch, generous empty space +STYLE | 2–4 |

**Razem: ok. 134–172 kr. Z rezerwą na poprawki: ok. 220 kr**, czyli niecałe 25% salda. Tekst na obrazie OG nakładam w kodzie, żeby uniknąć literówek.

Po wygenerowaniu: AVIF + WebP w kilku szerokościach, MP4 H.264 + WebM, poster, `assets.md`. `ffmpeg` nie jest zainstalowany, więc użyję paczek npm `sharp` i `ffmpeg-static`.

## Do decyzji przy treści (przyjęte założenia)

- **250 czy 300 kandydatów:** hero mówi 300, a karta korzyści i plan Bezpłatny 250. Przyjmuję 250 wszędzie. Do potwierdzenia.
- **Staffinit w tekstach:** zamieniam na Jelly Match; linki CTA zostają na `staffinit.com`, jak w briefie.
- **Maskotka:** orzeł w materiale galaretki, bez marki Staffinit.
- **Oferty pracy, Regulamin, Prywatność:** brief nie podaje adresów, zostawiam oznaczone TODO.
- **Ceny roczne:** zmienna w configu z TODO; do czasu ich podania przełącznik pokazuje informację zamiast wymyślonej kwoty.

## Wynik

Zaakceptowano i wygenerowano 2026-10-30. Zużyto 141 kredytów (969,76 → 828,76), z dwiema poprawkami hero i maskotki. Szczegóły w assets.md.

Hero przebudowane 2026-10-30 na żywe galaretki WebGL z obrazem fallback hero-jellies (+2 kredyty, razem 143). Lejek i wideo hero nie są już używane.
