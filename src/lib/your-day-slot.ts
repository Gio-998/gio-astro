/** "Your day" story for Today's stories: the deterministic daily story from src/story/day.ts. */
import type { Content } from "@/content";
import type { Profile } from "@/engine/profile";
import { dayStory } from "@/story/day";
import { dayNames } from "@/components/day/names";

export interface YourDay { paragraphs: string[]; motto: string; practice: string; question: string }

export function yourDayFor(profile: Profile, now: Date, c: Content): YourDay | null {
  try { return dayStory(profile, now, c.day, dayNames(c)); } catch { return null; }
}
