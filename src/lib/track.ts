"use client";
/**
 * Lightweight usage counts for the admin Stats tab (public.events). No cookies, no fingerprinting, no third parties:
 * a random id lives in sessionStorage only (gone when the tab closes), so we count sessions, not people.
 * Signed-in users' events carry their user id (RLS: you can only insert events for yourself).
 */
import { parsePath } from "./i18n-routes";
import { sb } from "./supabase";
import { getAccount } from "./sync";

export type EventKind = "visit" | "quiz_done" | "compat_report" | "share_card" | "bond_check";
const SID = "horoscop:sid";
const sid = () => {
  try {
    let s = sessionStorage.getItem(SID);
    if (!s) { s = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36)).replace(/[^a-zA-Z0-9-]/g, "").slice(0, 36); sessionStorage.setItem(SID, s); }
    return s;
  } catch { return null; }
};
const loc = () => parsePath(location.pathname)?.[0] ?? "en";
const recent = new Map<string, number>();

export function track(kind: EventKind, meta: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  const c = sb(); if (!c) return;
  if (/^(localhost|127\.)/.test(location.hostname) && !localStorage.getItem("horoscop:track-local")) return;
  const key = kind + JSON.stringify(meta); const now = Date.now();
  if ((recent.get(key) ?? 0) > now - 3000) return; // double renders, double taps
  recent.set(key, now);
  const uid = getAccount().user?.id ?? null;
  void c.from("events").insert({ kind, user_id: uid, session_id: sid(), path: location.pathname.slice(0, 200), locale: loc(), meta }).then(() => {}, () => {});
}

/** One "visit" per tab session (sent once the session state is known, so it's tagged with the user when signed in). */
export function trackVisit() {
  try { if (sessionStorage.getItem("horoscop:visited")) return; sessionStorage.setItem("horoscop:visited", "1"); } catch { return; }
  track("visit");
}
