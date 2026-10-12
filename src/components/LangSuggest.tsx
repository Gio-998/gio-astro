"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useContent } from "@/lib/content-context";
import { LOCALES } from "@/content";

// Shown in the *suggested* language, so the reader understands it.
const TEXT: Record<string, { msg: string; go: string; close: string }> = {
  en: { msg: "This page is also available in English.", go: "Switch to English", close: "Dismiss" },
  mk: { msg: "Оваа страница е достапна и на македонски.", go: "Префрли на македонски", close: "Затвори" },
};
const DISMISS = "mirrorstar:lang-hint-dismissed";

/** Dismissible language suggestion from the browser's Accept-Language. Never redirects (crawlers see the URL they asked for). */
export function LangSuggest() {
  const { locale } = useContent(); const path = usePathname() || "/";
  const [target, setTarget] = useState<string | null>(null);
  useEffect(() => {
    try {
      if (localStorage.getItem("mirrorstar:lang") || localStorage.getItem(DISMISS)) return;
      const pref = (navigator.languages ?? [navigator.language]).map((l) => l.toLowerCase().slice(0, 2)).find((l) => (LOCALES as readonly string[]).includes(l));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only check after mount
      if (pref && pref !== locale) setTarget(pref);
    } catch { /* storage blocked */ }
  }, [locale]);
  if (!target) return null;
  const t = TEXT[target]; const href = path.replace(/^\/(en|mk)(?=\/|$)/, `/${target}`);
  return (
    <div lang={target} role="region" aria-label={t.msg} className="mx-auto mb-3 flex max-w-4xl items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-2 text-sm backdrop-blur" data-testid="lang-suggest">
      <span>🌐 {t.msg}</span>
      <span className="flex items-center gap-3">
        <a className="text-gold underline-offset-4 hover:underline" href={href} onClick={() => { try { localStorage.setItem("mirrorstar:lang", target); } catch {} }}>{t.go}</a>
        <button aria-label={t.close} className="text-dim hover:text-mist" onClick={() => { try { localStorage.setItem(DISMISS, "1"); } catch {} setTarget(null); }}>✕</button>
      </span>
    </div>
  );
}
