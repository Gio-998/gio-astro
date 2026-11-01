"use client";
import { useEffect } from "react";
import { useStore, repo } from "@/lib/store";
import { useContent } from "@/lib/content-context";

/**
 * Applies the user's element as the site accent theme (html[data-theme]); "default" restores the house look.
 * The chart engine loads only for someone with a saved profile: this runs on every page, and a first-time reader has no theme to compute.
 */
export function PersonalTheme() {
  const s = useStore();
  const me = s?.me ?? null; const mode = s?.settings.theme ?? "personal";
  useEffect(() => {
    const root = document.documentElement;
    if (!me || mode !== "personal") { delete root.dataset.theme; root.style.removeProperty("--personal-accent"); return; }
    let live = true;
    void import("@/lib/profile").then(({ profileOf }) => {
      if (!live) return;
      // This sits above every error screen: saved data it cannot read must not take the whole site down with it.
      try { const p = profileOf(me); root.dataset.theme = p.dominantElement; root.style.setProperty("--personal-accent", p.palette[0]); } catch { delete root.dataset.theme; }
    });
    return () => { live = false; };
  }, [me, mode]);
  return null;
}

export function ThemeToggle({ className = "btn-ghost" }: { className?: string }) {
  const s = useStore(); const { c } = useContent();
  if (!s?.me) return null;
  const on = s.settings.theme === "personal";
  return <button className={className} onClick={() => repo.saveSettings({ theme: on ? "default" : "personal" })} title={c.site.themeHint}>🎨 {on ? c.site.themeOn : c.site.themeOff}</button>;
}
