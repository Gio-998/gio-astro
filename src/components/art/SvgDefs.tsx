"use client";
import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { EMBLEM_IDS, emblemBody } from "./Emblem";
import { wheelBody } from "./ZodiacWheel";

/**
 * Shared gradients and the art sprite for all line-art (rendered once, visible, zero-size: gradients inside display:none SVGs
 * don't paint in Chrome). A client component so the sprite appears once in the HTML and not a second time in the RSC payload.
 * lib/share.ts copies this <defs> into share images, so keep everything <use> needs inside it.
 */
export function SvgDefs({ wheel = true }: { wheel?: boolean }) {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
      <defs>
        <linearGradient id="em-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe7b0" /><stop offset=".6" stopColor="#f6cf7a" /><stop offset="1" stopColor="#f6b5cf" /></linearGradient>
        <linearGradient id="zw-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe7b0" /><stop offset=".5" stopColor="#f6cf7a" /><stop offset="1" stopColor="#f6b5cf" /></linearGradient>
        <linearGradient id="lg-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe7b0" /><stop offset=".6" stopColor="#f6cf7a" /><stop offset="1" stopColor="#f6b5cf" /></linearGradient>
        <linearGradient id="sa-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe7b0" /><stop offset="1" stopColor="#e9b44c" /></linearGradient>
        <filter id="sa-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        {EMBLEM_IDS.map((id) => <symbol key={id} id={`emb-${id}`} viewBox="0 0 100 100">{emblemBody(id)}</symbol>)}
        {wheel && <symbol id="zodiac-wheel" viewBox="0 0 400 400">{wheelBody()}</symbol>}
      </defs>
    </svg>
  );
}

const noop = () => () => {};
/**
 * The sprite as the layout mounts it. The wheel is 21 KB of HTML and outside the landing page only the faint footer decoration uses it,
 * so there it joins the sprite after hydration instead of being written into every page.
 */
export function PageSprite() {
  const home = /^\/[a-z]{2}\/?$/.test(usePathname() ?? "");
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  return <SvgDefs wheel={home || hydrated} />;
}
