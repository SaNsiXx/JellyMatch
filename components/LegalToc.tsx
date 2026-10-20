"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

/** Sticky table of contents; highlights the section currently in view. */
export function LegalToc({ title, items }: { title: string; items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  const list = (onPick?: () => void) => (
    <ol className="mt-5 grid gap-1 border-l border-line">
      {items.map((i) => (
        <li key={i.id}>
          <a
            href={`#${i.id}`}
            onClick={onPick}
            aria-current={active === i.id ? "location" : undefined}
            className={`-ml-px block border-l py-1.5 pl-4 text-[0.925rem] leading-snug transition-colors duration-300 ${
              active === i.id ? "border-lime text-fg" : "border-transparent text-muted hover:text-fg"
            }`}
          >
            {i.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <nav aria-label={title} className="lg:col-span-4">
      {/* phones: collapsible, so the document starts right away */}
      <details className="group card px-6 py-4 lg:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between eyebrow [&::-webkit-details-marker]:hidden">
          {title}
          <ChevronDown aria-hidden="true" className="size-4 transition-transform duration-300 group-open:rotate-180" />
        </summary>
        {list()}
      </details>
      <div className="hidden lg:sticky lg:top-28 lg:block">
        <p className="eyebrow">{title}</p>
        {list()}
      </div>
    </nav>
  );
}
