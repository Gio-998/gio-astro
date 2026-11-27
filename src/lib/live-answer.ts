import type { LiveAnswer } from "./numerology";

/** Index of the timeline entry that applies at `now`: the last one that has started. The build knows the exact instants; a browser only compares them with its own clock. */
export function liveIndex(timeline: LiveAnswer["timeline"], now: number): number {
  let k = 0;
  for (let i = 0; i < timeline.length; i++) if (Date.parse(timeline[i].from) <= now) k = i;
  return k;
}
