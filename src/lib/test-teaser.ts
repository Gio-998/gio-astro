/** The short preview of a result, shown before the lead form: a headline and one paragraph. */
import type { Content } from "@/content";
import type { glance } from "@/content/en/glance";
import type { adaptive } from "@/content/en/adaptive";
import { TRAITS } from "@/engine/bigfive";
import type { QuizView } from "./profile";
import type { TestId } from "./test-run";

export interface Teaser { title: string; text: string }
const lvl = (p: number) => (p >= 62 ? "high" : p <= 38 ? "low" : "mid") as "low" | "mid" | "high";

export function teaserFor(id: TestId, v: QuizView, c: Content, G: typeof glance, A: typeof adaptive): Teaser | null {
  const q = v.quiz; const P = c.psych; const U = c.ui.profile;
  switch (id) {
    case "big-five": case "big-five-long": {
      if (id === "big-five-long" ? !q.bigFiveLong : !q.bigFive) return null;
      const t = v.psych?.temperament; if (!t) return null;
      const x = P.temperaments[t.primary];
      return { title: x.name, text: x.text };
    }
    case "four-letter": {
      if (!q.fourLetter || !v.fourLetter) return null;
      const s = P.fourLetterStyles[v.fourLetter.code];
      return { title: `${v.fourLetter.code} · ${s.name}`, text: s.text };
    }
    case "attachment": {
      if (!q.attachment) return null;
      const x = P.attachment[q.attachment.style];
      return { title: x.name, text: x.text };
    }
    case "nine": {
      if (!q.nine) return null;
      const x = P.nineStyles[q.nine.type];
      return { title: x.name, text: U.nineCore(x.core, x.gift) };
    }
    case "care": {
      if (!q.care) return null;
      const [a, b] = q.care.topReceive;
      return { title: `${P.care[a].name} · ${P.care[b].name}`, text: `${G.careHead(P.care[a].name, P.care[b].name)} ${G.careGives(P.care[q.care.give].name)}` };
    }
    case "shadow": {
      if (!q.shadow) return null;
      const L = P.shadowAxes[q.shadow.strongestLight], S = P.shadowAxes[q.shadow.mainShadow];
      return { title: `${L.virtue} · ${S.classical}`, text: G.shadowHead(L.virtue, S.classical) };
    }
    case "dosha": {
      if (!q.dosha) return null;
      const [head, ...rest] = P.constitutions[q.dosha.constitution].split(/: /);
      return { title: head, text: q.dosha.constitution === "tridoshic" ? U.tridoshic : P.doshas[q.dosha.dominant].text || rest.join(": ") };
    }
    case "explorer": {
      if (!q.explorer) return null;
      const l = q.explorer.explorer < 40 ? "low" : q.explorer.explorer > 60 ? "high" : "mid";
      return { title: G.explorerHead[l], text: P.explorer[l] };
    }
    case "adaptive": {
      const r = q.adaptive; if (!r) return null;
      const top = [...TRAITS].sort((a, b) => Math.abs(r.pct[b] - 50) - Math.abs(r.pct[a] - 50))[0];
      const s = P.fourLetterStyles[r.code];
      return { title: s ? `${r.code} · ${s.name}` : r.code, text: A.traits[top].text[lvl(r.pct[top])] };
    }
  }
}
