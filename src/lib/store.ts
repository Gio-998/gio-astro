"use client";
/**
 * Local-first storage. Everything lives in the browser (localStorage) in v1 — nothing is sent anywhere.
 * The PeopleRepository interface is the seam where a Supabase-backed implementation can be added later
 * (accounts, sync across devices) without touching the UI.
 */
import { useSyncExternalStore } from "react";
import type { QuizResults } from "@/engine/profile";
import type { RelType } from "@/engine/compat";
import type { ItemTiming } from "@/engine/play/timing";
import type { AAnswer } from "@/engine/adaptive";

export interface Place { name: string; lat: number; lon: number; tz: string }
export interface StoredPerson {
  id: string; // "me" for the user
  name: string; // display name
  /** The visitor gave no name, so `name` is only a placeholder: it never reaches numerology or an account. */
  noName?: boolean;
  birthName?: string; // full birth name for numerology
  date: string;
  time: string | null;
  place: Place | null;
  utcOffsetOverride?: number | null;
  quiz: QuizResults;
  answers?: QuizAnswers;
  relType?: RelType;
  createdAt: string;
  /** Last local edit (ISO). Used for last-write-wins when syncing with an account. */
  updatedAt?: string;
  /** When each quiz result was last saved locally (ISO), keyed by QuizResults key. */
  quizAt?: Record<string, string>;
  /** Set once this record has been confirmed on the server (lets a pull detect deletions made on another device). */
  syncedAt?: string;
  /** Profile code this person was imported from (kept so it can be re-parsed later). */
  importedCode?: string;
  /** Answers from the attunement ritual (symbolic aura visual). */
  aura?: import("./aura").AuraAnswers;
}
export interface JournalEntry { date: string; prompt: string; text: string; updatedAt?: string; syncedAt?: string }
/** One finished Bond Check (history kept over time). */
export interface BondCheckRecord { id: string; personId: string | null; otherId: string; relType?: RelType; answers: unknown; results: unknown; createdAt: string; serverId?: string }
export interface Settings { theme: "personal" | "default"; readTheme?: "paper" | "night" }
/** Raw quiz answers per quiz id (so retakes can be prefilled and accounts can sync them later). */
export type QuizAnswers = Record<string, Record<string, number>>;
/**
 * Test results of someone with no birth date yet. They sit beside `me`, never inside it: `me` always has a date and every
 * astrology view relies on that. When a profile appears (saved here or pulled from an account) they fold into it.
 */
export interface GuestResults { quiz: QuizResults; quizAt?: Record<string, string>; answers?: QuizAnswers; createdAt: string; updatedAt?: string }
/** A test someone has not finished. Saved after every answer, on this device only: it is never synced or sent anywhere. */
export interface TestProgress { personId: string; testId: string; values?: Record<string, number>; seq?: AAnswer[]; timing?: Record<string, ItemTiming>; at: string }
export interface State { version: 2; me: StoredPerson | null; guest: GuestResults | null; progress: Record<string, TestProgress>; people: StoredPerson[]; journal: Record<string, JournalEntry>; bondChecks: BondCheckRecord[]; settings: Settings; updatedAt?: string }

export interface PeopleRepository {
  getState(): State;
  saveMe(p: StoredPerson): void;
  savePerson(p: StoredPerson): void;
  deletePerson(id: string): void;
  saveQuiz(personId: string, patch: Partial<QuizResults>, answers?: { quizId: string; values: Record<string, number> }): void;
  saveJournal(e: JournalEntry): void;
  saveBondCheck(b: BondCheckRecord): void;
  saveSettings(patch: Partial<Settings>): void;
  saveProgress(p: Omit<TestProgress, "at">): void;
  clearProgress(personId: string, testId: string): void;
  exportAll(): string;
  /** Replace all local data with an export produced by exportAll(). Returns false if the JSON is invalid. */
  importAll(json: string): boolean;
  deleteAll(): void;
}

// Storage key kept stable across schema versions so nobody loses data; the payload carries `version`.
const KEY = "mirrorstar:v1";
const BACKUP_KEY = "mirrorstar:backup";
const EMPTY: State = { version: 2, me: null, guest: null, progress: {}, people: [], journal: {}, bondChecks: [], settings: { theme: "personal" } };

