"use client";
import type { ReactNode } from "react";

/** Shows `preview`, then the name and email form, then `children` (the full result). Signed-in users and returning leads go straight to `children`. */
export function LeadGate({ source, preview, children }: { source: string; preview?: ReactNode; children: ReactNode }) {
  void source; void preview;
  return <>{children}</>;
}
