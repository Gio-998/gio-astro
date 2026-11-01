// Deno entry point. Called by the signed-in user from the account page (deleteAccount in src/lib/sync.ts).
// The caller's token decides whose account goes, and a valid one is the only way in.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = ["https://horoscop.si", "https://www.horoscop.si", "https://gio-astro-preview.vercel.app", "http://localhost:3000"];

function cors(origin: string | null) {
  const allow = origin && (ALLOWED_ORIGINS.includes(origin) || /^https:\/\/gio-astro[a-z0-9-]*\.vercel\.app$/.test(origin)) ? origin : ALLOWED_ORIGINS[0];
  return { "Access-Control-Allow-Origin": allow, "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" };
}

/** The new secret key. The legacy service role key is only for a project that does not have one. */
function adminKey(): string {
  const secretKeys = Deno.env.get("SUPABASE_SECRET_KEYS");
  return (secretKeys ? JSON.parse(secretKeys)["default"] : undefined) ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
}

Deno.serve(async (req) => {
  const headers = { ...cors(req.headers.get("Origin")), "Content-Type": "application/json" };
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers });
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, adminKey(), { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data?.user) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers });
  const { error: delErr } = await admin.auth.admin.deleteUser(data.user.id);
  if (delErr) return new Response(JSON.stringify({ error: "delete_failed" }), { status: 500, headers });
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
});
