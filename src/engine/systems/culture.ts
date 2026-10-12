/**
 * Cultural lens ordering. Nothing is ever hidden; we only change which systems are featured first.
 * Rule (also on /how-it-works):
 *   score = 3 if the system's home region matches the birthplace region (3.5 if it is the system's first home, e.g. Nine Star Ki in Japan)
 *         + 2 if it matches the region of the app language (mk → Macedonian)
 *         + 1 if it matches one of the browser's preferred languages
 *   then a stable sort by score, ties keep the global default order (DEFAULT_ORDER).
 * Birthplace region comes from the IANA time zone of the birthplace (e.g. Europe/Skopje → MK), which every
 * saved place has; no extra location data is collected.
 */
export type Region = "mk" | "balkan" | "slavic" | "orthodox" | "east-asia" | "japan" | "south-asia" | "nordic" | "celtic" | "mesoamerica" | "egypt" | "global";

const TZ_COUNTRY: Record<string, string> = {
  "Europe/Skopje": "MK", "Europe/Belgrade": "RS", "Europe/Sofia": "BG", "Europe/Podgorica": "ME", "Europe/Sarajevo": "BA", "Europe/Zagreb": "HR", "Europe/Ljubljana": "SI",
  "Europe/Athens": "GR", "Europe/Bucharest": "RO", "Asia/Nicosia": "CY", "Asia/Tbilisi": "GE", "Europe/Chisinau": "MD", "Europe/Tirane": "AL",
  "Europe/Moscow": "RU", "Europe/Kiev": "UA", "Europe/Kyiv": "UA", "Europe/Minsk": "BY", "Europe/Warsaw": "PL", "Europe/Prague": "CZ", "Europe/Bratislava": "SK",
  "Asia/Shanghai": "CN", "Asia/Chongqing": "CN", "Asia/Harbin": "CN", "Asia/Urumqi": "CN", "Asia/Taipei": "TW", "Asia/Hong_Kong": "HK", "Asia/Macau": "MO", "Asia/Singapore": "SG",
  "Asia/Tokyo": "JP", "Asia/Seoul": "KR", "Asia/Pyongyang": "KP", "Asia/Ho_Chi_Minh": "VN", "Asia/Saigon": "VN",
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN", "Asia/Kathmandu": "NP", "Asia/Katmandu": "NP", "Asia/Colombo": "LK", "Asia/Dhaka": "BD", "Asia/Thimphu": "BT",
  "Europe/Oslo": "NO", "Europe/Stockholm": "SE", "Europe/Copenhagen": "DK", "Atlantic/Reykjavik": "IS", "Atlantic/Faroe": "FO", "Europe/Helsinki": "FI",
  "Europe/Dublin": "IE", "Europe/London": "GB", "Europe/Isle_of_Man": "GB",
  "America/Mexico_City": "MX", "America/Cancun": "MX", "America/Merida": "MX", "America/Monterrey": "MX", "America/Matamoros": "MX", "America/Chihuahua": "MX", "America/Mazatlan": "MX", "America/Tijuana": "MX", "America/Hermosillo": "MX", "America/Bahia_Banderas": "MX",
  "America/Guatemala": "GT", "America/Belize": "BZ", "America/Tegucigalpa": "HN", "America/El_Salvador": "SV",
  "Africa/Cairo": "EG",
};
const COUNTRY_REGION: Record<string, Region> = {
  MK: "mk", RS: "balkan", BG: "balkan", ME: "balkan", BA: "balkan", HR: "balkan", SI: "balkan",
  GR: "orthodox", RO: "orthodox", CY: "orthodox", GE: "orthodox", MD: "orthodox",
  RU: "slavic", UA: "slavic", BY: "slavic", PL: "slavic", CZ: "slavic", SK: "slavic",
  CN: "east-asia", TW: "east-asia", HK: "east-asia", MO: "east-asia", SG: "east-asia", KR: "east-asia", KP: "east-asia", VN: "east-asia", JP: "japan",
  IN: "south-asia", NP: "south-asia", LK: "south-asia", BD: "south-asia", BT: "south-asia",
  NO: "nordic", SE: "nordic", DK: "nordic", IS: "nordic", FO: "nordic", FI: "nordic", IE: "celtic", GB: "celtic",
  MX: "mesoamerica", GT: "mesoamerica", BZ: "mesoamerica", HN: "mesoamerica", SV: "mesoamerica", EG: "egypt",
};
const LANG_REGION: Record<string, Region> = { mk: "mk", sr: "balkan", bg: "balkan", hr: "balkan", bs: "balkan", sl: "balkan", el: "orthodox", ro: "orthodox", ru: "slavic", uk: "slavic", be: "slavic", pl: "slavic", cs: "slavic", sk: "slavic", zh: "east-asia", ko: "east-asia", vi: "east-asia", ja: "japan", hi: "south-asia", ne: "south-asia", bn: "south-asia", ta: "south-asia", te: "south-asia", mr: "south-asia", no: "nordic", nb: "nordic", nn: "nordic", sv: "nordic", da: "nordic", is: "nordic", fi: "nordic", ga: "celtic", cy: "celtic", gd: "celtic", ar: "global" };

