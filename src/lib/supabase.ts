"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./supabase-types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let client: SupabaseClient<Database> | null = null;

/** True when this build has Supabase configured (accounts available). */
export const accountsEnabled = !!(url && key);
/** Private beta (default ON): app needs sign-in, signup is invite-only, site is noindex. Set NEXT_PUBLIC_BETA=0 to open up. */
export const betaMode = process.env.NEXT_PUBLIC_BETA !== "0";
/** "Continue with Google" stays hidden until a Google OAuth client is configured in Supabase. */
export const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH === "1";

/** null when env is missing (e.g. local build without .env) → the app stays local-only. */
export function sb(): SupabaseClient<Database> | null {
  if (typeof window === "undefined" || !url || !key) return null;
  return (client ??= createClient<Database>(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce", storageKey: "mirrorstar:auth" },
  }));
}
