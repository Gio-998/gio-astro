"use client";
import dynamic from "next/dynamic";
import { ContentProvider } from "@/lib/content-context";
import type { Locale } from "@/content";

// Loaded through next/dynamic so each language is its own chunk: a static import here would put all of them on every page. The HTML is unchanged, the chunk is preloaded, and hydration starts when it arrives.
const PROVIDERS: Partial<Record<Locale, React.ComponentType<{ children: React.ReactNode }>>> = {
  en: dynamic(() => import("./en").then((m) => m.EnContent)),
  mk: dynamic(() => import("./mk").then((m) => m.MkContent)),
  de: dynamic(() => import("./de").then((m) => m.DeContent)),
  sr: dynamic(() => import("./sr").then((m) => m.SrContent)),
};

/** A language without a shell file still works: every read falls through to the full content. */
export function LocaleContent({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const Provider = PROVIDERS[locale];
  return Provider ? <Provider>{children}</Provider> : <ContentProvider locale={locale}>{children}</ContentProvider>;
}
