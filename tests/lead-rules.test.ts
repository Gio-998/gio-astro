import { describe, it, expect } from "vitest";
import { cleanEmail, cleanName, firstName, normalizeMailbox, validateLead, LIMITS } from "../supabase/functions/_shared/lead-rules";

const good = { name: "Ana Petrovska", email: "ana@example.com", locale: "mk", source: "big-five", marketing: false, privacyVersion: "2026-10-31" };
const NOW = Date.parse("2026-10-31T12:00:00Z");

describe("names", () => {
  it("accepts real names in any script", () => {
    for (const n of ["Ana Petrovska", "Марија Стојанова", "Jürgen Müller-Lüdenscheidt", "O'Brien", "Ана", "José Ñandú", "J.R. Tolkien", "Dr. Ana"]) expect(cleanName(n), n).toBe(n);
  });
  it("tidies spacing", () => { expect(cleanName("  Ana \n  Petrovska\t")).toBe("Ana Petrovska"); });
  it("refuses HTML", () => {
    for (const n of ["<b>Ana</b>", "Ana <script>alert(1)</script>", "Ana > Marko", "<img src=x onerror=y>"]) expect(cleanName(n), n).toBeNull();
  });
  it("refuses links, addresses and control characters, which would turn the welcome email into spam", () => {
    for (const n of ["http://evil.example", "www.evil.example", "visit evil.com now", "ana@example.com", "Ana\u0000Petrovska", "buy at evil.co"]) expect(cleanName(n), n).toBeNull();
  });
  it("enforces length and needs a letter", () => {
    expect(cleanName("A")).toBeNull();
    expect(cleanName("12345")).toBeNull();
    expect(cleanName("a".repeat(LIMITS.name))).not.toBeNull();
    expect(cleanName("a".repeat(LIMITS.name + 1))).toBeNull();
  });
  it("refuses anything that isn't a string", () => { for (const n of [null, undefined, 5, {}, ["Ana"]]) expect(cleanName(n)).toBeNull(); });
});

describe("email addresses", () => {
  it("lowercases and trims", () => { expect(cleanEmail("  Ana.P+tests@Example.COM ")).toBe("ana.p+tests@example.com"); });
  it("refuses malformed addresses", () => {
    for (const e of ["", "ana", "ana@", "@example.com", "ana@example", "ana@example.c", "a b@example.com", "ana@@example.com", "ana..p@example.com", ".ana@example.com", "ana.@example.com", "ana@example..com"]) expect(cleanEmail(e), e).toBeNull();
  });
  it("refuses HTML and header tricks", () => {
    for (const e of ["<a@example.com>", "a@example.com>", "a@example.com\nbcc:b@example.com", "a,b@example.com", "\"a\"@example.com"]) expect(cleanEmail(e), e).toBeNull();
  });
  it("enforces both length limits", () => {
    expect(cleanEmail(`${"a".repeat(64)}@example.com`)).not.toBeNull();
    expect(cleanEmail(`${"a".repeat(65)}@example.com`)).toBeNull();
    expect(cleanEmail(`a@${"b".repeat(250)}.com`)).toBeNull();
  });
});

describe("validateLead", () => {
  it("returns a clean lead", () => {
    const r = validateLead({ ...good, email: "ANA@example.com", name: " Ana  Petrovska " }, NOW);
    expect(r).toEqual({ ok: true, lead: { name: "Ana Petrovska", email: "ana@example.com", locale: "mk", source: "big-five", marketing: false, marketingText: null, privacyVersion: "2026-10-31", at: null } });
  });
  it("names the first problem", () => {
    expect(validateLead({ ...good, name: "<b>" })).toEqual({ ok: false, error: "invalid_name" });
    expect(validateLead({ ...good, email: "x" })).toEqual({ ok: false, error: "invalid_email" });
    expect(validateLead({ ...good, locale: "english" })).toEqual({ ok: false, error: "invalid_locale" });
    expect(validateLead({ ...good, source: "<script>" })).toEqual({ ok: false, error: "invalid_source" });
    expect(validateLead({ ...good, source: "a".repeat(65) })).toEqual({ ok: false, error: "invalid_source" });
    expect(validateLead({ ...good, marketing: "yes" })).toEqual({ ok: false, error: "invalid_consent" });
    expect(validateLead({ ...good, privacyVersion: "1 OR 1=1" })).toEqual({ ok: false, error: "invalid_consent" });
  });
  it("needs the consent words when the box is ticked, and throws them away when it isn't", () => {
    expect(validateLead({ ...good, marketing: true })).toEqual({ ok: false, error: "invalid_consent" });
    expect(validateLead({ ...good, marketing: true, marketingText: "<b>yes</b>" })).toEqual({ ok: false, error: "invalid_consent" });
    expect(validateLead({ ...good, marketing: true, marketingText: "x".repeat(LIMITS.consentText + 1) })).toEqual({ ok: false, error: "invalid_consent" });
    const yes = validateLead({ ...good, marketing: true, marketingText: "Yes please." });
    expect(yes.ok && yes.lead.marketingText).toBe("Yes please.");
    const no = validateLead({ ...good, marketing: false, marketingText: "Ignored" });
    expect(no.ok && no.lead.marketingText).toBeNull();
  });
  it("keeps a plausible device time and drops an impossible one", () => {
    const at = (value: string) => { const r = validateLead({ ...good, at: value }, NOW); return r.ok ? r.lead.at : "refused"; };
    expect(at("2026-10-30T08:00:00Z")).toBe("2026-10-30T08:00:00.000Z");
    expect(at("2030-01-01T00:00:00Z")).toBeNull();
    expect(at("2020-01-01T00:00:00Z")).toBeNull();
    expect(at("soon")).toBeNull();
  });
});

describe("normalizeMailbox", () => {
  it.each([
    ["ana@example.com", "ana@example.com"],
    ["ANA@Example.COM", "ana@example.com"],
    ["ana+news@example.com", "ana@example.com"],
    ["ana+a+b@example.com", "ana@example.com"],
    ["a.na@example.com", "a.na@example.com"],
    ["a.n.a@gmail.com", "ana@gmail.com"],
    ["A.N.A+tag@GMail.com", "ana@gmail.com"],
    ["a.na@googlemail.com", "ana@gmail.com"],
    ["+tag@example.com", "+tag@example.com"],
  ])("reads %s as %s", (email, mailbox) => { expect(normalizeMailbox(email)).toBe(mailbox); });
});

describe("firstName", () => {
  it("takes the first word when it is plainly a name", () => {
    expect(firstName("Ana Petrovska")).toBe("Ana");
    expect(firstName("Марија Стојанова")).toBe("Марија");
    expect(firstName("Anne-Marie Weber")).toBe("Anne-Marie");
    expect(firstName("O'Brien Pat")).toBe("O'Brien");
  });
  it("gives up on anything else, so a greeting can't carry a message", () => {
    for (const n of ["Dr. Ana", "Ana, click here", "12 Ana", "x".repeat(31)]) expect(firstName(n), n).toBeNull();
  });
});
