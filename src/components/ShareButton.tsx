"use client";
import { useState } from "react";
import { shareOrDownload, CardSpec } from "@/lib/share";
import { useContent } from "@/lib/content-context";
import { track } from "@/lib/track";
import { haptic } from "@/lib/haptics";

/** Renders a 9:16 story card and opens the native share sheet (download fallback with a short how-to). */
export function ShareButton({ spec, filename, className = "btn-primary", label }: { spec: CardSpec; filename: string; className?: string; label?: string }) {
  const { c } = useContent(); const S = c.sky.share;
  const [state, setState] = useState<"idle" | "busy" | "done" | "saved">("idle");
  const full: CardSpec = { ...spec, footer: spec.footer || S.footer, scan: spec.scan || S.scan };
  return (
    <span className="inline-flex flex-col items-center gap-1">
      <button className={className} disabled={state === "busy"} data-testid="share-card" onClick={async () => {
        haptic("tick"); setState("busy");
        const r = await shareOrDownload(full, filename.replace(/[^\w.-]+/g, "-"));
        if (r !== "cancelled") track("share_card");
        setState(r === "downloaded" ? "saved" : r === "shared" ? "done" : "idle");
        if (r !== "cancelled") haptic("success");
        setTimeout(() => setState("idle"), r === "downloaded" ? 6000 : 2000);
      }}>
        {state === "busy" ? "…" : state === "done" || state === "saved" ? "✓" : "⇪"} {label ?? c.site.common.share}
      </button>
      {state === "saved" && <span role="status" className="max-w-xs text-center text-xs text-dim">{S.saved}</span>}
    </span>
  );
}
