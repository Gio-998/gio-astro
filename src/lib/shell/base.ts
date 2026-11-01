/**
 * The part of the content every page needs in the browser: what the header, footer, menus and small page widgets read while they render.
 * Everything else loads on demand (see lib/content-lazy.ts). tests/content-shell.test.ts checks that each value equals the real content.
 * A key missing here is never a bug for the reader, only a heavier page: the read falls through to the full content.
 */
import { site } from "@/content/en/site";
import * as ui from "@/content/en/ui";
import * as quizzes from "@/content/en/quizzes";
import { you, partners } from "@/content/en/you";
import { how } from "@/content/en/systems/how";

export const PARTIAL_KEYS = ["systems"] as const;
export const enShell = { site, ui, quizzes, you, partners, systems: { how: { link: how.link } } };

type Obj = Record<string, unknown>;
/** Same rules as deepMerge in src/content/index.ts: override key by key; functions, arrays and primitives replace, untranslated keys keep the English text. */
export function merge<T>(base: T, over: unknown): T {
  if (over === undefined) return base;
  if (typeof base !== "object" || base === null || Array.isArray(base) || typeof over !== "object" || over === null || Array.isArray(over)) return over as T;
  const out: Obj = { ...(base as Obj) };
  for (const [k, v] of Object.entries(over as Obj)) out[k] = merge((base as Obj)[k], v);
  return out as T;
}
