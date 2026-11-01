"use client";
import { useEffect } from "react";
import { useStore, repo } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { useContent } from "@/lib/content-context";

/** Applies the user's element as the site accent theme (html[data-theme]); "default" restores the house look. */
export function PersonalTheme() {
  const s = useStore();
  const me = s?.me ?? null; const mode = s?.settings.theme ?? "personal";
  // The theme sits in the layout, above every error screen: saved data it cannot read must not take the whole site down with it.
  let theme = null; try { theme = me && mode === "personal" ? profileOf(me) : null; } catch { /* the page's own error screen explains it */ }
  const el = theme?.dominantElement ?? null; const accent = theme?.palette[0] ?? null;
  useEffect(() => {
    const root = document.documentElement;
    if (el) { root.dataset.theme = el; root.style.setProperty("--personal-accent", accent!); }
    else { delete root.dataset.theme; root.style.removeProperty("--personal-accent"); }
  }, [el, accent]);
  return null;
}

export function ThemeToggle({ className = "btn-ghost" }: { className?: string }) {
  const s = useStore(); const { c } = useContent();
  if (!s?.me) return null;
  const on = s.settings.theme === "personal";
  return <button className={className} onClick={() => repo.saveSettings({ theme: on ? "default" : "personal" })} title={c.site.themeHint}>🎨 {on ? c.site.themeOn : c.site.themeOff}</button>;
}
