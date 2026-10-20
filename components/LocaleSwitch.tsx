"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { content } from "@/lib/content";

/** EN | PL pill — same pattern as jellylabs.tech: EN at "/", PL at "/pl", identical paths. */
export function LocaleSwitch({ size = "sm", onSwitch }: { size?: "sm" | "lg"; onSwitch?: () => void }) {
  const current = useLocale();
  const pathname = usePathname();
  const pad = size === "lg" ? "min-h-12 min-w-14 text-base" : "min-h-9 min-w-10 text-xs";

  return (
    <nav aria-label={content[current].ui.languageSwitch}>
      <ul className="inline-flex items-center rounded-full border border-white/15 p-1">
        {routing.locales.map((locale) => {
          const active = locale === current;
          return (
            <li key={locale}>
              <Link
                href={pathname}
                locale={locale}
                hrefLang={locale}
                lang={locale}
                aria-current={active ? "true" : undefined}
                onClick={onSwitch}
                className={`flex items-center justify-center rounded-full px-2.5 font-display font-semibold tracking-[0.12em] uppercase transition-colors duration-200 ${pad} ${
                  active ? "bg-white/10 text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {locale}
                {/* announced in the target language, like the switch on jellylabs.tech */}
                {!active && <span className="sr-only"> — {content[locale].ui.switchTo}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