export const countryOfTz = (tz?: string | null): string | null => (tz ? TZ_COUNTRY[tz] ?? null : null);
export const regionOfCountry = (cc: string | null): Region => (cc ? COUNTRY_REGION[cc] ?? "global" : "global");
export const regionOfLang = (l?: string | null): Region => (l ? LANG_REGION[l.toLowerCase().split("-")[0]] ?? "global" : "global");

/** Lens ids this module orders. Existing lenses (chinese, vedic) take part so they can be featured too. */
export type SystemKey = "chiron" | "nodes" | "lilith" | "sundegree" | "solarreturn" | "biorhythm" | "nameday" | "slavic" | "chinese" | "ninestar" | "iching" | "vedic" | "mayan" | "celtic" | "norse" | "egyptian" | "kabbalah" | "arabic" | "numextra";
export const DEFAULT_ORDER: SystemKey[] = ["chiron", "nodes", "lilith", "sundegree", "solarreturn", "biorhythm", "chinese", "vedic", "iching", "ninestar", "mayan", "celtic", "norse", "slavic", "nameday", "egyptian", "kabbalah", "arabic", "numextra"];
const HOME: Partial<Record<SystemKey, Region[]>> = {
  slavic: ["mk", "balkan", "slavic"], nameday: ["mk", "balkan", "orthodox"], chinese: ["east-asia", "japan"], iching: ["east-asia", "japan"],
  ninestar: ["japan", "east-asia"], vedic: ["south-asia"], norse: ["nordic"], celtic: ["celtic"], mayan: ["mesoamerica"], egyptian: ["egypt"], arabic: ["egypt"],
};
export interface CultureCtx { birthTz?: string | null; locale?: string | null; browserLangs?: readonly string[] }
export interface CultureResult { country: string | null; region: Region; order: SystemKey[]; featured: SystemKey[]; why: Partial<Record<SystemKey, ("birthplace" | "language" | "browser")[]>> }

export function cultureOrder(ctx: CultureCtx): CultureResult {
  const country = countryOfTz(ctx.birthTz); const region = regionOfCountry(country);
  const appRegion = regionOfLang(ctx.locale); const browser = (ctx.browserLangs ?? []).map(regionOfLang);
  const why: CultureResult["why"] = {};
  const score = (k: SystemKey) => {
    const h = HOME[k] ?? []; const w: ("birthplace" | "language" | "browser")[] = []; let s = 0;
    if (h.includes(region)) { s += h[0] === region ? 3.5 : 3; w.push("birthplace"); }
    if (h.includes(appRegion)) { s += 2; w.push("language"); }
    if (browser.some((r) => h.includes(r))) { s += 1; w.push("browser"); }
    if (w.length) why[k] = w;
    return s;
  };
  const scored = DEFAULT_ORDER.map((k, i) => ({ k, i, s: score(k) }));
  const order = [...scored].sort((a, b) => b.s - a.s || a.i - b.i).map((x) => x.k);
  return { country, region, order, featured: scored.filter((x) => x.s > 0).sort((a, b) => b.s - a.s || a.i - b.i).map((x) => x.k), why };
}
/** Suggest Macedonian UI when born in North Macedonia or the browser prefers mk, and the app is in another language. */
export const suggestMk = (ctx: CultureCtx) => ctx.locale !== "mk" && (countryOfTz(ctx.birthTz) === "MK" || (ctx.browserLangs ?? []).some((l) => l.toLowerCase().startsWith("mk")));
