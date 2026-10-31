// Deno entry point. Deploy without JWT verification (see supabase/README.md): this endpoint is public and checks Origin itself.
import { createClient } from "npm:@supabase/supabase-js@2";
import { createHandler } from "./handler.ts";

declare const EdgeRuntime: { waitUntil(work: Promise<unknown>): void };

const secretKey = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}").default as string;
const db = createClient(Deno.env.get("SUPABASE_URL")!, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });

Deno.serve(createHandler({
  rpc: (fn, args) => db.rpc(fn, args),
  fetch,
  env: (name) => Deno.env.get(name),
  defer: (work) => EdgeRuntime.waitUntil(work),
  log: (event) => console.log(`submit-lead: ${event}`),
}));
