import { Solar, Lunar } from "lunar-javascript";
import * as Astronomy from "astronomy-engine";

export const ANIMALS = ["rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "goat", "monkey", "rooster", "dog", "pig"] as const;
export type Animal = (typeof ANIMALS)[number];
export const WUXING = ["wood", "fire", "earth", "metal", "water"] as const;
export type WuXing = (typeof WUXING)[number];

const ZH_ANIMAL: Record<string, Animal> = {
  "鼠": "rat", "牛": "ox", "虎": "tiger", "兔": "rabbit", "龙": "dragon", "蛇": "snake",
  "马": "horse", "羊": "goat", "猴": "monkey", "鸡": "rooster", "狗": "dog", "猪": "pig",
};
const GAN_ELEMENT: Record<string, WuXing> = {
  "甲": "wood", "乙": "wood", "丙": "fire", "丁": "fire", "戊": "earth", "己": "earth",
  "庚": "metal", "辛": "metal", "壬": "water", "癸": "water",
};
const YANG_GAN = new Set(["甲", "丙", "戊", "庚", "壬"]);
const ZH_WUXING: Record<string, WuXing> = { "木": "wood", "火": "fire", "土": "earth", "金": "metal", "水": "water" };

export const ANIMAL_GLYPH: Record<Animal, string> = {
  rat: "🐀", ox: "🐂", tiger: "🐅", rabbit: "🐇", dragon: "🐉", snake: "🐍",
  horse: "🐎", goat: "🐐", monkey: "🐒", rooster: "🐓", dog: "🐕", pig: "🐖",
};
export const ANIMAL_HANZI: Record<Animal, string> = {
  rat: "鼠", ox: "牛", tiger: "虎", rabbit: "兔", dragon: "龍", snake: "蛇",
  horse: "馬", goat: "羊", monkey: "猴", rooster: "雞", dog: "狗", pig: "豬",
};
/** Fixed element of each animal's earthly branch (used for hub pages). */
export const ANIMAL_FIXED_ELEMENT: Record<Animal, WuXing> = {
  rat: "water", ox: "earth", tiger: "wood", rabbit: "wood", dragon: "earth", snake: "fire",
  horse: "fire", goat: "earth", monkey: "metal", rooster: "metal", dog: "earth", pig: "water",
};

export interface ChineseProfile {
  /** Animal by Lunar New Year (folk convention, what most people mean). */
  animal: Animal;
  /** Animal by Li Chun (start of spring ~4 Feb, BaZi convention), from the exact solar-term instant. */
  animalLiChun: Animal;
  /** Year element from the heavenly stem (Lunar New Year year). */
  element: WuXing;
  yinYang: "yin" | "yang";
  /** Gregorian date of the Lunar New Year that starts this person's zodiac year. */
  lunarNewYear: string;
  /** Day Master (stem of the day pillar): the "self" element in BaZi. */
  dayMaster: { element: WuXing; yinYang: "yin" | "yang" };
  /** Element counts across pillars (year, month, day, + hour when time known). */
  balance: Record<WuXing, number>;
  pillars: string;
  conventionsDiffer: boolean;
  /**
   * How the day and hour pillars were timed: "true-solar" = local apparent solar time at the birthplace
   * (classical BaZi practice: removes DST and time-zone offsets), "clock" = the clock time as entered.
   */
  hourBasis: "true-solar" | "clock" | "none";
  /** Local apparent solar time used for the hour pillar (HH:mm), when hourBasis is "true-solar". */
  solarTime?: string;
  /** True when the birth time is unknown and the month pillar changes during that day (a solar term falls on it). */
  monthAmbiguous: boolean;
}

const ZHI_ANIMAL: Record<string, Animal> = {
  "子": "rat", "丑": "ox", "寅": "tiger", "卯": "rabbit", "辰": "dragon", "巳": "snake",
  "午": "horse", "未": "goat", "申": "monkey", "酉": "rooster", "戌": "dog", "亥": "pig",
};

const solarOf = (d: Date) => Solar.fromYmdHms(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());

/**
 * Local apparent (true) solar time at a longitude for a UT instant, returned as a Date whose UTC fields
 * read as the solar clock. Uses the Sun's actual hour angle, so the equation of time is included.
 */
export function trueSolarClock(utc: Date, lon: number, lat = 0): Date {
  const t = Astronomy.MakeTime(utc);
  const ha = Astronomy.HourAngle(Astronomy.Body.Sun, t, new Astronomy.Observer(lat, lon, 0)); // hours, 0 = local noon
  const apparent = (ha + 12) % 24;
  const mean = (((utc.getUTCHours() + utc.getUTCMinutes() / 60 + utc.getUTCSeconds() / 3600 + lon / 15) % 24) + 24) % 24;
  let eot = apparent - mean;
  if (eot > 12) eot -= 24;
  if (eot < -12) eot += 24;
  return new Date(utc.getTime() + (lon / 15 + eot) * 3600000);
}

export interface ChineseTiming {
  /** Birth instant in UT, when the local time and the zone are known. */
  utc?: Date;
  /** Birthplace longitude/latitude (east positive), for true solar time. */
  lon?: number;
  lat?: number;
}

/**
 * Compute Chinese zodiac data.
 * - Animal by Lunar New Year uses the local civil birth date (folk convention).
 * - Year and month pillars change at the exact solar-term instants (Li Chun, Jing Zhe, ...), which
 *   lunar-javascript tabulates in China Standard Time, so the birth instant is converted to UTC+8 first.
 * - Day and hour pillars use local true solar time when the place and time are known, else the clock time.
 *   The day pillar changes at midnight (lunar-javascript's default school).
 */
export function chineseProfile(date: string, time: string | null, timing: ChineseTiming = {}): ChineseProfile {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mi] = (time ?? "12:00").split(":").map(Number);
  const local = Solar.fromYmdHms(y, m, d, hh, mi || 0, 0).getLunar();
  const animal = ZH_ANIMAL[local.getYearShengXiao()];
  const gan = local.getYearGan();

  // Year + month pillars: from the absolute instant when we have it.
  const known = !!time && !!timing.utc;
  const ym = known ? solarOf(new Date(timing.utc!.getTime() + 8 * 3600000)).getLunar().getEightChar() : local.getEightChar();
  // Day + hour pillars: from true solar time at the birthplace when possible.
  let hourBasis: ChineseProfile["hourBasis"] = time ? "clock" : "none";
  let solarTime: string | undefined;
  let dh = local.getEightChar();
  if (known && timing.lon != null) {
    const sc = trueSolarClock(timing.utc!, timing.lon, timing.lat ?? 0);
    dh = solarOf(sc).getLunar().getEightChar();
    hourBasis = "true-solar";
    solarTime = `${String(sc.getUTCHours()).padStart(2, "0")}:${String(sc.getUTCMinutes()).padStart(2, "0")}`;
  }
  const yearPillar = ym.getYearGan() + ym.getYearZhi();
  const monthPillar = ym.getMonthGan() + ym.getMonthZhi();
  const dayPillar = dh.getDayGan() + dh.getDayZhi();
  const timePillar = dh.getTimeGan() + dh.getTimeZhi();

  const balance: Record<WuXing, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const parts = [ym.getYearWuXing(), ym.getMonthWuXing(), dh.getDayWuXing()];
  if (time) parts.push(dh.getTimeWuXing());
  for (const p of parts) for (const ch of p) if (ZH_WUXING[ch]) balance[ZH_WUXING[ch]]++;

  let monthAmbiguous = false;
  if (!time) {
    const a = Solar.fromYmdHms(y, m, d, 0, 0, 0).getLunar().getEightChar(), b = Solar.fromYmdHms(y, m, d, 23, 59, 0).getLunar().getEightChar();
    monthAmbiguous = a.getMonthZhi() !== b.getMonthZhi();
  }
  const dayGan = dh.getDayGan();
  const animalLiChun = ZHI_ANIMAL[ym.getYearZhi()];
  const ny = Lunar.fromYmd(local.getYear(), 1, 1).getSolar().toYmd();
  return {
    animal, animalLiChun,
    element: GAN_ELEMENT[gan],
    yinYang: YANG_GAN.has(gan) ? "yang" : "yin",
    lunarNewYear: ny,
    dayMaster: { element: GAN_ELEMENT[dayGan], yinYang: YANG_GAN.has(dayGan) ? "yang" : "yin" },
    balance,
    pillars: [yearPillar, monthPillar, dayPillar, ...(time ? [timePillar] : [])].join(" "),
    conventionsDiffer: animal !== animalLiChun,
    hourBasis, solarTime, monthAmbiguous,
  };
}

