// Builds dist/jelly-match.html — the whole home page (EN + PL switch) in one self-contained file:
// the real React components bundled with esbuild (Next.js modules swapped for small stand-ins), the compiled
// Tailwind CSS with fonts inlined, the images as embedded WebP, and the CPU-jelly worker as a blob.
// Needs a fresh `npm run build` (for the CSS). Run: node scripts/single-html/build.mjs
// Optional: JM_SITE=https://your-domain node … → the jobs/legal links point to the live site.
import { build } from "esbuild";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const here = import.meta.dirname;
const r = (...p) => path.join(root, ...p);

// --- CSS + fonts from the Next build -------------------------------------------------------------
const html = await readFile(r(".next/server/app/en.html"), "utf8");
const htmlClass = /<html[^>]*class="([^"]+)"/.exec(html)[1];
let css = "";
const dataUri = async (file, type) => `data:${type};base64,${(await readFile(file)).toString("base64")}`;
for (const [, href] of html.matchAll(/href="(\/_next\/static\/[^"]+\.css)"/g)) {
  const file = r(".next", href.replace("/_next/", ""));
  let chunk = await readFile(file, "utf8");
  // fonts are referenced relative to the CSS file (../media/x.woff2) or absolutely (/_next/static/media/x.woff2)
  for (const m of new Set(chunk.match(/url\((["']?)[^)"']+\.woff2\1\)/g) ?? [])) {
    const u = /url\((["']?)([^)"']+)\1\)/.exec(m)[2];
    const font = u.startsWith("/_next/") ? r(".next", u.replace("/_next/", "")) : path.resolve(path.dirname(file), u);
    chunk = chunk.replaceAll(m, `url(${await dataUri(font, "font/woff2")})`);
  }
  css += chunk;
}
css = css.replaceAll("url(/assets/grain.webp)", `url(${await dataUri(r("public/assets/grain.webp"), "image/webp")})`);
css = css.replaceAll('url("/assets/grain.webp")', `url(${await dataUri(r("public/assets/grain.webp"), "image/webp")})`);

// --- images: one WebP per picture (the width that suits its largest on-screen size) ----------------
const manifest = JSON.parse(await readFile(r("lib/assets.json"), "utf8"));
const pick = { ai: 1100, benefit: 800, plan: 480, mascot: 800, bg: 1280 };
const images = {};
for (const [name, { widths }] of Object.entries(manifest)) {
  const want = pick[name.split("-")[0]] ?? 800;
  const w = widths.filter((x) => x <= want).pop() ?? widths[0];
  images[name] = { type: "image/webp", b64: (await readFile(r(`public/assets/${name}-${w}.webp`))).toString("base64") };
}
images["mascot-celebrate-sparks"] = { type: "image/webp", b64: (await readFile(r("public/assets/mascot-celebrate-sparks.webp"))).toString("base64") };

// --- worker (CPU jellies) as a classic script string ----------------------------------------------
const worker = await build({ entryPoints: [r("components/hero/jellyCpu.worker.ts")], bundle: true, format: "iife", minify: true, write: false, target: "es2020" });
const workerCode = worker.outputFiles[0].text;

// --- the page --------------------------------------------------------------------------------------
const alias = {
  "next-intl": path.join(here, "next-intl.tsx"),
  "next/navigation": path.join(here, "navigation.tsx"),
  "@/i18n/navigation": path.join(here, "navigation.tsx"),
  "@/components/ui/Picture": path.join(here, "picture.tsx"),
};
const shims = {
  name: "jm-single",
  setup(b) {
    b.onResolve({ filter: /^(next-intl|next\/navigation|@\/i18n\/navigation|@\/components\/ui\/Picture)$/ }, (a) => ({ path: alias[a.path] }));
    b.onResolve({ filter: /^@\// }, async (a) => b.resolve("./" + a.path.slice(2), { resolveDir: root, kind: a.kind }));
    b.onResolve({ filter: /^virtual:assets$/ }, () => ({ path: "assets", namespace: "jm" }));
    b.onLoad({ filter: /.*/, namespace: "jm" }, () => ({ contents: JSON.stringify(images), loader: "json" }));
    // the worker comes from a blob instead of a bundler URL
    b.onLoad({ filter: /jellyRenderers\.ts$/ }, async (a) => {
      const src = await readFile(a.path, "utf8");
      const out = src.replace(/new Worker\(new URL\("\.\/jellyCpu\.worker\.ts", import\.meta\.url\), \{ type: "module" \}\)/, "new Worker(__JM_WORKER_URL__)");
      if (out === src) throw new Error("worker URL pattern not found in jellyRenderers.ts");
      return { contents: out, loader: "ts" };
    });
  },
};
const app = await build({
  entryPoints: [path.join(here, "entry.tsx")],
  bundle: true,
  format: "iife",
  minify: true,
  write: false,
  target: "es2020",
  jsx: "automatic",
  plugins: [shims],
  define: {
    "process.env.NODE_ENV": '"production"',
    __JM_SITE__: JSON.stringify(process.env.JM_SITE ?? ""),
    __JM_WORKER_URL__: "window.__jmWorkerUrl",
  },
  logLevel: "warning",
  logOverride: { "unsupported-dynamic-import": "silent" },
});
const js = app.outputFiles[0].text;

const en = (await import(r("lib/content/en.ts").replace(/^/, "file://")).catch(() => null))?.en;
const title = en?.meta?.title ?? "Jelly Match";
const page = `<!doctype html>
<html lang="en" class="${htmlClass}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0b0b0f">
<meta name="color-scheme" content="dark">
<title>${title}</title>
<style>${css}</style>
</head>
<body>
<div id="app"></div>
<script>window.__jmWorkerUrl=URL.createObjectURL(new Blob([${JSON.stringify(workerCode).replaceAll("</", "<\\/")}],{type:"text/javascript"}));</script>
<script>${js.replaceAll("</script", "<\\/script")}</script>
</body>
</html>
`;
await mkdir(r("dist"), { recursive: true });
await writeFile(r("dist/jelly-match.html"), page);
console.log(`dist/jelly-match.html ${(page.length / 1024 / 1024).toFixed(2)} MB`);
