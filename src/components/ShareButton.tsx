"use client";
import { useState } from "react";
import { shareOrDownload, CardSpec } from "@/lib/share";
import { useContent } from "@/lib/content-context";

export function ShareButton({ spec, filename }: { spec: CardSpec; filename: string }) {
  const { c } = useContent();
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  return (
    <button className="btn-primary" disabled={state === "busy"} onClick={async () => { setState("busy"); await shareOrDownload(spec, filename.replace(/[^\w.-]+/g, "-")); setState("done"); setTimeout(() => setState("idle"), 2000); }}>
      {state === "busy" ? "…" : state === "done" ? "✓" : "⇪"} {c.site.common.share}
    </button>
  );
}
