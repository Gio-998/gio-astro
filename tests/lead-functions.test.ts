import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { createHandler, type Deps } from "../supabase/functions/submit-lead/handler";
import { createHandler as confirmHandler } from "../supabase/functions/confirm-lead/handler";
import { hashIp, isToken, newToken, sha256 } from "../supabase/functions/_shared/lead-crypto";

const ORIGIN = "https://horoscop.si";
const LEAD = { name: "Ana Petrovska", email: "ana@example.com", locale: "de", source: "big-five", marketing: false, privacyVersion: "2026-10-31" };
const SAVED = { lead_id: "lead-1", needs_confirm: false, unsubscribed: false };

type Calls = { rpc: [string, Record<string, unknown>][]; urls: string[]; bodies: Record<string, unknown>[]; headers: Record<string, string>[]; logs: string[] };
function rig(opts: { rpc?: Record<string, { data?: unknown; error?: unknown }>; env?: Record<string, string>; resend?: () => Response | Promise<Response>; turnstile?: () => Response | Promise<Response> } = {}) {
  const calls: Calls = { rpc: [], urls: [], bodies: [], headers: [], logs: [] };
  const answers: Record<string, { data?: unknown; error?: unknown }> = { lead_rate_hit: { data: true }, lead_upsert: { data: [SAVED] }, lead_email_claim: { data: "claimed" }, lead_email_done: { data: null }, ...opts.rpc };
  const deferred: Promise<unknown>[] = [];
  const env: Record<string, string> = { RESEND_API_KEY: "re_test", SUPABASE_URL: "https://proj.supabase.co", ...opts.env };
  const deps: Deps = {
    rpc: async (fn, args) => { calls.rpc.push([fn, args]); return { data: answers[fn]?.data ?? null, error: answers[fn]?.error ?? null }; },
    fetch: (async (url: string, init: RequestInit) => {
      calls.urls.push(String(url));
      if (String(url).includes("turnstile")) return opts.turnstile ? opts.turnstile() : Response.json({ success: true });
      calls.bodies.push(JSON.parse(String(init.body))); calls.headers.push(init.headers as Record<string, string>);
      return opts.resend ? opts.resend() : Response.json({ id: "x" });
    }) as typeof fetch,
    env: (k) => env[k], hashKey: "server-secret", defer: (p) => { deferred.push(p); }, log: (e) => { calls.logs.push(e); },
  };
  const handle = createHandler(deps);
  const send = async (body: unknown, headers: Record<string, string> = {}) => {
    const r = await handle(new Request("https://proj.supabase.co/functions/v1/submit-lead", { method: "POST", headers: { Origin: ORIGIN, "Content-Type": "application/json", "cf-connecting-ip": "203.0.113.9", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) }));
    await Promise.all(deferred);
    return { status: r.status, json: await r.json(), headers: r.headers };
  };
  return { calls, handle, send, names: () => calls.rpc.map(([n]) => n) };
}

describe("the functions and the SQL agree", () => {
  // PostgREST finds a function by its exact argument names, and these fakes would not notice a mismatch.
  const sql = readFileSync("supabase/migrations/20261031_leads.sql", "utf8");
  const params = (fn: string) => [...new RegExp(`function public\\.${fn}\\(([^)]*)\\)\\s*returns`).exec(sql)![1].matchAll(/\bp_\w+/g)].map((m) => m[0]).sort();
  it("submit-lead sends exactly the names each function takes", async () => {
    const t = rig({ rpc: { lead_upsert: { data: [{ ...SAVED, needs_confirm: true }] } } });
    await t.send({ ...LEAD, marketing: true, marketingText: "Ja" });
    expect(t.names()).toEqual(["lead_rate_hit", "lead_upsert", "lead_email_claim", "lead_email_done"]);
    for (const [fn, args] of t.calls.rpc) expect(Object.keys(args).sort(), fn).toEqual(params(fn));
  });
  it("confirm-lead does too", async () => {
    const seen: [string, Record<string, unknown>][] = [];
    await confirmHandler({ rpc: async (fn, args) => { seen.push([fn, args]); return { data: [{ status: "confirmed", locale: "en" }], error: null }; }, log: () => {} })(new Request(`https://x.co/?a=confirm&t=${newToken()}`, { method: "POST" }));
    expect(seen).toHaveLength(1);
    expect(Object.keys(seen[0][1]).sort()).toEqual(params(seen[0][0]));
  });
});