/** Gregorian date (YYYY-MM-DD) of Lunar New Year for a given lunar year. */
export function lunarNewYearDate(year: number): string {
  return Lunar.fromYmd(year, 1, 1).getSolar().toYmd();
}

/** Animal/element of a Gregorian year (for years after its Lunar New Year). */
export function yearAnimal(year: number): { animal: Animal; element: WuXing; yinYang: "yin" | "yang" } {
  const animal = ANIMALS[(((year - 4) % 12) + 12) % 12];
  const last = ((year % 10) + 10) % 10;
  const element = (["metal", "metal", "water", "water", "wood", "wood", "fire", "fire", "earth", "earth"] as WuXing[])[last];
  return { animal, element, yinYang: year % 2 === 0 ? "yang" : "yin" };
}

// ——— Pair relationships ———
const SIX_HARMONIES = [["rat", "ox"], ["tiger", "pig"], ["rabbit", "dog"], ["dragon", "rooster"], ["snake", "monkey"], ["horse", "goat"]];
const TRINES = [["rat", "dragon", "monkey"], ["ox", "snake", "rooster"], ["tiger", "horse", "dog"], ["rabbit", "goat", "pig"]];
const HARMS = [["rat", "goat"], ["ox", "horse"], ["tiger", "snake"], ["rabbit", "dragon"], ["monkey", "pig"], ["rooster", "dog"]];
const CLASHES = [["rat", "horse"], ["ox", "goat"], ["tiger", "monkey"], ["rabbit", "rooster"], ["dragon", "dog"], ["snake", "pig"]];

