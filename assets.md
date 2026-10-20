# Asset manifest

All imagery and video was generated with **Higgsfield AI** (workspace „Private”, plan Plus) via the Higgsfield CLI,
then optimised by `npm run assets` (`scripts/optimize-assets.mjs`): AVIF + WebP at several widths, video as MP4 H.264
(CRF 26, faststart, no audio) + WebM VP9, poster from frame 0. Originals live in `raw-assets/` (PNG/MP4 git-ignored;
the `*.json` job records — model, params, result URL — are committed).

**STYLE block** appended to every prompt:

> Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender where they overlap, deep near-black background #0B0B0F, dramatic rim light and soft studio key light, subtle reflective floor, fine film grain, shallow depth of field, minimal composition, generous negative space, tack sharp subject, clean frame without any text or lettering.

Credits used: 134 in the first pass (1209.76 → 1075.76) + 106 for hero v2 (→ 969.76): Seedance 2.0 1080p 8 s = 96, Nano Banana Pro 2–4 per image, incl. three rejected grain attempts.


### `hero-key`

- **Model:** Nano Banana Pro (aspect_ratio=16:9, resolution=4k)
- **Purpose:** Klatka kluczowa wideo hero (start/end frame); poster
- **Alt:** —
- **Files:** (niepublikowany — tylko klatka do wideo)

> Wide cinematic abstract scene of a recruitment funnel: dozens of small glossy lime and violet jelly droplets streaming from the left side, flowing into a wide translucent jelly funnel in the right third of the frame, emerging below it as a short neat row of three luminous drops. Left half of the frame is calm, dark, empty space. **+ STYLE**

### `hero-loop` (superseded by `hero2-loop`, files removed)

- **Model:** Seedance 2.0 (aspect_ratio=16:9, resolution=1080p, duration=8)
- **Purpose:** Zapętlone wideo tła hero (8 s, 1080p) → hero-loop.mp4/.webm + hero-loop-poster-*
- **Alt:** dekoracyjne (alt="")
- **Files:** hero-loop-poster-1920.avif, hero-loop-poster-1920.webp, hero-loop-poster-960.avif, hero-loop-poster-960.webp, hero-loop.mp4, hero-loop.webm

> Seamless looping motion: the jelly droplets drift slowly and continuously from left to right along their arc and pour into the translucent funnel, droplets gently wobble and glint, the funnel softly pulses with inner light, a few drops fall from the spout. Very slow subtle camera push-in. Calm, hypnotic, premium. The final frame matches the first frame exactly. **+ STYLE**

### `mascot-hero`

- **Model:** Nano Banana Pro (aspect_ratio=1:1, resolution=2k)
- **Purpose:** Maskotka — poza „hero” (strona 404)
- **Alt:** Maskotka Jelly Match — orzeł z galaretki
- **Files:** mascot-hero-1200.avif, mascot-hero-1200.webp, mascot-hero-480.avif, mascot-hero-480.webp, mascot-hero-800.avif, mascot-hero-800.webp

> Stylised 3D mascot character: a friendly modern eagle sculpted entirely from translucent jelly, lime green body fading to violet wingtips, rounded simplified cute forms, big confident stance, wings half open, front three-quarter view, full body centred in frame, plain dark background. **+ STYLE**

### `mascot-point`

- **Model:** Nano Banana Pro (aspect_ratio=1:1, resolution=2k)
- **Purpose:** Maskotka — wskazuje (sekcja „Trzy zasady”)
- **Alt:** Maskotka Jelly Match wskazuje skrzydłem na listę zasad
- **Files:** mascot-point-1200.avif, mascot-point-1200.webp, mascot-point-480.avif, mascot-point-480.webp, mascot-point-800.avif, mascot-point-800.webp

> The same jelly eagle mascot from the reference image, now pointing to the right with one wing extended like a friendly presenter, cheerful expression, full body, three-quarter view. **+ STYLE**

### `mascot-celebrate`

