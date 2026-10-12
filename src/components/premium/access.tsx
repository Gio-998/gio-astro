"use client";
/**
 * Who can see what. DEMO PHASE.
 * - Regular users: while PAYWALL_LIVE is false nothing is locked (the beta is free).
 * - Admins: "Preview as free user" turns the locks on, "Preview as Premium" opens everything.
 *   The mock checkout records a local demo grant (never written to the database).
 * - Real purchases: public.entitlements (RLS: read own; written only by the payment webhook).
 */
import { useEffect, useSyncExternalStore } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sb } from "@/lib/supabase";
import { useAccount } from "@/lib/sync";
import { PAYWALL_LIVE, type ProductId, type Sku } from "@/lib/payments";

export type PreviewPlan = "premium" | "free" | null;
export interface DemoGrant { product: ProductId; sku: Sku; orderId: string; at: string }
interface Entitlement { product: string; status: string; period_end: string | null }

const PREVIEW_KEY = "horoscop:preview-plan";
const GRANTS_KEY = "horoscop:demo-grants";
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const subscribe = (cb: () => void) => { subs.add(cb); return () => { subs.delete(cb); }; };

let preview: PreviewPlan = null; let grants: DemoGrant[] = []; let loaded = false;
let ents: Entitlement[] = []; let entsFor: string | null = null;
function load() {
  if (loaded || typeof window === "undefined") return; loaded = true;
  try { const p = localStorage.getItem(PREVIEW_KEY); preview = p === "premium" || p === "free" ? p : null; grants = JSON.parse(localStorage.getItem(GRANTS_KEY) || "[]"); } catch { /* private mode */ }
}
type Snap = { preview: PreviewPlan; grants: DemoGrant[]; ents: Entitlement[] };
let snap: Snap = { preview, grants, ents };
const refresh = () => { snap = { preview, grants, ents }; emit(); };
const SERVER: Snap = { preview: null, grants: [], ents: [] };

export function setPreview(p: PreviewPlan) {
  preview = p; try { if (p) localStorage.setItem(PREVIEW_KEY, p); else localStorage.removeItem(PREVIEW_KEY); } catch {} refresh();
}
export function addDemoGrant(g: DemoGrant) {
  grants = [...grants.filter((x) => x.product !== g.product), g]; try { localStorage.setItem(GRANTS_KEY, JSON.stringify(grants)); } catch {} refresh();
}
export function clearDemoGrants() { grants = []; try { localStorage.removeItem(GRANTS_KEY); } catch {} refresh(); }

async function loadEntitlements(uid: string) {
  if (entsFor === uid) return; entsFor = uid;
  const c = sb() as unknown as SupabaseClient | null; if (!c) return;
  const { data } = await c.from("entitlements").select("product,status,period_end").eq("user_id", uid);
  ents = (data as Entitlement[] | null) ?? []; refresh();
}
const activeEnt = (e: Entitlement) => ["active", "trialing", "past_due"].includes(e.status) && (!e.period_end || new Date(e.period_end) > new Date());

export interface Access {
  ready: boolean; signedIn: boolean; isAdmin: boolean; preview: PreviewPlan;
  /** Locks are visible at all (paywall live, or an admin previewing as a free user). */
  locksOn: boolean;
  has: (p: ProductId) => boolean;
  grants: DemoGrant[];
}

export function useAccess(): Access {
  const a = useAccount();
  const s = useSyncExternalStore(subscribe, () => { if (!loaded) { load(); snap = { preview, grants, ents }; } return snap; }, () => SERVER);
  const uid = a.user?.id;
  useEffect(() => { if (uid) void loadEntitlements(uid); }, [uid]);
  const isAdmin = (a.user?.app_metadata as { role?: string } | undefined)?.role === "admin";
  const pv = isAdmin ? s.preview : null;
  const locksOn = PAYWALL_LIVE || pv === "free";
  const owned = new Set<string>([...s.ents.filter(activeEnt).map((e) => e.product), ...(isAdmin ? s.grants.map((g) => g.product) : [])]);
  const has = (p: ProductId) => !locksOn || pv === "premium" || owned.has(p);
  return { ready: a.ready, signedIn: !!a.user, isAdmin, preview: pv, locksOn, has, grants: isAdmin ? s.grants : [] };
}
