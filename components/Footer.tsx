import { FOOTER_TAGLINE, LINKS } from "@/lib/content";
import { Logo } from "./Logo";

const LINKS_FOOTER = [
  { label: "Cennik", href: "#cennik" },
  { label: "Oferty pracy", href: LINKS.jobs },
  { label: "Regulamin", href: LINKS.terms },
  { label: "Prywatność", href: LINKS.privacy },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="container-jm flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <a href="#tresc" className="inline-flex items-center gap-2.5" aria-label="Jelly Match, na górę strony"><Logo /></a>
          <p className="mt-3 text-sm text-muted">{FOOTER_TAGLINE}</p>
        </div>
        <nav aria-label="Stopka" className="flex flex-wrap gap-x-6 gap-y-1">
          {LINKS_FOOTER.map((l) => <a key={l.label} href={l.href} className="nav-link">{l.label}</a>)}
        </nav>
        <p className="text-sm text-muted">© 2026</p>
      </div>
    </footer>
  );
}
