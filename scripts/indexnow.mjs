// Tells IndexNow engines (Bing, Yandex, Seznam, Naver) which URLs changed. Runs from .github/workflows/nightly-rebuild.yml after the deploy.
// Google does not use IndexNow. It finds new pages through the sitemap, so this does nothing for Google.
//
//   node scripts/indexnow.mjs                 prints what it would send, sends nothing
//   node scripts/indexnow.mjs --send          waits for the new build, then submits
//
// Nothing in the app, the build or the tests imports the CLI part of this file. The key is public by design: engines fetch it from /<key>.txt to prove we own the site.
import { pathToFileURL } from "node:url";

export const HOST = "horoscop.si";
export const KEY = "7c1e4b9a2f6d48e3a05bd2c6e91f3a84";
const ENDPOINT = "https://api.indexnow.org/indexnow";
/** The protocol's limit for one request. */
const BATCH = 10000;
/** A nightly build takes 6 to 15 minutes. */
const WAIT_MINUTES = 30;
/** Keep in step with DAILY_DAYS_AHEAD in src/engine/skyday.ts. */
const DAYS_AHEAD = 3;

const dateIn = (zone, d = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
const addDays = (iso, n) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const dated = (url) => url.match(/\/(\d{4}-\d{2}-\d{2})\/$/)?.[1];

/** <loc>/<lastmod> pairs of a sitemap or a sitemap index. */
export const parseSitemap = (xml) => [...xml.matchAll(/<(?:url|sitemap)>([\s\S]*?)<\/(?:url|sitemap)>/g)].map(([, b]) => ({ loc: b.match(/<loc>([^<]+)<\/loc>/)?.[1], lastmod: b.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] })).filter((e) => e.loc);

/**
 * URLs worth submitting: lastmod from this build, and of the dated pages only the day that is new. Later days keep today's lastmod in the sitemap
 * until they pass, but their text did not change.
 */
export function changedUrls(entries, build, newest) {
  return entries.filter((e) => (e.lastmod ?? "") >= build && (!dated(e.loc) || dated(e.loc) >= newest)).map((e) => e.loc);
}

async function liveEntries() {
  const index = parseSitemap(await (await fetch(`https://${HOST}/sitemap.xml`)).text());
  const lists = await Promise.all(index.map(async (s) => parseSitemap(await (await fetch(s.loc)).text())));
  return lists.flat();
}

async function waitForDeploy(url) {
  for (let i = 0; i < WAIT_MINUTES * 2; i++) {
    const r = await fetch(url, { method: "HEAD", redirect: "manual" }).catch(() => null);
    if (r?.status === 200) return true;
    await new Promise((res) => setTimeout(res, 30000));
  }
  return false;
}

async function main(send) {
  const build = dateIn("UTC"); // src/app/sitemap.ts stamps lastmod with this date
  const newest = addDays(dateIn("Europe/Skopje"), DAYS_AHEAD);
  if (send && !(await waitForDeploy(`https://${HOST}/en/horoscope/aries/${newest}/`))) console.warn(`indexnow: ${newest} did not appear in ${WAIT_MINUTES} minutes, submitting what is live`);
  const urls = changedUrls(await liveEntries(), build, newest);
  console.log(`indexnow: ${urls.length} changed URLs (build ${build}, newest day ${newest})`);
  if (!send) { console.log(urls.slice(0, 20).join("\n")); return; }
  const live = await (await fetch(`https://${HOST}/${KEY}.txt`)).text();
  if (live.trim() !== KEY) throw new Error(`/${KEY}.txt is not live, the engines would reject the key`);
  for (let i = 0; i < urls.length; i += BATCH) {
    const r = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls.slice(i, i + BATCH) }) });
    console.log(`indexnow: batch ${i / BATCH + 1} answered ${r.status}`);
    if (!r.ok) throw new Error(`IndexNow answered ${r.status}: ${await r.text()}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main(process.argv.includes("--send"));
