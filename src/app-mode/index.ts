/**
 * App-only features behind one import, "@/app-mode".
 *
 * This file is what the WEBSITE build gets: every export is inert, so the site bundle carries no native code and behaves exactly as before.
 * `npm run build:app` (APP_EXPORT=1) points "@/app-mode" at ./native.tsx instead (next.config.ts). native.tsx must export the same names
 * with the same types: it imports this module's types and checks itself against them.
 *
 * Server components must not branch on values from here (in the app build they are client references). They read
 * process.env.NEXT_PUBLIC_APP_BUILD === "1" instead.
 */
import type { ReactElement } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Sign } from "@/engine/zodiac";

export type LiveDayProps = { lang: string; sign: Sign; buildIso: string };
export type LiveHubProps = { lang: string; buildIso: string };
export type OAuthProvider = "apple" | "google";
/** The caller passes sb()!.auth, so this module imports no client module (the website's server components import it too). */
export type Auth = SupabaseClient["auth"];

/** True only inside the store app. */
export const isNativeApp = (): boolean => false;
/**
 * Where purchases may happen. The website keeps its own checkout. The store app never links to web payment:
 * later it will use the stores' own in-app purchases ("store"), and until that exists it offers none.
 */
export const purchaseChannel = (): "web" | "store" | "none" => "web";

/** Native boot (status bar, splash, deep links, day change). Nothing on the website. */
export function NativeBoot(): ReactElement | null { return null; }
/** Bottom tabs of the store app. The website keeps nav/Nav.tsx TabBar. */
export function AppTabBar(): ReactElement | null { return null; }
/** Sign page that recomputes the reading for the device's own date. The website prerenders DailyHoroscope instead. */
export function LiveDailyHoroscope(_: LiveDayProps): ReactElement | null { return null; }
/** Sign list with headlines for the device's own date. */
export function LiveHub(_: LiveHubProps): ReactElement | null { return null; }
/** Morning reminder settings (local notifications). */
export function ReminderCard(): ReactElement | null { return null; }

/** Origin used in sign-in email links. On the website: the page's own origin. */
export const authOrigin = (): string => location.origin;

/** Third-party sign-in. On the website: the normal redirect flow back to /<lang>/auth/callback. */
export async function signInWithProvider(auth: Auth, provider: OAuthProvider, locale: string): Promise<void> {
  const { error } = await auth.signInWithOAuth({ provider, options: { redirectTo: `${location.origin}/${locale}/auth/callback` } });
  if (error) throw error;
}

/** Clears app-only data (cached readings, widget snapshot, scheduled reminders) after sign-out with "clear" or account deletion. */
export async function clearNativeData(): Promise<void> {}
