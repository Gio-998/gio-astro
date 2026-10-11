"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Starfield } from "../art/Starfield";
import { ZodiacWheel } from "../art/ZodiacWheel";
import { SignArt } from "../art/SignArt";
import { useHref, useContent } from "@/lib/content-context";
import { DatePicker } from "../DatePicker";
import { cosmos } from "../art/ArtCard";

export function Hero() {
  const h = useHref(); const router = useRouter(); const { c } = useContent(); const H = c.site.hero;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "25%"]);
  const yWheel = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "40%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-15%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [date, setDate] = useState("");
  const go = (e: React.FormEvent) => { e.preventDefault(); router.push(h(`/start/${date ? `?date=${date}` : ""}`)); };
  const words = H.words;
  return (
    <section ref={ref} className="bleed relative -mt-[72px] md:-mt-[76px] flex min-h-[100svh] items-center overflow-hidden pt-20">
      <motion.div style={{ y: yBg }} className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cosmos("cliffs", 1920)} srcSet={`${cosmos("cliffs", 640)} 640w, ${cosmos("cliffs", 1280)} 1280w, ${cosmos("cliffs", 1920)} 1920w`} sizes="100vw" alt="" fetchPriority="high"
          className="absolute inset-0 h-full w-full animate-kenburns object-cover object-bottom opacity-70" />
      </motion.div>
      {/* dusk grade: indigo sky → violet → rose/peach horizon */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#120f2e]/95 via-[#3b2f86]/45 to-[#f6b5cf]/25" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#120f2e] via-[#120f2e]/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-[18%] h-40 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(255,214,184,.35),transparent_70%)]" />
      <Starfield density={0.00028} />
      <motion.div style={{ y: yWheel }} className="pointer-events-none absolute -right-[18vw] top-[8%] h-[95vmin] w-[95vmin] opacity-60 md:right-[-6vw]">
        <ZodiacWheel className="h-full w-full animate-spin-slow drop-shadow-[0_0_30px_rgba(246,207,122,.25)]" />
        <div className="absolute inset-[32%] animate-float"><SignArt sign="leo" className="h-full w-full opacity-80" showGlyph={false} /></div>
      </motion.div>

      <motion.div style={{ y: yText, opacity: fade }} className="relative mx-auto w-full max-w-6xl px-5">
        <div className="max-w-2xl">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="eyebrow mb-5">{H.eyebrow}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1, delay: 0.2 }}
            className="h-display mb-6 text-[clamp(2.8rem,7vw,5.6rem)] font-medium leading-[0.98]">
            {H.see}<span className="italic text-aurora">{words[0]}</span>{H.mid}<span className="italic text-aurora">{H.end}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="mb-8 max-w-xl text-lg leading-relaxed text-mist/90">
            Your birth chart, Chinese zodiac, numbers, tarot and the personality science that actually holds up — woven into one honest mirror for you and your relationships. Free, in 90 seconds.
          </motion.p>
          <motion.form onSubmit={go} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="mb-4 flex max-w-xl flex-col gap-2 rounded-[28px] border border-white/20 bg-white/10 p-2 shadow-[0_20px_60px_-20px_rgba(139,108,240,.8)] backdrop-blur-xl sm:flex-row sm:items-center">
            <div className="flex-1 px-3 py-1.5">
              <span className="mb-1 block whitespace-nowrap font-display text-xl italic text-gold">{H.bornOn}</span>
              <DatePicker value={date} onChange={setDate} compact />
            </div>
            <button className="btn-primary px-6 py-3.5 text-base">{H.reveal}</button>
          </motion.form>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-dim">
            {H.perks.map((p) => <span key={p}>{p}</span>)}
            <a href={h("/match/")} className="text-gold underline-offset-4 hover:underline">{H.orMatch}</a>
          </motion.div>
        </div>
      </motion.div>
      <a href="#discover" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-dim sm:flex" aria-label={H.scrollDown}>
        <span className="eyebrow !text-[10px] !text-dim">{H.scroll}</span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
      </a>
    </section>
  );
}
