/** Extra symbolic pair lenses. Small layers shown next to the main report; they never change the main Resonance score. */
import type { Profile } from "../profile";
import type { Systems } from "./index";
import { tzolkinPair } from "./mayan";
import { nineStarPair } from "./ninestar";
import { biorhythmSync } from "./biorhythm";

const sep = (a: number, b: number) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
type Pt = "sun" | "moon" | "venus" | "mars";
const PERSONAL: Pt[] = ["sun", "moon", "venus", "mars"];
export interface Contact { from: "a" | "b"; point: "chiron" | "node" | "lilith"; to: Pt; aspect: "conjunction" | "opposition" | "square"; orb: number }
const ASPECTS: [Contact["aspect"], number][] = [["conjunction", 0], ["opposition", 180], ["square", 90]];

function contacts(fromKey: "a" | "b", sys: Systems, other: Profile): Contact[] {
  const out: Contact[] = [];
  const pts: [Contact["point"], number | null, Pt[], Contact["aspect"][]][] = [
    ["chiron", sys.chiron?.lon ?? null, PERSONAL, ["conjunction", "opposition", "square"]],
    ["node", sys.northNode.lon, ["sun", "moon", "venus"], ["conjunction"]],
    ["lilith", sys.lilith.lon, ["venus", "mars"], ["conjunction", "opposition"]],
  ];
  for (const [point, lon, targets, allowed] of pts) {
    if (lon == null) continue;
    for (const to of targets) {
      const tl = other.chart.placements[to]?.lon; if (tl == null) continue;
      for (const [aspect, angle] of ASPECTS) {
        if (!allowed.includes(aspect)) continue;
        const orb = Math.abs(sep(lon, tl) - angle);
        if (orb <= 5) out.push({ from: fromKey, point, to, aspect, orb: Math.round(orb * 10) / 10 });
      }
    }
  }
  return out;
}
export interface PairExtras {
  contacts: Contact[];
  tzolkin: ReturnType<typeof tzolkinPair>;
  ninestar: ReturnType<typeof nineStarPair>;
  bio: ReturnType<typeof biorhythmSync>;
  harmony: number; spark: number;
}
/** Harmony/Spark for the extras layer only: Tzolk'in and Nine Star Ki relations plus small nudges for tight contacts. */
export function pairExtras(A: Profile, sa: Systems, B: Profile, sb: Systems): PairExtras {
  const cs = [...contacts("a", sa, B), ...contacts("b", sb, A)].sort((x, y) => x.orb - y.orb);
  const tz = tzolkinPair(sa.mayan, sb.mayan), ns = nineStarPair(sa.ninestar.year, sb.ninestar.year), bio = biorhythmSync(A.input.date, B.input.date);
  const nudgeH = cs.filter((c) => c.point === "node" || (c.point === "chiron" && c.aspect === "conjunction")).length * 3;
  const nudgeS = cs.filter((c) => c.point === "lilith" || (c.point === "chiron" && c.aspect !== "conjunction")).length * 3;
  const clamp = (x: number) => Math.max(20, Math.min(95, Math.round(x)));
  return { contacts: cs, tzolkin: tz, ninestar: ns, bio, harmony: clamp((tz.harmony + ns.harmony) / 2 + nudgeH), spark: clamp((tz.spark + ns.spark) / 2 + nudgeS) };
}
