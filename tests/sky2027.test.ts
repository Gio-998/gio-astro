import { describe, it, expect } from "vitest";
import { SKY2027 } from "../src/lib/sky2027";
import { computeSky2027 } from "../src/lib/sky2027-compute";
import { skyDay, addDays } from "../src/engine/skyday";

/** The yearly copy may only state what is in SKY2027, so SKY2027 must be exactly what the engine computes. */
describe("sky 2027 data", () => {
  it("matches a fresh computation from the engine, value for value", () => {
    expect(SKY2027).toEqual(JSON.parse(JSON.stringify(computeSky2027())));
  }, 120_000);
  it("agrees with the daily engine on every sign change", () => {
    for (const x of SKY2027.ingresses) expect(skyDay(addDays(x.date, 1), "aries").signs[x.body], `${x.body} ${x.date}`).toBe(x.sign);
  }, 120_000);
  it("agrees with the daily engine on every station", () => {
    for (const x of SKY2027.stations) {
      const before = skyDay(addDays(x.date, -1), "aries").retro.includes(x.body), after = skyDay(addDays(x.date, 1), "aries").retro.includes(x.body);
      expect([x.body, x.date, before, after]).toEqual([x.body, x.date, x.dir === "direct", x.dir === "retro"]);
    }
  }, 120_000);
  it("agrees with the daily engine on every new and full moon", () => {
    for (const x of SKY2027.moons) {
      const e = skyDay(x.date, "aries").events.find((v) => v.kind === "quarter");
      expect(e && e.kind === "quarter" ? [e.quarter, e.time, e.sign] : null, x.date).toEqual([x.kind, x.time, x.sign]);
    }
  }, 120_000);
  it("has the shape the copy relies on", () => {
    expect(SKY2027.zone).toBe("Europe/Skopje");
    expect(SKY2027.stations.filter((x) => x.body === "venus" && x.date.startsWith("2027"))).toEqual([]);
    expect(SKY2027.stations.filter((x) => x.body === "mercury" && x.dir === "retro" && x.date.startsWith("2027")).length).toBe(3);
    expect(SKY2027.ingresses.filter((x) => x.body === "saturn" || x.body === "uranus" || x.body === "neptune" || x.body === "pluto")).toEqual([]);
    expect(SKY2027.eclipses.length).toBe(5);
  });
});
