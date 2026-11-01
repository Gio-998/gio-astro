import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import ts from "typescript";

const FILE = "supabase/functions/delete-account/index.ts";
const SRC = readFileSync(FILE, "utf8");
const ENV = { SUPABASE_URL: "https://proj.supabase.co", SUPABASE_SECRET_KEYS: JSON.stringify({ default: "sb_secret_new" }) };
const USER = { data: { user: { id: "user-1" } }, error: null };
type Handler = (req: Request) => Promise<Response>;

/** Runs the real Deno entry file, with fakes for its imports and for Deno, and returns the handler it passed to Deno.serve. */
function boot(env: Record<string, string | undefined> = ENV, answers: { getUser?: unknown; deleteUser?: unknown } = {}) {
  const js = ts.transpileModule(SRC.replace(/^import .*$/gm, ""), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
  const deleteUser = vi.fn(async () => answers.deleteUser ?? { error: null });
  const getUser = vi.fn(async () => answers.getUser ?? USER);
  const createClient = vi.fn((_url: string, _key: string, _opts: unknown) => ({ auth: { getUser, admin: { deleteUser } } }));
  let handler: Handler | undefined;
  new Function("Deno", "createClient", js)({ env: { get: (k: string) => env[k] }, serve: (h: Handler) => { handler = h; } }, createClient);
  const call = (method: string, headers: Record<string, string> = {}) => handler!(new Request("https://proj.supabase.co/functions/v1/delete-account", { method, headers }));
  const post = (headers: Record<string, string> = { Authorization: "Bearer user-jwt" }) => call("POST", headers);
  return { call, post, createClient, getUser, deleteUser };
}

describe("delete-account: responses", () => {
  it("answers a preflight with 204 and no body", async () => {
    const r = await boot().call("OPTIONS", { Origin: "https://horoscop.si" });
    expect(r.status).toBe(204); expect(await r.text()).toBe("");
    expect(r.headers.get("Access-Control-Allow-Methods")).toBe("POST, OPTIONS");
    expect(r.headers.get("Access-Control-Allow-Headers")).toBe("authorization, x-client-info, apikey, content-type");
    expect(r.headers.get("Vary")).toBe("Origin");
  });
  it("refuses other methods", async () => {
    const r = await boot().call("GET");
    expect(r.status).toBe(405); expect(await r.json()).toEqual({ error: "method_not_allowed" });
  });
  it("wants a token, before it touches the database", async () => {
    const f = boot(); const r = await f.post({});
    expect(r.status).toBe(401); expect(await r.json()).toEqual({ error: "unauthorized" });
    expect(f.createClient).not.toHaveBeenCalled();
  });
  it.each([[{ data: { user: null }, error: { message: "bad jwt" } }], [{ data: null, error: null }]])("refuses a token that names no user", async (getUser) => {
    const f = boot(ENV, { getUser }); const r = await f.post();
    expect(r.status).toBe(401); expect(await r.json()).toEqual({ error: "unauthorized" });
    expect(f.deleteUser).not.toHaveBeenCalled();
  });
  it("deletes the user the token belongs to", async () => {
    const f = boot(); const r = await f.post();
    expect(f.getUser).toHaveBeenCalledWith("user-jwt"); expect(f.deleteUser).toHaveBeenCalledWith("user-1");
    expect(r.status).toBe(200); expect(await r.json()).toEqual({ ok: true });
    expect(r.headers.get("Content-Type")).toBe("application/json");
  });
  it("reports a failed delete", async () => {
    const r = await boot(ENV, { deleteUser: { error: { message: "boom" } } }).post();
    expect(r.status).toBe(500); expect(await r.json()).toEqual({ error: "delete_failed" });
  });
  it("accepts the same origins as the dashboard copy and answers others with the main site", async () => {
    const allow = async (Origin?: string) => (await boot().call("OPTIONS", Origin ? { Origin } : {})).headers.get("Access-Control-Allow-Origin");
    for (const o of ["https://horoscop.si", "https://www.horoscop.si", "https://gio-astro-preview.vercel.app", "http://localhost:3000", "https://gio-astro-abc-123.vercel.app"]) expect(await allow(o), o).toBe(o);
    for (const o of ["https://evil.example", "https://gio-astro.vercel.app.evil.example", "http://gio-astro-x.vercel.app"]) expect(await allow(o), o).toBe("https://horoscop.si");
    expect(await allow()).toBe("https://horoscop.si");
  });
});

describe("delete-account: which key it uses", () => {
  const keyUsed = async (env: Record<string, string | undefined>) => { const f = boot(env); await f.post(); return f.createClient.mock.calls[0][1]; };
  const LEGACY = { SUPABASE_SERVICE_ROLE_KEY: "legacy-jwt" };
  it("prefers the new secret key, even with the legacy one still set", async () => { expect(await keyUsed({ ...ENV, ...LEGACY })).toBe("sb_secret_new"); });
  it("falls back when SUPABASE_SECRET_KEYS is missing", async () => { expect(await keyUsed({ SUPABASE_URL: ENV.SUPABASE_URL, ...LEGACY })).toBe("legacy-jwt"); });
  it("falls back when it has no default key", async () => { expect(await keyUsed({ SUPABASE_URL: ENV.SUPABASE_URL, SUPABASE_SECRET_KEYS: "{}", ...LEGACY })).toBe("legacy-jwt"); });
  it("keeps a session out of the admin client", async () => {
    const f = boot(); await f.post();
    expect(f.createClient).toHaveBeenCalledWith(ENV.SUPABASE_URL, "sb_secret_new", { auth: { persistSession: false, autoRefreshToken: false } });
  });
});