- **Model:** Nano Banana Pro (aspect_ratio=1:1, resolution=2k)
- **Purpose:** Maskotka — świętuje (Final CTA)
- **Alt:** Maskotka Jelly Match — orzeł z limonkowo-fioletowej galaretki — świętuje z uniesionymi skrzydłami
- **Files:** mascot-celebrate-1200.avif, mascot-celebrate-1200.webp, mascot-celebrate-480.avif, mascot-celebrate-480.webp, mascot-celebrate-800.avif, mascot-celebrate-800.webp

> The same jelly eagle mascot from the reference image, now celebrating with both wings raised high, joyful jump, small lime and violet jelly confetti droplets bursting around it, full body. **+ STYLE**

### `benefit-free-role`

- **Model:** Nano Banana Pro (aspect_ratio=4:3, resolution=2k)
- **Purpose:** Karta korzyści 1 — darmowe stanowisko
- **Alt:** Limonkowa kostka z galaretki z podświetloną dziurką od klucza na ciemnym postumencie
- **Files:** benefit-free-role-1200.avif, benefit-free-role-1200.webp, benefit-free-role-480.avif, benefit-free-role-480.webp, benefit-free-role-800.avif, benefit-free-role-800.webp

> A single glossy lime jelly cube with a soft glowing keyhole-shaped light inside, resting alone on a small dark pedestal on a reflective floor, product shot. **+ STYLE**

### `benefit-250`

- **Model:** Nano Banana Pro (aspect_ratio=4:3, resolution=2k)
- **Purpose:** Karta korzyści 2 — 250 kandydatów
- **Alt:** Szklana taca wypełniona równymi rzędami limonkowych i fioletowych kulek z galaretki
- **Files:** benefit-250-1200.avif, benefit-250-1200.webp, benefit-250-480.avif, benefit-250-480.webp, benefit-250-800.avif, benefit-250-800.webp

> A neat orderly grid of many small glossy jelly spheres, alternating lime and violet, filling a wide shallow translucent glass tray, abundant but tidy, seen from a three-quarter top angle. **+ STYLE**

### `benefit-team`

- **Model:** Nano Banana Pro (aspect_ratio=4:3, resolution=2k)
- **Purpose:** Karta korzyści 3 — bez opłat za użytkownika
- **Alt:** Grupa galaretkowych postaci pod jedną wspólną fioletową kopułą
- **Files:** benefit-team-1200.avif, benefit-team-1200.webp, benefit-team-480.avif, benefit-team-480.webp, benefit-team-800.avif, benefit-team-800.webp

> A cluster of six soft rounded jelly figures of different sizes and heights, lime and violet, huddled together inside one large shared translucent violet bubble dome, cosy and united. **+ STYLE**

### `ai-stack`

- **Model:** Nano Banana Pro (aspect_ratio=16:9, resolution=2k)
- **Purpose:** Selekcja AI — krok 1 (stos CV)
- **Alt:** Wysoki, nieuporządkowany stos szklanych kart dokumentów
- **Files:** ai-stack-1100.avif, ai-stack-1100.webp, ai-stack-1600.avif, ai-stack-1600.webp, ai-stack-640.avif, ai-stack-640.webp

> A tall messy leaning stack of frosted translucent glass document cards, like a pile of resumes, slightly chaotic, some cards sliding off, lit from the side. **+ STYLE**

### `ai-scan`

- **Model:** Nano Banana Pro (aspect_ratio=16:9, resolution=2k)
- **Purpose:** Selekcja AI — krok 2 (ocena)
- **Alt:** Stos kart prześwietlany fioletową płaszczyzną światła, część kart świeci na limonkowo
- **Files:** ai-scan-1100.avif, ai-scan-1100.webp, ai-scan-1600.avif, ai-scan-1600.webp, ai-scan-640.avif, ai-scan-640.webp

> The same stack of frosted glass document cards from the reference image, now being scanned by a thin glowing horizontal violet light plane passing through it; a few of the cards light up lime from inside. **+ STYLE**

### `ai-shortlist`

- **Model:** Nano Banana Pro (aspect_ratio=16:9, resolution=2k)
- **Purpose:** Selekcja AI — krok 3 (krótka lista)
- **Alt:** Trzy świecące limonkowe karty ustawione w równym rzędzie, reszta rozpływa się we fioletowej mgle
- **Files:** ai-shortlist-1100.avif, ai-shortlist-1100.webp, ai-shortlist-1600.avif, ai-shortlist-1600.webp, ai-shortlist-640.avif, ai-shortlist-640.webp

