/**
 * Double opt-in and unsubscribe. Only a POST changes anything, because mail scanners open every GET link in an email
 * and would otherwise confirm or unsubscribe people by themselves.
 *   POST from the page at /<lang>/email/ (a plain form): applies the token, then 303 to the same page with the outcome.
 *   POST with List-Unsubscribe=One-Click (RFC 8058, from the mail provider): applies the token, answers 200.
 *   GET: changes nothing, sends the visitor to that page, where one button does the POST.
 */
import { actionUrl, statusUrl } from "../_shared/lead-email.ts";
import { isToken, sha256 } from "../_shared/lead-crypto.ts";

export interface Deps {
  rpc: (fn: string, args: Record<string, unknown>) => PromiseLike<{ data: unknown; error: unknown }>;
  /** Event names only. Never pass a token. */
  log: (event: string) => void;
}
type Action = "confirm" | "unsubscribe";
const isAction = (a: unknown): a is Action => a === "confirm" || a === "unsubscribe";
const redirect = (location: string) => new Response(null, { status: 303, headers: { Location: location, "Cache-Control": "no-store" } });
const MAX_BODY = 2048;

export function createHandler(deps: Deps) {
  return async (req: Request): Promise<Response> => {
    const query = new URL(req.url).searchParams;
    const locale = query.get("l") ?? "en";

    if (req.method === "GET" || req.method === "HEAD") {
      const a = query.get("a"); const t = query.get("t");
      return redirect(isAction(a) && isToken(t) ? actionUrl(locale, a, t) : statusUrl(locale, "invalid"));
    }
    if (req.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "GET, HEAD, POST" } });

    const text = await req.text();
    const form = new URLSearchParams(text.length > MAX_BODY ? "" : text);
    const action = form.get("a") ?? query.get("a"); const token = form.get("t") ?? query.get("t");
    const lang = form.get("l") ?? locale;
    const oneClick = form.get("List-Unsubscribe") === "One-Click";
    if (!isAction(action) || !isToken(token)) return oneClick ? new Response(null, { status: 400 }) : redirect(statusUrl(lang, "invalid"));

    try {
      const { data, error } = await deps.rpc("lead_token_apply", { p_token_hash: await sha256(token), p_kind: action });
      const row = (data as { status: string; locale: string | null }[] | null)?.[0];
      if (error || !row) throw new Error("apply");
      deps.log(`token_${row.status}`);
      return oneClick ? new Response(null, { status: row.status === "invalid" ? 400 : 200 }) : redirect(statusUrl(row.locale ?? lang, row.status));
    } catch {
      deps.log("token_failed");
      return oneClick ? new Response(null, { status: 500 }) : redirect(statusUrl(lang, "error"));
    }
  };
}
