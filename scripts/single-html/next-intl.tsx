// Stand-in for "next-intl" (client hooks only).
import { useSyncExternalStore, type ReactNode } from "react";
import { getLocale, subscribe } from "./locale";

export const useLocale = () => useSyncExternalStore(subscribe, getLocale, getLocale);
export const NextIntlClientProvider = ({ children }: { children: ReactNode }) => children;
