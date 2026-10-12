/** Hellenistic lots ("Arabic parts"): Part of Fortune and Part of Spirit, with the classical day/night reversal. Needs the Ascendant. */
const n = (x: number) => ((x % 360) + 360) % 360;
export interface Lots { day: boolean; fortune: number; spirit: number }
/** Day chart when the Sun is above the horizon, i.e. 180-360° ahead of the Ascendant (houses 7 to 12). */
export function isDayChart(sun: number, asc: number): boolean { return n(sun - asc) >= 180; }
export function lots(sun: number, moon: number, asc: number): Lots {
  const day = isDayChart(sun, asc);
  return day ? { day, fortune: n(asc + moon - sun), spirit: n(asc + sun - moon) } : { day, fortune: n(asc + sun - moon), spirit: n(asc + moon - sun) };
}
