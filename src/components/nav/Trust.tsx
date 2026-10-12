"use client";
import Link from "next/link";
import { useHref } from "@/lib/content-context";
import { useNav } from "./Nav";

/** Small, calm trust strip for key CTAs: no tricks, private by default, free results, cancel anytime. */
export function TrustStrip({ className = "", center = false }: { className?: string; center?: boolean }) {
  const N = useNav(); const h = useHref();
  return (
    <ul aria-label={N.trustLabel} data-testid="trust-strip" className={`flex flex-wrap gap-1.5 ${center ? "justify-center" : ""} ${className}`}>
      {N.trust.map((t) => (
        <li key={t.text}>
          <Link href={h(t.href)} className="inline-flex min-h-[30px] items-center gap-1.5 rounded-full border border-sage/25 bg-sage/[0.07] px-2.5 text-[11.5px] text-mist/85 transition hover:border-sage/60 hover:text-mist">
            <span aria-hidden className="text-sage">{t.icon}</span>{t.text}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** "How this is measured" link under results, to the methods page. */
export function MethodLink({ className = "", anchor }: { className?: string; anchor?: string }) {
  const N = useNav(); const h = useHref();
  return <Link href={h(`/how-it-works/${anchor ? `#${anchor}` : ""}`)} className={`mt-2 inline-flex items-center gap-1 text-xs text-sage underline decoration-dotted underline-offset-4 hover:text-mist ${className}`} data-testid="method-link">🔬 {N.method} →</Link>;
}
