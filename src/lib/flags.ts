"use client";
/**
 * Runtime switches from the public.feature_flags table (admin panel → Switches).
 * Read once per page load (anon can read), cached in localStorage so the next load starts with the last known values.
 * Defaults = the build-time env, so the app behaves the same if Supabase is unreachable.
 * The private beta is over: private_beta only counts on a build made with NEXT_PUBLIC_BETA=1, so neither the table nor a
 * value cached on a tester's device can close the app. signups_open stays live, because the server decides who can register.
 */
import { useSyncExternalStore } from "react";
import { sb, betaMode } from "./supabase";

export type FlagKey = "private_beta" | "signups_open" | "captcha";
export type Flags = Record<FlagKey, boolean> & { loaded: boolean };
const KEY = "horoscop:flags";
const DEFAULTS: Flags = { private_beta: betaMode, signups_open: !betaMode, captcha: true, loaded: false };

export const settleFlags = (f: Flags, beta = betaMode): Flags => (beta ? f : { ...f, private_beta: false });

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
  flags = settleFlags(next);
  try { localStorage.setItem(KEY, JSON.stringify({ private_beta: next.private_beta, signups_open: next.signups_open, captcha: next.captcha })); } catch { /* private mode */ }
  emit();
}

function start() {
  if (started || typeof window === "undefined") return; started = true;
  flags = settleFlags({ ...flags, ...readCache(), loaded: false });
  void refreshFlags();
}

export function setFlagLocal(k: FlagKey, v: boolean) { flags = settleFlags({ ...flags, [k]: v }); emit(); }
export const getFlags = () => flags;

export function useFlags(): Flags {
  return useSyncExternalStore(
    (cb) => { start(); subs.add(cb); return () => { subs.delete(cb); }; },
    () => flags,
    () => DEFAULTS,
  );
}
