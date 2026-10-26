// raw-assets/*.png|mp4 (Higgsfield originals, not committed) → public/assets (AVIF + WebP at several widths, MP4 + WebM + poster)
// and lib/assets.json (dimensions + widths for <Picture>). Run: npm run assets
import { readdir, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { tmpdir } from "node:os";
import sharp from "sharp";

const RAW = "raw-assets";
const OUT = "public/assets";
await mkdir(OUT, { recursive: true });

// widths per asset family (never upscale)
const WIDTHS = {
  hero: [960, 1600, 2400],
  mascot: [480, 800, 1200],
  benefit: [480, 800, 1200],
  ai: [640, 1100, 1600],
  plan: [240, 480, 720],
  float: [400, 800],
  bg: [1280, 2048],
  default: [640, 1280],
};
const family = (n) => (n.startsWith("hero") ? "hero" : n.split("-")[0]);

const manifest = {};
for (const file of (await readdir(RAW)).sort()) {
  const name = file.replace(/\.[^.]+$/, "");
  const ext = path.extname(file).slice(1);
  const src = path.join(RAW, file);

  if (ext === "png" && name === "grain") {
    // tiled overlay: small, greyscale
    await sharp(src).resize(256, 256).greyscale().webp({ quality: 55 }).toFile(`${OUT}/grain.webp`);
    continue;
  }
  if (ext === "png" && name === "og-base") continue; // composed by scripts/build-og.mjs
  // superseded hero assets (now WebGL jellies) and source-only files
  if (["hero-key", "hero2-key", "bg-aura-2"].includes(name) || /^(hero-loop|hero2-loop|float-)/.test(name)) continue;
  if (ext === "png") {
    const img = sharp(src).removeAlpha();
    const { width, height } = await img.metadata();
    const uniq = (WIDTHS[family(name)] ?? WIDTHS.default).filter((w) => w <= width);
    for (const w of uniq) {
      // floating objects: drop the floor reflection under the object
      const base = name.startsWith("float") ? sharp(src).extract({ left: 0, top: 0, width, height: Math.round(height * 0.8) }) : sharp(src);
      const r = base.removeAlpha().resize(w);
      await r.clone().avif({ quality: 52, effort: 6 }).toFile(`${OUT}/${name}-${w}.avif`);
      await r.clone().webp({ quality: 74, effort: 6 }).toFile(`${OUT}/${name}-${w}.webp`);
    }
    manifest[name] = { w: width, h: name.startsWith("float") ? Math.round(height * 0.8) : height, widths: uniq };
    console.log(name, width, height, uniq.join(","));
  }
  if (ext === "mp4") {
    const run = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });
    if (!existsSync(`${OUT}/${name}.mp4`)) {
      run(["-i", src, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-vf", "scale=1920:-2", `${OUT}/${name}.mp4`]);
      run(["-i", src, "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "38", "-row-mt", "1", "-vf", "scale=1920:-2", `${OUT}/${name}.webm`]);
    }
    const poster = path.join(tmpdir(), `${name}-poster.png`);
    run(["-i", src, "-frames:v", "1", poster]);
    for (const w of [960, 1920]) {
      await sharp(poster).resize(w).avif({ quality: 50 }).toFile(`${OUT}/${name}-poster-${w}.avif`);
      await sharp(poster).resize(w).webp({ quality: 72 }).toFile(`${OUT}/${name}-poster-${w}.webp`);
    }
    manifest[`${name}-poster`] = { w: 1920, h: 1080, widths: [960, 1920] };
    console.log(name, "video ok");
  }
}
await writeFile("lib/assets.json", JSON.stringify(manifest, null, 2) + "\n");
