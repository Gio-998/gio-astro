"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export function Faq({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-[#2a2350]/10 overflow-hidden rounded-3xl border border-[#2a2350]/10 bg-white/70 shadow-[0_30px_60px_-40px_rgba(42,35,80,.5)]">
      {items.map(([q, a], i) => (
        <div key={q}>
          <button className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            <span className="h-display text-xl font-semibold text-plum">{q}</span>
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#b8862e]/40 text-[#b8862e] transition duration-300 ${open === i ? "rotate-45 bg-[#f6cf7a]/30" : ""}`}>+</span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                <p className="px-6 pb-5 leading-relaxed text-[#4a4278]">{a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
