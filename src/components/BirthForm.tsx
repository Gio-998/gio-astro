"use client";
import { useState } from "react";
import { CityPicker } from "./CityPicker";
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
}

export function BirthForm({ initial, submitLabel, askRelType, onSubmit }: BirthFormProps) {
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
    if (!name.trim()) return setErr(U.errName);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return setErr(U.errDate);
    const y = Number(date.slice(0, 4));
    if (y < 1800 || y > 2100) return setErr(U.errYear);
    const off = offset.trim() === "" ? null : Number(offset);
    onSubmit({
      id: initial?.id ?? newId(), name: name.trim(), birthName: birthName.trim() || undefined, date,
      time: unknown || !time ? null : time, place, utcOffsetOverride: Number.isFinite(off as number) ? off : null,
      quiz: initial?.quiz ?? {}, relType: askRelType ? rel : initial?.relType, createdAt: initial?.createdAt ?? new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label">{U.name}</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={U.namePh} autoComplete="given-name" />
      </div>
      <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr]">
        <div>
          <label className="label">{U.date}</label>
          <DatePicker value={date} onChange={setDate} minYear={1900} />
        </div>
        <div>
          <label className="label">{U.time} <span className="opacity-60">({c.site.common.optional})</span></label>
          <input className="input" type="time" value={time ?? ""} disabled={unknown} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-dim">
        <input type="checkbox" checked={unknown} onChange={(e) => setUnknown(e.target.checked)} /> {c.site.common.unknownTime}
        <span className="text-xs opacity-70">{U.unknownNote}</span>
      </label>
      <div>
        <label className="label">{U.place} <span className="opacity-60">{U.placeNote}</span></label>
        <CityPicker value={place} onChange={setPlace} />
      </div>
      {askRelType && (
        <div>
          <label className="label">{U.theyAre}</label>
          <div className="flex flex-wrap gap-2">
            {REL_TYPES.map((r) => (
              <button type="button" key={r} onClick={() => setRel(r)} className={rel === r ? "btn-primary" : "btn-ghost"}>{c.compat.relTypes[r].name}</button>
            ))}
          </div>
        </div>
      )}
      <button type="button" className="text-xs text-dim underline" onClick={() => setAdv(!adv)}>{adv ? U.hide : U.more}{U.moreNote}</button>
      {adv && (
        <div className="space-y-3 rounded-xl border border-white/10 p-3">
          <div>
            <label className="label">{U.fullName}</label>
            <input className="input" value={birthName} onChange={(e) => setBirthName(e.target.value)} placeholder={U.fullNamePh} />
          </div>
          <div>
            <label className="label">{U.offset}</label>
            <input className="input" value={offset} onChange={(e) => setOffset(e.target.value)} placeholder={U.offsetPh} inputMode="decimal" />
          </div>
        </div>
      )}
      {err && <p className="text-sm text-rose">{err}</p>}
      <button className="btn-primary w-full py-3 text-base" type="submit">{submitLabel}</button>
      <p className="text-xs text-dim">{U.saved}</p>
    </form>
  );
}
