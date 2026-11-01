// Vercel collects the site into its own output folder before postbuild runs, so the trim and the sitemap split must reach that copy too.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const run = (script, dir) => execFileSync(process.execPath, [script, dir], { stdio: "inherit" });
for (const dir of ["out", "/vercel/output/static", ".vercel/output/static"].filter((d) => existsSync(d))) {
  console.log(`postbuild: ${dir}`);
  run("scripts/trim-export.mjs", dir);
  if (existsSync(join(dir, "sitemap.xml"))) run("scripts/split-sitemap.mjs", dir);
}
