# Mirrorstar copy style guide

How every piece of English text in the app should sound: UI labels, quiz items, results, the Book of You, Bond Story, lens pages, landing, legal and learn pages.

## The voice

Write like a thoughtful friend who knows astrology and psychology well. Warm, direct, a little witty, never preachy.

- Talk to "you". Short words over long ones. "Use", not "utilise".
- Be concrete. "Answering a message at once, then wondering why they take three days" beats "you value prompt communication".
- Vary the rhythm. Mix short sentences with longer ones. A three-word sentence is allowed. So is a long one that takes its time, if it earns it.
- Keep the honest framing. Astrology, numerology, tarot and the Chinese zodiac are mirrors for reflection, not predictions. Research-backed lenses (Big Five, attachment) are labelled as such. Never promise to heal, cure or predict.
- Never write anyone off. Frictions come with something practical to try.
- No fear, no fake urgency, no flattery that could fit anyone.

## Punctuation

- **No em dashes (—) or en dashes (–) as punctuation. Anywhere.** Not as a spaced hyphen ( - ) either.
  - Aside in the middle of a sentence: use commas, or parentheses if the aside already has commas.
  - Explanation or list after a clause: use a colon.
  - Two complete thoughts: use a period. Start a new sentence.
  - Number ranges: `9-19`, or write "9 to 19". Pairs of names: `Vata-Pitta`, `Fire/Water`.
  - Empty value placeholders in tables: `·` or `…`, not `—`.
- Hyphens inside words are fine: self-aware, push-pull, yin-yang.
- Sentence case in running text. Title case only for proper headings and names.
- No emoji in prose. Small icons as badges or labels (🔬 ✦ ⚓) are fine.

## Phrases we don't use

These read as machine-written. The checker fails on most of them.

| Avoid | Try instead |
| --- | --- |
| delve, dive into | look at, get into |
| tapestry, realm, testament, beacon | say the plain thing |
| embark on a journey, your journey | your life, your path, the road |
| navigate | handle, find your way through, deal with |
| unlock your potential | grow, get better at |
| woven, weave | built from, pulled together |
| truly, deeply, profoundly (stacked) | "really", or cut it. A precise verb does more. |
| transformative, empower, elevate, unleash, harness, foster, resonate, embrace, vibrant, seamless, holistic | concrete verbs: change, help, lift, use, build, fit, welcome, lively |
| "It's not just X, it's Y" / "X is not Y. It is Z." | Say what it *is*. |
| "Whether you're X or Y…" | Pick the reader you mean. |
| "In a world where…" | Start with the point. |
| Rhetorical-question openers ("Have you ever wondered…?") | Start with the point. |

Also watch for:

- **Rule of three everywhere.** "Calm, steady and kind" is fine once. Ten triples on a page sound like a template. Use two, or one good word.
- **Stacked adjectives.** "A deep, rich, powerful bond" says less than "a bond that lasts".
- **Hollow uplift.** "Your light shines brightly for all" means nothing. Give the reader something to notice or do.

## Practical rules for writers and developers

- Don't change keys, placeholders (`${name}`, `{n}`) or data structures when editing text. Only the words.
- Watch template seams. If a sentence is assembled from pieces (`U.brightest + name + U.befriend`), read the result out loud with real values. Spaces and punctuation at the edges of fragments matter.
- UI labels stay roughly the same length so layouts don't break.
- Macedonian lives in `src/content/mk`. It mirrors the English structure key by key. Change values there, never keys.

## The checker

`npm run check:copy` (also part of `npm test`, via `tests/copy.test.ts`) scans string literals, template text and JSX text in `src/**/*.ts(x)`. It skips Macedonian files, any string containing Cyrillic, code comments and attribute names like `className`. It fails on dashes and on the banned list in `scripts/check-copy.mjs` (`RULES`).

For a deliberate exception (a quotation, a proper name), put `copy-ok` in a comment on the same line and say why.
