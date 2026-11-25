// `npm run build:app`: the slim static export packed into the store app (Capacitor webDir = out-app/).
// The website build (`npm run build` → out/) is untouched: this runs the same Next build with APP_EXPORT=1, which
//   - resolves "@/app-mode" to src/app-mode/native.tsx (native boot, tabs, live daily text, reminders, widget bridge),
//   - renders the sign pages as a client view that computes the reading for the device's own today (Europe/Skopje),
//   - skips the dated horoscope archive (one "_" placeholder per locale instead of ~3,000 pages),
// and then deletes every route the app does not ship (src/app-mode/routes.ts), plus sitemaps, robots, share images and redirect files.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { isBundled } from "../src/app-mode/routes.ts";
import { SECTION_SLUGS } from "../src/lib/i18n-routes.ts";

const OUT = "out-app";
const LOCALES = ["en", "mk", "de", "sr"];
fs.rmSync(OUT, { recursive: true, force: true });

// Next writes the export to out/. A website export already sitting there is set aside and put back afterwards, so both can coexist.
const SITE_OUT = "out"; const PARKED = ".out-site-parked";
fs.rmSync(PARKED, { recursive: true, force: true });
if (fs.existsSync(SITE_OUT)) fs.renameSync(SITE_OUT, PARKED);
try {
  const env = { ...process.env, APP_EXPORT: "1", NEXT_PUBLIC_APP_BUILD: "1" };
  delete env.NEXT_DIST_DIR;
  execFileSync(process.execPath, [path.join("node_modules", "next", "dist", "bin", "next"), "build"], { stdio: "inherit", env });
  fs.renameSync(SITE_OUT, OUT);
} finally {
  fs.rmSync(SITE_OUT, { recursive: true, force: true });
  if (fs.existsSync(PARKED)) fs.renameSync(PARKED, SITE_OUT);
}

const size = (p) => (fs.statSync(p).isDirectory() ? fs.readdirSync(p).reduce((a, n) => a + size(path.join(p, n)), 0) : fs.statSync(p).size);
const count = (p) => (fs.statSync(p).isDirectory() ? fs.readdirSync(p).reduce((a, n) => a + count(path.join(p, n)), 0) : 1);
const removed = [];
const rm = (p) => { if (fs.existsSync(p)) { fs.rmSync(p, { recursive: true, force: true }); removed.push(p); } };

// Locale folders: keep only what the app ships.
for (const l of LOCALES) {
  const dir = path.join(OUT, l);
  if (!fs.existsSync(dir)) continue;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory() || e.name.startsWith("__next.")) continue;
    // Another locale's slug (e.g. /mk/horoscope/ next to /mk/dneven-horoskop/) is never served: same rule as scripts/prune-locale-shells.mjs.
    const foreign = Object.values(SECTION_SLUGS).some((row) => Object.values(row).includes(e.name) && row[l] !== e.name);
    if (foreign || !isBundled(`/${l}/${e.name}/`)) rm(path.join(dir, e.name));
  }
}
// "_" placeholders (static export needs one param per locale) and any dated page that slipped through.
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (!e.isDirectory() || e.name === "_next" || e.name.startsWith("__next.")) continue;
    const p = path.join(d, e.name);
    if (e.name === "_" || /^\d{4}-\d{2}-\d{2}$/.test(e.name)) rm(p); else walk(p);
  }
};
for (const l of LOCALES) if (fs.existsSync(path.join(OUT, l))) walk(path.join(OUT, l));
// Site-only files at the root.
for (const name of fs.readdirSync(OUT)) {
  if (/^sitemap.*\.xml$/.test(name) || /^[0-9a-f]{32}\.txt$/.test(name) || ["robots.txt", "llms.txt", "_redirects", "og", ".well-known"].includes(name)) rm(path.join(OUT, name));
}
// Same payload trim as the website (drops __next._full.txt copies the client never fetches).
execFileSync(process.execPath, ["scripts/trim-export.mjs", OUT], { stdio: "inherit" });

console.log(`build-app: removed ${removed.length} site-only paths; ${OUT}/ has ${count(OUT)} files, ${(size(OUT) / 1048576).toFixed(1)} MB`);
