"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { BirthForm } from "../BirthForm";
import { repo, useStore } from "@/lib/store";
import { useHref } from "@/lib/content-context";

export function QuickStart() {
  const s = useStore(); const router = useRouter(); const h = useHref();
  const preDate = useSearchParams().get("date");
  return (
    <div>
      <h1 className="h-display mb-1 text-4xl text-gold">{s?.me ? "Edit your birth details" : "Your cosmic codex in 90 seconds"}</h1>
      <p className="mb-6 text-dim">Name and birth date are enough to start. Time and place make it more precise. Everything is free and stays on your device.</p>
      <div className="card">
        {s === null ? null : (
          <BirthForm key={s.me?.id ?? "new"} initial={s.me ?? (preDate && /^\d{4}-\d{2}-\d{2}$/.test(preDate) ? { date: preDate, time: "" } : undefined)} submitLabel={s.me ? "Save" : "Reveal my profile ✨"} onSubmit={(p) => { repo.saveMe({ ...p, id: "me" }); router.push(h("/me/")); }} />
        )}
      </div>
    </div>
  );
}
