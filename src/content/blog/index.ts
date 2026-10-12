import type { BlogPost } from "./types";
import { posts as en } from "./en";
import { posts as mk } from "./mk";
export type { BlogPost, BlogBlock } from "./types";
const BY_LANG: Record<string, BlogPost[]> = { en, mk };
export const postsFor = (lang: string): BlogPost[] => (BY_LANG[lang] ?? en).slice().sort((a, b) => b.date.localeCompare(a.date));
export const postFor = (lang: string, slug: string) => postsFor(lang).find((p) => p.slug === slug) ?? null;
export const BLOG_SLUGS = en.map((p) => p.slug);
