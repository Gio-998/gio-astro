# Horoscop

Astrology + psychology self-discovery and compatibility app. Zero running cost: static export, all calculations in the browser, data in localStorage.

## Commands
- `npm run dev` — dev server
- `npm test` — engine + content tests (vitest)
- `npm run build:export` — static site into `out/` (uses `.next-export/` so it can run next to `next dev`). Deploy `out/` to Cloudflare Pages.
- `npm run calibrate` — regenerate `src/engine/calibration.json` (Monte-Carlo percentile tables for compatibility scores)
- `npm run cities -- /path/to/geonames` — rebuild `public/data/cities.json` from GeoNames cities15000

Set `NEXT_PUBLIC_SITE_URL` at build time for sitemap/canonical URLs.

## Layout
- `src/engine/` — pure TS: astro (astronomy-engine), time zones (luxon), Vedic + Guna Milan, Chinese (lunar-javascript), numerology, tarot, Big Five (Mini-IPIP), own quizzes (attachment, nine motivations, care, shadow, dosha, explorer/stance), bond check, profile, compatibility (Harmony/Spark/Resonance), daily guidance
- `src/content/<locale>/` — every user-facing interpretation text; add `pl/` with the same shape and register it in `src/content/index.ts`
- `src/lib/` — localStorage repository (swap for Supabase later), city search, share cards (canvas), quiz definitions, payment placeholders
- `src/app/[lang]/` — routes; `src/components/` — UI

Licences: astronomy-engine, lunar-javascript, luxon — MIT. IPIP items — public domain. GeoNames — CC BY 4.0 (attributed in footer).
