/**
 * "Your day": a short, warm, story-style daily reading, built deterministically from
 * today's transits to the natal chart, the Moon's phase and sign, the personal day number and personality results.
 * No AI calls: every sentence comes from the pre-written library in content/<locale>/extra/day.ts.
 * Seeding: date + person. Rotating pools (motto, practice, question, close, quiet) walk through a per-person
 * shuffle one step per day, so none of them repeats until the whole pool has been used (100/75/75 days).
 */
import type { Content } from "@/content";
import type { Profile } from "@/engine/profile";
import { hash, moonPhase, transitsFor, type Transit, type MoonPhase } from "@/engine/daily";
import { reduce, personalYear } from "@/engine/numerology";
import { SIGNS, SIGN_ELEMENT, type Sign } from "@/engine/zodiac";
import { longitude, findAspect, type Planet } from "@/engine/astro";

type L = Content["day"];
export interface DayStory {
  date: string; paragraphs: string[]; motto: string; practice: string; question: string; words: number;
  phase: MoonPhase; moonSign: Sign; personalDay: number; top: Transit | null;
}

export const isoLocal = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const dayIndex = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 86400000); };
const countWords = (s: string) => (s.match(/\S+/g) ?? []).length;

/** Deterministic shuffle (mulberry32 + Fisher-Yates). */
export function shuffled(n: number, seed: number): number[] {
  let a = seed >>> 0;
  const rnd = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const p = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  return p;
}
const permCache = new Map<string, number[]>();
/** Item of a rotating pool for a given day: a different one every day until the pool is used up. */
export function rotate<T>(pool: T[], key: string, day: number): T {
  const ck = `${key}|${pool.length}`;
  let p = permCache.get(ck); if (!p) { p = shuffled(pool.length, hash(key)); permCache.set(ck, p); }
  return pool[p[((day % pool.length) + pool.length) % pool.length]];
}
const pick = <T,>(pool: T[], key: string): T => pool[hash(key) % pool.length];
const fill = (s: string, v: Record<string, string>) => s.replace(/\{(\w+)\}/g, (m, k) => v[k] ?? m);

/** Personality keys the story can draw on (Big Five extremes, else four-letter letters, else Sun element). */
export function personaKeys(p: Profile): string[] {
  const b = p.quiz.bigFive; const out: string[] = [];
  if (b) {
    if (b.E >= 65) out.push("E_hi"); if (b.E <= 35) out.push("E_lo");
    if (b.N >= 65) out.push("N_hi"); if (b.N <= 35) out.push("N_lo");
    if (b.O >= 65) out.push("O_hi"); if (b.O <= 35) out.push("O_lo");
    if (b.A >= 65) out.push("A_hi");
    if (b.C >= 65) out.push("C_hi"); if (b.C <= 35) out.push("C_lo");
  } else if (p.fourLetter) {
    const c = p.fourLetter.code;
    out.push(c[0] === "E" ? "E_hi" : "E_lo", c[1] === "N" ? "O_hi" : "O_lo");
    if (c[2] === "F") out.push("A_hi");
    out.push(c[3] === "J" ? "C_hi" : "C_lo");
  }
  out.push(SIGN_ELEMENT[p.sun]);
  return out;
}

export function personalDayNumber(birth: string, d: Date): number {
  return reduce(personalYear(birth, d.getFullYear()) + reduce(d.getMonth() + 1) + reduce(d.getDate()), false);
}
const houseFrom = (base: Sign, s: Sign) => ((SIGNS.indexOf(s) - SIGNS.indexOf(base) + 12) % 12) + 1;

export interface Names { point: (k: string) => string; planet: (k: string) => string; sign: (s: Sign) => string; weekday: (d: Date) => string }

export function dayStory(profile: Profile, now: Date, L: L, N: Names): DayStory {
  const iso = isoLocal(now); const di = dayIndex(iso);
  const who = `${profile.input.date}|${profile.input.time ?? ""}|${profile.input.name}`;
  const k = (s: string) => `${who}|${iso}|${s}`;
  const noon = new Date(now); noon.setHours(12, 0, 0, 0);
  const m = moonPhase(noon);
  const transits = transitsFor(profile, noon);
  const top = transits.find((t) => t.transiting !== "moon") ?? transits[0] ?? null;
  const pd = personalDayNumber(profile.input.date, now);
  const base: Sign = profile.rising ?? profile.sun;
  const v = { weekday: N.weekday(now), sign: N.sign(m.moonSign) };

  const paragraphs: string[] = [];
  paragraphs.push(`${fill(pick(L.open[m.phase], k("open")), v)} ${pick(L.moonEl[SIGN_ELEMENT[m.moonSign]], k("moonEl"))}`);
  if (top) {
    const point = N.point(top.natal);
    const beat = [fill(pick(L.planet[top.transiting], k("planet")), { ...v, point }), pick(L.aspect[top.type], k("aspect")), pick(L.natal[top.natal], k("natal"))];
    const second = transits.find((t) => t !== top && t.natal !== top.natal);
    if (second) beat.push(fill(pick(L.planet[second.transiting], k("planet2")), { ...v, point: N.point(second.natal) }));
    paragraphs.push(beat.join(" "));
  } else paragraphs.push(`${rotate(L.quiet, `${who}|quiet`, di)} ${rotate(L.quiet, `${who}|quiet`, di + 4)}`);
  const moonPara = [fill(pick(L.house[houseFrom(base, m.moonSign)], k("house")), v)];
  const keys = personaKeys(profile);
  const k1 = keys[di % keys.length], k2 = keys[(di + 1) % keys.length];
  const pool1 = L.persona[k1]; const i1 = hash(k("persona")) % pool1.length;
  moonPara.push(pool1[i1]);
  // A second personality beat: another trait, or another line of the same one.
  moonPara.push(k2 !== k1 ? pick(L.persona[k2], k("persona2")) : pool1[(i1 + 1) % pool1.length]);
  paragraphs.push(moonPara.join(" "));
  paragraphs.push([pick(L.number[pd], k("number")), rotate(L.close, `${who}|close`, di)].join(" "));

  const motto = rotate(L.motto, `${who}|motto`, di);
  const practice = rotate(L.practice, `${who}|practice`, di);
  const question = rotate(L.question, `${who}|question`, di);
  // Short days (few transits) get one more line on the Moon's element so every story stays in the 150-300 word range.
  const count = () => paragraphs.reduce((s, p) => s + countWords(p), 0) + countWords(motto) + countWords(practice) + countWords(question);
  if (count() < 170) {
    const pool = L.moonEl[SIGN_ELEMENT[m.moonSign]]; const used = paragraphs[0];
    const extra = pool.find((x, i) => !used.includes(x) && i === (hash(k("extra")) % pool.length)) ?? pool.find((x) => !used.includes(x))!;
    paragraphs[2] = `${paragraphs[2]} ${extra}`;
  }
  const words = paragraphs.reduce((s, p) => s + countWords(p), 0) + countWords(motto) + countWords(practice) + countWords(question);
  return { date: iso, paragraphs, motto, practice, question, words, phase: m.phase, moonSign: m.moonSign, personalDay: pd, top };
}

