import { describe, it, expect } from "vitest";
import { merge, meToProfile, profileToMe, personToRow, rowToPerson, latestQuizzes, type ServerSnapshot, type ProfileRow, type PeopleRow, type QuizRow } from "@/lib/sync-map";
import { migrate, type State, type StoredPerson } from "@/lib/store";

const me: StoredPerson = { id: "me", name: "Ana", date: "1995-10-12", time: "14:30", place: { name: "Skopje", lat: 42, lon: 21.4, tz: "Europe/Skopje" }, quiz: { explorer: { score: 60 } as never }, quizAt: { explorer: "2026-10-10T10:00:00Z" }, createdAt: "2026-10-01T00:00:00Z", updatedAt: "2026-10-10T10:00:00Z" };
const empty = (): ServerSnapshot => ({ profile: null, quizzes: [], people: [], journal: [], bonds: [] });
const prof = (o: Partial<ProfileRow> = {}): ProfileRow => ({ id: "u1", display_name: "Ana", birth_name: null, birth_date: null, birth_time: null, birth_time_unknown: true, birth_place: null, birth_lat: null, birth_lon: null, birth_tz: null, utc_offset_override: null, locale: "en", theme_prefs: {}, created_at: "2026-10-01T00:00:00Z", updated_at: "2026-10-01T00:00:00Z", ...o });
const st = (o: Partial<State>): State => ({ ...migrate({}), ...o });

describe("sync mapping", () => {
  it("round-trips me ↔ profile", () => {
    const row = prof({ ...(meToProfile(me, "mk", {}) as Partial<ProfileRow>), birth_time: "14:30:00", updated_at: "2026-10-11T00:00:00Z" });
    const back = profileToMe(row, [], null)!;
    expect(back.date).toBe(me.date); expect(back.time).toBe("14:30"); expect(back.place).toEqual(me.place); expect(row.locale).toBe("mk");
  });
  it("unknown time maps to birth_time_unknown", () => { expect(meToProfile({ ...me, time: null }, "en", {}).birth_time_unknown).toBe(true); });
  it("round-trips people by client id", () => {
    const p: StoredPerson = { ...me, id: "abc123", name: "Mila", relType: "romantic" };
    const r = { ...personToRow(p), id: "srv", owner_id: "u1", created_at: "x", updated_at: "2026-10-11T00:00:00Z", birth_time: "14:30:00" } as PeopleRow;
    const back = rowToPerson(r); expect(back.id).toBe("abc123"); expect(back.relType).toBe("romantic"); expect(back.time).toBe("14:30");
  });
  it("picks the latest quiz per id", () => {
    const q = (id: string, at: string, v: number) => ({ id: at, user_id: "u1", quiz_id: id, scores: { v }, answers: {}, completed_at: at, created_at: at }) as QuizRow;
    const l = latestQuizzes([q("nine", "2026-01-01", 1), q("nine", "2026-02-01", 2), q("care", "2026-01-01", 3)]);
    expect((l.nine.scores as { v: number }).v).toBe(2); expect(Object.keys(l).sort()).toEqual(["care", "nine"]);
  });
});

describe("merge on first login", () => {
  it("uploads everything local when the account is empty", () => {
    const r = merge(st({ me, people: [{ ...me, id: "p1", name: "Mila" }], journal: { "2026-10-11": { date: "2026-10-11", prompt: "?", text: "hi" } } }), { ...empty(), profile: prof() });
    expect(r.upload.me).toBe(true); expect(r.upload.quizKeys).toEqual(["explorer"]); expect(r.upload.people).toEqual(["p1"]); expect(r.upload.journal).toEqual(["2026-10-11"]); expect(r.conflict).toBeNull();
  });
  it("takes the server copy on a new device", () => {
    const r = merge(st({}), { ...empty(), profile: prof({ birth_date: "1995-10-12" }), people: [{ ...personToRow({ ...me, id: "p9", name: "Bo" }), id: "s", owner_id: "u1", created_at: "x", updated_at: "y" } as PeopleRow] });
    expect(r.state.me?.date).toBe("1995-10-12"); expect(r.state.people.map((p) => p.name)).toEqual(["Bo"]); expect(r.upload.me).toBe(false);
  });
  it("flags a conflict when birth dates differ", () => {
    const r = merge(st({ me }), { ...empty(), profile: prof({ birth_date: "1990-01-01", updated_at: "2026-10-11T00:00:00Z" }) });
    expect(r.conflict?.server.date).toBe("1990-01-01");
  });
  it("merges quizzes per quiz, newest wins", () => {
    const srvQ = { id: "q", user_id: "u1", quiz_id: "nine", scores: { t: 1 }, answers: {}, completed_at: "2026-10-11T00:00:00Z", created_at: "x" } as QuizRow;
    const r = merge(st({ me }), { ...empty(), profile: prof({ birth_date: me.date, updated_at: "2026-10-11T00:00:00Z" }), quizzes: [srvQ] });
    expect(Object.keys(r.state.me!.quiz).sort()).toEqual(["explorer", "nine"]); expect(r.upload.quizKeys).toEqual(["explorer"]);
  });
  it("drops a person deleted on another device, keeps unsynced new ones", () => {
    const r = merge(st({ me, people: [{ ...me, id: "old", syncedAt: "2026-10-01" }, { ...me, id: "new" }] }), { ...empty(), profile: prof({ birth_date: me.date }) });
    expect(r.state.people.map((p) => p.id)).toEqual(["new"]);
  });
  it("journal: newer edit wins", () => {
    const r = merge(st({ journal: { d: { date: "d", prompt: "", text: "local newer", updatedAt: "2026-10-12T00:00:00Z" } } }), { ...empty(), journal: [{ id: "j", user_id: "u1", entry_date: "d", prompt: "", body: "server", created_at: "x", updated_at: "2026-10-01T00:00:00Z" }] });
    expect(r.state.journal.d.text).toBe("local newer"); expect(r.upload.journal).toEqual(["d"]);
  });
});
