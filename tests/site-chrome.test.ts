import { describe, it, expect, vi, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

describe("menu links do not prefetch", () => {
  // Hidden menus and the footer are in the DOM on every page: prefetching them cost phones about 490 KB of script per view.
  it.each(["src/components/nav/Nav.tsx", "src/components/Chrome.tsx"])("%s", (file) => {
    const src = readFileSync(file, "utf8");
    const links = src.split("<Link ").length - 1;
    expect(links).toBeGreaterThan(0);
    expect(src.split("<Link prefetch={false} ").length - 1).toBe(links);
  });
});

describe("partner form", () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });
  const serverHtml = async () => { vi.resetModules(); const { PartnersForm } = await import("@/components/pages/PartnersForm"); return renderToString(createElement(PartnersForm)); };

  it("is in the server HTML on a build with accounts, so the browser's first render matches it", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://proj.supabase.co"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
    expect(await serverHtml()).toContain('data-testid="partners-form"');
  });
  it("shows the offline note on a build without accounts", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", ""); vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    expect(await serverHtml()).not.toContain('data-testid="partners-form"');
  });
});
