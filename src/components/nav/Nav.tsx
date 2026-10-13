"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useContent, useHref } from "@/lib/content-context";
import { quizDefs, QUIZ_IDS } from "@/lib/quiz-defs";
import { nav as en, type NavGroupKey } from "@/content/en/nav";
import { nav as mk } from "@/content/mk/nav";
import { nav as de } from "@/content/de/nav";
import { Emblem, type EmblemId } from "../art/Emblem";
import { pricingPath } from "@/lib/pricing";
import { sectionSlug } from "@/lib/i18n-routes";
const horoHubPath = (lang: string) => `/${sectionSlug(lang, "horoscope")}/`;

export const useNav = () => ({ en, mk, de })[useContent().locale] ?? en;
type Item = { href: string; icon: EmblemId; title: string; desc: string };
type Group = { key: NavGroupKey; label: string; items: Item[]; feature: { title: string; text: string; cta: string; href: string; icon: EmblemId; glow: string } };

const FEATURE: Record<NavGroupKey, { href: string; icon: EmblemId; glow: string }> = {
  me: { href: "/me/", icon: "chart", glow: "from-violet/50 via-indigo/40 to-gold/25" },
  bonds: { href: "/match/", icon: "bond", glow: "from-rose/45 via-violet/35 to-gold/20" },
  tests: { href: "/quizzes/", icon: "big-five", glow: "from-gold/35 via-violet/40 to-sage/25" },
  discover: { href: "/learn/", icon: "eye", glow: "from-sage/35 via-indigo/45 to-lilac/30" },
};

/** All menu groups, localized. Tests come from the quiz definitions so new quizzes appear automatically. */
export function useGroups(keys: NavGroupKey[]): Group[] {
  const N = useNav(); const { c } = useContent(); const defs = quizDefs(c);
  return keys.map((key) => {
    const g = N.groups[key];
    const items: Item[] = key === "tests"
      ? [{ href: N.groups.tests.allHref, icon: "eye", title: N.groups.tests.allTitle, desc: N.groups.tests.allDesc },
         { href: N.groups.tests.deep.href, icon: "big-five", title: N.groups.tests.deep.title, desc: N.groups.tests.deep.desc },
         ...QUIZ_IDS.map((id) => ({ href: `/quiz/${id}/`, icon: id as EmblemId, title: defs[id].title, desc: defs[id].tagline })),
         { href: N.groups.tests.play.href, icon: "tarot", title: N.groups.tests.play.title, desc: N.groups.tests.play.desc }]
      : (g as { items: { href: string; icon: string; title: string; desc: string }[] }).items.map((i) => ({ ...i, icon: i.icon as EmblemId }));
    return { key, label: g.label, items, feature: { ...g.feature, ...FEATURE[key] } };
  });
}

const isActive = (path: string, href: string) => { const base = href.split("?")[0]; return base !== "/" && path.includes(base); };

function ItemLink({ it, onPick, compact }: { it: Item; onPick?: () => void; compact?: boolean }) {
  const h = useHref(); const path = usePathname() || "";
  const on = isActive(path, it.href);
  return (
    <Link href={h(it.href)} onClick={onPick} role="menuitem" data-testid={`nav-item-${it.href.replace(/[^a-z0-9]+/g, "-")}`}
      className={`group/it flex min-h-[48px] items-start gap-3 rounded-2xl p-2.5 outline-none transition hover:bg-white/[0.07] focus-visible:bg-white/[0.09] focus-visible:ring-1 focus-visible:ring-gold/60 ${on ? "bg-white/[0.06]" : ""}`}>
      <span className={`grid shrink-0 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent transition group-hover/it:border-gold/40 group-hover/it:shadow-[0_0_18px_-4px_rgba(246,207,122,.6)] ${compact ? "h-10 w-10" : "h-11 w-11"}`}>
        <Emblem id={it.icon} className={`${compact ? "h-7 w-7" : "h-8 w-8"} transition duration-500 group-hover/it:rotate-12 group-hover/it:scale-110`} />
      </span>
      <span className="min-w-0">
        <span className={`block text-sm font-semibold ${on ? "text-gold" : "text-mist"}`}>{it.title}</span>
        <span className="block text-xs leading-snug text-dim">{it.desc}</span>
      </span>
    </Link>
  );
}

