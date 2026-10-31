"use client";
import { useCallback, useMemo, useRef } from "react";
import { summarizeTiming, type AnswerTiming, type ItemTiming } from "@/engine/play/timing";
import { levelOf10 } from "@/engine/play";
import { usePlay } from "./text";
import { now } from "./fx";

const words = (s: string) => (s.match(/\S+/g) ?? []).length;

/** Per-item response time + changes of mind for questionnaires. Call shown() when an item appears, answered() on each tap. */
export function useAnswerTiming() {
  const items = useRef<Record<string, ItemTiming>>({}); const shownAt = useRef<{ id: string; t: number } | null>(null);
  const shown = useCallback((id: string) => { shownAt.current = { id, t: now() }; }, []);
  const answered = useCallback((id: string, text: string, value: number, prev: number | undefined) => {
    const s = shownAt.current; const ms = s && s.id === id ? Math.round(now() - s.t) : 0;
    const old = items.current[id];
    if (!old) items.current[id] = { ms, words: words(text), changes: 0 };
    else if (prev !== undefined && prev !== value) old.changes += 1;
    shownAt.current = null;
  }, []);
  const summary = useCallback((): AnswerTiming => summarizeTiming({ ...items.current }), []);
  const reset = useCallback(() => { items.current = {}; }, []);
  /** Copy for the saved progress, and the way back in when a test resumes, so timing covers the whole test. */
  const dump = useCallback(() => ({ ...items.current }), []);
  const restore = useCallback((saved?: Record<string, ItemTiming>) => { items.current = { ...(saved ?? {}) }; }, []);
  return useMemo(() => ({ shown, answered, summary, reset, dump, restore }), [shown, answered, summary, reset, dump, restore]);
}

/** "How sure you were": instant answers, long pauses, changes of mind, careless-run flag. */
export function CertaintyCard({ t, texts }: { t: AnswerTiming | undefined; texts: Record<string, string> }) {
  const P = usePlay(); const T = P.timing; if (!t || !t.n) return null;
  const lv = levelOf10(t.certainty); const list = (ids: string[]) => ids.filter((id) => texts[id]).slice(0, 3);
  return (
    <div className="mt-6 rounded-[26px] border border-white/12 bg-gradient-to-br from-sage/10 via-white/[0.03] to-violet/10 p-5" data-testid="certainty-card">
      <div className="mb-3 flex items-center gap-4">
        <div className="relative grid h-16 w-16 shrink-0 place-items-center">
          <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full -rotate-90"><circle cx="32" cy="32" r="27" stroke="rgba(255,255,255,.1)" strokeWidth="6" fill="none" /><circle cx="32" cy="32" r="27" stroke="#8fe3d6" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray={`${(t.certainty / 10) * 170} 170`} /></svg>
          <span className="text-lg font-semibold">{t.certainty.toFixed(0)}</span>
        </div>
        <div><p className="eyebrow">{T.title}</p><p className="h-display text-2xl leading-tight">{T.levels[lv]}</p><p className="text-xs text-dim">{T.instant(t.instant.length, t.n)} · {T.changed(t.changed.length)}</p></div>
      </div>
      {t.careless && <p className="mb-3 rounded-xl bg-rose/10 p-3 text-sm text-rose">{T.careless}</p>}
      {list(t.instant).length > 0 && <div className="mb-3"><p className="mb-1 text-sm text-mist/85">⚡ {T.instantLead}</p>{list(t.instant).map((id) => <p key={id} className="text-sm text-dim">• {texts[id]}</p>)}</div>}
      {list(t.slow).length > 0 && <div className="mb-2"><p className="mb-1 text-sm text-mist/85">⏳ {T.slowLead}</p>{list(t.slow).map((id) => <p key={id} className="text-sm text-dim">• {texts[id]}</p>)}</div>}
      <p className="text-[11px] text-dim">{T.note}</p>
    </div>
  );
}
