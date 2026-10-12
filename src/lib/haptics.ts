/** Haptic ticks: Telegram (iOS + Android), navigator.vibrate (Android). iOS Safari has no web vibration, so it silently does nothing. */
export type Haptic = "tick" | "soft" | "success" | "heartbeat" | "celebrate";
const PATTERNS: Record<Haptic, number[]> = { tick: [8], soft: [14], success: [12, 40, 18], heartbeat: [20, 90, 30], celebrate: [10, 30, 10, 30, 40] };

export function haptic(kind: Haptic = "tick") {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try { if (localStorage.getItem("horoscop:haptics") === "off") return; } catch { /* ignore */ }
  const tg = (window as unknown as { Telegram?: { WebApp?: { HapticFeedback?: { notificationOccurred: (t: string) => void; impactOccurred: (t: string) => void } } } }).Telegram?.WebApp?.HapticFeedback;
  if (tg) { if (kind === "success" || kind === "celebrate") tg.notificationOccurred("success"); else tg.impactOccurred(kind === "tick" ? "light" : "medium"); return; }
  try { navigator.vibrate?.(PATTERNS[kind]); } catch { /* not allowed before user gesture */ }
}
