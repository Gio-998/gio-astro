import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { createHandler, DAILY_EMAIL_CAP, SEND_RATE, type Deps } from "../supabase/functions/submit-lead/handler";
import { createHandler as confirmHandler } from "../supabase/functions/confirm-lead/handler";
import { hashIp, ipBucket, isToken, newToken, sha256 } from "../supabase/functions/_shared/lead-crypto";

const ORIGIN = "https://horoscop.si";
const LEAD = { name: "Ana Petrovska", email: "ana@example.com", locale: "de", source: "big-five", marketing: false, privacyVersion: "2026-10-31" };
/** A lead whose browser passed Turnstile: the only kind that gets an email. */
const HUMAN = { ...LEAD, captchaToken: "tok" };
const TICKED = { ...HUMAN, marketing: true, marketingText: "Ja" };
const SAVED = { lead_id: "lead-1", needs_confirm: false, unsubscribed: false };
const RESEND = "https://api.resend.com/emails";
const ENV = { RESEND_API_KEY: "re_test", SUPABASE_URL: "https://proj.supabase.co", CAPTCHA_SECRET_KEY: "turnstile-secret", LEAD_IP_HASH_KEY: "ip-key" };

type Answer = { data?: unknown; error?: unknown };
type Calls = { rpc: [string, Record<string, unknown>][]; urls: string[]; bodies: Record<string, unknown>[]; headers: Record<string, string>[]; logs: string[] };
function rig(opts: { rpc?: Record<string, Answer | ((args: Record<string, unknown>) => Answer)>; env?: Record<string, string | undefined>; resend?: () => Response | Promise<Response>; turnstile?: () => Response | Promise<Response> } = {}) {
  const calls: Calls = { rpc: [], urls: [], bodies: [], headers: [], logs: [] };
  const answers: Record<string, Answer | ((args: Record<string, unknown>) => Answer)> = { lead_rate_hit: { data: true }, lead_upsert: { data: [SAVED] }, lead_email_claim: { data: "claimed" }, lead_email_done: { data: null }, ...opts.rpc };
  const deferred: Promise<unknown>[] = [];
  const env = { ...ENV, ...opts.env };
  const deps: Deps = {
    rpc: async (fn, args) => {
      calls.rpc.push([fn, args]);
      const a = answers[fn]; const r = typeof a === "function" ? a(args) : a;
      return { data: r?.data ?? null, error: r?.error ?? null };
    },
    fetch: (async (url: string, init: RequestInit) => {
      calls.urls.push(String(url));
      if (String(url).includes("turnstile")) return opts.turnstile ? opts.turnstile() : Response.json({ success: true });
      calls.bodies.push(JSON.parse(String(init.body))); calls.headers.push(init.headers as Record<string, string>);
      return opts.resend ? opts.resend() : Response.json({ id: "x" });
    }) as typeof fetch,
    env: (k) => env[k as keyof typeof env], defer: (p) => { deferred.push(p); }, log: (e) => { calls.logs.push(e); },
  };
  const handle = createHandler(deps);
  const post = (body: unknown, headers: Record<string, string> = {}) => handle(new Request("https://proj.supabase.co/functions/v1/submit-lead", { method: "POST", headers: { Origin: ORIGIN, "Content-Type": "application/json", "cf-connecting-ip": "203.0.113.9", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) }));
  const send = async (body: unknown, headers: Record<string, string> = {}) => {
    const r = await post(body, headers);
    await Promise.all(deferred);
    return { status: r.status, json: await r.json(), headers: r.headers };
  };
  return {
    calls, handle, post, send, deferred,
    names: () => calls.rpc.map(([n]) => n),
    args: (fn: string) => calls.rpc.find(([n]) => n === fn)?.[1],
    mail: () => calls.bodies[0] as { from: string; to: string[]; reply_to: string; subject: string; html: string; text: string; headers: Record<string, string> },
    sent: () => calls.urls.filter((u) => u === RESEND).length,
  };
}

