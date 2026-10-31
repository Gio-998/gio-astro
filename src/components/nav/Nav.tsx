"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useContent, useHref } from "@/lib/content-context";
import { quizDefs, QUIZ_IDS } from "@/lib/quiz-defs";
import { useStore } from "@/lib/store";
import { useAccount } from "@/lib/sync";
import { nav as en, type NavGroupKey } from "@/content/en/nav";
import { nav as mk } from "@/content/mk/nav";
import { nav as de } from "@/content/de/nav";
import { nav as sr } from "@/content/sr/nav";
import { Emblem, type EmblemId } from "../art/Emblem";

export const useNav = () => ({ en, mk, de, sr })[useContent().locale] ?? en;
/** Someone who has been here before: a saved profile on this device, or a signed-in account. */
export function useReturning() { const s = useStore(); const a = useAccount(); return !!s?.me || !!a.user; }

type Item = { href: string; icon: EmblemId; title: string; desc: string };
type Group = { key: NavGroupKey; label: string; href: string; icon: EmblemId; items: Item[]; also?: string[] };

/** The four main sections, in menu order. The top bar adds the Start or profile action as its fifth item. */
const MAIN: NavGroupKey[] = ["astrology", "tests", "bonds", "numerology"];
/** Where a section's own label goes, and pages that count as "inside" it for the active state. */
const HUB: Record<NavGroupKey, { href: string; icon: EmblemId; also?: string[] }> = {
  astrology: { href: "/horoscope/", icon: "sun", also: ["/daily/"] },
  tests: { href: "/quizzes/", icon: "big-five", also: ["/quiz/", "/deep/", "/play/"] },
  bonds: { href: "/sign-compatibility/", icon: "bond" },
  numerology: { href: "/numerology/", icon: "number" },
  me: { href: "/me/", icon: "chart", also: ["/you/", "/person/"] },
  more: { href: "/blog/", icon: "eye" },
};

/** Menu groups, localized. Tests come from the quiz definitions so a new test appears here on its own. */
export function useGroups(keys: NavGroupKey[]): Group[] {
  const N = useNav(); const { c } = useContent(); const defs = useMemo(() => quizDefs(c), [c]);
  return keys.map((key) => {
    const g = N.groups[key]; const T = N.groups.tests;
    const items: Item[] = key === "tests"
      ? [{ href: T.allHref, icon: "eye", title: T.allTitle, desc: T.allDesc },
         { href: T.deep.href, icon: "big-five", title: T.deep.title, desc: T.deep.desc },
         ...QUIZ_IDS.map((id) => ({ href: `/quiz/${id}/`, icon: id as EmblemId, title: defs[id].title, desc: defs[id].tagline })),
         { href: T.play.href, icon: "tarot", title: T.play.title, desc: T.play.desc }]
      : (g as { items: { href: string; icon: string; title: string; desc: string }[] }).items.map((i) => ({ ...i, icon: i.icon as EmblemId }));
    if (key === "astrology") items.unshift({ href: "/horoscope/", icon: "sun", title: N.horoscope.label, desc: N.horoscope.desc });
    return { key, label: g.label, items, ...HUB[key] };
  });
}

/** Paths are localized, so a group is compared on the hrefs it would really link to. */
function useActive() {
  const h = useHref(); const path = usePathname() || "";
  const on = (href: string) => path.startsWith(h(href).split("?")[0]);
  return { on, inGroup: (g: Group) => [g.href, ...g.items.map((i) => i.href), ...(g.also ?? [])].some(on) };
}

