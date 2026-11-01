"use client";
import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { Book } from "@/story/types";
import { useContent, useHref } from "@/lib/content-context";
import { quizDefs } from "@/lib/quiz-defs";
import { Blocks } from "./Blocks";
import { ChapterOpener } from "../systems/VoiceLines";
import { SignArt } from "../art/SignArt";
import { Emblem } from "../art/Emblem";
import { Reveal } from "../art/Reveal";
import { cosmos } from "../art/ArtCard";
import { PremiumGate, useChapterLimit } from "../premium/Gate";
import { blockTeaser } from "@/lib/profile-teaser";
import { ReadingGate, useResultsOpen } from "../profile/ProfileGate";

export type ReadTheme = "paper" | "night";
const themeSubs = new Set<() => void>();
const readTheme = (): ReadTheme => { try { return localStorage.getItem("mirrorstar:read-theme") === "night" ? "night" : "paper"; } catch { return "paper"; } };
export function useReadTheme(): [ReadTheme, (t: ReadTheme) => void] {
  const t = useSyncExternalStore((cb) => { themeSubs.add(cb); return () => themeSubs.delete(cb); }, readTheme, () => "paper" as ReadTheme);
  return [t, (v) => { try { localStorage.setItem("mirrorstar:read-theme", v); } catch {} themeSubs.forEach((f) => f()); }];
}

export function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const f = () => { const h = document.documentElement; setP(Math.min(1, h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight))); };
    f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f);
  }, []);
  return <div className="no-print fixed inset-x-0 top-0 z-50 h-1 bg-white/10" aria-hidden><div className="h-full bg-gradient-to-r from-gold via-rose to-lilac" style={{ width: `${p * 100}%` }} /></div>;
}

/** Opens every <details> before printing so the PDF contains the full text. */
export function usePrintExpand() {
  useEffect(() => {
    const open = () => document.querySelectorAll("details").forEach((d) => d.setAttribute("open", ""));
    window.addEventListener("beforeprint", open); return () => window.removeEventListener("beforeprint", open);
  }, []);
}

