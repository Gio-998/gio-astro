import { describe, expect, it } from "vitest";
import { ADAPTIVE_ITEMS, ITEM_BY_ID, MAX_ITEMS, MIN_ITEMS, nextItem, scoreAdaptive, type AAnswer } from "@/engine/adaptive";
import { scoreFocus, scoreWait, FOCUS_SEQ, WAIT_ROUNDS, PLAY_GAMES, PLAY_DIMS } from "@/engine/play";
import { unifiedProfile } from "@/engine/unified";
import { adaptive as en } from "@/content/en/adaptive";
import { adaptive as mk } from "@/content/mk/adaptive";
import { play as pen } from "@/content/en/play";
import { play as pmk } from "@/content/mk/play";

/** Run the adaptive test with a fixed answering policy. */
function run(policy: (id: string, k: number) => 0 | 1 | 2, ms = 1200): AAnswer[] {
  const ans: AAnswer[] = [];
  for (let guard = 0; guard < 40; guard++) {
    const it = nextItem(ans); if (!it) break;
    ans.push({ id: it.id, v: policy(it.id, ans.length), ms });
  }
  return ans;
}
const highAll = (id: string) => { const it = ITEM_BY_ID[id]; return (it.kind === "gut" && it.keyed === -1 ? 2 : 1) as 1 | 2; };

describe("Deep Read (adaptive)", () => {
  it("stops early when answers are clear, runs longer when they are mixed", () => {
    let k = 0;
    expect(run(highAll).length).toBeLessThan(run(() => ((k++ % 2) + 1) as 1 | 2).length + 1);
  });
  it("never repeats an item and stays within the length limits", () => {
    const ans = run(highAll);
    expect(new Set(ans.map((a) => a.id)).size).toBe(ans.length);
    expect(ans.length).toBeGreaterThanOrEqual(MIN_ITEMS); expect(ans.length).toBeLessThanOrEqual(MAX_ITEMS);
  });
  it("mixes in timed gut items and at least one consistency twin", () => {
    const ans = run(highAll);
    expect(ITEM_BY_ID[ans[3].id].kind).toBe("gut");
    expect(ans.some((a) => (ITEM_BY_ID[a.id] as { twin?: string }).twin)).toBe(true);
  });
  it("never asks the same trait twice in a row while others are open", () => {
    const ans = run((id, k) => (k % 3 ? 1 : 2));
    for (let i = 1; i < Math.min(10, ans.length); i++) expect(ITEM_BY_ID[ans[i].id].trait).not.toBe(ITEM_BY_ID[ans[i - 1].id].trait);
  });
  it("adapts: the path depends on the answers", () => {
    let flipE = 0;
    const clear = run(() => 1); const torn = run((id) => (ITEM_BY_ID[id].trait === "E" ? ((flipE++ % 2) + 1) as 1 | 2 : 1));
    expect(torn.map((x) => x.id).join()).not.toBe(clear.map((x) => x.id).join());
    const eCount = (xs: AAnswer[]) => xs.filter((x) => ITEM_BY_ID[x.id].trait === "E").length;
    expect(eCount(torn)).toBeGreaterThan(eCount(clear));
  });
  it("scores a consistent high profile high, with full consistency and a code", () => {
    const r = scoreAdaptive(run(highAll, 2500));
    for (const t of ["O", "C", "E", "A", "N"] as const) expect(r.pct[t]).toBeGreaterThan(70);
    expect(r.consistency).toBe(1); expect(r.code).toBe("ENFJ"); expect(r.flags).not.toContain("rushed");
  });
  it("flags contradicting twins and lowers confidence", () => {
    const flipTwin = (id: string) => ((ITEM_BY_ID[id] as { twin?: string }).twin ? 2 : highAll(id));
    const good = scoreAdaptive(run(highAll)); const mixed = scoreAdaptive(run(flipTwin));
    expect(mixed.consistency).toBeLessThan(1);
    expect(Object.values(mixed.conf).reduce((s, x) => s + x, 0)).toBeLessThan(Object.values(good.conf).reduce((s, x) => s + x, 0));
  });
  it("timeouts count as no evidence and fast gut answers weigh more", () => {
    const r = scoreAdaptive([{ id: "ge1", v: 0, ms: 5000 }]); expect(r.pct.E).toBe(50); expect(r.timeouts).toBe(1);
    const fast = scoreAdaptive([{ id: "ge1", v: 1, ms: 800 }]).pct.E, slow = scoreAdaptive([{ id: "ge1", v: 1, ms: 4500 }]).pct.E;
    expect(fast).toBeGreaterThan(slow);
  });
  it("has full EN and MK text for every item", () => {
    for (const it of ADAPTIVE_ITEMS) {
      if (it.kind === "dilemma") for (const C of [en, mk]) { const d = C.dilemmas[it.id]; expect(d?.q.length).toBeGreaterThan(5); expect(d.a[1].length).toBeGreaterThan(5); expect(d.b[1].length).toBeGreaterThan(5); }
      else for (const C of [en, mk]) expect(C.gut[it.id]?.length).toBeGreaterThan(5);
    }
    for (const it of ADAPTIVE_ITEMS) expect(it.kind === "dilemma" ? mk.dilemmas[it.id].q : mk.gut[it.id]).toMatch(/\p{Script=Cyrillic}/u);
  });
});

