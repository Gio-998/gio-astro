"use client";
import { useEffect } from "react";
import { setSky, resetSky } from "@/lib/sky-bus";

/**
 * Landing-only motion layer, loaded on idle so it never touches first paint:
 * Lenis smooth scrolling (wheel; touch stays native) + GSAP ScrollTrigger reveals.
 *  - [data-fx="words"]   heading words rise from blur, staggered (SplitText)
 *  - [data-fx="parallax"] gentle depth drift while scrolling (scrubbed)
 *  - [data-fx="pop"]     children pop in with a stagger
 *  - [data-sky="0.6"]    sets the Living Sky intensity while that section is on screen
 * Everything is skipped under prefers-reduced-motion.
 */
export function ScrollFx() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let dead = false; let cleanup = () => {};
    const run = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger"), import("gsap/SplitText")]);
      if (dead) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);
      const lenis = new Lenis({ lerp: 0.11, smoothWheel: true, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add("lenis");

      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-fx='words']").forEach((el) => {
          const split = SplitText.create(el, { type: "words", wordsClass: "fx-word" });
          // background-clip:text gradients don't survive inline-block children: give each such word its own gradient
          (split.words as HTMLElement[]).forEach((w) => { const g = w.parentElement?.closest(".text-aurora, .holo-text"); if (g) w.classList.add(...[...g.classList].filter((k) => k === "text-aurora" || k === "holo-text")); });
          gsap.from(split.words, { yPercent: 60, opacity: 0, filter: "blur(10px)", duration: 0.9, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        });
        gsap.utils.toArray<HTMLElement>("[data-fx='parallax']").forEach((el) => {
          gsap.fromTo(el, { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } });
        });
        gsap.utils.toArray<HTMLElement>("[data-fx='pop']").forEach((el) => {
          gsap.from(el.children, { y: 40, opacity: 0, scale: 0.94, rotate: (i) => (i % 2 ? 2 : -2), duration: 0.8, ease: "back.out(1.6)", stagger: 0.07, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        });
        gsap.utils.toArray<HTMLElement>("[data-sky]").forEach((el) => {
          const v = Number(el.dataset.sky) || 1;
          ScrollTrigger.create({ trigger: el, start: "top 60%", end: "bottom 40%", onToggle: (st) => setSky({ intensity: st.isActive ? v : 1 }) });
        });
      });
      cleanup = () => { ctx.revert(); gsap.ticker.remove(tick); lenis.destroy(); document.documentElement.classList.remove("lenis"); resetSky(); };
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const start = () => (w.requestIdleCallback ? w.requestIdleCallback(() => void run(), { timeout: 3000 }) : setTimeout(() => void run(), 1500));
    if (document.readyState === "complete") start(); else window.addEventListener("load", start, { once: true });
    return () => { dead = true; window.removeEventListener("load", start); cleanup(); };
  }, []);
  return null;
}
