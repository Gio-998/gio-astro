import { describe, it, expect } from "vitest";
import { migrate } from "../src/lib/store";

describe("storage migration", () => {
  it("upgrades v1 payloads without losing people, quizzes or journal", () => {
    const v1 = { version: 1, me: { id: "me", name: "Gio", date: "1995-10-12", time: null, place: null, quiz: { nine: { type: 1, wing: 9 } }, createdAt: "x" }, people: [{ id: "a", name: "Ana", date: "1996-02-01", time: null, place: null, createdAt: "x" }], journal: { "2026-10-11": { date: "2026-10-11", prompt: "p", text: "t" } } };
    const s = migrate(v1);
    expect(s.version).toBe(2);
    expect(s.me?.quiz).toEqual({ nine: { type: 1, wing: 9 } });
    expect(s.people[0].quiz).toEqual({});
    expect(s.journal["2026-10-11"].text).toBe("t");
    expect(s.settings.theme).toBe("personal");
  });
  it("survives garbage", () => {
    for (const g of [null, 42, "x", { people: "nope" }, { me: { name: 1 } }]) { const s = migrate(g); expect(s.people).toEqual([]); expect(s.me).toBeNull(); }
  });
});