describe("the functions and the SQL agree", () => {
  // PostgREST finds a function by its exact argument names, and these fakes would not notice a mismatch.
  const sql = readFileSync("supabase/migrations/20261031_leads.sql", "utf8");
  const params = (fn: string) => [...new RegExp(`function public\\.${fn}\\(([^)]*)\\)\\s*returns`).exec(sql)![1].matchAll(/\bp_\w+/g)].map((m) => m[0]).sort();
  it("submit-lead sends exactly the names each function takes", async () => {
    const t = rig({ rpc: { lead_upsert: { data: [{ ...SAVED, needs_confirm: true }] }, lead_email_claim: { data: "claimed_confirm" } } });
    await t.send(TICKED);
    expect(t.names()).toEqual(["lead_rate_hit", "lead_upsert", "lead_rate_hit", "lead_email_claim", "lead_email_done"]);
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
    const r = await t.send({ ...HUMAN, website: "http://spam.example" });
    expect([r.status, r.json]).toEqual([200, { ok: true }]);
    expect(t.calls.rpc).toEqual([]); expect(t.calls.urls).toEqual([]);
  });
});

describe("submit-lead: the request limit", () => {
  it("stops before saving or sending", async () => {
    const t = rig({ rpc: { lead_rate_hit: { data: false } } });
    const r = await t.send(HUMAN);
    expect([r.status, r.json]).toEqual([429, { error: "rate_limited" }]);
    expect(t.names()).toEqual(["lead_rate_hit"]);
    expect(t.calls.urls).toEqual([]);
  });
  it("never passes the raw IP anywhere", async () => {
    const t = rig(); await t.send(HUMAN);
    expect(JSON.stringify(t.calls.rpc)).not.toContain("203.0.113.9");
    expect(t.calls.rpc[0][1].p_ip_hash).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("finding 8: which IP is counted", () => {
  const counted = async (headers: Record<string, string>) => { const t = rig(); await t.send(LEAD, headers); return t.calls.rpc[0][1].p_ip_hash; };
  const expected = (ip: string) => hashIp(ip, ENV.LEAD_IP_HASH_KEY);
  it("prefers cf-connecting-ip over the headers a client can more easily set", async () => {
    expect(await counted({ "cf-connecting-ip": "203.0.113.1", "x-real-ip": "198.51.100.2", "x-forwarded-for": "198.51.100.3" })).toBe(await expected("203.0.113.1"));
  });
  it("keeps the fallback order until the post-deploy test settles it", async () => {
    const t = rig();
    const r = await t.handle(new Request("https://x.co/", { method: "POST", headers: { Origin: ORIGIN, "x-real-ip": "198.51.100.2", "x-forwarded-for": "198.51.100.3" }, body: JSON.stringify(LEAD) }));
    expect(r.status).toBe(200);
    expect(t.calls.rpc[0][1].p_ip_hash).toBe(await expected("198.51.100.2"));
    const u = rig();
    await u.handle(new Request("https://x.co/", { method: "POST", headers: { Origin: ORIGIN, "x-forwarded-for": "198.51.100.3, 10.0.0.1" }, body: JSON.stringify(LEAD) }));
    expect(u.calls.rpc[0][1].p_ip_hash).toBe(await expected("198.51.100.3"));
  });
  it("counts a whole IPv6 /64 as one visitor", async () => {
    expect(await counted({ "cf-connecting-ip": "2001:db8:1:2:aaaa::1" })).toBe(await counted({ "cf-connecting-ip": "2001:db8:1:2:bbbb:cccc:dddd:eeee" }));
    expect(await counted({ "cf-connecting-ip": "2001:db8:1:2::1" })).not.toBe(await counted({ "cf-connecting-ip": "2001:db8:1:3::1" }));
  });
  it.each([
    ["2001:0db8:0001:0002:0003:0004:0005:0006", "2001:db8:1:2::/64"],
    ["2001:DB8:1:2::1", "2001:db8:1:2::/64"],
    ["2001:db8::1", "2001:db8:0:0::/64"],
    ["::1", "0:0:0:0::/64"],
    ["fe80::1%eth0", "fe80:0:0:0::/64"],
    ["[2001:db8:1:2::1]:443", "2001:db8:1:2::/64"],
    ["203.0.113.9", "203.0.113.9"],
    ["203.0.113.9:443", "203.0.113.9"],
    ["::ffff:203.0.113.9", "203.0.113.9"],
    ["::ffff:cb00:7109", "203.0.113.9"],
    ["0:0:0:0:0:ffff:203.0.113.9", "203.0.113.9"],
    ["unknown", "unknown"],
    ["not:an:ip", "not:an:ip"],
  ])("reads %s as %s", (raw, bucket) => { expect(ipBucket(raw)).toBe(bucket); });
});

describe("finding 13: the IP key", () => {
  it("hashes with its own key, and changes daily", async () => {
    const day = new Date("2026-10-31T10:00:00Z");
    expect(await hashIp("1.2.3.4", "k", day)).not.toBe(await hashIp("1.2.3.4", "other", day));
    expect(await hashIp("1.2.3.4", "k", day)).not.toBe(await hashIp("1.2.3.4", "k", new Date("2026-11-01T10:00:00Z")));
    expect(await hashIp("1.2.3.4", "k", day)).toBe(await hashIp("1.2.3.4", "k", day));
    expect(await hashIp("1.2.3.4", "k", day)).not.toBe(await sha256("1.2.3.4"));
  });
  it("uses LEAD_IP_HASH_KEY for the hash", async () => {
    const t = rig({ env: { LEAD_IP_HASH_KEY: "dedicated" } }); await t.send(LEAD);
    expect(t.calls.rpc[0][1].p_ip_hash).toBe(await hashIp("203.0.113.9", "dedicated"));
  });
  it("refuses to run without it, rather than falling back to another key", async () => {
    const t = rig({ env: { LEAD_IP_HASH_KEY: undefined } });
    const r = await t.send(HUMAN);
    expect([r.status, r.json]).toEqual([500, { error: "server_error" }]);
    expect(t.calls.rpc).toEqual([]);
    expect(t.calls.logs).toEqual(["lead_ip_key_missing"]);
  });
});

describe("finding 3: no Turnstile pass, no email, but always a saved lead", () => {
  const savedNoMail = (t: ReturnType<typeof rig>) => { expect(t.names()).toContain("lead_upsert"); expect(t.names()).not.toContain("lead_email_claim"); expect(t.sent()).toBe(0); };
  it("sends after a pass", async () => {
    const t = rig(); const r = await t.send(HUMAN);
    expect(r.json).toEqual({ ok: true });
    expect(t.calls.urls).toEqual(["https://challenges.cloudflare.com/turnstile/v0/siteverify", RESEND]);
  });
  it("saves with no email when the token is missing, as for every queued retry", async () => {
    const t = rig(); const r = await t.send(LEAD);
    expect([r.status, r.json]).toEqual([200, { ok: true }]);
    savedNoMail(t);
    expect(t.calls.logs).toEqual(["email_skipped_captcha_missing"]);
    expect(t.calls.urls).toEqual([]);
  });
  it.each([["an empty token", ""], ["a non-string token", 5]])("saves with no email for %s", async (_, captchaToken) => {
    const t = rig(); await t.send({ ...LEAD, captchaToken });
    savedNoMail(t);
    expect(t.calls.logs).toEqual(["email_skipped_captcha_missing"]);
  });
  it("saves with no email when the token fails", async () => {
    const t = rig({ turnstile: () => Response.json({ success: false }) }); const r = await t.send(HUMAN);
    expect([r.status, r.json]).toEqual([200, { ok: true }]);
    savedNoMail(t);
    expect(t.calls.logs).toEqual(["email_skipped_captcha_failed"]);
  });
  it("saves with no email when Cloudflare can't be reached", async () => {
    const t = rig({ turnstile: () => { throw new Error("down"); } }); const r = await t.send(HUMAN);
    expect([r.status, r.json]).toEqual([200, { ok: true }]);
    savedNoMail(t);
    expect(t.calls.logs).toEqual(["email_skipped_captcha_unavailable"]);
  });
  it("saves with no email, and says why, when the secret isn't set", async () => {
    const t = rig({ env: { CAPTCHA_SECRET_KEY: undefined } }); await t.send(HUMAN);
    savedNoMail(t);
    expect(t.calls.urls).toEqual([]);
    expect(t.calls.logs).toEqual(["email_skipped_no_captcha_secret"]);
  });
  it("saves a ticked box with no email too, and leaves it unconfirmed", async () => {
    const t = rig({ rpc: { lead_upsert: { data: [{ ...SAVED, needs_confirm: true }] } } }); await t.send({ ...LEAD, marketing: true, marketingText: "Ja" });
    savedNoMail(t);
    expect(t.args("lead_upsert")).toMatchObject({ p_marketing: true });
  });
  it("doesn't make the visitor wait for Cloudflare", async () => {
    const t = rig({ turnstile: () => new Promise(() => {}) });
    const r = await t.post(HUMAN);
    expect([r.status, await r.json()]).toEqual([200, { ok: true }]);
  });
});

describe("finding 4: the send bucket", () => {
  const sendHit = (t: ReturnType<typeof rig>) => t.calls.rpc.filter(([n]) => n === "lead_rate_hit")[1]?.[1];
  it("is limit 3, window 86400, on its own hash", async () => {
    const t = rig(); await t.send(HUMAN);
    const [request, send] = t.calls.rpc.filter(([n]) => n === "lead_rate_hit").map(([, a]) => a);
    expect(SEND_RATE).toEqual({ limit: 3, windowSeconds: 86400 });
    expect(send).toMatchObject({ p_limit: 3, p_window_seconds: 86400 });
    expect(send.p_ip_hash).not.toBe(request.p_ip_hash);
    expect(send.p_ip_hash).toBe(await hashIp("203.0.113.9", ENV.LEAD_IP_HASH_KEY, new Date(), "send"));
  });
  it("comes before the claim and the send, and stops both", async () => {
    let hits = 0;
    const t = rig({ rpc: { lead_rate_hit: () => ({ data: ++hits === 1 }) } });
    expect((await t.send(HUMAN)).json).toEqual({ ok: true });
    expect(t.names()).toEqual(["lead_rate_hit", "lead_upsert", "lead_rate_hit"]);
    expect(t.sent()).toBe(0);
    expect(t.calls.logs).toEqual(["email_skipped_send_limit"]);
  });
  it("isn't touched without a Turnstile pass, so saving costs no send budget", async () => {
    const t = rig(); await t.send(LEAD);
    expect(sendHit(t)).toBeUndefined();
  });
  it("sends nothing if the bucket can't be read", async () => {
    let hits = 0;
    const t = rig({ rpc: { lead_rate_hit: () => (++hits === 1 ? { data: true } : { error: { message: "x" } }) } });
    expect((await t.send(HUMAN)).json).toEqual({ ok: true });
    expect(t.sent()).toBe(0);
    expect(t.calls.logs).toEqual(["email_send_limit_failed"]);
  });
});

describe("findings 6 and 10: mailboxes and unsubscribes", () => {
  it("claims by a hash of the normalised mailbox, with no address in the call", async () => {
    const hashOf = async (email: string) => { const t = rig(); await t.send({ ...HUMAN, email }); return t.args("lead_email_claim")!; };
    const plain = await hashOf("ab@gmail.com");
    expect(plain.p_mailbox_hash).toBe(await sha256("ab@gmail.com"));
    expect((await hashOf("a.b+news@gmail.com")).p_mailbox_hash).toBe(plain.p_mailbox_hash);
    expect((await hashOf("A.B@GoogleMail.com")).p_mailbox_hash).toBe(plain.p_mailbox_hash);
    expect(JSON.stringify(plain)).not.toContain("gmail");
  });
  it("sends nothing to an unsubscribed address, even with marketing true", async () => {
    const t = rig({ rpc: { lead_upsert: { data: [{ ...SAVED, unsubscribed: true, needs_confirm: true }] } } });
    expect((await t.send(TICKED)).json).toEqual({ ok: true });
    expect(t.names()).not.toContain("lead_email_claim");
    expect(t.sent()).toBe(0);
    expect(t.calls.logs).toEqual(["email_skipped_unsubscribed"]);
  });
  it("obeys the database when another spelling of the mailbox unsubscribed", async () => {
    const t = rig({ rpc: { lead_email_claim: { data: "unsubscribed" } } });
    await t.send(HUMAN);
    expect(t.sent()).toBe(0);
    expect(t.calls.logs).toEqual(["email_skipped_unsubscribed"]);
  });
  it("sends nothing inside the cooldown", async () => {
    const t = rig({ rpc: { lead_email_claim: { data: "duplicate" } } });
    expect((await t.send(HUMAN)).json).toEqual({ ok: true });
    expect(t.sent()).toBe(0);
    expect(t.calls.logs).toEqual(["email_skipped_duplicate"]);
  });
});

describe("finding 11: the confirm link", () => {
  const needsConfirm = { lead_upsert: { data: [{ ...SAVED, needs_confirm: true }] } };
  it("is sent only when the database stored its token", async () => {
    const t = rig({ rpc: { ...needsConfirm, lead_email_claim: { data: "claimed_confirm" } } }); await t.send(TICKED);
    const token = /#a=confirm&t=([\w-]{43})/.exec(t.mail().text)![1];
    expect(t.args("lead_email_claim")!.p_confirm_hash).toBe(await sha256(token));
    expect(JSON.stringify(t.calls.rpc)).not.toContain(token);
  });
  it("is left out when the database kept an earlier link, so the email never carries a dead one", async () => {
    const t = rig({ rpc: { ...needsConfirm, lead_email_claim: { data: "claimed" } } }); await t.send(TICKED);
    expect(t.sent()).toBe(1);
    expect(t.mail().text).not.toContain("#a=confirm");
    expect(t.mail().html).not.toContain("#a=confirm");
  });
  it("is not asked for without a tick", async () => {
    const t = rig(); await t.send(HUMAN);
    expect(t.mail().text).not.toContain("#a=confirm");
    expect(t.args("lead_email_claim")!.p_confirm_hash).toBeNull();
  });
  it("puts the confirm state in the Idempotency-Key, so Resend can't swallow the confirm email", async () => {
    const plain = rig(); await plain.send(HUMAN);
    expect(plain.calls.headers[0]["Idempotency-Key"]).toBe("lead-welcome/lead-1/big-five/plain");
    const confirm = rig({ rpc: { ...needsConfirm, lead_email_claim: { data: "claimed_confirm" } } }); await confirm.send(TICKED);
    expect(confirm.calls.headers[0]["Idempotency-Key"]).toBe("lead-welcome/lead-1/big-five/confirm");
  });
  it("hands back the right hashes when a send fails, so its tokens can be removed", async () => {
    const t = rig({ rpc: { ...needsConfirm, lead_email_claim: { data: "claimed_confirm" } }, resend: () => new Response("x", { status: 500 }) });
    await t.send(TICKED);
    const claim = t.args("lead_email_claim")!;
    expect(t.args("lead_email_done")).toEqual({ p_lead_id: "lead-1", p_unsubscribe_hash: claim.p_unsubscribe_hash, p_confirm_hash: claim.p_confirm_hash, p_ok: false });
  });
  it("doesn't pass an unused confirm hash on, so a real link is never deleted by mistake", async () => {
    const t = rig({ rpc: { ...needsConfirm, lead_email_claim: { data: "claimed" } }, resend: () => new Response("x", { status: 500 }) });
    await t.send(TICKED);
    expect(t.args("lead_email_done")!.p_confirm_hash).toBeNull();
  });
});

describe("submit-lead: saving", () => {
  it("returns exactly { ok: true }", async () => {
    const t = rig(); const r = await t.send({ ...HUMAN, email: "ANA@Example.com" });
    expect([r.status, r.json]).toEqual([200, { ok: true }]);
    expect(r.headers.get("Access-Control-Allow-Origin")).toBe(ORIGIN);
    expect(t.args("lead_upsert")).toMatchObject({ p_email: "ana@example.com", p_name: "Ana Petrovska", p_source: "big-five", p_marketing: false, p_marketing_text: null });
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
  it("can't turn a saved lead into a failure, even if the email can't be scheduled", async () => {
    const logs: string[] = [];
    const handle = createHandler({
      rpc: async (fn) => ({ data: fn === "lead_rate_hit" ? true : fn === "lead_upsert" ? [SAVED] : null, error: null }),
      fetch: (async () => Response.json({})) as typeof fetch, env: (k) => ENV[k as keyof typeof ENV], log: (e) => { logs.push(e); },
      defer: () => { throw new ReferenceError("EdgeRuntime is not defined"); },
    });
    const r = await handle(new Request("https://x.co/", { method: "POST", headers: { Origin: ORIGIN }, body: JSON.stringify(LEAD) }));
    expect([r.status, await r.json()]).toEqual([200, { ok: true }]);
    expect(logs).toContain("email_defer_failed");
    expect(logs).not.toContain("lead_save_failed");
  });
});

describe("submit-lead: the welcome email", () => {
  it("sends from the right address to the lead, with html and text", async () => {
    const t = rig(); await t.send(HUMAN);
    const m = t.mail();
    expect(m.from).toBe("Horoscop <no-reply@horoscop.si>");
    expect(m.reply_to).toBe("contact@horoscop.si");
    expect(m.to).toEqual(["ana@example.com"]);
    expect(m.text).toContain("Hallo Ana,");
    expect(m.html).toContain("<html");
    expect(t.calls.headers[0].Authorization).toBe("Bearer re_test");
  });
  it("offers a working one-click unsubscribe header", async () => {
    const t = rig(); await t.send(HUMAN); const m = t.mail();
    expect(m.headers["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
    const token = /[?&]t=([\w-]{43})>/.exec(m.headers["List-Unsubscribe"])![1];
    expect(m.headers["List-Unsubscribe"]).toContain("https://proj.supabase.co/functions/v1/confirm-lead?a=unsubscribe");
    expect(t.args("lead_email_claim")!.p_unsubscribe_hash).toBe(await sha256(token));
  });
  it("records a successful send", async () => {
    const t = rig(); await t.send(HUMAN);
    expect(t.args("lead_email_done")).toMatchObject({ p_lead_id: "lead-1", p_ok: true });
  });
  it("stops at the daily cap, which keeps room for login emails", async () => {
    const t = rig({ rpc: { lead_email_claim: { data: "capped" } } });
    expect((await t.send(HUMAN)).json).toEqual({ ok: true });
    expect(t.sent()).toBe(0); expect(t.calls.logs).toEqual(["email_skipped_daily_cap"]);
    expect(t.args("lead_email_claim")!.p_daily_cap).toBe(DAILY_EMAIL_CAP);
    const custom = rig({ env: { LEAD_EMAIL_DAILY_CAP: "20" } }); await custom.send(HUMAN);
    expect(custom.args("lead_email_claim")!.p_daily_cap).toBe(20);
  });
  it("still saves with no API key", async () => {
    const t = rig({ env: { RESEND_API_KEY: "" } });
    expect((await t.send(HUMAN)).json).toEqual({ ok: true });
    expect(t.names()).toEqual(["lead_rate_hit", "lead_upsert"]);
    expect(t.calls.logs).toEqual(["email_skipped_no_key"]);
  });
  it("handles a Resend 429 quietly and frees the slot", async () => {
    const t = rig({ resend: () => new Response("slow down", { status: 429 }) });
    const r = await t.send(HUMAN);
    expect([r.status, r.json]).toEqual([200, { ok: true }]);
    expect(t.calls.logs).toEqual(["email_rate_limited"]);
    expect(t.args("lead_email_done")!.p_ok).toBe(false);
  });
  it("hides a Resend failure or outage from the visitor", async () => {
    for (const [t, log] of [[rig({ resend: () => new Response("x", { status: 500 }) }), "email_failed_500"], [rig({ resend: () => { throw new Error("boom re_test"); } }), "email_unreachable"]] as const) {
      expect((await t.send(HUMAN)).json).toEqual({ ok: true });
      expect(t.calls.logs).toEqual([log]);
    }
  });
  it("survives its own database calls failing", async () => {
    const t = rig({ rpc: { lead_email_claim: { error: { message: "x" } } } });
    expect((await t.send(HUMAN)).json).toEqual({ ok: true });
    expect(t.sent()).toBe(0); expect(t.calls.logs).toEqual(["email_claim_failed"]);
  });
  it("counts every unknown source as one, so new ids can't buy more emails", async () => {
    const t = rig(); await t.send({ ...HUMAN, source: "made-up" });
    expect(t.args("lead_email_claim")!.p_source).toBe("other");
    expect(t.args("lead_upsert")!.p_source).toBe("made-up");
  });
  it("keeps a hostile name out of the email", async () => {
    const t = rig(); await t.send({ ...HUMAN, name: "Win,prizes today" });
    expect(t.mail().text.startsWith("Hallo,")).toBe(true);
    expect(t.mail().html).not.toContain("prizes");
  });
  it("logs no personal data", async () => {
    const t = rig({ resend: () => new Response("x", { status: 500 }) }); await t.send(HUMAN);
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