export const progressKey = (personId: string, testId: string) => `${personId}/${testId}`;
/** Result key to the test id its raw answers are saved under. Play games use their result key for both. */
const ANSWER_ID: Record<string, string> = { bigFive: "big-five", bigFiveLong: "big-five-long", fourLetter: "four-letter" };
export const answerIdOf = (key: string) => ANSWER_ID[key] ?? key;

const stamp = (iso?: string) => Date.parse(iso ?? "") || 0;
/** Fold guest results into a profile, newest result per test. `keys` lists what moved, for the sync layer. */
export function foldGuest(me: StoredPerson, g: GuestResults): { me: StoredPerson; keys: string[] } {
  const mine = me.quiz as Record<string, unknown>; const theirs = g.quiz as Record<string, unknown>;
  const quiz: Record<string, unknown> = { ...mine }; const quizAt = { ...(me.quizAt ?? {}) }; const answers = { ...(me.answers ?? {}) }; const keys: string[] = [];
  for (const k of Object.keys(theirs)) {
    if (theirs[k] == null || (mine[k] != null && stamp(g.quizAt?.[k]) <= stamp(me.quizAt?.[k]))) continue;
    quiz[k] = k === "timing" ? { ...(mine[k] as object), ...(theirs[k] as object) } : theirs[k]; // timing holds one entry per test
    if (g.quizAt?.[k]) quizAt[k] = g.quizAt[k];
    const a = g.answers?.[answerIdOf(k)]; if (a) answers[answerIdOf(k)] = a;
    keys.push(k);
  }
  return keys.length ? { me: { ...me, quiz: quiz as QuizResults, quizAt, answers }, keys } : { me, keys };
}
/** Guest results never sit beside a profile: as soon as both exist, they fold. */
const settleGuest = (s: State): State => (s.me && s.guest ? { ...s, me: foldGuest(s.me, s.guest).me, guest: null } : s);

const fixGuest = (g: unknown): GuestResults | null => {
  const o = g as GuestResults | null | undefined;
  return o && typeof o === "object" && o.quiz && typeof o.quiz === "object" && Object.keys(o.quiz).length ? o : null;
};
const fixProgress = (raw: unknown): Record<string, TestProgress> => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const ok = (p: TestProgress) => !!p && typeof p.personId === "string" && typeof p.testId === "string" && (!!p.values || Array.isArray(p.seq));
  return Object.fromEntries(Object.entries(raw as Record<string, TestProgress>).filter(([, p]) => ok(p)));
};

/** Upgrade any older payload to the current schema (never throws). */
export function migrate(raw: unknown): State {
  const o = (raw && typeof raw === "object" ? raw : {}) as Partial<State> & { version?: number };
  const fixP = (p: StoredPerson | null | undefined): StoredPerson | null => (p && typeof p.date === "string" ? { ...p, quiz: p.quiz ?? {} } : null);
  return settleGuest({
    version: 2,
    me: fixP(o.me),
    guest: fixGuest(o.guest),
    progress: fixProgress(o.progress),
    people: Array.isArray(o.people) ? (o.people.map(fixP).filter(Boolean) as StoredPerson[]) : [],
    journal: o.journal && typeof o.journal === "object" ? o.journal : {},
    bondChecks: Array.isArray(o.bondChecks) ? o.bondChecks : [],
    settings: { ...EMPTY.settings, ...(o.settings ?? {}) },
    updatedAt: o.updatedAt,
  });
}
let cache: State | null = null;
const listeners = new Set<() => void>();

function load(): State {
  if (cache) return cache;
  let parsed: unknown = null;
  try { parsed = JSON.parse(localStorage.getItem(KEY) || "null"); } catch { parsed = null; }
  if (!parsed) { try { parsed = JSON.parse(localStorage.getItem(BACKUP_KEY) || "null"); } catch { parsed = null; } }
  cache = migrate(parsed);
  return cache;
}
export let lastStorageError: string | null = null;

