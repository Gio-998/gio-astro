"use client";
import { useSyncExternalStore } from "react";

/** True while the browser prints or saves a PDF, so collapsed sections can render their full text. */
let printing = false;
const subs = new Set<() => void>();
const set = (v: boolean) => { if (printing !== v) { printing = v; subs.forEach((f) => f()); } };
let wired = false;
function wire() {
  if (wired || typeof window === "undefined") return; wired = true;
  window.addEventListener("beforeprint", () => set(true));
  window.addEventListener("afterprint", () => set(false));
  const mq = window.matchMedia?.("print");
  mq?.addEventListener?.("change", (e) => set(e.matches));
  if (mq?.matches) printing = true;
}
export function usePrinting(): boolean {
  return useSyncExternalStore((f) => { wire(); subs.add(f); return () => subs.delete(f); }, () => printing, () => false);
}
