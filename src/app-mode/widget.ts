/**
 * Store app only: hands the home-screen widget a JSON snapshot for today and the next 6 days, so the widget can show the right day's text
 * even when the app was not opened that morning. Native side: WidgetBridge plugin
 *   iOS     ios/App/App/WidgetBridgePlugin.swift → UserDefaults(suiteName: "group.si.horoscop.app"), key "snapshot", then reloads widget timelines
 *   Android android/.../WidgetBridgePlugin.java → SharedPreferences "horoscop_widget", key "snapshot", then updates HoroscopWidgetProvider
 * A missing native side (e.g. iOS before the widget target is added) is ignored.
 */
import { registerPlugin } from "@capacitor/core";
import { addDays, todayIso } from "@/engine/skyday";
import { horoPath } from "@/lib/horoscope";
import { cachedReading } from "./horo-cache";
import { preferredSign } from "./prefs";
import { appCopy } from "./copy";

type WidgetBridgePlugin = { saveSnapshot(o: { json: string }): Promise<void>; clear(): Promise<void> };
const WidgetBridge = registerPlugin<WidgetBridgePlugin>("WidgetBridge");

export type WidgetSnapshot = {
  version: 1; lang: string; empty: string; updated: string;
  days: Record<string, { sign: string; signName: string; glyph: string; headline: string; overview: string; moonLine: string; luckyNumber: number; luckyColor: string; deepLink: string }>;
};

export function buildSnapshot(lang: string, today = todayIso()): WidgetSnapshot {
  const sign = preferredSign(); const days: WidgetSnapshot["days"] = {};
  if (sign) for (let i = 0; i < 7; i++) {
    const iso = addDays(today, i); const r = cachedReading(lang, sign, iso);
    days[iso] = { sign, signName: r.signName, glyph: r.glyph, headline: r.headline, overview: r.overview, moonLine: r.moonLine, luckyNumber: r.luckyNumber, luckyColor: r.luckyColor, deepLink: `https://horoscop.si${horoPath(lang, sign)}` };
  }
  return { version: 1, lang, empty: appCopy(lang).widget.empty, updated: new Date().toISOString(), days };
}

export async function updateWidget(lang: string) { try { await WidgetBridge.saveSnapshot({ json: JSON.stringify(buildSnapshot(lang)) }); } catch {} }
export async function clearWidget() { try { await WidgetBridge.clear(); } catch {} }
