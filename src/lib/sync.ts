"use client";
/**
 * Offline-first account sync. localStorage stays the source of truth for the UI (instant, works offline);
 * when signed in, every local change is queued in an outbox and mirrored to Supabase. On sign-in we pull the
 * server copy and merge it with what is on this device (see sync-map.ts for the rules).
 */
import { useSyncExternalStore } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { sb } from "./supabase";
import { localRepo, onLocalChange, type Change, type State, type StoredPerson } from "./store";
import { meToProfile, personToRow, journalToRow, merge, type ServerSnapshot, type MeConflict } from "./sync-map";

const OUTBOX = "mirrorstar:outbox";
const CONSENTS = "mirrorstar:pending-consents";
export const CONSENT_VERSION = "2026-10";
const QUIZ_DEF_ID: Record<string, string> = { bigFive: "big-five", attachment: "attachment", nine: "nine", care: "care", shadow: "shadow", dosha: "dosha", explorer: "explorer" };

export type SyncStatus = "off" | "idle" | "syncing" | "offline" | "error";
export interface AccountState { ready: boolean; user: User | null; status: SyncStatus; lastSync: string | null; error: string | null; conflict: MeConflict | null; pending: number }
let acct: AccountState = { ready: false, user: null, status: "off", lastSync: null, error: null, conflict: null, pending: 0 };
const subs = new Set<() => void>();
const set = (patch: Partial<AccountState>) => { acct = { ...acct, ...patch }; subs.forEach((f) => f()); };
export function useAccount(): AccountState {
  return useSyncExternalStore((cb) => { subs.add(cb); return () => { subs.delete(cb); }; }, () => acct, () => acct);
}
export const getAccount = () => acct;

// ——— outbox ———
const readBox = (): Change[] => { try { return JSON.parse(localStorage.getItem(OUTBOX) || "[]"); } catch { return []; } };
const writeBox = (b: Change[]) => { try { localStorage.setItem(OUTBOX, JSON.stringify(b)); } catch { /* full */ } set({ pending: b.length }); };
const same = (a: Change, b: Change) => JSON.stringify(a) === JSON.stringify(b);
function enqueue(c: Change) {
  if (c.kind === "deleteAll") { writeBox([]); return; }
  const box = readBox().filter((x) => !same(x, c)); box.push(c); writeBox(box); scheduleFlush(0);
}

// ——— consents (recorded before the first upload of birth/quiz data) ———
export function rememberConsents(types: string[], locale: string) { try { localStorage.setItem(CONSENTS, JSON.stringify({ types, locale })); } catch {} }
async function flushConsents() {
  const c = sb(); if (!c) return;
  let pend: { types: string[]; locale: string } | null = null;
  try { pend = JSON.parse(localStorage.getItem(CONSENTS) || "null"); } catch {}
  if (!pend?.types?.length) return;
  const { error } = await c.from("consents").insert(pend.types.map((t) => ({ consent_type: t, granted: true, version: CONSENT_VERSION, locale: pend!.locale, source: "signup" })));
  if (error) throw error;
  localStorage.removeItem(CONSENTS);
}
/** Has this account agreed to store birth data + sensitive quiz answers? (latest row per type wins) */
async function hasDataConsent(): Promise<boolean> {
  const c = sb(); if (!c) return false;
  const { data } = await c.from("consents").select("consent_type,granted,created_at").in("consent_type", ["birth_data", "sensitive_quiz_data"]).order("created_at", { ascending: false });
  const latest = new Map<string, boolean>(); for (const r of data ?? []) if (!latest.has(r.consent_type)) latest.set(r.consent_type, r.granted);
  return latest.get("birth_data") === true && latest.get("sensitive_quiz_data") === true;
}

const locale = () => (typeof location !== "undefined" && location.pathname.startsWith("/mk") ? "mk" : "en");

