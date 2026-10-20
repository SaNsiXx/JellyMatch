import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pl"],
  defaultLocale: "en",
  // EN lives at "/", PL at "/pl" — same mechanism as jellylabs.tech.
  localePrefix: "as-needed",
  // Deterministic URLs: no Accept-Language redirects; visitors switch explicitly.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
