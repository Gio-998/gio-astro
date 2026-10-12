"use client";
/**
 * Optional bot check for sign-up / sign-in, passed to Supabase as `captchaToken`.
 * Off unless NEXT_PUBLIC_CAPTCHA_SITE_KEY is set. Provider: Cloudflare Turnstile (default) or hCaptcha
 * (NEXT_PUBLIC_CAPTCHA_PROVIDER=hcaptcha). The matching secret goes in Supabase: Auth > Attack Protection.
 */
import { useCallback, useEffect, useRef, useState } from "react";

export const CAPTCHA_KEY = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || "";
export const CAPTCHA_PROVIDER: "turnstile" | "hcaptcha" = process.env.NEXT_PUBLIC_CAPTCHA_PROVIDER === "hcaptcha" ? "hcaptcha" : "turnstile";
export const captchaEnabled = !!CAPTCHA_KEY;

type Api = { render: (el: HTMLElement, o: Record<string, unknown>) => string; reset: (id?: string) => void; remove?: (id: string) => void };
const SRC = { turnstile: "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", hcaptcha: "https://js.hcaptcha.com/1/api.js?render=explicit" };
let loading: Promise<Api> | null = null;
function load(): Promise<Api> {
  const w = window as unknown as Record<string, Api | undefined>;
  if (w[CAPTCHA_PROVIDER]) return Promise.resolve(w[CAPTCHA_PROVIDER]!);
  return (loading ??= new Promise<Api>((res, rej) => {
    const s = document.createElement("script"); s.src = SRC[CAPTCHA_PROVIDER]; s.async = true; s.defer = true;
    s.onload = () => { const t = setInterval(() => { if (w[CAPTCHA_PROVIDER]) { clearInterval(t); res(w[CAPTCHA_PROVIDER]!); } }, 50); };
    s.onerror = () => { loading = null; rej(new Error("captcha script failed")); };
    document.head.appendChild(s);
  }));
}

/** Returns the current token (or "" until solved), the widget to render, and reset() to call after each auth request (tokens are single-use). */
export function useCaptcha(locale: string, active = true) {
  const [token, setToken] = useState("");
  const el = useRef<HTMLDivElement>(null); const id = useRef<string | null>(null);
  useEffect(() => {
    if (!captchaEnabled || !active || !el.current) return;
    let alive = true; const node = el.current;
    load().then((api) => {
      if (!alive || id.current) return;
      id.current = api.render(node, { sitekey: CAPTCHA_KEY, theme: "dark", language: locale, hl: locale, callback: (t: string) => setToken(t), "expired-callback": () => setToken(""), "error-callback": () => setToken("") });
    }).catch(() => {});
    return () => { alive = false; };
  }, [locale, active]);
  const reset = useCallback(() => {
    setToken("");
    const api = (window as unknown as Record<string, Api | undefined>)[CAPTCHA_PROVIDER];
    if (api && id.current) try { api.reset(id.current); } catch { /* widget gone */ }
  }, []);
  const widget = captchaEnabled && active ? <div ref={el} className="flex min-h-[65px] justify-center" data-testid="captcha" /> : null;
  return { token, widget, reset, needed: captchaEnabled && active && !token };
}
