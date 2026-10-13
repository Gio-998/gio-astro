import { premium as en } from "@/content/en/premium";
import { premium as mk } from "@/content/mk/premium";
import { premium as de } from "@/content/de/premium";
import type { ProductId } from "@/lib/payments";
import type { EmblemId } from "../art/Emblem";
import type { Cosmos } from "../art/ArtCard";

export const premiumText = (l: string) => (l === "mk" ? mk : l === "de" ? de : en);

/** Cover art for each product card / page. */
export const LOOK: Record<ProductId, { emblem: EmblemId; img: Cosmos; tint: "violet" | "rose" | "gold" | "aqua"; glyph: string }> = {
  premium: { emblem: "sun", img: "helix", tint: "gold", glyph: "✦" },
  "soul-blueprint": { emblem: "eye", img: "pillars", tint: "violet", glyph: "📜" },
  "couple-deep-dive": { emblem: "bond", img: "twinjet", tint: "rose", glyph: "💞" },
  "year-ahead": { emblem: "moon", img: "cliffs", tint: "aqua", glyph: "☾" },
  constellation: { emblem: "chart", img: "milkyway", tint: "violet", glyph: "✶" },
  hardcover: { emblem: "tarot", img: "orion", tint: "gold", glyph: "📖" },
  session: { emblem: "care", img: "mountain", tint: "aqua", glyph: "☏" },
  "gift-card": { emblem: "palette", img: "storm", tint: "rose", glyph: "🎁" },
};