const HARMONY: Record<string, number> = { trine: 1, sextile: 1, conjunction: 0.4, square: -1, opposition: -0.7 };
const BENEFIC = new Set(["venus", "jupiter", "sun"]);
export interface WeekDay { date: string; d: Date; phase: MoonPhase; moonSign: Sign; personalDay: number; top: Transit | null; score: number; tone: "easy" | "mixed" | "demanding" }
export interface Week { days: WeekDay[]; best: number; gentle: number; thread: { planet: Planet; point: string } | null }

export function weekAhead(profile: Profile, start: Date): Week {
  const days: WeekDay[] = [];
  const threads = new Map<string, number>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(start); d.setDate(d.getDate() + i); d.setHours(12, 0, 0, 0);
    const ts = transitsFor(profile, d); const m = moonPhase(d);
    let score = 0;
    for (const t of ts) {
      score += (HARMONY[t.type] + (BENEFIC.has(t.transiting) && t.type === "conjunction" ? 0.6 : 0)) * t.score;
      if (t.transiting !== "moon" && t.transiting !== "sun") threads.set(`${t.transiting}|${t.natal}`, (threads.get(`${t.transiting}|${t.natal}`) ?? 0) + 1);
    }
    const top = ts.find((t) => t.transiting !== "moon") ?? ts[0] ?? null;
    days.push({ date: isoLocal(d), d, phase: m.phase, moonSign: m.moonSign, personalDay: personalDayNumber(profile.input.date, d), top, score, tone: score > 1 ? "easy" : score < -1 ? "demanding" : "mixed" });
  }
  const idx = days.map((_, i) => i);
  const best = idx.reduce((a, b) => (days[b].score > days[a].score ? b : a), 0);
  const gentle = idx.reduce((a, b) => (days[b].score < days[a].score ? b : a), 0);
  const th = [...threads.entries()].sort((a, b) => b[1] - a[1])[0];
  return { days, best, gentle: gentle === best ? -1 : gentle, thread: th && th[1] >= 3 ? { planet: th[0].split("|")[0] as Planet, point: th[0].split("|")[1] } : null };
}

/** Public daily reading for a Sun sign (solar houses: the sign is house 1). Same for everyone of that sign on that date. */
export interface SignDay { date: string; paragraphs: string[]; motto: string; practice: string; question: string; phase: MoonPhase; moonSign: Sign }
export function signDay(sign: Sign, now: Date, L: L, N: Names): SignDay {
  const iso = isoLocal(now); const di = dayIndex(iso); const who = `sign|${sign}`; const k = (s: string) => `${who}|${iso}|${s}`;
  const noon = new Date(now); noon.setHours(12, 0, 0, 0);
  const m = moonPhase(noon); const v = { weekday: N.weekday(now), sign: N.sign(m.moonSign) };
  const paragraphs = [fill(pick(L.open[m.phase], k("open")), v), fill(pick(L.house[houseFrom(sign, m.moonSign)], k("house")), v)];
  // A fast planet making an aspect to the middle of the sign (15°) adds a second beat.
  const mid = SIGNS.indexOf(sign) * 30 + 15;
  const fast: Planet[] = ["mars", "venus", "mercury", "sun", "jupiter", "saturn"];
  for (const p of fast) {
    const a = findAspect(longitude(p, noon), mid, p, "sun");
    if (a && a.orb <= 4) { paragraphs.push(`${fill(pick(L.planet[p], k("planet")), { ...v, point: L.ui.signPoint(N.sign(sign)) })} ${pick(L.aspect[a.type], k("aspect"))}`); break; }
  }
  paragraphs.push(pick(L.persona[SIGN_ELEMENT[sign]], k("persona")));
  return { date: iso, paragraphs, motto: rotate(L.motto, `${who}|motto`, di), practice: rotate(L.practice, `${who}|practice`, di), question: rotate(L.question, `${who}|question`, di), phase: m.phase, moonSign: m.moonSign };
}

