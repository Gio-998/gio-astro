"use client";
import Link from "next/link";
import { useState } from "react";
import { useAccount } from "@/lib/sync";
import { useContent, useHref } from "@/lib/content-context";
import { EMAIL_IDS, EmailId, EmailLang, emailName, renderEmail } from "@/emails/templates";
import { Segmented } from "../controls";

/** Admin-only gallery of the branded email templates (demo, nothing is sent). */
export function EmailPreview() {
  const a = useAccount(); const { c, locale } = useContent(); const B = c.ui.beta; const h = useHref();
  const isAdmin = (a.user?.app_metadata as { role?: string } | undefined)?.role === "admin";
  const [id, setId] = useState<EmailId>("code"); const [lang, setLang] = useState<EmailLang>(locale === "mk" || locale === "de" ? locale : "en");
  const [w, setW] = useState<"390" | "640">("390");
  if (!a.ready) return <p className="text-dim">{c.site.common.loading}</p>;
  if (!isAdmin) return <div className="card text-dim" data-testid="not-admin">{B.notAdmin} {!a.user && <Link className="text-gold" href={h("/account")}>{B.haveInvite}</Link>}</div>;
  const mail = renderEmail(id, lang);
  return (
    <div className="space-y-4" data-testid="email-preview">
      <div className="flex items-center justify-between gap-3"><h1 className="h-display text-4xl text-aurora">{B.emailsTitle}</h1><Link className="text-sm text-gold" href={h("/admin/")}>← {B.adminTitle}</Link></div>
      <p className="text-sm text-dim">{B.emailsNote}</p>
      <div className="flex flex-wrap gap-2">{EMAIL_IDS.map((k) => <button key={k} type="button" onClick={() => setId(k)} className={`rounded-full border px-3 py-1.5 text-sm ${id === k ? "border-gold bg-gold/15 text-gold" : "border-white/15 text-dim"}`}>{emailName(k, lang)}</button>)}</div>
      <div className="grid grid-cols-2 gap-2 sm:max-w-md">
        <Segmented label="Language" value={lang} onChange={setLang} options={[{ value: "en", label: "English" }, { value: "mk", label: "Македонски" }, { value: "de", label: "Deutsch" }]} />
        <Segmented label="Width" value={w} onChange={setW} options={[{ value: "390", label: "📱 390" }, { value: "640", label: "🖥 640" }]} />
      </div>
      <div className="card !p-3"><p className="mb-2 text-sm"><span className="text-dim">{B.emailsSubject}:</span> <b>{mail.subject}</b></p>
        <div className="flex justify-center overflow-hidden rounded-2xl bg-black/30 p-2"><iframe title={mail.subject} srcDoc={mail.html.replaceAll("{{ .Token }}", "482916").replaceAll("{{ .ConfirmationURL }}", "#")} sandbox="" style={{ width: Number(w), maxWidth: "100%", height: 860, border: 0, borderRadius: 16, background: "#120f2e" }} /></div>
      </div>
      <details className="card text-sm"><summary className="cursor-pointer text-gold">HTML</summary><textarea readOnly className="input mt-2 h-48 font-mono text-xs" value={mail.html} /></details>
    </div>
  );
}
