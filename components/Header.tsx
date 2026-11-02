"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import { Logo } from "./Logo";
import { LocaleSwitch } from "./LocaleSwitch";
import { ButtonLink } from "./ui/Button";
import { useContent } from "@/lib/content";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

export function Header() {
  const { links, nav, ui } = useContent();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const menuOpen = useRef(false);
  const router = useRouter();
  // a page picked in the mobile menu opens only once the menu has faded out — navigating right away loads and
  // renders the new page while the menu animates, and the animation stalled halfway for a second or two
  const pending = useRef<string | null>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The bar slides out with the page as you scroll down and back in as you scroll up, by exactly the distance
    // scrolled (at most its own height) — no on/off jump. Tiny back-and-forth moves (momentum tails, the mobile
    // toolbar resizing the viewport) only nudge it a few px; if scrolling stops half-way it settles open or closed.
    // The transform is written straight to the element (no React render per scroll frame).
    const el = bar.current!;
    const BG = "background-color 0.5s var(--ease-jelly), border-color 0.5s var(--ease-jelly)";
    const SETTLE = `transform 0.25s var(--ease-jelly), ${BG}`;
    let h = el.offsetHeight;
    const ro = new ResizeObserver(() => (h = el.offsetHeight));
    ro.observe(el);
    let last = window.scrollY;
    let off = 0;
    let raf = 0;
    let idle = 0;
    const place = (transition: string) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transition = transition;
        el.style.transform = `translate3d(0, ${-off}px, 0)`;
      });
    };
    const onScroll = () => {
      // read here, in the scroll event (layout is clean), not inside a frame after other animations' writes
      const y = window.scrollY;
      const dy = y - last;
      last = y;
      setScrolled(y > 12);
      window.clearTimeout(idle);
      if (y < 80 || menuOpen.current) {
        const was = off;
        off = 0;
        if (was) place(SETTLE);
        return;
      }
      off = Math.min(h, Math.max(0, off + dy));
      place(BG);
      idle = window.setTimeout(() => {
        if (off > 0 && off < h) {
          off = off > h / 2 ? h : 0;
          place(SETTLE);
        }
      }, 140);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    menuOpen.current = open;
    if (!open) return;
    // the bar is always fully in view while the menu is open
    if (bar.current) bar.current.style.transform = "translate3d(0, 0, 0)";
    const lenis = (window as Window & { __lenis?: { stop(): void; start(): void } }).__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a, button");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    const btn = toggle.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
      btn?.focus();
    };
  }, [open]);

  return (
    <>
      {/* phones/tablets: a denser bar without backdrop blur — the jelly animates under it, so a blur would be
          recomputed every frame */}
      <header
        ref={bar}
        className={`fixed inset-x-0 top-0 z-50 will-change-transform ${scrolled ? "border-b border-line bg-ink/70 backdrop-blur-xl backdrop-saturate-150 max-lg:bg-ink/90 max-lg:backdrop-blur-none max-lg:backdrop-saturate-100" : "border-b border-transparent"}`}
      >
        <div className="container-jm flex h-18 items-center gap-6 lg:h-20">
          <Link href="/" aria-label={ui.home} className="logo-hover -m-2 rounded-xl p-2 text-ui sm:text-base">
            <Logo />
          </Link>

          <nav aria-label={ui.mainNav} className="ml-6 hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((n) => (
                <li key={n.label}>
                  <Link
                    href={n.href}
                    aria-current={isActive(n.href) ? "page" : undefined}
                    className={`link-draw mx-3 inline-flex min-h-11 items-center text-ui transition-colors hover:text-fg ${isActive(n.href) ? "text-fg" : "text-muted"}`}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="hidden md:block">
              <LocaleSwitch />
            </div>
            <a href={links.signIn} className="link-draw hidden min-h-11 items-center px-2 text-ui text-muted transition-colors hover:text-fg md:inline-flex">
              {ui.signIn}
            </a>
            <ButtonLink href={links.signUp} className="!min-h-11 !px-5 !text-ui">
              {ui.signUp}
            </ButtonLink>
            <button
              ref={toggle}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={ui.openMenu}
              onClick={() => setOpen(true)}
              className="-mr-2 flex size-12 items-center justify-center rounded-full transition-colors hover:bg-white/5 lg:hidden"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 9h16M4 15h10" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence
        onExitComplete={() => {
          const href = pending.current;
          pending.current = null;
          if (href) router.push(href);
        }}
      >
        {open && (
          <m.div
            ref={panel}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={ui.menu}
            className="fixed inset-0 z-[55] flex flex-col bg-ink/95 lg:hidden"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
            // closing is a quick fade (runs on the GPU, so a busy main thread can't freeze it)
            exit={{ opacity: 0, transition: { duration: 0.25, ease: "easeOut" } }}
          >
            <div className="container-jm flex h-18 items-center justify-between">
              <Logo className="text-ui" />
              <button type="button" aria-label={ui.closeMenu} onClick={() => setOpen(false)} className="-mr-2 flex size-12 items-center justify-center rounded-full hover:bg-white/5">
                <X aria-hidden="true" className="size-6" />
              </button>
            </div>
            <nav aria-label={ui.mobileNav} className="container-jm mt-10 flex-1">
              <ul className="flex flex-col gap-2">
                {[...nav, { label: ui.signIn, href: links.signIn }].map((n, i) => (
                  <m.li key={n.label} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                    {n.href.startsWith("/") ? (
                      <Link
                        href={n.href}
                        onClick={(e) => {
                          if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                          e.preventDefault();
                          pending.current = n.href;
                          setOpen(false);
                        }}
                        className="block py-2 font-display text-5xl font-semibold tracking-[-0.04em]"
                      >
                        {n.label}
                      </Link>
                    ) : (
                      <a href={n.href} onClick={() => setOpen(false)} className="block py-2 font-display text-5xl font-semibold tracking-[-0.04em]">
                        {n.label}
                      </a>
                    )}
                  </m.li>
                ))}
              </ul>
            </nav>
            <div className="container-jm flex flex-col gap-3 pb-10">
              <div className="mb-3">
                <LocaleSwitch size="lg" onSwitch={() => setOpen(false)} />
              </div>
              <ButtonLink href={links.signUp} arrow magnetic={false} className="w-full">{ui.signUp}</ButtonLink>
              <ButtonLink href={links.demo} variant="ghost" magnetic={false} className="w-full">{ui.tryDemo}</ButtonLink>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
