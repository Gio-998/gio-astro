import type { NumModel } from "@/lib/numerology";

/** Sections render through the numerology page view, so a page is a NumModel plus optional dates and a tool. */
export type SectionModel = NumModel;
/** One public URL family. All paths are internal, locale-less routes, e.g. "/zodiac/aries/". See src/lib/i18n-routes.ts. */
export interface Section {
  /** Internal first path segment, matching SECTION_SLUGS. */
  key: string;
  /** Every page this build publishes, hub first. Empty until the family has content. */
  paths(): string[];
  /** Page model, or null when the path does not exist. */
  model(lang: string, path: string): SectionModel | null;
  /** Last real content change as YYYY-MM-DD, for the sitemap. */
  modified(path: string): string;
}
