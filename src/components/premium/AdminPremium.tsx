"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sb } from "@/lib/supabase";
import { useContent, useHref } from "@/lib/content-context";
import { OFFERS } from "@/lib/payments";
import { useAccess } from "./access";
import { usePremiumText, DemoControls, DemoBadge } from "./bits";

type Interest = { product: string; locale: string | null; created_at: string };

export function AdminPremium() {
  const acc = useAccess(); const T = usePremiumText(); const A = T.admin; const h = useHref(); const { c, locale } = useContent();
  const [rows, setRows] = useState<Interest[] | null>(null);
  useEffect(() => {
    if (!acc.isAdmin) return;
    const cl = sb() as unknown as SupabaseClient | null; if (!cl) return;
    void cl.from("premium_interest").select("product,locale,created_at").order("created_at", { ascending: false }).then(({ data }) => setRows((data as Interest[] | null) ?? []));
  }, [acc.isAdmin]);
  if (!acc.ready) return <p className="text-dim">{c.site.common.loading}</p>;
  if (!acc.isAdmin) return <div className="card text-dim" data-testid="not-admin">{c.ui.beta.notAdmin}</div>;
  const counts = (rows ?? []).reduce<Record<string, number>>((m, r) => ({ ...m, [r.product]: (m[r.product] ?? 0) + 1 }), {});
  const links: [string, string][] = [["/premium/", "Premium"], ...OFFERS.map((id) => [`/premium/${id}/`, T.products[id].name] as [string, string]), ["/premium/checkout/?sku=premium-yearly", T.checkout.title], ["/book/", c.book.title], ["/today/", "Today"]];
  return (
    <div className="mx-auto max-w-2xl space-y-4" data-testid="admin-premium">
      <div className="flex flex-wrap items-center justify-between gap-2"><h1 className="h-display text-4xl text-aurora">{A.title}</h1><DemoBadge /></div>
      <p className="text-sm text-dim">{A.sub}</p>
      <DemoControls />
      <div className="card">
        <h2 className="h-display mb-2 text-2xl">{A.links}</h2>
        <div className="flex flex-wrap gap-2">{links.map(([p, l]) => <Link key={p} className="chip !text-mist hover:!border-gold/60" href={h(p)}>{l}</Link>)}</div>
      </div>
      <div className="card">
        <h2 className="h-display mb-2 text-2xl">{T.demo.interest} · {rows?.length ?? "…"}</h2>
        {rows && rows.length === 0 && <p className="text-sm text-dim">{T.demo.noInterest}</p>}
        {rows && rows.length > 0 && <ul className="divide-y divide-white/10 text-sm">{Object.entries(counts).map(([p, n]) => <li key={p} className="flex justify-between py-2"><span>{p === "premium" ? "Premium" : T.products[p]?.name ?? p}</span><span className="text-gold">{n}</span></li>)}</ul>}
        {rows && rows.length > 0 && <p className="mt-2 text-xs text-dim">{new Date(rows[0].created_at).toLocaleString(locale === "mk" ? "mk-MK" : locale === "de" ? "de-DE" : "en-GB")}</p>}
      </div>
      <div className="card">
        <h2 className="h-display mb-2 text-2xl">{A.checklist}</h2>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm">{A.steps.map((s) => <li key={s}>{s}</li>)}</ol>
      </div>
    </div>
  );
}
