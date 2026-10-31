/**
 * What `@/content` means in the browser (see turbopack.resolveAlias in next.config.ts). The server keeps the real src/content/index.ts.
 *
 * The full text of every language is 1.3 MB of JavaScript, and a reader on a horoscope or numerology page uses almost none of it: the server has
 * already rendered the article, the client only needs the labels of the header and footer. So `contents.de` here is a Proxy with the same shape as the
 * real object, filled in three steps. Consumers keep calling useContent() and reading c.x.y; nothing else changes.
 *   1. shell: labels the site chrome reads on every page, one small chunk per language (lib/shell)
 *   2. mid:   the texts of the landing page, one chunk per language
 *   3. full:  anything else
 * ContentProvider calls prepareContent() before it renders its children, so each route has what it needs when they run: reading routes (LEAN_ROUTES) the shell, the
 * landing page the mid chunk, every other route the full content, exactly as if it had been there all along. Hydration waits for that chunk; the server HTML stays on screen.
 * A client component on a reading route should only read the shell. A read beyond it still works in render, but suspends, and must not sit inside a useMemo or
 * useState initializer (React loses that hook when it replays the component), nor in an effect or event handler (there it cannot suspend at all).
 */
import { use } from "react";
import { parsePath, ROUTE_LOCALES } from "./i18n-routes";
import type { Content, Locale } from "../content/index";

export type { Content, Locale };
export const LOCALES = ROUTE_LOCALES as unknown as readonly Locale[];
export const DEFAULT_LOCALE: Locale = "en";
export const isLocale = (s: string): s is Locale => (LOCALES as readonly string[]).includes(s);

type Obj = Record<string, unknown>;
type FullModule = typeof import("../content/index");
type Shell = { values: Obj; partial: ReadonlySet<string>; mid?: () => Promise<Obj> };
/** A promise that React's use() can read without suspending once it has settled. */
type Tracked<T> = Promise<T> & { status?: "fulfilled"; value?: T };

/** Top-level keys the landing page needs. The mid chunk of a language holds exactly these. */
export const MID_KEYS = ["landing", "sky", "daily", "astro", "nums", "compat"] as const;
const midKeys: ReadonlySet<string> = new Set(MID_KEYS);

/** First path segment (internal name) of the routes that are written for reading: the server rendered them and their client widgets only need the shell. */
const LEAN_ROUTES: ReadonlySet<string> = new Set(["horoscope", "numerology", "zodiac", "weekly-horoscope", "monthly-horoscope", "horoscope-2027", "sign-compatibility", "moon-calendar", "mercury-retrograde", "blog", "learn", "deep", "how-it-works", "pricing", "privacy", "terms", "credits", "promise"]);
/** How much of the content a route needs before its components render. */
export function contentFor(path: string): "shell" | "mid" | "full" {
  const route = parsePath(path.endsWith("/") ? path : `${path}/`)?.[1].split("/")[1];
  return route === "" ? "mid" : route !== undefined && LEAN_ROUTES.has(route) ? "shell" : "full";
}

const shells = new Map<string, Shell>();
/** Called once per language by lib/shell/<locale>.tsx. `partial` names shell keys that hold only part of the real object. */
export function registerShell(locale: string, values: Obj, partial: readonly string[] = [], mid?: () => Promise<Obj>) { shells.set(locale, { values, partial: new Set(partial), mid }); }

function track<T>(load: () => Promise<T>): Tracked<T> {
  const p: Tracked<T> = load().then((v) => { p.status = "fulfilled"; p.value = v; return v; });
  return p;
}
/**
 * React replays a component that suspended and expects the same sequence of use() calls, so every read of lazy text goes through use(), loaded or not.
 * Once settled use() cannot suspend, so a throw can only mean we are outside render, where the value can be read directly.
 */
function read<T>(p: Tracked<T>): T {
  /* eslint-disable react-hooks/rules-of-hooks -- called from Proxy traps during render, in whatever order components read text; use() allows that */
  if (p.status !== "fulfilled") return use(p as Promise<T>);
  try { return use(p as Promise<T>); } catch { return p.value as T; }
  /* eslint-enable react-hooks/rules-of-hooks */
}

let full: Tracked<FullModule> | null = null;
const realRoot = (locale: string) => read((full ??= track(() => import("../content/index")))).contents[locale as Locale] as unknown as Obj;
const mids = new Map<string, Tracked<Obj>>();
function readMid(locale: string, load: () => Promise<Obj>) {
  if (!mids.has(locale)) mids.set(locale, track(load));
  return read(mids.get(locale)!);
}
/** Suspends until the text this route's components read is in the browser. */
export function prepareContent(locale: string, path: string) {
  const need = contentFor(path); const mid = shells.get(locale)?.mid;
  if (need === "mid" && mid) readMid(locale, mid);
  else if (need !== "shell") realRoot(locale);
}

function lookup(locale: string, key: string): unknown {
  const s = shells.get(locale);
  if (s && key in s.values) return s.partial.has(key) ? node(locale, s.values[key] as Obj, [key]) : s.values[key];
  // Once the mid chunk has started it stays the source of these keys: a replay must see the same promise in the same place.
  if (s?.mid && midKeys.has(key) && (mids.has(locale) || full?.status !== "fulfilled")) return readMid(locale, s.mid)[key];
  return realRoot(locale)[key];
}

/** A partial object: known keys come from the shell, anything else from the full content. */
function node(locale: string, partial: Obj, path: readonly string[]): Obj {
  const real = () => path.reduce((o, k) => o[k] as Obj, realRoot(locale));
  return new Proxy(partial, {
    get: (t, k) => (typeof k === "symbol" ? Reflect.get(t, k) : k in t ? t[k] : real()[k]),
    has: (t, k) => k in t || k in real(),
    ownKeys: () => Reflect.ownKeys(real()),
    getOwnPropertyDescriptor: (_, k) => ({ ...Reflect.getOwnPropertyDescriptor(real(), k), configurable: true }),
  });
}

function rootProxy(locale: string): Content {
  return new Proxy({}, {
    get: (_, k) => (typeof k === "symbol" ? undefined : lookup(locale, k)),
    has: (_, k) => k in realRoot(locale),
    ownKeys: () => Reflect.ownKeys(realRoot(locale)),
    getOwnPropertyDescriptor: (_, k) => ({ ...Reflect.getOwnPropertyDescriptor(realRoot(locale), k), configurable: true }),
  }) as Content;
}

const roots = new Map<string, Content>();
const rootFor = (locale: string) => { if (!roots.has(locale)) roots.set(locale, rootProxy(locale)); return roots.get(locale)!; };
export const contents = new Proxy({}, { get: (_, k) => (typeof k === "symbol" ? undefined : rootFor(k)), has: (_, k) => typeof k === "string" && isLocale(k) }) as Record<Locale, Content>;
export const getContent = (l: string): Content => rootFor(isLocale(l) ? l : DEFAULT_LOCALE);
