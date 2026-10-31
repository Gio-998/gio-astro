/** CSV export for the admin leads tab. Every value came from a public form, so every cell is treated as hostile. */
export type LeadRow = {
  id: string; name: string; email: string; locale: string; source: string; sources: string[];
  marketing_consent: boolean; marketing_consent_at: string | null; marketing_consent_text: string | null;
  marketing_confirmed_at: string | null; unsubscribed_at: string | null; marketing_ok: boolean | null;
  privacy_version: string; welcome_sent_at: string | null; created_at: string; updated_at: string;
};

export const LEAD_COLUMNS = ["name", "email", "locale", "source", "sources", "marketing_ok", "marketing_consent", "marketing_consent_at", "marketing_confirmed_at", "unsubscribed_at", "marketing_consent_text", "privacy_version", "welcome_sent_at", "created_at", "updated_at"] as const;

/** A cell a spreadsheet would run as a formula gets a leading apostrophe, looking past any spaces or control characters in front. Full-width forms count too. */
const FORMULA = /^[\s\u0000-\u001f ]*[=+\-@|%＝＋－＠]|^[\t\r\n]/;

export function csvCell(value: unknown): string {
  const text = value == null ? "" : Array.isArray(value) ? value.join(" ") : String(value);
  const safe = FORMULA.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

/** Starts with a byte order mark, or Excel shows Cyrillic as garbage. */
export function leadsCsv(rows: readonly LeadRow[]): string {
  const head = LEAD_COLUMNS.map(csvCell).join(",");
  const body = rows.map((r) => LEAD_COLUMNS.map((k) => csvCell(r[k])).join(","));
  return `﻿${[head, ...body].join("\r\n")}\r\n`;
}

export const matchesLead = (r: LeadRow, q: string) => {
  const term = q.trim().toLowerCase();
  return !term || [r.name, r.email, r.locale, ...r.sources].some((v) => v.toLowerCase().includes(term));
};

export type MarketingState = "ok" | "unconfirmed" | "unsubscribed" | "none";
export const marketingState = (r: LeadRow): MarketingState => r.unsubscribed_at ? "unsubscribed" : r.marketing_ok ? "ok" : r.marketing_consent ? "unconfirmed" : "none";
