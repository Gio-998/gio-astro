/**
 * Slot for the "Your day" story (daily-stories work: src/story/day.ts → dayStory()).
 * Today's stories show a "Your day" slide first whenever this returns content.
 * To connect it, return the DayStory here, e.g.:
 *   import { dayStory } from "@/story/day";
 *   return dayStory(profile, now, c.day, names);
 * Only these fields are read, so any object with this shape works.
 */
import type { Content } from "@/content";
import type { Profile } from "@/engine/profile";

export interface YourDay { paragraphs: string[]; motto: string; practice: string; question: string }

export function yourDayFor(_profile: Profile, _now: Date, _c: Content): YourDay | null {
  return null;
}
