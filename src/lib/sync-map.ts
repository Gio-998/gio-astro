/** Pure mapping + merge rules between the local store and Supabase rows (unit-tested, no network). */
import type { Database, Json } from "./supabase-types";
import type { StoredPerson, JournalEntry, State, BondCheckRecord } from "./store";
import type { QuizResults } from "@/engine/profile";
import type { RelType } from "@/engine/compat";

type T = Database["public"]["Tables"];
export type ProfileRow = T["profiles"]["Row"]; export type PeopleRow = T["people"]["Row"];
export type QuizRow = T["quiz_results"]["Row"]; export type JournalRow = T["journal_entries"]["Row"]; export type BondRow = T["bond_checks"]["Row"];

export const QUIZ_KEYS = ["bigFive", "attachment", "nine", "care", "shadow", "dosha", "explorer"] as const;
const REL: RelType[] = ["romantic", "friend", "family", "colleague"];
const hhmm = (t: string | null) => (t ? t.slice(0, 5) : null);
const later = (a?: string | null, b?: string | null) => (Date.parse(a ?? "") || 0) > (Date.parse(b ?? "") || 0);

export function meToProfile(me: StoredPerson, locale: string, settings: unknown): T["profiles"]["Update"] {
  return {
    display_name: me.name.slice(0, 80), birth_name: me.birthName ?? null, birth_date: me.date,
    birth_time: me.time ?? null, birth_time_unknown: me.time == null,
    birth_place: me.place?.name ?? null, birth_lat: me.place?.lat ?? null, birth_lon: me.place?.lon ?? null, birth_tz: me.place?.tz ?? null,
    utc_offset_override: me.utcOffsetOverride ?? null, locale, theme_prefs: (settings ?? {}) as Json,
  };
}
export function profileToMe(r: ProfileRow, quizzes: QuizRow[], prev?: StoredPerson | null): StoredPerson | null {
  if (!r.birth_date) return null;
  const latest = latestQuizzes(quizzes);
  return {
    ...(prev ?? {}), id: "me", name: r.display_name || prev?.name || "Me", birthName: r.birth_name ?? undefined, date: r.birth_date,
    time: r.birth_time_unknown ? null : hhmm(r.birth_time),
    place: r.birth_place && r.birth_lat != null && r.birth_lon != null && r.birth_tz ? { name: r.birth_place, lat: r.birth_lat, lon: r.birth_lon, tz: r.birth_tz } : null,
    utcOffsetOverride: r.utc_offset_override, quiz: Object.fromEntries(Object.entries(latest).map(([k, q]) => [k, q.scores])) as QuizResults,
    quizAt: Object.fromEntries(Object.entries(latest).map(([k, q]) => [k, q.completed_at])),
    answers: Object.fromEntries(Object.entries(latest).filter(([, q]) => q.answers && typeof q.answers === "object" && Object.keys(q.answers as object).length).map(([k, q]) => [k, q.answers as Record<string, number>])),
    createdAt: prev?.createdAt ?? r.created_at, updatedAt: r.updated_at, syncedAt: r.updated_at,
  };
}
/** Latest result per quiz id. */
export function latestQuizzes(rows: QuizRow[]): Record<string, QuizRow> {
  const out: Record<string, QuizRow> = {};
  for (const q of rows) if (!out[q.quiz_id] || later(q.completed_at, out[q.quiz_id].completed_at)) out[q.quiz_id] = q;
  return out;
}
export function personToRow(p: StoredPerson): T["people"]["Insert"] {
  return {
    client_id: p.id, name: p.name.slice(0, 80), birth_name: p.birthName ?? null, birth_date: p.date, birth_time: p.time ?? null, birth_time_unknown: p.time == null,
    birth_place: p.place?.name ?? null, birth_lat: p.place?.lat ?? null, birth_lon: p.place?.lon ?? null, birth_tz: p.place?.tz ?? null,
    utc_offset_override: p.utcOffsetOverride ?? null, relationship_type: p.relType ?? "friend", quiz_scores: (p.quiz ?? {}) as Json, imported_profile_code: p.importedCode ?? null,
  };
}
export function rowToPerson(r: PeopleRow, prev?: StoredPerson): StoredPerson {
  return {
    ...(prev ?? {}), id: r.client_id || r.id, name: r.name, birthName: r.birth_name ?? undefined, date: r.birth_date, time: r.birth_time_unknown ? null : hhmm(r.birth_time),
    place: r.birth_place && r.birth_lat != null && r.birth_lon != null && r.birth_tz ? { name: r.birth_place, lat: r.birth_lat, lon: r.birth_lon, tz: r.birth_tz } : null,
    utcOffsetOverride: r.utc_offset_override, relType: (REL as string[]).includes(r.relationship_type) ? (r.relationship_type as RelType) : "friend",
    quiz: (r.quiz_scores ?? {}) as QuizResults, importedCode: r.imported_profile_code ?? undefined,
    createdAt: prev?.createdAt ?? r.created_at, updatedAt: r.updated_at, syncedAt: r.updated_at,
  };
}
export const journalToRow = (e: JournalEntry): T["journal_entries"]["Insert"] => ({ entry_date: e.date, prompt: e.prompt?.slice(0, 500) ?? null, body: e.text.slice(0, 20000) });
export const rowToJournal = (r: JournalRow): JournalEntry => ({ date: r.entry_date, prompt: r.prompt ?? "", text: r.body, updatedAt: r.updated_at, syncedAt: r.updated_at });

