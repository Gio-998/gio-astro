# Horoscop store app (iOS + Android)

The store app is a Capacitor shell around a **slim static export** of this same codebase. The website build is unchanged.

| | Website | Store app |
|---|---|---|
| Command | `npm run build` → `out/` (Vercel) | `npm run build:app` → `out-app/` (packed into the app) |
| `@/app-mode` resolves to | `src/app-mode/index.ts` (inert stubs) | `src/app-mode/native.tsx` (`APP_EXPORT=1` alias in `next.config.ts`) |
| Daily sign pages | prerendered per date + dated archive | computed **on the device** for its own today (Europe/Skopje), plus the 14 days before it via `?d=YYYY-MM-DD` |
| Navigation | header menu + `TabBar` + footer | app tabs: Today · Horoscope · Tests · Bonds · Profile; no footer, no desktop menu |

App id / package: `si.horoscop.app` · display name: `Horoscop` · web content: `out-app/`.

## What is in `out-app/`

Routes listed in `src/app-mode/routes.ts` (`APP_SECTIONS`): Today, daily, sign pages (today + last 14 days, on device), profile/people/bonds, tests and games,
calculators (rising sign / moon sign / birth chart), account + auth callback + reset, privacy, terms, how it works, learn, promise.

Left out (deleted by `scripts/build-app.mjs`): the dated horoscope archive, blog, admin, partners, **pricing / premium / upgrade / checkout**,
weekly/monthly/2027/moon calendar/retrograde/numerology/sign pages/compatibility (SEO sections written for one build date), sitemaps, robots, share images,
`_redirects`, `.well-known`. A tap on a link to a page the app does not ship opens it on horoscop.si in the system browser
(`NativeBoot` in `src/app-mode/native.tsx`). Links to payment pages never open (store rules).

## Build locally

Requirements: Node 24 (the build script imports TypeScript files directly), npm. Android: JDK 21 + Android SDK (platform 36). iOS: a Mac with Xcode, or Codemagic (below).

```bash
npm ci
npm run build:app          # slim export → out-app/  (if a website out/ exists it is parked and restored)
npx cap sync               # copies out-app/ into android/ and ios/, updates native plugins
cd android && ./gradlew assembleDebug    # → android/app/build/outputs/apk/debug/app-debug.apk
```

Optional build-time flags (all public, set in the shell or in the Codemagic group `horoscop_public`):

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Accounts. Without them the app runs local-only. Only the public anon key, never a service-role / secret key. |
| `NEXT_PUBLIC_APPLE_AUTH=1` | Shows "Sign in with Apple" (only after the Apple provider is configured, see checklist). |
| `NEXT_PUBLIC_GOOGLE_AUTH=1` | Shows "Continue with Google" (only after the Google provider is configured). |

## Native features

- **Offline**: every text is computed on the device (`lib/horoscope` `reading()` + `astronomy-engine`); no network is needed. `src/app-mode/horo-cache.ts`
  keeps summaries of loaded/computed horoscopes for 14 days (localStorage `horoscop:cache:v1`) for the widget and reminders.
- **Morning reminder** (Profile tab → "Morning horoscope"): **local** scheduled notifications (`src/app-mode/reminders.ts`), no server and no push keys.
  The next 7 mornings are scheduled, each with that day's own headline; rescheduled on every start/resume.
- **Widget** (`src/app-mode/widget.ts` → `WidgetBridge` plugin): the app writes a JSON snapshot for today + 6 days.
  - Android: `HoroscopWidgetProvider` + `WidgetBridgePlugin` (in `android/app/src/main/java/si/horoscop/app/`), registered in `MainActivity`. Built and tested.
  - iOS: `WidgetBridgePlugin.swift` (registered in `MainViewController.swift`) writes to the App Group `group.si.horoscop.app`.
    The WidgetKit extension sources are in `ios/App/HoroscopWidget/`. The extension **target** is added by `ios/scripts/add_widget_target.rb`,
    which Codemagic runs only when `IOS_WIDGET=1`. It is not in the committed Xcode project because the App Group must first exist in the Apple Developer
    account and be enabled on both identifiers, otherwise signing of the whole app fails. (It could not be compiled here: no Mac.)
- **Deep links**: `public/.well-known/apple-app-site-association` and `public/.well-known/assetlinks.json` are served by the website
  (`vercel.json` sets `Content-Type: application/json` for the AASA file). They contain placeholders: `APPLE_TEAM_ID` and the two SHA-256 fingerprints.
  Android intent filters (`autoVerify`) and iOS Associated Domains (`ios/App/App/App.entitlements`) cover today, sign pages, account, auth callback, reset,
  invite and challenge. Custom scheme fallback: `si.horoscop.app://`.
- **Sign-in**: email (password, link, 6-digit code) as before. In the app, links in sign-in emails point at `https://horoscop.si/<lang>/auth/callback/`, which
  opens the app once App Links / Universal Links are verified (until then the 6-digit code works inside the app).
  - **Sign in with Apple** (`NEXT_PUBLIC_APPLE_AUTH=1`): iOS uses the system sheet + `signInWithIdToken` (nonce-protected). Android and the website use the
    provider page in the system browser and return through the auth callback.
  - **Google** (`NEXT_PUBLIC_GOOGLE_AUTH=1`): in the app it opens in the system browser (Google blocks embedded web views) and returns through the App Link.
    **Next step (not implemented):** a native Google id-token flow (Credential Manager on Android, Google Sign-In on iOS) + `signInWithIdToken`, which
    needs Android/iOS OAuth client IDs added to the Google provider in Supabase.
