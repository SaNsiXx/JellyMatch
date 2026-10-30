import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function Cta({
  href,
  children,
  variant = "primary",
  size,
  arrow = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "sm";
  arrow?: boolean;
  className?: string;
}) {
  return (
    <span data-magnetic className={`magnetic ${className}`}>
      <a href={href} className={`btn btn-${variant} ${size === "sm" ? "btn-sm" : ""} w-full`}>
        {children}
        {arrow && <ArrowRight size={18} aria-hidden="true" />}
      </a>
    </span>
  );
}
