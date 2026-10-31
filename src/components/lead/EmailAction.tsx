"use client";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { confirmLeadUrl, parseEmailHash, type EmailLink } from "@/lib/lead";
import { useContent, useHref } from "@/lib/content-context";

const subscribeHash = (cb: () => void) => { window.addEventListener("hashchange", cb); return () => window.removeEventListener("hashchange", cb); };

/** The fragment is free text from the address bar: only known outcomes show, and anything else reads as a bad link. */
export function statusKey<T extends { invalid: unknown }>(link: EmailLink, known: T): keyof T {
  return link?.kind === "status" && Object.hasOwn(known, link.status) ? (link.status as keyof T) : "invalid";
}

/**
 * Landing page for links in a lead email. Nothing changes until the button is pressed: mail scanners open links on their own,
 * and a scanner must not be able to confirm or unsubscribe anybody. The form posts straight to confirm-lead, which redirects back here with the outcome.
 */
export function EmailAction() {
  const { c, locale } = useContent(); const L = c.ui.lead.page; const h = useHref();
  const hash = useSyncExternalStore(subscribeHash, () => location.hash, () => null);
  const url = confirmLeadUrl();
  if (hash === null) return <p className="py-20 text-center text-dim">{c.site.common.loading}</p>;
  const link = parseEmailHash(hash);
  const action = link?.kind === "action" && url ? link : null;
  const copy = action ? L[action.action] : L.status[statusKey(link, L.status)];
  return (
    <div className="mx-auto my-10 max-w-md rounded-[28px] border border-white/15 bg-white/[0.05] p-6 text-center shadow-[0_30px_70px_-35px_rgba(139,108,240,.9)] backdrop-blur" data-testid="email-action">
      <p className="eyebrow mb-1">✦ Horoscop</p>
      <h1 className="h-display mb-2 text-3xl">{copy.title}</h1>
      <p className="mb-5 text-sm leading-relaxed text-mist/85">{copy.text}</p>
      {action ? (
        <form method="post" action={url!}>
          <input type="hidden" name="a" value={action.action} />
          <input type="hidden" name="t" value={action.token} />
          <input type="hidden" name="l" value={locale} />
          <button className="btn-primary w-full !min-h-[48px]" data-testid="email-action-submit">{L[action.action].button}</button>
        </form>
      ) : <Link className="btn-primary inline-flex !min-h-[48px] items-center" href={h("/")}>{L.home}</Link>}
    </div>
  );
}
