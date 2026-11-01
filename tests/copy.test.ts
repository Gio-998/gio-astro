import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

describe("copy style (STYLE-GUIDE.md)", () => {
  // In a child process: the check reads all of src, and on a busy machine that would hold a worker past vitest's 60 second heartbeat.
  it("English UI and content text has no dashes-as-punctuation or banned AI phrases", async () => {
    const out = await run(process.execPath, ["scripts/check-copy.mjs"], { maxBuffer: 2 ** 26 }).then((r) => r.stdout, (e: { stdout: string; stderr: string }) => `${e.stdout}${e.stderr}`);
    expect(out).toContain("all English copy is clean");
  }, 180_000);
});
