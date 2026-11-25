import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";

type Route = { src?: string; status?: number; handle?: string; headers?: { Location?: string } };
const routes = (JSON.parse(readFileSync("vercel.json", "utf8")) as { routes: Route[] }).routes;
const beforeFs = routes.slice(0, routes.findIndex((r) => r.handle === "filesystem"));
const to = (p: string) => { const r = beforeFs.find((x) => x.status && x.src && new RegExp(`^${x.src}$`).test(p)); return r ? r.headers!.Location!.replace("$1", p.split("/")[1]) : undefined; };

describe("guessable short URLs", () => {
  it("/login/ goes to the account page on the log-in tab", () => {
    expect(to("/login/")).toBe("/en/account/?tab=login"); expect(to("/login")).toBe("/en/account/?tab=login");
    for (const l of ["en", "mk", "de", "sr"]) expect(to(`/${l}/login/`)).toBe(`/${l}/account/?tab=login`);
  });
  it("/contact/ goes to the privacy page, which lists the contact address", () => {
    expect(to("/contact/")).toBe("/en/privacy/");
    for (const l of ["en", "mk", "de", "sr"]) expect(to(`/${l}/contact/`)).toBe(`/${l}/privacy/`);
    expect(readFileSync("src/app/[lang]/privacy/page.tsx", "utf8")).toContain("contact@horoscop.si");
  });
  it("targets are real pages", () => { expect(existsSync("src/app/[lang]/account/page.tsx")).toBe(true); expect(existsSync("src/app/[lang]/privacy/page.tsx")).toBe(true); });
});
