import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (dir: string): string[] => readdirSync(dir).flatMap((n) => { const p = join(dir, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const read = (f: string) => readFileSync(`src/content/numerology/${f}`, "utf8");
const NUMEROLOGY = walk("src/content/numerology").filter((f) => f.endsWith(".ts"));

/** Numerology is a mirror, not a finding: its pages may not borrow the authority of research nobody can name. */
const UNNAMED = [
  /\b(?:\w+ )?research (?:shows|suggests|finds|found|keeps finding|consistently)\b|\bresearch on \w+ (?:shows|suggests|consistently)\b|\bstudies (?:show|suggest|find)\b|\bpsychologists? (?:\w+ ){0,4}(?:say|link|noted|call)\b|\bscientists (?:say|have found|show)\b/i,
  /\b\w*forschung (?:zeigt|findet|legt nahe)\b|\bForschung zu \w+ (?:zeigt|legt)\b|\bStudien zeigen\b|\bPsychologen (?:beobachten|sagen|verbinden)\b|\bKreativitätsforscher\b|\bBefunde der\b|\bam besten belegten\b/i,
  /истражувањата? [^.]{0,30}покажуваат|психолозите [^.]{0,30}(?:велат|нарекуваат|поврзуваат|забележале)|истражувањата за продуктивност/iu,
  /istraživanja [^.]{0,30}pokazuju|psiholozi [^.]{0,30}(?:kažu|primetili)|psihologija zdrave/iu,
];

describe("numerology content makes no unnamed research claims", () => {
  it.each(UNNAMED.map((rx) => [rx.source.slice(0, 30), rx] as const))("%s", (_, rx) => {
    const hits = NUMEROLOGY.flatMap((f) => readFileSync(f, "utf8").split("\n").flatMap((line, i) => { const m = line.match(rx); return m ? [`${f}:${i + 1} ${m[0]}`] : []; }));
    expect(hits).toEqual([]);
  });
});

describe("corrected facts", () => {
  it("1313 gives the real count of lunar months in a solar year, in every language", () => {
    const said = { en: "about 12.4 lunar months", de: "etwa 12,4 Mondmonate", mk: "околу 12,4 лунарни месеци", sr: "oko 12,4 lunarna meseca" };
    for (const [l, text] of Object.entries(said)) {
      const src = read(`long/${l}-b5.ts`);
      expect(src, l).toContain(text);
      expect(src, l).not.toMatch(/thirteen lunar months|dreizehn Mondmonate|тринаесет лунарни месеци|trinaest lunarnih meseci/);
    }
  });
  it("the life path pairs drop the misattribution and the health results", () => {
    for (const f of ["en", "de", "mk"]) expect(read(`pairs/${f}.ts`), f).not.toMatch(/Augustin|Августин|painkillers|Schmerzmitteln|лекови против болка|not spoken for months|seit Monaten nicht gesprochen|со месеци не зборувала/);
  });
  it("birthday portraits read as imagined in every language", () => {
    const titles = { en: "An imagined portrait", de: "Ein erdachtes Porträt", mk: "Замислен портрет", sr: "Zamišljen portret" };
    for (const [l, t] of Object.entries(titles)) expect(read(`birthdays/${l}.ts`).split(`"title": "${t}"`).length - 1, l).toBe(31);
    for (const [l, old] of [["en", "A short portrait"], ["de", "Ein kurzes Porträt"], ["mk", "Краток портрет"]]) expect(read(`birthdays/${l}.ts`), l).not.toContain(old);
  });
});