describe("submit-lead: who may call", () => {
  it("answers the preflight for the three allowed origins", async () => {
    for (const origin of [ORIGIN, "https://www.horoscop.si", "http://localhost:3000"]) {
      const r = await rig().handle(new Request("https://x.co/", { method: "OPTIONS", headers: { Origin: origin } }));
      expect(r.status).toBe(204);
      expect(r.headers.get("Access-Control-Allow-Origin")).toBe(origin);
    }
  });
  it("refuses other origins without any CORS header", async () => {
    const r = await rig().handle(new Request("https://x.co/", { method: "OPTIONS", headers: { Origin: "https://evil.example" } }));
    expect(r.status).toBe(403);
    expect(r.headers.get("Access-Control-Allow-Origin")).toBeNull();
    const t = rig();
    const posted = await t.send(LEAD, { Origin: "https://evil.example" });
    expect([posted.status, posted.json]).toEqual([403, { error: "origin" }]);
    expect(t.calls.rpc).toEqual([]);
  });
  it("refuses a request with no Origin, and lookalikes", async () => {
    const t = rig();
    const r = await t.handle(new Request("https://x.co/", { method: "POST", body: JSON.stringify(LEAD) }));
    expect(r.status).toBe(403);
    for (const origin of ["https://horoscop.si.evil.example", "http://horoscop.si", "https://horoscop.si:8443"]) expect((await t.send(LEAD, { Origin: origin })).status, origin).toBe(403);
    expect(t.calls.rpc).toEqual([]);
  });
  it("only takes POST", async () => { expect((await rig().handle(new Request("https://x.co/", { headers: { Origin: ORIGIN } }))).status).toBe(405); });
});

describe("submit-lead: input", () => {
  it("refuses bad JSON and non-objects", async () => {
    for (const body of ["{nope", "[]", "null", "5"]) { const r = await rig().send(body); expect([r.status, r.json], body).toEqual([400, { error: "bad_json" }]); }
  });
  it("refuses an oversized body, by header and by real size", async () => {
    expect((await rig().send(LEAD, { "content-length": "999999" })).json).toEqual({ error: "too_large" });
    expect((await rig().send({ ...LEAD, padding: "x".repeat(9000) })).json).toEqual({ error: "too_large" });
  });
  it("returns only an error code, and touches nothing, for a bad lead", async () => {
    const t = rig();
    expect(await t.send({ ...LEAD, name: "<b>x</b>" }).then((r) => r.json)).toEqual({ error: "invalid_name" });
    expect(await t.send({ ...LEAD, email: "nope" }).then((r) => r.json)).toEqual({ error: "invalid_email" });
    expect(t.calls.rpc).toEqual([]);
  });
  it("treats a filled honeypot as a success and does nothing", async () => {
    const t = rig();
    const r = await t.send({ ...LEAD, website: "http://spam.example" });
    expect([r.status, r.json]).toEqual([200, { ok: true }]);
    expect(t.calls.rpc).toEqual([]); expect(t.calls.urls).toEqual([]);
  });
});

