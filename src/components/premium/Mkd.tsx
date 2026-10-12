"use client";
import { useContent } from "@/lib/content-context";
import { mkd, useShowMkd, usePremiumText } from "./bits";

/** Small second line with the approximate denar amount (North Macedonia only). */
export function MkdLine({ cents, className = "block text-[11px] text-dim" }: { cents: number; className?: string }) {
  const show = useShowMkd(); const { locale } = useContent(); const T = usePremiumText();
  if (!show) return null;
  return <span className={className} data-testid="mkd">{T.mkd(mkd(cents, locale))}</span>;
}
