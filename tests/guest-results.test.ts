import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { getContent } from "@/content";
import { quizDefs } from "@/lib/quiz-defs";
import { merge, quizRows, profileToMe, meToProfile, type ServerSnapshot, type ProfileRow, type QuizRow } from "@/lib/sync-map";
import { foldGuest, migrate, repo, localRepo, subjectOf, findPerson, onLocalChange, type Change, type State, type StoredPerson } from "@/lib/store";

// A real `mirrorstar:v1` payload, written by the store as it was before guest results existed (see tests/fixtures).
const OLD = readFileSync("tests/fixtures/mirrorstar-v1-tester.json", "utf8");
const KEY = "mirrorstar:v1";

const mem = new Map<string, string>();
vi.stubGlobal("localStorage", { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v), removeItem: (k: string) => void mem.delete(k) });
/** A page reload: a new copy of the store module, reading what is in storage. */
const reloaded = async () => { vi.resetModules(); return import("@/lib/store"); };

const defs = quizDefs(getContent("en"));
const answersFor = (id: keyof typeof defs) => Object.fromEntries(defs[id].items.map((q, i) => [q.id, q.kind === "choice" ? i % 2 : (i % 5) + 1]));
const take = (id: keyof typeof defs) => repo.saveQuiz("me", defs[id].score(answersFor(id)), { quizId: id, values: answersFor(id) });
const me: StoredPerson = { id: "me", name: "Ana", date: "1995-10-12", time: null, place: null, quiz: {}, createdAt: "2026-10-01T00:00:00Z" };
const prof = (o: Partial<ProfileRow> = {}): ProfileRow => ({ id: "u1", display_name: "Ana", birth_name: null, birth_date: null, birth_time: null, birth_time_unknown: true, birth_place: null, birth_lat: null, birth_lon: null, birth_tz: null, utc_offset_override: null, locale: "en", role: "user", theme_prefs: {}, created_at: "2026-10-01T00:00:00Z", updated_at: "2026-10-01T00:00:00Z", ...o });
const row = (quiz_id: string, completed_at: string, scores: unknown = { server: true }) => ({ id: quiz_id + completed_at, user_id: "u1", quiz_id, scores, answers: { q: 1 }, completed_at, created_at: completed_at }) as QuizRow;
const empty = (): ServerSnapshot => ({ profile: null, quizzes: [], people: [], journal: [], bonds: [] });
const st = (o: Partial<State>): State => ({ ...migrate({}), ...o });
const guest = (quizAt = "2026-10-20T10:00:00.000Z") => ({ quiz: { nine: { type: 4 } as never }, quizAt: { nine: quizAt }, answers: { nine: { a: 1 } }, createdAt: quizAt });

beforeEach(() => { localRepo.deleteAll(); mem.clear(); });

