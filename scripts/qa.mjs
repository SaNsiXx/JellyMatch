// Checks the running site in local headless Chrome over CDP (no extra dependencies).
// Usage: node scripts/qa.mjs [url] [screenshot dir]
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const URL_ = process.argv[2] ?? "http://localhost:3101/";
const OUT = process.argv[3] ?? join(tmpdir(), "jm-qa");
const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9333;
mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), "jm-chrome-"));
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "--no-first-run", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });

async function connect() {
  for (let i = 0; i < 40; i++) {
    try {
      const tabs = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      const page = tabs.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("chrome did not start");
}

const ws = new WebSocket(await connect());
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
const errors = [];
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id) { pending.get(d.id)?.(d); pending.delete(d.id); }
  if (d.method === "Runtime.exceptionThrown") errors.push(d.params.exceptionDetails.exception?.description ?? d.params.exceptionDetails.text);
  if (d.method === "Log.entryAdded" && d.params.entry.level === "error") errors.push(`${d.params.entry.text} ${d.params.entry.url ?? ""}`);
};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description);
  return r.result.result.value;
};
const shot = async (name) => {
  const r = await send("Page.captureScreenshot", { format: "jpeg", quality: 72 });
  writeFileSync(join(OUT, `${name}.jpg`), Buffer.from(r.result.data, "base64"));
};
const viewport = (w, h, mobile) => send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile });
const open = async () => {
  await send("Page.navigate", { url: URL_ });
  await sleep(3200);
};
const scrollToSel = (sel, off = 0) => ev(`window.scrollTo(0, document.querySelector('${sel}').getBoundingClientRect().top + scrollY + ${off}); 1`);

await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });

const OVERFLOW = `[...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.right > innerWidth + 1 && !e.closest('.marquee, .hero-media, .aura'); }).slice(0, 5).map(e => e.tagName + '.' + String(e.className).slice(0, 40))`;
const results = {};

for (const [w, h, mobile] of [[375, 812, true], [768, 1024, true], [1280, 800, false], [1920, 1080, false]]) {
  await viewport(w, h, mobile);
  await open();
  await shot(`${w}-hero`);
  const r = { overflow: await ev(OVERFLOW), hscroll: await ev("document.documentElement.scrollWidth > innerWidth") };
  await scrollToSel("[aria-labelledby=korzysci]"); await sleep(1500); await shot(`${w}-benefits`);
  await scrollToSel("[data-ai]", 1100); await sleep(1500); await shot(`${w}-ai`);
  await scrollToSel("#cennik"); await sleep(1500); await shot(`${w}-pricing`);
  r.overflowAfterPin = await ev(OVERFLOW);
  await ev("window.scrollTo(0, document.documentElement.scrollHeight); 1"); await sleep(1500); await shot(`${w}-end`);
  results[w] = r;
}

// Hero jellies: cursor pull and scroll separation.
await viewport(1280, 800, false);
await open();
await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 1000, y: 300 });
await sleep(1500);
await shot("1280-hero-pointer");
results.live = await ev("({ jellies: document.querySelector('.hero-jellies').hasAttribute('data-live'), ambient: document.querySelector('.ambient').hasAttribute('data-live') })");
results.fps = await ev("new Promise(r => { let n = 0; const t = performance.now(); const f = () => { n++; performance.now() - t < 3000 ? requestAnimationFrame(f) : r(Math.round(n / 3)); }; requestAnimationFrame(f); })");
await ev("window.scrollTo(0, 420); 1");
await sleep(1500);
await shot("1280-hero-scroll");

// Interactions at phone width.
await viewport(375, 812, true);
await open();
results.menu = await ev(`(async () => {
  const t = document.querySelector('[aria-controls=menu-mobile]');
  t.click(); await new Promise(r => setTimeout(r, 600));
  const open = !!document.getElementById('menu-mobile');
  const focus = document.activeElement?.textContent;
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  await new Promise(r => setTimeout(r, 500));
  return { open, focus, closed: !document.getElementById('menu-mobile'), focusBack: document.activeElement === t };
})()`);
results.toggle = await ev(`(async () => {
  const b = [...document.querySelectorAll('.toggle button')];
  b[1].click(); await new Promise(r => setTimeout(r, 700));
  return { pressed: b[1].getAttribute('aria-pressed'), note: document.querySelector('#cennik [role=status]')?.textContent, pill: getComputedStyle(document.querySelector('.toggle-pill')).position };
})()`);

// Reduced motion.
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await viewport(1280, 800, false);
await send("Page.navigate", { url: URL_ });
await sleep(1500);
await shot("reduced-hero");
results.reduced = await ev(`({
  preloader: getComputedStyle(document.querySelector('.preloader')).display,
  pinned: document.querySelector('[data-ai]').dataset.pinned ?? null,
  video: !!document.querySelector('video'),
  lenis: document.documentElement.classList.contains('lenis'),
  charsVisible: getComputedStyle(document.querySelector('.char')).transform,
  hiddenReveals: [...document.querySelectorAll('[data-reveal]')].filter(e => getComputedStyle(e).opacity !== '1').length,
})`);
await send("Emulation.setEmulatedMedia", { features: [] });

// Field-style metrics with Lighthouse's mobile throttling figures (4x CPU, ~1.6 Mbps, 150 ms RTT).
await viewport(375, 812, true);
await send("Emulation.setCPUThrottlingRate", { rate: 4 });
await send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
await send("Page.addScriptToEvaluateOnNewDocument", { source: `
  window.__m = { cls: 0, lcp: 0, lcpEl: '', long: 0 };
  new PerformanceObserver(l => { for (const e of l.getEntries()) { __m.lcp = e.startTime; __m.lcpEl = e.element?.tagName; } }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) __m.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver(l => { for (const e of l.getEntries()) __m.long += Math.max(0, e.duration - 50); }).observe({ type: 'longtask', buffered: true });
` });
await send("Page.navigate", { url: URL_ });
await sleep(9000);
results.throttled = await ev(`({ lcp: Math.round(__m.lcp), lcpEl: __m.lcpEl, cls: +__m.cls.toFixed(4), blocking: Math.round(__m.long), fcp: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0),
  transferKB: Math.round(performance.getEntriesByType('resource').reduce((a, r) => a + r.transferSize, 0) / 1024),
  jsKB: Math.round(performance.getEntriesByType('resource').filter(r => r.name.endsWith('.js')).reduce((a, r) => a + r.transferSize, 0) / 1024) })`);

results.errors = [...new Set(errors)];
console.log(JSON.stringify(results, null, 2));
ws.close();
chrome.kill();
await sleep(500);
try { rmSync(profile, { recursive: true, force: true }); } catch {}
