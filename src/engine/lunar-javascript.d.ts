declare module "lunar-javascript" {
  interface EightChar {
    getYearGan(): string; getMonthGan(): string; getDayGan(): string; getTimeGan(): string;
    getYearZhi(): string; getMonthZhi(): string; getDayZhi(): string; getTimeZhi(): string;
    getYearWuXing(): string; getMonthWuXing(): string; getDayWuXing(): string; getTimeWuXing(): string;
    toString(): string;
  }
  interface Lunar {
    getYearShengXiao(): string;
    getYearShengXiaoByLiChun(): string;
    getYearGan(): string;
    getYearGanByLiChun(): string;
    getYearZhi(): string;
    getYearInGanZhi(): string;
    getDayGan(): string;
    getEightChar(): EightChar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
  }
  interface Solar { getLunar(): Lunar; }
  export const Solar: { fromYmdHms(y: number, m: number, d: number, h: number, mi: number, s: number): Solar; fromYmd(y: number, m: number, d: number): Solar };
  export const Lunar: { fromYmd(y: number, m: number, d: number): { getSolar(): { toYmd(): string } } };
  const _default: { Solar: typeof Solar; Lunar: typeof Lunar };
  export default _default;
}
