import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { en } from "./en";
import { pl, type Content } from "./pl";

export type { Content };

export const content: Record<Locale, Content> = { en, pl };

/** Copy for the active locale — works in server and client components. */
export function useContent(): Content {
  return content[useLocale()];
}
