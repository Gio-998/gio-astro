import { describe, it, expect, vi, afterEach } from "vitest";
import * as Astronomy from "astronomy-engine";
import { longitude } from "@/engine/astro";
import { addDays, dayBounds, skyDay } from "@/engine/skyday";
import { signFromLongitude, type Sign } from "@/engine/zodiac";
import { mercuryNext, mercuryNow, mercuryYear, moment, monthDays, monthLunations, QUARTER_ANGLE, QUARTERS, sunIngress, yearLunations, type Quarter } from "@/engine/sky-calendar";
import { MOON_MONTHS, MOON_YEARS, moonCalendar, windowLunations } from "@/lib/sections/moon-calendar";
import { MERCURY_YEARS, mercuryRetrograde } from "@/lib/sections/mercury-retrograde";
import { MERCURY_RETROGRADE_DATE, MOON_CALENDAR_DATE } from "@/content/calendars";

/** Every published date is recomputed here a different way: by brute scan of raw longitudes, and through skyDay(), the daily horoscope's own path. */
const HOUR = 36e5; const MIN = 6e4;
const norm = (x: number) => ((x % 360) + 360) % 360;
const wrap = (x: number) => ((x + 540) % 360) - 180;
const near = (a: number, b: number) => Math.abs(wrap(a - b));
const at = (s: string) => Date.parse(s);
const lon = (b: "moon" | "sun" | "mercury", t: number) => longitude(b, new Date(t));
const elong = (t: number) => norm(lon("moon", t) - lon("sun", t));

/** Brute force: walk the Moon's elongation hour by hour and bisect each crossing of a quarter angle. */
function scanQuarters(from: number, to: number): { t: number; q: Quarter }[] {
  const out: { t: number; q: Quarter }[] = [];
  for (let t = from; t < to; t += HOUR) for (const q of QUARTERS) {
    const g = (x: number) => wrap(elong(x) - QUARTER_ANGLE[q]);
    if (!(g(t) < 0 && g(t + HOUR) >= 0)) continue;
    let lo = t, hi = t + HOUR; for (let k = 0; k < 20; k++) { const m = (lo + hi) / 2; if (g(m) < 0) lo = m; else hi = m; }
    out.push({ t: hi, q });
  }
  return out;
}
/** Brute force: walk Mercury hour by hour and note each change of direction. */
function scanStations(from: number, to: number): { t: number; retro: boolean }[] {
  const out: { t: number; retro: boolean }[] = []; let prev = wrap(lon("mercury", from + HOUR) - lon("mercury", from));
  for (let t = from + HOUR; t < to; t += HOUR) { const v = wrap(lon("mercury", t + HOUR) - lon("mercury", t)); if (Math.sign(v) !== Math.sign(prev)) out.push({ t, retro: v < 0 }); prev = v; }
  return out;
}