export interface ServerSnapshot { profile: ProfileRow | null; quizzes: QuizRow[]; people: PeopleRow[]; journal: JournalRow[]; bonds: BondRow[] }
export type MeConflict = { local: StoredPerson; server: StoredPerson };
export interface MergeResult { state: State; upload: { me: boolean; quizKeys: string[]; people: string[]; journal: string[]; bonds: string[] }; conflict: MeConflict | null }

/**
 * Merge server data into local state.
 * - me: server empty → upload local; local empty → take server; same birth date → newest wins per field group, quizzes per quiz;
 *   different birth dates → conflict (the user chooses — it may be two people sharing a device).
 * - people: union by client id, newest updatedAt wins; a person that was synced before but is gone on the server was deleted elsewhere.
 * - journal: union by date; newer edit wins, ties → longer text.
 * - bond checks: union (append-only history).
 */
export function merge(local: State, srv: ServerSnapshot): MergeResult {
  const up: MergeResult["upload"] = { me: false, quizKeys: [], people: [], journal: [], bonds: [] };
  let conflict: MeConflict | null = null;
  let me = local.me;
  const serverMe = srv.profile ? profileToMe(srv.profile, srv.quizzes, local.me) : null;
  if (!serverMe && local.me) { up.me = true; up.quizKeys = Object.keys(local.me.quiz ?? {}); }
  else if (serverMe && !local.me) me = serverMe;
  else if (serverMe && local.me) {
    if (serverMe.date !== local.me.date) conflict = { local: local.me, server: serverMe };
    else {
      const localNewer = later(local.me.updatedAt, srv.profile!.updated_at);
      const base: StoredPerson = localNewer ? { ...local.me } : { ...serverMe };
      if (localNewer) up.me = true;
      const lq = (local.me.quiz ?? {}) as Record<string, unknown>, sq = (serverMe.quiz ?? {}) as Record<string, unknown>;
      const quiz: Record<string, unknown> = {}; const quizAt: Record<string, string> = {};
      for (const k of new Set([...Object.keys(lq), ...Object.keys(sq)])) {
        const lAt = local.me.quizAt?.[k], sAt = serverMe.quizAt?.[k];
        if (lq[k] != null && (sq[k] == null || later(lAt, sAt))) { quiz[k] = lq[k]; if (lAt) quizAt[k] = lAt; up.quizKeys.push(k); }
        else { quiz[k] = sq[k]; if (sAt) quizAt[k] = sAt; }
      }
      base.answers = { ...(serverMe.answers ?? {}), ...(local.me.answers ?? {}) };
      me = { ...base, quiz: quiz as QuizResults, quizAt, syncedAt: srv.profile!.updated_at };
    }
  }
  // people
  const srvPeople = new Map(srv.people.map((r) => [r.client_id || r.id, r]));
  const people: StoredPerson[] = [];
  for (const p of local.people) {
    const r = srvPeople.get(p.id);
    if (!r) { if (!p.syncedAt) { people.push(p); up.people.push(p.id); } /* else: deleted on another device */ continue; }
    if (later(p.updatedAt, r.updated_at)) { people.push(p); up.people.push(p.id); } else people.push(rowToPerson(r, p));
    srvPeople.delete(p.id);
  }
  for (const r of srvPeople.values()) people.push(rowToPerson(r));
  // journal
  const journal: Record<string, JournalEntry> = {};
  const srvJ = new Map(srv.journal.map((r) => [r.entry_date, r]));
  for (const [d, e] of Object.entries(local.journal)) {
    const r = srvJ.get(d);
    if (!r) { if (!e.syncedAt) { journal[d] = e; up.journal.push(d); } continue; }
    const localWins = later(e.updatedAt, r.updated_at) || (!e.updatedAt && e.text.length > r.body.length);
    if (localWins && e.text !== r.body) { journal[d] = e; up.journal.push(d); } else journal[d] = rowToJournal(r);
    srvJ.delete(d);
  }
  for (const r of srvJ.values()) journal[r.entry_date] = rowToJournal(r);
  // bond checks
  const known = new Set(local.bondChecks.map((b) => b.serverId).filter(Boolean));
  const bondChecks: BondCheckRecord[] = [...local.bondChecks];
  for (const b of local.bondChecks) if (!b.serverId) up.bonds.push(b.id);
  for (const r of srv.bonds) if (!known.has(r.id)) {
    const person = srv.people.find((p) => p.id === r.person_id);
    bondChecks.push({ id: r.id, serverId: r.id, personId: person?.client_id ?? null, otherId: person?.client_id ?? "", relType: (r.relationship_type as RelType) ?? undefined, answers: r.answers, results: r.results, createdAt: r.created_at });
  }
  return { state: { ...local, me, people, journal, bondChecks }, upload: up, conflict };
}
