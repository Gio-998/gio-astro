import type { MajorCard } from "../tarot";
import { MAJOR_ARCANA } from "../tarot";
/**
 * Tree of Life, in the Hermetic Qabalah of the Hermetic Order of the Golden Dawn (London, 1888) as set out in
 * Israel Regardie, "The Golden Dawn" (1937-40) and S. L. MacGregor Mathers' Tarot papers. This is a Western
 * esoteric adaptation, distinct from Jewish Kabbalah as a religious tradition, and we say so in the UI.
 * - Sephirah from the life path: 1 Kether … 9 Yesod (masters reduce: 11 → 2, 22 → 4, 33 → 6, noted in the text).
 * - Path from the main tarot birth card, using the Golden Dawn attribution of the 22 trumps to paths 11-32
 *   (Strength on path 19 / Teth and Justice on path 22 / Lamed, the Golden Dawn swap).
 */
export const SEPHIROT = ["kether", "chokmah", "binah", "chesed", "geburah", "tiphareth", "netzach", "hod", "yesod", "malkuth"] as const;
export type Sephirah = (typeof SEPHIROT)[number];
const PATH: Record<MajorCard, { path: number; letter: string; from: Sephirah; to: Sephirah }> = {
  fool: { path: 11, letter: "א", from: "kether", to: "chokmah" }, magician: { path: 12, letter: "ב", from: "kether", to: "binah" },
  "high-priestess": { path: 13, letter: "ג", from: "kether", to: "tiphareth" }, empress: { path: 14, letter: "ד", from: "chokmah", to: "binah" },
  emperor: { path: 15, letter: "ה", from: "chokmah", to: "tiphareth" }, hierophant: { path: 16, letter: "ו", from: "chokmah", to: "chesed" },
  lovers: { path: 17, letter: "ז", from: "binah", to: "tiphareth" }, chariot: { path: 18, letter: "ח", from: "binah", to: "geburah" },
  strength: { path: 19, letter: "ט", from: "chesed", to: "geburah" }, hermit: { path: 20, letter: "י", from: "chesed", to: "tiphareth" },
  wheel: { path: 21, letter: "כ", from: "chesed", to: "netzach" }, justice: { path: 22, letter: "ל", from: "geburah", to: "tiphareth" },
  "hanged-one": { path: 23, letter: "מ", from: "geburah", to: "hod" }, death: { path: 24, letter: "נ", from: "tiphareth", to: "netzach" },
  temperance: { path: 25, letter: "ס", from: "tiphareth", to: "yesod" }, devil: { path: 26, letter: "ע", from: "tiphareth", to: "hod" },
  tower: { path: 27, letter: "פ", from: "netzach", to: "hod" }, star: { path: 28, letter: "צ", from: "netzach", to: "yesod" },
  moon: { path: 29, letter: "ק", from: "netzach", to: "malkuth" }, sun: { path: 30, letter: "ר", from: "hod", to: "yesod" },
  judgement: { path: 31, letter: "ש", from: "hod", to: "malkuth" }, world: { path: 32, letter: "ת", from: "yesod", to: "malkuth" },
};
export interface TreeOfLife { sephirah: Sephirah; fromMaster: number | null; card: MajorCard; path: number; letter: string; from: Sephirah; to: Sephirah }
export function treeOfLife(lifePath: number, tarotCards: number[]): TreeOfLife {
  const base = lifePath === 11 ? 2 : lifePath === 22 ? 4 : lifePath === 33 ? 6 : lifePath;
  const k = tarotCards[0]; const card = MAJOR_ARCANA[k === 22 ? 0 : k];
  return { sephirah: SEPHIROT[base - 1], fromMaster: base !== lifePath ? lifePath : null, card, ...PATH[card] };
}
