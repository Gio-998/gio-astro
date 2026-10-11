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
  relType?: RelType;
  createdAt: string;
}
export interface JournalEntry { date: string; prompt: string; text: string }
interface State { version: 1; me: StoredPerson | null; people: StoredPerson[]; journal: Record<string, JournalEntry> }

export interface PeopleRepository {
  getState(): State;
  saveMe(p: StoredPerson): void;
  savePerson(p: StoredPerson): void;
  deletePerson(id: string): void;
  saveQuiz(personId: string, patch: Partial<QuizResults>): void;
  saveJournal(e: JournalEntry): void;
  exportAll(): string;
  deleteAll(): void;
}

const KEY = "mirrorstar:v1";
const EMPTY: State = { version: 1, me: null, people: [], journal: {} };
let cache: State | null = null;
const listeners = new Set<() => void>();

function load(): State {
  if (cache) return cache;
  try { cache = { ...EMPTY, ...(JSON.parse(localStorage.getItem(KEY) || "null") ?? {}) }; } catch { cache = EMPTY; }
  return cache!;
}
function write(next: State) {
  cache = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage full or disabled */ }
  listeners.forEach((l) => l());
}

export const localRepo: PeopleRepository = {
  getState: load,
  saveMe: (p) => write({ ...load(), me: { ...p, id: "me" } }),
  savePerson: (p) => { const s = load(); write({ ...s, people: [...s.people.filter((x) => x.id !== p.id), p] }); },
  deletePerson: (id) => { const s = load(); write({ ...s, people: s.people.filter((x) => x.id !== id) }); },
  saveQuiz: (id, patch) => {
    const s = load();
    if (id === "me" && s.me) write({ ...s, me: { ...s.me, quiz: { ...s.me.quiz, ...patch } } });
    else write({ ...s, people: s.people.map((p) => (p.id === id ? { ...p, quiz: { ...p.quiz, ...patch } } : p)) });
  },
  saveJournal: (e) => { const s = load(); write({ ...s, journal: { ...s.journal, [e.date]: e } }); },
  exportAll: () => JSON.stringify(load(), null, 2),
  deleteAll: () => { try { localStorage.removeItem(KEY); } catch {} write({ ...EMPTY }); },
};
export const repo: PeopleRepository = localRepo;

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { cache = null; cb(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
};
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
