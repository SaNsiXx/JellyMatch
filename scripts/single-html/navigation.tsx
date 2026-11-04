// Stand-in for "next/navigation" and "@/i18n/navigation": one page, so routes map to sections of it;
// subpages (jobs, legal) go to the live site when __JM_SITE__ is set at build time.
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react";
import type { Locale } from "@/i18n/routing";
import { getLocale, setLocale } from "./locale";

declare const __JM_SITE__: string;

const SECTIONS: Record<string, string> = { "/": "#top", "/pricing": "#cennik" };

export function resolveHref(href: string, locale: Locale = getLocale()) {
  if (/^([a-z]+:|#)/i.test(href)) return href;
  if (SECTIONS[href]) return SECTIONS[href];
  return `${__JM_SITE__}${locale === "pl" ? "/pl" : ""}${href}`;
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  locale?: Locale;
  prefetch?: boolean;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ href, locale, prefetch, onClick, ...rest }, ref) {
  void prefetch;
  if (locale) {
    // language switch: re-render the page in place
    const click = (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onClick?.(e);
      setLocale(locale);
    };
    return <a ref={ref} href="#top" onClick={click} {...rest} />;
  }
  return <a ref={ref} href={resolveHref(href)} onClick={onClick} {...rest} />;
});

export const usePathname = () => "/";

function go(href: string) {
  const to = resolveHref(href);
  if (to.startsWith("#")) {
    const lenis = (window as Window & { __lenis?: { scrollTo: (t: string, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(to, { offset: -80 });
    else document.querySelector(to)?.scrollIntoView({ behavior: "smooth" });
  } else window.location.href = to;
}
export const useRouter = () => ({ push: go, replace: go, prefetch: () => {}, back: () => history.back(), refresh: () => {} });
