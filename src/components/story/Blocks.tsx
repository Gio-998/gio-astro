"use client";
import Link from "next/link";
import type { Block } from "@/story/types";
import { useContent, useHref } from "@/lib/content-context";
import { quizDefs } from "@/lib/quiz-defs";
import { Emblem } from "../art/Emblem";

const ICON: Record<string, string> = { daily: "☾", strengths: "✦", shadows: "◐", practices: "❋", journal: "✎", focus: "➶" };

/** Renders story blocks with a comfortable long-form reading typography (see .reading in globals.css). */
export function Blocks({ blocks, forId }: { blocks: Block[]; forId?: string }) {
  const { c } = useContent(); const h = useHref(); const defs = quizDefs(c);
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case "lead": return <p key={i} className="lead">{b.text}</p>;
          case "p": return <p key={i}>{b.text}</p>;
          case "h": return <h3 key={i}>{b.text}</h3>;
          case "quote": return <blockquote key={i} className="pull">“{b.text}”</blockquote>;
          case "list": return (
            <div key={i} className={`rlist rlist-${b.kind}`}>
              <p className="rlist-title"><span aria-hidden>{ICON[b.kind]}</span> {b.title}</p>
              <ul>{b.items.map((x, k) => <li key={k}>{x}</li>)}</ul>
            </div>
          );
          case "facets": return (
            <div key={i} className="facets">{b.items.map((f, k) => <div key={k} className="facet"><p className="facet-label">{f.label}</p><p>{f.text}</p></div>)}</div>
          );
          case "callout": return (
            <aside key={i} className={`callout callout-${b.tone}`}>{b.title && <p className="callout-title">{b.tone === "agree" ? "⟡ " : b.tone === "differ" ? "⇋ " : "✧ "}{b.title}</p>}<p>{b.text}</p></aside>
          );
          case "deep": return (
            <details key={i} className="deepdive">
              <summary><span>{b.title}</span><span className="deepdive-arrow" aria-hidden>⌄</span></summary>
              <div className="deepdive-body"><Blocks blocks={b.blocks} forId={forId} /></div>
            </details>
          );
          case "palette": return (
            <div key={i} className="my-4 grid grid-cols-5 gap-2">{b.colors.map((col, k) => (
              <div key={k} className="text-center">
                <div className="mx-auto mb-1 h-14 w-14 rounded-full ring-2 ring-white/40 shadow-lg" style={{ background: `radial-gradient(circle at 30% 30%, #ffffff66, ${col} 62%)` }} />
                <p className="text-[11px] leading-tight opacity-80">{b.labels[k]}</p><p className="font-mono text-[10px] opacity-60">{col}</p>
              </div>))}
            </div>
          );
          case "lock": return (
            <div key={i} className="lockbox not-reading">
              <p className="h-display text-2xl">✧ {c.book.lockedTitle}</p>
              <p className="mb-3 text-sm opacity-80">{c.book.lockedText(b.quizzes.map((q) => defs[q].title).join(" + "))}</p>
              <div className="flex flex-wrap gap-2">{b.quizzes.map((q) => (
                <Link key={q} href={h(`/quiz/${q}/${forId && forId !== "me" ? `?for=${forId}` : ""}`)} className="btn-primary"><Emblem id={q} className="h-5 w-5" />{defs[q].title} · {defs[q].minutes} min</Link>
              ))}</div>
            </div>
          );
        }
      })}
    </>
  );
}
