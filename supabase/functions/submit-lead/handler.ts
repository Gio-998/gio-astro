/**
 * The only write path for leads. Answers with { ok: true } or { error: code } and nothing else.
 * All platform access comes in through Deps, so tests can run the whole handler. index.ts wires up the real ones.
 */
import { LIMITS, firstName, normalizeMailbox, validateLead, type CleanLead, type LeadPayload } from "../_shared/lead-rules.ts";
import { FROM, REPLY_TO, emailLocale, emailSource, renderWelcome } from "../_shared/lead-email.ts";
import { hashIp, newToken, sha256 } from "../_shared/lead-crypto.ts";

export const ALLOWED_ORIGINS = ["https://horoscop.si", "https://www.horoscop.si", "http://localhost:3000"];
export const RATE = { limit: 20, windowSeconds: 3600 };
/** Emails per IP per day, counted apart from requests: saving a lead is cheap, an email costs quota and lands in someone's inbox. */
export const SEND_RATE = { limit: 3, windowSeconds: 86400 };
/** Resend's free plan is 100 emails a day, shared with login emails. This keeps room for logins. */
export const DAILY_EMAIL_CAP = 70;

type Rpc = (fn: string, args: Record<string, unknown>) => PromiseLike<{ data: unknown; error: unknown }>;
type Saved = { lead_id: string; needs_confirm: boolean; unsubscribed: boolean };
export interface Deps {
  rpc: Rpc;
  fetch: typeof fetch;
  /** Reads a secret. Only LEAD_IP_HASH_KEY, CAPTCHA_SECRET_KEY, RESEND_API_KEY, LEAD_EMAIL_DAILY_CAP and SUPABASE_URL are asked for. */
  env: (name: string) => string | undefined;
  /** Keeps work alive after the response has gone out. */
  defer: (work: Promise<unknown>) => void;
  /** Event names only. Never pass a name, an address or a token. */
  log: (event: string) => void;
}

const json = (status: number, body: { ok: true } | { error: string }, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });

function clientIp(req: Request): string {
  const h = req.headers;
  return h.get("cf-connecting-ip") ?? h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

async function readBody(req: Request): Promise<string | null> {
  if (Number(req.headers.get("content-length") ?? 0) > LIMITS.bodyBytes) return null;
  const text = await req.text();
  return new TextEncoder().encode(text).length > LIMITS.bodyBytes ? null : text;
}

/** "passed", "failed", or "unavailable" when Cloudflare cannot be reached. */
async function checkCaptcha(deps: Deps, token: string, secret: string): Promise<"passed" | "failed" | "unavailable"> {
  try {
    const r = await deps.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", body: new URLSearchParams({ secret, response: token }), signal: AbortSignal.timeout(5000),
    });
    const j = (await r.json()) as { success?: boolean };
    return j.success === true ? "passed" : "failed";
  } catch { return "unavailable"; }
}

