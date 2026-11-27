"use client";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { localePath } from "@/lib/horo-slugs";
import { PARTIAL_LOCALES } from "@/lib/partial-scope";
import { ROUTE_LOCALES } from "@/lib/i18n-routes";
import { Flag } from "./art/Flag";

/** Every language the menu offers: the four full ones, then the partial test locales. Used when a page's content has no name for one of them. */
const SWITCH_LOCALES: readonly string[] = [...ROUTE_LOCALES, ...PARTIAL_LOCALES];
const FALLBACK_NAMES: Record<string, string> = { en: "English", mk: "Македонски", de: "Deutsch", sr: "Srpski", sl: "Slovenščina" };

/** Language menu: flag + short code; picking a language stores it (cookie for the edge redirect on "/", localStorage for the root page). */
export function LangMenu({ locale, names, label, className = "" }: { locale: string; names: Record<string, string>; label: string; className?: string }) {
  const path = usePathname() || "/";
  const [open, setOpen] = useState(false); const ref = useRef<HTMLDivElement>(null); const id = useId();
  useEffect(() => {
    if (!open) return;
    const off = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", off); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", off); document.removeEventListener("keydown", esc); };
  }, [open]);
  const code = (l: string) => (l === "mk" ? "мк" : l);
  return (
    <div ref={ref} className={`relative shrink-0 text-xs ${className}`}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={id} aria-haspopup="true"
        aria-label={`${label}: ${names[locale] ?? FALLBACK_NAMES[locale] ?? locale}`}
        className="flex min-h-[44px] items-center gap-1.5 rounded-full px-2.5 font-semibold uppercase tracking-wider text-mist/85 transition hover:bg-white/10">
        <Flag code={locale} className="h-3 w-[18px]" /><span>{code(locale)}</span>
        <svg viewBox="0 0 10 6" className={`h-1.5 w-2.5 transition ${open ? "rotate-180" : ""}`} aria-hidden><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
      </button>
      {open && (
        <ul id={id} role="list" className="absolute right-0 top-full z-50 mt-1.5 min-w-[150px] rounded-2xl border border-white/15 bg-[#17123a]/95 p-1 shadow-xl backdrop-blur">
          {SWITCH_LOCALES.map((l) => {
            const href = localePath(path, l) || `/${l}/`;
            return (
              <li key={l}>
                <a href={href} hrefLang={l} lang={l} aria-current={l === locale ? "true" : undefined}
                  onClick={(e) => { e.preventDefault(); // A test locale is not remembered: the edge redirect on "/" and the root page only know the four full languages.
                    if (!(PARTIAL_LOCALES as readonly string[]).includes(l)) { try { localStorage.setItem("mirrorstar:lang", l); document.cookie = `lang=${l}; path=/; max-age=31536000; SameSite=Lax`; } catch {} } window.location.href = href + window.location.search + window.location.hash; }}
                  className={`flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-xl px-2.5 text-sm transition ${l === locale ? "bg-gold/15 text-gold" : "text-mist hover:bg-white/10"}`}>
                  <Flag code={l} className="h-3.5 w-[21px]" /><span>{names[l] ?? FALLBACK_NAMES[l] ?? l}</span>{l === locale && <span className="ml-auto" aria-hidden>✓</span>}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

