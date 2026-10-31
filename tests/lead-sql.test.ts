/**
 * Runs the real migration on PGlite, an in-memory Postgres, with Supabase's auth schema, roles and cron stubbed.
 * The rules that keep leads safe live in SQL, so they are tested in SQL: the handler tests use a fake database and cannot see them.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { normalizeMailbox } from "../supabase/functions/_shared/lead-rules";
import { sha256 } from "../supabase/functions/_shared/lead-crypto";

const MIGRATION = readFileSync("supabase/migrations/20261031_leads.sql", "utf8");
const USER = "11111111-1111-1111-1111-111111111111";
const ADMIN = "22222222-2222-2222-2222-222222222222";
const CAP = 100;

let db: PGlite;
let n = 0;
/** A fresh value in the shape of a SHA-256 hash. */
const H = () => (++n).toString(16).padStart(64, "0");
const run = async <T = Record<string, unknown>>(sql: string, params?: unknown[]) => (await db.query<T>(sql, params)).rows;
const one = async <T = Record<string, unknown>>(sql: string, params?: unknown[]) => (await run<T>(sql, params))[0];

async function asRole<T>(role: string, fn: () => Promise<T>, settings: Record<string, string> = {}): Promise<T> {
  for (const [k, v] of Object.entries(settings)) await db.exec(`set test.${k} = '${v}'`);
  await db.exec(`set role ${role}`);
  try { return await fn(); } finally { await db.exec("reset role"); for (const k of Object.keys(settings)) await db.exec(`set test.${k} = ''`); }
}
const service = <T,>(fn: () => Promise<T>) => asRole("service_role", fn);

type Saved = { lead_id: string; needs_confirm: boolean; unsubscribed: boolean };
const upsert = (email: string, o: { source?: string; marketing?: boolean; name?: string; locale?: string; text?: string; version?: string; at?: string } = {}) =>
  service(() => one<Saved>("select * from public.lead_upsert($1,$2,$3,$4,$5,$6,$7,$8)", [o.name ?? "Ana Petrovska", email, o.locale ?? "de", o.source ?? "big-five", o.marketing ?? false, o.marketing ? o.text ?? "Ja bitte" : null, o.version ?? "2026-10-31", o.at ?? null]));
