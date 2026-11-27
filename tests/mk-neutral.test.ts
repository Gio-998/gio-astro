import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

/** Every Macedonian content file (folders or file names marked mk). */
function mkFiles(dir: string, out: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) mkFiles(p, out);
    else if (/\.tsx?$/.test(f) && /(^|[/\\])mk([/\\.-]|$)|-mk\./.test(path.relative("src/content", p))) out.push(p);
  }
  return out;
}

describe("Macedonian copy addresses the reader without a masculine default", () => {
  it("no 'ти си тој што' / 'си оној што' style lines anywhere in MK content", () => {
    const hits = mkFiles("src/content").flatMap((f) => (readFileSync(f, "utf8").match(/[^.]{0,40}\bси (тој|оној) (што|кој)[^.]{0,40}/g) ?? []).map((m) => `${f}: ${m}`));
    expect(hits).toEqual([]);
  });
  it("daily and period horoscope templates use no masculine-only reader forms", () => {
    const bad = /\b(си|биди|бидеш|остани|останеш|се чувствуваш) (сам|подготвен|сигурен|уморен|корисен|привлечен|немирен|искрен|присутен|ценет|напнат|директен)\b|Најпривлечен си|добива тој што|си сам или сама/g;
    const files = ["src/content/horoscope/mk.ts", "src/content/horoscope/mk-more.ts", "src/content/horoscope/mk-variety.ts", "src/content/horoscope-period/mk.ts"];
    const hits = files.flatMap((f) => (readFileSync(f, "utf8").match(bad) ?? []).map((m) => `${f}: ${m}`));
    expect(hits).toEqual([]);
  });
});
