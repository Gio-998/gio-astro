// Regenerates src/lib/sky2027.ts from the engine: npx tsx scripts/gen-sky2027.ts
// The data module is frozen output so pages never compute astronomy at build time; tests/sky2027.test.ts keeps it honest.
import fs from "node:fs";
import path from "node:path";
import { computeSky2027 } from "../src/lib/sky2027-compute";

const sky = computeSky2027();
const row = (x: unknown) => `  ${JSON.stringify(x)},`;
const table = (name: string, rows: unknown[]) => `${name}: [\n${rows.map(row).join("\n")}\n ],`;
const out = `/**
 * The real sky of 2027, computed by src/lib/sky2027-compute.ts and frozen here. Do not edit by hand:
 * run \`npx tsx scripts/gen-sky2027.ts\`. tests/sky2027.test.ts recomputes everything and fails on any difference,
 * and tests/yearly2027-overlap.test.ts fails on any date in the yearly copy that is not in this file.
 */
import type { SkyData } from "./sky2027-types";
export type { SkyData, SkyBody, SkyEclipse, SkyEclipseView, SkyIngress, SkyMoon, SkyPlace, SkySlowAspect, SkyStation } from "./sky2027-types";

export const SKY2027: SkyData = {
 zone: ${JSON.stringify(sky.zone)},
 ${table("start", sky.start)}
 ${table("end", sky.end)}
 ${table("ingresses", sky.ingresses)}
 ${table("stations", sky.stations)}
 ${table("moons", sky.moons)}
 ${table("eclipses", sky.eclipses)}
 ${table("eclipseViews", sky.eclipseViews)}
 ${table("slowAspects", sky.slowAspects)}
};
`;
fs.writeFileSync(path.resolve(__dirname, "../src/lib/sky2027.ts"), out);
console.log(`sky2027: ${sky.ingresses.length} ingresses, ${sky.stations.length} stations, ${sky.moons.length} moons, ${sky.eclipses.length} eclipses, ${sky.slowAspects.length} slow aspects`);