describe("guest results", () => {
  it("stores a test with no profile, and `me` stays null", () => {
    take("big-five");
    const s = repo.getState();
    expect(s.me).toBeNull();
    expect(s.guest?.quiz.bigFive).toBeTruthy();
    expect(s.guest?.answers?.["big-five"]).toEqual(answersFor("big-five"));
    expect(s.guest?.quizAt?.bigFive).toBeTruthy();
  });
  it("keeps every birth-based lookup null, so no astrology view sees a person without a date", () => {
    take("attachment");
    expect(findPerson(repo.getState(), "me")).toBeNull();
    const g = subjectOf(repo.getState(), "me")!;
    expect(g.date).toBe(""); expect(g.id).toBe("me"); expect(g.quiz.attachment).toBeTruthy();
  });
  it("gives `me` as the subject once there is one, and other people by id", () => {
    repo.saveMe(me); repo.savePerson({ ...me, id: "p1", name: "Mila" });
    expect(subjectOf(repo.getState(), "me")?.name).toBe("Ana");
    expect(subjectOf(repo.getState(), "p1")?.name).toBe("Mila");
    expect(subjectOf(repo.getState(), "nobody")).toBeNull();
    expect(subjectOf(null, "me")).toBeNull();
  });
  it("is there after a reload", async () => {
    take("nine");
    expect((await reloaded()).repo.getState().guest?.quiz.nine).toBeTruthy();
  });
  it("moves into `me` when a profile is created, and clears the slot", () => {
    take("big-five"); take("care");
    const was = repo.getState().guest!;
    repo.saveMe(me);
    const s = repo.getState();
    expect(s.guest).toBeNull();
    expect(s.me?.quiz.bigFive).toEqual(was.quiz.bigFive);
    expect(s.me?.quiz.care).toEqual(was.quiz.care);
    expect(s.me?.answers?.care).toEqual(was.answers?.care);
    expect(s.me?.quizAt?.bigFive).toBe(was.quizAt?.bigFive);
    expect(s.me?.date).toBe(me.date);
  });
  it("tells the sync layer which results moved", () => {
    const seen: Change[] = []; const off = onLocalChange((c) => seen.push(c));
    take("nine"); seen.length = 0;
    repo.saveMe(me); off();
    expect(seen[0]).toEqual({ kind: "me" });
    expect(seen.find((c) => c.kind === "quiz")).toMatchObject({ kind: "quiz", personId: "me", keys: ["nine"] });
  });
  it("sends a change for a guest test, so a signed-in visitor with no birth date still syncs", () => {
    const seen: Change[] = []; const off = onLocalChange((c) => seen.push(c));
    take("nine"); off();
    expect(seen).toEqual([expect.objectContaining({ kind: "quiz", personId: "me", keys: ["nine"] })]);
  });
  it("is part of an export and an import", () => {
    take("nine");
    const dump = repo.exportAll();
    repo.deleteAll();
    expect(repo.getState().guest).toBeNull();
    expect(repo.importAll(dump)).toBe(true);
    expect(repo.getState().guest?.quiz.nine).toBeTruthy();
  });
  it("is gone after Delete all my data", () => {
    take("nine"); repo.saveProgress({ personId: "me", testId: "care", values: { p0: 1 } });
    repo.deleteAll();
    expect(repo.getState().guest).toBeNull(); expect(repo.getState().progress).toEqual({});
    expect(mem.get(KEY)).toBeUndefined();
  });
});

describe("folding guest results into a profile", () => {
  it("keeps the newer result for each test", () => {
    const m: StoredPerson = { ...me, quiz: { nine: { type: 1 } as never, care: { give: "time" } as never }, quizAt: { nine: "2026-10-25T00:00:00Z", care: "2026-10-01T00:00:00Z" }, answers: { nine: { a: 2 }, care: { a: 2 } } };
    const g = { quiz: { nine: { type: 4 } as never, care: { give: "words" } as never, dosha: { pct: {} } as never }, quizAt: { nine: "2026-10-20T00:00:00Z", care: "2026-10-20T00:00:00Z", dosha: "2026-10-20T00:00:00Z" }, answers: { nine: { a: 1 }, care: { a: 1 }, dosha: { a: 1 } }, createdAt: "x" };
    const r = foldGuest(m, g);
    expect((r.me.quiz.nine as unknown as { type: number }).type).toBe(1);
    expect((r.me.quiz.care as unknown as { give: string }).give).toBe("words");
    expect(r.me.quiz.dosha).toBeTruthy();
    expect(r.keys.sort()).toEqual(["care", "dosha"]);
    expect(r.me.answers).toEqual({ nine: { a: 2 }, care: { a: 1 }, dosha: { a: 1 } });
  });
  it("finds answers saved under a test id that differs from the result key", () => {
    const r = foldGuest(me, { quiz: { bigFive: { E: 50 } as never }, quizAt: { bigFive: "2026-10-20T00:00:00Z" }, answers: { "big-five": { a: 1 } }, createdAt: "x" });
    expect(r.me.answers?.["big-five"]).toEqual({ a: 1 });
  });
  it("keeps per-test timing from both sides", () => {
    const m = { ...me, quiz: { timing: { care: { n: 1 } } as never }, quizAt: { timing: "2026-10-01T00:00:00Z" } };
    const r = foldGuest(m, { quiz: { timing: { nine: { n: 2 } } as never }, quizAt: { timing: "2026-10-20T00:00:00Z" }, createdAt: "x" });
    expect(Object.keys(r.me.quiz.timing!).sort()).toEqual(["care", "nine"]);
  });
  it("leaves `me` alone when the guest slot has nothing newer", () => {
    const m = { ...me, quiz: { nine: { type: 1 } as never }, quizAt: { nine: "2026-10-25T00:00:00Z" } };
    const r = foldGuest(m, guest());
    expect(r.me).toBe(m); expect(r.keys).toEqual([]);
  });
});

