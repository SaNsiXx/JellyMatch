// Active locale for the single-file build (replaces next-intl's routing: EN|PL switches in place).
import type { Locale } from "@/i18n/routing";

let current: Locale = "en";
let switched = false;
const subs = new Set<() => void>();

export const getLocale = () => current;
/** Whether the visitor has changed language yet (the preloader only plays on first load). */
export const hasSwitched = () => switched;
export const subscribe = (fn: () => void) => {
  subs.add(fn);
  return () => void subs.delete(fn);
};
export function setLocale(l: Locale) {
  if (l === current) return;
  current = l;
  switched = true;
  document.documentElement.lang = l;
  window.scrollTo(0, 0);
  subs.forEach((fn) => fn());
}
