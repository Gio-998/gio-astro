/** Store app only: the sign and morning reminder chosen on this device. */
import { SIGNS, type Sign } from "@/engine/zodiac";
import { sunSignForDate } from "@/engine/astro";

const SIGN_KEY = "horoscop:sign";
const REMINDER_KEY = "horoscop:reminder";
const VISITS_KEY = "horoscop:today-visits";
const PROMPT_KEY = "horoscop:reminder-prompt";
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

/** How many times the Today tab has been opened on this device (used to time the reminder pre-prompt). */
export function todayVisitCount(): number {
  try { return Math.max(0, Number(localStorage.getItem(VISITS_KEY) || 0) || 0); } catch { return 0; }
}
let lastVisitAt = 0;
/** Count a Today opening. Dedupes React Strict Mode double-mount within 500 ms so the first launch stays at 1. */
export function recordTodayVisit(): number {
  const now = Date.now();
  if (now - lastVisitAt < 500) return todayVisitCount();
  lastVisitAt = now;
  const n = todayVisitCount() + 1;
  try { localStorage.setItem(VISITS_KEY, String(n)); } catch {}
  return n;
}
export function reminderPromptDismissed(): boolean {
  try { return localStorage.getItem(PROMPT_KEY) === "1"; } catch { return false; }
}
export function dismissReminderPrompt() { try { localStorage.setItem(PROMPT_KEY, "1"); } catch {} }

export function clearPrefs() {
  try {
    localStorage.removeItem(SIGN_KEY);
    localStorage.removeItem(REMINDER_KEY);
    localStorage.removeItem(VISITS_KEY);
    localStorage.removeItem(PROMPT_KEY);
  } catch {}
}

/**
 * When to show the in-app notification pre-prompt (never on first launch, never the OS dialog first).
 * True after Today has been opened a second time, a sign is known, the reminder is off, and the person has not already declined.
 */
export function shouldOfferReminder(o: {
  visitCount: number;
  hasSign: boolean;
  reminderOn: boolean;
  dismissed: boolean;
  permission: string;
}): boolean {
  if (o.reminderOn || o.dismissed || !o.hasSign) return false;
  if (o.permission !== "prompt" && o.permission !== "prompt-with-rationale") return false;
  return o.visitCount >= 2;
}
