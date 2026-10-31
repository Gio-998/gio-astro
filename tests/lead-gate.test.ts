import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { contents, type Locale } from "@/content";
import { isPublicRoute } from "@/components/auth/Beta";

const URL_ = "https://proj.supabase.co";
function fakeStorage() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), clear: () => m.clear(), keys: () => [...m.keys()], get: (k: string) => m.get(k) };
}
let store: ReturnType<typeof fakeStorage>;
beforeEach(() => {
  vi.resetModules();
  store = fakeStorage();
  vi.stubGlobal("localStorage", store);
  vi.stubGlobal("window", { addEventListener() {}, removeEventListener() {} });
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", URL_);
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

const input = { name: "Ana Petrovska", email: "Ana@Example.com", marketing: false, source: "big-five", locale: "de" };
const ok = (..._: unknown[]) => Promise.resolve(Response.json({ ok: true }));
const lastBody = (f: { mock: { calls: unknown[][] } }) => JSON.parse((f.mock.calls.at(-1)![1] as RequestInit).body as string);
const PENDING = "horoscop:lead-pending";

describe("submitLead", () => {
  it("posts to the function, opens the device and clears the queue", async () => {
    const f = vi.fn(ok); vi.stubGlobal("fetch", f);
    const { submitLead, hasLead } = await import("@/lib/lead");
    expect(await submitLead(input)).toBe("delivered");
    expect(f.mock.calls[0][0]).toBe(`${URL_}/functions/v1/submit-lead`);
    expect(hasLead()).toBe(true);
    expect(store.get(PENDING)).toBeUndefined();
  });
  it("sends only name, email, locale, source, consent and a timestamp: no answers, no results", async () => {
    const f = vi.fn(ok); vi.stubGlobal("fetch", f);
    const { submitLead, PRIVACY_VERSION } = await import("@/lib/lead");
    await submitLead({ ...input, marketing: true, marketingText: "Ja" });
    const body = lastBody(f);
    expect(Object.keys(body).sort()).toEqual(["at", "email", "locale", "marketing", "marketingText", "name", "privacyVersion", "source"]);
    expect(body).toMatchObject({ email: "ana@example.com", name: "Ana Petrovska", marketing: true, marketingText: "Ja", privacyVersion: PRIVACY_VERSION });
  });
  it("drops the consent words when the box is unticked", async () => {
    const f = vi.fn(ok); vi.stubGlobal("fetch", f);
    const { submitLead } = await import("@/lib/lead");
    await submitLead({ ...input, marketingText: "Ja" });
    expect(lastBody(f).marketingText).toBeUndefined();
  });
  it("catches a bad name or email before any network call, and keeps the gate shut", async () => {
    const f = vi.fn(ok); vi.stubGlobal("fetch", f);
    const { submitLead, hasLead } = await import("@/lib/lead");
    expect(await submitLead({ ...input, name: "<b>" })).toBe("invalid_name");
    expect(await submitLead({ ...input, email: "nope" })).toBe("invalid_email");
    expect(f).not.toHaveBeenCalled();
    expect(hasLead()).toBe(false);
  });
  it("doesn't lose the visitor when the function is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("offline"))));
    const { submitLead, hasLead } = await import("@/lib/lead");
    expect(await submitLead(input)).toBe("kept");
    expect(hasLead()).toBe(true);
    expect(JSON.parse(store.get(PENDING)!)).toMatchObject({ email: "ana@example.com", source: "big-five" });
  });
  it("gives up waiting after a few seconds, and the result still opens", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn((_: string, init: RequestInit) => new Promise((_r, reject) => { init.signal!.addEventListener("abort", () => reject(new Error("aborted"))); })));
    const { submitLead } = await import("@/lib/lead");
    const done = submitLead(input);
    await vi.advanceTimersByTimeAsync(7000);
    expect(await done).toBe("kept");
    vi.useRealTimers();
    expect(store.get(PENDING)).toBeDefined();
  });
  it("keeps the lead for a server error, a rate limit or a captcha problem", async () => {
    const { submitLead } = await import("@/lib/lead");
    for (const [status, error] of [[500, "server_error"], [429, "rate_limited"], [503, "captcha_unavailable"], [400, "captcha_failed"], [403, "origin"]] as const) {
      store.clear();
      vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(Response.json({ error }, { status }))));
      expect(await submitLead(input), error).toBe("kept");
      expect(store.get(PENDING), error).toBeDefined();
    }
  });
  it("keeps the lead when the answer isn't even JSON", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(new Response("Bad gateway", { status: 502 }))));
    const { submitLead } = await import("@/lib/lead");
    expect(await submitLead(input)).toBe("kept");
    expect(store.get(PENDING)).toBeDefined();
  });
  it("opens the result but drops a lead the server refused for good", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(Response.json({ error: "invalid_email" }, { status: 400 }))));
    const { submitLead, hasLead } = await import("@/lib/lead");
    expect(await submitLead(input)).toBe("kept");
    expect(hasLead()).toBe(true);
    expect(store.get(PENDING)).toBeUndefined();
  });
  it("still works with storage blocked", async () => {
    vi.stubGlobal("localStorage", { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); }, removeItem() { throw new Error("blocked"); } });
    vi.stubGlobal("fetch", vi.fn(ok));
    const { submitLead, hasLead } = await import("@/lib/lead");
    expect(await submitLead(input)).toBe("delivered");
    expect(hasLead()).toBe(false);
  });
  it("cleans a surprising source so it can't cost a lead", async () => {
    const f = vi.fn(ok); vi.stubGlobal("fetch", f);
    const { submitLead, cleanSource } = await import("@/lib/lead");
    expect(await submitLead({ ...input, source: "Big Five/Test!" })).toBe("delivered");
    expect(lastBody(f).source).toBe("big-five-test-");
    expect(cleanSource("")).toBe("unknown");
    expect(cleanSource("---")).toBe("unknown");
    expect(cleanSource("x".repeat(100))).toHaveLength(64);
  });
});

