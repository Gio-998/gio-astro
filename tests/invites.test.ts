import { describe, it, expect } from "vitest";
import { snapOf, personFromSnap, inviteUrl, friendPersonId } from "@/lib/invites";

describe("friend invites", () => {
  const me = { id: "me", name: "Maria", date: "1994-10-08", time: "14:20", place: { name: "Bitola", lat: 41.03, lon: 21.33, tz: "Europe/Skopje" }, quiz: {}, createdAt: "2026-10-01T10:00:00Z" };
  it("round-trips a birth snapshot without quiz data", () => {
    const s = snapOf(me); expect(s).not.toHaveProperty("quiz");
    const p = personFromSnap("inv-abcd1234", s); expect(p).toMatchObject({ id: "inv-abcd1234", name: "Maria", date: "1994-10-08", time: "14:20", relType: "friend" });
  });
  it("builds a localized link and a stable person id", () => {
    expect(inviteUrl("abcd1234", "mk")).toMatch(/\/mk\/invite\/abcd1234$/);
    expect(friendPersonId("1b2c3d4e-0000-4000-8000-000000000000")).toBe("invf-1b2c3d4e0000");
  });
});
