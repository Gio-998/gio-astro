"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { StoredPerson } from "@/lib/store";
import { useContent, useHref } from "@/lib/content-context";
import { useAccount } from "@/lib/sync";
import { inviteCopy } from "@/lib/invite-copy";
import { ensureInvite, inviteUrl, markShared, myAccepts, importAccepts, friendPersonId, InviteAccept } from "@/lib/invites";
import { haptic } from "@/lib/haptics";

/** My personal invite link (signed-in users) + who joined through it, imported as people so the match is one tap away. */
export function useMyInvite(me: StoredPerson | null, people: StoredPerson[]) {
  const a = useAccount(); const [code, setCode] = useState<string | null>(null); const [accepts, setAccepts] = useState<InviteAccept[]>([]);
  const uid = a.user?.id; const meKey = me ? `${me.name}|${me.date}|${me.time}|${me.place?.name}` : "";
  useEffect(() => {
    if (!uid || !me) return; let alive = true;
    void ensureInvite(me).then(async (c) => { if (!alive || !c) return; setCode(c); const list = await myAccepts(c); if (!alive) return; setAccepts(list); importAccepts(list, people); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh when the account or my birth data changes
  }, [uid, meKey]);
  return { code, accepts };
}

export function InvitePanel({ me, code, accepts }: { me: StoredPerson; code: string | null; accepts: InviteAccept[] }) {
  const { locale } = useContent(); const h = useHref(); const T = inviteCopy(locale).invite;
  const [copied, setCopied] = useState(false);
  if (!code) return null;
  const url = inviteUrl(code, locale);
  const share = async () => {
    haptic("tick");
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (nav.share) { try { await nav.share({ title: T.shareTitle, text: T.shareText(me.name), url }); void markShared(); return; } catch (e) { if ((e as Error)?.name === "AbortError") return; } }
    try { await navigator.clipboard.writeText(`${T.shareText(me.name)} ${url}`); setCopied(true); setTimeout(() => setCopied(false), 2000); void markShared(); } catch { /* clipboard blocked */ }
  };
  const copy = async () => { try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); void markShared(); } catch { /* clipboard blocked */ } };
  return (
    <div className="card !p-4" data-testid="invite-panel">
      <p className="eyebrow mb-0.5">♡ {T.title}</p>
      <p className="mb-3 truncate text-sm text-dim">{T.desc}</p>
      <div className="flex items-center gap-2">
        <button className="btn-primary !min-h-[40px] flex-1 whitespace-nowrap !py-2 text-sm" onClick={share} data-testid="invite-share">⇪ {T.share}</button>
        <button className="btn-ghost !min-h-[40px] whitespace-nowrap !py-2 text-sm" onClick={copy} data-testid="invite-copy">{copied ? `✓ ${T.copied}` : T.copy}</button>
      </div>
      <p className="mt-2 truncate text-center text-xs text-dim/80" data-testid="invite-url">{url.replace(/^https?:\/\//, "")}</p>
      {accepts.length > 0 && <div className="mt-3 border-t border-white/10 pt-3">
        <p className="mb-1.5 text-xs text-dim">{T.joined}</p>
        <ul className="space-y-1">{accepts.slice(0, 6).map((x) => <li key={x.id} className="flex items-center justify-between gap-2 text-sm"><span className="truncate">{x.friend_name}</span><Link className="chip !min-h-[32px] !border-gold/40 !text-gold" href={h(`/match/?a=me&b=${friendPersonId(x.id)}`)}>{T.seeMatch} →</Link></li>)}</ul>
      </div>}
    </div>
  );
}
