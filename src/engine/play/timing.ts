/**
 * Answer timing as a certainty signal. For every questionnaire item we keep how long the answer took (minus a
 * reading allowance per word) and how often it was changed. Very quick answers usually point to the clearest
 * parts of someone; long pauses and changes of mind mark the grey zones. A very fast run overall is flagged as
 * possibly careless. Stored per quiz under QuizResults.timing (synced as quiz_id "timing").
 */
export interface ItemTiming { ms: number; words: number; changes: number }
export interface AnswerTiming { v: 1; at: string; n: number; medianMs: number; instant: string[]; slow: string[]; changed: string[]; certainty: number; careless: boolean; items: Record<string, ItemTiming> }

const READ_MS_PER_WORD = 110;
const med = (xs: number[]) => { if (!xs.length) return 0; const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
export const adjusted = (t: ItemTiming) => Math.max(0, t.ms - READ_MS_PER_WORD * t.words);

export function summarizeTiming(items: Record<string, ItemTiming>, at = new Date().toISOString()): AnswerTiming {
  const ids = Object.keys(items); const n = ids.length;
  const adj = Object.fromEntries(ids.map((id) => [id, adjusted(items[id])]));
  const raw = ids.map((id) => items[id].ms);
  const m = med(ids.map((id) => adj[id]));
  const instant = ids.filter((id) => adj[id] <= Math.max(500, 0.45 * m)).sort((a, b) => adj[a] - adj[b]);
  const slow = ids.filter((id) => adj[id] >= Math.max(5000, 2.2 * m)).sort((a, b) => adj[b] - adj[a]);
  const changed = ids.filter((id) => items[id].changes > 0);
  const share = (xs: string[]) => (n ? xs.length / n : 0);
  const certainty = Math.round(Math.min(10, Math.max(0, 10 * (0.6 + 0.4 * share(instant) - 0.6 * share(slow) - 0.9 * share(changed)))) * 10) / 10;
  const careless = n >= 6 && (med(raw) < 900 || raw.filter((x) => x < 600).length / n > 0.6);
  return { v: 1, at, n, medianMs: Math.round(m), instant, slow, changed, certainty, careless, items };
}