describe("submit-lead: rate limit", () => {
  it("stops before saving or sending", async () => {
    const t = rig({ rpc: { lead_rate_hit: { data: false } } });
    const r = await t.send(LEAD);
    expect([r.status, r.json]).toEqual([429, { error: "rate_limited" }]);
    expect(t.names()).toEqual(["lead_rate_hit"]);
    expect(t.calls.urls).toEqual([]);
  });
  it("never passes the raw IP anywhere", async () => {
    const t = rig(); await t.send(LEAD);
    expect(JSON.stringify(t.calls.rpc)).not.toContain("203.0.113.9");
    expect(t.calls.rpc[0][1].p_ip_hash).toMatch(/^[0-9a-f]{64}$/);
  });
  it("hashes with a key and changes daily", async () => {
    const day = new Date("2026-10-31T10:00:00Z");
    expect(await hashIp("1.2.3.4", "k", day)).not.toBe(await hashIp("1.2.3.4", "other", day));
    expect(await hashIp("1.2.3.4", "k", day)).not.toBe(await hashIp("1.2.3.4", "k", new Date("2026-11-01T10:00:00Z")));
    expect(await hashIp("1.2.3.4", "k", day)).toBe(await hashIp("1.2.3.4", "k", day));
    expect(await hashIp("1.2.3.4", "k", day)).not.toBe(await sha256("1.2.3.4"));
  });
});

describe("submit-lead: Turnstile", () => {
  const withToken = { ...LEAD, captchaToken: "tok" };
  const secret = { env: { CAPTCHA_SECRET_KEY: "s" } };
  it("verifies a token when the secret is set", async () => {
    const t = rig(secret); const r = await t.send(withToken);
    expect(r.json).toEqual({ ok: true });
    expect(t.calls.urls[0]).toContain("challenges.cloudflare.com");
  });
  it("refuses a failed token before saving", async () => {
    const t = rig({ ...secret, turnstile: () => Response.json({ success: false }) });
    expect((await t.send(withToken)).json).toEqual({ error: "captcha_failed" });
    expect(t.names()).not.toContain("lead_upsert");
  });
  it("skips the check with no secret or no token", async () => {
    for (const t of [rig(), rig(secret)]) { const r = await t.send(LEAD); expect(r.json).toEqual({ ok: true }); expect(t.calls.urls.join()).not.toContain("turnstile"); }
    const t = rig(); await t.send(withToken); expect(t.calls.urls.join()).not.toContain("turnstile");
  });
  it("says so when Cloudflare is unreachable, so the browser keeps the lead", async () => {
    const t = rig({ ...secret, turnstile: () => { throw new Error("down"); } });
    const r = await t.send(withToken);
    expect([r.status, r.json]).toEqual([503, { error: "captcha_unavailable" }]);
  });
});

describe("submit-lead: saving", () => {
  it("returns exactly { ok: true }", async () => {
    const t = rig(); const r = await t.send({ ...LEAD, email: "ANA@Example.com" });
    expect([r.status, r.json]).toEqual([200, { ok: true }]);
    expect(r.headers.get("Access-Control-Allow-Origin")).toBe(ORIGIN);
    const args = t.calls.rpc.find(([n]) => n === "lead_upsert")![1];
    expect(args).toMatchObject({ p_email: "ana@example.com", p_name: "Ana Petrovska", p_source: "big-five", p_marketing: false, p_marketing_text: null });
  });
  it("keeps database errors out of the response", async () => {
    const t = rig({ rpc: { lead_upsert: { error: { message: "secret table detail" } } } });
    const r = await t.send(LEAD);
    expect([r.status, r.json]).toEqual([500, { error: "server_error" }]);
    expect(t.calls.logs).toEqual(["lead_save_failed"]);
  });
  it("also fails safely when the rate limit can't be checked", async () => {
    expect((await rig({ rpc: { lead_rate_hit: { error: { message: "x" } } } }).send(LEAD)).json).toEqual({ error: "server_error" });
  });
});

describe("submit-lead: after the lead is saved", () => {
  it("can't turn a saved lead into a failure, even if the email can't be scheduled", async () => {
    const logs: string[] = [];
    const handle = createHandler({
      rpc: async (fn) => ({ data: fn === "lead_rate_hit" ? true : fn === "lead_upsert" ? [SAVED] : null, error: null }),
      fetch: (async () => Response.json({})) as typeof fetch, env: () => undefined, hashKey: "k", log: (e) => { logs.push(e); },
      defer: () => { throw new ReferenceError("EdgeRuntime is not defined"); },
    });
    const r = await handle(new Request("https://x.co/", { method: "POST", headers: { Origin: ORIGIN }, body: JSON.stringify(LEAD) }));
    expect([r.status, await r.json()]).toEqual([200, { ok: true }]);
    expect(logs).toContain("email_defer_failed");
    expect(logs).not.toContain("lead_save_failed");
  });
});

