"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Every client-side navigation to a new path lands at the top of the page.
 * Next only scrolls the changed segment into view, and with `scroll-behavior: smooth` that scroll is animated,
 * so from deep on the landing page it got cut short by the new (shorter) page and left visitors at the footer.
 * Back/forward (popstate) and links with a #hash are left alone so the browser restores / jumps as usual.
 */
const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function RouteScrollTop() {
  const path = usePathname();
  const first = useRef(true);
  const pop = useRef(false);
  useEffect(() => {
    const onPop = () => { pop.current = true; };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useIso(() => {
    if (first.current) { first.current = false; return; }
    if (pop.current) { pop.current = false; return; }
    if (window.location.hash) return;
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    // Next may still scroll its segment after commit; pin the top once more on the next frame.
    requestAnimationFrame(() => { if (!window.location.hash) window.scrollTo(0, 0); html.style.scrollBehavior = prev; });
  }, [path]);
  return null;
}
