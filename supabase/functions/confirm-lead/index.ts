// Deno entry point. Deploy without JWT verification (see supabase/README.md): links from an email carry no login.
import { createClient } from "npm:@supabase/supabase-js@2";
import { createHandler } from "./handler.ts";

const secretKey = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}").default as string;
const db = createClient(Deno.env.get("SUPABASE_URL")!, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });

Deno.serve(createHandler({
  rpc: (fn, args) => db.rpc(fn, args),
  log: (event) => console.log(`confirm-lead: ${event}`),
}));
