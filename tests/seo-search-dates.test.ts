import { describe, it, expect } from "vitest";
import { addDays } from "@/engine/skyday";
import { SIGNS } from "@/engine/zodiac";
import { reading } from "@/lib/horoscope";
import { dayMeta, hubMeta } from "@/components/horoscope/routes";

/** People search "хороскоп за 13.11.2026": the Macedonian daily title and H1 open with exactly that phrase. */
const D = Array.from({ length: 400 }, (_, i) => addDays("2026-11-27", i));
const dotted = (iso: string) => iso.split("-").reverse().join(".");
describe("Macedonian daily titles carry the numeric date", () => {
  it("opens the title and the H1 of a dated page with «Хороскоп за DD.MM.YYYY»", () => {
    for (const d of D) for (const s of SIGNS) { const r = reading("mk", s, d); expect(r.title.startsWith(`Хороскоп за ${dotted(d)}: `), r.title).toBe(true); expect(r.title.length, r.title).toBeLessThanOrEqual(45); }
  });
  it("keeps the written date in the description, so the page still reads naturally", () => {
    for (const d of D.slice(0, 60)) for (const s of SIGNS) { const r = reading("mk", s, d); expect(r.description).toContain(dotted(d)); expect(r.description).toContain(r.dateLabel); }
  });
  it("gives the title of the always-current sign page and of the hub the same phrase", async () => {
    const today = dotted(new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Skopje" }).replaceAll("/", "-"));
    const title = (m: Awaited<ReturnType<typeof dayMeta>>) => (m.title as { absolute: string }).absolute;
    expect(title(await dayMeta("mk", "bik"))).toMatch(new RegExp(`^Хороскоп за ${today.replaceAll(".", "\\.")}: Бик денес · `));
    expect(title(await hubMeta("mk"))).toMatch(new RegExp(`^Хороскоп за ${today.replaceAll(".", "\\.")}: сите 12 знаци · `));
  });
  it("leaves the other languages as they were", () => {
    expect(reading("en", "taurus", "2026-11-27").title).toBe("Taurus daily horoscope, 27 November 2026");
    expect(reading("sr", "taurus", "2026-11-27").title).not.toMatch(/\d{2}\.\d{2}\.\d{4}/);
    expect(reading("de", "taurus", "2026-11-27").title).not.toMatch(/\d{2}\.\d{2}\.\d{4}/);
  });
});
