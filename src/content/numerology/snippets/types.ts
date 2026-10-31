/**
 * What one page shows in search results. `title` is what people type, followed by this page's own hook (the view adds
 * " · Horoscop"). `description` gives this page's own answer and a concrete reason to click. Never a shared closing clause.
 * Limits, enforced by tests/numerology-snippets.test.ts: title at most 55 characters, description 110 to 158 and unique.
 * `h1` and `lead` stay on the page model, so a title can follow search wording while the heading stays natural.
 */
export type Snippet = { title: string; description: string };
/** Keyed by the internal path without "/numerology/" and the slashes: "angel-numbers/1001", "mirror-hours/05-05", "calculator/name". The section root is "hub". */
export type SnippetSet = Record<string, Snippet>;
