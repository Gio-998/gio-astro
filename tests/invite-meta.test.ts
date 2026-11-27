import { describe, it, expect } from "vitest";
import { generateMetadata } from "@/app/[lang]/invite/page";

describe("invite page metadata", () => {
  for (const lang of ["en", "mk", "de", "sr"]) it(`${lang}: one site name, self-canonical, invite alternates, noindex`, async () => {
    const m = await generateMetadata({ params: Promise.resolve({ lang }) });
    expect(String(m.title)).not.toMatch(/Horoscop/); // the layout template adds " · Horoscop" once
    expect(m.alternates?.canonical).toBe(`/${lang}/invite/`);
    const langs = m.alternates?.languages as Record<string, string>;
    for (const l of ["en", "mk", "de", "sr"]) expect(langs[l]).toBe(`/${l}/invite/`);
    expect(langs["x-default"]).toBe("/en/invite/");
    expect(m.robots).toMatchObject({ index: false });
  });
});