export type AnimalRelation = "six-harmony" | "trine" | "same" | "neutral" | "harm" | "clash";
const inPair = (list: string[][], a: string, b: string) => list.some((g) => g.includes(a) && g.includes(b) && a !== b);

export function animalRelation(a: Animal, b: Animal): AnimalRelation {
  if (a === b) return "same";
  if (inPair(SIX_HARMONIES, a, b)) return "six-harmony";
  if (inPair(TRINES, a, b)) return "trine";
  if (inPair(CLASHES, a, b)) return "clash";
  if (inPair(HARMS, a, b)) return "harm";
  return "neutral";
}

const GENERATES: Record<WuXing, WuXing> = { wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood" };
const CONTROLS: Record<WuXing, WuXing> = { wood: "earth", earth: "water", water: "fire", fire: "metal", metal: "wood" };
export type ElementRelation = "same" | "generating" | "controlling";
export function elementRelation(a: WuXing, b: WuXing): { rel: ElementRelation; from?: WuXing; to?: WuXing } {
  if (a === b) return { rel: "same" };
  if (GENERATES[a] === b) return { rel: "generating", from: a, to: b };
  if (GENERATES[b] === a) return { rel: "generating", from: b, to: a };
  if (CONTROLS[a] === b) return { rel: "controlling", from: a, to: b };
  return { rel: "controlling", from: b, to: a };
}
