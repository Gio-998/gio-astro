"use client";
import { createContext, useContext } from "react";
import { contents, Content, Locale } from "@/content";

const Ctx = createContext<{ locale: Locale; c: Content }>({ locale: "en", c: contents.en });
export function ContentProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <Ctx.Provider value={{ locale, c: contents[locale] }}>{children}</Ctx.Provider>;
}
export const useContent = () => useContext(Ctx);
/** Locale-prefixed href helper. */
export function useHref() {
  const { locale } = useContext(Ctx);
  return (path: string) => `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
