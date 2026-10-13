import { describe, it, expect } from "vitest";
import { numPaths, numModel, ANGEL } from "@/lib/numerology";
import { numContent } from "@/content/numerology";
import { localizedPath, parsePath, ROUTE_LOCALES } from "@/lib/i18n-routes";
import { isPublicRoute } from "@/components/auth/Beta";

const split = (t: string) => t.split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter((x) => x.length > 12);
const text = (lang: string, p: string) => { const m = numModel(lang, p)!; return [m.lead, ...m.blocks.flatMap((b) => [...(b.paras ?? []), ...(b.list ?? []), b.quote ?? ""])]; };

describe("numerology section", () => {
  for (const l of ROUTE_LOCALES) {
    it(`${l}: every page builds, round-trips its URL and is public`, () => {
      for (const p of numPaths()) {
        const m = numModel(l, p); expect(m, `${l} ${p}`).toBeTruthy();
        const u = localizedPath(l, p); expect(parsePath(u)).toEqual([l, p]); expect(isPublicRoute(u), u).toBe(true);
        expect(m!.title.length).toBeGreaterThan(10); expect(m!.description.length).toBeGreaterThan(40);
        expect(m!.crumbs.length).toBeGreaterThanOrEqual(2);
      }
    });
    it(`${l}: angel pages have their own text (adjacent pages share at most 1 sentence)`, () => {
      const pages = ANGEL.map((a) => new Set(text(l, `/numerology/angel-numbers/${a}/`).flatMap(split)));
      for (let i = 0; i < pages.length; i++) for (let k = i + 1; k < pages.length; k++) {
        const shared = [...pages[i]].filter((s) => pages[k].has(s));
        // Only the factual digit lines ("1, The Pioneer: ...") may repeat between numbers that share digits.
        expect(shared.length, `${l} ${ANGEL[i]} vs ${ANGEL[k]}: ${shared.join(" | ")}`).toBeLessThanOrEqual(3);
      }
      const own = ANGEL.map((a) => { const e = numContent(l).angel[a]; return [e.scene, ...e.meaning, e.love, e.work, e.act, e.why].flatMap(split); });
      const seen = new Map<string, string>();
      ANGEL.forEach((a, i) => own[i].forEach((s) => { expect(seen.get(s), `${l} ${a}: ${s}`).toBeUndefined(); seen.set(s, a); }));
    });
  }
  it("Macedonian copy has no slashes or dashes", () => {
    const C = numContent("mk"); const all = JSON.stringify([C.chars, C.angel, C.years, C.karmic, C.explain]);
    expect(all).not.toMatch(/[—–]/); expect(all).not.toMatch(/\s-\s/); expect(all).not.toMatch(/[\p{L}]\/[\p{L}]/u);
  });
  it("every locale fills every number", () => {
    for (const l of ROUTE_LOCALES) { const C = numContent(l); expect(Object.keys(C.angel).sort()).toEqual([...ANGEL].sort()); for (const n of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]) expect(C.chars[n]?.questions.length).toBeGreaterThanOrEqual(3); }
  });
});
