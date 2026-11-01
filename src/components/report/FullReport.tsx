"use client";
import { useMemo, useState } from "react";
import type { PairReport } from "@/engine/compat";
import type { Profile } from "@/engine/profile";
import { useContent, useDate } from "@/lib/content-context";
import { usePrinting } from "@/lib/print";
import { buildFullReport, type Block } from "@/report/pair";
import { reportEn } from "@/content/report/en";
import { reportMk } from "@/content/report/mk";
import { reportDe } from "@/content/report/de";
import { reportSr } from "@/content/report/sr";
import { Bar } from "../ui";
import "./report.css";

/** Static ring (no animation, so it prints at its real value). */
function Ring({ value, label }: { value: number; label: string }) {
  const p = Math.max(0, Math.min(1, (value - 45) / 55)); const r = 34, c = 2 * Math.PI * r;
  return (
    <div className="fr-ring">
      <svg viewBox="0 0 80 80" width="88" height="88" aria-hidden><circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="6" />
        <circle cx="40" cy="40" r={r} fill="none" stroke="url(#fr-g)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${c * p} ${c}`} transform="rotate(-90 40 40)" />
        <defs><linearGradient id="fr-g" x1="0" x2="1"><stop offset="0" stopColor="#8b6cf0" /><stop offset="1" stopColor="#f6cf7a" /></linearGradient></defs>
        <text x="40" y="46" textAnchor="middle" fontSize="20" fill="#f6cf7a" fontFamily="Georgia, serif">{value}</text></svg>
      <span>{label}</span>
    </div>
  );
}

function BlockView({ b }: { b: Block }) {
  switch (b.k) {
    case "p": return <p className={b.lead ? "fr-lead" : "fr-p"}>{b.t}</p>;
    case "h": return <h4 className="fr-h">{b.icon && <span aria-hidden>{b.icon} </span>}{b.t}</h4>;
    case "list": return <ul className={`fr-list fr-${b.tone ?? "plus"}`}>{b.items.map((t, i) => <li key={i}>{t}</li>)}</ul>;
    case "trio": return (
      <div className="fr-box"><p className="fr-box-title">{b.title}</p>
        {b.rows.map((r, i) => <p key={i} className="fr-row"><b>{r.label}</b> {r.t}</p>)}</div>
    );
    case "score": return null;
    case "lens": return (
      <div className="fr-box fr-lens">
        <div className="fr-lens-head"><p className="fr-box-title">{b.name}</p><span className="chip">{b.badge}</span></div>
        <p className="fr-p">{b.measures}</p>
        <div className="fr-bars"><Bar value={((b.harmony - 45) / 55) * 100} label={b.result[0].split(" ")[0]} right={String(b.harmony)} /><Bar value={((b.spark - 45) / 55) * 100} label={b.result[1].split(" ")[0]} right={String(b.spark)} color="bg-rose" /></div>
        {b.result.map((t, i) => <p key={i} className="fr-p">{t}</p>)}
        {b.extra && <div className="fr-bars">{b.extra.map((x) => <Bar key={x.label} value={x.value} label={x.label} right={x.right} />)}</div>}
        <p className="fr-row"><b>→</b> {b.todo}</p>
      </div>
    );
  }
}

export function FullReportView({ report, A, B, na, nb }: { report: PairReport; A: Profile; B: Profile; na: string; nb: string }) {
  const { c, locale } = useContent(); const fmt = useDate(); const printing = usePrinting();
  const R = locale === "mk" ? reportMk : locale === "de" ? reportDe : locale === "sr" ? reportSr : reportEn;
  const [open, setOpen] = useState(false);
  const doc = useMemo(() => buildFullReport(R, c, report, A, B, na, nb), [R, c, report, A, B, na, nb]);
  const arch = c.compat.archetypes[report.archetype];
  const show = open || printing;
  return (
    <section className="full-report mt-10" data-testid="full-report">
      <div className="card no-print text-center">
        <p className="eyebrow mb-2">{R.ui.eyebrow}</p>
        <p className="mx-auto mb-4 max-w-xl text-sm text-mist/85">{R.ui.teaser}</p>
        <button type="button" className="btn-primary" onClick={() => setOpen(!open)} aria-expanded={open} data-testid="full-report-toggle">{open ? R.ui.close : R.ui.open}</button>
      </div>
      {show && (
        <div className="fr-doc">
          <div className="fr-cover">
            <p className="eyebrow">{R.ui.eyebrow}</p>
            <h2 className="fr-title">{doc.title}</h2>
            <p className="fr-sub">{R.ui.sub(R.rel[report.rel].name, fmt(new Date(), { year: true }))}</p>
            <p className="fr-arch">{arch.icon} {arch.name}</p>
            <div className="fr-rings"><Ring value={report.resonance} label={R.ui.resonance} /><Ring value={report.spark} label={R.ui.spark} /></div>
            <div className="fr-toc"><p className="fr-toc-title">{R.ui.contents}</p>
              <ol>{doc.chapters.map((ch, i) => <li key={ch.id}><span>{i + 1}</span> {ch.icon} {ch.title}</li>)}</ol></div>
          </div>
          {doc.chapters.map((ch, i) => (
            <section key={ch.id} className={`fr-chapter fr-ch-${ch.id}`}>
              <h3 className="fr-ch-title"><span className="fr-ch-num">{i + 1}</span> {ch.icon} {ch.title}</h3>
              {ch.blocks.map((b, j) => <BlockView key={j} b={b} />)}
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