const mailbox = (email: string) => sha256(normalizeMailbox(email));
async function claim(email: string, lead: string, o: { source?: string; cap?: number; confirm?: string | null; unsub?: string } = {}) {
  const hash = await mailbox(email);
  return (await service(() => one<{ r: string }>("select public.lead_email_claim($1,$2,$3,$4,$5,$6) r", [lead, o.source ?? "big-five", hash, o.cap ?? CAP, o.unsub ?? H(), o.confirm ?? null]))).r;
}
const done = (lead: string, unsub: string, confirm: string | null, ok: boolean) => service(() => run("select public.lead_email_done($1,$2,$3,$4)", [lead, unsub, confirm, ok]));
const apply = (hash: string, kind: string) => service(() => one<{ status: string; locale: string | null }>("select * from public.lead_token_apply($1,$2)", [hash, kind]));
const lead = (email: string) => one<Record<string, unknown>>("select * from public.leads where lower(email) = lower($1)", [email]);
const count = async (table: string, where = "true") => (await one<{ n: number }>(`select count(*)::int n from public.${table} where ${where}`)).n;
/** Moves every email in the log into the past, as if time had gone by. */
const age = (days: number) => run(`update public.lead_emails set created_at = now() - interval '${days} days'`);

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
    grant usage on schema public to anon, authenticated, service_role;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
    create schema auth; grant usage on schema auth to anon, authenticated, service_role;
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
    create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('test.jwt', true), ''), '{}')::jsonb $$;
    grant execute on all functions in schema auth to anon, authenticated, service_role;
    create schema cron; create table cron.jobs (name text primary key, schedule text, command text);
    create function cron.schedule(n text, s text, c text) returns bigint language sql as $$ insert into cron.jobs values (n, s, c) on conflict (name) do update set schedule = excluded.schedule, command = excluded.command returning 1::bigint $$;
    create table public.profiles (id uuid primary key, role text not null default 'user');
    alter table public.profiles enable row level security;
    create policy own on public.profiles for select to authenticated using (id = auth.uid());
    grant select on public.profiles to authenticated;
    insert into public.profiles values ('${USER}', 'user'), ('${ADMIN}', 'admin');
    create table public.events (id bigserial primary key, created_at timestamptz not null default now());
    create table public.waitlist (id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now());
  `);
  const sql = MIGRATION.replace(/create extension if not exists pg_cron[^;]*;/, ""); // not available in PGlite; cron is stubbed above
  await db.exec(sql);
  await db.exec(sql); // the file says it is safe to run twice
}, 60_000);
afterAll(async () => { await db.close(); });
beforeEach(async () => { await db.exec("truncate public.leads, public.lead_rate_limits, public.events, public.waitlist cascade"); });

describe("saving a lead", () => {
  it("keeps one row per address, the earliest date and every test", async () => {
    const a = await upsert("Ana@Example.com");
    const first = await lead("ana@example.com");
    expect(first.email).toBe("ana@example.com");
    const b = await upsert("ana@EXAMPLE.com", { source: "care" });
    expect(b.lead_id).toBe(a.lead_id);
    const second = await lead("ana@example.com");
    expect(await count("leads")).toBe(1);
    expect(second.created_at).toEqual(first.created_at);
    expect(second.source).toBe("big-five");
    expect(second.sources).toEqual(["big-five", "care"]);
    await upsert("ana@example.com", { source: "care" });
    expect((await lead("ana@example.com")).sources).toEqual(["big-five", "care"]);
  });
});

describe("finding 1: only app_metadata opens the leads", () => {
  const seen = (settings: Record<string, string>) => asRole("authenticated", () => count("leads"), settings);
  beforeEach(async () => { await upsert("ana@example.com"); });
  it("lets an app_metadata admin read", async () => { expect(await seen({ uid: USER, jwt: '{"app_metadata":{"role":"admin"}}' })).toBe(1); });
  it("gives nothing to profiles.role admin alone", async () => { expect(await seen({ uid: ADMIN })).toBe(0); });
  it("gives nothing to a normal user", async () => { expect(await seen({ uid: USER })).toBe(0); });
  it("ignores a role in user_metadata, which users can write", async () => { expect(await seen({ uid: USER, jwt: '{"user_metadata":{"role":"admin"}}' })).toBe(0); });
  it("no longer mentions profiles in the policy", async () => {
    const { qual } = await one<{ qual: string }>("select qual from pg_policies where tablename = 'leads'");
    expect(qual).toContain("app_metadata");
    expect(qual).not.toContain("profiles");
  });
});

describe("access for the browser roles", () => {
  it.each(["leads", "lead_emails", "lead_tokens", "lead_rate_limits"])("anon can't read %s", async (t) => {
    await expect(asRole("anon", () => run(`select * from public.${t}`))).rejects.toThrow(/permission denied/);
  });
  it.each(["lead_emails", "lead_tokens", "lead_rate_limits"])("authenticated can't read %s", async (t) => {
    await expect(asRole("authenticated", () => run(`select * from public.${t}`))).rejects.toThrow(/permission denied/);
  });
  it("nobody in the browser can write", async () => {
    await expect(asRole("anon", () => run("insert into public.leads (name,email,locale,source,privacy_version) values ('xx','x@y.zz','en','s','1')"))).rejects.toThrow(/permission denied/);
    await expect(asRole("authenticated", () => run("update public.leads set name = 'x'"))).rejects.toThrow(/permission denied/);
    await expect(asRole("authenticated", () => run("delete from public.leads"))).rejects.toThrow(/permission denied/);
  });
  it.each([
    ["anon", "public.lead_upsert('a','b','c','d',false,null,'e',null)"],
    ["authenticated", "public.lead_rate_hit('a',1,1)"],
    ["anon", "public.lead_token_apply('a','confirm')"],
    ["authenticated", "public.lead_email_done(gen_random_uuid(),'a',null,true)"],
    ["authenticated", "public.lead_email_claim(gen_random_uuid(),'a','b',1,'c',null)"],
    ["service_role", "public.lead_purge()"],
  ])("%s can't call %s", async (role, call) => {
    await expect(asRole(role, () => run(`select * from ${call}`))).rejects.toThrow(/permission denied/);
  });
});

describe("finding 4: the rate limit tables", () => {
  const hit = (hash: string, limit: number, window: number) => service(() => one<{ ok: boolean }>("select public.lead_rate_hit($1,$2,$3) ok", [hash, limit, window]));
  it("stops at the limit", async () => {
    expect((await hit("send", 3, 86400)).ok).toBe(true);
    expect((await hit("send", 3, 86400)).ok).toBe(true);
    expect((await hit("send", 3, 86400)).ok).toBe(true);
    expect((await hit("send", 3, 86400)).ok).toBe(false);
  });
  it("keeps separate hashes apart, so requests can't use up sends", async () => {
    for (let i = 0; i < 5; i++) await hit("request", 3, 3600);
    expect((await hit("request", 3, 3600)).ok).toBe(false);
    expect((await hit("send", 3, 86400)).ok).toBe(true);
  });
});

describe("findings 6 and 10: one mailbox, however it's spelled", () => {
  it("stores a hash of the mailbox, and no address in the log", async () => {
    const { lead_id } = await upsert("a.b+news@gmail.com");
    await claim("a.b+news@gmail.com", lead_id);
    const row = await one<{ mailbox_hash: string }>("select * from public.lead_emails");
    expect(row.mailbox_hash).toBe(await sha256("ab@gmail.com"));
    expect(JSON.stringify(row)).not.toContain("gmail");
  });
  it("treats a +tag as the same inbox within 30 days", async () => {
    const a = await upsert("ana@example.com"); const b = await upsert("ana+other@example.com");
    expect(await claim("ana@example.com", a.lead_id)).toBe("claimed");
    expect(await claim("ana+other@example.com", b.lead_id, { source: "care" })).toBe("duplicate");
  });
  it("treats Gmail dots as the same inbox", async () => {
    const a = await upsert("a.n.a@gmail.com"); const b = await upsert("ana@googlemail.com");
    expect(await claim("a.n.a@gmail.com", a.lead_id)).toBe("claimed");
    expect(await claim("ana@googlemail.com", b.lead_id, { source: "care" })).toBe("duplicate");
  });
  it("leaves dots alone elsewhere, where they mean a different person", async () => {
    const a = await upsert("a.na@example.com"); const b = await upsert("ana@example.com");
    expect(await claim("a.na@example.com", a.lead_id)).toBe("claimed");
    expect(await claim("ana@example.com", b.lead_id)).toBe("claimed");
  });
  it("waits 30 days before a mailbox gets another email", async () => {
    const { lead_id } = await upsert("ana@example.com");
    expect(await claim("ana@example.com", lead_id)).toBe("claimed");
    expect(await claim("ana@example.com", lead_id, { source: "care" })).toBe("duplicate");
    await age(29);
    expect(await claim("ana@example.com", lead_id, { source: "care" })).toBe("duplicate");
    await age(31);
    expect(await claim("ana@example.com", lead_id, { source: "care" })).toBe("claimed");
  });
  it("still sends once per test, ever", async () => {
    const { lead_id } = await upsert("ana@example.com");
    await claim("ana@example.com", lead_id);
    await age(400);
    expect(await claim("ana@example.com", lead_id)).toBe("duplicate");
  });
  it("never mails an unsubscribed address, even with the box ticked", async () => {
    const { lead_id } = await upsert("ana@example.com");
    const unsub = H();
    await claim("ana@example.com", lead_id, { unsub }); await done(lead_id, unsub, null, true);
    await apply(unsub, "unsubscribe");
    await age(400);
    const again = await upsert("ana@example.com", { source: "care", marketing: true });
    expect(again.unsubscribed).toBe(true);
    expect(await claim("ana@example.com", lead_id, { source: "care", confirm: H() })).toBe("unsubscribed");
    expect(await count("lead_tokens", "kind = 'confirm'")).toBe(0);
  });
  it("won't reach that inbox through another spelling either", async () => {
    const a = await upsert("a.na@gmail.com"); const unsub = H();
    await claim("a.na@gmail.com", a.lead_id, { unsub }); await done(a.lead_id, unsub, null, true);
    await apply(unsub, "unsubscribe");
    await age(400);
    const b = await upsert("ana+back@gmail.com", { marketing: true });
    expect(b.unsubscribed).toBe(false); // a new row, so only the mailbox check can catch it
    expect(await claim("ana+back@gmail.com", b.lead_id, { source: "care", confirm: H() })).toBe("unsubscribed");
  });
});

describe("finding 7: the daily cap", () => {
  it("takes the advisory lock before anything else", async () => {
    const { def } = await one<{ def: string }>("select pg_get_functiondef('public.lead_email_claim'::regproc) def");
    const body = def.slice(def.indexOf("begin") + "begin".length).trim();
    expect(body.startsWith("perform pg_advisory_xact_lock(hashtext('lead_email_claim'));")).toBe(true);
  });
  it("stops exactly at the cap", async () => {
    for (const i of [1, 2]) { const { lead_id } = await upsert(`p${i}@example.com`); expect(await claim(`p${i}@example.com`, lead_id, { cap: 2 })).toBe("claimed"); }
    const { lead_id } = await upsert("p3@example.com");
    expect(await claim("p3@example.com", lead_id, { cap: 2 })).toBe("capped");
    expect(await count("lead_emails")).toBe(2);
  });
  it("counts a rolling 24 hours", async () => {
    const a = await upsert("p1@example.com"); await claim("p1@example.com", a.lead_id, { cap: 1 });
    await age(2);
    const b = await upsert("p2@example.com");
    expect(await claim("p2@example.com", b.lead_id, { cap: 1 })).toBe("claimed");
  });
  it("frees the budget when a send fails", async () => {
    const a = await upsert("p1@example.com"); const unsub = H();
    await claim("p1@example.com", a.lead_id, { cap: 1, unsub }); await done(a.lead_id, unsub, null, false);
    const b = await upsert("p2@example.com");
    expect(await claim("p2@example.com", b.lead_id, { cap: 1 })).toBe("claimed");
  });
});

describe("finding 9: a later submission can't rewrite a lead", () => {
  it("never overwrites the name or locale", async () => {
    await upsert("ana@example.com", { name: "Ana Petrovska", locale: "mk" });
    await upsert("ana@example.com", { name: "Someone Else", locale: "de", marketing: true });
    const row = await lead("ana@example.com");
    expect([row.name, row.locale]).toEqual(["Ana Petrovska", "mk"]);
  });
  it("freezes the proof of a confirmed consent", async () => {
    const { lead_id } = await upsert("ana@example.com", { marketing: true, text: "Original words", at: "2026-10-01T10:00:00Z", version: "2026-10-01" });
    const confirm = H();
    await claim("ana@example.com", lead_id, { confirm });
    await apply(confirm, "confirm");
    const before = await lead("ana@example.com");
    await upsert("ana@example.com", { marketing: true, text: "Forged words", at: "2026-10-20T10:00:00Z", version: "2026-10-20" });
    const after = await lead("ana@example.com");
    for (const k of ["marketing_consent", "marketing_consent_at", "marketing_consent_text", "marketing_confirmed_at", "privacy_version", "marketing_ok"]) expect(after[k], k).toEqual(before[k]);
    expect(after.marketing_ok).toBe(true);
  });
  it("still takes a new tick while unconfirmed", async () => {
    await upsert("ana@example.com", { marketing: true, text: "First words", version: "2026-10-01" });
    await upsert("ana@example.com", { marketing: true, text: "Newer words", version: "2026-10-20" });
    const row = await lead("ana@example.com");
    expect([row.marketing_consent_text, row.privacy_version]).toEqual(["Newer words", "2026-10-20"]);
  });
  it("records a new tick after an unsubscribe, which still isn't consent", async () => {
    const { lead_id } = await upsert("ana@example.com", { marketing: true, text: "First words" });
    const confirm = H(), unsub = H();
    await claim("ana@example.com", lead_id, { confirm, unsub });
    await apply(confirm, "confirm"); await apply(unsub, "unsubscribe");
    await upsert("ana@example.com", { marketing: true, text: "Newer words" });
    const row = await lead("ana@example.com");
    expect(row.marketing_consent_text).toBe("Newer words");
    expect(row.marketing_confirmed_at).toBeNull();
    expect(row.marketing_ok).toBe(false);
  });
  it("treats an unticked box as no change, so nobody can wipe a tick", async () => {
    await upsert("ana@example.com", { marketing: true, text: "First words" });
    await upsert("ana@example.com", { marketing: false });
    const row = await lead("ana@example.com");
    expect([row.marketing_consent, row.marketing_consent_text]).toEqual([true, "First words"]);
  });
  it("only counts a tick once it is confirmed", async () => {
    const { lead_id, needs_confirm } = await upsert("ana@example.com", { marketing: true });
    expect(needs_confirm).toBe(true);
    expect((await lead("ana@example.com")).marketing_ok).toBe(false);
    const confirm = H();
    await claim("ana@example.com", lead_id, { confirm });
    await apply(confirm, "confirm");
    expect((await lead("ana@example.com")).marketing_ok).toBe(true);
  });
});

describe("finding 11: a ticked box always gets a way to confirm", () => {
  it("lets the confirm email through the cooldown and the once-per-test rule", async () => {
    const { lead_id } = await upsert("ana@example.com");
    expect(await claim("ana@example.com", lead_id)).toBe("claimed");
    await upsert("ana@example.com", { marketing: true });
    const confirm = H();
    expect(await claim("ana@example.com", lead_id, { confirm })).toBe("claimed_confirm");
    expect(await count("lead_tokens", "kind = 'confirm'")).toBe(1);
    expect(await count("lead_emails")).toBe(2);
  });
  it("sends no second confirm email while one is unused", async () => {
    const { lead_id } = await upsert("ana@example.com", { marketing: true });
    expect(await claim("ana@example.com", lead_id, { confirm: H() })).toBe("claimed_confirm");
    expect(await claim("ana@example.com", lead_id, { confirm: H() })).toBe("duplicate");
    expect(await count("lead_tokens", "kind = 'confirm'")).toBe(1);
  });
  it("can't be used to flood an inbox through +tags", async () => {
    const a = await upsert("ana+1@example.com", { marketing: true }); const b = await upsert("ana+2@example.com", { marketing: true });
    expect(await claim("ana+1@example.com", a.lead_id, { confirm: H() })).toBe("claimed_confirm");
    expect(await claim("ana+2@example.com", b.lead_id, { source: "care", confirm: H() })).toBe("duplicate");
  });
  it("sends a plain email, with no new token, when the normal limits allow one and a link is still unused", async () => {
    const { lead_id } = await upsert("ana@example.com", { marketing: true });
    await claim("ana@example.com", lead_id, { confirm: H() });
    await age(31);
    const unused = H();
    expect(await claim("ana@example.com", lead_id, { source: "care", confirm: unused })).toBe("claimed");
    expect(await count("lead_tokens", `token_hash = '${unused}'`)).toBe(0);
  });
  it("lets a new confirm email through once the old link has expired", async () => {
    const { lead_id } = await upsert("ana@example.com", { marketing: true });
    await claim("ana@example.com", lead_id, { confirm: H() });
    await run("update public.lead_tokens set expires_at = now() - interval '1 day' where kind = 'confirm'");
    expect(await claim("ana@example.com", lead_id, { confirm: H() })).toBe("claimed_confirm");
  });
  it("doesn't let a failed send block the real one", async () => {
    const { lead_id } = await upsert("ana@example.com", { marketing: true });
    const confirm = H(), unsub = H();
    await claim("ana@example.com", lead_id, { confirm, unsub });
    await done(lead_id, unsub, confirm, false);
    expect(await count("lead_tokens")).toBe(0);
    expect(await count("lead_emails")).toBe(0);
    expect(await claim("ana@example.com", lead_id, { confirm: H() })).toBe("claimed_confirm");
  });
  it("records a send on the right row when a test has two", async () => {
    const { lead_id } = await upsert("ana@example.com");
    const first = H(), second = H();
    await claim("ana@example.com", lead_id, { unsub: first }); await done(lead_id, first, null, true);
    await claim("ana@example.com", lead_id, { unsub: second, confirm: H() }); await done(lead_id, second, null, false);
    expect(await count("lead_emails")).toBe(1);
    expect(await count("lead_emails", "sent_at is not null")).toBe(1);
  });
});

describe("links", () => {
  async function mailed(email = "ana@example.com") {
    const { lead_id } = await upsert(email, { marketing: true });
    const confirm = H(), unsub = H();
    await claim(email, lead_id, { confirm, unsub });
    return { lead_id, confirm, unsub };
  }
  it("confirms once, in the lead's language", async () => {
    const { confirm } = await mailed();
    expect(await apply(confirm, "confirm")).toEqual({ status: "confirmed", locale: "de" });
    expect((await apply(confirm, "confirm")).status).toBe("used");
  });
  it("doesn't mix up the two kinds of token, or accept a stranger", async () => {
    const { confirm, unsub } = await mailed();
    expect((await apply(unsub, "confirm")).status).toBe("invalid");
    expect((await apply(confirm, "unsubscribe")).status).toBe("invalid");
    expect((await apply(H(), "confirm")).status).toBe("invalid");
  });
  it("refuses an expired link", async () => {
    const { confirm } = await mailed();
    await run("update public.lead_tokens set expires_at = now() - interval '1 day' where kind = 'confirm'");
    expect((await apply(confirm, "confirm")).status).toBe("expired");
    expect((await lead("ana@example.com")).marketing_ok).toBe(false);
  });
  it("keeps unsubscribe working, and it kills open confirm links", async () => {
    const { confirm, unsub } = await mailed();
    expect((await apply(unsub, "unsubscribe")).status).toBe("unsubscribed");
    expect((await apply(unsub, "unsubscribe")).status).toBe("unsubscribed");
    expect((await apply(confirm, "confirm")).status).toBe("used");
    const row = await lead("ana@example.com");
    expect([row.marketing_consent, row.marketing_ok]).toEqual([false, false]);
    expect(row.unsubscribed_at).not.toBeNull();
  });
  it("never lets a confirm clear an unsubscribe", async () => {
    const { confirm, unsub } = await mailed();
    await apply(unsub, "unsubscribe");
    await run("update public.lead_tokens set used_at = null where kind = 'confirm'"); // force the race
    await apply(confirm, "confirm");
    const row = await lead("ana@example.com");
    expect(row.unsubscribed_at).not.toBeNull();
    expect(row.marketing_ok).toBe(false);
  });
  it("erasing a lead takes its tokens and email log with it", async () => {
    await mailed();
    await run("delete from public.leads");
    expect(await count("lead_tokens")).toBe(0);
    expect(await count("lead_emails")).toBe(0);
  });
});

describe("finding 12: the purge", () => {
  it("runs every hour", async () => {
    const job = await one<{ schedule: string; command: string }>("select * from cron.jobs");
    expect(job).toMatchObject({ name: "lead-purge-hourly", schedule: "17 * * * *", command: "select public.lead_purge()" });
    expect(await count("lead_rate_limits")).toBe(0);
  });
  it("deletes what the privacy page says, and keeps confirmed consent", async () => {
    await run(`insert into public.leads (name,email,locale,source,privacy_version,updated_at) values ('Old','old@x.yz','en','s','1',now() - interval '25 months'),('New','new@x.yz','en','s','1',now())`);
    await run(`insert into public.leads (name,email,locale,source,privacy_version,updated_at,marketing_consent,marketing_confirmed_at) values ('Kept','kept@x.yz','en','s','1',now() - interval '30 months',true,now())`);
    await run("insert into public.lead_rate_limits values ('old', now() - interval '25 hours', 1), ('new', now(), 1)");
    await run("insert into public.events (created_at) values (now() - interval '15 months'),(now())");
    await run("insert into public.waitlist (created_at) values (now() - interval '25 months'),(now())");
    await run("select public.lead_purge()");
    expect((await run<{ email: string }>("select email from public.leads order by email")).map((r) => r.email)).toEqual(["kept@x.yz", "new@x.yz"]);
    expect((await run<{ ip_hash: string }>("select ip_hash from public.lead_rate_limits")).map((r) => r.ip_hash)).toEqual(["new"]);
    expect(await count("events")).toBe(1);
    expect(await count("waitlist")).toBe(1);
  });
  it("keeps a day-long send bucket alive for its whole window", async () => {
    await run("insert into public.lead_rate_limits values ('send', now() - interval '23 hours 59 minutes', 3)");
    await run("select public.lead_purge()");
    expect(await count("lead_rate_limits")).toBe(1);
  });
  it("clears long-dead confirm tokens but never an unsubscribe link", async () => {
    const { lead_id } = await upsert("ana@example.com", { marketing: true });
    await claim("ana@example.com", lead_id, { confirm: H() });
    await run("update public.lead_tokens set expires_at = now() - interval '31 days' where kind = 'confirm'");
    await run("select public.lead_purge()");
    expect(await count("lead_tokens", "kind = 'confirm'")).toBe(0);
    expect(await count("lead_tokens", "kind = 'unsubscribe'")).toBe(1);
  });
});