const Chevron = ({ open }: { open: boolean }) => <svg viewBox="0 0 10 6" className={`h-1.5 w-2.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;

function ItemLink({ it, onPick }: { it: Item; onPick?: () => void }) {
  const h = useHref(); const { on } = useActive(); const act = on(it.href);
  return (
    <Link href={h(it.href)} onClick={onPick} className={`flex min-h-[52px] items-center gap-3 rounded-xl px-2.5 py-2 outline-none transition hover:bg-white/[0.06] focus-visible:ring-1 focus-visible:ring-gold/60 ${act ? "bg-white/[0.05]" : ""}`}>
      <Emblem id={it.icon} className="h-7 w-7 shrink-0" />
      <span className="min-w-0">
        <span className={`block text-sm font-medium ${act ? "text-gold" : "text-mist"}`}>{it.title}</span>
        <span className="block text-xs leading-snug text-dim">{it.desc}</span>
      </span>
    </Link>
  );
}

/** Desktop: each section is a link to its hub; hovering it, or pressing its arrow, opens the list of pages under the header. */
export function DesktopNav() {
  const returning = useReturning(); const N = useNav(); const h = useHref(); const path = usePathname() || "";
  const groups = useGroups(returning ? [...MAIN, "me"] : MAIN); const { inGroup } = useActive();
  const [open, setOpen] = useState<NavGroupKey | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const uid = useId();
  const hold = () => { if (timer.current) clearTimeout(timer.current); };
  const later = (k: NavGroupKey | null, ms: number) => { hold(); timer.current = setTimeout(() => setOpen(k), ms); };
  // eslint-disable-next-line react-hooks/set-state-in-effect -- close on navigation
  useEffect(() => { setOpen(null); }, [path]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { const t = refs.current[open]; setOpen(null); t?.focus(); } };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [open]);
  return (
    <nav aria-label={N.aria.tabs} className="flex items-center gap-1 text-[15px]" onMouseLeave={() => later(null, 160)} data-testid="desktop-nav">
      {groups.map((g) => {
        const on = open === g.key; const act = inGroup(g);
        return (
          <div key={g.key} onMouseEnter={() => later(g.key, open ? 0 : 90)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) later(null, 80); }}>
            <div className={`flex items-center rounded-full transition ${on || act ? "bg-white/10 text-gold" : "text-mist/80 hover:bg-white/5 hover:text-mist"}`}>
              <Link href={h(g.href)} data-testid={`nav-${g.key}`} className="flex min-h-[44px] items-center whitespace-nowrap pl-3.5 pr-1">{g.label}</Link>
              <button ref={(el) => { refs.current[g.key] = el; }} type="button" aria-expanded={on} aria-controls={`${uid}-${g.key}`} aria-label={`${g.label}: ${N.menu}`}
                onClick={() => setOpen(on ? null : g.key)} className="grid h-11 w-10 place-items-center rounded-full pr-2">
                <Chevron open={on} />
              </button>
            </div>
            <div id={`${uid}-${g.key}`} className={`absolute left-1/2 top-full z-50 w-[min(680px,calc(100vw-2rem))] -translate-x-1/2 pt-2 transition duration-200 ${on ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}>
              <ul className={`grid gap-0.5 rounded-3xl border border-white/12 bg-ink/95 p-2.5 shadow-[0_40px_90px_-30px_rgba(0,0,0,.9)] backdrop-blur-2xl ${g.items.length > 3 ? "grid-cols-2" : "grid-cols-1"}`} data-testid={`mega-${g.key}`}>
                {g.items.map((it) => <li key={it.href}><ItemLink it={it} onPick={() => setOpen(null)} /></li>)}
              </ul>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

/** Phone menu: the sections fold open one at a time, so the sheet stays short. */
export function MoreSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const returning = useReturning(); const a = useAccount(); const N = useNav(); const path = usePathname() || ""; const h = useHref();
  const groups = useGroups(returning ? ["me", ...MAIN] : MAIN); const [more] = useGroups(["more"]);
  const [section, setSection] = useState<NavGroupKey | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  // Built on first open: the desktop menu already puts these links in the HTML, so a second copy here would only add weight.
  const [opened, setOpened] = useState(open);
  if (open && !opened) setOpened(true);
  const close = useCallback(() => onClose(), [onClose]);
  useEffect(() => { close(); }, [path, close]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", k); setTimeout(() => ref.current?.querySelector<HTMLElement>("a,button")?.focus(), 50);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", k); };
  }, [open, close]);
  const rest: [string, string][] = [...more.items.map((i): [string, string] => [i.href, i.title]), ["/pricing/", N.pricing.label], ...(a.user ? [] : [["/account/", N.login] as [string, string]])];
  return (
    <div className={`fixed inset-0 z-[55] lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-night/70 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} onClick={close} />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={N.menu} data-testid="more-sheet"
        className={`absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto overscroll-contain rounded-t-[28px] border-t border-white/12 bg-ink/95 px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-30px_80px_-20px_rgba(0,0,0,.8)] backdrop-blur-2xl transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${open ? "translate-y-0" : "translate-y-full"}`}>
        {opened && <>
          <div className="mb-1 flex items-center justify-between gap-3">
            <p className="h-display text-2xl text-mist">{N.menu}</p>
            <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-dim" aria-label={N.close} data-testid="more-close">✕</button>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {groups.map((g) => {
              const on = section === g.key;
              return (
                <section key={g.key}>
                  <button type="button" onClick={() => setSection(on ? null : g.key)} aria-expanded={on} data-testid={`sheet-${g.key}`} className="flex min-h-[56px] w-full items-center gap-3 text-left">
                    <Emblem id={g.icon} className="h-7 w-7 shrink-0" />
                    <span className={`flex-1 text-[16px] font-medium ${on ? "text-gold" : "text-mist"}`}>{g.label}</span>
                    <span className="pr-1 text-dim"><Chevron open={on} /></span>
                  </button>
                  {on && (
                    <ul className="grid gap-x-3 pb-3 min-[480px]:grid-cols-2">
                      {g.items.map((it) => <li key={it.href}><Link href={h(it.href)} onClick={close} className="flex min-h-[48px] items-center rounded-xl px-3 text-[15px] text-mist/90 transition hover:bg-white/[0.06]">{it.title}</Link></li>)}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-x-3">
            {rest.map(([href, label]) => <li key={href}><Link href={h(href)} onClick={close} className="flex min-h-[48px] items-center text-[14.5px] text-dim transition hover:text-gold">{label}</Link></li>)}
          </ul>
        </>}
      </div>
    </div>
  );
}

/** Phone and tablet bottom bar, the same for everyone: the four sections plus the menu. */
export function TabBar() {
  const N = useNav(); const h = useHref(); const groups = useGroups(MAIN); const { inGroup } = useActive();
  const [more, setMore] = useState(false);
  const close = useCallback(() => setMore(false), []);
  const labels: Partial<Record<NavGroupKey, string>> = { astrology: N.tabs.horoscope, tests: N.tabs.tests, bonds: N.tabs.match, numerology: N.tabs.numbers };
  return (
    <>
      <nav aria-label={N.aria.tabs} className="fixed inset-x-0 bottom-0 z-[56] grid grid-cols-5 border-t border-white/10 bg-ink/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden" data-testid="tab-bar">
        {groups.map((g) => { const on = !more && inGroup(g); return (
          <Link key={g.key} href={h(g.href)} aria-current={on ? "page" : undefined} data-testid={`tab-${g.key}`} className={`flex min-h-[60px] flex-col items-center justify-center gap-1 text-[11px] leading-none transition ${on ? "text-gold" : "text-mist/70"}`}>
            <Emblem id={g.icon} className={`h-6 w-6 ${on ? "" : "opacity-75"}`} />{labels[g.key]}
          </Link>); })}
        <button type="button" onClick={() => setMore(!more)} aria-expanded={more} aria-haspopup="dialog" data-testid="tab-more" className={`flex min-h-[60px] flex-col items-center justify-center gap-1 text-[11px] leading-none ${more ? "text-gold" : "text-mist/70"}`}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden><path d="M5 8h14M5 12h14M5 16h9" /></svg>{N.menu}
        </button>
      </nav>
      <MoreSheet open={more} onClose={close} />
    </>
  );
}