// ——— push one change ———
async function push(ch: Change, uid: string) {
  const c = sb()!; const s = localRepo.getState();
  const ok = (r: { error: unknown }) => { if (r.error) throw r.error; };
  switch (ch.kind) {
    case "me": case "settings": {
      if (!s.me) return;
      ok(await c.from("profiles").update(meToProfile(s.me, locale(), s.settings)).eq("id", uid));
      return;
    }
    case "quiz": {
      if (!s.me) return;
      const rows = ch.keys.filter((k) => (s.me!.quiz as Record<string, unknown>)[k] != null).map((k) => ({
        quiz_id: k, scores: (s.me!.quiz as Record<string, unknown>)[k] as never, answers: (s.me!.answers?.[QUIZ_DEF_ID[k] ?? k] ?? {}) as never,
        completed_at: s.me!.quizAt?.[k] ?? new Date().toISOString(),
      }));
      if (rows.length) ok(await c.from("quiz_results").insert(rows));
      return;
    }
    case "person": {
      const p = s.people.find((x) => x.id === ch.id); if (!p) return;
      const r = await c.from("people").upsert({ ...personToRow(p), owner_id: uid }, { onConflict: "owner_id,client_id" }).select("updated_at").single();
      ok(r); localRepo.savePerson({ ...p, syncedAt: r.data!.updated_at, updatedAt: p.updatedAt });
      return;
    }
    case "deletePerson": ok(await c.from("people").delete().eq("client_id", ch.id)); return;
    case "journal": {
      const e = s.journal[ch.date]; if (!e) return;
      const r = await c.from("journal_entries").upsert({ ...journalToRow(e), user_id: uid }, { onConflict: "user_id,entry_date" }).select("updated_at").single();
      ok(r); localRepo.saveJournal({ ...e, syncedAt: r.data!.updated_at });
      return;
    }
    case "bond": {
      const b = s.bondChecks.find((x) => x.id === ch.id); if (!b || b.serverId) return;
      let personId: string | null = null;
      if (b.otherId && b.otherId !== "me") {
        const other = s.people.find((p) => p.id === b.otherId);
        if (other && !other.syncedAt) await push({ kind: "person", id: other.id }, uid);
        const q = await c.from("people").select("id").eq("client_id", b.otherId).maybeSingle(); personId = q.data?.id ?? null;
      }
      const r = await c.from("bond_checks").insert({ person_id: personId, relationship_type: b.relType ?? null, answers: b.answers as never, results: b.results as never }).select("id").single();
      ok(r); localRepo.saveBondCheck({ ...b, serverId: r.data!.id });
      return;
    }
  }
}

let flushing = false; let timer: ReturnType<typeof setTimeout> | null = null; let fails = 0;
function scheduleFlush(ms: number) { if (timer) clearTimeout(timer); timer = setTimeout(() => { void flush(); }, ms); }
export async function flush(): Promise<void> {
  const uid = acct.user?.id; if (!uid || flushing) return;
  if (typeof navigator !== "undefined" && !navigator.onLine) { set({ status: "offline" }); return; }
  if (acct.conflict) return; // wait until the user picks a profile
  flushing = true; set({ status: "syncing" });
  try {
    await flushConsents();
    let box = readBox();
    while (box.length) { await push(box[0], uid); box = readBox().filter((x) => !same(x, box[0])); writeBox(box); }
    fails = 0; set({ status: "idle", lastSync: new Date().toISOString(), error: null });
  } catch (e) {
    fails++; set({ status: "error", error: (e as { message?: string })?.message ?? String(e) });
    scheduleFlush(Math.min(60000, 1000 * 2 ** fails));
  } finally { flushing = false; }
}

