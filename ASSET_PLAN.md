# Jelly Match — asset plan (awaiting approval)

Workspace balance: **1209.76 credits**, plan **Plus**. Every prompt ends with the STYLE block from `DESIGN.md §6`
(abbreviated below as `+STYLE`).

Models chosen:
- **Nano Banana Pro** (`nano_banana_pro`, 2k/4k, image references for consistency) — stills, mascot, cards, OG.
  On the Plus plan it is marked *unlim*.
- **Seedance 2.0** (`seedance_2_0`, std, 1080p, `generate_audio=false`, start+end image = same frame → seamless loop)
  — hero loop video. Also *unlim* on Plus.
- **Cinema Studio Video 3.0** as fallback for the hero loop if Seedance's loop isn't clean.

Cost: the connector does not return prices. Estimates from Higgsfield's public pricing: Nano Banana Pro ≈ 2–4 cr/image,
Seedance 2.0 1080p 8 s ≈ 40–60 cr. If *unlim* applies, most of it is 0 cr.

| # | File (→ /public/assets) | Model / params | Prompt (before `+STYLE`) | Est. |
|---|---|---|---|---|
| 1 | `hero-loop.mp4/.webm` + `hero-poster.avif` | Nano Banana Pro 16:9 4k (keyframe) → Seedance 2.0 16:9 1080p 8 s, start=end=keyframe | Abstract recruitment funnel: dozens of small glossy lime and violet jelly droplets streaming from the left, flowing into a wide translucent jelly funnel at the right third, emerging as a short neat row of three luminous drops; slow hypnotic drift, camera almost static, slow push-in. Left half calm dark space for headline. | 4 + 60 |
| 2 | `mascot-hero.webp` | NB Pro 1:1 4k, transparent-look on #0B0B0F | Stylised 3D mascot: a friendly modern eagle sculpted from translucent jelly, lime body fading to violet wingtips, rounded simplified forms, big confident stance, wings half open, front three-quarter view, centred | 4 |
| 3 | `mascot-point.webp` | NB Pro 1:1, ref = #2 | Same jelly eagle mascot pointing to the right with one wing like a presenter, friendly expression | 4 |
| 4 | `mascot-celebrate.webp` | NB Pro 1:1, ref = #2 | Same jelly eagle mascot celebrating, both wings up, small lime and violet jelly confetti droplets bursting around | 4 |
| 5 | `benefit-free-role.webp` | NB Pro 4:3 | A single glossy lime jelly cube with a soft keyhole-shaped light inside, resting on a dark reflective floor, alone on a pedestal — "one free open role" | 4 |
| 6 | `benefit-250.webp` | NB Pro 4:3 | A neat grid of many small jelly spheres (lime and violet) filling a translucent tray, abundant but orderly — "room for 250 candidates" | 4 |
| 7 | `benefit-team.webp` | NB Pro 4:3 | A cluster of soft jelly figures of different sizes huddled together inside one large shared translucent violet bubble — "whole team, one price" | 4 |
| 8 | `ai-stack.webp`, `ai-scan.webp`, `ai-shortlist.webp` | NB Pro 16:9 ×3, ref chain for consistency | (a) A tall messy stack of frosted translucent document cards; (b) the same stack being scanned by a thin horizontal violet light plane, some cards glowing lime; (c) only three lime-glowing cards remain, aligned in a clean row, the rest dissolved into violet mist | 12 |
| 9 | `plan-free.webp`, `plan-starter.webp`, `plan-growth.webp`, `plan-scale.webp`, `plan-enterprise.webp` | NB Pro 1:1 ×5, ref chain | Escalating jelly objects: (Free) one small lime droplet; (Starter) three droplets; (Growth) a stacked jelly tower with a violet core; (Scale) a large faceted jelly crystal; (Enterprise) a monumental dark-glass jelly monolith with lime and violet inner light | 20 |
| 10 | `bg-aura-1.webp`, `bg-aura-2.webp` | NB Pro 21:9 | Out-of-focus macro of jelly surface, lime and violet light blooms on black, abstract, soft | 8 |
| 11 | `grain.png` | NB Pro 1:1 1k | Seamless fine monochrome film grain texture, mid-grey, uniform, tileable | 2 |
| 12 | `og.jpg` 1200×630 | NB Pro 21:9 → crop | Two jelly forms (violet left, lime right) meeting in the centre with a glowing translucent blend drop where they touch, right half empty for the wordmark which is added in code | 4 |

**Total estimate: ~140 credits** (≈ 12 % of balance), incl. 1–2 rerolls for the hero loop and mascot.

Post-processing: `sharp` → AVIF + WebP (q 70–80, 640/1280/1920 widths), `ffmpeg` → MP4 H.264 (CRF 24, faststart,
no audio) + WebM VP9, poster frame from frame 0. Manifest → `assets.md` (file, model, prompt, purpose, alt).
Logo / wordmark comes from the brand concept board you supplied (vector, not a generated asset).