describe("migration from a real old-format state", () => {
  const old = JSON.parse(OLD);
  it("is the old format: no guest slot, no progress, version 2", () => {
    expect(old.version).toBe(2); expect(old.guest).toBeUndefined(); expect(old.progress).toBeUndefined();
    expect(Object.keys(old.me.quiz)).toEqual(expect.arrayContaining(["bigFive", "attachment", "nine", "care", "adaptive", "timing", "selfId"]));
  });
  it("keeps every old field exactly", () => {
    const s = migrate(old);
    expect(s.me).toEqual(old.me); expect(s.people).toEqual(old.people); expect(s.journal).toEqual(old.journal);
    expect(s.bondChecks).toEqual(old.bondChecks); expect(s.settings).toEqual(old.settings); expect(s.updatedAt).toBe(old.updatedAt);
    expect(s.guest).toBeNull(); expect(s.progress).toEqual({});
  });
  it("loads from storage and survives a write without touching the tester's data", async () => {
    mem.set(KEY, OLD);
    const { repo } = await reloaded();
    repo.saveSettings({ readTheme: "night" });
    const after = JSON.parse(mem.get(KEY)!);
    expect(after.me).toEqual(old.me); expect(after.people).toEqual(old.people); expect(after.bondChecks).toEqual(old.bondChecks);
    expect(after.settings.readTheme).toBe("night");
    expect(mem.get("mirrorstar:backup")).toBe(OLD); // the old payload stays as the one-step backup
  });
  it("lets a tester with a profile keep saving to `me`, never to the guest slot", async () => {
    mem.set(KEY, OLD);
    const { repo } = await reloaded();
    repo.saveQuiz("me", defs.shadow.score(answersFor("shadow")), { quizId: "shadow", values: answersFor("shadow") });
    const s = repo.getState();
    expect(s.guest).toBeNull(); expect(s.me?.quiz.shadow).toBeTruthy(); expect(s.me?.quiz.bigFive).toEqual(old.me.quiz.bigFive);
  });
  it("is stable when migrated twice", () => {
    const once = migrate({ ...old, guest: guest() }); expect(migrate(JSON.parse(JSON.stringify(once)))).toEqual(once);
  });
  it("settles a state that holds both a profile and guest results", () => {
    const s = migrate({ ...old, guest: guest("2026-12-01T00:00:00.000Z") });
    expect(s.guest).toBeNull(); expect((s.me!.quiz.nine as unknown as { type: number }).type).toBe(4);
  });
  it("drops garbage in the new slots", () => {
    for (const g of [1, "x", [], {}, { quiz: 1 }, { quiz: {} }]) expect(migrate({ guest: g }).guest).toBeNull();
    for (const p of [1, "x", [], { a: 1 }, { "me/care": { personId: 1 } }, { "me/care": { personId: "me", testId: "care" } }]) expect(migrate({ progress: p }).progress).toEqual({});
  });
});

