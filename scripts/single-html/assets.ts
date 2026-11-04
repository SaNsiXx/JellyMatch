// Embedded images → blob: URLs. Anything the page asks for under /assets/… (img src, srcset, poster,
// new Image().src) is redirected here, so components keep their real paths.
import data from "virtual:assets";

const urls = new Map<string, string>();
for (const [name, { type, b64 }] of Object.entries(data as Record<string, { type: string; b64: string }>)) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  urls.set(name, URL.createObjectURL(new Blob([bytes], { type })));
}

/** "ai-scan" or "/assets/ai-scan-1100.webp" → blob URL (any width maps to the embedded one). */
export function assetUrl(nameOrPath: string) {
  const m = /^\/assets\/(.+?)(?:-\d+)?\.(?:webp|avif|png|jpg)$/.exec(nameOrPath);
  const name = m ? m[1]! : nameOrPath;
  return urls.get(name) ?? "";
}

const map = (v: string) => (v.startsWith("/assets/") ? assetUrl(v) || v : v);
const setAttr = Element.prototype.setAttribute;
Element.prototype.setAttribute = function (name: string, value: string) {
  if ((name === "src" || name === "poster") && typeof value === "string") value = map(value);
  return setAttr.call(this, name, value);
};
const src = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src")!;
Object.defineProperty(HTMLImageElement.prototype, "src", {
  ...src,
  set(v: string) {
    src.set!.call(this, map(v));
  },
});
