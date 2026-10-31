"use client";
import { useState } from "react";
import { CityPicker } from "./CityPicker";
import { TimePicker, Toggle } from "./controls";
import { DatePicker } from "./DatePicker";
import type { StoredPerson, Place } from "@/lib/store";
import { newId } from "@/lib/store";
import { useContent } from "@/lib/content-context";
import { REL_TYPES, RelType } from "@/engine/compat";

export interface BirthFormProps {
  initial?: Partial<StoredPerson>;
  submitLabel: string;
  askRelType?: boolean;
  onSubmit: (p: StoredPerson) => void;
  compact?: boolean;
  /** Public calculators: no name, no "saved" note and no online place lookup, because nothing is kept or sent. */
  anonymous?: boolean;
  /** The first run works with a birth date alone. */
  nameOptional?: boolean;
  /** The result is useless without a time, so drop the "unknown time" switch. */
  timeRequired?: boolean;
  /** Extra check before submit; return a message to show it instead of submitting. */
  check?: (p: StoredPerson) => string | null;
}

export function BirthForm({ initial, submitLabel, askRelType, onSubmit, anonymous, nameOptional, timeRequired, check }: BirthFormProps) {
  const { c } = useContent(); const U = c.ui.birthForm;
  const [name, setName] = useState(initial?.name ?? "");
  const [birthName, setBirthName] = useState(initial?.birthName ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [time, setTime] = useState(initial?.time ?? "");
  const [unknown, setUnknown] = useState(initial ? initial.time == null && !!initial.date : false);
  const [place, setPlace] = useState<Place | null>(initial?.place ?? null);
  const [adv, setAdv] = useState(false);
  const [offset, setOffset] = useState(initial?.utcOffsetOverride != null ? String(initial.utcOffsetOverride) : "");
  const [rel, setRel] = useState<RelType>(initial?.relType ?? "romantic");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anonymous && !nameOptional && !name.trim()) return setErr(U.errName);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return setErr(U.errDate);
    const y = Number(date.slice(0, 4));
    if (y < 1800 || y > 2100) return setErr(U.errYear);
    const off = offset.trim() === "" ? null : Number(offset);
    const person: StoredPerson = {
      id: initial?.id ?? newId(), name: name.trim(), birthName: birthName.trim() || undefined, date,
      time: unknown || !time ? null : time, place, utcOffsetOverride: Number.isFinite(off as number) ? off : null,
      quiz: initial?.quiz ?? {}, relType: askRelType ? rel : initial?.relType, createdAt: initial?.createdAt ?? new Date().toISOString(),
    };
    const bad = check?.(person); if (bad) return setErr(bad);
    setErr(""); onSubmit(person);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {!anonymous && <div>
        <label className="label">{U.name}{nameOptional && <> <span className="opacity-60">({c.site.common.optional})</span></>}</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={U.namePh} autoComplete="given-name" />
      </div>}
      <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr]">
        <div>
          <label className="label">{U.date}</label>
          <DatePicker value={date} onChange={setDate} minYear={1900} />
        </div>
        <div>
          <label className="label">{U.time}{!timeRequired && <> <span className="opacity-60">({c.site.common.optional})</span></>}</label>
          <TimePicker value={time ?? ""} disabled={unknown} onChange={setTime} testId="time-field" />
        </div>
      </div>
      {!timeRequired && <Toggle checked={unknown} onChange={setUnknown}>{c.site.common.unknownTime} <span className="text-xs opacity-70">{U.unknownNote}</span></Toggle>}
      <div>
        <label className="label">{U.place} <span className="opacity-60">{U.placeNote}</span></label>
        <CityPicker value={place} onChange={setPlace} online={!anonymous} />
      </div>
      {askRelType && (
        <div>
          <label className="label">{U.theyAre}</label>
          <div role="radiogroup" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {REL_TYPES.map((r) => (
              <button type="button" role="radio" aria-checked={rel === r} key={r} onClick={() => setRel(r)} className={`min-h-[48px] rounded-2xl border px-3 text-sm transition active:scale-[.98] ${rel === r ? "border-gold bg-gold/15 text-gold shadow-[0_0_24px_-8px_rgba(246,207,122,.6)]" : "border-white/12 bg-white/[0.04] hover:border-gold/40"}`}>{c.compat.relTypes[r].name}</button>
            ))}
          </div>
        </div>
      )}
      <button type="button" className="text-xs text-dim underline" onClick={() => setAdv(!adv)}>{adv ? U.hide : U.more}{anonymous ? "" : U.moreNote}</button>
      {adv && (
        <div className="space-y-3 rounded-xl border border-white/10 p-3">
          {!anonymous && <div>
            <label className="label">{U.fullName}</label>
            <input className="input" value={birthName} onChange={(e) => setBirthName(e.target.value)} placeholder={U.fullNamePh} />
          </div>}
          <div>
            <label className="label">{U.offset}</label>
            <input className="input" value={offset} onChange={(e) => setOffset(e.target.value)} placeholder={U.offsetPh} inputMode="decimal" />
          </div>
        </div>
      )}
      {err && <p className="text-sm text-rose">{err}</p>}
      <button className="btn-primary w-full py-3 text-base" type="submit">{submitLabel}</button>
      {!anonymous && <p className="text-xs text-dim">{U.saved}</p>}
    </form>
  );
}