/** A local change, described so a sync layer can mirror it to the server. */
export type Change =
  | { kind: "me" } | { kind: "person"; id: string } | { kind: "deletePerson"; id: string }
  | { kind: "quiz"; personId: string; keys: string[]; answers?: { quizId: string; values: Record<string, number> } }
  | { kind: "journal"; date: string } | { kind: "bond"; id: string } | { kind: "settings" } | { kind: "deleteAll" };
type ChangeHook = (c: Change) => void;
const hooks = new Set<ChangeHook>();
/** Register a listener for local writes (the account sync layer uses this). Returns an unsubscribe fn. */
export function onLocalChange(h: ChangeHook) { hooks.add(h); return () => { hooks.delete(h); }; }
const emit = (c: Change) => hooks.forEach((h) => { try { h(c); } catch { /* never break local writes */ } });
const now = () => new Date().toISOString();

function write(next: State) {
  cache = { ...settleGuest(next), version: 2, updatedAt: new Date().toISOString() };
  try {
    const prev = localStorage.getItem(KEY);
    if (prev) localStorage.setItem(BACKUP_KEY, prev); // one-step undo / corruption safety net
    localStorage.setItem(KEY, JSON.stringify(cache));
    lastStorageError = null;
  } catch (e) { lastStorageError = String(e); /* storage full or disabled — data stays in memory for this session */ }
  listeners.forEach((l) => l());
}

const dropProgress = (all: State["progress"], personId: string, testId: string) => {
  const key = progressKey(personId, testId);
  return Object.fromEntries(Object.entries(all).filter(([k]) => k !== key));
};

/** Raw local storage operations — no change events. The sync layer uses these to apply server data. */
export const localRepo: PeopleRepository = {
  getState: load,
  saveMe: (p) => write({ ...load(), me: { ...p, id: "me" } }),
  savePerson: (p) => { const s = load(); write({ ...s, people: [...s.people.filter((x) => x.id !== p.id), p] }); },
  deletePerson: (id) => { const s = load(); write({ ...s, people: s.people.filter((x) => x.id !== id), bondChecks: s.bondChecks.filter((b) => b.personId !== id && b.otherId !== id), progress: Object.fromEntries(Object.entries(s.progress).filter(([, p]) => p.personId !== id)) }); },
  saveQuiz: (id, patch, answers) => {
    const s = load(); const t = now();
    const up = <P extends StoredPerson | GuestResults>(p: P): P => ({
      ...p, quiz: { ...p.quiz, ...patch }, updatedAt: t,
      quizAt: { ...(p.quizAt ?? {}), ...Object.fromEntries(Object.keys(patch).map((k) => [k, t])) },
      answers: answers ? { ...(p.answers ?? {}), [answers.quizId]: answers.values } : p.answers,
    });
    // The result and the end of the unfinished test land in one write, so a crash cannot leave both.
    const progress = answers ? dropProgress(s.progress, id, answers.quizId) : s.progress;
    if (id !== "me") write({ ...s, progress, people: s.people.map((p) => (p.id === id ? up(p) : p)) });
    else if (s.me) write({ ...s, progress, me: up(s.me) });
    else write({ ...s, progress, guest: up(s.guest ?? { quiz: {}, createdAt: t }) });
  },
  saveProgress: (p) => { const s = load(); write({ ...s, progress: { ...s.progress, [progressKey(p.personId, p.testId)]: { ...p, at: now() } } }); },
  clearProgress: (personId, testId) => { const s = load(); write({ ...s, progress: dropProgress(s.progress, personId, testId) }); },
  saveSettings: (patch) => { const s = load(); write({ ...s, settings: { ...s.settings, ...patch } }); },
  importAll: (json) => { try { const o = JSON.parse(json); if (!o || typeof o !== "object" || !("people" in o)) return false; write(migrate(o)); return true; } catch { return false; } },
  saveJournal: (e) => { const s = load(); write({ ...s, journal: { ...s.journal, [e.date]: e } }); },
  saveBondCheck: (b) => { const s = load(); write({ ...s, bondChecks: [...s.bondChecks.filter((x) => x.id !== b.id), b] }); },
  exportAll: () => JSON.stringify(load(), null, 2),
  deleteAll: () => { try { localStorage.removeItem(KEY); localStorage.removeItem(BACKUP_KEY); } catch {} cache = { ...EMPTY }; try { localStorage.removeItem(KEY); } catch {} listeners.forEach((l) => l()); },
};