/** Sends the welcome email if the limits allow it. Only called once Turnstile has passed. Nothing here can fail the visitor: every problem ends in a log line. */
export async function sendWelcome(deps: Deps, lead: CleanLead, saved: Saved, sender: { ip: string; ipKey: string }) {
  try {
    const apiKey = deps.env("RESEND_API_KEY");
    if (!apiKey) return deps.log("email_skipped_no_key");
    if (saved.unsubscribed) return deps.log("email_skipped_unsubscribed");

    const bucket = await deps.rpc("lead_rate_hit", { p_ip_hash: await hashIp(sender.ip, sender.ipKey, new Date(), "send"), p_limit: SEND_RATE.limit, p_window_seconds: SEND_RATE.windowSeconds });
    if (bucket.error) return deps.log("email_send_limit_failed");
    if (bucket.data !== true) return deps.log("email_skipped_send_limit");

    const key = emailSource(lead.source);
    const unsubscribeToken = newToken(); const unsubscribeHash = await sha256(unsubscribeToken);
    const newConfirm = saved.needs_confirm ? newToken() : null; const newConfirmHash = newConfirm ? await sha256(newConfirm) : null;
    const cap = Number(deps.env("LEAD_EMAIL_DAILY_CAP")) || DAILY_EMAIL_CAP;
    const claim = await deps.rpc("lead_email_claim", {
      p_lead_id: saved.lead_id, p_source: key, p_mailbox_hash: await sha256(normalizeMailbox(lead.email)), p_daily_cap: cap,
      p_unsubscribe_hash: unsubscribeHash, p_confirm_hash: newConfirmHash,
    });
    if (claim.error) return deps.log("email_claim_failed");
    if (claim.data !== "claimed" && claim.data !== "claimed_confirm") return deps.log(claim.data === "capped" ? "email_skipped_daily_cap" : claim.data === "unsubscribed" ? "email_skipped_unsubscribed" : "email_skipped_duplicate");

    // The database decides: with an unused confirm link already out, it stores no new one, so this email must not carry one.
    const withConfirm = claim.data === "claimed_confirm";
    const confirmToken = withConfirm ? newConfirm : null;
    const mail = renderWelcome({ locale: emailLocale(lead.locale), firstName: firstName(lead.name), source: lead.source, unsubscribeToken, confirmToken });
    const oneClick = `${deps.env("SUPABASE_URL")}/functions/v1/confirm-lead?a=unsubscribe&t=${unsubscribeToken}`;
    let ok = false;
    try {
      const r = await deps.fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `lead-welcome/${saved.lead_id}/${key}/${withConfirm ? "confirm" : "plain"}` },
        body: JSON.stringify({
          from: FROM, to: [lead.email], reply_to: REPLY_TO, subject: mail.subject, html: mail.html, text: mail.text,
          headers: { "List-Unsubscribe": `<${oneClick}>, <mailto:${REPLY_TO}?subject=unsubscribe>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
        }),
        signal: AbortSignal.timeout(8000),
      });
      ok = r.ok;
      if (!ok) deps.log(r.status === 429 ? "email_rate_limited" : `email_failed_${r.status}`);
    } catch { deps.log("email_unreachable"); }

    const done = await deps.rpc("lead_email_done", { p_lead_id: saved.lead_id, p_unsubscribe_hash: unsubscribeHash, p_confirm_hash: withConfirm ? newConfirmHash : null, p_ok: ok });
    if (done.error) deps.log("email_record_failed");
  } catch { deps.log("email_unexpected"); }
}

/** Runs after the response, so a slow Cloudflare never slows the visitor. No pass, no email: the lead is already saved either way. */
async function welcomeIfHuman(deps: Deps, lead: CleanLead, saved: Saved, token: unknown, sender: { ip: string; ipKey: string }) {
  const secret = deps.env("CAPTCHA_SECRET_KEY");
  if (!secret) return deps.log("email_skipped_no_captcha_secret");
  if (typeof token !== "string" || !token) return deps.log("email_skipped_captcha_missing");
  const verdict = await checkCaptcha(deps, token.slice(0, 2048), secret);
  if (verdict !== "passed") return deps.log(`email_skipped_captcha_${verdict}`);
  await sendWelcome(deps, lead, saved, sender);
}

export function createHandler(deps: Deps) {
  return async (req: Request): Promise<Response> => {
    const origin = req.headers.get("origin") ?? "";
    const allowed = ALLOWED_ORIGINS.includes(origin);
    const cors: Record<string, string> = allowed ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : { Vary: "Origin" };

    if (req.method === "OPTIONS") return new Response(null, { status: allowed ? 204 : 403, headers: { ...cors, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "content-type", "Access-Control-Max-Age": "86400" } });
    if (!allowed) return json(403, { error: "origin" }, cors);
    if (req.method !== "POST") return json(405, { error: "method" }, cors);

    const body = await readBody(req);
    if (body === null) return json(413, { error: "too_large" }, cors);
    let payload: (LeadPayload & { website?: unknown; captchaToken?: unknown }) | null = null;
    try { payload = JSON.parse(body); } catch { /* handled below */ }
    if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return json(400, { error: "bad_json" }, cors);

    // Honeypot: look like a success, so a bot learns nothing.
    if (typeof payload.website === "string" && payload.website.trim()) return json(200, { ok: true }, cors);

    const checked = validateLead(payload);
    if (!checked.ok) return json(400, { error: checked.error }, cors);
    const { lead } = checked;

    try {
      const ipKey = deps.env("LEAD_IP_HASH_KEY");
      // Never fall back to another key. The browser keeps the lead and tries again on the next visit.
      if (!ipKey) { deps.log("lead_ip_key_missing"); return json(500, { error: "server_error" }, cors); }
      const ip = clientIp(req);
      const allowedNow = await deps.rpc("lead_rate_hit", { p_ip_hash: await hashIp(ip, ipKey), p_limit: RATE.limit, p_window_seconds: RATE.windowSeconds });
      if (allowedNow.error) throw new Error("rate_limit");
      if (allowedNow.data !== true) return json(429, { error: "rate_limited" }, cors);

      const saved = await deps.rpc("lead_upsert", {
        p_name: lead.name, p_email: lead.email, p_locale: lead.locale, p_source: lead.source, p_marketing: lead.marketing,
        p_marketing_text: lead.marketingText, p_privacy_version: lead.privacyVersion, p_client_at: lead.at,
      });
      const row = (saved.data as Saved[] | null)?.[0];
      if (saved.error || !row) throw new Error("upsert");

      // The lead is saved, so from here on nothing may turn this into a failure.
      try { deps.defer(welcomeIfHuman(deps, lead, row, payload.captchaToken, { ip, ipKey })); } catch { deps.log("email_defer_failed"); }
      return json(200, { ok: true }, cors);
    } catch {
      deps.log("lead_save_failed");
      return json(500, { error: "server_error" }, cors);
    }
  };
}
