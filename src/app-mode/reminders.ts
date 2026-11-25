/**
 * Store app only: the morning reminder as LOCAL scheduled notifications (no server, no push credentials).
 * Each run schedules the next 7 mornings, each with that day's own headline, so the text changes daily even if the app stays closed for a week.
 * Rescheduled on every app start and resume, and whenever the settings change.
 * Permission is never requested on first launch: only after the in-app pre-prompt (toggle or second visit to Today).
 */
import { LocalNotifications } from "@capacitor/local-notifications";
import { addDays, todayIso } from "@/engine/skyday";
import { horoPath } from "@/lib/horoscope";
import { cachedReading } from "./horo-cache";
import { preferredSign, reminderPrefs } from "./prefs";
import { appCopy } from "./copy";

const BASE_ID = 7100; const DAYS = 7;
const ids = () => Array.from({ length: DAYS }, (_, i) => ({ id: BASE_ID + i }));

export async function cancelReminders() { try { await LocalNotifications.cancel({ notifications: ids() }); } catch {} }

/** Current OS notification permission. Never prompts. */
export async function notificationStatus(): Promise<string> {
  try { return (await LocalNotifications.checkPermissions()).display; } catch { return "denied"; }
}

/** Shows the system permission dialog. Call only after the in-app pre-prompt. */
export async function requestPermission(): Promise<boolean> {
  try {
    const p = await LocalNotifications.requestPermissions();
    return p.display === "granted";
  } catch { return false; }
}

export async function scheduleReminders(lang: string): Promise<void> {
  const prefs = reminderPrefs(); await cancelReminders();
  if (!prefs.on) return;
  const sign = prefs.sign ?? preferredSign(); if (!sign) return;
  if ((await notificationStatus()) !== "granted") return;
  const today = todayIso(); const now = Date.now(); const T = appCopy(lang).reminder;
  const notifications = [];
  for (let i = 0; i < DAYS; i++) {
    const iso = addDays(today, i); const [y, m, d] = iso.split("-").map(Number);
    const at = new Date(y, m - 1, d, prefs.hour, prefs.minute, 0, 0);
    if (at.getTime() <= now + 60_000) continue;
    const r = cachedReading(lang, sign, iso);
    notifications.push({ id: BASE_ID + i, title: T.notifTitle(`${r.glyph} ${r.signName}`), body: r.headline, schedule: { at, allowWhileIdle: true }, isExactNotification: false, smallIcon: "ic_stat_moon", extra: { path: horoPath(lang, sign) } });
  }
  if (notifications.length) await LocalNotifications.schedule({ notifications });
}
