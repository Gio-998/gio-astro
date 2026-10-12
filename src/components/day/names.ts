import type { Content } from "@/content";
import type { Names } from "@/story/day";
export const dayNames = (c: Content): Names => ({
  point: (k) => c.day.ui.yourPoint(c.astro.points[k as keyof typeof c.astro.points].name),
  planet: (k) => c.astro.points[k as keyof typeof c.astro.points].name,
  sign: (s) => c.astro.signs[s].name,
  weekday: (d) => c.site.weekdays[d.getDay()],
});
