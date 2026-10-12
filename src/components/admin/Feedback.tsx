"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { sb } from "@/lib/supabase";
import { useAccount } from "@/lib/sync";
import { useContent } from "@/lib/content-context";
import { trackVisit } from "@/lib/track";
import { useAdminText } from "./text";

/** Mounted once in the layout: counts one visit per tab session once we know whether someone is signed in. */
export function UsageBoot() {
  const a = useAccount();
  useEffect(() => { if (a.ready) trackVisit(); }, [a.ready]);
  return null;
}

/** Floating "Feedback" button for signed-in users on every page. Text only, no screenshots. */
export function FeedbackButton() {
  const a = useAccount(); const T = useAdminText(); const { locale } = useContent(); const path = usePathname() || "/";
  const [open, setOpen] = useState(false); const [msg, setMsg] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [open]);
  if (!a.user || /\/admin(\/|$)/.test(path)) return null;
  const send = async (e: React.FormEvent) => {
    e.preventDefault(); if (!msg.trim()) return;
    setState("busy");
    const url = (location.pathname + location.search).slice(0, 500);
    const { error } = await sb()!.from("feedback").insert({ message: msg.trim().slice(0, 4000), page_url: url, locale, user_agent: navigator.userAgent.slice(0, 300) });
    if (error) { setState("error"); return; }
    setState("done"); setMsg("");
  };
  const close = () => { setOpen(false); if (state === "done" || state === "error") setState("idle"); };
  return (
    <>
      <button type="button" onClick={() => { setOpen(true); setState("idle"); }} data-testid="feedback-open"
        className="fixed bottom-[92px] right-3 z-30 flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/20 bg-ink/85 px-3.5 text-[13px] text-mist shadow-[0_12px_30px_-10px_rgba(0,0,0,.8)] backdrop-blur-xl transition hover:border-gold/60 hover:text-gold lg:bottom-6 lg:right-6">
        <span aria-hidden>💬</span>{T.fbButton}
      </button>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-night/70 backdrop-blur-sm sm:items-center" onClick={close} role="presentation">
          <form onSubmit={send} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="fb-title" data-testid="feedback-sheet"
            className="w-full max-w-md rounded-t-[28px] border border-white/15 bg-ink/95 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-20px_60px_-20px_rgba(139,108,240,.7)] sm:rounded-[28px]">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20 sm:hidden" />
            <div className="mb-1 flex items-start justify-between gap-3"><h2 id="fb-title" className="h-display text-2xl">{T.fbTitle}</h2><button type="button" onClick={close} className="grid h-9 w-9 place-items-center rounded-full text-dim hover:text-mist" aria-label={T.fbClose}>✕</button></div>
            {state === "done" ? (
              <p role="status" className="my-6 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-center" data-testid="feedback-done">{T.fbThanks}</p>
            ) : (
              <>
                <p className="mb-3 text-sm text-dim">{T.fbHint}</p>
                <textarea autoFocus className="input h-32 w-full resize-none text-[16px]" maxLength={4000} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={T.fbPh} data-testid="feedback-text" />
                <p className="mt-1 truncate text-xs text-dim">{T.fbPage(path)}</p>
                {state === "error" && <p role="alert" className="mt-2 text-sm text-rose">{T.fbError}</p>}
                <button className="btn-primary mt-3 w-full py-3" disabled={state === "busy" || !msg.trim()} data-testid="feedback-send">{state === "busy" ? "…" : T.fbSend}</button>
              </>
            )}
          </form>
        </div>
      )}
    </>
  );
}
