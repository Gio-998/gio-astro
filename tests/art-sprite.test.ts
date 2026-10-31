import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Emblem, EMBLEM_IDS, type EmblemId } from "@/components/art/Emblem";
import { ZodiacWheel } from "@/components/art/ZodiacWheel";
import { SvgDefs } from "@/components/art/SvgDefs";
import { QUIZ_IDS } from "@/lib/quiz-defs";

// A <use> with no matching symbol draws nothing and throws nothing, so a gap here would only show up as blank icons.
const sprite = renderToStaticMarkup(createElement(SvgDefs));
const symbol = (id: string) => sprite.match(new RegExp(`<symbol id="${id}"[^>]*>([\\s\\S]*?)</symbol>`))?.[1];

describe("art sprite", () => {
  it("draws every emblem once", () => {
    for (const id of EMBLEM_IDS) {
      expect(symbol(`emb-${id}`), id).toBeTruthy();
      expect(sprite.split(`id="emb-${id}"`).length, id).toBe(2);
    }
  });
  it("covers the emblems the quizzes and nav ask for by id", () => {
    for (const id of [...QUIZ_IDS, "chart", "moon", "sun", "bond", "explorer", "yinyang", "vedic", "eye"] as EmblemId[]) expect(EMBLEM_IDS).toContain(id);
  });
  it("keeps emblem and wheel references small and pointing at the sprite", () => {
    const e = renderToStaticMarkup(createElement(Emblem, { id: "chart", className: "h-8 w-8" }));
    expect(e).toContain('href="#emb-chart"');
    expect(e.length).toBeLessThan(120);
    const w = renderToStaticMarkup(createElement(ZodiacWheel, { className: "h-8 w-8" }));
    expect(w).toContain('href="#zodiac-wheel"');
    expect(symbol("zodiac-wheel")).toContain("url(#zw-g)");
  });
  it("keeps symbols and gradients in the one <defs> that share images copy", () => {
    expect(sprite.match(/<defs>/g)).toHaveLength(1);
    const defs = sprite.slice(sprite.indexOf("<defs>"), sprite.indexOf("</defs>"));
    for (const id of ["em-g", "zw-g", "emb-chart", "zodiac-wheel"]) expect(defs).toContain(`id="${id}"`);
  });
});
