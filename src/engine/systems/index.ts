/** Extra systems ("all earthly systems, ancient to now"), computed from a Profile. Pure and deterministic. */
import type { Profile } from "../profile";
import { degreeInSign, Sign, signFromLongitude } from "../zodiac";
import { chironLongitude, chironRetrograde } from "./chiron";
import { meanLilith } from "./lilith";
import { tzolkin, longCount, Tzolkin } from "./mayan";
import { celticTree, egyptianSign, birthRune, slavicMonth, Tree, EgyptSign, Rune, SlavicMonth } from "./calendars";
import { birthHexagram, BirthHexagram } from "./iching";
import { treeOfLife, TreeOfLife } from "./kabbalah";
import { nineStarKi, NineStar } from "./ninestar";
import { biorhythm } from "./biorhythm";
import { solarReturn, SolarReturn } from "./solarreturn";
import { degreeSymbol, DegreeSymbol } from "./degree";
import { nameDay, birthFeast, NameDay, FeastId } from "./feasts";

export interface Placed { lon: number; sign: Sign; deg: number; house: number | null; retrograde?: boolean }
export interface Systems {
  chiron: Placed | null;
  northNode: Placed; southNode: Placed;
  lilith: Placed;
  mayan: Tzolkin & { longCount: string };
  celtic: Tree; egyptian: EgyptSign; rune: Rune; slavic: SlavicMonth; birthFeast: { feast: FeastId; offset: number } | null;
  iching: BirthHexagram; kabbalah: TreeOfLife; ninestar: NineStar;
  sunDegree: DegreeSymbol;
  nameDay: NameDay | null;
}

function placed(p: Profile, lon: number, retrograde?: boolean): Placed {
  const asc = p.chart.placements.asc;
  const house = asc ? ((Math.floor(lon / 30) - Math.floor(asc.lon / 30) + 12) % 12) + 1 : null;
  return { lon, sign: signFromLongitude(lon), deg: degreeInSign(lon), house, retrograde };
}

export function computeSystems(p: Profile, opts: { firstName?: string; today?: Date } = {}): Systems {
  const utc = p.chart.time.utc;
  const ch = chironLongitude(utc);
  const node = p.chart.placements.node!.lon;
  const { date, time } = p.input;
  return {
    chiron: ch == null ? null : placed(p, ch, chironRetrograde(utc) ?? undefined),
    northNode: placed(p, node), southNode: placed(p, (node + 180) % 360),
    lilith: placed(p, meanLilith(utc)),
    mayan: { ...tzolkin(date), longCount: longCount(date) },
    celtic: celticTree(date), egyptian: egyptianSign(date), rune: birthRune(date), slavic: slavicMonth(date), birthFeast: birthFeast(date),
    iching: birthHexagram(date, time), kabbalah: treeOfLife(p.numbers.lifePath, p.tarot.cards), ninestar: nineStarKi(date, time),
    sunDegree: degreeSymbol(p.chart.placements.sun!.lon),
    nameDay: nameDay(opts.firstName ?? p.input.name, opts.today),
  };
}
export const todayBiorhythm = (p: Profile, today = new Date()) => biorhythm(p.input.date, `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`);
export function thisSolarReturn(p: Profile, today = new Date()): SolarReturn {
  const [, bm] = p.input.date.split("-").map(Number);
  const place = p.chart.hasAngles && p.input.place ? p.input.place : null;
  return solarReturn(p.chart.placements.sun!.lon, today.getFullYear(), bm, place);
}
export * from "./culture";
