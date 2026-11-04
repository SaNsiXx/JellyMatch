// Stand-in for components/ui/Picture: one embedded WebP per image (see assets.ts).
import { assetUrl } from "./assets";
import manifest from "@/lib/assets.json";

type Props = { name: string; alt: string; sizes: string; className?: string; imgClassName?: string; priority?: boolean };
const assets = manifest as Record<string, { w: number; h: number }>;

export function Picture({ name, alt, className = "", imgClassName = "", priority = false }: Props) {
  const a = assets[name]!;
  return (
    <picture className={className}>
      <img src={assetUrl(name)} width={a.w} height={a.h} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" className={imgClassName} />
    </picture>
  );
}
