import * as Astronomy from "astronomy-engine";
import { norm360 } from "./util";
/**
 * Mean Black Moon Lilith = mean lunar apogee = mean perigee + 180°.
 * Mean perigee longitude: Meeus, Astronomical Algorithms (2nd ed.), ch. 50 (from Chapront ELP-2000/82).
 * Agrees with the Swiss Ephemeris "mean apogee" to about 0.1° over 1900-2100 (SE adds small corrections).
 */
export function meanLilith(date: Date): number {
  const T = Astronomy.MakeTime(date).tt / 36525;
  const perigee = 83.3532465 + 4069.0137287 * T - 0.01032 * T * T - (T * T * T) / 80053 + (T * T * T * T) / 18999000;
  return norm360(perigee + 180);
}
