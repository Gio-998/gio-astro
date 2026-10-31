"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { sb } from "@/lib/supabase";
import { useAdminText } from "./text";
import { leadsCsv, marketingState, matchesLead, type LeadRow } from "./leads-csv";

const PAGE = 1000; // the API's default row limit
const SHOWN = 200;

/** Every lead, page by page. Admin only: RLS returns nothing to anyone else. */
async function loadAll(): Promise<LeadRow[] | null> {
  const rows: LeadRow[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await sb()!.from("leads").select("*").order("created_at", { ascending: false }).range(from, from + PAGE - 1);
    if (error) return null;
    rows.push(...data);
    if (data.length < PAGE) return rows;
  }
}

function download(rows: readonly LeadRow[]) {
  const url = URL.createObjectURL(new Blob([leadsCsv(rows)], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a"); a.href = url; a.download = `horoscop-leads-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  URL.revokeObjectURL(url);
}

export function Leads({ fmt }: { fmt: (iso: string | null, time?: boolean) => string }) {
  const T = useAdminText(); const L = T.leads;
  const [rows, setRows] = useState<LeadRow[] | null>(null); const [failed, setFailed] = useState(false); const [q, setQ] = useState("");
  const load = useCallback(async () => { const r = await loadAll(); setFailed(!r); setRows(r ?? []); }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch on mount
  useEffect(() => { void load(); }, [load]);
  const hits = useMemo(() => (rows ?? []).filter((r) => matchesLead(r, q)), [rows, q]);
  if (!rows) return <p className="text-dim">{T.loading}</p>;
  return (
    <div className="space-y-3" data-testid="admin-leads">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-dim">{L.count(hits.length, rows.length)}</p>
        <div className="flex items-center gap-4"><button className="text-sm text-gold" onClick={() => void load()}>↻ {T.refresh}</button>
          <button className="btn-ghost !min-h-[36px] !px-4 !py-1 text-xs" disabled={hits.length === 0} onClick={() => download(hits)} data-testid="leads-csv">⇩ {L.csv}</button></div>
      </div>
      <input className="input" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={L.search} aria-label={L.search} data-testid="leads-search" />
      <p className="text-xs text-dim">{L.note}</p>
      {failed && <p className="text-sm text-rose">{T.error}</p>}
      {hits.length === 0 ? <p className="card text-dim">{T.empty}</p> : hits.slice(0, SHOWN).map((r) => {
        const m = marketingState(r);
        return (
          <div key={r.id} className="card !p-4" data-testid="lead-row">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0"><p className="truncate font-semibold">{r.name}</p><p className="break-all text-xs text-dim">{r.email}</p></div>
              <span className={`chip shrink-0 text-[11px] ${m === "ok" ? "text-sage" : "text-dim"}`}>{L.marketing[m]}</span>
            </div>
            <p className="mt-2 text-xs text-dim">{fmt(r.created_at)} · {r.locale} · {r.sources.join(", ")}{r.welcome_sent_at ? ` · ✉ ${fmt(r.welcome_sent_at)}` : ""}</p>
          </div>
        );
      })}
      {hits.length > SHOWN && <p className="text-center text-xs text-dim">{L.more(SHOWN)}</p>}
    </div>
  );
}