/** What the UI uses: local writes (instant) + a change event the account sync layer mirrors to the server. */
export const repo: PeopleRepository = {
  ...localRepo,
  saveMe: (p) => {
    const g = load().guest; const keys = g ? foldGuest(p, g).keys : [];
    localRepo.saveMe({ ...p, updatedAt: now() }); emit({ kind: "me" });
    if (keys.length) emit({ kind: "quiz", personId: "me", keys });
  },
  savePerson: (p) => { localRepo.savePerson({ ...p, updatedAt: now() }); emit({ kind: "person", id: p.id }); },
  deletePerson: (id) => { localRepo.deletePerson(id); emit({ kind: "deletePerson", id }); },
  saveQuiz: (id, patch, answers) => { localRepo.saveQuiz(id, patch, answers); emit(id === "me" ? { kind: "quiz", personId: id, keys: Object.keys(patch), answers } : { kind: "person", id }); },
  saveJournal: (e) => { localRepo.saveJournal({ ...e, updatedAt: now() }); emit({ kind: "journal", date: e.date }); },
  saveBondCheck: (b) => { localRepo.saveBondCheck(b); emit({ kind: "bond", id: b.id }); },
  saveSettings: (patch) => { localRepo.saveSettings(patch); emit({ kind: "settings" }); },
  importAll: (json) => { const ok = localRepo.importAll(json); if (ok) { emit({ kind: "me" }); load().people.forEach((p) => emit({ kind: "person", id: p.id })); Object.keys(load().journal).forEach((d) => emit({ kind: "journal", date: d })); } return ok; },
  deleteAll: () => { localRepo.deleteAll(); emit({ kind: "deleteAll" }); },
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { cache = null; cb(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
};
/** Swap point for accounts later: set `repo` to a Supabase-backed PeopleRepository with the same interface. */
/** Returns null during prerender / before hydration. */
export function useStore(): State | null {
  return useSyncExternalStore(subscribe, () => load(), () => null);
}
export function findPerson(s: State | null, id: string | null | undefined): StoredPerson | null {
  if (!s || !id) return null;
  return id === "me" ? s.me : s.people.find((p) => p.id === id) ?? null;
}
/** Who a test belongs to. "me" is the profile, or the guest slot before there is one: that person has an empty `date`, so use it for tests only. */
export function subjectOf(s: State | null, id: string | null | undefined = "me"): StoredPerson | null {
  if (!s) return null;
  if (id && id !== "me") return findPerson(s, id);
  if (s.me) return s.me;
  const g = s.guest;
  return { id: "me", name: "", date: "", time: null, place: null, quiz: g?.quiz ?? {}, quizAt: g?.quizAt, answers: g?.answers, createdAt: g?.createdAt ?? "" };
}
export const newId = () => Math.random().toString(36).slice(2, 10);

// ——— Profile codes: share your birth data + quiz results with someone, no server needed ———
export function encodeProfileCode(p: StoredPerson): string {
  const { id: _id, createdAt: _c, relType: _r, ...rest } = p;
  const json = JSON.stringify(rest);
  const b64 = btoa(unescape(encodeURIComponent(json))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `MS1.${b64}`;
}
export function decodeProfileCode(code: string): Omit<StoredPerson, "id" | "createdAt"> | null {
  try {
    const m = code.trim().match(/^MS1\.([A-Za-z0-9_-]+)$/);
    if (!m) return null;
    const b64 = m[1].replace(/-/g, "+").replace(/_/g, "/");
    const obj = JSON.parse(decodeURIComponent(escape(atob(b64))));
    if (typeof obj?.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(obj.date)) return null;
    return { name: String(obj.name ?? "Friend").slice(0, 60), birthName: obj.birthName, date: obj.date, time: obj.time ?? null, place: obj.place ?? null, utcOffsetOverride: obj.utcOffsetOverride ?? null, quiz: obj.quiz ?? {} };
  } catch { return null; }
}