describe("retryPendingLead", () => {
  it("resends the queued lead on the next visit, without an old token, and clears it", async () => {
    store.setItem(PENDING, JSON.stringify({ name: "Ana Petrovska", email: "ana@example.com", locale: "de", source: "care", marketing: false, privacyVersion: "2026-10-31" }));
    const f = vi.fn(ok); vi.stubGlobal("fetch", f);
    const { retryPendingLead } = await import("@/lib/lead");
    await retryPendingLead();
    expect(f).toHaveBeenCalledTimes(1);
    expect(lastBody(f).source).toBe("care");
    expect(lastBody(f).captchaToken).toBeUndefined();
    expect(store.get(PENDING)).toBeUndefined();
  });
  it("tries once per page load and keeps the lead if it fails again", async () => {
    store.setItem(PENDING, JSON.stringify({ email: "ana@example.com" }));
    const f = vi.fn(() => Promise.reject(new Error("offline"))); vi.stubGlobal("fetch", f);
    const { retryPendingLead } = await import("@/lib/lead");
    await retryPendingLead(); await retryPendingLead();
    expect(f).toHaveBeenCalledTimes(1);
    expect(store.get(PENDING)).toBeDefined();
  });
  it("does nothing with an empty queue", async () => {
    const f = vi.fn(ok); vi.stubGlobal("fetch", f);
    await (await import("@/lib/lead")).retryPendingLead();
    expect(f).not.toHaveBeenCalled();
  });
  it("survives a corrupted queue", async () => {
    store.setItem(PENDING, "{nope");
    vi.stubGlobal("fetch", vi.fn(ok));
    await expect((await import("@/lib/lead")).retryPendingLead()).resolves.toBeUndefined();
  });
});

describe("forgetLead", () => {
  it("removes the flag and any queued name and email from the device", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("offline"))));
    const { submitLead, forgetLead, hasLead } = await import("@/lib/lead");
    await submitLead(input);
    forgetLead();
    expect(hasLead()).toBe(false);
    expect(store.keys()).toEqual([]);
  });
});

describe("statusKey", () => {
  const known = contents.en.ui.lead.page.status;
  it("shows known outcomes and reads anything else as a bad link, even a name built into every object", async () => {
    const { statusKey } = await import("@/components/lead/EmailAction");
    const { parseEmailHash } = await import("@/lib/lead");
    expect(statusKey(parseEmailHash("#s=confirmed"), known)).toBe("confirmed");
    expect(statusKey(parseEmailHash("#s=expired"), known)).toBe("expired");
    for (const h of ["#s=constructor", "#s=toString", "#s=__proto__", "#s=nonsense", "", `#a=confirm&t=${"a".repeat(43)}`]) expect(statusKey(parseEmailHash(h), known), h).toBe("invalid");
  });
});

describe("parseEmailHash", () => {
  const T = "a".repeat(43);
  it("reads actions and outcomes", async () => {
    const { parseEmailHash } = await import("@/lib/lead");
    expect(parseEmailHash(`#a=confirm&t=${T}`)).toEqual({ kind: "action", action: "confirm", token: T });
    expect(parseEmailHash(`#a=unsubscribe&t=${T}`)).toEqual({ kind: "action", action: "unsubscribe", token: T });
    expect(parseEmailHash("#s=confirmed")).toEqual({ kind: "status", status: "confirmed" });
  });
  it("ignores anything else", async () => {
    const { parseEmailHash } = await import("@/lib/lead");
    for (const h of ["", "#", "#a=delete&t=x", `#a=confirm`, "#a=confirm&t=short", "#foo=bar"]) expect(parseEmailHash(h), h).toBeNull();
  });
});