> The same frosted glass document cards from the reference image, but now only three lime-glowing cards remain, standing upright in a clean neat row, the rest of the stack dissolved into soft violet mist behind them. **+ STYLE**

### `plan-free`

- **Model:** Nano Banana Pro (aspect_ratio=1:1, resolution=2k)
- **Purpose:** Ikona planu Bezpłatny
- **Alt:** Pojedyncza limonkowa kropla galaretki
- **Files:** plan-free-240.avif, plan-free-240.webp, plan-free-480.avif, plan-free-480.webp, plan-free-720.avif, plan-free-720.webp

> Icon-like hero object: one small glossy lime jelly droplet sitting on a dark reflective floor, centred, lots of space around it. **+ STYLE**

### `plan-starter`

- **Model:** Nano Banana Pro (aspect_ratio=1:1, resolution=2k)
- **Purpose:** Ikona planu Starter
- **Alt:** Trzy krople galaretki, dwie limonkowe i jedna fioletowa
- **Files:** plan-starter-240.avif, plan-starter-240.webp, plan-starter-480.avif, plan-starter-480.webp, plan-starter-720.avif, plan-starter-720.webp

> Icon-like hero object: three glossy jelly droplets of slightly different sizes, two lime and one violet, grouped together on a dark reflective floor, centred. **+ STYLE**

### `plan-growth`

- **Model:** Nano Banana Pro (aspect_ratio=1:1, resolution=2k)
- **Purpose:** Ikona planu Growth
- **Alt:** Wieża z galaretkowych bloków z fioletowym rdzeniem
- **Files:** plan-growth-240.avif, plan-growth-240.webp, plan-growth-480.avif, plan-growth-480.webp, plan-growth-720.avif, plan-growth-720.webp

> Icon-like hero object: a playful stacked tower of four rounded jelly blocks, lime outside with a glowing violet core inside, on a dark reflective floor, centred. **+ STYLE**

### `plan-scale`

- **Model:** Nano Banana Pro (aspect_ratio=1:1, resolution=2k)
- **Purpose:** Ikona planu Scale
- **Alt:** Duży, fasetowany kryształ z galaretki
- **Files:** plan-scale-240.avif, plan-scale-240.webp, plan-scale-480.avif, plan-scale-480.webp, plan-scale-720.avif, plan-scale-720.webp

> Icon-like hero object: a large faceted gem-like jelly crystal, lime facets with violet refractions, on a dark reflective floor, centred. **+ STYLE**

### `plan-enterprise`

- **Model:** Nano Banana Pro (aspect_ratio=1:1, resolution=2k)
- **Purpose:** Ikona planu Enterprise
- **Alt:** Monumentalny monolit z przydymionej galaretki z limonkowym i fioletowym światłem
- **Files:** plan-enterprise-240.avif, plan-enterprise-240.webp, plan-enterprise-480.avif, plan-enterprise-480.webp, plan-enterprise-720.avif, plan-enterprise-720.webp

> Icon-like hero object: a monumental tall dark smoked-glass jelly monolith with lime and violet light glowing inside it, on a dark reflective floor, centred, majestic. **+ STYLE**

### `og-base`

- **Model:** Nano Banana Pro (aspect_ratio=21:9, resolution=2k)
- **Purpose:** Tło obrazu Open Graph → public/og.jpg (napisy dodane w scripts/build-og.mjs)
- **Alt:** —
- **Files:** ../og.jpg

> Two large flowing jelly forms meeting in the centre of the frame, violet jelly from the left and lime jelly from the right, with a glowing translucent pale blend droplet where they touch. Upper half of the frame is calm empty dark space. **+ STYLE**

### `bg-aura-1`

- **Model:** Nano Banana Pro (aspect_ratio=21:9, resolution=2k)
- **Purpose:** Tło sekcji Final CTA
- **Alt:** dekoracyjne (alt="")
- **Files:** bg-aura-1-1280.avif, bg-aura-1-1280.webp, bg-aura-1-2048.avif, bg-aura-1-2048.webp

