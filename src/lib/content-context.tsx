"use client";
import { createContext, useContext } from "react";
import { contents, Content, Locale } from "@/content";
import { formatDate, localIso } from "./dates";

const Ctx = createContext<{ locale: Locale; c: Content }>({ locale: "en", c: contents.en });
export function ContentProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <Ctx.Provider value={{ locale, c: contents[locale] }}>{children}</Ctx.Provider>;
}
export const useContent = () => useContext(Ctx);
/** Human date formatter bound to the current locale: fmt("1995-10-12") → "12 October 1995". */
export function useDate() {
  const { c } = useContext(Ctx);
  return (iso: string | Date, opts: { year?: boolean; weekday?: boolean } = {}) => formatDate(typeof iso === "string" ? iso : localIso(iso), c.site.months, { year: opts.year, weekday: opts.weekday ? c.site.weekdays : undefined });
}
/** Locale-prefixed href helper. */
export function useHref() {
  const { locale } = useContext(Ctx);
  return (path: string) => `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
