// Generates brand assets through the Higgsfield CLI into raw-assets/. Existing files are skipped.
// Usage: node scripts/generate-assets.mjs <base|refs|video> [name...]
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const CLI = join(process.env.APPDATA, "npm/node_modules/@higgsfield/cli/bin/higgsfield.js");
const RAW = fileURLToPath(new URL("../raw-assets/", import.meta.url));
mkdirSync(RAW, { recursive: true });

const STYLE =
  "Premium 3D render, translucent glossy jelly material with subsurface scattering, soft caustics and inner glow, two-tone palette of electric lime #C6FF00 and violet #8B5CF6 blending into pale lime-lavender #D9E8A0 where they overlap, deep near-black background #0B0B0F, dark reflective floor with soft coloured reflections, soft studio rim light, shallow depth of field, clean minimal composition, no text, no logos, no watermark.";

const img = (stage, name, aspect_ratio, resolution, prompt, ref, style = true) => ({
  stage, name, model: "nano_banana_pro", ext: "png", ref, prompt: style ? `${prompt} ${STYLE}` : prompt,
  params: { aspect_ratio, resolution },
});

const ASSETS = [
  img("base", "hero-key", "16:9", "4k", "Wide abstract recruitment funnel: a thin sparse arc of small glossy lime and violet jelly droplets crossing only the top edge of the frame from the left, pouring into one large soft funnel shape in the right third, the funnel itself sculpted from thick wobbly lime-to-violet jelly, organic and rounded, not glass, no stem. Below its spout exactly three large glowing lime droplets rest in a neat row on the floor. The left half of the frame below the top edge stays completely empty and dark."),
  img("base", "mascot-hero", "1:1", "2k", "Stylised friendly modern eagle mascot, unmistakably an eagle not a parrot: broad powerful chest, flat head with a strong brow ridge, short sharply hooked beak, wide feathered wings half open, sculpted entirely from smooth translucent jelly without bubbles or surface damage, lime body fading to violet wingtips, rounded simple forms, confident stance, facing right, three-quarter view, full body centred with space around it."),
  img("base", "benefit-free-role", "4:3", "2k", "A single glossy lime jelly cube with a soft keyhole-shaped light inside, alone on a small pedestal."),
  img("base", "benefit-250", "4:3", "2k", "A neat grid of many small lime and violet jelly spheres filling a translucent tray, abundant but orderly."),
  img("base", "benefit-team", "4:3", "2k", "A cluster of soft jelly figures of different sizes huddled inside one large shared translucent violet bubble."),
  img("base", "ai-stack", "16:9", "2k", "A tall messy stack of frosted translucent document cards, slightly misaligned, centred."),
  img("base", "plan-free", "1:1", "2k", "One small lime jelly droplet, centred."),
  img("base", "bg-aura-1", "21:9", "2k", "Out-of-focus macro of a jelly surface, lime light blooms on black, abstract and soft."),
  img("base", "bg-aura-2", "21:9", "2k", "Out-of-focus macro of a jelly surface, violet light blooms on black, abstract and soft."),
  { stage: "refs", name: "grain", model: "gpt_image_2", ext: "png", prompt: "Abstract seamless design texture: fine uniform monochrome noise on a neutral mid-grey field, like static on an old screen, evenly distributed, no objects, no shapes, no shadows.", params: { aspect_ratio: "1:1", resolution: "1k", quality: "medium" } },
  img("base", "og", "21:9", "2k", "Violet jelly form on the left and lime jelly form on the right meeting in the centre with a glowing translucent drop where they touch, generous empty space."),

  { ...img("hero2", "hero-jellies", "1:1", "2k", "Recreate only the 3D object from the reference image, with no text: two thick rounded translucent jelly arches forming a soft letter M, the left arch glowing electric lime, the right arch glowing violet, overlapping in the centre as a pale translucent teardrop. Bright neon rim light on the edges, darker glassy core with tiny sparkles, glossy highlights. Object centred and filling most of the frame, with a dark reflective floor below."), refFile: "brand-ref.webp" },

  img("refs", "mascot-point", "1:1", "2k", "The same jelly eagle mascot from the reference, pointing to the right with one wing like a presenter, friendly expression.", "mascot-hero"),
  img("refs", "mascot-celebrate", "1:1", "2k", "The same jelly eagle mascot from the reference, celebrating, both wings raised, small lime and violet jelly droplets bursting around.", "mascot-hero"),
  img("refs", "ai-scan", "16:9", "2k", "The same stack of cards from the reference passing through a thin horizontal plane of violet light, a few lime cards sliding out to the side.", "ai-stack"),
  img("refs", "ai-shortlist", "16:9", "2k", "Same scene and cards as the reference, but only three glowing lime cards remain, neatly fanned, the rest dissolved into faint violet droplets.", "ai-stack"),
  img("refs", "plan-starter", "1:1", "2k", "Same material and framing as the reference: three lime jelly droplets of rising size in a soft row.", "plan-free"),
  img("refs", "plan-growth", "1:1", "2k", "Same material and framing as the reference: a cluster of lime and violet droplets merging into one larger glowing jelly form.", "plan-free"),
  img("refs", "plan-scale", "1:1", "2k", "Same material and framing as the reference: a tall stacked tower of lime and violet jelly rounded blocks.", "plan-free"),
  img("refs", "plan-enterprise", "1:1", "2k", "Same material and framing as the reference: a faceted violet jelly crystal holding a glowing lime core.", "plan-free"),

  {
    stage: "video", name: "hero-loop", model: "seedance_2_0", ext: "mp4", start: "hero-key", end: "hero-key",
    prompt: `Seamless loop with a completely locked camera: the small droplets travel slowly and continuously along their arc from left to right and drop into the jelly funnel, the funnel gently wobbles like soft gelatine and pulses with inner light, the three lime droplets on the floor softly breathe and glint. Composition stays identical, the left side of the frame stays empty and dark. ${STYLE}`,
    params: { aspect_ratio: "16:9", resolution: "1080p", duration: 8, generate_audio: false, mode: "std" },
  },
];