describe("moon calendar data", () => {
  it("every month from November 2026 through December 2027 has a page", () => {
    expect(MOON_MONTHS.length).toBe(14); expect(MOON_MONTHS[0]).toBe("2026-11"); expect(MOON_MONTHS.at(-1)).toBe("2027-12");
    expect(moonCalendar.paths()[0]).toBe("/moon-calendar/");
    expect(moonCalendar.paths().length).toBe(1 + MOON_YEARS.length + MOON_MONTHS.length);
  });
  it("a brute scan of raw longitudes finds the same quarters, within two minutes", () => {
    const L = windowLunations(); const from = dayBounds("2026-11-01").start.getTime(), to = dayBounds("2028-01-01").start.getTime();
    const found = scanQuarters(from, to);
    expect(found.length).toBe(L.length);
    found.forEach((f, i) => { expect(L[i].quarter).toBe(f.q); expect(Math.abs(at(L[i].at) - f.t)).toBeLessThan(2 * MIN); });
  }, 120000);
  it("each lunation has the sign, day and time the daily horoscope engine reports", () => {
    for (const l of windowLunations()) {
      expect(near(elong(at(l.at)), QUARTER_ANGLE[l.quarter])).toBeLessThan(0.05);
      const e = skyDay(l.iso, "aries").events.find((x) => x.kind === "quarter");
      expect(e, `${l.iso} ${l.quarter}`).toMatchObject({ quarter: l.quarter, time: l.time, sign: l.sign });
      expect(moment(new Date(at(l.at))).iso).toBe(l.iso);
    }
  });
  it("every month has at least one new and one full moon, four quarters in order", () => {
    for (const ym of MOON_MONTHS) { const L = monthLunations(ym); expect(L.some((l) => l.quarter === "new")).toBe(true); expect(L.some((l) => l.quarter === "full")).toBe(true); expect(L.every((l) => l.iso.startsWith(ym))).toBe(true); expect(L.length).toBeGreaterThanOrEqual(4); }
  });
  it("the day table matches skyDay for every day on every month page", () => {
    for (const ym of MOON_MONTHS) for (const d of monthDays(ym)) {
      const s = skyDay(d.iso, "aries").moon;
      expect(d.noon, d.iso).toBe(s.sign);
      expect(d.illumination).toBe(s.illumination);
      expect(d.moves?.to).toBe(s.moves?.to); expect(d.moves?.time).toBe(s.moves?.time);
      expect(d.sign).toBe(signFromLongitude(lon("moon", dayBounds(d.iso).start.getTime())));
    }
  }, 120000);
  it("the Sun changes sign once a month, at the moment its longitude crosses a 30 degree line", () => {
    for (const ym of MOON_MONTHS) { const s = sunIngress(ym); expect(s.iso.startsWith(ym)).toBe(true); expect(near(lon("sun", at(s.at)), Math.round(lon("sun", at(s.at)) / 30) * 30)).toBeLessThan(0.01); expect(signFromLongitude(lon("sun", at(s.at) + MIN))).toBe(s.to); }
  });
  it("eclipses sit on new and full moons close to the Moon's node", () => {
    for (const y of MOON_YEARS) for (const l of yearLunations(y).filter((x) => x.eclipse)) {
      expect(l.quarter === "new" ? l.eclipse!.startsWith("solar") : l.quarter === "full" && l.eclipse!.startsWith("lunar")).toBe(true);
      expect(Math.abs(Astronomy.EclipticGeoMoon(Astronomy.MakeTime(new Date(l.at))).lat)).toBeLessThan(1.8);
    }
  });
  it("month pages show the same dates, times and signs as the year tables", () => {
    for (const y of MOON_YEARS) { const all = yearLunations(y); for (const ym of MOON_MONTHS.filter((k) => k.startsWith(`${y}-`))) for (const l of monthLunations(ym)) expect(all.find((a) => a.at === l.at)).toMatchObject({ quarter: l.quarter, sign: l.sign }); }
  });
  it("the rendered phase table carries the recomputed times", () => {
    for (const ym of MOON_MONTHS) {
      const m = moonCalendar.model("de", `/moon-calendar/${ym}/`)!; const rows = m.blocks.find((b) => b.id === "phases")!.table!.rows;
      const L = monthLunations(ym); expect(rows.length).toBe(L.length);
      L.forEach((l, i) => { const e = skyDay(l.iso, "aries").events.find((x) => x.kind === "quarter"); expect(e?.kind === "quarter" ? e.time : "").toBe(rows[i][2]); });
    }
  });
});

describe("Mercury retrograde data", () => {
  const all = [...new Map(MERCURY_YEARS.flatMap(mercuryYear).map((p) => [p.retro.at, p])).values()];
  it("three retrograde periods in each year, as the copy says", () => { for (const y of MERCURY_YEARS) expect(mercuryYear(y).length).toBe(3); });
  it("a brute hourly scan finds the same stations", () => {
    const from = dayBounds("2026-01-01").start.getTime(), to = dayBounds("2028-01-01").start.getTime(); const found = scanStations(from, to);
    expect(found.length).toBe(all.length * 2);
    all.forEach((p, i) => { expect(found[i * 2].retro).toBe(true); expect(found[i * 2 + 1].retro).toBe(false); expect(Math.abs(found[i * 2].t - at(p.retro.at))).toBeLessThan(2 * HOUR); expect(Math.abs(found[i * 2 + 1].t - at(p.direct.at))).toBeLessThan(2 * HOUR); });
  });
  it("skyDay agrees on the station days and on every day in between", () => {
    for (const p of all) {
      const on = (d: string) => skyDay(d, "aries").retro.includes("mercury");
      expect(on(addDays(p.retro.iso, -1))).toBe(false); expect(on(p.retro.iso)).toBe(true);
      expect(on(addDays(p.direct.iso, -1))).toBe(true); expect(on(p.direct.iso)).toBe(false);
      for (let d = p.retro.iso; d < p.direct.iso; d = addDays(d, 1)) expect(on(d), d).toBe(true);
      expect(skyDay(p.retro.iso, "aries").signs.mercury).toBe(p.retro.sign);
    }
  });
  it("shadow dates are the moments Mercury reaches the station degrees", () => {
    for (const p of all) {
      expect(near(lon("mercury", at(p.shadowStart.at)), lon("mercury", at(p.direct.at)))).toBeLessThan(0.01);
      expect(near(lon("mercury", at(p.shadowEnd.at)), lon("mercury", at(p.retro.at)))).toBeLessThan(0.01);
      expect(at(p.shadowStart.at)).toBeLessThan(at(p.retro.at)); expect(at(p.direct.at)).toBeLessThan(at(p.shadowEnd.at));
      expect(wrap(lon("mercury", at(p.shadowStart.at) - HOUR) - lon("mercury", at(p.direct.at)))).toBeLessThan(0);
      expect(wrap(lon("mercury", at(p.shadowEnd.at) + HOUR) - lon("mercury", at(p.retro.at)))).toBeGreaterThan(0);
      const days = (at(p.direct.at) - at(p.retro.at)) / 864e5; expect(days).toBeGreaterThan(18); expect(days).toBeLessThan(26);
    }
  });
  it("signs and sign changes match a six hourly walk through the period", () => {
    for (const p of all) {
      const seen: Sign[] = []; for (let t = at(p.retro.at); t <= at(p.direct.at); t += 6 * HOUR) { const s = signFromLongitude(lon("mercury", t)); if (seen.at(-1) !== s) seen.push(s); }
      expect(p.signs).toEqual(seen);
      for (const g of p.ingresses) { expect(signFromLongitude(lon("mercury", at(g.at) + MIN))).toBe(g.to); expect(signFromLongitude(lon("mercury", at(g.at) - MIN))).not.toBe(g.to); }
    }
  });
  it("the state flips at each boundary", () => {
    for (const p of all) {
      const s = (t: number) => mercuryNow(new Date(t)).state;
      expect(s(at(p.shadowStart.at) - MIN)).toBe("clear"); expect(s(at(p.shadowStart.at) + MIN)).toBe("pre-shadow");
      expect(s(at(p.retro.at) - MIN)).toBe("pre-shadow"); expect(s(at(p.retro.at) + MIN)).toBe("retrograde");
      expect(s(at(p.direct.at) - MIN)).toBe("retrograde"); expect(s(at(p.direct.at) + MIN)).toBe("post-shadow");
      expect(s(at(p.shadowEnd.at) - MIN)).toBe("post-shadow"); expect(s(at(p.shadowEnd.at) + MIN)).toBe("clear");
    }
  }, 60000);
  it("works for any build date, not only the published years", () => {
    for (const d of ["2029-03-01", "2031-07-15", "2034-12-31"]) { const now = new Date(`${d}T12:00:00Z`); expect(mercuryNow(now).period).toBeTruthy(); expect(mercuryNext(now, 4).length).toBe(4); }
  }, 30000);
});

