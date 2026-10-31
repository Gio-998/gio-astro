/**
 * The rules for a lead, shared by the submit-lead Edge Function and the browser so the two cannot drift.
 * No imports and no platform APIs: Deno runs this file as is, and the Next.js bundle imports it from src/lib/lead.ts.
 */
export const LIMITS = { name: 100, email: 254, emailLocal: 64, source: 64, consentText: 600, version: 32, bodyBytes: 8192 } as const;

export type LeadErrorCode = "invalid_name" | "invalid_email" | "invalid_source" | "invalid_locale" | "invalid_consent";

export interface LeadPayload { name: unknown; email: unknown; locale: unknown; source: unknown; marketing: unknown; marketingText?: unknown; privacyVersion: unknown; at?: unknown }
export interface CleanLead { name: string; email: string; locale: string; source: string; marketing: boolean; marketingText: string | null; privacyVersion: string; at: string | null }

const HTML = /[<>]/;
const CONTROL = /\p{Cc}/u;
const LINKISH = /:\/\/|www\.|@|[\p{L}\p{N}-]\.\p{L}{2,}/iu;
const EMAIL_CHARS = "[^\\s@<>\"'`()\\[\\]\\\\,;:]";
const EMAIL_RE = new RegExp(`^${EMAIL_CHARS}+@${EMAIL_CHARS}+\\.${EMAIL_CHARS}{2,}$`, "u");

export function cleanName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const name = raw.normalize("NFC").replace(/\s+/gu, " ").trim();
  const length = [...name].length;
  if (length < 2 || length > LIMITS.name) return null;
  if (HTML.test(name) || CONTROL.test(name) || LINKISH.test(name) || !/\p{L}/u.test(name)) return null;
  return name;
}

export function cleanEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.normalize("NFC").trim().toLowerCase();
  if (email.length > LIMITS.email || !EMAIL_RE.test(email) || email.includes("..")) return null;
  const local = email.slice(0, email.indexOf("@"));
  return local.length > LIMITS.emailLocal || local.startsWith(".") || local.endsWith(".") ? null : email;
}

const GMAIL = new Set(["gmail.com", "googlemail.com"]);
/** The inbox an address really reaches: a+tag@x and a@x are one mailbox, and Gmail also ignores dots. Takes a clean address. */
export function normalizeMailbox(email: string): string {
  const at = email.lastIndexOf("@");
  const domain = email.slice(at + 1).toLowerCase();
  const local = email.slice(0, at).toLowerCase().split("+")[0] || email.slice(0, at).toLowerCase();
  return GMAIL.has(domain) ? `${local.replace(/\./g, "")}@gmail.com` : `${local}@${domain}`;
}

/** A timestamp the visitor's device claims. Queued leads arrive late, so it is kept when plausible and dropped when not. */
function cleanAt(raw: unknown, now: number): string | null {
  if (typeof raw !== "string" || raw.length > 40) return null;
  const t = Date.parse(raw);
  return Number.isNaN(t) || t > now + 864e5 || t < now - 400 * 864e5 ? null : new Date(t).toISOString();
}

export function validateLead(input: LeadPayload, now = Date.now()): { ok: true; lead: CleanLead } | { ok: false; error: LeadErrorCode } {
  const name = cleanName(input.name);
  if (!name) return { ok: false, error: "invalid_name" };
  const email = cleanEmail(input.email);
  if (!email) return { ok: false, error: "invalid_email" };
  const { locale, source, marketing, marketingText, privacyVersion } = input;
  if (typeof locale !== "string" || !/^[a-z]{2}$/.test(locale)) return { ok: false, error: "invalid_locale" };
  if (typeof source !== "string" || source.length > LIMITS.source || !/^[a-z0-9][a-z0-9:_-]*$/.test(source)) return { ok: false, error: "invalid_source" };
  if (typeof marketing !== "boolean") return { ok: false, error: "invalid_consent" };
  if (typeof privacyVersion !== "string" || privacyVersion.length > LIMITS.version || !/^[\w.-]+$/.test(privacyVersion)) return { ok: false, error: "invalid_consent" };
  let text: string | null = null;
  if (marketing) {
    if (typeof marketingText !== "string") return { ok: false, error: "invalid_consent" };
    text = marketingText.normalize("NFC").trim();
    if (!text || text.length > LIMITS.consentText || HTML.test(text) || CONTROL.test(text)) return { ok: false, error: "invalid_consent" };
  }
  return { ok: true, lead: { name, email, locale, source, marketing, marketingText: text, privacyVersion, at: cleanAt(input.at, now) } };
}

/** The first word of a clean name, or null when it is not plainly a name. This is the only part of a name that reaches an email. */
export function firstName(name: string): string | null {
  const first = name.split(" ")[0];
  return /^[\p{L}\p{M}'’-]{1,30}$/u.test(first) ? first : null;
}