function run(args) {
  return new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [CLI, ...args]);
    let out = "", err = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) => (code === 0 ? resolve(out) : reject(new Error(err || out))));
  });
}

async function make(a) {
  const file = join(RAW, `${a.name}.${a.ext}`);
  if (existsSync(file)) return console.log(`skip ${a.name}`);
  const args = ["generate", "create", a.model, "--prompt", a.prompt];
  for (const [k, v] of Object.entries(a.params)) args.push(`--${k}`, String(v));
  if (a.ref) args.push("--image-references", join(RAW, `${a.ref}.png`));
  if (a.refFile) args.push("--image-references", join(RAW, a.refFile));
  if (a.start) args.push("--start-image", join(RAW, `${a.start}.png`));
  if (a.end) args.push("--end-image", join(RAW, `${a.end}.png`));
  args.push("--wait", "--wait-timeout", "20m", "--json");
  const out = await run(args);
  // The job JSON also lists input media, so only a hf_* result of the expected type counts.
  const url = out.match(new RegExp(`https:[^"\\s]+/hf_[^"\\s]+\\.${a.ext}`))?.[0];
  if (!url) throw new Error(`no result url: ${out.slice(0, 400)}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  writeFileSync(join(RAW, `${a.name}.json`), JSON.stringify({ name: a.name, model: a.model, params: a.params, ref: a.ref, prompt: a.prompt, url }, null, 2));
  console.log(`done ${a.name}`);
}

const [stage, ...names] = process.argv.slice(2);
const todo = ASSETS.filter((a) => a.stage === stage && (!names.length || names.includes(a.name)));
const results = await Promise.allSettled(todo.map(make));
const failed = results.flatMap((r, i) => (r.status === "rejected" ? [`${todo[i].name}: ${r.reason.message.slice(0, 300)}`] : []));
if (failed.length) {
  console.error(failed.join("\n"));
  process.exit(1);
}
