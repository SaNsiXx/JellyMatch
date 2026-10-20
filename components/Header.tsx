"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import { Logo } from "./Logo";
import { ButtonLink } from "./ui/Button";
import { links, nav } from "@/lib/content";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 12);
        setHidden(y > 400 && y > lastY + 2);
        if (y < lastY - 2 || y < 400) setHidden(false);
        lastY = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
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
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-jelly)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${scrolled ? "border-b border-line bg-ink/70 backdrop-blur-xl backdrop-saturate-150" : "border-b border-transparent"}`}
      >
        <div className="container-jm flex h-18 items-center gap-6 lg:h-20">
          <a href="#top" aria-label="Jelly Match — strona główna" className="logo-hover -m-2 rounded-xl p-2 text-[15px] sm:text-base">
            <Logo />
          </a>

          <nav aria-label="Główna" className="ml-6 hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((n) => (
                <li key={n.label}>
                  <a href={n.href} className="link-draw mx-3 inline-flex min-h-11 items-center text-[0.95rem] text-muted transition-colors hover:text-fg">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-xs tracking-[0.14em] text-fg md:inline-flex" aria-label="Język: polski">
              <span aria-hidden="true">🇵🇱</span> PL
            </span>
            <a href={links.signIn} className="link-draw hidden min-h-11 items-center px-2 text-[0.95rem] text-muted transition-colors hover:text-fg md:inline-flex">
              Zaloguj się
            </a>
            <ButtonLink href={links.signUp} className="!min-h-11 !px-5 !text-[0.9rem]" cursor="Start">
              Załóż konto
            </ButtonLink>
            <button
              ref={toggle}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Otwórz menu"
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

      <AnimatePresence>
        {open && (
          <m.div
            ref={panel}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[55] flex flex-col bg-ink/95 backdrop-blur-xl lg:hidden"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container-jm flex h-18 items-center justify-between">
              <Logo className="text-[15px]" />
              <button type="button" aria-label="Zamknij menu" onClick={() => setOpen(false)} className="-mr-2 flex size-12 items-center justify-center rounded-full hover:bg-white/5">
                <X aria-hidden="true" className="size-6" />
              </button>
            </div>
            <nav aria-label="Menu mobilne" className="container-jm mt-10 flex-1">
              <ul className="flex flex-col gap-2">
                {[...nav, { label: "Zaloguj się", href: links.signIn }].map((n, i) => (
                  <m.li key={n.label} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                    <a href={n.href} onClick={() => setOpen(false)} className="block py-2 font-display text-5xl font-semibold tracking-[-0.04em]">
                      {n.label}
                    </a>
                  </m.li>
                ))}
              </ul>
            </nav>
            <div className="container-jm flex flex-col gap-3 pb-10">
              <ButtonLink href={links.signUp} arrow magnetic={false} className="w-full">Załóż konto</ButtonLink>
              <ButtonLink href={links.demo} variant="ghost" magnetic={false} className="w-full">Wypróbuj demo na żywo</ButtonLink>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
