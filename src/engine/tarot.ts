export const MAJOR_ARCANA = [
  "fool", "magician", "high-priestess", "empress", "emperor", "hierophant", "lovers", "chariot", "strength",
  "hermit", "wheel", "justice", "hanged-one", "death", "temperance", "devil", "tower", "star", "moon", "sun",
  "judgement", "world",
] as const;
export type MajorCard = (typeof MAJOR_ARCANA)[number];

/** Classical elemental attribution of the Major Arcana (Golden-Dawn style, simplified). */
export const CARD_ELEMENT: Record<MajorCard, "fire" | "earth" | "air" | "water"> = {
  fool: "air", magician: "air", "high-priestess": "water", empress: "earth", emperor: "fire", hierophant: "earth",
  lovers: "air", chariot: "water", strength: "fire", hermit: "earth", wheel: "fire", justice: "air",
  "hanged-one": "water", death: "water", temperance: "fire", devil: "earth", tower: "fire", star: "air",
  moon: "water", sun: "fire", judgement: "fire", world: "earth",
};

const digitSum = (n: number) => String(n).split("").reduce((s, c) => s + Number(c), 0);

/**
 * Tarot birth cards (method popularised by Mary K. Greer): add month + day + year,
 * reduce by digit sums until ≤ 22. 22 = the Fool (paired with the Emperor, 2+2=4).
 * If the number is 10–21 its digit sum gives a second card; 19 gives three (19 → 10 → 1).
 */
export function birthCards(date: string): { number: number; cards: number[] } {
  const [y, m, d] = date.split("-").map(Number);
  let n = y + m + d;
  while (n > 22) n = digitSum(n);
  const cards: number[] = [];
  if (n === 22) return { number: 22, cards: [0, 4] };
  cards.push(n);
  let k = n;
  while (k >= 10) { k = digitSum(k); cards.push(k); }
  return { number: n, cards };
}

/** Relationship card: add both birth numbers and reduce to ≤ 21 (22 → Fool). */
export function relationshipCard(a: number, b: number): number {
  let n = a + b;
  while (n > 22) n = digitSum(n);
  return n === 22 ? 0 : n;
}