- **Payments**: none in the app. `purchaseChannel()` in `@/app-mode` is `"web"` on the website and `"none"` in the app; the admin demo checkout, "see plans"
  and premium links are hidden when it is not `"web"`, and NativeBoot blocks any pricing/premium/upgrade link or known payment host.
  Later plan (owner decision): Apple StoreKit and Google Play Billing directly (no third-party subscription service), a "Duo" plan, 7-day free trial,
  one-time reports as in-app purchases, store prices higher than web. That will plug in behind `purchaseChannel()` returning `"store"`; the server keeps
  writing `entitlements` with its own key, never from the app.
- **Account deletion** stays in Account (store requirement). It also clears the app cache, widget snapshot and scheduled reminders.
  The edge function `delete-account` now allows the app origins `capacitor://localhost`, `https://localhost`, `http://localhost` in the repo source;
  **it must be deployed** for this to work from the app.
- **Icons and splash**: masters in `resources/` (from the site's crescent-and-star logo, 1024 px icon without alpha, 2732 px splash).
  Regenerate with `npx @capacitor/assets@4 generate --iconBackgroundColor '#0e0b26' --splashBackgroundColor '#0e0b26' --iconBackgroundColorDark '#0e0b26' --splashBackgroundColorDark '#0e0b26'`
  (then delete the `icons/` folder and `public/manifest.webmanifest` it also writes; the website does not use them).

## Codemagic (cloud builds, no Mac)

`codemagic.yaml` (repo root) has three manually started workflows: `ios-testflight`, `android-play-internal`, `android-debug`. It contains no secrets, only
names of things created in the Codemagic UI. Publishing stops at TestFlight / Play internal testing; store review submission is manual.

## Owner checklist

Nothing below has been done for you: no accounts were created and nothing was paid or deployed.

**Apple**
1. Apple Developer Program membership (99 USD/year), on the legal entity that will sell the app.
2. Note the **Team ID** (Membership details). Replace `APPLE_TEAM_ID` in `public/.well-known/apple-app-site-association` (both places).
3. Certificates, Identifiers & Profiles → Identifiers → App ID `si.horoscop.app` with capabilities **Sign In with Apple** and **Associated Domains**
   (and **App Groups** → `group.si.horoscop.app` when the widget is switched on; then also an App ID `si.horoscop.app.HoroscopWidget` with the same App Group).
4. App Store Connect → Users and Access → Integrations → **App Store Connect API key** (role App Manager). Keep the `.p8` file, Key ID and Issuer ID private.
5. App Store Connect → My Apps → new app with bundle id `si.horoscop.app`; put its numeric **Apple ID** into `APP_STORE_APPLE_ID` in `codemagic.yaml`.
6. Sign in with Apple for the web/Android flow: an Apple **Services ID** (e.g. `si.horoscop.web`) with return URL `https://gxuqmuvpoiwugtmsfhnt.supabase.co/auth/v1/callback`,
   and a Sign in with Apple **key** (`.p8`, Key ID).

**Supabase (project gio-astro)**
7. Authentication → Providers → **Apple**: enable; Client IDs = `si.horoscop.app` (native iOS) and the Services ID; secret from Team ID + Key ID + `.p8`
   (the Apple web secret expires every 6 months and must be renewed).
8. Authentication → URL Configuration → Redirect URLs: add `https://horoscop.si/*/auth/callback/**`, `https://horoscop.si/*/reset/**`,
   `capacitor://localhost/**`, `https://localhost/**`, `si.horoscop.app://**`.
9. Deploy the edge function: `supabase functions deploy delete-account --project-ref gxuqmuvpoiwugtmsfhnt` (adds the app origins to CORS).
10. If captcha is ever switched on for sign-in: the captcha widget is not expected to work inside the app (`capacitor://localhost`); keep it off or add an app-specific path first.
11. Google in the app (optional): Google provider + `NEXT_PUBLIC_GOOGLE_AUTH=1`; for the native id-token flow later, Android and iOS OAuth client IDs.

**Google Play**
12. Play Console developer account (25 USD once). New personal accounts need a closed test with 12 testers for 14 days before production.
13. Create an **upload keystore** and back it up (file, passwords, alias), e.g.
    `keytool -genkeypair -v -keystore horoscop-upload.jks -alias horoscop -keyalg RSA -keysize 2048 -validity 10000`. Never commit it.
14. Create the app `si.horoscop.app`, enable **Play App Signing**, then copy the **SHA-256** of the app signing key (Play Console → App integrity) and of the
    upload key into `public/.well-known/assetlinks.json`.
15. Google Cloud service account with Play Console access (release to testing tracks); download its JSON key.

**Codemagic**
16. Personal Codemagic account; connect the GitHub repo `Gio-998/gio-astro`.
17. Integrations → Developer Portal → add the App Store Connect API key under the name **`Horoscop ASC`**.
18. Code signing identities → iOS: generate/fetch the App Store distribution certificate and the App Store profile for `si.horoscop.app`
    (and `si.horoscop.app.HoroscopWidget` when the widget is on).
19. Code signing identities → Android keystores: upload the keystore under the reference name **`horoscop_upload`**.
20. Environment variables: group **`horoscop_public`** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, optionally `NEXT_PUBLIC_APPLE_AUTH=1`,
    `NEXT_PUBLIC_GOOGLE_AUTH=1`) and group **`google_play`** (`GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` = the service account JSON, marked secure).
21. Start `android-debug` first, then `ios-testflight` and `android-play-internal`. When the App Group is ready, set `IOS_WIDGET` to `"1"` in `codemagic.yaml`.

**Before release**: deploy the website with the `.well-known` files (merge of this branch), store listings (privacy policy URL, support URL,
screenshots, data-safety / privacy labels), and submit for review only after explicit approval.
