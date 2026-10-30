import assets from "@/lib/assets.json";

type AssetName = keyof typeof assets;

/** AVIF + WebP responsive image from the set built by `npm run assets`. */
export function Picture({
  name,
  alt,
  sizes,
  className,
  priority = false,
}: {
  name: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const { widths, ratio } = assets[name as AssetName];
  const set = (ext: string) => widths.map((w) => `/assets/${name}-${w}.${ext} ${w}w`).join(", ");
  const width = widths[widths.length - 1]!;
  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/assets/${name}-${width}.webp`}
        alt={alt}
        width={width}
        height={Math.round(width / ratio)}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
      />
    </picture>
  );
}
