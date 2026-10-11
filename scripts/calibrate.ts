/**
 * Monte-Carlo calibration (design doc §5.3): generate random people and random pairs,
 * compute each lens's raw Harmony/Spark, and store 101 quantiles per lens so the app can map
 * any raw score to "percentile among random pairs" → display = 45 + 55·p.
 * Run: npx tsx scripts/calibrate.ts  (writes src/engine/calibration.json)
 */
import fs from "node:fs";
import { buildProfile, Profile, QuizResults } from "../src/engine/profile";
import { rawLenses, REL_TYPES, LensId } from "../src/engine/compat";
import { scoreBigFive, BIG_FIVE_ITEMS } from "../src/engine/bigfive";
import { scoreAttachment, ATTACH_ITEMS, scoreNine, scoreCare, CARE_PAIRS, scoreDosha, DOSHA_ITEMS, scoreExplorer } from "../src/engine/quizzes";
import { scoreShadow, SHADOW_ITEMS } from "../src/engine/shadow";

let seed = 42;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const pick = <T,>(a: readonly T[]) => a[Math.floor(rnd() * a.length)];
const likert = () => 1 + Math.floor(rnd() * 5);
const CITIES = [
  { name: "Warsaw", lat: 52.23, lon: 21.01, tz: "Europe/Warsaw" }, { name: "London", lat: 51.51, lon: -0.13, tz: "Europe/London" },
  { name: "New York", lat: 40.71, lon: -74.01, tz: "America/New_York" }, { name: "São Paulo", lat: -23.55, lon: -46.63, tz: "America/Sao_Paulo" },
  { name: "Mumbai", lat: 19.08, lon: 72.88, tz: "Asia/Kolkata" }, { name: "Sydney", lat: -33.87, lon: 151.21, tz: "Australia/Sydney" },
  { name: "Madrid", lat: 40.42, lon: -3.7, tz: "Europe/Madrid" }, { name: "Tokyo", lat: 35.68, lon: 139.69, tz: "Asia/Tokyo" },
];
const NAMES = ["Anna Kowalska", "Jan Nowak", "Maria Silva", "John Smith", "Priya Sharma", "Lucas Martin", "Sofia Rossi", "Kenji Sato", "Emma Brown", "Piotr Zielinski"];

function randomQuiz(): QuizResults {
  const ans = (ids: string[]) => Object.fromEntries(ids.map((id) => [id, likert()]));
  return {
    bigFive: scoreBigFive(ans(BIG_FIVE_ITEMS.map((i) => i.id))).pct,
    attachment: scoreAttachment(ans(ATTACH_ITEMS.map((i) => i.id))),
    nine: scoreNine(ans([1, 2, 3, 4, 5, 6, 7, 8, 9].flatMap((t) => [`t${t}`, `t${t}b`]))),
    care: scoreCare({ ...Object.fromEntries(CARE_PAIRS.map((_, i) => [`p${i}`, rnd() < 0.5 ? 0 : 1])), give: Math.floor(rnd() * 5) }),
    shadow: scoreShadow(ans(SHADOW_ITEMS.map((i) => i.id))),
    dosha: scoreDosha(Object.fromEntries(DOSHA_ITEMS.map((id) => [id, Math.floor(rnd() * 3)]))),
    explorer: scoreExplorer(ans(["routine", "persistence", "simplify", "certainty", "evidence", "image", "conf1", "conf2", "trust1", "trust2"])),
  };
}

function randomPerson(): Profile {
  const start = Date.UTC(1960, 0, 1), end = Date.UTC(2008, 11, 31);
  const d = new Date(start + rnd() * (end - start)).toISOString().slice(0, 10);
  const known = rnd() < 0.7;
  const time = known ? `${String(Math.floor(rnd() * 24)).padStart(2, "0")}:${String(Math.floor(rnd() * 60)).padStart(2, "0")}` : null;
  return buildProfile({ date: d, time, place: pick(CITIES), name: pick(NAMES), quiz: randomQuiz() });
}

const N_PEOPLE = Number(process.env.N_PEOPLE ?? 1500), N_PAIRS = Number(process.env.N_PAIRS ?? 12000);
const people = Array.from({ length: N_PEOPLE }, randomPerson);
const samples: Record<string, { h: number[]; s: number[] }> = {};
for (let i = 0; i < N_PAIRS; i++) {
  const a = pick(people), b = pick(people);
  if (a === b) continue;
  const rel = REL_TYPES[i % 4];
  const raw = rawLenses(a, b, rel);
  for (const [id, r] of Object.entries(raw) as [LensId, ReturnType<typeof rawLenses>[LensId]][]) {
    if (!r) continue;
    const key = id === "western" ? `western-${rel}` : id;
    samples[key] ??= { h: [], s: [] };
    samples[key].h.push(r.rawH); samples[key].s.push(r.rawS);
  }
}
const quantiles = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return Array.from({ length: 101 }, (_, i) => +s[Math.min(s.length - 1, Math.round((i / 100) * (s.length - 1)))].toFixed(3)); };
const out: Record<string, { n: number; h: number[]; s: number[] }> = {};
for (const [k, v] of Object.entries(samples)) out[k] = { n: v.h.length, h: quantiles(v.h), s: quantiles(v.s) };
fs.writeFileSync("src/engine/calibration.json", JSON.stringify(out));
console.log(`calibrated ${Object.keys(out).length} lens tables from ${N_PEOPLE} people / ${N_PAIRS} pairs`);
for (const [k, v] of Object.entries(out)) console.log(k.padEnd(20), "n", v.n, "H median", v.h[50], "S median", v.s[50]);
