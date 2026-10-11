"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BirthForm } from "../BirthForm";
import { repo, useStore } from "@/lib/store";
import { useHref } from "@/lib/content-context";
import { PageHero } from "../ui";
import { ZodiacWheel } from "../art/ZodiacWheel";

const STEPS = ["Finding the sky over your birthplace…", "Placing the Sun, Moon and planets…", "Reading your Chinese year and element…", "Counting your numbers…", "Drawing your cards…", "Mixing your colour palette…"];

/** Short "reading your sky" sequence — the calculations are real and instant; this just gives the moment some ceremony. */
function Casting({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const fast = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setInterval(() => setI((x) => x + 1), fast ? 80 : 420);
    return () => clearInterval(id);
  }, []);
  useEffect(() => { if (i >= STEPS.length) onDone(); }, [i, onDone]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-night/90 backdrop-blur-xl" role="status" aria-live="polite">
      <div className="text-center">
        <div className="relative mx-auto mb-8 h-64 w-64">
          <ZodiacWheel className="h-full w-full animate-[spin_6s_linear_infinite]" />
          <div className="absolute inset-[38%] animate-pulse-glow rounded-full bg-gold/40 blur-xl" />
        </div>
        <p className="h-display text-2xl text-mist">{STEPS[Math.min(i, STEPS.length - 1)]}</p>
        <div className="mx-auto mt-4 flex w-48 gap-1">{STEPS.map((_, k) => <span key={k} className={`h-1 flex-1 rounded-full transition ${k <= i ? "bg-gold" : "bg-white/15"}`} />)}</div>
      </div>
    </div>
  );
}

export function QuickStart() {
  const s = useStore(); const router = useRouter(); const h = useHref();
  const preDate = useSearchParams().get("date");
  const [casting, setCasting] = useState(false);
  return (
    <div>
      {casting && <Casting onDone={() => router.push(h("/me/"))} />}
      <PageHero eyebrow={s?.me ? "Your birth details" : "Free · 90 seconds · no sign-up"} emblem="chart" img="cliffs"
        title={s?.me ? <>Edit your <span className="italic text-aurora">birth details</span></> : <>Your cosmic codex <span className="italic text-aurora">in 90 seconds</span></>}
        sub="Name and birth date are enough to start. Time and place make it more precise. Everything is free and stays on your device." />
      <div className="card mx-auto max-w-2xl">
        {s === null ? null : (
          <BirthForm key={s.me?.id ?? "new"} initial={s.me ?? (preDate && /^\d{4}-\d{2}-\d{2}$/.test(preDate) ? { date: preDate, time: "" } : undefined)} submitLabel={s.me ? "Save" : "Reveal my profile ✦"}
            onSubmit={(p) => { const first = !s.me; repo.saveMe({ ...p, id: "me" }); if (first) setCasting(true); else router.push(h("/me/")); }} />
        )}
      </div>
      <div className="mx-auto mt-6 grid max-w-2xl grid-cols-3 gap-3 text-center text-xs text-dim">
        <p>✦ Sun, Moon & rising</p><p>✦ Chinese animal & element</p><p>✦ Numbers, tarot & palette</p>
      </div>
    </div>
  );
}
