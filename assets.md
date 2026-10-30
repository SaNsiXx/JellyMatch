# Manifest assetów

Wszystkie grafiki i wideo powstały przez Higgsfield AI (CLI, workspace Private), 2026-10-30. Rekordy zadań: `raw-assets/*.json`.
Pliki wynikowe w `public/assets` nazywają się `<nazwa>-<szerokość>.avif/.webp`; wideo to `hero-loop.mp4` i `hero-loop.webm`.

Odrzucone wersje: `hero-key-v1` (szklany lejek) i `mascot-hero-v1` (wyglądała jak papuga). Tekstura `grain` dwa razy nie przeszła filtra Nano Banana Pro, więc powstała w GPT Image 2.

## `hero-key`

- **Model:** nano_banana_pro (aspect_ratio=16:9, resolution=4k)
- **Przeznaczenie:** Klatka start/koniec wideo i poster hero (LCP)
- **Alt:** dekoracyjny (alt pusty)

> Wide abstract recruitment funnel: a thin sparse arc of small glossy lime and violet jelly droplets crossing only the top edge of the frame from the left, pouring into one large soft funnel shape in the right third, the funnel itself sculpted from thick wobbly lime-to-violet jelly, organic and rounded, not glass, no stem. Below its spout exactly three large glowing lime droplets rest in a neat row on the floor. The left half of the frame below the top edge stays completely empty and dark. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## `hero-loop`

- **Model:** seedance_2_0 (aspect_ratio=16:9, resolution=1080p, duration=8, generate_audio=false, mode=std)
- **Przeznaczenie:** Zapętlone tło hero, 8 s
- **Alt:** dekoracyjny (aria-hidden)

> Seamless loop with a completely locked camera: the small droplets travel slowly and continuously along their arc from left to right and drop into the jelly funnel, the funnel gently wobbles like soft gelatine and pulses with inner light, the three lime droplets on the floor softly breathe and glint. Composition stays identical, the left side of the frame stays empty and dark. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## `mascot-hero`

- **Model:** nano_banana_pro (aspect_ratio=1:1, resolution=2k)
- **Przeznaczenie:** Referencja maskotki dla pozostałych póz; nieużywana na stronie
- **Alt:** n/d

> Stylised friendly modern eagle mascot, unmistakably an eagle not a parrot: broad powerful chest, flat head with a strong brow ridge, short sharply hooked beak, wide feathered wings half open, sculpted entirely from smooth translucent jelly without bubbles or surface damage, lime body fading to violet wingtips, rounded simple forms, confident stance, facing right, three-quarter view, full body centred with space around it. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## `mascot-point`

- **Model:** nano_banana_pro (aspect_ratio=1:1, resolution=2k), referencja: `mascot-hero`
- **Przeznaczenie:** Sekcja „Trzy zasady”
- **Alt:** Maskotka Jelly Match, orzeł z galaretki, wskazuje skrzydłem w prawo

> The same jelly eagle mascot from the reference, pointing to the right with one wing like a presenter, friendly expression. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## `mascot-celebrate`

- **Model:** nano_banana_pro (aspect_ratio=1:1, resolution=2k), referencja: `mascot-hero`
- **Przeznaczenie:** Final CTA
- **Alt:** Maskotka Jelly Match, orzeł z galaretki, świętuje z uniesionymi skrzydłami

> The same jelly eagle mascot from the reference, celebrating, both wings raised, small lime and violet jelly droplets bursting around. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## `benefit-free-role`

- **Model:** nano_banana_pro (aspect_ratio=4:3, resolution=2k)
- **Przeznaczenie:** Karta korzyści 1
- **Alt:** Pojedyncza limonkowa kostka z galaretki na małym postumencie

> A single glossy lime jelly cube with a soft keyhole-shaped light inside, alone on a small pedestal. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## `benefit-250`

- **Model:** nano_banana_pro (aspect_ratio=4:3, resolution=2k)
- **Przeznaczenie:** Karta korzyści 2
- **Alt:** Uporządkowana siatka limonkowych i fioletowych kulek z galaretki

> A neat grid of many small lime and violet jelly spheres filling a translucent tray, abundant but orderly. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## `benefit-team`

- **Model:** nano_banana_pro (aspect_ratio=4:3, resolution=2k)
- **Przeznaczenie:** Karta korzyści 3
- **Alt:** Grupa postaci z galaretki w jednej wspólnej, fioletowej bańce