> Extreme out-of-focus macro of a jelly surface, large soft lime and violet light blooms on black, abstract bokeh, very soft and dark. **+ STYLE**

### `bg-aura-2`

- **Model:** Nano Banana Pro (aspect_ratio=21:9, resolution=2k)
- **Purpose:** Źródło tekstury ziarna (patrz grain)
- **Alt:** —
- **Files:** (niepublikowany)

> Extreme out-of-focus macro of a violet jelly surface with a single faint lime light bloom in a corner, abstract, mostly dark, soft. **+ STYLE**

## Hero v2 (October 2026 revision — replaces `hero-loop`)

### `hero2-key`

- **Model:** Nano Banana Pro (aspect_ratio=16:9, resolution=4k)
- **Purpose:** start/end frame for the hero video (isometric „jelly selection machine”, inspired by the client's Dribbble reference)
- **Files:** (not published — keyframe only)

> Isometric 3D miniature diorama seen from a high three-quarter angle, like a premium product landing-page hero. In the right half of the frame: a cute rounded translucent jelly machine shaped like a soft cube building, lime jelly body with a violet glowing round window and a soft violet roof cushion. A sleek dark conveyor belt enters from the top edge and carries a neat line of frosted translucent glass document cards, like resumes, into the machine. From the machine's lower right side a short glossy chute releases a few small glowing lime jelly droplets rolling toward the bottom-right corner. Clean dark matte floor with subtle tile seams and soft long shadows. The left 40 percent of the frame is calm empty dark floor space. **+ STYLE**

### `hero2-loop`

- **Model:** Seedance 2.0 (16:9, 1080p, 8 s, no audio), start = end = `hero2-key`
- **Purpose:** hero background loop. The raw clip's first/last frames differed, so the loop was rebuilt in ffmpeg:
  1.2 s–8 s with the last 1.2 s cross-faded into the start (5.67 s, seamless). Raw clip kept locally as `hero2-loop.source.mp4.orig`.
- **Alt:** decorative (alt="")
- **Files:** hero2-loop.mp4, hero2-loop.webm, hero2-loop-poster-960/1920.avif/.webp

> Locked-off static camera, no camera movement. The conveyor belt moves steadily: frosted glass resume cards glide one after another toward the jelly machine and disappear into it. The translucent lime jelly machine gently wobbles and breathes like soft jelly, its violet round window pulses with light. Glowing lime jelly droplets drop out of the glass chute one by one and roll gently across the floor. Calm, satisfying, premium product animation. Seamless loop: the final frame is identical to the first frame. **+ STYLE**

### `float-card`, `float-drop`, `float-orbs`

- **Model:** Nano Banana Pro (1:1, 2k); cropped to the top 80 % (floor reflection removed), shown with `mix-blend-mode: lighten`
- **Purpose:** floating depth layers in the hero (scroll + pointer parallax)
- **Alt:** decorative (alt="")
- **Files:** float-*-400/800.avif/.webp

> A single frosted translucent glass document card, like a resume, floating and tilted in mid-air, lime glowing edges with a soft violet inner sheen, centred on a pure black background, isolated object. **+ STYLE**
>
> A single glossy glowing lime jelly droplet floating in mid-air, slightly squashed as if wobbling, centred on a pure black background, isolated object. **+ STYLE**
>
> Three glossy violet jelly spheres of different sizes floating together in mid-air, one tiny lime sphere among them, centred on a pure black background, isolated objects. **+ STYLE**

### `grain`

- **Model:** derived — Higgsfield rejected three plain-noise prompts as NSFW (false positive), so the film grain was
  extracted from the Higgsfield render `bg-aura-2` (high-pass filter on its flattest 256 px tile, mirrored to tile seamlessly).
- **Purpose:** animated grain overlay (`.grain`), **Files:** grain.webp

### Not generated

- Logo / favicon (`components/Logo.tsx`, `app/icon.svg`, `app/apple-icon.png`): vector mark redrawn from the supplied brand concept board.
- UI icons: Lucide.
