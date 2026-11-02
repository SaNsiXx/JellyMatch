// Splits the celebrating mascot render into the bird and its confetti, so <FinalCta> can animate the confetti.
//   node scripts/split-mascot.mjs
// In:  public/assets/mascot-celebrate-1200.webp
// Out: public/assets/mascot-celebrate-bird-{480,800,1200}.{avif,webp}  the bird with the confetti painted out
//      public/assets/mascot-celebrate-sparks.webp                       the confetti alone (add/screen over the bird)
//      lib/mascot-sparks.json                                            one box + centre per confetti piece (1200 px)
//      lib/assets.json                                                   "mascot-celebrate-bird" entry for <Picture>
// Confetti = small saturated blobs that don't touch the bird; pieces touching it stay part of the bird.
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";

const SRC = "public/assets/mascot-celebrate-1200.webp";
const MAX_AREA = 3500; // px — anything bigger is the bird, its wings or the floor reflection
const KEEP_OFF = 8; // px — a blob this close to the bird belongs to it
const GLOW = 7; // px — halo painted out around each piece
const WIDTHS = [480, 800, 1200];

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const N = W * H;

// saturated, bright pixels: the jelly (the page-coloured background is dark and grey)
const fg = new Uint8Array(N);
for (let p = 0; p < N; p++) {
  const i = p * 3;
  const mx = Math.max(data[i], data[i + 1], data[i + 2]);
  const mn = Math.min(data[i], data[i + 1], data[i + 2]);
  fg[p] = mx > 70 && mx - mn > 35 ? 1 : 0;
}

// connected components (4-neighbour flood fill)
const label = new Int32Array(N).fill(-1);
const comps = [];
const stack = new Int32Array(N);
for (let p0 = 0; p0 < N; p0++) {
  if (!fg[p0] || label[p0] >= 0) continue;
  const id = comps.length;
  const c = { id, area: 0, x0: W, y0: H, x1: 0, y1: 0, sx: 0, sy: 0, px: [] };
  let sp = 0;
  stack[sp++] = p0;
  label[p0] = id;
  while (sp) {
    const p = stack[--sp];
    const x = p % W;
    const y = (p / W) | 0;
    c.area++;
    c.sx += x;
    c.sy += y;
    c.px.push(p);
    if (x < c.x0) c.x0 = x;
    if (x > c.x1) c.x1 = x;
    if (y < c.y0) c.y0 = y;
    if (y > c.y1) c.y1 = y;
    for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, y > 0 ? p - W : -1, y < H - 1 ? p + W : -1]) {
      if (q >= 0 && fg[q] && label[q] < 0) {
        label[q] = id;
        stack[sp++] = q;
      }
    }
  }
  comps.push(c);
}

// square dilation of a mask by r (two separable passes)
function dilate(mask, r) {
  const tmp = new Uint8Array(N);
  const out = new Uint8Array(N);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      let v = 0;
      for (let k = Math.max(0, x - r); k <= Math.min(W - 1, x + r) && !v; k++) v = mask[y * W + k];
      tmp[y * W + x] = v;
    }
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      let v = 0;
      for (let k = Math.max(0, y - r); k <= Math.min(H - 1, y + r) && !v; k++) v = tmp[k * W + x];
      out[y * W + x] = v;
    }
  return out;
}

const big = new Uint8Array(N);
for (const c of comps) if (c.area > MAX_AREA) for (const p of c.px) big[p] = 1;
const nearBird = dilate(big, KEEP_OFF);
const sparks = comps.filter((c) => c.area <= MAX_AREA && c.area >= 6 && !c.px.some((p) => nearBird[p]));

const sparkMask = new Uint8Array(N);
for (const c of sparks) for (const p of c.px) sparkMask[p] = 1;
const hole = dilate(sparkMask, GLOW);

// paint the holes with the blurred surroundings (normalised convolution), then feather the seam
const keep = Buffer.alloc(N);
const masked = Buffer.alloc(N * 3);
for (let p = 0; p < N; p++) {
  keep[p] = hole[p] ? 0 : 255;
  if (!hole[p]) for (let k = 0; k < 3; k++) masked[p * 3 + k] = data[p * 3 + k];
}
const raw = (buf, channels) => sharp(buf, { raw: { width: W, height: H, channels } });
const blurImg = await raw(masked, 3).blur(14).raw().toBuffer();
const blurKeep = await raw(keep, 1).blur(14).extractChannel(0).raw().toBuffer();
const soft = await raw(Buffer.from(hole.map((v) => v * 255)), 1).blur(2).extractChannel(0).raw().toBuffer();
const bird = Buffer.alloc(N * 3);
const spark = Buffer.alloc(N * 3);
for (let p = 0; p < N; p++) {
  const a = soft[p] / 255;
  const w = Math.max(1, blurKeep[p]) / 255;
  for (let k = 0; k < 3; k++) {
    const o = data[p * 3 + k];
    const fill = Math.min(255, blurImg[p * 3 + k] / w);
    const b = o * (1 - a) + fill * a;
    bird[p * 3 + k] = b;
    spark[p * 3 + k] = Math.max(0, o - b); // what the confetti adds on top of the bird layer
  }
}

for (const w of WIDTHS) {
  const img = raw(bird, 3).resize(w, w);
  await img.clone().webp({ quality: 82 }).toFile(`public/assets/mascot-celebrate-bird-${w}.webp`);
  await img.clone().avif({ quality: 55 }).toFile(`public/assets/mascot-celebrate-bird-${w}.avif`);
}
await raw(spark, 3).webp({ quality: 90 }).toFile("public/assets/mascot-celebrate-sparks.webp");

const pad = GLOW + 2;
const boxes = sparks.map((c) => {
  const x = Math.max(0, c.x0 - pad);
  const y = Math.max(0, c.y0 - pad);
  return {
    x,
    y,
    w: Math.min(W, c.x1 + pad + 1) - x,
    h: Math.min(H, c.y1 + pad + 1) - y,
    cx: Math.round(c.sx / c.area),
    cy: Math.round(c.sy / c.area),
  };
});
await writeFile("lib/mascot-sparks.json", JSON.stringify({ size: W, sparks: boxes }) + "\n");

const manifest = JSON.parse(await readFile("lib/assets.json", "utf8"));
manifest["mascot-celebrate-bird"] = { w: W, h: H, widths: WIDTHS };
await writeFile("lib/assets.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`${sparks.length} confetti pieces split off (${comps.length} blobs found)`);
