import { describe, it, expect } from "vitest";
import { reading, HORO_LOCALES, type Reading } from "@/lib/horoscope";
import { addDays } from "@/engine/skyday";
import { SIGNS } from "@/engine/zodiac";

function rng(seed: number) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32; }; }
const split = (t: string) => t.split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter((x) => x.length > 12);
/** Interpretive prose a reader compares day to day (the factual sky list and week ahead are excluded). */
export const prose = (r: Reading) => [r.headline, r.overview, ...r.love, r.single, r.couple, ...r.work, ...r.money, ...r.well, r.body, r.friends, r.prompt, ...r.why, r.best, r.avoid];
/** First sentence of each section, plus the headline. */
export const leads = (r: Reading) => ({ headline: r.headline, overview: r.overview, love: r.love[0], single: r.single, couple: r.couple, work: r.work[0], money: r.money[0], well: r.well[0], friends: r.friends, why: r.why[0] } as Record<string, string>);
export function overlap(a: Reading, b: Reading) { const A = new Set(prose(a).flatMap(split)); return [...new Set(prose(b).flatMap(split))].filter((s) => A.has(s)); }

describe("daily horoscope variety", () => {
  it("adjacent days share at most 1 sentence and no section lead repeats within 7 days", async () => {
    const r = rng(1410);
    for (const sign of SIGNS) for (const lang of HORO_LOCALES) {
      await new Promise((go) => setImmediate(go)); // a long loop with no pause starves vitest's worker heartbeat, which fails the whole run after 60 seconds
      const t = Date.UTC(1990, 0, 1) + Math.floor(r() * 60 * 365 * 864e5);
      const start = new Date(t).toISOString().slice(0, 10);
      const days = Array.from({ length: 60 }, (_, i) => reading(lang, sign, addDays(start, i)));
      for (let i = 1; i < days.length; i++) {
        const o = overlap(days[i - 1], days[i]);
        expect(o.length, `${lang} ${sign} ${days[i].iso}: ${o.join(" | ")}`).toBeLessThanOrEqual(1);
        for (let k = Math.max(0, i - 6); k < i; k++) for (const [sec, txt] of Object.entries(leads(days[i]))) {
          expect(split(txt)[0], `${lang} ${sign} ${sec} ${days[k].iso} vs ${days[i].iso}`).not.toBe(split(leads(days[k])[sec])[0]);
        }
      }
    }
  }, 300_000);
  it("Scorpio 2026-10-13 and 2026-10-14 read clearly differently", () => {
    for (const lang of HORO_LOCALES) expect(overlap(reading(lang, "scorpio", "2026-10-13"), reading(lang, "scorpio", "2026-10-14")).length).toBeLessThanOrEqual(1);
  });
});
