"use client";
/** Friend invites: personal link per user, birth snapshots exchanged through RLS-protected RPCs. */
import { sb } from "./supabase";
import { repo, type StoredPerson, type Place } from "./store";

export interface BirthSnap { name: string; birthName?: string; date: string; time: string | null; place: Place | null; utcOffsetOverride?: number | null }
export interface InviteAccept { id: string; friend_name: string; friend_birth: BirthSnap; created_at: string }

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://horoscop.si").replace(/\/$/, "");
type Rpc = { rpc: (fn: string, args?: Record<string, unknown>) => PromiseLike<{ data: unknown; error: { message: string } | null }> };
const rpc = (fn: string, args?: Record<string, unknown>) => { const c = sb() as unknown as Rpc | null; return c ? c.rpc(fn, args) : Promise.resolve({ data: null, error: { message: "offline" } }); };

export const snapOf = (p: StoredPerson): BirthSnap => ({ name: p.name.slice(0, 80), birthName: p.birthName, date: p.date, time: p.time, place: p.place, utcOffsetOverride: p.utcOffsetOverride ?? null });
const validSnap = (x: unknown): x is BirthSnap => !!x && typeof x === "object" && typeof (x as BirthSnap).date === "string" && /^\d{4}-\d{2}-\d{2}$/.test((x as BirthSnap).date);
export const personFromSnap = (id: string, s: BirthSnap, name?: string): StoredPerson => ({ id, name: (name || s.name || "?").slice(0, 80), birthName: s.birthName, date: s.date, time: s.time ?? null, place: s.place ?? null, utcOffsetOverride: s.utcOffsetOverride ?? null, quiz: {}, relType: "friend", createdAt: new Date().toISOString() });

export const inviteUrl = (code: string, lang: string) => `${SITE}/${lang}/invite/${code}`;
/** /en/invite/abcd1234 (rewritten to the static page) or /en/invite/?c=abcd1234 */
export function codeFromLocation(): string | null {
  if (typeof window === "undefined") return null;
  const q = new URLSearchParams(window.location.search).get("c");
  const m = window.location.pathname.match(/\/invite\/([a-z0-9]{8})\/?$/i);
  const c = (q || m?.[1] || "").toLowerCase();
  return /^[a-z0-9]{8}$/.test(c) ? c : null;
}

export async function ensureInvite(me: StoredPerson): Promise<string | null> {
  const { data, error } = await rpc("invite_upsert", { p_name: me.name.slice(0, 80) || "Friend", p_birth: snapOf(me) });
  return error ? null : (data as string);
}
export const markShared = () => rpc("invite_mark_shared").then(() => undefined);

export async function lookupInvite(code: string): Promise<{ name: string; birth: BirthSnap } | null> {
  const { data, error } = await rpc("invite_lookup", { p_code: code });
  const d = data as { name: string; birth: unknown } | null;
  return !error && d && validSnap(d.birth) ? { name: d.name, birth: d.birth } : null;
}
export async function acceptInvite(code: string, me: StoredPerson): Promise<{ name: string; birth: BirthSnap; self?: boolean } | null> {
  const { data, error } = await rpc("invite_accept", { p_code: code, p_name: me.name.slice(0, 80) || "Friend", p_birth: snapOf(me) });
  const d = data as { name: string; birth: unknown; self?: boolean } | null;
  return !error && d && validSnap(d.birth) ? { name: d.name, birth: d.birth, self: d.self } : null;
}

/** People who joined through my link (RLS: only the inviter reads these). */
export async function myAccepts(code: string): Promise<InviteAccept[]> {
  const c = sb(); if (!c) return [];
  const { data } = await (c as unknown as { from: (t: string) => { select: (s: string) => { eq: (k: string, v: string) => { order: (k: string, o: { ascending: boolean }) => { limit: (n: number) => PromiseLike<{ data: unknown }> } } } } })
    .from("friend_invite_accepts").select("id,friend_name,friend_birth,created_at").eq("code", code).order("created_at", { ascending: false }).limit(50);
  return ((data as InviteAccept[] | null) ?? []).filter((a) => validSnap(a.friend_birth));
}

export const inviterPersonId = (code: string) => `inv-${code}`;
export const friendPersonId = (acceptId: string) => `invf-${acceptId.replace(/-/g, "").slice(0, 12)}`;

/** Add friends who joined through my link to my people (once), so the match is one tap away. */
export function importAccepts(list: InviteAccept[], people: StoredPerson[]): number {
  const K = "horoscop:invite-imported"; let seen: string[] = [];
  try { seen = JSON.parse(localStorage.getItem(K) || "[]"); } catch { /* storage unavailable */ }
  let n = 0;
  for (const a of list) {
    const id = friendPersonId(a.id);
    if (seen.includes(id) || people.some((p) => p.id === id)) continue;
    repo.savePerson(personFromSnap(id, a.friend_birth, a.friend_name)); seen.push(id); n++;
  }
  try { localStorage.setItem(K, JSON.stringify(seen.slice(-200))); } catch { /* storage unavailable */ }
  return n;
}
