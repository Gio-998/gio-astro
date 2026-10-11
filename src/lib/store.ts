"use client";
/**
 * Local-first storage. Everything lives in the browser (localStorage) in v1 — nothing is sent anywhere.
 * The PeopleRepository interface is the seam where a Supabase-backed implementation can be added later
 * (accounts, sync across devices) without touching the UI.
 */
import { useSyncExternalStore } from "react";
import type { QuizResults } from "@/engine/profile";
import type { RelType } from "@/engine/compat";

export interface Place { name: string; lat: number; lon: number; tz: string }
export interface StoredPerson {
  id: string; // "me" for the user
  name: string; // display name
  birthName?: string; // full birth name for numerology
  date: string;
  time: string | null;
  place: Place | null;
  utcOffsetOverride?: number | null;
  quiz: QuizResults;
  answers?: QuizAnswers;
  relType?: RelType;
  createdAt: string;
}
export interface JournalEntry { date: string; prompt: string; text: string }
export interface Settings { theme: "personal" | "default"; readTheme?: "paper" | "night" }
/** Raw quiz answers per quiz id (so retakes can be prefilled and accounts can sync them later). */
export type QuizAnswers = Record<string, Record<string, number>>;
export interface State { version: 2; me: StoredPerson | null; people: StoredPerson[]; journal: Record<string, JournalEntry>; settings: Settings; updatedAt?: string }

export interface PeopleRepository {
  getState(): State;
  saveMe(p: StoredPerson): void;
  savePerson(p: StoredPerson): void;
  deletePerson(id: string): void;
  saveQuiz(personId: string, patch: Partial<QuizResults>, answers?: { quizId: string; values: Record<string, number> }): void;
  saveJournal(e: JournalEntry): void;
  saveSettings(patch: Partial<Settings>): void;
  exportAll(): string;
  /** Replace all local data with an export produced by exportAll(). Returns false if the JSON is invalid. */
  importAll(json: string): boolean;
  deleteAll(): void;
}

// Storage key kept stable across schema versions so nobody loses data; the payload carries `version`.
const KEY = "mirrorstar:v1";
const BACKUP_KEY = "mirrorstar:backup";
const EMPTY: State = { version: 2, me: null, people: [], journal: {}, settings: { theme: "personal" } };

/** Upgrade any older payload to the current schema (never throws). */
export function migrate(raw: unknown): State {
  const o = (raw && typeof raw === "object" ? raw : {}) as Partial<State> & { version?: number };
  const fixP = (p: StoredPerson | null | undefined): StoredPerson | null => (p && typeof p.date === "string" ? { ...p, quiz: p.quiz ?? {} } : null);
  return {
    version: 2,
    me: fixP(o.me),
    people: Array.isArray(o.people) ? (o.people.map(fixP).filter(Boolean) as StoredPerson[]) : [],
    journal: o.journal && typeof o.journal === "object" ? o.journal : {},
    settings: { ...EMPTY.settings, ...(o.settings ?? {}) },
    updatedAt: o.updatedAt,
  };
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
function write(next: State) {
  cache = { ...next, version: 2, updatedAt: new Date().toISOString() };
  try {
    const prev = localStorage.getItem(KEY);
    if (prev) localStorage.setItem(BACKUP_KEY, prev); // one-step undo / corruption safety net
    localStorage.setItem(KEY, JSON.stringify(cache));
    lastStorageError = null;
  } catch (e) { lastStorageError = String(e); /* storage full or disabled — data stays in memory for this session */ }
  listeners.forEach((l) => l());
}

export const localRepo: PeopleRepository = {
  getState: load,
  saveMe: (p) => write({ ...load(), me: { ...p, id: "me" } }),
  savePerson: (p) => { const s = load(); write({ ...s, people: [...s.people.filter((x) => x.id !== p.id), p] }); },
  deletePerson: (id) => { const s = load(); write({ ...s, people: s.people.filter((x) => x.id !== id) }); },
  saveQuiz: (id, patch, answers) => {
    const s = load();
    const up = (p: StoredPerson): StoredPerson => ({ ...p, quiz: { ...p.quiz, ...patch }, answers: answers ? { ...(p.answers ?? {}), [answers.quizId]: answers.values } : p.answers });
    if (id === "me" && s.me) write({ ...s, me: up(s.me) });
    else write({ ...s, people: s.people.map((p) => (p.id === id ? up(p) : p)) });
  },
  saveSettings: (patch) => { const s = load(); write({ ...s, settings: { ...s.settings, ...patch } }); },
  importAll: (json) => { try { const o = JSON.parse(json); if (!o || typeof o !== "object" || !("people" in o)) return false; write(migrate(o)); return true; } catch { return false; } },
  saveJournal: (e) => { const s = load(); write({ ...s, journal: { ...s.journal, [e.date]: e } }); },
  exportAll: () => JSON.stringify(load(), null, 2),
  deleteAll: () => { try { localStorage.removeItem(KEY); localStorage.removeItem(BACKUP_KEY); } catch {} cache = { ...EMPTY }; try { localStorage.removeItem(KEY); } catch {} listeners.forEach((l) => l()); },
};
export const repo: PeopleRepository = localRepo;

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
