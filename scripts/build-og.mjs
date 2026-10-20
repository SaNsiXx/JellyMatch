// public/og.jpg (1200×630): Higgsfield render raw-assets/og-base.png + logo/headline overlay.
// Needs the Outfit font installed locally for librsvg (fc-list | grep Outfit). Run: node scripts/build-og.mjs
import sharp from "sharp";

const W = 1200, H = 630;
const base = await sharp("raw-assets/og-base.png").resize(W, H, { fit: "cover", position: "south" }).toBuffer();

const mark = (x, y, s) => `
  <g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke-width="26" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 66 L40 22 L64 66" stroke="#c6ff00"/>
    <path d="M56 66 L80 22 L104 66" stroke="#8b5cf6"/>
  </g>`;

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0b0b0f" stop-opacity="0.92"/>
      <stop offset="0.55" stop-color="#0b0b0f" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#0b0b0f" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#c6ff00"/><stop offset="0.5" stop-color="#d9e8a0"/><stop offset="1" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fade)"/>
  ${mark(72, 52, 0.62)}
  <text x="160" y="92" font-family="Outfit" font-weight="700" font-size="40" letter-spacing="-1.6" fill="#f5f5f7">Jelly Match</text>
  <text x="72" y="208" font-family="Outfit" font-weight="600" font-size="68" letter-spacing="-2.8" fill="#f5f5f7">Oprogramowanie do rekrutacji,</text>
  <text x="72" y="282" font-family="Outfit" font-weight="600" font-size="68" letter-spacing="-2.8" fill="url(#grad)">które zaczyna się za darmo.</text>
</svg>`;

await sharp(base).composite([{ input: Buffer.from(svg) }]).jpeg({ quality: 84, mozjpeg: true }).toFile("public/og.jpg");
console.log("public/og.jpg");
