// raw-assets/ -> public/assets (AVIF + WebP sets, MP4 + WebM, posters) and lib/assets.json.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const RAW = join(root, "raw-assets");
const OUT = join(root, "public/assets");
mkdirSync(OUT, { recursive: true });

const SETS = {
  "hero-jellies": [640, 1200],
  "mascot-hero": [480, 800],
  "mascot-point": [480, 800],
  "mascot-celebrate": [480, 800, 1200],
  "benefit-free-role": [480, 800],
  "benefit-250": [480, 800],
  "benefit-team": [480, 800],
  "ai-stack": [640, 1100, 1600],
  "ai-scan": [640, 1100, 1600],
  "ai-shortlist": [640, 1100, 1600],
  "plan-free": [240, 480],
  "plan-starter": [240, 480],
  "plan-growth": [240, 480],
  "plan-scale": [240, 480],
  "plan-enterprise": [240, 480],
  "bg-aura-1": [1280, 2048],
  "bg-aura-2": [1280, 2048],
};

const manifest = {};
for (const [name, widths] of Object.entries(SETS)) {
  const src = join(RAW, `${name}.png`);
  const meta = await sharp(src).metadata();
  manifest[name] = { widths, ratio: meta.width / meta.height };
  for (const w of widths) {
    const base = sharp(src).resize({ width: w, withoutEnlargement: true });
    await base.clone().avif({ quality: 52, effort: 6 }).toFile(join(OUT, `${name}-${w}.avif`));
    await base.clone().webp({ quality: 74, effort: 6 }).toFile(join(OUT, `${name}-${w}.webp`));
  }
}
writeFileSync(join(root, "lib/assets.json"), JSON.stringify(manifest, null, 2) + "\n");

if (existsSync(join(RAW, "grain.png"))) {
  await sharp(join(RAW, "grain.png")).resize(256, 256, { fit: "cover" }).greyscale().webp({ quality: 60 }).toFile(join(OUT, "grain.webp"));
}

// OG: the render sits low on a 1200x630 canvas; wordmark and tagline are composited in code, never generated.
const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <text x="600" y="112" text-anchor="middle" font-family="Outfit, Segoe UI, Arial, sans-serif" font-weight="600" font-size="84" fill="#F5F5F7">Jelly Match</text>
  <text x="600" y="172" text-anchor="middle" font-family="Outfit, Segoe UI, Arial, sans-serif" font-size="32" fill="#A1A1AA">Oprogramowanie do rekrutacji, które zaczyna się za darmo.</text>
</svg>`;
const art = await sharp(join(RAW, "og.png")).resize({ width: 1200 }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#07070B" } })
  .composite([{ input: art, gravity: "south" }, { input: Buffer.from(svg) }])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(join(root, "public/og.jpg"));

console.log("assets ok");