describe("gateView", () => {
  const guest = { backend: true, ready: true, signedIn: false, lead: false, timedOut: false };
  it("shows the form to a guest", async () => { expect((await import("@/components/lead/LeadGate")).gateView(guest)).toBe("form"); });
  it("never shows it to a signed-in reader or a returning lead", async () => {
    const { gateView } = await import("@/components/lead/LeadGate");
    expect(gateView({ ...guest, signedIn: true })).toBe("open");
    expect(gateView({ ...guest, lead: true })).toBe("open");
    expect(gateView({ ...guest, ready: false, signedIn: true })).toBe("open");
  });
  it("holds the form back until the session is known, so it can't flash", async () => {
    expect((await import("@/components/lead/LeadGate")).gateView({ ...guest, ready: false })).toBe("wait");
  });
  it("stops waiting if the session check never answers", async () => {
    expect((await import("@/components/lead/LeadGate")).gateView({ ...guest, ready: false, timedOut: true })).toBe("form");
  });
  it("skips the form on a build with no backend: there is nowhere to send it", async () => {
    expect((await import("@/components/lead/LeadGate")).gateView({ ...guest, backend: false })).toBe("open");
  });
});

/** Renders the real component for a guest on a build with a backend. */
async function render(locale: Locale, ready = true) {
  vi.unstubAllGlobals();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "k");
  const { LeadGate } = await import("@/components/lead/LeadGate");
  const { ContentProvider } = await import("@/lib/content-context");
  const { startAccountSync } = await import("@/lib/sync");
  if (ready) startAccountSync();
  const gate = createElement(LeadGate, { source: "big-five", preview: createElement("p", null, "TEASER"), children: createElement("p", null, "FULL RESULT") });
  return renderToStaticMarkup(createElement(ContentProvider, { locale, children: gate }));
}

describe("LeadGate, rendered", () => {
  for (const locale of ["en", "mk", "de"] as const) {
    it(`${locale}: shows teaser and form, hides the result, in the visitor's language`, async () => {
      const html = await render(locale); const L = contents[locale].ui.lead;
      expect(html).toContain("TEASER");
      expect(html).not.toContain("FULL RESULT");
      for (const s of [L.nameLabel, L.emailLabel, L.submit, L.notice, L.marketing, L.haveAccount, L.login]) expect(html, s).toContain(s);
      expect(html).toMatch(new RegExp(`href="/${locale}/privacy/?"`)); // the slash comes from trailingSlash, which only applies in a real build
    });
  }
  it("has one name field, one email field and a separate, unticked box", async () => {
    const html = await render("en");
    expect(html.match(/data-testid="lead-(name|email|marketing)"/g)).toHaveLength(3);
    const box = /<input[^>]*type="checkbox"[^>]*>/.exec(html)![0];
    expect(box).not.toMatch(/checked(=|\s|>)/);
    expect(html).toMatch(/autoComplete="name"|autocomplete="name"/i);
    expect(html).toMatch(/autoComplete="email"|autocomplete="email"/i);
  });
  it("hides the honeypot from people and keyboards", async () => {
    const html = await render("en");
    expect(html).toMatch(/<div aria-hidden="true"[^>]*-left-\[9999px\]/);
    expect(/<input[^>]*name="website"[^>]*>/.exec(html)![0]).toMatch(/tabindex="-1"/i);
  });
  it("links to login, and comes back to this page", async () => {
    expect(await render("de")).toMatch(/href="\/de\/account\/?\?next=/);
  });
  it("shows only the teaser until the session is known", async () => {
    const html = await render("en", false);
    expect(html).toContain("TEASER");
    expect(html).not.toContain("lead-gate");
    expect(html).not.toContain("FULL RESULT");
  });
});

describe("copy for the gate", () => {
  it("is a full set in every language, with an error per code", () => {
    const shape = (o: unknown): unknown => (typeof o === "object" && o ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, shape(v)])) : typeof o);
    for (const l of ["mk", "de"] as const) expect(shape(contents[l].ui.lead), l).toEqual(shape(contents.en.ui.lead));
    for (const l of ["en", "mk", "de"] as const) expect(new Set(Object.values(contents[l].ui.lead.errors)).size).toBe(2);
    expect(contents.de.ui.lead.submit).not.toBe(contents.en.ui.lead.submit);
    expect(contents.mk.ui.lead.submit).not.toBe(contents.en.ui.lead.submit);
  });
  it("uses the reader word test, and promises no results by email", () => {
    for (const l of ["en", "mk", "de"] as const) {
      const s = JSON.stringify(contents[l].ui.lead);
      expect(s, l).not.toMatch(/quiz|квиз|codex|кодекс/i);
    }
    expect(contents.en.ui.lead.notice).toContain("stay on this device");
  });
  it("has a status page text for every outcome the database can return", () => {
    const sql = readFileSync("supabase/migrations/20261031_leads.sql", "utf8");
    const statuses = [...sql.matchAll(/select '(\w+)'::text/g)].map((m) => m[1]);
    expect(new Set(statuses)).toEqual(new Set(["invalid", "unsubscribed", "used", "expired", "confirmed"]));
    for (const l of ["en", "mk", "de"] as const) for (const s of [...statuses, "error"]) expect(contents[l].ui.lead.page.status, `${l} ${s}`).toHaveProperty(s);
  });
});

describe("the email page", () => {
  it("stays open during the private beta, because links in an email reach everyone", () => {
    for (const l of ["en", "mk", "de"]) expect(isPublicRoute(`/${l}/email/`), l).toBe(true);
  });
  it("is kept out of search", () => { expect(readFileSync("src/app/[lang]/email/page.tsx", "utf8")).toContain("index: false"); });
});
