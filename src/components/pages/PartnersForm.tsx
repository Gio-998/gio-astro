"use client";
import { useState } from "react";
import { sb } from "@/lib/supabase";
import { useContent } from "@/lib/content-context";

const PLATFORMS = ["tiktok", "instagram", "youtube", "blog", "telegram", "podcast", "other"] as const;
const AUDIENCES = ["lt1k", "1k-10k", "10k-50k", "50k-250k", "gt250k"] as const;

/** Partner application: inserts into public.affiliate_applications (insert-only RLS). No payments involved. */
export function PartnersForm() {
  const { c, locale } = useContent(); const P = c.partners;
  const [f, setF] = useState({ name: "", email: "", platform: "instagram", handle: "", link: "", audience: "1k-10k", languages: "", message: "", agreed: false });
  const [state, setState] = useState<"idle" | "busy" | "done" | "dupe" | "error">("idle");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value });
  const client = sb();
  if (!client) return <p className="card text-sm text-dim">{P.offline}</p>;
  if (state === "done" || state === "dupe") return <p role="status" className="card border-gold/40 bg-gold/10 text-center" data-testid="partners-done">{state === "done" ? P.done : P.dupe}</p>;
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setState("busy");
    const link = f.link.trim(); const { error } = await client.from("affiliate_applications" as never).insert({
      name: f.name.trim().slice(0, 80), email: f.email.trim().toLowerCase(), platform: f.platform, handle: f.handle.trim().slice(0, 120),
      link: link ? (/^https?:\/\//i.test(link) ? link : `https://${link}`).slice(0, 300) : null, audience: f.audience,
      languages: f.languages.trim().slice(0, 80) || null, message: f.message.trim().slice(0, 2000) || null, agreed_terms: f.agreed, locale,
    } as never);
    setState(!error ? "done" : error.code === "23505" ? "dupe" : "error");
  };
  const lbl = "block text-sm"; const inp = "input mt-1 w-full text-[16px]";
  return (
    <form onSubmit={submit} className="card grid gap-3" data-testid="partners-form">
      <label className={lbl}>{P.name}<input required maxLength={80} className={inp} value={f.name} onChange={set("name")} autoComplete="name" /></label>
      <label className={lbl}>{P.email}<input required type="email" maxLength={254} className={inp} value={f.email} onChange={set("email")} autoComplete="email" /></label>
      <div className="grid grid-cols-2 gap-3">
        <label className={lbl}>{P.platform}<select className={inp} value={f.platform} onChange={set("platform")}>{PLATFORMS.map((x) => <option key={x} value={x}>{P.platforms[x]}</option>)}</select></label>
        <label className={lbl}>{P.audience}<select className={inp} value={f.audience} onChange={set("audience")}>{AUDIENCES.map((x) => <option key={x} value={x}>{P.audiences[x]}</option>)}</select></label>
      </div>
      <label className={lbl}>{P.handle}<input required maxLength={120} className={inp} value={f.handle} onChange={set("handle")} /></label>
      <label className={lbl}>{P.link}<input maxLength={300} className={inp} value={f.link} onChange={set("link")} inputMode="url" /></label>
      <label className={lbl}>{P.languages}<input maxLength={80} className={inp} value={f.languages} onChange={set("languages")} /></label>
      <label className={lbl}>{P.message}<textarea maxLength={2000} className={`${inp} h-24 resize-none`} value={f.message} onChange={set("message")} /></label>
      <label className="flex items-start gap-2 text-sm"><input type="checkbox" required className="mt-1" checked={f.agreed} onChange={set("agreed")} />{P.agree}</label>
      {state === "error" && <p role="alert" className="text-sm text-rose">{P.error}</p>}
      <button className="btn-primary py-3" disabled={state === "busy"}>{state === "busy" ? P.sending : P.send}</button>
    </form>
  );
}
