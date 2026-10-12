import { CHARUBEL } from "./charubel-degrees";
/**
 * Degree symbol for a zodiac longitude, from "Charubel" (John Thomas, 1826-1908), "The Degrees of the Zodiac
 * Symbolised", Nichols & Co., London, 1898. Public domain. The 1925 Sabian set (Jones/Wheeler) was first
 * published in 1953 and Rudhyar's 1973 wording is in copyright, so we do not use either.
 * Convention: a body at 0°00′-0°59′ of a sign is in its "1st degree" (degrees are counted up, as in Charubel's tables).
 * Some of Charubel's pictures are harsh; those are flagged `heavy` and only shown on request.
 */
export interface DegreeSymbol { index: number; degree: number; image: string | null; heavy: boolean }
const HEAVY = /\b(blood|torture|mutilat|murder|corpse|dead|death|grave|coffin|widow|beg|vagrant|crime|hang|suicide|executed|skull|poison|gallows|slaughter|weeping|sad, and gloomy|horrid|serpent|devil|demon|prison|thief|repellent|wicked|evil)/i;
export function degreeSymbol(lon: number): DegreeSymbol {
  const index = Math.floor((((lon % 360) + 360) % 360));
  const image = CHARUBEL[index] || null;
  return { index, degree: (index % 30) + 1, image, heavy: !!image && HEAVY.test(image) };
}