describe("modified dates are real", () => {
  afterEach(() => { vi.useRealTimers(); });
  it("month and year pages never follow the build date", () => {
    for (const day of ["2026-12-05T10:00:00Z", "2027-06-20T10:00:00Z"]) {
      vi.useFakeTimers(); vi.setSystemTime(new Date(day));
      for (const p of moonCalendar.paths().slice(1)) { expect(moonCalendar.modified(p)).toBe(MOON_CALENDAR_DATE); expect(moonCalendar.model("en", p)!.modified).toBe(MOON_CALENDAR_DATE); }
      for (const p of mercuryRetrograde.paths().slice(1)) expect(mercuryRetrograde.modified(p)).toBe(MERCURY_RETROGRADE_DATE);
      vi.useRealTimers();
    }
  }, 30000);
  it("the moon hub shows today, so it is dated today", () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date("2027-03-10T10:00:00Z"));
    expect(moonCalendar.modified("/moon-calendar/")).toBe("2027-03-10");
    expect(moonCalendar.model("de", "/moon-calendar/")!.modified).toBe("2027-03-10");
  });
  it("the hub names an exact quarter only on its own day", () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date("2026-10-31T10:00:00Z"));
    expect(moonCalendar.model("en", "/moon-calendar/")!.lead).toContain("waning gibbous");
    vi.setSystemTime(new Date("2026-11-09T10:00:00Z"));
    expect(moonCalendar.model("en", "/moon-calendar/")!.lead).toContain("new Moon");
  });
  it("the Mercury hub is dated the day its answer last changed", () => {
    const p = mercuryYear(2027)[1]; vi.useFakeTimers(); vi.setSystemTime(new Date(at(p.retro.at) + 3 * 864e5));
    expect(mercuryRetrograde.modified("/mercury-retrograde/")).toBe(p.retro.iso);
    vi.setSystemTime(new Date(at(p.retro.at) + 4 * 864e5));
    expect(mercuryRetrograde.modified("/mercury-retrograde/")).toBe(p.retro.iso);
  });
  it("the Mercury hub answers from the current date", () => {
    const p = mercuryYear(2027)[0]; vi.useFakeTimers();
    vi.setSystemTime(new Date(at(p.retro.at) + 864e5)); expect(mercuryRetrograde.model("en", "/mercury-retrograde/")!.lead.startsWith("Yes.")).toBe(true);
    vi.setSystemTime(new Date(at(p.shadowEnd.at) + 864e5)); expect(mercuryRetrograde.model("en", "/mercury-retrograde/")!.lead.startsWith("No.")).toBe(true);
    vi.setSystemTime(new Date(at(p.shadowStart.at) + 864e5)); expect(mercuryRetrograde.model("en", "/mercury-retrograde/")!.lead.startsWith("Not yet.")).toBe(true);
  }, 30000);
});