// ——— pull + merge ———
export async function fetchSnapshot(uid: string): Promise<ServerSnapshot> {
  const c = sb()!;
  const since = new Date(Date.now() - 366 * 864e5).toISOString().slice(0, 10);
  const [p, q, pe, j, b] = await Promise.all([
    c.from("profiles").select("*").eq("id", uid).maybeSingle(),
    c.from("quiz_results").select("*").order("completed_at", { ascending: false }).limit(500),
    c.from("people").select("*"), c.from("journal_entries").select("*").gte("entry_date", since), c.from("bond_checks").select("*").order("created_at").limit(500),
  ]);
  for (const r of [p, q, pe, j, b]) if (r.error) throw r.error;
  return { profile: p.data, quizzes: q.data ?? [], people: pe.data ?? [], journal: j.data ?? [], bonds: b.data ?? [] };
}
function applyState(next: State) { localRepo.importAll(JSON.stringify(next)); }
export async function pullAndMerge(): Promise<void> {
  const uid = acct.user?.id; if (!uid) return;
  set({ status: "syncing" });
  try {
    await flushConsents();
    if (!(await hasDataConsent())) { set({ status: "error", error: "consent" }); return; }
    const snap = await fetchSnapshot(uid);
    const r = merge(localRepo.getState(), snap);
    applyState(r.state);
    if (r.conflict) { set({ conflict: r.conflict, status: "idle" }); return; }
    const box = readBox();
    if (r.upload.me) box.push({ kind: "me" });
    if (r.upload.quizKeys.length) box.push({ kind: "quiz", personId: "me", keys: r.upload.quizKeys });
    r.upload.people.forEach((id) => box.push({ kind: "person", id }));
    r.upload.journal.forEach((date) => box.push({ kind: "journal", date }));
    r.upload.bonds.forEach((id) => box.push({ kind: "bond", id }));
    writeBox(box);
    localStorage.setItem(`mirrorstar:synced:${uid}`, new Date().toISOString());
    await flush();
  } catch (e) { set({ status: "error", error: (e as { message?: string })?.message ?? String(e) }); }
}
/** Resolve a first-login conflict between this device's profile and the account's profile. */
export async function resolveConflict(keep: "local" | "server") {
  const cf = acct.conflict; if (!cf) return;
  const s = localRepo.getState();
  if (keep === "local") {
    applyState({ ...s, me: cf.local });
    writeBox([...readBox(), { kind: "me" }, { kind: "quiz", personId: "me", keys: Object.keys(cf.local.quiz ?? {}) }]);
  } else {
    // Keep the device's profile as a saved person so nothing is lost.
    const copy: StoredPerson = { ...cf.local, id: Math.random().toString(36).slice(2, 10), relType: "friend", syncedAt: undefined };
    applyState({ ...s, me: cf.server, people: [...s.people, copy] });
    writeBox([...readBox(), { kind: "person", id: copy.id }]);
  }
  set({ conflict: null });
  await pullAndMerge();
}

// ——— session lifecycle ———
let started = false;
export function startAccountSync() {
  const c = sb(); if (started) return; started = true;
  if (!c) { set({ ready: true, status: "off" }); return; }
  onLocalChange((ch) => { if (acct.user) enqueue(ch); });
  const onSession = (session: Session | null, event?: string) => {
    const prev = acct.user?.id; const user = session?.user ?? null;
    set({ user, ready: true, status: user ? acct.status === "off" ? "idle" : acct.status : "off", pending: readBox().length });
    if (user && user.id !== prev) void pullAndMerge();
    else if (event === "TOKEN_REFRESHED") void flush();
  };
  c.auth.getSession().then(({ data }) => onSession(data.session));
  c.auth.onAuthStateChange((event, session) => { setTimeout(() => onSession(session, event), 0); });
  window.addEventListener("online", () => void flush());
  let lastPull = Date.now();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible" || !acct.user) return;
    if (Date.now() - lastPull > 5 * 60_000) { lastPull = Date.now(); void pullAndMerge(); } else void flush();
  });
}

export async function signOut(clearLocal: boolean) {
  const c = sb(); if (!c) return;
  await c.auth.signOut();
  writeBox([]);
  if (clearLocal) localRepo.deleteAll();
  set({ user: null, status: "off", conflict: null, error: null });
}
export async function deleteAccount(): Promise<{ ok: boolean; error?: string }> {
  const c = sb(); if (!c) return { ok: false, error: "offline" };
  const { error } = await c.functions.invoke("delete-account", { method: "POST" });
  if (error) return { ok: false, error: error.message };
  await signOut(true);
  return { ok: true };
}
