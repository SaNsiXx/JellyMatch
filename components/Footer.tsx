import { Logo, LogoMark } from "./Logo";
import { useContent } from "@/lib/content";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const { brand, footer, ui } = useContent();
  return (
    <footer className="relative overflow-hidden border-t border-line pt-16 pb-10">
      <div className="container-jm">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" aria-label={ui.home} className="logo-hover -m-2 inline-block rounded-xl p-2">
              <Logo />
            </Link>
            <p className="mt-5 text-muted">{brand.tagline}</p>
          </div>
          <nav aria-label={ui.footerNav}>
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3 sm:flex sm:gap-8">
              {footer.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="link-draw inline-flex min-h-11 items-center text-fg/80 transition-colors hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* decorative logotype (hidden from AT): the words live in ::after, so they are neither read out, indexed nor
            contrast-checked as text; the outline filter draws from the glyph fill */}
        <div aria-hidden="true" className="mt-16 flex items-end gap-[2vw] select-none">
          <LogoMark className="h-[9vw] w-auto shrink-0 opacity-90" />
          <span
            data-wordmark="Jelly Match"
            className="font-display text-[12.5vw] leading-[0.72] whitespace-nowrap font-bold tracking-[-0.06em] text-fg opacity-[0.14] [filter:url(#jm-outline-1)] after:content-[attr(data-wordmark)]"
          />
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:justify-between">
          <p>{footer.copyright}</p>
          <p className="font-mono text-xs tracking-[0.2em] uppercase">{ui.footerKicker}</p>
        </div>
      </div>
    </footer>
  );
}