describe("Play Mirror: Lantern and Star Catch", () => {
  it("Lantern: waiting every time = 10, never waiting = 0, giving up halfway in between", () => {
    const all = (choice: "now" | "wait", gaveUp = false, f = 1) => ({ rounds: WAIT_ROUNDS.map((r) => ({ choice, gaveUp, waitedMs: r.secs * 1000 * f, ms: 900 })), taps: [], ms: 1 });
    expect(scoreWait(all("wait")).scores.patience).toBe(10);
    expect(scoreWait(all("now")).scores.patience).toBe(0);
    const half = scoreWait(all("wait", true, 0.5)).scores.patience!; expect(half).toBeGreaterThan(0); expect(half).toBeLessThan(5);
  });
  it("Star Catch: perfect play = 10, tapping every moon costs most", () => {
    const perfect = { trials: FOCUS_SEQ.map((g) => ({ go: g === 1, tapped: g === 1, rt: 400 })), taps: [], ms: 1 };
    expect(scoreFocus(perfect).scores.control).toBe(10);
    const impulsive = { trials: FOCUS_SEQ.map((g) => ({ go: g === 1, tapped: true, rt: 300 })), taps: [], ms: 1 };
    const sleepy = { trials: FOCUS_SEQ.map((g) => ({ go: g === 1, tapped: false, rt: null })), taps: [], ms: 1 };
    expect(scoreFocus(impulsive).scores.control!).toBeLessThan(scoreFocus(sleepy).scores.control!);
  });
  it("has seven games with EN and MK copy for every game and dimension", () => {
    expect(PLAY_GAMES.length).toBe(7);
    for (const C of [pen, pmk]) { for (const g of PLAY_GAMES) expect(C.games[g].name.length).toBeGreaterThan(2); for (const d of PLAY_DIMS) expect(C.dims[d].text.high.length).toBeGreaterThan(20); }
  });
});

describe("Combined profile", () => {
  it("starts as a first sketch and gets surer with more sources", () => {
    const empty = unifiedProfile({}); expect(empty.level).toBe(0); expect(empty.next).toBe("deep");
    const chart = unifiedProfile({}, { fire: 4, air: 3, earth: 1, water: 1 });
    const deep = scoreAdaptive(run(highAll));
    const withDeep = unifiedProfile({ adaptive: deep }, { fire: 4, air: 3, earth: 1, water: 1 });
    const withMore = unifiedProfile({ adaptive: deep, bigFive: { O: 80, C: 75, E: 80, A: 70, N: 75 } }, { fire: 4, air: 3, earth: 1, water: 1 });
    expect(withDeep.sure).toBeGreaterThan(chart.sure); expect(withMore.sure).toBeGreaterThan(withDeep.sure);
    expect(withMore.axes.energy!.value).toBeGreaterThan(60); expect(withMore.axes.steadiness!.value).toBeLessThan(40);
    expect(withMore.sources).toEqual(expect.arrayContaining(["chart", "adaptive", "bigFive"]));
  });
  it("is less sure when sources disagree", () => {
    const agree = unifiedProfile({ bigFive: { O: 80, C: 80, E: 80, A: 80, N: 20 }, bigFiveLong: { O: 82, C: 78, E: 81, A: 79, N: 22 } });
    const clash = unifiedProfile({ bigFive: { O: 80, C: 80, E: 80, A: 80, N: 20 }, bigFiveLong: { O: 15, C: 20, E: 18, A: 20, N: 85 } });
    expect(clash.sure).toBeLessThan(agree.sure);
  });
  it("has copy for every axis, level and source in both languages", () => {
    for (const C of [en, mk]) { expect(C.unified.levels).toHaveLength(4); expect(Object.keys(C.unified.axes)).toHaveLength(6); expect(Object.keys(C.unified.sources)).toHaveLength(6); }
  });
});
