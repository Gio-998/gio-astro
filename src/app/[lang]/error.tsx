"use client";
import Link from "next/link";
import { useContent, useHref } from "@/lib/content-context";

/** A page that fails to draw still offers a way on. Saved results live on the device, so nothing is lost by trying again. */
export default function PageError({ retry }: { error: unknown; retry: () => void }) {
  const { c } = useContent(); const h = useHref(); const E = c.ui.myProfile.error;
  return (
    <div className="card mx-auto my-8 max-w-lg text-center" data-testid="page-error" role="alert">
      <h1 className="h-display mb-2 text-4xl"><span className="text-aurora">{E.title}</span></h1>
      <p className="mb-5 text-mist/85">{E.text}</p>
      <button type="button" className="btn-primary w-full !min-h-[48px]" onClick={() => retry()}>{E.retry}</button>
      <Link className="mt-1 inline-flex min-h-[44px] items-center text-sm text-dim underline decoration-dotted underline-offset-4 hover:text-mist" href={h("/start/")}>{c.ui.me.editBirth}</Link>
    </div>
  );
}
