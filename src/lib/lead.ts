/**
 * Visitor leads: the full result of a test opens once a visitor leaves their name and email.
 * Answers stay on the device. Only name, email, locale, source and consent are ever sent.
 * The visitor never waits on the network: if the send fails, the result still opens, the lead stays on this device, and the next visit tries again.
 * No "use client" here: the privacy page, a server component, reads PRIVACY_VERSION.
 */
import { validateLead, type LeadPayload } from "../../supabase/functions/_shared/lead-rules";

/** Date of the privacy page text a visitor saw. Change it whenever that text changes in substance. */
export const PRIVACY_VERSION = "2026-10-31";

const KEY = "horoscop:lead";
const PENDING = "horoscop:lead-pending";
const TIMEOUT_MS = 6000;

export type LeadInput = { name: string; email: string; marketing: boolean; source: string; locale: string };
/** "delivered": saved on the server. "kept": the result opens anyway. The other two go back to the form. */
export type LeadOutcome = "delivered" | "kept" | "invalid_name" | "invalid_email";

const listeners = new Set<() => void>();
const changed = () => listeners.forEach((f) => f());

export function hasLead(): boolean { try { return !!localStorage.getItem(KEY); } catch { return false; } }
export function markLead(): void { try { localStorage.setItem(KEY, new Date().toISOString()); } catch { /* private window */ } changed(); }
/** Used by "delete all my data": the device forgets the lead, so the form shows again next time. */
export function forgetLead(): void { try { localStorage.removeItem(KEY); localStorage.removeItem(PENDING); } catch { /* private window */ } changed(); }
export function subscribeLead(cb: () => void): () => void {
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) cb(); };
  listeners.add(cb); window.addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
}

const fnUrl = (name: string) => { const base = process.env.NEXT_PUBLIC_SUPABASE_URL; return base ? `${base.replace(/\/$/, "")}/functions/v1/${name}` : null; };
export const confirmLeadUrl = () => fnUrl("confirm-lead");

/** Keeps any test id inside what the server accepts, so a surprising source can never cost a lead. */
export const cleanSource = (source: string) => source.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-").replace(/^[^a-z0-9]+/, "").slice(0, 64) || "unknown";

/** invalid_* means the server refused this lead for good, so retrying is pointless. Anything else may work next time. */
export const shouldRetry = (code: unknown) => !(typeof code === "string" && code.startsWith("invalid_"));

type Sent = "delivered" | "refused" | "retry";
async function post(body: LeadPayload & { website?: string; captchaToken?: string }): Promise<Sent> {
  const url = fnUrl("submit-lead"); if (!url) return "retry";
  const stop = new AbortController(); const timer = setTimeout(() => stop.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: stop.signal });
    const j = (await r.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (r.ok && j?.ok) return "delivered";
    return shouldRetry(j?.error) ? "retry" : "refused";
  } catch { return "retry"; } finally { clearTimeout(timer); }
}

function readPending(): LeadPayload | null { try { return JSON.parse(localStorage.getItem(PENDING) || "null"); } catch { return null; } }
function keepPending(p: LeadPayload) { try { localStorage.setItem(PENDING, JSON.stringify(p)); } catch { /* private window */ } }
function clearPending() { try { localStorage.removeItem(PENDING); } catch { /* private window */ } }

export async function submitLead(input: LeadInput & { marketingText?: string; captchaToken?: string; website?: string }): Promise<LeadOutcome> {
  const payload: LeadPayload = {
    name: input.name, email: input.email, locale: input.locale, source: cleanSource(input.source), marketing: input.marketing,
    marketingText: input.marketing ? input.marketingText : undefined, privacyVersion: PRIVACY_VERSION, at: new Date().toISOString(),
  };
  const checked = validateLead(payload);
  if (!checked.ok && (checked.error === "invalid_name" || checked.error === "invalid_email")) return checked.error;
  markLead();
  if (!checked.ok) return "kept"; // a bug on our side: never make the visitor pay for it
  const clean: LeadPayload = { ...payload, name: checked.lead.name, email: checked.lead.email };
  keepPending(clean);
  const sent = await post({ ...clean, website: input.website || undefined, captchaToken: input.captchaToken });
  if (sent !== "retry") clearPending();
  return sent === "delivered" ? "delivered" : "kept";
}

let retried = false;
/** Once per page load, from the layout. A token from the first try has expired by now, so none is sent. */
export async function retryPendingLead(): Promise<void> {
  if (retried) return; retried = true;
  const pending = readPending(); if (!pending) return;
  if ((await post(pending)) !== "retry") clearPending();
}

export type EmailLink = { kind: "action"; action: "confirm" | "unsubscribe"; token: string } | { kind: "status"; status: string } | null;
/** Reads /<lang>/email/#a=confirm&t=... (from the email) or #s=confirmed (after the function has run). */
export function parseEmailHash(hash: string): EmailLink {
  const q = new URLSearchParams(hash.replace(/^#/, ""));
  const a = q.get("a"); const t = q.get("t"); const s = q.get("s");
  if ((a === "confirm" || a === "unsubscribe") && t && /^[A-Za-z0-9_-]{43}$/.test(t)) return { kind: "action", action: a, token: t };
  return s ? { kind: "status", status: s } : null;
}
