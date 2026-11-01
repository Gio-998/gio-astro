/** Previews for the profile screens, shown before the lead form: a test result if there is one, otherwise the sky. */
import type { Content } from "@/content";
import type { Profile } from "@/engine/profile";
import type { Block } from "@/story/types";
import type { Teaser } from "./test-teaser";

const LIMIT = 260;

/** Keeps a preview short by whole sentences, so it never stops in the middle of a thought. */
export function clipText(text: string, limit = LIMIT): string {
  const t = text.trim(); if (t.length <= limit) return t;
  const sentences = t.match(/[^.!?…]+[.!?…]+["“”»«)]*\s*/g) ?? [t];
  let out = "";
  for (const s of sentences) { if (out && out.length + s.length > limit) break; out += s; }
  return out.trim();
}

/** The first paragraph of a reading. Only the plain text blocks count: a list or a quote is no opening. */
export function blockTeaser(title: string, blocks: readonly Block[]): Teaser | null {
  const first = blocks.find((b) => b.t === "lead" || b.t === "p" || b.t === "callout");
  return first && "text" in first ? { title, text: clipText(first.text) } : null;
}

/** What a birth date alone can say: Sun and Moon by name, and the Moon's paragraph, because the Sun is on the screen above it. */
export function skyTeaser(p: Profile, c: Content): Teaser {
  const S = c.astro.signs; const U = c.ui.profile;
  return { title: `${U.sunIn(S[p.sun].name)} · ${U.moonIn(S[p.moon].name)}`, text: clipText(S[p.moon].moon) };
}
