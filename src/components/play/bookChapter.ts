import { GAME_DIMS, PLAY_GAMES, levelOf10, playProfile, sayVsPlay } from "@/engine/play";
import type { Profile } from "@/engine/profile";
import type { Content } from "@/content";
import type { Block, Chapter } from "@/story/types";
import { playForContent } from "./content";

/** Book of You chapter "How you play" (only when at least one Play Mirror game was played). */
export function playChapter(p: Profile, c: Content): Chapter | null {
  const prof = playProfile(p.quiz); if (!prof) return null;
  const P = playForContent(c); const b: Block[] = [];
  b.push({ t: "lead", text: P.book.lead });
  for (const g of PLAY_GAMES) {
    if (!prof.games.includes(g)) continue;
    b.push({ t: "h", text: P.games[g].name });
    for (const d of GAME_DIMS[g]) { const v = prof.dims[d]; if (v != null) b.push({ t: "p", text: `${P.dims[d].name}: ${P.dims[d].text[levelOf10(v)]}` }); }
  }
  const { gaps } = sayVsPlay(prof, { bigFive: p.quiz.bigFive, attachment: p.quiz.attachment });
  for (const gp of gaps.slice(0, 3)) { const line = gp.gap > 0 ? P.dims[gp.dim].up : P.dims[gp.dim].down; if (line) b.push({ t: "callout", tone: "differ", title: P.book.gapTitle, text: line }); }
  b.push({ t: "callout", tone: "note", text: P.hub.honest });
  return { id: "play", title: P.book.title, kicker: P.book.kicker, art: { kind: "emblem", id: "explorer" }, blocks: b, locked: false, missing: [] };
}