function Feature({ g, onPick }: { g: Group; onPick?: () => void }) {
  const h = useHref();
  return (
    <Link href={h(g.feature.href)} onClick={onPick} className={`group/f relative flex min-h-[248px] flex-col justify-end overflow-hidden rounded-[22px] border border-white/15 bg-gradient-to-br ${g.feature.glow} p-5 outline-none focus-visible:ring-1 focus-visible:ring-gold/60`}>
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(1px_1px_at_20%_30%,#fff,transparent),radial-gradient(1px_1px_at_70%_20%,#fff,transparent),radial-gradient(1.5px_1.5px_at_40%_70%,#fff,transparent),radial-gradient(1px_1px_at_85%_60%,#fff,transparent)] opacity-60" />
      <Emblem id={g.feature.icon} className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 opacity-80 transition duration-700 group-hover/f:rotate-12 group-hover/f:scale-110 glow-gold" />
      <span className="relative h-display mb-1 text-2xl leading-tight">{g.feature.title}</span>
      <span className="relative mb-3 text-xs leading-snug text-mist/85">{g.feature.text}</span>
      <span className="relative inline-flex w-max items-center gap-1 rounded-full bg-gold px-3 py-1.5 text-xs font-semibold text-plum">{g.feature.cta} →</span>
    </Link>
  );
}

/** Desktop: hover, focus or click opens an illustrated mega-menu under the header. */
export function DesktopNav({ keys, showToday = true }: { keys: NavGroupKey[]; showToday?: boolean }) {
  const groups = useGroups(keys); const N = useNav(); const h = useHref(); const path = usePathname() || "";
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
    <div className="flex items-center gap-0.5 text-sm" onMouseLeave={() => later(null, 160)} data-testid="desktop-nav">
      {showToday && <Link href={h("/today/")} className={`rounded-full px-3 py-2 transition ${path.includes("/today/") ? "bg-white/10 text-gold" : "text-dim hover:bg-white/5 hover:text-mist"}`}>{N.today.label}</Link>}
      <HoroscopeLink />
      {groups.map((g) => {
        const on = open === g.key; const act = g.items.some((i) => isActive(path, i.href));
        return (
          <div key={g.key} onMouseEnter={() => later(g.key, open ? 0 : 90)}
            onFocus={() => { hold(); setOpen(g.key); }}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) later(null, 80); }}>
            <button ref={(el) => { refs.current[g.key] = el; }} type="button" aria-haspopup="true" aria-expanded={on} aria-controls={`${uid}-${g.key}`} data-testid={`nav-${g.key}`}
              onClick={() => setOpen(on ? null : g.key)}
              onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setOpen(g.key); setTimeout(() => document.querySelector<HTMLAnchorElement>(`#${CSS.escape(`${uid}-${g.key}`)} a`)?.focus(), 30); } }}
              className={`flex items-center gap-1 rounded-full px-3 py-2 transition ${on || act ? "bg-white/10 text-gold" : "text-dim hover:bg-white/5 hover:text-mist"}`}>
              {g.label}<span className={`text-[10px] transition-transform duration-300 ${on ? "rotate-180" : ""}`} aria-hidden>▾</span>
            </button>
            <div id={`${uid}-${g.key}`} role="menu" aria-label={g.label}
              className={`absolute left-1/2 top-full z-50 w-[min(820px,calc(100vw-2rem))] -translate-x-1/2 pt-2 transition duration-300 ${on ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}>
              <div className="grid grid-cols-[230px_1fr] gap-3 rounded-[28px] border border-white/15 bg-ink/95 p-3 shadow-[0_40px_90px_-30px_rgba(0,0,0,.9),0_0_60px_-30px_rgba(139,108,240,.8)] backdrop-blur-2xl" data-testid={`mega-${g.key}`}>
                <Feature g={g} onPick={() => setOpen(null)} />
                <div className={`grid content-start gap-1 ${g.items.length > 5 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}>
                  {g.items.map((it) => <ItemLink key={it.href} it={it} onPick={() => setOpen(null)} />)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <PricingLink />
    </div>
  );
}

/** Top-level "Daily horoscope" link, right after Today (each locale has its own slug). */
function HoroscopeLink() {
  const N = useNav(); const h = useHref(); const { locale } = useContent(); const path = usePathname() || ""; const href = horoHubPath(locale); const on = path.includes(href);
  return <Link href={h(href)} data-testid="nav-horoscope" className={`whitespace-nowrap rounded-full px-3 py-2 transition ${on ? "bg-white/10 text-gold" : "text-dim hover:bg-white/5 hover:text-mist"}`}>{N.horoscope.label}</Link>;
}

/** Top-level "Pricing" link (each locale has its own slug). */
function PricingLink() {
  const N = useNav(); const h = useHref(); const { locale } = useContent(); const path = usePathname() || ""; const href = pricingPath(locale); const on = path.includes(href);
  return <Link href={h(href)} data-testid="nav-pricing" className={`whitespace-nowrap rounded-full px-3 py-2 transition ${on ? "bg-white/10 text-gold" : "text-dim hover:bg-white/5 hover:text-mist"}`}>{N.pricing.label}</Link>;
}

