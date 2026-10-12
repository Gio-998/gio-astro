"use client";
/**
 * Runtime switches from the public.feature_flags table (admin panel → Switches).
 * Read once per page load (anon can read), cached in localStorage so the next load starts with the last known values.
 * Defaults = the build-time env, so the app behaves as before if Supabase is unreachable.
 */
import { useSyncExternalStore } from "react";
import { sb, betaMode } from "./supabase";

export type FlagKey = "private_beta" | "signups_open" | "captcha";
export type Flags = Record<FlagKey, boolean> & { loaded: boolean };
const KEY = "horoscop:flags";
const DEFAULTS: Flags = { private_beta: betaMode, signups_open: false, captcha: true, loaded: false };

let flags: Flags = DEFAULTS;
let started = false;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

function readCache(): Partial<Flags> { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; } }

export async function refreshFlags() {
  const c = sb(); if (!c) { flags = { ...flags, loaded: true }; emit(); return; }
  const { data, error } = await c.from("feature_flags").select("key,enabled");
  if (error || !data) { flags = { ...flags, loaded: true }; emit(); return; }
  const next: Flags = { ...flags, loaded: true };
  for (const r of data) if (r.key in DEFAULTS) (next as Record<string, boolean>)[r.key] = r.enabled;
  flags = next;
  try { localStorage.setItem(KEY, JSON.stringify({ private_beta: next.private_beta, signups_open: next.signups_open, captcha: next.captcha })); } catch { /* private mode */ }
  emit();
}

function start() {
  if (started || typeof window === "undefined") return; started = true;
  flags = { ...flags, ...readCache(), loaded: false };
  void refreshFlags();
}

export function setFlagLocal(k: FlagKey, v: boolean) { flags = { ...flags, [k]: v }; emit(); }
export const getFlags = () => flags;

export function useFlags(): Flags {
  return useSyncExternalStore(
    (cb) => { start(); subs.add(cb); return () => { subs.delete(cb); }; },
    () => flags,
    () => DEFAULTS,
  );
}
