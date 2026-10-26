// Records the hero jellies (same engine as the live hero) into seamless loops for devices without a GPU:
// public/assets/hero-jellies-{wide,tall}.{webm,mp4,webp}. Every idle frequency is snapped to whole cycles per
// PERIOD (see JellyField `capture`), so frame PERIOD·FPS equals frame 0.
// Needs a production server on :3200 (npm run build && npx next start -p 3200). Run: node scripts/record-jellies.mjs
import { createRequire } from "node:module";
// Playwright isn't a project dependency — resolve a globally installed one (NODE_PATH)
const { chromium } = createRequire(import.meta.url)("playwright");
import { mkdir, rm, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import sharp from "sharp";
import { tmpdir } from "node:os";

const PERIOD = 20;
const FPS = 30;
const OUT = "public/assets";
const variants = [
  { name: "wide", viewport: { width: 1280, height: 720 }, scale: 1 },
  { name: "tall", viewport: { width: 390, height: 844 }, scale: 1.6 },
];
const only = process.argv[2];
const encodeOnly = process.argv.includes("--encode-only"); // reuse frames already in the temp dir

const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const v of variants.filter((x) => !only || only.startsWith("--") || x.name === only)) {
  const dir = path.join(tmpdir(), `jellies-${v.name}`);
  if (!encodeOnly) await record(v, dir);
  await encode(v, dir);
}
await browser.close();

async function record(v, dir) {
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  const page = await browser.newPage({ viewport: v.viewport });
  await page.addInitScript(({ period, scale }) => {
    window.__jmForceWebGL = true;
    window.__jmCapture = { period, scale };
  }, { period: PERIOD, scale: v.scale });
  await page.goto("http://localhost:3200/", { waitUntil: "load" });
  await page.waitForFunction(() => window.__jmField, null, { timeout: 60_000 });

  // let the springs settle onto their periodic orbit (no rendering needed)
  await page.evaluate(() => {
    for (let i = 0; i < 60 * 30; i++) window.__jmField.advance(1 / 60, false);
  });
  const frames = PERIOD * FPS;
  for (let f = 0; f < frames; f++) {
    const data = await page.evaluate((dt) => {
      window.__jmField.advance(dt);
      return document.querySelector("#top canvas").toDataURL("image/png");
    }, 1 / FPS);
    await writeFile(path.join(dir, `f${String(f).padStart(4, "0")}.png`), Buffer.from(data.split(",")[1], "base64"));
    if (f % 50 === 0) console.log(v.name, f, "/", frames);
  }
  await page.close();
}

async function encode(v, dir) {
  // the canvas is transparent where there's no jelly → flatten on black (the page blends the video with `screen`)
  const input = ["-framerate", String(FPS), "-i", path.join(dir, "f%04d.png")];
  const { width, height } = await sharp(path.join(dir, "f0000.png")).metadata();
  const [w, h] = [width - (width % 2), height - (height % 2)]; // even sizes for yuv420p
  const flat = ["-filter_complex", `color=black:s=${w}x${h}:r=${FPS}[bg];[0:v]crop=${w}:${h}:0:0[fg];[bg][fg]overlay=shortest=1,setsar=1,format=yuv420p`];
  const run = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });
  run([...input, ...flat, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-row-mt", "1", "-an", `${OUT}/hero-jellies-${v.name}.webm`]);
  run([...input, ...flat, "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-movflags", "+faststart", "-an", `${OUT}/hero-jellies-${v.name}.mp4`]);
  run([...input, ...flat, "-frames:v", "1", "-c:v", "libwebp", "-quality", "78", `${OUT}/hero-jellies-${v.name}.webp`]);
  console.log(v.name, "done");
}