/** Phone: slide-up sheet with every destination, grouped. */
export function MoreSheet({ open, onClose, keys, top }: { open: boolean; onClose: () => void; keys: NavGroupKey[]; top?: React.ReactNode }) {
  const groups = useGroups(keys); const N = useNav(); const path = usePathname() || ""; const h = useHref(); const { locale } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onClose(), [onClose]);
  useEffect(() => { close(); }, [path, close]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", k); setTimeout(() => ref.current?.querySelector<HTMLElement>("a,button")?.focus(), 50);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", k); };
  }, [open, close]);
  return (
    <div className={`fixed inset-0 z-[55] lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-night/70 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} onClick={close} />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={N.menu} data-testid="more-sheet"
        className={`absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto overscroll-contain rounded-t-[30px] border-t border-white/15 bg-ink/95 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-30px_80px_-20px_rgba(139,108,240,.6)] backdrop-blur-2xl transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${open ? "translate-y-0" : "translate-y-full"}`}>
        <div className="sticky top-0 z-10 -mx-4 mb-2 flex items-center justify-between bg-ink/95 px-4 pb-2 pt-1">
          <div className="mx-auto h-1 w-10 rounded-full bg-white/25" />
        </div>
        <div className="mb-3 flex items-center justify-between gap-3"><p className="h-display text-3xl text-aurora">{N.menu}</p><button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-dim" aria-label={N.close} data-testid="more-close">✕</button></div>
        {top}
        <Link href={h(horoHubPath(locale))} onClick={close} data-testid="sheet-horoscope"
          className="mb-2 flex min-h-[52px] items-center justify-between gap-3 rounded-2xl border border-white/15 bg-gradient-to-r from-violet/20 via-white/[0.04] to-transparent px-4 py-3">
          <span className="min-w-0"><span className="block font-semibold text-mist">☾ {N.horoscope.label}</span><span className="block truncate text-xs text-dim">{N.horoscope.desc}</span></span>
          <span className="text-gold" aria-hidden>→</span>
        </Link>
        <Link href={h(pricingPath(locale))} onClick={close} data-testid="sheet-pricing"
          className="mb-5 flex min-h-[52px] items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-gradient-to-r from-gold/15 via-violet/15 to-transparent px-4 py-3">
          <span className="min-w-0"><span className="block font-semibold text-gold">{N.pricing.label}</span><span className="block truncate text-xs text-dim">{N.pricing.desc}</span></span>
          <span className="text-gold" aria-hidden>→</span>
        </Link>
        {groups.map((g) => (
          <section key={g.key} className="mb-5">
            <p className="eyebrow mb-2">✦ {g.label}</p>
            <div className="grid grid-cols-1 gap-1 min-[420px]:grid-cols-2">{g.items.map((it) => <ItemLink key={it.href} it={it} compact />)}</div>
          </section>
        ))}
      </div>
    </div>
  );
}

/** Phone bottom tab bar for signed-in users: four destinations + More. */
export function TabBar() {
  const N = useNav(); const h = useHref(); const path = usePathname() || "";
  const [more, setMore] = useState(false);
  const close = useCallback(() => setMore(false), []);
  const tabs: { href: string; label: string; icon: EmblemId; match: string[] }[] = [
    { href: "/today/", label: N.today.label, icon: "sun", match: ["/today/", "/daily/"] },
    { href: "/me/", label: N.groups.me.label, icon: "chart", match: ["/me/", "/book/", "/chart/"] },
    { href: "/match/", label: N.groups.bonds.label, icon: "bond", match: ["/match/", "/bond/", "/people/", "/person/", "/play/"] },
    { href: "/quizzes/", label: N.groups.tests.label, icon: "big-five", match: ["/quizzes/", "/quiz/"] },
  ];
  return (
    <>
      <nav aria-label={N.aria.tabs} className="fixed inset-x-3 bottom-3 z-[56] grid grid-cols-5 rounded-3xl border border-white/15 bg-ink/85 pb-[env(safe-area-inset-bottom)] shadow-[0_20px_50px_-15px_rgba(0,0,0,.8)] backdrop-blur-xl lg:hidden" data-testid="tab-bar">
        {tabs.map((t) => { const on = !more && t.match.some((m) => path.includes(m)); return (
          <Link key={t.href} href={h(t.href)} aria-current={on ? "page" : undefined} className={`relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[10.5px] transition ${on ? "text-gold" : "text-dim"}`}>
            {on && <span className="absolute inset-x-3 top-1 h-[3px] rounded-full bg-gold shadow-[0_0_10px_rgba(246,207,122,.9)]" />}
            <Emblem id={t.icon} className={`h-6 w-6 transition ${on ? "scale-110 glow-gold" : "opacity-70"}`} />{t.label}
          </Link>); })}
        <button type="button" onClick={() => setMore(!more)} aria-expanded={more} aria-haspopup="dialog" data-testid="tab-more" className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[10.5px] ${more ? "text-gold" : "text-dim"}`}>
          <span className={`grid h-6 w-6 place-items-center transition ${more ? "rotate-45" : ""}`} aria-hidden><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg></span>{N.more}
        </button>
      </nav>
      <MoreSheet open={more} onClose={close} keys={["me", "bonds", "tests", "discover"]} />
    </>
  );
}
