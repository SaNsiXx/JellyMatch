import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

export type LegalDoc = "terms" | "privacy";

/**
 * Legal documents (English, as on staffinit.com — the Polish site shows the same English text).
 * Source HTML is committed in content/legal and was cleaned + re-branded by hand-run tooling; the operator
 * (Bespoke Soft) and the service domains are left untouched on purpose — legal review before launch.
 */
export async function getLegalDoc(doc: LegalDoc) {
  const html = await readFile(path.join(process.cwd(), "content/legal", `${doc}.html`), "utf8");
  const toc = Array.from(html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g), (m) => ({
    id: m[1]!,
    title: m[2]!.replace(/<[^>]+>/g, "").trim(),
  }));
  return { html, toc };
}
