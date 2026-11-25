/** Store app only: the sign and morning reminder chosen on this device. */
import { SIGNS, type Sign } from "@/engine/zodiac";
import { sunSignForDate } from "@/engine/astro";

const SIGN_KEY = "horoscop:sign";
const REMINDER_KEY = "horoscop:reminder";
export type ReminderPrefs = { on: boolean; hour: number; minute: number; sign: Sign | null };

const isSign = (s: unknown): s is Sign => typeof s === "string" && (SIGNS as readonly string[]).includes(s);

/** Sign for the widget and reminders: picked in the reminder card, else the profile's Sun sign, else the last horoscope opened. */
export function preferredSign(): Sign | null {
  const r = reminderPrefs(); if (r.sign) return r.sign;
  try {
    const me = (JSON.parse(localStorage.getItem("mirrorstar:v1") || "null") as { me?: { date?: string } } | null)?.me;
    if (me?.date) return sunSignForDate(me.date);
  } catch {}
  try { const s = localStorage.getItem(SIGN_KEY); return isSign(s) ? s : null; } catch { return null; }
}
export function rememberSign(sign: Sign) { try { localStorage.setItem(SIGN_KEY, sign); } catch {} }

export function reminderPrefs(): ReminderPrefs {
  try {
    const v = JSON.parse(localStorage.getItem(REMINDER_KEY) || "null") as Partial<ReminderPrefs> | null;
    if (v) return { on: !!v.on, hour: Number(v.hour ?? 8), minute: Number(v.minute ?? 0), sign: isSign(v.sign) ? v.sign : null };
  } catch {}
  return { on: false, hour: 8, minute: 0, sign: null };
}
export function saveReminderPrefs(p: ReminderPrefs) { try { localStorage.setItem(REMINDER_KEY, JSON.stringify(p)); } catch {} }
export function clearPrefs() { try { localStorage.removeItem(SIGN_KEY); localStorage.removeItem(REMINDER_KEY); } catch {} }
