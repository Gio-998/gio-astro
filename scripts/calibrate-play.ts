/** Monte-Carlo calibration for the Play lens (same method as scripts/calibrate.ts). Run: npx tsx scripts/calibrate-play.ts */
import fs from "node:fs";
import { PLAY_DIMS, PLAY_GAMES, type PlayProfile } from "../src/engine/play";
import { playLens } from "../src/engine/play/compat";
let seed = 7;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const gauss = () => { let s = 0; for (let i = 0; i < 6; i++) s += rnd(); return (s - 3) / Math.sqrt(0.5); };
const person = (): PlayProfile => ({ dims: Object.fromEntries(PLAY_DIMS.map((d) => [d, Math.round(Math.min(10, Math.max(0, 5 + 2.2 * gauss())) * 10) / 10])), games: [...PLAY_GAMES], flags: [], complete: true });
const h: number[] = [], s: number[] = [];
for (let i = 0; i < 40000; i++) { const r = playLens(person(), person())!; h.push(r.rawH); s.push(r.rawS); }
const q = (xs: number[]) => { const t = [...xs].sort((a, b) => a - b); return Array.from({ length: 101 }, (_, i) => +t[Math.round((i / 100) * (t.length - 1))].toFixed(3)); };
fs.writeFileSync("src/engine/play/calibration.json", JSON.stringify({ n: h.length, h: q(h), s: q(s) }));
console.log("play lens calibrated", q(h)[50], q(s)[50]);
