"use client";
import { useEffect, useMemo, useState } from "react";
import type { StoredPerson } from "@/lib/store";
import { profileOf } from "@/lib/profile";
import { useContent, useDate } from "@/lib/content-context";
import { dailyGuidance } from "@/engine/daily";
import { MAJOR_ARCANA } from "@/engine/tarot";
import { SIGNS, SIGN_GLYPH } from "@/engine/zodiac";
import { inviteCopy } from "@/lib/invite-copy";
import { renderSkyCard, canvasBlob, SkyCardData, SkyFormat } from "@/lib/sky-card";
import { track } from "@/lib/track";
import { haptic } from "@/lib/haptics";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://horoscop.si").replace(/\/$/, "");

/** Build the personal card data from the user's chart and the live sky. */
export function useSkyCardData(me: StoredPerson | null, now: Date | null, url?: string): SkyCardData | null {
  const { c, locale } = useContent(); const fmt = useDate(); const T = inviteCopy(locale).card;
  return useMemo(() => {
    if (!me || !now) return null;
    const p = profileOf(me); const g = dailyGuidance(p, now, c.daily.prompts.length);
    const A = c.astro, D = c.daily, U = c.ui.today;
    const top = g.transits[0];
    const cap = (x: string) => x.charAt(0).toLocaleUpperCase(locale) + x.slice(1);
    const headline = top ? cap(U.transit(A.points[top.transiting].name, D.transitTone[top.type], A.points[top.natal].name)) : c.sky.stories.quietLine;
    const body = top ? cap(`${U.meets(D.transitMood[top.transiting], A.points[top.natal].governs)} ${D.transitAdvice[top.type]}`) : D.moonPhases[g.moon.phase].text;
    return {
      name: me.name, dateLine: fmt(now, { weekday: true }), eyebrow: T.eyebrow,
      sunGlyph: SIGN_GLYPH[p.sun], sunLine: T.sun(A.signs[p.sun].name), moonGlyph: SIGN_GLYPH[g.moon.moonSign], moonLine: T.moon(A.signs[g.moon.moonSign].name),
      moonAngle: g.moon.angle, moonSignIndex: SIGNS.indexOf(g.moon.moonSign), sunSignIndex: SIGNS.indexOf(p.sun),
      headline, body, chips: [T.day(g.personalDay), `${D.moonPhases[g.moon.phase].name}`, c.nums.tarot[MAJOR_ARCANA[g.cardOfDay]].name],
      url: url || `${SITE}/${locale}/?ref=sky`, scan: T.scan,
    };
  }, [me, now, url, c, locale, fmt, T]);
}

/** Compact card: live preview, Story / Square pill, one-tap share (Web Share API, download fallback). */
export function SkyCardShare({ me, now, url }: { me: StoredPerson; now: Date; url?: string }) {
  const { locale } = useContent(); const T = inviteCopy(locale).card;
  const data = useSkyCardData(me, now, url);
  const [format, setFormat] = useState<SkyFormat>("story");
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "busy" | "shared" | "saved">("idle");
  const key = data ? JSON.stringify(data) : "";
  useEffect(() => {
    if (!data) return; let alive = true; let u: string | null = null;
    void renderSkyCard(data, format).then(canvasBlob).then((b) => { if (!alive) return; u = URL.createObjectURL(b); setPreview(u); });
    return () => { alive = false; if (u) URL.revokeObjectURL(u); };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key covers data
  }, [key, format]);
  if (!data) return null;
  const share = async () => {
    haptic("tick"); setState("busy");
    const blob = await canvasBlob(await renderSkyCard(data, format));
    const file = new File([blob], `horoscop-sky-${format}.png`, { type: "image/png" });
    const nav = navigator as Navigator & { canShare?: (d: unknown) => boolean };
    let r: "shared" | "saved" | "idle" = "saved";
    if (nav.canShare?.({ files: [file] })) {
      try { await nav.share({ files: [file], title: T.title }); r = "shared"; } catch (e) { r = (e as Error)?.name === "AbortError" ? "idle" : "saved"; }
    }
    if (r === "saved") { const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = file.name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000); }
    if (r !== "idle") { track("share_card", { card: "sky", format }); haptic("success"); }
    setState(r); if (r !== "idle") setTimeout(() => setState("idle"), 2500);
  };
  return (
    <div className="card !p-4" data-testid="sky-card">
      <div className="flex items-center gap-4">
        <div className={`shrink-0 overflow-hidden rounded-xl border border-gold/30 bg-[#170f3d] ${format === "story" ? "h-[96px] w-[54px]" : "h-[72px] w-[72px]"}`}>
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt={T.title} className="h-full w-full object-cover" data-testid="sky-card-preview" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="eyebrow mb-0.5">✦ {T.eyebrow}</p>
          <p className="truncate text-sm text-dim">{T.desc}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
            <div role="tablist" className="flex rounded-full border border-white/15 p-0.5 text-xs">
              {(["story", "square"] as const).map((f) => <button key={f} role="tab" aria-selected={format === f} onClick={() => setFormat(f)} className={`min-h-[32px] rounded-full px-3 ${format === f ? "bg-gold/15 text-gold" : "text-dim"}`}>{f === "story" ? T.story : T.square}</button>)}
            </div>
            <button className="btn-primary !min-h-[36px] flex-1 whitespace-nowrap !px-4 !py-1.5 text-sm" disabled={state === "busy"} onClick={share} data-testid="sky-card-share">
              {state === "busy" ? T.making : state === "shared" ? `✓ ${T.done}` : state === "saved" ? `✓ ${T.saved}` : `⇪ ${T.share}`}
            </button>
          </div>
    </div>
  );
}
