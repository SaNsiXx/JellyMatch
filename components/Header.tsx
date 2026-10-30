"use client";

import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LINKS, NAV } from "@/lib/content";
import { Cta } from "./Cta";
import { Logo } from "./Logo";

function LocaleTag() {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted" aria-label="Język: polski">
      <span className="inline-block h-3 w-[18px] overflow-hidden rounded-[2px] border border-white/20" aria-hidden="true">
        <span className="block h-1/2 bg-white" />
        <span className="block h-1/2 bg-[#DC143C]" />
      </span>
      PL
    </span>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = [toggle, ...panelRef.current.querySelectorAll<HTMLElement>("a")].filter(Boolean) as HTMLElement[];
      const first = items[0]!, last = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  return (
    <LazyMotion features={domAnimation}>
      <header className="site-header" data-scrolled={scrolled || open}>
        <div className="container-jm flex h-[72px] items-center justify-between gap-6">
          <a href="#tresc" className="flex items-center gap-2.5" aria-label="Jelly Match, strona główna"><Logo /></a>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Główna">
            {NAV.map((n) => <a key={n.label} href={n.href} className="nav-link">{n.label}</a>)}
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <LocaleTag />
            <a href={LINKS.signIn} className="nav-link">Zaloguj się</a>
            <Cta href={LINKS.signUp} size="sm">Załóż konto</Cta>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="flex size-12 items-center justify-center rounded-full md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <m.div
              id="menu-mobile"
              ref={panelRef}
              className="fixed inset-x-0 top-[72px] bottom-0 flex flex-col gap-2 overflow-y-auto bg-ink px-6 pt-6 pb-10 md:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {NAV.map((n) => (
                <a key={n.label} href={n.href} className="display py-3 text-4xl" onClick={() => setOpen(false)}>{n.label}</a>
              ))}
              <a href={LINKS.signIn} className="display py-3 text-4xl" onClick={() => setOpen(false)}>Zaloguj się</a>
              <div className="py-3"><LocaleTag /></div>
              <a href={LINKS.signUp} className="btn btn-primary mt-auto">Załóż konto</a>
            </m.div>
          )}
        </AnimatePresence>
      </header>
    </LazyMotion>
  );
}
