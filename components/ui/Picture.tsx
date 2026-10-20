import manifest from "@/lib/assets.json";

type Entry = { w: number; h: number; widths: number[] };
const assets = manifest as Record<string, Entry>;

type Props = {
  name: string;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
};

/** AVIF + WebP responsive image for files produced by scripts/optimize-assets.mjs. */
export function Picture({ name, alt, sizes, className = "", imgClassName = "", priority = false }: Props) {
  const a = assets[name];
  if (!a) throw new Error(`Unknown asset "${name}" — run npm run assets`);
  const set = (ext: string) => a.widths.map((w) => `/assets/${name}-${w}.${ext} ${w}w`).join(", ");
  const largest = a.widths[a.widths.length - 1];
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`/assets/${name}-${largest}.webp`}
        width={a.w}
        height={a.h}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={imgClassName}
      />
    </picture>
  );
}
