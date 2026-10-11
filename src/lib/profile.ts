import { buildProfile, Profile } from "@/engine/profile";
import type { StoredPerson } from "./store";

const memo = new Map<string, Profile>();
/** Build (and memoise) the computed profile for a stored person. */
export function profileOf(p: StoredPerson): Profile {
  const key = JSON.stringify([p.date, p.time, p.place, p.utcOffsetOverride, p.birthName, p.name, p.quiz]);
  let out = memo.get(key);
  if (!out) {
    out = buildProfile({ date: p.date, time: p.time, place: p.place, utcOffsetOverride: p.utcOffsetOverride, name: p.birthName || p.name, quiz: p.quiz });
    memo.set(key, out);
  }
  return out;
}
