// Copy checker: keeps user-facing English text free of dashes-as-punctuation and common AI-sounding phrases.
// Scans string literals, template text and JSX text in src/**/*.ts(x). Skips Macedonian (src/content/mk and any
// string containing Cyrillic), code comments, imports, object keys and className/href-style attributes.
// Escape hatch for a deliberate exception: put `copy-ok` in a comment on the same line.
// See STYLE-GUIDE.md for the full rules.
// Also runs the lead copy rules over the text of every language (lead-copy-rules.mjs).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { textRanges } from "./copy-strings.mjs";
import { leadCopyProblem } from "./lead-copy-rules.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRS = [path.join("src", "content", "mk")];
/** Files only an admin ever sees, or that only render on a build with NEXT_PUBLIC_BETA=1. */
const NOT_PUBLIC = /[\\/](?:admin\.ts|Beta\.tsx|AdminPanel\.tsx)$|[\\/]admin[\\/]/;

/** [regex, message]. All case-insensitive, matched against one text chunk at a time. */
export const RULES = [
  [/[—–]/u, "em/en dash: use a comma, period, colon or parentheses"],
  [/\s-\s/u, "spaced hyphen used as a dash"],
  [/\bdelv(e|es|ed|ing)\b/i, "'delve'"],
  [/\btapestr(y|ies)\b/i, "'tapestry'"],
  [/\brealms?\b/i, "'realm'"],
  [/\bembark/i, "'embark'"],
  [/\bjourney/i, "'journey'"],
  [/\btestament\b/i, "'testament'"],
  [/\bnavigat(e|es|ed|ing)\b/i, "'navigate'"],
  [/\bunlock (your|their|our) (true |full )?potential\b/i, "'unlock your potential'"],
  [/\bin a world where\b/i, "'in a world where'"],
  [/\bit'?s not just\b|\bit is not just\b/i, "'it's not just X, it's Y'"],
  [/\bwhether you'?re\b[^.]*\bor\b/i, "'whether you're X or Y'"],
  [/\btruly\b/i, "'truly'"],
  [/\bprofound(ly)?\b/i, "'profound(ly)'"],
  [/\bwov(en)\b|\bweav(e|es|ing)\b/i, "'woven/weave'"],
  [/\btransformative\b/i, "'transformative'"],
  [/\bseamless(ly)?\b/i, "'seamless'"],
  [/\b(elevate|empower|unleash|harness)(s|ed|ing)?\b/i, "hype verb"],
  [/\bholistic\b|\bbeacon\b|\bgame[- ]changer\b|\btreasure trove\b|\bever-evolving\b|\bvibrant\b|\bintricate\b/i, "hype word"],
  [/\b(foster|resonat)(e|es|ed|ing)?\b/i, "'foster/resonate'"],
  [/\bembrac(e|es|ing)\b/i, "'embrace'"],
  [/\bcosmic journey|soul's journey|magic happens\b/i, "cliché"],
];

function walk(dir, out = [], skip = SKIP_DIRS) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!skip.some((s) => p.endsWith(s))) walk(p, out, skip); }
    else if (/\.(ts|tsx)$/.test(e.name) && !e.name.endsWith(".d.ts")) out.push(p);
  }
  return out;
}

/** Every language, Cyrillic included, because the promises being retired were made in all of them. */
export function checkLeadCopy(root = ROOT) {
  const problems = [];
  for (const file of walk(path.join(root, "src"), [], [])) {
    if (NOT_PUBLIC.test(file)) continue;
    const { src, ranges } = textRanges(file);
    const lines = src.split("\n");
    for (const r of ranges) {
      const hit = leadCopyProblem(src.slice(r.start, r.end));
      if (!hit) continue;
      const line = src.slice(0, r.start).split("\n").length;
      if (/copy-ok/.test(lines[line - 1] ?? "")) continue;
      problems.push({ file: path.relative(root, file), line, msg: hit[1], excerpt: hit[0] });
    }
  }
  return problems;
}

export function checkCopy(root = ROOT) {
  const problems = [];
  for (const file of walk(path.join(root, "src"))) {
    const { src, ranges } = textRanges(file);
    const lines = src.split("\n");
    for (const r of ranges) {
      const text = src.slice(r.start, r.end);
      if (/\p{Script=Cyrillic}/u.test(text)) continue;
      if (/^\s*[—–]\s*$/u.test(text)) continue; // a lone dash used as an empty-value placeholder, not punctuation
      for (const [rx, msg] of RULES) {
        const m = text.match(rx);
        if (!m) continue;
        const line = src.slice(0, r.start + (m.index ?? 0)).split("\n").length;
        if (/copy-ok/.test(lines[line - 1] ?? "")) continue;
        const i = m.index ?? 0;
        problems.push({ file: path.relative(root, file), line, msg, excerpt: text.slice(Math.max(0, i - 40), i + 40).replace(/\s+/g, " ") });
      }
    }
  }
  return problems;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const problems = [...checkCopy(), ...checkLeadCopy()];
  for (const p of problems) console.log(`${p.file}:${p.line}  ${p.msg}  …${p.excerpt}…`);
  if (problems.length) { console.error(`\ncheck:copy found ${problems.length} problem(s). See STYLE-GUIDE.md.`); process.exit(1); }
  console.log("check:copy: all English copy is clean.");
}
