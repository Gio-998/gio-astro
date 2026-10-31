import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const read = (page: string) => readFileSync(`src/app/[lang]/${page}/page.tsx`, "utf8");
/** The three page functions of a legal page, by language. */
function byLang(page: string) {
  const src = read(page);
  const part = (from: string, to: string) => src.slice(src.indexOf(`function ${from}`), src.indexOf(to));
  return { en: part("PageEn", "function PageMk"), mk: part("PageMk", "function PageDe"), de: part("PageDe", "export default") };
}
const privacy = byLang("privacy");
/** Serbian is left out on purpose: these pages have no Serbian text yet, see NOT_WRITTEN in src/lib/i18n-routes.ts. */
const LANGS = ["en", "mk", "de"] as const;

describe("privacy page", () => {
  for (const l of LANGS) {
    it(`${l}: names every processor`, () => { for (const p of ["Supabase", "Vercel", "Resend", "Cloudflare", "Open-Meteo"]) expect(privacy[l], p).toContain(p); });
    it(`${l}: drops the old claims that nothing leaves the device`, () => {
      expect(privacy[l]).not.toMatch(/Nothing else|nothing is uploaded|Ништо друго|ништо не се испраќа|Sonst nichts|nichts hochgeladen/i);
    });
    it(`${l}: gives the contact, legal bases, a version and the review note`, () => {
      expect(privacy[l]).toContain("<Mail />");
      expect(privacy[l]).toContain("PRIVACY_VERSION");
      expect(privacy[l]).toMatch(/GDPR|DSGVO/);
      expect(privacy[l]).toMatch(/lawyer|правник|anwaltlich/);
    });
    it(`${l}: uses the reader word test`, () => { expect(privacy[l]).not.toMatch(/quiz|квиз/i); });
    it(`${l}: invents no company`, () => { expect(privacy[l]).not.toMatch(/\b(d\.?o\.?o\.?|GmbH|Ltd|LLC|ДООЕЛ|ДОО)\b/); });
  }
  it("states the same periods the database enforces", () => {
    const sql = readFileSync("supabase/migrations/20261031_leads.sql", "utf8");
    expect(sql).toContain("not marketing_ok and updated_at < now() - interval '24 months'");
    expect(sql).toContain("window_start < now() - interval '24 hours'");
    expect(sql).toContain("public.waitlist where created_at < now() - interval '24 months'");
    expect(sql).toContain("public.events where created_at < now() - interval '14 months'");
    expect(sql).toContain("now() + interval '30 days'");
    const said = { en: ["24 months", "24 hours", "14 months", "30 days"], mk: ["24 месеци", "24 часа", "14 месеци", "30 дена"], de: ["24 Monate", "24 Stunden", "14 Monate", "30 Tage"] };
    for (const l of LANGS) for (const s of said[l]) expect(privacy[l], `${l} ${s}`).toContain(s);
  });
  it("explains double opt-in, which only counts once the link is clicked", () => {
    expect(privacy.en).toContain("only that click counts as consent");
    expect(privacy.mk).toContain("само тој клик се смета за согласност");
    expect(privacy.de).toContain("Double-Opt-in");
  });
});

describe("promise page", () => {
  const promise = byLang("promise");
  for (const l of LANGS) it(`${l}: no longer promises results without an email`, () => {
    expect(promise[l]).not.toMatch(/No email wall|Без барање е-пошта|Keine E-Mail-Pflicht|only in your browser|само во твојот прелистувач/);
    expect(promise[l]).not.toMatch(/quiz|квиз/i);
  });
});

describe("terms page", () => {
  const terms = byLang("terms");
  for (const l of LANGS) it(`${l}: says how the full result opens, with no stray country`, () => {
    expect(terms[l]).toMatch(/name and email|име и е-пошта|Name und E-Mail/);
    expect(terms[l]).not.toMatch(/Poland|Polen/);
    expect(terms[l]).toContain(`/${l}/privacy/`);
  });
});

describe("the server keeps its promises in the source", () => {
  const handler = readFileSync("supabase/functions/submit-lead/handler.ts", "utf8");
  it("uses the new secret key, never a legacy one", () => {
    for (const f of ["submit-lead", "confirm-lead"]) {
      const src = readFileSync(`supabase/functions/${f}/index.ts`, "utf8");
      expect(src).toContain('Deno.env.get("SUPABASE_SECRET_KEYS")');
      expect(src).not.toMatch(/SERVICE_ROLE_KEY|ANON_KEY/);
    }
  });
  it("lets Deno resolve every relative import", () => {
    for (const f of ["submit-lead/index.ts", "submit-lead/handler.ts", "confirm-lead/index.ts", "confirm-lead/handler.ts", "_shared/lead-rules.ts", "_shared/lead-email.ts", "_shared/lead-crypto.ts"]) {
      const src = readFileSync(`supabase/functions/${f}`, "utf8");
      for (const m of src.matchAll(/from "(\.[^"]+)"/g)) expect(m[1], `${f}: ${m[1]}`).toMatch(/\.ts$/);
    }
  });
  it("logs event names only, never the visitor's values", () => {
    const calls = [...handler.matchAll(/deps\.log\((.*?)\);?(?: |$)/gm)].map((m) => m[1]);
    expect(calls.length).toBeGreaterThan(5);
    for (const c of calls) expect(c).not.toMatch(/lead\.|saved\.|token|apiKey/i);
    expect(handler).not.toContain("console.");
  });
});
