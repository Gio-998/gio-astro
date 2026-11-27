/**
 * A direct answer for one numerology page, shown first under the question people type, plus a love section
 * that speaks to people who are single, in a relationship or just out of one. Written per page and per language.
 * Limits, enforced by tests/numerology-answers.test.ts: the answer is 40 to 60 words and names the number.
 */
export type QuickAnswer = {
  /** Heading of the answer. Without it the page uses its own "What does N mean?" question. */
  question?: string;
  answer: string;
  love?: { title: string; paras: string[] };
};
/** Keyed like the search snippets: "angel-numbers/1313", "mirror-hours/21-21", or "mirror-hours" for the hub. */
export type AnswerSet = Record<string, QuickAnswer>;
