"use client";
import { useEffect, useState } from "react";

/**
 * A looping marquee needs its content twice, but only the browser needs that. The server sends one copy, so readers,
 * crawlers and the HTML size see each line once, and the hidden second copy is added after hydration.
 */
export function MarqueeLoop({ className, children }: { className?: string; children: React.ReactNode }) {
  const [loop, setLoop] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setLoop(true)); return () => cancelAnimationFrame(id); }, []);
  return <div className={className}>{children}{loop && <div aria-hidden className="contents">{children}</div>}</div>;
}
