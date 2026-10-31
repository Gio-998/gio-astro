import { buildProfile, quizLayer, Profile, QuizLayer } from "@/engine/profile";
import type { StoredPerson } from "./store";

const memo = new Map<string, Profile>();
/** Build (and memoise) the computed profile for a stored person. Throws without a birth date: see quizViewOf for tests. */
export function profileOf(p: StoredPerson): Profile {
  if (!p.date) throw new Error("A profile needs a birth date");
  const name = p.birthName || (p.noName ? undefined : p.name);
  const key = JSON.stringify([p.date, p.time, p.place, p.utcOffsetOverride, name, p.quiz]);
  let out = memo.get(key);
  if (!out) {
    out = buildProfile({ date: p.date, time: p.time, place: p.place, utcOffsetOverride: p.utcOffsetOverride, name, quiz: p.quiz });
    memo.set(key, out);
  }
  return out;
}

/** What a test result view needs. A full Profile fits, and so does a guest with no birth date. */
export type QuizView = QuizLayer & Pick<Profile, "palette">;
const NEUTRAL_PALETTE = ["#8b6cf0", "#ffc861", "#5ee6d0", "#ff8fc7", "#c9b8ff"];
export function quizViewOf(p: StoredPerson): QuizView {
  return p.date ? profileOf(p) : { ...quizLayer(p.quiz), palette: NEUTRAL_PALETTE };
}
