import { describe, it, expect } from "vitest";
import { DateTime } from "luxon";
import { LOCALES } from "@/content";
import { SIGNS } from "@/engine/zodiac";
import { ARCHIVE_START, SKY_ZONE, publishedDates } from "@/engine/skyday";
import { hasPage, localizedPath, parsePath } from "@/lib/i18n-routes";
import { SITE_URL } from "@/lib/site-url";
import sitemap from "@/app/sitemap";

/** Every calendar day from `from` through `to`, counted here so the test does not lean on the code it checks. */
function days(from: string, to: string): string[] {
  const out: string[] = [];
  for (let d = DateTime.fromISO(from, { zone: SKY_ZONE }); d.toISODate()! <= to; d = d.plus({ days: 1 })) out.push(d.toISODate()!);
  return out;
}
const todayPlus3 = () => DateTime.now().setZone(SKY_ZONE).plus({ days: 3 }).toISODate()!;

describe("dated horoscope pages", () => {
  it("publishes every day from ARCHIVE_START through today plus 3", () => {
    const published = new Set(publishedDates());
    expect(days(ARCHIVE_START, todayPlus3()).filter((d) => !published.has(d))).toEqual([]);
  });
  it("is a growing archive, not a rolling window: old days stay published years later", () => {
    const later = publishedDates(new Date("2029-06-15T12:00:00Z"));
    expect(later).toEqual(days(ARCHIVE_START, "2029-06-18"));
  });
  it("never moves the first day forward, which would drop pages Google already knows", () => {
    expect(ARCHIVE_START <= "2026-09-27").toBe(true);
  });
  it("lists every sign on every published day in every language in the sitemap", () => {
    const urls = new Set(sitemap().map((e) => e.url));
    const missing = days(ARCHIVE_START, todayPlus3()).flatMap((d) => SIGNS.flatMap((s) => LOCALES.map((l) => `${SITE_URL}${localizedPath(l, `/horoscope/${s}/${d}/`)}`))).filter((u) => !urls.has(u));
    expect(missing).toEqual([]);
  });
});

describe("sitemap entries", () => {
  it("lists each URL once", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls.length).toBe(new Set(urls).size);
  });
  it("gives each URL all its language versions, and lists each of those versions too", () => {
    const entries = sitemap(); const urls = new Set(entries.map((e) => e.url));
    for (const e of entries) {
      const a = e.alternates!.languages as Record<string, string>;
      const path = parsePath(new URL(e.url).pathname)![1];
      expect(Object.keys(a).sort(), e.url).toEqual(hasPage("sr", path) ? ["de", "en", "mk", "sr", "x-default"] : ["de", "en", "mk", "x-default"]);
      expect(Object.values(a), e.url).toContain(e.url);
      expect(a["x-default"]).toBe(a.en);
      for (const u of Object.values(a)) expect(urls.has(u), u).toBe(true);
    }
  });
  it("lists a Serbian URL only where a Serbian page exists, and x-default stays English", () => {
    const entries = sitemap(); const sr = entries.filter((e) => new URL(e.url).pathname.startsWith("/sr/"));
    expect(sr.length).toBe(entries.filter((e) => new URL(e.url).pathname.startsWith("/en/")).length - 4); // everything but the four pages below
    for (const e of sr) expect(hasPage("sr", parsePath(new URL(e.url).pathname)![1]), e.url).toBe(true);
    for (const p of ["/privacy/", "/terms/", "/promise/", "/learn/"]) expect(entries.some((e) => e.url === `${SITE_URL}/sr${p}`), p).toBe(false);
    for (const e of entries) expect((e.alternates!.languages as Record<string, string>)["x-default"], e.url).toContain("/en/");
  });
  it("never dates a page later than today", () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(sitemap().filter((e) => String(e.lastModified) > today).map((e) => e.url)).toEqual([]);
  });
});
