import { describe, it, expect } from "vitest";
// @ts-ignore plain ESM script without type declarations
import { checkCopy } from "../scripts/check-copy.mjs";

describe("copy style (STYLE-GUIDE.md)", () => {
  it("English UI and content text has no dashes-as-punctuation or banned AI phrases", () => {
    const problems = checkCopy() as { file: string; line: number; msg: string; excerpt: string }[];
    expect(problems.map((p) => `${p.file}:${p.line} ${p.msg} …${p.excerpt}…`)).toEqual([]);
  });
});