describe("submit-lead: the welcome email", () => {
  const mail = (t: ReturnType<typeof rig>) => t.calls.bodies[0] as { from: string; to: string[]; reply_to: string; subject: string; html: string; text: string; headers: Record<string, string> };
  it("sends from the right address to the lead, with html and text", async () => {
    const t = rig(); await t.send(LEAD);
    expect(t.calls.urls).toEqual(["https://api.resend.com/emails"]);
    const m = mail(t);
    expect(m.from).toBe("Horoscop <no-reply@horoscop.si>");
    expect(m.reply_to).toBe("contact@horoscop.si");
    expect(m.to).toEqual(["ana@example.com"]);
    expect(m.text).toContain("Hallo Ana,");
    expect(m.html).toContain("<html");
    expect(t.calls.headers[0].Authorization).toBe("Bearer re_test");
    expect(t.calls.headers[0]["Idempotency-Key"]).toBe("lead-welcome/lead-1/big-five");
  });
  it("offers a working one-click unsubscribe header", async () => {
    const t = rig(); await t.send(LEAD); const m = mail(t);
    expect(m.headers["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
    const token = /[?&]t=([\w-]{43})>/.exec(m.headers["List-Unsubscribe"])![1];
    expect(m.headers["List-Unsubscribe"]).toContain("https://proj.supabase.co/functions/v1/confirm-lead?a=unsubscribe");
    expect(t.calls.rpc.find(([n]) => n === "lead_email_claim")![1].p_unsubscribe_hash).toBe(await sha256(token));
  });
  it("stores only hashes of the tokens it emails", async () => {
    const t = rig({ rpc: { lead_upsert: { data: [{ ...SAVED, needs_confirm: true }] } } });
    await t.send({ ...LEAD, marketing: true, marketingText: "Ja" });
    const m = mail(t); const claim = t.calls.rpc.find(([n]) => n === "lead_email_claim")![1];
    const token = /#a=confirm&t=([\w-]{43})/.exec(m.text)![1];
    expect(claim.p_confirm_hash).toBe(await sha256(token));
    expect(JSON.stringify(t.calls.rpc)).not.toContain(token);
  });
  it("adds no confirm link without a tick", async () => {
    const t = rig(); await t.send(LEAD);
    expect(mail(t).text).not.toContain("#a=confirm");
    expect(t.calls.rpc.find(([n]) => n === "lead_email_claim")![1].p_confirm_hash).toBeNull();
  });
  it("records a successful send", async () => {
    const t = rig(); await t.send(LEAD);
    expect(t.calls.rpc.find(([n]) => n === "lead_email_done")![1]).toEqual({ p_lead_id: "lead-1", p_source: "big-five", p_ok: true });
  });
  it("sends nothing the second time for the same address and source", async () => {
    const t = rig({ rpc: { lead_email_claim: { data: "duplicate" } } });
    expect((await t.send(LEAD)).json).toEqual({ ok: true });
    expect(t.calls.urls).toEqual([]); expect(t.calls.logs).toEqual(["email_skipped_duplicate"]);
  });
  it("stops at the daily cap, which keeps room for login emails", async () => {
    const t = rig({ rpc: { lead_email_claim: { data: "capped" } } });
    expect((await t.send(LEAD)).json).toEqual({ ok: true });
    expect(t.calls.urls).toEqual([]); expect(t.calls.logs).toEqual(["email_skipped_daily_cap"]);
    expect(t.calls.rpc.find(([n]) => n === "lead_email_claim")![1].p_daily_cap).toBe(70);
    const custom = rig({ env: { LEAD_EMAIL_DAILY_CAP: "20" } }); await custom.send(LEAD);
    expect(custom.calls.rpc.find(([n]) => n === "lead_email_claim")![1].p_daily_cap).toBe(20);
  });
  it("still saves with no API key", async () => {
    const t = rig({ env: { RESEND_API_KEY: "" } });
    expect((await t.send(LEAD)).json).toEqual({ ok: true });
    expect(t.names()).toEqual(["lead_rate_hit", "lead_upsert"]);
    expect(t.calls.logs).toEqual(["email_skipped_no_key"]);
  });
  it("handles a Resend 429 quietly and frees the slot", async () => {
    const t = rig({ resend: () => new Response("slow down", { status: 429 }) });
    const r = await t.send(LEAD);
    expect([r.status, r.json]).toEqual([200, { ok: true }]);
    expect(t.calls.logs).toEqual(["email_rate_limited"]);
    expect(t.calls.rpc.find(([n]) => n === "lead_email_done")![1].p_ok).toBe(false);
  });
  it("hides a Resend failure or outage from the visitor", async () => {
    for (const [t, log] of [[rig({ resend: () => new Response("x", { status: 500 }) }), "email_failed_500"], [rig({ resend: () => { throw new Error("boom re_test"); } }), "email_unreachable"]] as const) {
      expect((await t.send(LEAD)).json).toEqual({ ok: true });
      expect(t.calls.logs).toEqual([log]);
    }
  });
  it("survives its own database calls failing", async () => {
    const t = rig({ rpc: { lead_email_claim: { error: { message: "x" } } } });
    expect((await t.send(LEAD)).json).toEqual({ ok: true });
    expect(t.calls.urls).toEqual([]); expect(t.calls.logs).toEqual(["email_claim_failed"]);
  });
  it("doesn't write to someone who unsubscribed, unless they tick the box again", async () => {
    const gone = rig({ rpc: { lead_upsert: { data: [{ ...SAVED, unsubscribed: true }] } } });
    await gone.send(LEAD);
    expect(gone.calls.urls).toEqual([]); expect(gone.calls.logs).toEqual(["email_skipped_unsubscribed"]);
    const back = rig({ rpc: { lead_upsert: { data: [{ ...SAVED, unsubscribed: true, needs_confirm: true }] } } });
    await back.send({ ...LEAD, marketing: true, marketingText: "Ja" });
    expect(mail(back).text).toContain("#a=confirm");
  });
  it("counts every unknown source as one, so new ids can't buy more emails", async () => {
    const t = rig(); await t.send({ ...LEAD, source: "made-up" });
    expect(t.calls.rpc.find(([n]) => n === "lead_email_claim")![1].p_source).toBe("other");
    expect(t.calls.rpc.find(([n]) => n === "lead_upsert")![1].p_source).toBe("made-up");
  });
  it("keeps a hostile name out of the email", async () => {
    const t = rig(); await t.send({ ...LEAD, name: "Win,prizes today" });
    expect(mail(t).text.startsWith("Hallo,")).toBe(true);
    expect(mail(t).html).not.toContain("prizes");
  });
  it("logs no personal data", async () => {
    const t = rig({ resend: () => new Response("x", { status: 500 }) }); await t.send(LEAD);
    expect(t.calls.logs.join()).not.toMatch(/ana|example|Petrovska|203\.0/i);
  });
});

describe("confirm-lead", () => {
  const TOKEN = newToken();
  function rigConfirm(answer: { data?: unknown; error?: unknown } = { data: [{ status: "confirmed", locale: "de" }] }) {
    const rpc: [string, Record<string, unknown>][] = []; const logs: string[] = [];
    const handle = confirmHandler({ rpc: async (fn, args) => { rpc.push([fn, args]); return { data: answer.data ?? null, error: answer.error ?? null }; }, log: (e) => { logs.push(e); } });
    const form = (fields: Record<string, string>, query = "") => handle(new Request(`https://proj.supabase.co/functions/v1/confirm-lead${query}`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(fields) }));
    return { handle, form, rpc, logs };
  }
  it("makes tokens that pass its own check", () => { expect(isToken(TOKEN)).toBe(true); expect(isToken("short")).toBe(false); expect(isToken(`${TOKEN}<`)).toBe(false); expect(newToken()).not.toBe(TOKEN); });
  it("changes nothing on a GET, however it looks, because mail scanners follow links", async () => {
    const t = rigConfirm();
    const r = await t.handle(new Request(`https://x.co/?a=confirm&t=${TOKEN}&l=de`));
    expect(r.status).toBe(303);
    expect(r.headers.get("Location")).toBe(`https://horoscop.si/de/email/#a=confirm&t=${TOKEN}`);
    await t.handle(new Request(`https://x.co/?a=unsubscribe&t=${TOKEN}`, { method: "HEAD" }));
    expect(t.rpc).toEqual([]);
  });
  it("applies a POST with only the token's hash, then redirects to the static page in the lead's language", async () => {
    const t = rigConfirm();
    const r = await t.form({ a: "confirm", t: TOKEN, l: "en" });
    expect(r.status).toBe(303);
    expect(r.headers.get("Location")).toBe("https://horoscop.si/de/email/#s=confirmed");
    expect(t.rpc).toEqual([["lead_token_apply", { p_token_hash: await sha256(TOKEN), p_kind: "confirm" }]]);
  });
  it("handles unsubscribe the same way", async () => {
    const t = rigConfirm({ data: [{ status: "unsubscribed", locale: "mk" }] });
    expect((await t.form({ a: "unsubscribe", t: TOKEN })).headers.get("Location")).toBe("https://horoscop.si/mk/email/#s=unsubscribed");
    expect(t.rpc[0][1].p_kind).toBe("unsubscribe");
  });
  it("answers a mail provider's one-click POST with a plain 200", async () => {
    const t = rigConfirm({ data: [{ status: "unsubscribed", locale: "de" }] });
    const r = await t.form({ "List-Unsubscribe": "One-Click" }, `?a=unsubscribe&t=${TOKEN}`);
    expect(r.status).toBe(200); expect(r.headers.get("Location")).toBeNull();
  });
  it("reports an unknown token as invalid", async () => {
    const t = rigConfirm({ data: [{ status: "invalid", locale: null }] });
    expect((await t.form({ a: "confirm", t: TOKEN, l: "mk" })).headers.get("Location")).toBe("https://horoscop.si/mk/email/#s=invalid");
  });
  it("doesn't touch the database for a malformed request", async () => {
    const t = rigConfirm();
    for (const f of [{ a: "confirm", t: "short" }, { a: "delete", t: TOKEN }, { t: TOKEN }, { a: "confirm" }]) expect((await t.form(f as Record<string, string>)).headers.get("Location")).toContain("#s=invalid");
    expect(t.rpc).toEqual([]);
  });
  it("can't be turned into an open redirect", async () => {
    const t = rigConfirm();
    expect((await t.handle(new Request("https://x.co/?l=//evil.example"))).headers.get("Location")).toBe("https://horoscop.si/en/email/#s=invalid");
    expect((await t.form({ a: "confirm", t: "bad", l: "https://evil.example" })).headers.get("Location")).toBe("https://horoscop.si/en/email/#s=invalid");
  });
  it("shows an error page when the database fails, and leaks nothing", async () => {
    const t = rigConfirm({ error: { message: "secret" } });
    expect((await t.form({ a: "confirm", t: TOKEN })).headers.get("Location")).toBe("https://horoscop.si/en/email/#s=error");
    expect(t.logs).toEqual(["token_failed"]);
  });
  it("logs outcomes, never tokens", async () => {
    const t = rigConfirm(); await t.form({ a: "confirm", t: TOKEN });
    expect(t.logs).toEqual(["token_confirmed"]);
  });
  it("refuses other methods", async () => { expect((await rigConfirm().handle(new Request("https://x.co/", { method: "PUT", body: "x" }))).status).toBe(405); });
  it("is not fooled by a huge body", async () => {
    const t = rigConfirm();
    expect((await t.form({ a: "confirm", t: TOKEN, pad: "x".repeat(5000) })).headers.get("Location")).toContain("#s=invalid");
    expect(t.rpc).toEqual([]);
  });
});