export function BookView({ book, name, forId, eyebrow, title, subtitle, intro, gate }: { book: Book; name: string; forId: string; eyebrow?: string; title?: string; subtitle?: string; intro?: string; gate?: "book" | "bond" }) {
  const { c } = useContent(); const h = useHref(); const B = c.book; const defs = quizDefs(c);
  const [theme, setTheme] = useReadTheme();
  // Premium paywall (only active for admins previewing as free, or once payments go live). A custom title = Bond Story.
  const kind = gate ?? (title ? "bond" : "book");
  const limit = useChapterLimit(kind);
  // Only the Book of You is a result of one person. Until the form is done its chapters are not on the page, so nothing may point at them.
  const resultsOpen = useResultsOpen(); const locked = kind === "book" && !resultsOpen;
  const [active, setActive] = useState(book.chapters[0]?.id);
  const [tocOpen, setTocOpen] = useState(false);
  usePrintExpand();
  useEffect(() => {
    const els = book.chapters.map((ch) => document.getElementById(`ch-${ch.id}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) setActive(e.target.id.slice(3)); }, { rootMargin: "-30% 0px -60% 0px" });
    els.forEach((e) => io.observe(e)); return () => io.disconnect();
  }, [book, locked]);
  const missingAll = useMemo(() => [...new Set(book.chapters.flatMap((x) => x.missing))], [book]);

  const chapterEl = (ch: Book["chapters"][number], i: number) => (
    <section key={ch.id} id={`ch-${ch.id}`} className="chapter scroll-mt-24">
      <Reveal>
        <div className="chapter-head">
          <div className="chapter-art" aria-hidden>{ch.art.kind === "sign" ? <SignArt sign={ch.art.sign} className="h-28 w-28" /> : <Emblem id={ch.art.id} className="h-24 w-24" />}</div>
          <span className="chapter-big no-print" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
          <p className="chapter-num">{B.chapter(i + 1)}</p>
          <h2 className="chapter-title">{ch.title}</h2>
          <p className="chapter-kicker">{ch.kicker}</p>
          <div className="chapter-rule" aria-hidden>✦</div>
        </div>
      </Reveal>
      <div className="reading">
        <ChapterOpener id={ch.id} />
        <Blocks blocks={ch.blocks} forId={forId} />
        {!ch.locked && ch.missing.length > 0 && (
          <p className="partly no-print">✧ {B.partly(ch.missing.map((q) => defs[q].title).join(" + "))} {ch.missing.map((q) => <Link key={q} className="ml-1 underline" href={h(`/quiz/${q}/${forId !== "me" ? `?for=${forId}` : ""}`)}>{defs[q].title} →</Link>)}</p>
        )}
      </div>
    </section>
  );

  const surface = (
    <div className="reading-surface">
      {B.langNote && <p className="mx-auto mb-4 max-w-xl rounded-xl border border-gold/30 bg-gold/10 px-4 py-2 text-sm print:hidden">🌐 {B.langNote}</p>}
      {(intro ?? B.intro(name, book.lenses)) && <p className="reading-intro">{intro ?? B.intro(name, book.lenses)}</p>}
      {book.chapters.map((ch, i) => i < limit ? chapterEl(ch, i) : i === limit ? (
        <div key={ch.id} style={{ "--gate-fade": theme === "paper" ? "#f4ece2" : "#1b1546" } as React.CSSProperties}>
          <PremiumGate kind={kind} rest={book.chapters.slice(limit + 1).map((x) => x.title)}>{chapterEl(ch, i)}</PremiumGate>
        </div>
      ) : null)}
      <p className="reading-honest">{B.honest}</p>
    </div>
  );

  return (
    <div className={`book book-${theme}`}>
      <ReadingProgress />
      {/* Cover */}
      <header className="relative mb-8 overflow-hidden rounded-[32px] border border-white/15 px-6 py-12 text-mist shadow-[0_30px_80px_-40px_rgba(139,108,240,.9)] sm:px-12 sm:py-16 print-cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cosmos("helix", 1280)} alt="" className="no-print absolute inset-0 h-full w-full animate-kenburns object-cover opacity-50" />
        <div className="no-print absolute inset-0 bg-gradient-to-br from-night via-night/80 to-indigo/40" />
        <div className="relative text-center">
          <p className="eyebrow mb-3">{eyebrow ?? B.eyebrow}</p>
          <h1 className="h-display mb-2 text-[clamp(2.6rem,7vw,4.6rem)] leading-none"><span className="text-aurora">{title ?? B.title}</span></h1>
          <p className="h-display mb-5 text-2xl italic opacity-90">{subtitle ?? name}</p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <span className="chip text-mist">✦ {B.lensCount(book.lenses)}</span>
            <span className="chip text-mist">✎ {B.words(book.words)}</span>
            <span className="chip text-mist">◷ {B.readingTime(book.minutes)}</span>
          </div>
          <div className="no-print mt-6 flex flex-wrap justify-center gap-2">
            {!locked && <button className="btn-primary" onClick={() => window.print()}>⎙ {B.print}</button>}
            <button className="btn-ghost" onClick={() => setTheme(theme === "paper" ? "night" : "paper")}>{theme === "paper" ? "☾" : "☀"} {theme === "paper" ? B.themeNight : B.themePaper}</button>
          </div>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="no-print toc-card mb-10" aria-label={B.toc}>
        <p className="eyebrow mb-3">{B.toc}</p>
        <ol className="grid gap-1 sm:grid-cols-2">
          {book.chapters.map((ch, i) => (
            <li key={ch.id}>{locked
              ? <span className="toc-link"><span className="toc-num">{String(i + 1).padStart(2, "0")}</span><span>{ch.title}</span></span>
              : <a href={`#ch-${ch.id}`} className={`toc-link ${active === ch.id ? "toc-active" : ""}`}><span className="toc-num">{String(i + 1).padStart(2, "0")}</span><span>{ch.title}</span>{(ch.locked || i >= limit) && <span className="ml-auto text-xs opacity-70">🔒</span>}</a>}</li>
          ))}
        </ol>
        {missingAll.length > 0 && (
          <p className="mt-4 text-sm opacity-80">{B.partly("")}{" "}{missingAll.map((q, k) => <span key={q}>{k ? " · " : ""}<Link className="text-gold underline" href={h(`/quiz/${q}/${forId !== "me" ? `?for=${forId}` : ""}`)}>{defs[q].title}</Link></span>)}</p>
        )}
      </nav>

      {kind === "book" ? <ReadingGate teaser={book.chapters[0] ? blockTeaser(book.chapters[0].title, book.chapters[0].blocks) : null}>{surface}</ReadingGate> : surface}

      {/* Chapter dots on the right edge */}
      {!locked && <nav className="no-print fixed right-1.5 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-1.5" aria-hidden>
        {book.chapters.map((ch) => <a key={ch.id} href={`#ch-${ch.id}`} tabIndex={-1} className={`block h-1.5 w-1.5 rounded-full transition-all ${active === ch.id ? "h-4 bg-gold" : "bg-white/30"}`} />)}
      </nav>}
      <ShareLine />
      {/* Contents as a bottom sheet */}
      {!locked && <button className="no-print fixed bottom-24 right-4 z-40 min-h-[44px] rounded-full border border-white/20 bg-ink/90 px-4 text-sm text-mist shadow-xl backdrop-blur md:bottom-6" onClick={() => setTocOpen(true)} aria-expanded={tocOpen} data-testid="toc-open">☰ {B.toc}</button>}
      {tocOpen && (
        <div className="no-print fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={B.toc}>
          <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-label={c.sky.reader.close} onClick={() => setTocOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[75svh] overflow-auto rounded-t-[28px] border-t border-white/15 bg-[#151135] px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 text-mist shadow-2xl">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-white/25" />
            <p className="eyebrow mb-2 px-2">{B.toc}</p>
            {book.chapters.map((ch, i) => <a key={ch.id} href={`#ch-${ch.id}`} onClick={() => setTocOpen(false)} className={`flex min-h-[48px] items-center gap-3 rounded-xl px-3 text-[15px] ${active === ch.id ? "bg-white/10 text-gold" : "active:bg-white/5"}`}><span className="w-6 font-display text-gold/80">{String(i + 1).padStart(2, "0")}</span><span className="text-balance">{ch.title}</span></a>)}
          </div>
        </div>
      )}
    </div>
  );
}

/** Select a sentence in the reader, then share or copy it. */
function ShareLine() {
  const { c } = useContent(); const R = c.sky.reader;
  const [sel, setSel] = useState<{ text: string; x: number; y: number } | null>(null); const [done, setDone] = useState(false);
  useEffect(() => {
    const f = () => {
      const s = window.getSelection(); const t = s?.toString().trim() ?? "";
      if (!s || t.length < 12 || t.length > 400 || !s.anchorNode?.parentElement?.closest(".reading")) { setSel(null); return; }
      const r = s.getRangeAt(0).getBoundingClientRect(); setSel({ text: t, x: Math.min(window.innerWidth - 90, Math.max(90, r.left + r.width / 2)), y: Math.max(70, r.top - 12) });
    };
    document.addEventListener("selectionchange", f); return () => document.removeEventListener("selectionchange", f);
  }, []);
  if (!sel) return null;
  const go = async () => {
    const text = `“${sel.text}”\n${location.origin}`;
    if (navigator.share) { try { await navigator.share({ text }); return; } catch { /* cancelled */ } }
    try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1800); } catch { /* ignore */ }
  };
  return <button className="no-print fixed z-[60] -translate-x-1/2 -translate-y-full rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink shadow-xl" style={{ left: sel.x, top: sel.y }} onMouseDown={(e) => e.preventDefault()} onClick={go}>{done ? R.copiedLine : `❝ ${R.shareLine}`}</button>;
}
