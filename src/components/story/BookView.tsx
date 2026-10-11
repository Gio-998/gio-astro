"use client";
import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { Book } from "@/story/types";
import { useContent, useHref } from "@/lib/content-context";
import { quizDefs } from "@/lib/quiz-defs";
import { Blocks } from "./Blocks";
import { SignArt } from "../art/SignArt";
import { Emblem } from "../art/Emblem";
import { Reveal } from "../art/Reveal";
import { cosmos } from "../art/ArtCard";

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

export function BookView({ book, name, forId, eyebrow, title, subtitle, intro }: { book: Book; name: string; forId: string; eyebrow?: string; title?: string; subtitle?: string; intro?: string }) {
  const { c } = useContent(); const h = useHref(); const B = c.book; const defs = quizDefs(c);
  const [theme, setTheme] = useReadTheme();
  const [active, setActive] = useState(book.chapters[0]?.id);
  const [tocOpen, setTocOpen] = useState(false);
  usePrintExpand();
  useEffect(() => {
    const els = book.chapters.map((ch) => document.getElementById(`ch-${ch.id}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) setActive(e.target.id.slice(3)); }, { rootMargin: "-30% 0px -60% 0px" });
    els.forEach((e) => io.observe(e)); return () => io.disconnect();
  }, [book]);
  const missingAll = useMemo(() => [...new Set(book.chapters.flatMap((x) => x.missing))], [book]);

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
            <button className="btn-primary" onClick={() => window.print()}>⎙ {B.print}</button>
            <button className="btn-ghost" onClick={() => setTheme(theme === "paper" ? "night" : "paper")}>{theme === "paper" ? "☾" : "☀"} {theme === "paper" ? B.themeNight : B.themePaper}</button>
          </div>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="no-print toc-card mb-10" aria-label={B.toc}>
        <p className="eyebrow mb-3">{B.toc}</p>
        <ol className="grid gap-1 sm:grid-cols-2">
          {book.chapters.map((ch, i) => (
            <li key={ch.id}><a href={`#ch-${ch.id}`} className={`toc-link ${active === ch.id ? "toc-active" : ""}`}><span className="toc-num">{String(i + 1).padStart(2, "0")}</span><span>{ch.title}</span>{ch.locked && <span className="ml-auto text-xs opacity-70">🔒</span>}</a></li>
          ))}
        </ol>
        {missingAll.length > 0 && (
          <p className="mt-4 text-sm opacity-80">{B.partly("")}{" "}{missingAll.map((q, k) => <span key={q}>{k ? " · " : ""}<Link className="text-gold underline" href={h(`/quiz/${q}/${forId !== "me" ? `?for=${forId}` : ""}`)}>{defs[q].title}</Link></span>)}</p>
        )}
      </nav>

      <div className="reading-surface">
        {(intro ?? B.intro(name, book.lenses)) && <p className="reading-intro">{intro ?? B.intro(name, book.lenses)}</p>}
        {book.chapters.map((ch, i) => (
          <section key={ch.id} id={`ch-${ch.id}`} className="chapter scroll-mt-24">
            <Reveal>
              <div className="chapter-head">
                <div className="chapter-art" aria-hidden>{ch.art.kind === "sign" ? <SignArt sign={ch.art.sign} className="h-28 w-28" /> : <Emblem id={ch.art.id} className="h-24 w-24" />}</div>
                <p className="chapter-num">{B.chapter(i + 1)}</p>
                <h2 className="chapter-title">{ch.title}</h2>
                <p className="chapter-kicker">{ch.kicker}</p>
                <div className="chapter-rule" aria-hidden>✦</div>
              </div>
            </Reveal>
            <div className="reading">
              <Blocks blocks={ch.blocks} forId={forId} />
              {!ch.locked && ch.missing.length > 0 && (
                <p className="partly no-print">✧ {B.partly(ch.missing.map((q) => defs[q].title).join(" + "))} {ch.missing.map((q) => <Link key={q} className="ml-1 underline" href={h(`/quiz/${q}/${forId !== "me" ? `?for=${forId}` : ""}`)}>{defs[q].title} →</Link>)}</p>
              )}
            </div>
          </section>
        ))}
        <p className="reading-honest">{B.honest}</p>
      </div>

      {/* Floating contents button (mobile) */}
      <button className="no-print fixed bottom-24 right-4 z-40 rounded-full border border-white/20 bg-ink/90 px-4 py-2 text-sm text-mist shadow-xl backdrop-blur md:bottom-6" onClick={() => setTocOpen(!tocOpen)} aria-expanded={tocOpen}>☰ {B.toc}</button>
      {tocOpen && (
        <div className="no-print fixed bottom-36 right-4 z-40 max-h-[60vh] w-72 overflow-auto rounded-3xl border border-white/15 bg-ink/95 p-4 text-mist shadow-2xl backdrop-blur md:bottom-20">
          {book.chapters.map((ch, i) => <a key={ch.id} href={`#ch-${ch.id}`} onClick={() => setTocOpen(false)} className={`block rounded-xl px-3 py-2 text-sm ${active === ch.id ? "bg-white/10 text-gold" : "hover:bg-white/5"}`}>{i + 1}. {ch.title}</a>)}
        </div>
      )}
    </div>
  );
}
