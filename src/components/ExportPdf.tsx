"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LOCALES } from "@/content";
import { useContent } from "@/lib/content-context";

/** Pages that make a good PDF. Other routes (forms, settings, admin) get no export button. */
const PRINTABLE = /^\/[a-z]{2}\/(match|book|me|today|bond|person|chart|daily|blog\/.+|play|quizzes|account|lens|learn)\/?$/;
const T: Record<string, { btn: string; pick: string; name: string }> = {
  en: { btn: "Export PDF", pick: "PDF language", name: "English" },
  mk: { btn: "Извези PDF", pick: "Јазик на PDF", name: "Македонски" },
};
const t = (l: string) => T[l] ?? T.en;

/** Floating "Export PDF" with a language choice. Another language opens the same page there and prints once it has loaded. */
export function ExportPdf() {
  const { locale } = useContent(); const path = usePathname() || "/"; const [open, setOpen] = useState(false);
  useEffect(() => {
    const u = new URL(location.href); if (u.searchParams.get("print") !== "1") return;
    u.searchParams.delete("print"); history.replaceState(null, "", u.pathname + u.search + u.hash);
    const id = setTimeout(() => window.print(), 2500); return () => clearTimeout(id);
  }, []);
  if (!PRINTABLE.test(path)) return null;
  const go = (l: string) => {
    setOpen(false);
    if (l === locale) { setTimeout(() => window.print(), 50); return; }
    const u = new URL(location.href); u.pathname = u.pathname.replace(/^\/[a-z]{2}(?=\/|$)/, `/${l}`); u.searchParams.set("print", "1");
    location.href = u.toString();
  };
  return (
    <div className="no-print fixed bottom-24 left-4 z-40" data-testid="export-pdf">
      {open && (
        <div role="menu" aria-label={t(locale).pick} className="mb-2 rounded-2xl border border-white/15 bg-ink/95 p-2 shadow-xl backdrop-blur">
          <p className="px-3 pb-1 pt-1 text-[11px] uppercase tracking-[.18em] text-gold">{t(locale).pick}</p>
          {LOCALES.map((l) => (
            <button key={l} role="menuitem" type="button" onClick={() => go(l)} data-testid={`export-pdf-${l}`}
              className="block min-h-[44px] w-full rounded-xl px-3 text-left text-sm text-mist hover:bg-white/10">{t(l).name}{l === locale ? " ✓" : ""}</button>
          ))}
        </div>
      )}
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="menu"
        className="min-h-[44px] rounded-full border border-gold/40 bg-ink/90 px-4 text-sm text-gold shadow-lg backdrop-blur hover:border-gold">⤓ {t(locale).btn}</button>
    </div>
  );
}