describe("merge with an account", () => {
  it("still flags a conflict on different birth dates, and leaves the guest logic out of it", () => {
    const r = merge(st({ me }), { ...empty(), profile: prof({ birth_date: "1990-01-01", updated_at: "2026-10-11T00:00:00Z" }) });
    expect(r.conflict?.server.date).toBe("1990-01-01"); expect(r.state.me).toEqual(me); expect(r.upload.quizKeys).toEqual([]);
  });
  it("uploads guest results to an empty account, with no birth date anywhere", () => {
    const r = merge(st({ guest: guest() }), { ...empty(), profile: prof() });
    expect(r.state.me).toBeNull(); expect(r.state.guest?.quiz.nine).toBeTruthy(); expect(r.upload.quizKeys).toEqual(["nine"]); expect(r.upload.me).toBe(false); expect(r.conflict).toBeNull();
  });
  it("restores results on a new device for an account with no birth date", () => {
    const r = merge(st({}), { ...empty(), profile: prof(), quizzes: [row("nine", "2026-10-20T00:00:00Z"), row("nine", "2026-10-10T00:00:00Z", { old: true }), row("care", "2026-10-11T00:00:00Z")] });
    expect(r.state.me).toBeNull(); expect(r.state.guest?.quiz.nine).toEqual({ server: true }); expect(r.state.guest?.quiz.care).toBeTruthy(); expect(r.upload.quizKeys).toEqual([]);
  });
  it("keeps the newer side per test when neither has a birth date", () => {
    const r = merge(st({ guest: guest("2026-10-20T00:00:00.000Z") }), { ...empty(), profile: prof(), quizzes: [row("nine", "2026-10-25T00:00:00Z"), row("care", "2026-10-25T00:00:00Z")] });
    expect(r.state.guest?.quiz.nine).toEqual({ server: true }); expect(r.upload.quizKeys).toEqual([]);
    const r2 = merge(st({ guest: guest("2026-10-30T00:00:00.000Z") }), { ...empty(), profile: prof(), quizzes: [row("nine", "2026-10-25T00:00:00Z")] });
    expect((r2.state.guest?.quiz.nine as unknown as { type: number }).type).toBe(4); expect(r2.upload.quizKeys).toEqual(["nine"]);
  });
  it("folds guest results into the account's profile on sign-in", () => {
    const r = merge(st({ guest: guest() }), { ...empty(), profile: prof({ birth_date: "1995-10-12" }), quizzes: [row("care", "2026-10-11T00:00:00Z")] });
    expect(r.state.guest).toBeNull(); expect(r.conflict).toBeNull();
    expect(r.state.me?.date).toBe("1995-10-12");
    expect(Object.keys(r.state.me!.quiz).sort()).toEqual(["care", "nine"]);
    expect(r.upload.quizKeys).toEqual(["nine"]);
  });
  it("lets a newer result in the account beat an older guest result", () => {
    const r = merge(st({ guest: guest("2026-10-01T00:00:00.000Z") }), { ...empty(), profile: prof({ birth_date: "1995-10-12" }), quizzes: [row("nine", "2026-10-25T00:00:00Z")] });
    expect(r.state.guest).toBeNull(); expect(r.state.me?.quiz.nine).toEqual({ server: true }); expect(r.upload.quizKeys).toEqual([]);
  });
  it("keeps unfinished tests through a merge", () => {
    const progress = { "me/care": { personId: "me", testId: "care", values: { p0: 1 }, at: "x" } };
    const r = merge(st({ guest: guest(), progress }), { ...empty(), profile: prof() });
    expect(r.state.progress).toEqual(progress);
    expect(migrate(JSON.parse(JSON.stringify(r.state))).progress).toEqual(progress); // applyState goes through JSON and migrate
  });
});

describe("upload rows", () => {
  it("come from the guest slot when there is no profile", () => {
    const rows = quizRows(st({ guest: guest() }), ["nine"]);
    expect(rows).toEqual([{ quiz_id: "nine", scores: { type: 4 }, answers: { a: 1 }, completed_at: "2026-10-20T10:00:00.000Z" }]);
  });
  it("come from `me` when there is one, and use the test id for answers", () => {
    const s = st({ me: { ...me, quiz: { bigFive: { E: 1 } as never }, quizAt: { bigFive: "2026-10-20T00:00:00Z" }, answers: { "big-five": { q: 3 } } } });
    expect(quizRows(s, ["bigFive", "missing"])).toEqual([{ quiz_id: "bigFive", scores: { E: 1 }, answers: { q: 3 }, completed_at: "2026-10-20T00:00:00Z" }]);
  });
  it("are empty with nobody to upload", () => { expect(quizRows(st({}), ["nine"])).toEqual([]); });
});

describe("a profile with no name", () => {
  const noName: StoredPerson = { ...me, name: "Friend", noName: true };
  it("sends no display name, so the placeholder stays on this device", () => {
    expect(meToProfile(noName, "en", {}).display_name).toBeNull();
    expect(meToProfile(me, "en", {}).display_name).toBe("Ana");
  });
  it("comes back as nameless from an account", () => {
    const back = profileToMe(prof({ display_name: null, birth_date: me.date }), [], null)!;
    expect(back.noName).toBe(true);
    expect(profileToMe(prof({ display_name: "Ana", birth_date: me.date }), [], noName)!.noName).toBeUndefined();
  });
});