> A cluster of soft jelly figures of different sizes huddled inside one large shared translucent violet bubble. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## `ai-stack`

- **Model:** nano_banana_pro (aspect_ratio=16:9, resolution=2k)
- **Przeznaczenie:** Selekcja AI, krok 1
- **Alt:** Wysoki, nierówny stos półprzezroczystych kart dokumentów

> A tall messy stack of frosted translucent document cards, slightly misaligned, centred. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## `ai-scan`

- **Model:** nano_banana_pro (aspect_ratio=16:9, resolution=2k), referencja: `ai-stack`
- **Przeznaczenie:** Selekcja AI, krok 2
- **Alt:** Stos kart przechodzący przez płaszczyznę fioletowego światła

> The same stack of cards from the reference passing through a thin horizontal plane of violet light, a few lime cards sliding out to the side. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## `ai-shortlist`

- **Model:** nano_banana_pro (aspect_ratio=16:9, resolution=2k), referencja: `ai-stack`
- **Przeznaczenie:** Selekcja AI, krok 3
- **Alt:** Trzy świecące limonkowe karty ułożone w wachlarz

> Same scene and cards as the reference, but only three glowing lime cards remain, neatly fanned, the rest dissolved into faint violet droplets. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## `plan-free`

- **Model:** nano_banana_pro (aspect_ratio=1:1, resolution=2k)
- **Przeznaczenie:** Plan Bezpłatny
- **Alt:** Pojedyncza kropla galaretki

> One small lime jelly droplet, centred. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## `plan-starter`

- **Model:** nano_banana_pro (aspect_ratio=1:1, resolution=2k), referencja: `plan-free`
- **Przeznaczenie:** Plan Starter
- **Alt:** Trzy krople galaretki rosnące od najmniejszej do największej

> Same material and framing as the reference: three lime jelly droplets of rising size in a soft row. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## `plan-growth`

- **Model:** nano_banana_pro (aspect_ratio=1:1, resolution=2k), referencja: `plan-free`
- **Przeznaczenie:** Plan Growth
- **Alt:** Krople galaretki zlewające się w jedną większą formę

> Same material and framing as the reference: a cluster of lime and violet droplets merging into one larger glowing jelly form. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## `plan-scale`

- **Model:** nano_banana_pro (aspect_ratio=1:1, resolution=2k), referencja: `plan-free`
- **Przeznaczenie:** Plan Scale
- **Alt:** Wysoka wieża z zaokrąglonych bloków galaretki

> Same material and framing as the reference: a tall stacked tower of lime and violet jelly rounded blocks. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## `plan-enterprise`

- **Model:** nano_banana_pro (aspect_ratio=1:1, resolution=2k), referencja: `plan-free`
- **Przeznaczenie:** Plan Enterprise
- **Alt:** Fioletowy kryształ z galaretki ze świecącym limonkowym rdzeniem

> Same material and framing as the reference: a faceted violet jelly crystal holding a glowing lime core. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## `bg-aura-1`

- **Model:** nano_banana_pro (aspect_ratio=21:9, resolution=2k)
- **Przeznaczenie:** Tło sekcji Cennik
- **Alt:** dekoracyjny

> Out-of-focus macro of a jelly surface, lime light blooms on black, abstract and soft. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## `bg-aura-2`

- **Model:** nano_banana_pro (aspect_ratio=21:9, resolution=2k)
- **Przeznaczenie:** Tło sekcji Korzyści
- **Alt:** dekoracyjny

> Out-of-focus macro of a jelly surface, violet light blooms on black, abstract and soft. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

## `grain`

- **Model:** gpt_image_2 (aspect_ratio=1:1, resolution=1k, quality=medium)
- **Przeznaczenie:** Tekstura ziarna na całej stronie, `grain.webp`
- **Alt:** dekoracyjny

> Abstract seamless design texture: fine uniform monochrome noise on a neutral mid-grey field, like static on an old screen, evenly distributed, no objects, no shapes, no shadows.

## `og`

- **Model:** nano_banana_pro (aspect_ratio=21:9, resolution=2k)
- **Przeznaczenie:** Obraz Open Graph `public/og.jpg`; napisy nałożone w kodzie
- **Alt:** Jelly Match — limonkowa i fioletowa galaretka łączące się w jedną kroplę

> Violet jelly form on the left and lime jelly form on the right meeting in the centre with a glowing translucent drop where they touch, generous empty space. Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.

